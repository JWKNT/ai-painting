// The studio: what a painting script talks to.
//
//   const studio = require('../../lib/studio');
//   const p = studio.open(__dirname, { pass: '01-ground', size: [1600, 1200], background: '#f3eee3' });
//   p.stroke({ brush: 'bristle', color: '#27496d', width: 40, points: [[100, 200], [700, 260]] });
//   p.save();
//
// A painting is built in passes. Each pass appends strokes to the recording; earlier passes
// are never edited, only painted over. Re-running the latest pass replaces it (an undo).
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PE = require('../engine/paint-engine.js');
const kit = require('./kit');
const { encodePNG } = require('./png');
const { buildPlayer, serialize } = require('./build-player');

function load(target) {
  const file = fs.existsSync(target) && fs.statSync(target).isDirectory() ? path.join(target, 'painting.json') : target;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (data.format !== PE.FORMAT) throw new Error(`${file}: unknown format "${data.format}"`);
  return data;
}

// Render a recording from nothing, optionally stopping after `upto` strokes.
function render(data, upto) {
  const eng = new PE.Engine(data.width, data.height, data.background, data.brushes);
  const n = upto == null ? data.strokes.length : Math.min(upto, data.strokes.length);
  for (let i = 0; i < n; i++) eng.stroke(data.strokes[i]);
  return eng;
}

// ---- canvas cache, so a new pass does not have to repaint every earlier one first

const ENGINE_ID = crypto.createHash('sha1').update(fs.readFileSync(require.resolve('../engine/paint-engine.js'))).digest('hex');

function stateHash(data, count) {
  const h = crypto.createHash('sha1');
  h.update(JSON.stringify([ENGINE_ID, data.width, data.height, data.background, data.brushes]));
  for (let i = 0; i < count; i++) h.update(JSON.stringify(data.strokes[i]));
  return h.digest('hex').slice(0, 16);
}

function cacheFile(dir, data, count) {
  return path.join(dir, '.cache', `${count}-${stateHash(data, count)}.f32`);
}

function writeCache(dir, data, eng, count) {
  const file = cacheFile(dir, data, count);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, Buffer.from(eng.canvas.buffer, eng.canvas.byteOffset, eng.canvas.byteLength));
  return file;
}

// Bring a fresh engine to the state after `count` strokes, from the nearest cached canvas.
function restoreTo(dir, data, eng, count) {
  const cdir = path.join(dir, '.cache');
  let from = 0;
  if (count > 0 && fs.existsSync(cdir)) {
    const have = fs.readdirSync(cdir)
      .map((f) => /^(\d+)-[0-9a-f]+\.f32$/.exec(f))
      .filter(Boolean)
      .map((m) => +m[1])
      .filter((c) => c > 0 && c <= count)
      .sort((a, b) => b - a);
    for (const c of have) {
      const file = cacheFile(dir, data, c);
      if (!fs.existsSync(file)) continue;
      const buf = fs.readFileSync(file);
      if (buf.byteLength !== eng.canvas.byteLength) continue;
      buf.copy(Buffer.from(eng.canvas.buffer, eng.canvas.byteOffset, eng.canvas.byteLength));
      from = c;
      break;
    }
  }
  for (let i = from; i < count; i++) eng.stroke(data.strokes[i]);
  eng.count = count;
}

// ---- the painting

class Painting {
  constructor(dir, data, engine, pass) {
    this.dir = dir;
    this.data = data;
    this.engine = engine;
    this.pass = pass;
    this.rng = kit.rng(pass.name);
    this.keep = [];
    this.started = Date.now();
  }

  get width() { return this.data.width; }
  get height() { return this.data.height; }
  get count() { return this.data.strokes.length; }

  // Paint one stroke. Throws a RuleError if it breaks the rules of the medium.
  stroke(input) {
    const index = this.data.strokes.length;
    const rec = PE.normalize(input, index, this.data.brushes);
    try {
      this.engine.stroke(rec);
    } catch (err) {
      if (err instanceof PE.RuleError) err.message = `stroke ${index}: ${err.message}`;
      throw err;
    }
    this.data.strokes.push(rec);
    return this;
  }

  // Paint the stroke only if it travels far enough for its width; returns whether it did.
  tryStroke(input) {
    const rec = PE.normalize(input, this.data.strokes.length, this.data.brushes);
    const m = PE.measure(rec);
    if (m.span < m.required) return false;
    this.engine.stroke(rec);
    this.data.strokes.push(rec);
    return true;
  }

  // Start the next pass without leaving the script.
  next(name) {
    if (this.data.passes.some((p) => p.name === name)) throw new Error(`pass "${name}" already exists`);
    this.pass = { name, start: this.data.strokes.length };
    this.data.passes.push(this.pass);
    this.rng = kit.rng(name);
    return this;
  }

  line(x1, y1, x2, y2, opts) {
    return this.stroke({ ...opts, points: [[x1, y1], [x2, y2]] });
  }

  // The color currently on the canvas at a point, as hex.
  sample(x, y) {
    return kit.hex(this.engine.sample(x, y));
  }

  // Cover a region with many strokes that follow a direction.
  //   inside   (x, y) => boolean, the region (default: everywhere in bounds)
  //   bounds   [x0, y0, x1, y1]
  //   angle    radians, or (x, y) => radians: the way the strokes run
  //   width    px, or (x, y) => px
  //   length   target stroke length in px
  //   color    hex, or (x, y) => hex
  //   spacing  distance between neighboring strokes, in widths (default 0.6)
  //   overlap  distance between strokes end to end, as a fraction of length (default 0.6)
  //   scatter  0..1, how far strokes stray from an even grid (default 1)
  //   order    'scan' (top to bottom) or 'random'
  //   stroke   other stroke options: brush, opacity, mix, ...
  //   each     (stroke, x, y) => void, a last chance to adjust each stroke
  // Returns the number of strokes painted. Strokes too short for their width are left out.
  fill(o) {
    const rnd = o.rng || this.rng;
    const [bx0, by0, bx1, by1] = o.bounds || [0, 0, this.width, this.height];
    const inside = o.inside || (() => true);
    const widthAt = typeof o.width === 'function' ? o.width : () => o.width;
    const colorAt = typeof o.color === 'function' ? o.color : () => o.color;
    const angleAt = typeof o.angle === 'function' ? o.angle : () => o.angle || 0;
    const w0 = widthAt((bx0 + bx1) / 2, (by0 + by1) / 2);
    const length = o.length || w0 * 5;
    const spacing = o.spacing != null ? o.spacing : 0.6;
    const overlap = o.overlap != null ? o.overlap : 0.6;
    const scatter = o.scatter != null ? o.scatter : 1;
    const cell = Math.sqrt(w0 * spacing * length * overlap);
    const step = Math.max(3, Math.min(20, length / 8));

    const seeds = [];
    for (let y = by0 + cell / 2; y < by1 + cell / 2; y += cell) {
      for (let x = bx0 + cell / 2; x < bx1 + cell / 2; x += cell) {
        const sx = x + (rnd() - 0.5) * cell * scatter, sy = y + (rnd() - 0.5) * cell * scatter;
        if (sx >= bx0 && sx <= bx1 && sy >= by0 && sy <= by1 && inside(sx, sy)) seeds.push([sx, sy]);
      }
    }
    if (o.order === 'random') rnd.shuffle(seeds);

    let painted = 0;
    for (const [sx, sy] of seeds) {
      const half = length / 2 * (0.8 + 0.4 * rnd());
      const pts = [[sx, sy]];
      for (const dir of [1, -1]) {
        let x = sx, y = sy;
        for (let d = 0; d < half; d += step) {
          const a = angleAt(x, y);
          const nx = x + Math.cos(a) * step * dir, ny = y + Math.sin(a) * step * dir;
          if (!inside(nx, ny)) break;
          x = nx; y = ny;
          if (dir === 1) pts.push([x, y]); else pts.unshift([x, y]);
        }
      }
      if (pts.length < 2) continue;
      const s = { ...(o.stroke || {}), color: colorAt(sx, sy), width: widthAt(sx, sy), points: pts };
      if (o.each) o.each(s, sx, sy);
      if (this.tryStroke(s)) painted++;
    }
    return painted;
  }

  // Write the recording, the image and the playback page.
  save() {
    const { dir, data, engine } = this;
    fs.writeFileSync(path.join(dir, 'painting.json'), serialize(data));
    fs.writeFileSync(path.join(dir, 'painting.png'), encodePNG(data.width, data.height, engine.snapshot()));
    buildPlayer(dir, data);

    this.keep.push(writeCache(dir, data, engine, data.strokes.length));
    const cdir = path.join(dir, '.cache');
    for (const f of fs.readdirSync(cdir)) {
      if (!this.keep.includes(path.join(cdir, f))) fs.unlinkSync(path.join(cdir, f));
    }

    const added = data.strokes.length - this.pass.start;
    const secs = ((Date.now() - this.started) / 1000).toFixed(1);
    console.log(`${path.basename(dir)} · pass "${this.pass.name}": ${added} strokes (${data.strokes.length} total) in ${secs}s`);
    return this;
  }
}

// Open a painting folder for a pass.
//   pass        name of this pass (required). A new name appends a pass; the name of the
//               latest pass repaints it; an earlier name needs rewind: true and discards
//               everything after it.
//   fresh       true to start the painting over from a blank canvas
//   size        [width, height] of a new painting (default 1600 x 1200)
//   background  starting canvas color of a new painting
//   title       shown in the playback tab
function open(dir, opts = {}) {
  if (!opts.pass) throw new Error('open(dir, { pass }) needs a pass name');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'painting.json');
  let data = fs.existsSync(file) && !opts.fresh ? load(file) : null;

  const at = data ? data.passes.findIndex((p) => p.name === opts.pass) : -1;
  if (data && at >= 0 && at !== data.passes.length - 1 && !opts.rewind) {
    throw new Error(`pass "${opts.pass}" is not the latest pass; paintings are append-only. Pass rewind: true to discard the passes after it.`);
  }

  if (!data || at === 0) {
    const size = opts.size || (data ? [data.width, data.height] : [1600, 1200]);
    data = {
      format: PE.FORMAT,
      title: opts.title || (data && data.title) || path.basename(dir),
      width: size[0],
      height: size[1],
      background: opts.background || (data && data.background) || '#f3eee3',
      rules: { ...PE.RULES },
      brushes: JSON.parse(JSON.stringify(PE.BRUSHES)),
      passes: [{ name: opts.pass, start: 0 }],
      strokes: [],
    };
  } else if (at > 0) {
    data.strokes.length = data.passes[at].start;
    data.passes.length = at + 1;
  } else {
    data.passes.push({ name: opts.pass, start: data.strokes.length });
  }
  if (opts.title) data.title = opts.title;

  const pass = data.passes[data.passes.length - 1];
  const engine = new PE.Engine(data.width, data.height, data.background, data.brushes);
  restoreTo(dir, data, engine, pass.start);
  const painting = new Painting(dir, data, engine, pass);
  if (pass.start > 0) painting.keep.push(writeCache(dir, data, engine, pass.start));
  return painting;
}

module.exports = { open, load, render, kit, RULES: PE.RULES, BRUSHES: PE.BRUSHES, RuleError: PE.RuleError, ...kit };
