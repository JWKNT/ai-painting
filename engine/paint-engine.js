/*
 * paint-engine.js — the brush engine.
 *
 * One file, no dependencies. It runs unchanged in Node (rendering to PNG) and in the
 * browser (playback), so what you watch is the same computation that made the image.
 *
 * A painting is an ordered list of strokes on a flat-colored canvas. Nothing reaches
 * the canvas any other way.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PaintEngine = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const FORMAT = 'ai-painting/1';

  // The rules of the medium. Every stroke is checked against these before it touches the canvas.
  const RULES = {
    maxSide: 1600,      // px. Canvas long side; fixes the scale the other numbers mean something against.
    minWidth: 4,        // px. Brush width measured at half strength, so a soft brush cannot sneak under it.
    minTravel: 12,      // px. The brush tip must span at least this far...
    travelPerWidth: 2,  // ...and at least this many of its own widths. No stamping.
  };

  // Brush presets. Every field can be overridden per stroke.
  //   hardness  1 = crisp edge, 0 = airbrush falloff from the center
  //   streak    visible bristle lanes (thin, translucent tracks along the stroke)
  //   jitter    color variation between bristles
  //   mix       how much wet color the brush drags along from the canvas (1 = pure smudge, no paint)
  //   dry       paint only catches the grain of the canvas
  //   load      how many brush-widths the paint lasts before running out (0 = never runs out)
  //   rag       ragged stroke ends, as a fraction of the width
  //   wobble    width unsteadiness along the stroke
  //   pool      pigment gathering at the stroke edge, as in watercolor
  //   cap       'round' or 'flat' stroke ends
  const BRUSHES = {
    round:   { hardness: 1,    streak: 0,    jitter: 0,    mix: 0,    dry: 0,    load: 0,  rag: 0,    wobble: 0,    pool: 0,   cap: 'round', opacity: 1 },
    soft:    { hardness: 0,    streak: 0,    jitter: 0,    mix: 0,    dry: 0,    load: 0,  rag: 0,    wobble: 0,    pool: 0,   cap: 'round', opacity: 1 },
    flat:    { hardness: 1,    streak: 0.16, jitter: 0.35, mix: 0.06, dry: 0.1,  load: 0,  rag: 0.1,  wobble: 0.02, pool: 0,   cap: 'flat',  opacity: 1 },
    bristle: { hardness: 0.92, streak: 0.32, jitter: 0.6,  mix: 0.22, dry: 0.15, load: 0,  rag: 0.3,  wobble: 0.05, pool: 0,   cap: 'flat',  opacity: 1 },
    dry:     { hardness: 1,    streak: 0.5,  jitter: 0.5,  mix: 0,    dry: 0.95, load: 30, rag: 0.6,  wobble: 0.06, pool: 0,   cap: 'flat',  opacity: 1 },
    wash:    { hardness: 0.7,  streak: 0.08, jitter: 0.15, mix: 0.08, dry: 0,    load: 0,  rag: 0,    wobble: 0.04, pool: 0.5, cap: 'round', opacity: 0.45 },
    blend:   { hardness: 0.4,  streak: 0,    jitter: 0,    mix: 1,    dry: 0,    load: 0,  rag: 0,    wobble: 0,    pool: 0,   cap: 'round', opacity: 1 },
  };

  const OPTION_KEYS = ['hardness', 'streak', 'jitter', 'mix', 'dry', 'load', 'rag', 'wobble', 'pool'];

  class RuleError extends Error {
    constructor(message) { super(message); this.name = 'RuleError'; }
  }

  // ---------------------------------------------------------------- small utilities

  function rng32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function roundTo(v, places) {
    const m = Math.pow(10, places);
    return Math.round(v * m) / m;
  }

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function parseHex(value, where) {
    let h = String(value).trim().toLowerCase();
    if (/^#[0-9a-f]{3}$/.test(h)) h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
    if (!/^#[0-9a-f]{6}$/.test(h)) throw new RuleError(`${where}: "${value}" is not a hex color`);
    return h;
  }

  function hexToRgb(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }

  // 1D value noise over a 64-entry table.
  function noise1(nz, x) {
    const i = Math.floor(x);
    let f = x - i;
    f = f * f * (3 - 2 * f);
    const a = nz[i & 63], b = nz[(i + 1) & 63];
    return a + (b - a) * f;
  }

  // ---------------------------------------------------------------- stroke records

  // Turn whatever the painter wrote into the exact record that is rendered and saved.
  // Numbers are rounded here, before rendering, so a replay sees precisely what the painter's canvas saw.
  function normalize(input, index, brushes) {
    brushes = brushes || BRUSHES;
    const where = `stroke ${index}`;
    const brush = input.brush || 'round';
    const preset = brushes[brush];
    if (!preset) throw new RuleError(`${where}: unknown brush "${brush}"`);

    const rec = { brush };
    const mix = input.mix != null ? +input.mix : preset.mix;
    if (input.color == null) {
      if (mix < 1) throw new RuleError(`${where}: a color is required (only a pure blending stroke, mix 1, carries no paint)`);
      rec.color = '#000000';
    } else {
      rec.color = parseHex(input.color, where);
    }

    rec.width = roundTo(+input.width, 2);
    rec.opacity = roundTo(input.opacity != null ? +input.opacity : preset.opacity, 3);

    let pts, pr = null;
    if (input.pts) {
      pts = Array.from(input.pts, (v) => roundTo(+v, 1));
      if (input.pr) pr = Array.from(input.pr, (v) => roundTo(clamp(+v, 0, 1), 2));
    } else {
      const src = input.points || [];
      pts = [];
      const prs = [];
      let varied = false;
      for (const q of src) {
        const isArr = Array.isArray(q);
        const x = isArr ? q[0] : q.x, y = isArr ? q[1] : q.y, p = isArr ? q[2] : q.p;
        pts.push(roundTo(+x, 1), roundTo(+y, 1));
        const pv = p == null ? 1 : roundTo(clamp(+p, 0, 1), 2);
        if (pv !== 1) varied = true;
        prs.push(pv);
      }
      if (varied) pr = prs;
    }
    rec.pts = pts;
    if (pr) rec.pr = pr;

    for (const k of OPTION_KEYS) {
      if (input[k] != null) rec[k] = roundTo(clamp(+input[k], 0, k === 'load' ? 1e6 : 1), 3);
    }
    if (input.cap != null) {
      if (input.cap !== 'round' && input.cap !== 'flat') throw new RuleError(`${where}: cap must be "round" or "flat"`);
      rec.cap = input.cap;
    }
    if (input.taper != null) {
      const t = Array.isArray(input.taper) ? input.taper : [input.taper, input.taper];
      rec.taper = [roundTo(clamp(+t[0], 0, 1), 3), roundTo(clamp(+t[1], 0, 1), 3)];
    }
    if (input.smooth === false) rec.smooth = false;
    rec.seed = input.seed != null ? (input.seed >>> 0) : (Math.imul(index + 1, 2654435761) >>> 0);

    // Rules that need no geometry.
    if (!(rec.width > 0) || !isFinite(rec.width)) throw new RuleError(`${where}: width must be a positive number`);
    const hardness = rec.hardness != null ? rec.hardness : preset.hardness;
    const half = rec.width * (1 + hardness) / 2;
    if (half < RULES.minWidth - 1e-9) {
      throw new RuleError(`${where}: brush is ${roundTo(half, 2)}px wide at half strength (width ${rec.width}, hardness ${hardness}); the minimum is ${RULES.minWidth}px`);
    }
    if (!(rec.opacity > 0 && rec.opacity <= 1)) throw new RuleError(`${where}: opacity must be in (0, 1]`);
    if (pts.length < 4 || pts.length % 2) throw new RuleError(`${where}: a stroke needs at least two points`);
    for (const v of pts) if (!isFinite(v)) throw new RuleError(`${where}: point coordinates must be finite numbers`);
    if (pr && pr.length !== pts.length / 2) throw new RuleError(`${where}: one pressure value per point`);
    return rec;
  }

  function resolve(rec, brushes) {
    const preset = (brushes || BRUSHES)[rec.brush];
    if (!preset) throw new RuleError(`unknown brush "${rec.brush}"`);
    const P = {};
    for (const k of OPTION_KEYS) P[k] = rec[k] != null ? rec[k] : preset[k];
    P.cap = rec.cap || preset.cap;
    P.taper = rec.taper || [0, 0];
    P.smooth = rec.smooth !== false;
    return P;
  }

  // ---------------------------------------------------------------- path geometry

  // The path the brush tip actually follows: a centripetal Catmull-Rom spline through the
  // control points (or the plain polyline when smooth is off), as a dense polyline.
  function densePath(pts, pr, smooth) {
    const X = [], Y = [], Q = [];
    for (let i = 0; i < pts.length; i += 2) {
      const x = pts[i], y = pts[i + 1];
      const n = X.length;
      if (n && Math.abs(x - X[n - 1]) < 1e-6 && Math.abs(y - Y[n - 1]) < 1e-6) continue;
      X.push(x); Y.push(y); Q.push(pr ? pr[i >> 1] : 1);
    }
    const n = X.length;
    if (n < 2) return null;

    let ox, oy, oq;
    if (!smooth || n < 3) {
      ox = X; oy = Y; oq = Q;
    } else {
      ox = [X[0]]; oy = [Y[0]]; oq = [Q[0]];
      for (let i = 0; i < n - 1; i++) {
        const x1 = X[i], y1 = Y[i], x2 = X[i + 1], y2 = Y[i + 1];
        const x0 = i > 0 ? X[i - 1] : 2 * x1 - x2, y0 = i > 0 ? Y[i - 1] : 2 * y1 - y2;
        const x3 = i + 2 < n ? X[i + 2] : 2 * x2 - x1, y3 = i + 2 < n ? Y[i + 2] : 2 * y2 - y1;
        const d12 = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        const t1 = Math.sqrt(Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)));
        const t2 = t1 + Math.sqrt(d12);
        const t3 = t2 + Math.sqrt(Math.sqrt((x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2)));
        const steps = Math.max(1, Math.min(256, Math.ceil(d12 / 2)));
        for (let k = 1; k <= steps; k++) {
          const f = k / steps, t = t1 + (t2 - t1) * f;
          const a1 = (t1 - t) / t1, b1 = t / t1;
          const a2 = (t2 - t) / (t2 - t1), b2 = (t - t1) / (t2 - t1);
          const a3 = (t3 - t) / (t3 - t2), b3 = (t - t2) / (t3 - t2);
          const c1 = (t2 - t) / t2, e1 = t / t2;
          const c2 = (t3 - t) / (t3 - t1), e2 = (t - t1) / (t3 - t1);
          const A1x = a1 * x0 + b1 * x1, A1y = a1 * y0 + b1 * y1;
          const A2x = a2 * x1 + b2 * x2, A2y = a2 * y1 + b2 * y2;
          const A3x = a3 * x2 + b3 * x3, A3y = a3 * y2 + b3 * y3;
          const B1x = c1 * A1x + e1 * A2x, B1y = c1 * A1y + e1 * A2y;
          const B2x = c2 * A2x + e2 * A3x, B2y = c2 * A2y + e2 * A3y;
          ox.push(a2 * B1x + b2 * B2x);
          oy.push(a2 * B1y + b2 * B2y);
          oq.push(Q[i] + (Q[i + 1] - Q[i]) * f);
        }
      }
    }

    const m = ox.length;
    const cum = new Float64Array(m);
    for (let i = 1; i < m; i++) {
      const dx = ox[i] - ox[i - 1], dy = oy[i] - oy[i - 1];
      cum[i] = cum[i - 1] + Math.sqrt(dx * dx + dy * dy);
    }

    // Span: how far apart the path's two most distant points are (farthest-from-start,
    // then farthest-from-that; never more than the true diameter, so the check errs strict).
    let far = 0, best = 0;
    for (let i = 1; i < m; i++) {
      const dx = ox[i] - ox[0], dy = oy[i] - oy[0], d = dx * dx + dy * dy;
      if (d > best) { best = d; far = i; }
    }
    let best2 = 0;
    for (let i = 0; i < m; i++) {
      const dx = ox[i] - ox[far], dy = oy[i] - oy[far], d = dx * dx + dy * dy;
      if (d > best2) best2 = d;
    }

    return { x: ox, y: oy, q: oq, cum, length: cum[m - 1], span: Math.sqrt(best2) };
  }

  function requiredSpan(width) {
    return Math.max(RULES.minTravel, RULES.travelPerWidth * width);
  }

  // Length and span of a stroke's path, and the span the rules demand of it.
  function measure(rec) {
    const path = densePath(rec.pts, rec.pr, rec.smooth !== false);
    if (!path) return { length: 0, span: 0, required: requiredSpan(rec.width) };
    return { length: path.length, span: path.span, required: requiredSpan(rec.width) };
  }

  function checkTravel(rec, path) {
    const need = requiredSpan(rec.width);
    const span = path ? path.span : 0;
    if (span < need - 1e-9) {
      throw new RuleError(`a ${rec.width}px brush must travel at least ${need}px; this stroke spans ${roundTo(span, 2)}px`);
    }
  }

  // ---------------------------------------------------------------- canvas grain

  // The tooth of the canvas: a fixed field of values spread evenly over 0..1 that dry
  // paint catches on. It is the same for every painting, so replays agree with renders.
  function makeGrain(w, h) {
    const n = w * h, rnd = rng32(0x51ed270b);
    const a = new Float32Array(n), t = new Float32Array(n);
    for (let i = 0; i < n; i++) a[i] = rnd();
    for (let y = 0; y < h; y++) {
      const o = y * w;
      for (let x = 0; x < w; x++) {
        const l = x > 0 ? x - 1 : x, r = x < w - 1 ? x + 1 : x;
        t[o + x] = (a[o + l] + a[o + x] + a[o + r]) / 3;
      }
    }
    for (let y = 0; y < h; y++) {
      const o = y * w, up = (y > 0 ? y - 1 : y) * w, dn = (y < h - 1 ? y + 1 : y) * w;
      for (let x = 0; x < w; x++) a[o + x] = (t[up + x] + t[o + x] + t[dn + x]) / 3;
    }
    // A coarser layer so the grain clumps a little.
    const cell = 7, gw = Math.ceil(w / cell) + 2, gh = Math.ceil(h / cell) + 2;
    const lat = new Float32Array(gw * gh);
    for (let i = 0; i < lat.length; i++) lat[i] = rnd();
    let lo = Infinity, hi = -Infinity;
    for (let y = 0; y < h; y++) {
      const gy = y / cell, y0 = Math.floor(gy), fy = gy - y0;
      for (let x = 0; x < w; x++) {
        const gx = x / cell, x0 = Math.floor(gx), fx = gx - x0;
        const b = y0 * gw + x0;
        const top = lat[b] + (lat[b + 1] - lat[b]) * fx;
        const bot = lat[b + gw] + (lat[b + gw + 1] - lat[b + gw]) * fx;
        const v = a[y * w + x] + 0.22 * (top + (bot - top) * fy);
        a[y * w + x] = v;
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
    }
    // Equalize so that "paint covers a fraction c of the grain" means what it says.
    const bins = 4096, hist = new Uint32Array(bins), scale = (bins - 1) / (hi - lo);
    for (let i = 0; i < n; i++) hist[((a[i] - lo) * scale) | 0]++;
    const cdf = new Float32Array(bins);
    let acc = 0;
    for (let i = 0; i < bins; i++) { acc += hist[i]; cdf[i] = acc / n; }
    for (let i = 0; i < n; i++) a[i] = cdf[((a[i] - lo) * scale) | 0];
    return a;
  }

  // ---------------------------------------------------------------- a stroke in progress

  class Run {
    constructor(eng, rec) {
      const P = resolve(rec, eng.brushes);
      const path = densePath(rec.pts, rec.pr, P.smooth);
      checkTravel(rec, path);

      this.eng = eng;
      this.rec = rec;
      this.P = P;
      this.opacity = rec.opacity;
      const rnd = rng32(rec.seed);
      const nz = new Float32Array(64);
      for (let i = 0; i < 64; i++) nz[i] = rnd();
      this.nz = nz;

      // Resample the path at even steps of arc length.
      const total = path.length;
      const dsT = Math.min(6, Math.max(1, rec.width * 0.08));
      const M = Math.max(2, Math.ceil(total / dsT) + 1);
      const ds = total / (M - 1);
      const xs = new Float64Array(M), ys = new Float64Array(M), rs = new Float64Array(M);
      const nxs = new Float64Array(M), nys = new Float64Array(M);
      const last = path.x.length - 1;
      const rFull = rec.width / 2;
      const rMin = Math.min(rFull, RULES.minWidth / (1 + P.hardness));
      let ta = P.taper[0], tb = P.taper[1];
      if (ta + tb > 1) { const k = 1 / (ta + tb); ta *= k; tb *= k; }
      const wobbleScale = 1 / Math.max(6, rec.width * 1.5);
      let seg = 0;
      for (let m = 0; m < M; m++) {
        const s = m === M - 1 ? total : m * ds;
        while (seg < last - 1 && path.cum[seg + 1] < s) seg++;
        const span = path.cum[seg + 1] - path.cum[seg];
        const f = span > 0 ? clamp((s - path.cum[seg]) / span, 0, 1) : 0;
        xs[m] = path.x[seg] + (path.x[seg + 1] - path.x[seg]) * f;
        ys[m] = path.y[seg] + (path.y[seg + 1] - path.y[seg]) * f;
        let r = rFull * (path.q[seg] + (path.q[seg + 1] - path.q[seg]) * f);
        if (P.wobble > 0) r *= 1 + P.wobble * (noise1(nz, s * wobbleScale + 31.7) * 2 - 1);
        let tf = 1;
        if (ta > 0) tf = Math.min(tf, s / (ta * total));
        if (tb > 0) tf = Math.min(tf, (total - s) / (tb * total));
        tf = tf <= 0 ? 0 : tf >= 1 ? 1 : Math.sin(tf * Math.PI / 2);
        r = rMin + (r - rMin) * tf;
        rs[m] = r < rMin ? rMin : r;   // the brush never gets thinner than the minimum
      }
      let ptx = 1, pty = 0;
      for (let m = 0; m < M; m++) {
        const a = m > 0 ? m - 1 : 0, b = m < M - 1 ? m + 1 : M - 1;
        let tx = xs[b] - xs[a], ty = ys[b] - ys[a];
        const l = Math.sqrt(tx * tx + ty * ty);
        if (l > 1e-9) { tx /= l; ty /= l; ptx = tx; pty = ty; } else { tx = ptx; ty = pty; }
        nxs[m] = ty; nys[m] = -tx;
      }
      this.M = M; this.ds = ds; this.total = total;
      this.xs = xs; this.ys = ys; this.rs = rs; this.nxs = nxs; this.nys = nys;

      // Bristle lanes across the width of the brush.
      const c = hexToRgb(rec.color);
      this.cr = c[0]; this.cg = c[1]; this.cb = c[2];
      this.plain = P.streak === 0 && P.jitter === 0 && P.mix === 0 && P.dry === 0 && P.load === 0 && P.rag === 0 && P.cap === 'round';
      this.trim = P.cap === 'flat' || P.rag > 0;
      const K = this.plain ? 1 : Math.max(2, Math.min(96, Math.round(rec.width / 2.4)));
      this.K = K;
      if (!this.plain) {
        const lane = {
          r: new Float32Array(K), g: new Float32Array(K), b: new Float32Array(K),
          gap: new Float32Array(K), phase: new Float32Array(K), dryness: new Float32Array(K), reach: new Float32Array(K),
          carry: new Float32Array(K * 3),
        };
        this.oS = new Float32Array(K);
        this.oE = new Float32Array(K);
        for (let k = 0; k < K; k++) {
          const light = (rnd() * 2 - 1) * 0.6 + (noise1(nz, k / 5 + 17.3) - 0.5) * 1.2;
          lane.r[k] = clamp(c[0] + P.jitter * (light * 24 + (rnd() * 2 - 1) * 8), 0, 255);
          lane.g[k] = clamp(c[1] + P.jitter * (light * 24 + (rnd() * 2 - 1) * 8), 0, 255);
          lane.b[k] = clamp(c[2] + P.jitter * (light * 24 + (rnd() * 2 - 1) * 8), 0, 255);
          lane.gap[k] = Math.pow(rnd(), 2.2);
          lane.phase[k] = rnd() * 64;
          lane.dryness[k] = 0.4 + 0.7 * rnd();
          lane.reach[k] = 0.7 + 0.6 * rnd();
          this.oS[k] = P.rag * rec.width * 0.9 * rnd();
          this.oE[k] = P.rag * rec.width * 0.9 * rnd();
        }
        this.lane = lane;
        this.table = new Float32Array(M * K * 6);   // per (sample, lane): r, g, b, streak alpha, coverage, skip track
        this.pick = 1 - Math.exp(-ds / Math.max(2, rec.width * 0.6));
        this.laneScale = 1 / Math.max(8, rec.width * 2.5);
        this.trackScale = 1 / Math.max(8, rec.width * 0.6);
      }
      this.tabled = 0;   // samples whose lane colors are known
      this.done = 0;     // samples the brush has reached (segments rasterized)

      // The part of the canvas this stroke can touch.
      let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
      for (let m = 0; m < M; m++) {
        const r = rs[m] + 2;
        if (xs[m] - r < bx0) bx0 = xs[m] - r;
        if (ys[m] - r < by0) by0 = ys[m] - r;
        if (xs[m] + r > bx1) bx1 = xs[m] + r;
        if (ys[m] + r > by1) by1 = ys[m] + r;
      }
      const W = eng.width, H = eng.height;
      const x0 = Math.max(0, Math.floor(bx0)), y0 = Math.max(0, Math.floor(by0));
      const x1 = Math.min(W, Math.ceil(bx1) + 1), y1 = Math.min(H, Math.ceil(by1) + 1);
      this.empty = x1 <= x0 || y1 <= y0;
      this.bbox = this.empty ? null : { x0, y0, x1, y1 };
      if (!this.empty) {
        const D = eng.D;
        for (let y = y0; y < y1; y++) D.fill(-1e30, y * W + x0, y * W + x1);
      }
    }

    get finished() { return this.done >= this.M - 1; }

    // Where the brush is now: { x, y, r }.
    tip() {
      const m = Math.min(this.done, this.M - 1);
      return { x: this.xs[m], y: this.ys[m], r: this.rs[m] };
    }

    // Move the brush forward to arc length s. Returns the rectangle it touched, or null.
    advance(s) {
      const M = this.M;
      let target = s >= this.total ? M - 1 : Math.floor(s / this.ds + 1e-6);
      if (target > M - 1) target = M - 1;
      if (target <= this.done) return null;
      if (this.empty) { this.done = target; return null; }
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (let j = this.done; j < target; j++) {
        if (!this.plain) while (this.tabled <= j + 1) this._lanes(this.tabled++);
        const b = this._raster(j);
        if (b) {
          if (b[0] < x0) x0 = b[0];
          if (b[1] < y0) y0 = b[1];
          if (b[2] > x1) x1 = b[2];
          if (b[3] > y1) y1 = b[3];
        }
      }
      this.done = target;
      return x1 > x0 ? { x0, y0, x1, y1 } : null;
    }

    // What each bristle lane lays down at sample m. Lanes remember the wet color they have
    // been dragged through, so this has to be worked out in order, along the stroke.
    _lanes(m) {
      const P = this.P, K = this.K, lane = this.lane, T = this.table, nz = this.nz;
      const eng = this.eng, W = eng.width, H = eng.height, cv = eng.canvas;
      const s = m * this.ds, width = this.rec.width;
      const mixing = P.mix > 0;
      const reach = P.load > 0 ? P.load * width : 0;
      for (let k = 0; k < K; k++) {
        let r = lane.r[k], g = lane.g[k], b = lane.b[k];
        if (mixing) {
          const u = -1 + 2 * k / (K - 1);
          const off = u * this.rs[m] * 0.85;
          let px = Math.floor(this.xs[m] + this.nxs[m] * off), py = Math.floor(this.ys[m] + this.nys[m] * off);
          px = px < 0 ? 0 : px >= W ? W - 1 : px;
          py = py < 0 ? 0 : py >= H ? H - 1 : py;
          const j = (py * W + px) * 3, q = k * 3;
          if (m === 0) {
            lane.carry[q] = cv[j]; lane.carry[q + 1] = cv[j + 1]; lane.carry[q + 2] = cv[j + 2];
          } else {
            lane.carry[q] += (cv[j] - lane.carry[q]) * this.pick;
            lane.carry[q + 1] += (cv[j + 1] - lane.carry[q + 1]) * this.pick;
            lane.carry[q + 2] += (cv[j + 2] - lane.carry[q + 2]) * this.pick;
          }
          r += (lane.carry[q] - r) * P.mix;
          g += (lane.carry[q + 1] - g) * P.mix;
          b += (lane.carry[q + 2] - b) * P.mix;
        }
        const along = noise1(nz, s * this.laneScale + lane.phase[k]);
        let streak = lane.gap[k] * (0.5 + along);
        streak = 1 - P.streak * (streak > 1 ? 1 : streak);
        let left = 1;
        if (reach > 0) {
          const f = s / (reach * lane.reach[k]);
          left = f >= 1 ? 0 : 1 - f * Math.sqrt(f);
        }
        // Share of the surface this lane still covers, bent so that it stays a true share
        // once the canvas grain and the lane's own skipping are averaged together.
        let cover = left * (1 - 0.6 * P.dry * lane.dryness[k]);
        cover = cover <= 0 ? 0 : cover < 0.5 ? Math.sqrt(cover / 2) : 1 - Math.sqrt((1 - cover) / 2);
        const o = (m * K + k) * 6;
        T[o] = r; T[o + 1] = g; T[o + 2] = b; T[o + 3] = streak; T[o + 4] = cover;
        T[o + 5] = noise1(nz, s * this.trackScale + lane.phase[k] * 1.7 + 11);
      }
    }

    // Rasterize the piece of the stroke between samples j and j+1. For every pixel the brush
    // covers we keep how deep inside the stroke it is (D), where across the brush it sits (U)
    // and how far along the stroke it is (S), always from the nearest piece of the path.
    _raster(j) {
      const eng = this.eng, W = eng.width, H = eng.height, D = eng.D, U = eng.U, S = eng.S;
      const ax = this.xs[j], ay = this.ys[j], bx = this.xs[j + 1], by = this.ys[j + 1];
      const ra = this.rs[j], rb = this.rs[j + 1];
      let dx = bx - ax, dy = by - ay;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < 1e-9) return null;
      dx /= len; dy /= len;
      const rm = (ra > rb ? ra : rb) + 1;
      let x0 = Math.floor((ax < bx ? ax : bx) - rm), x1 = Math.ceil((ax > bx ? ax : bx) + rm) + 1;
      let y0 = Math.floor((ay < by ? ay : by) - rm), y1 = Math.ceil((ay > by ? ay : by) + rm) + 1;
      if (x0 < 0) x0 = 0;
      if (y0 < 0) y0 = 0;
      if (x1 > W) x1 = W;
      if (y1 > H) y1 = H;
      if (x1 <= x0 || y1 <= y0) return null;
      const sa = j * this.ds, dr = (rb - ra) / len;
      const first = j === 0, last = j === this.M - 2;
      for (let y = y0; y < y1; y++) {
        const vy = y + 0.5 - ay;
        let i = y * W + x0;
        for (let x = x0; x < x1; x++, i++) {
          const vx = x + 0.5 - ax;
          const proj = vx * dx + vy * dy;
          const perp = vx * dy - vy * dx;
          const tc = proj < 0 ? 0 : proj > len ? len : proj;
          const r = ra + dr * tc;
          const ex = proj - tc;
          const d = r - Math.sqrt(ex * ex + perp * perp);
          if (d > -0.5 && d > D[i]) {
            D[i] = d;
            U[i] = perp / r;
            S[i] = sa + ((first && proj < 0) || (last && proj > len) ? proj : tc);
          }
        }
      }
      return [x0, y0, x1, y1];
    }
  }

  // ---------------------------------------------------------------- the canvas

  class Engine {
    constructor(width, height, background, brushes) {
      if (!Number.isInteger(width) || !Number.isInteger(height) || width < 16 || height < 16) {
        throw new RuleError('canvas size must be whole pixels');
      }
      if (Math.max(width, height) > RULES.maxSide) {
        throw new RuleError(`canvas long side is ${Math.max(width, height)}px; the maximum is ${RULES.maxSide}px`);
      }
      this.width = width;
      this.height = height;
      this.brushes = brushes || BRUSHES;
      this.background = parseHex(background, 'background');
      const n = width * height;
      this.canvas = new Float32Array(n * 3);   // sRGB values, 0..255, kept as floats between strokes
      this.D = new Float32Array(n);
      this.U = new Float32Array(n);
      this.S = new Float32Array(n);
      this.grain = makeGrain(width, height);
      this.count = 0;
      this.clear();
    }

    clear() {
      const c = hexToRgb(this.background), cv = this.canvas;
      for (let j = 0; j < cv.length; j += 3) { cv[j] = c[0]; cv[j + 1] = c[1]; cv[j + 2] = c[2]; }
      this.count = 0;
    }

    begin(rec) { return new Run(this, rec); }

    // Lay the finished stroke into the canvas.
    commit(run) {
      if (!run.finished) run.advance(Infinity);
      if (run.bbox) this._composite(run, run.bbox.x0, run.bbox.y0, run.bbox.x1, run.bbox.y1, null);
      this.count++;
      return run.bbox;
    }

    stroke(rec) { return this.commit(this.begin(rec)); }

    // Show a stroke in progress: canvas plus the stroke so far, written into an RGBA display buffer.
    preview(run, rect, out) {
      this._composite(run, rect.x0, rect.y0, rect.x1, rect.y1, out);
    }

    _composite(run, x0, y0, x1, y1, out) {
      const W = this.width, cv = this.canvas, D = this.D, U = this.U, S = this.S, G = this.grain;
      const P = run.P, K = run.K, M = run.M, T = run.table, rs = run.rs;
      const total = run.total, invDs = 1 / run.ds;
      const oneMinusH = 1 - P.hardness, op = run.opacity, pool = P.pool;
      const plain = run.plain, trim = run.trim, oS = run.oS, oE = run.oE;
      const pr = run.cr, pg = run.cg, pb = run.cb;
      const K6 = K * 6, Km1 = K - 1;
      for (let y = y0; y < y1; y++) {
        let i = y * W + x0;
        for (let x = x0; x < x1; x++, i++) {
          const d = D[i];
          if (d <= -0.5) continue;
          const s = S[i];
          const fi = (s < 0 ? 0 : s > total ? total : s) * invDs;
          let i0 = fi | 0;
          if (i0 > M - 2) i0 = M - 2;
          const ft = fi - i0;
          const r = rs[i0] + (rs[i0 + 1] - rs[i0]) * ft;

          // Edge: one pixel of antialiasing on a hard brush, a long falloff on a soft one.
          const e = r * oneMinusH;
          let a;
          if (e > 1) {
            a = (d + 0.5) / e;
            a = a >= 1 ? 1 : a * a * (3 - 2 * a);
          } else {
            a = d + 0.5;
            if (a > 1) a = 1;
          }
          if (pool > 0) {
            const pw = 0.18 * r + 2;
            if (d < pw) { const q = 1 - d / pw; a *= 1 + pool * q * q; }
          }
          a *= op;

          let cr, cg, cb;
          if (plain) {
            cr = pr; cg = pg; cb = pb;
          } else {
            let u = U[i];
            u = u < -1 ? -1 : u > 1 ? 1 : u;
            const fl = (u * 0.5 + 0.5) * Km1;
            let k0 = fl | 0;
            if (k0 > K - 2) k0 = K - 2;
            const fk = fl - k0;
            const b0 = (i0 * K + k0) * 6, b1 = b0 + K6;
            const w00 = (1 - ft) * (1 - fk), w01 = (1 - ft) * fk, w10 = ft * (1 - fk), w11 = ft * fk;
            cr = T[b0] * w00 + T[b0 + 6] * w01 + T[b1] * w10 + T[b1 + 6] * w11;
            cg = T[b0 + 1] * w00 + T[b0 + 7] * w01 + T[b1 + 1] * w10 + T[b1 + 7] * w11;
            cb = T[b0 + 2] * w00 + T[b0 + 8] * w01 + T[b1 + 2] * w10 + T[b1 + 8] * w11;
            a *= T[b0 + 3] * w00 + T[b0 + 9] * w01 + T[b1 + 3] * w10 + T[b1 + 9] * w11;
            const cover = T[b0 + 4] * w00 + T[b0 + 10] * w01 + T[b1 + 4] * w10 + T[b1 + 10] * w11;
            if (cover < 1) {
              // Dry paint skips: partly on the tooth of the canvas, partly along each bristle's own track.
              const track = T[b0 + 5] * w00 + T[b0 + 11] * w01 + T[b1 + 5] * w10 + T[b1 + 11] * w11;
              const q = (cover * 1.24 - (G[i] + track) * 0.5) * (1 / 0.24);
              if (q <= 0) a = 0;
              else if (q < 1) a *= q * q * (3 - 2 * q);
            }
            if (trim) {
              const e1 = s - (oS[k0] + (oS[k0 + 1] - oS[k0]) * fk) + 0.5;
              const e2 = total - (oE[k0] + (oE[k0 + 1] - oE[k0]) * fk) - s + 0.5;
              if (e1 <= 0 || e2 <= 0) a = 0;
              else {
                if (e1 < 1) a *= e1;
                if (e2 < 1) a *= e2;
              }
            }
          }
          if (a > 1) a = 1;

          const j = i * 3;
          if (out) {
            const o = i * 4;
            out[o] = cv[j] + (cr - cv[j]) * a;
            out[o + 1] = cv[j + 1] + (cg - cv[j + 1]) * a;
            out[o + 2] = cv[j + 2] + (cb - cv[j + 2]) * a;
          } else if (a > 0) {
            cv[j] += (cr - cv[j]) * a;
            cv[j + 1] += (cg - cv[j + 1]) * a;
            cv[j + 2] += (cb - cv[j + 2]) * a;
          }
        }
      }
    }

    // Copy part of the canvas into an RGBA display buffer.
    blit(out, x0, y0, x1, y1) {
      const W = this.width, cv = this.canvas;
      for (let y = y0; y < y1; y++) {
        let i = y * W + x0;
        for (let x = x0; x < x1; x++, i++) {
          const j = i * 3, o = i * 4;
          out[o] = cv[j]; out[o + 1] = cv[j + 1]; out[o + 2] = cv[j + 2]; out[o + 3] = 255;
        }
      }
    }

    // 8-bit RGB copy of the canvas.
    snapshot() { return new Uint8ClampedArray(this.canvas); }

    restore(snap, count) {
      this.canvas.set(snap);
      this.count = count || 0;
    }

    // [r, g, b] under a point, for the painter to look at.
    sample(x, y) {
      const px = clamp(Math.floor(x), 0, this.width - 1), py = clamp(Math.floor(y), 0, this.height - 1);
      const j = (py * this.width + px) * 3;
      return [this.canvas[j], this.canvas[j + 1], this.canvas[j + 2]];
    }
  }

  return { FORMAT, RULES, BRUSHES, RuleError, Engine, normalize, resolve, measure, requiredSpan, rng32, hexToRgb };
});
