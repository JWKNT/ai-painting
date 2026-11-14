// The canvas: paint with the brushes and the rules of the paintings. Each stroke goes through
// the same engine, so the rules apply to it, and the strokes can be played back as a painting is.
(function () {
  'use strict';
  const PE = window.PaintEngine, PP = window.PaintPlayer;
  const root = document.querySelector('[data-studio]');
  if (!root || !PE || !PP) return;

  const $ = (role) => root.querySelector('[data-role="' + role + '"]');
  const frame = $('frame'), view = $('view'), guide = $('guide'), tipEl = $('tip');
  const brushEl = $('brush'), colorEl = $('color'), widthEl = $('width'), widthOut = $('width-value');
  const opacityEl = $('opacity'), opacityOut = $('opacity-value');
  const undoEl = $('undo'), redoEl = $('redo'), newEl = $('new'), saveEl = $('save'), playEl = $('play');
  const statusEl = $('status'), slot = $('player');
  const dialog = document.getElementById('new-canvas');
  const template = document.getElementById('playback');

  const SHAPES = { wide: [1600, 1000], square: [1200, 1200], tall: [1000, 1600] };
  const STORE = 'ai-painting-canvas';
  const MAX_WIDTH = 240;
  const KEY_EVERY = 25, KEYS_KEPT = 8;   // a snapshot every so many strokes, for Undo

  let W = 0, H = 0, background = '#f1ebdd';
  let eng = null, ctx = null, gctx = null, image = null, px = null;
  let strokes = [], undone = [];
  const keys = new Map();
  let player = null, busy = false;

  const say = (text) => { statusEl.textContent = text; };

  // ---- the canvas and its pixels
  let dx0 = 0, dy0 = 0, dx1 = 0, dy1 = 0;
  const clean = () => { dx0 = W; dy0 = H; dx1 = 0; dy1 = 0; };
  function mark(r) {
    if (r.x0 < dx0) dx0 = r.x0;
    if (r.y0 < dy0) dy0 = r.y0;
    if (r.x1 > dx1) dx1 = r.x1;
    if (r.y1 > dy1) dy1 = r.y1;
  }
  function flush() {
    if (dx1 > dx0 && dy1 > dy0) ctx.putImageData(image, 0, 0, dx0, dy0, dx1 - dx0, dy1 - dy0);
    clean();
  }
  function showAll() {
    eng.blit(px, 0, 0, W, H);
    mark({ x0: 0, y0: 0, x1: W, y1: H });
    flush();
  }

  function start(width, height, bg) {
    W = width;
    H = height;
    background = bg;
    eng = new PE.Engine(W, H, background, PE.BRUSHES);
    for (const c of [view, guide]) { c.width = W; c.height = H; }
    ctx = view.getContext('2d');
    gctx = guide.getContext('2d');
    image = ctx.createImageData(W, H);
    px = image.data;
    strokes = [];
    undone = [];
    keys.clear();
    root.style.setProperty('--ar', String(W / H));
    clean();
    showAll();
  }

  // ---- brush settings
  const brushes = PE.BRUSHES;
  // The narrowest width that is 4px wide at half strength for this brush.
  const minWidth = (name) => Math.ceil(PE.RULES.minWidth * 2 / (1 + brushes[name].hardness) * 10) / 10;
  // The width slider is even in ratio, so small brushes are as easy to set as large ones.
  const widthAt = (v) => minWidth(brushEl.value) * Math.pow(MAX_WIDTH / minWidth(brushEl.value), v / 1000);
  const sliderAt = (w) => Math.round(1000 * Math.log(w / minWidth(brushEl.value)) / Math.log(MAX_WIDTH / minWidth(brushEl.value)));
  let width = 24;

  function showWidth() { widthOut.textContent = Math.round(width) + ' px'; }
  function showOpacity() { opacityOut.textContent = opacityEl.value + '%'; }

  brushEl.addEventListener('change', () => {
    width = Math.max(width, minWidth(brushEl.value));
    widthEl.value = String(sliderAt(width));
    opacityEl.value = String(Math.round(brushes[brushEl.value].opacity * 100));
    showWidth();
    showOpacity();
    colorEl.disabled = brushes[brushEl.value].mix === 1;
  });
  widthEl.addEventListener('input', () => {
    width = Math.round(widthAt(+widthEl.value) * 10) / 10;
    showWidth();
  });
  opacityEl.addEventListener('input', showOpacity);

  function record(pts, pr) {
    const input = { brush: brushEl.value, width, opacity: +opacityEl.value / 100, pts };
    if (brushes[brushEl.value].mix !== 1) input.color = colorEl.value;
    if (pr) input.pr = pr;
    return PE.normalize(input, strokes.length, brushes);
  }

  // ---- painting with the pointer
  let drag = null, shown = null, queued = false;

  function point(ev) {
    const r = view.getBoundingClientRect();
    return [(ev.clientX - r.left) * W / r.width, (ev.clientY - r.top) * H / r.height];
  }

  function moveTip(ev) {
    const r = frame.getBoundingClientRect(), d = Math.max(4, width * r.width / W);
    tipEl.style.width = tipEl.style.height = d + 'px';
    tipEl.style.transform = `translate(${ev.clientX - r.left - d / 2}px, ${ev.clientY - r.top - d / 2}px)`;
    tipEl.style.opacity = '1';
  }

  function add(ev, last) {
    const [x, y] = point(ev), pts = drag.pts, n = pts.length;
    if (n && !last) {
      const gap = Math.max(2, width * 0.12);
      if (Math.hypot(x - pts[n - 2], y - pts[n - 1]) < gap) return;
    }
    pts.push(x, y);
    drag.pr.push(drag.pen ? Math.max(0.05, ev.pressure || 0.5) : 1);
  }

  // Show the stroke as it will be painted. Until it has moved far enough to obey the rules,
  // a light line shows its path.
  function preview() {
    queued = false;
    if (!drag) return;
    if (shown) { eng.blit(px, shown.x0, shown.y0, shown.x1, shown.y1); mark(shown); shown = null; }
    gctx.clearRect(0, 0, W, H);
    let run = null;
    if (drag.pts.length >= 4) {
      try { run = eng.begin(record(drag.pts, drag.pen ? drag.pr : null)); } catch (e) { if (!(e instanceof PE.RuleError)) throw e; }
    }
    if (run && run.bbox) {
      run.advance(run.total);
      eng.preview(run, run.bbox, px);
      shown = run.bbox;
      mark(shown);
    } else {
      gctx.beginPath();
      gctx.moveTo(drag.pts[0], drag.pts[1]);
      for (let i = 2; i < drag.pts.length; i += 2) gctx.lineTo(drag.pts[i], drag.pts[i + 1]);
      if (drag.pts.length === 2) gctx.lineTo(drag.pts[0] + 0.01, drag.pts[1]);
      gctx.lineCap = gctx.lineJoin = 'round';
      gctx.lineWidth = width;
      gctx.globalAlpha = 0.3;
      gctx.strokeStyle = colorEl.disabled ? '#888888' : colorEl.value;
      gctx.stroke();
    }
    flush();
  }
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(preview); } };

  function finish(cancel) {
    const d = drag;
    drag = null;
    if (shown) { eng.blit(px, shown.x0, shown.y0, shown.x1, shown.y1); mark(shown); shown = null; }
    gctx.clearRect(0, 0, W, H);
    if (!cancel && d.pts.length >= 2) {
      if (d.pts.length === 2) d.pts.push(d.pts[0], d.pts[1]), d.pr.push(d.pr[0]);
      let rec = null, run = null;
      try {
        rec = record(d.pts, d.pen ? d.pr : null);
        run = eng.begin(rec);
      } catch (e) {
        if (!(e instanceof PE.RuleError)) throw e;
        say(rec ? 'A ' + Math.round(rec.width) + ' px brush must move at least ' + Math.round(PE.requiredSpan(rec.width)) + ' px.' : e.message);
      }
      if (run) {
        const box = eng.commit(run);
        if (box) { eng.blit(px, box.x0, box.y0, box.x1, box.y1); mark(box); }
        strokes.push(rec);
        undone = [];
        keep();
        say('');
        changed();
      }
    }
    flush();
  }

  frame.addEventListener('pointerdown', (ev) => {
    if (ev.button !== 0 || busy || drag) return;
    ev.preventDefault();
    frame.setPointerCapture(ev.pointerId);
    drag = { id: ev.pointerId, pts: [], pr: [], pen: ev.pointerType === 'pen' };
    add(ev, false);
    moveTip(ev);
    schedule();
  });
  frame.addEventListener('pointermove', (ev) => {
    moveTip(ev);
    if (!drag || ev.pointerId !== drag.id) return;
    const events = ev.getCoalescedEvents ? ev.getCoalescedEvents() : [];
    for (const e of events.length ? events : [ev]) add(e, false);
    schedule();
  });
  frame.addEventListener('pointerup', (ev) => {
    if (!drag || ev.pointerId !== drag.id) return;
    add(ev, true);
    finish(false);
  });
  frame.addEventListener('pointercancel', (ev) => { if (drag && ev.pointerId === drag.id) finish(true); });
  frame.addEventListener('pointerleave', () => { if (!drag) tipEl.style.opacity = '0'; });

  // ---- undo and redo: go back to a snapshot and paint the strokes after it again
  function keep() {
    const n = strokes.length;
    if (n % KEY_EVERY) return;
    keys.set(n, eng.snapshot());
    for (const k of keys.keys()) if (k <= n - KEY_EVERY * KEYS_KEPT) keys.delete(k);
  }

  function paintUpTo(count) {
    let from = 0;
    for (const k of keys.keys()) if (k <= count && k > from) from = k;
    for (const k of [...keys.keys()]) if (k > count) keys.delete(k);
    if (from) eng.restore(keys.get(from), from);
    else eng.clear();
    for (let i = from; i < count; i++) eng.stroke(strokes[i]);
    showAll();
  }

  function undo() {
    if (!strokes.length || busy) return;
    undone.push(strokes.pop());
    paintUpTo(strokes.length);
    say('');
    changed();
  }

  function redo() {
    if (!undone.length || busy) return;
    const rec = undone.pop();
    const box = eng.stroke(rec);
    if (box) { eng.blit(px, box.x0, box.y0, box.x1, box.y1); mark(box); flush(); }
    strokes.push(rec);
    keep();
    say('');
    changed();
  }

  undoEl.addEventListener('click', undo);
  redoEl.addEventListener('click', redo);
  document.addEventListener('keydown', (ev) => {
    if (player || !(ev.metaKey || ev.ctrlKey) || ev.altKey) return;
    if (ev.target instanceof Element && ev.target.closest('input[type="text"], textarea, dialog')) return;
    const key = ev.key.toLowerCase();
    if (key === 'z' && !ev.shiftKey) undo();
    else if ((key === 'z' && ev.shiftKey) || key === 'y') redo();
    else return;
    ev.preventDefault();
  });

  // ---- keep the painting in this browser, so that it is there after a reload
  let storeTimer = null;
  function changed() {
    undoEl.disabled = !strokes.length;
    redoEl.disabled = !undone.length;
    saveEl.disabled = playEl.disabled = !strokes.length;
    if (busy) return;
    clearTimeout(storeTimer);
    storeTimer = setTimeout(() => {
      try { localStorage.setItem(STORE, JSON.stringify({ width: W, height: H, background, strokes })); } catch (e) { /* storage unavailable or full */ }
    }, 400);
  }

  function restore() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORE)); } catch (e) { /* storage unavailable */ }
    const shape = saved && Object.values(SHAPES).find(([w, h]) => w === saved.width && h === saved.height);
    if (!shape || !/^#[0-9a-f]{6}$/i.test(saved.background) || !Array.isArray(saved.strokes)) {
      start(1600, 1000, background);
      changed();
      return;
    }
    start(shape[0], shape[1], saved.background);
    busy = true;
    const list = saved.strokes;
    let i = 0;
    (function more() {
      const until = performance.now() + 30;
      while (i < list.length && performance.now() < until) {
        try {
          const rec = PE.normalize(list[i], strokes.length, brushes);
          eng.stroke(rec);
          strokes.push(rec);
          keep();
        } catch (e) { /* a stroke that does not obey the rules is left out */ }
        i++;
      }
      showAll();
      if (i < list.length) { requestAnimationFrame(more); return; }
      busy = false;
      changed();
    })();
  }

  // ---- a new canvas
  newEl.addEventListener('click', () => {
    dialog.querySelector('[data-role="replace"]').hidden = !strokes.length;
    dialog.showModal();
  });
  dialog.addEventListener('close', () => {
    if (dialog.returnValue !== 'new') return;
    const form = dialog.querySelector('form.studio-new');
    const [w, h] = SHAPES[form.elements.shape.value] || SHAPES.wide;
    start(w, h, form.elements.background.value);
    say('');
    changed();
  });

  // ---- the image
  saveEl.addEventListener('click', () => {
    view.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'canvas.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }, 'image/png');
  });

  // ---- play back the strokes, with the player of the paintings
  const paintLabel = playEl.textContent;
  playEl.addEventListener('click', () => {
    if (player) {
      player.destroy();
      player = null;
      slot.textContent = '';
      root.classList.remove('is-playing');
      playEl.textContent = paintLabel;
      return;
    }
    if (!strokes.length || busy) return;
    const el = template.content.firstElementChild.cloneNode(true);
    el.style.setProperty('--ar', String(W / H));
    slot.appendChild(el);
    root.classList.add('is-playing');
    playEl.textContent = 'Paint';
    say('');
    const data = { format: PE.FORMAT, width: W, height: H, background, brushes, passes: [{ name: 'Canvas', start: 0 }], strokes: strokes.slice() };
    player = PP.mount(el, { data, autoplay: true, keys: true, name: 'canvas' });
  });

  // ---- begin
  width = 24;
  widthEl.value = String(sliderAt(width));
  showWidth();
  showOpacity();
  root.hidden = false;
  restore();
})();
