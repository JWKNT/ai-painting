// Last touches: the heavy curtains at either side of the hall, close to us, the butterflies
// that have spread through the whole room, and the corners brought down.
'use strict';
const { studio, open, W, H, WITCH, gold, cold, butterfly, fleck } = require('./scene');
const { mix, clamp } = studio;

const p = open('accents');
const r = p.rng;

// The curtains: long folds of dark red, pinched in a little at the middle. Each takes the
// light that is nearer it on the sides of its folds that face it: the lightning on the left
// curtain, the witch's gold on the right.
for (const side of [-1, 1]) {
  for (let k = 0; k < 15; k++) {
    const x0 = 8 + k * 14 + r.range(-3, 3), fold = k % 3, depth = k / 14;
    const xAt = (y) => { const x = x0 * (1 - 0.16 * Math.sin(Math.PI * y / H)) + 5 * Math.sin(y / 130 + k); return side < 0 ? x : W - x; };
    const facing = fold === 2 ? 1 : fold === 1 ? 0.35 : 0;             // how far this fold is turned to the room
    const light = side < 0 ? '#7a6c9e' : '#c2602a';
    for (let i = 0; i < 4; i++) {
      const ya = -10 + i * 256, yb = ya + 262, ym = (ya + yb) / 2;
      const near = side < 0 ? clamp(cold(xAt(ym), ym, 520) * 1.3, 0, 1) : clamp(gold(xAt(ym), ym, 620) * 1.4, 0, 1);
      p.stroke({ brush: 'bristle', color: mix(mix('#16050a', '#3c0c14', facing * 0.8 + 0.2 * r()), light, facing * near * 0.75 * depth), width: 19, mix: 0.08, dry: 0.03, rag: 0.15, streak: 0.3, jitter: 0.5, points: [[xAt(ya), ya], [xAt(ym), ym], [xAt(yb), yb]] });
    }
  }
}

// Butterflies through the hall: flecks far off, a few with their wings showing, and three
// close to us and out of focus.
for (let k = 0; k < 150; k++) {
  const x = r.range(210, W - 210), y = r.range(130, 900), near = clamp(gold(x, y, 520), 0, 1);
  if (r() > 0.12 + 0.6 * near) continue;
  if (Math.hypot(x - 566, (y - 760) * 0.5) < 90 || Math.hypot(x - WITCH.x, (y - 540) * 0.7) < 150 || Math.hypot(x - 800, y - 218) < 40) continue;   // not over the two of them, or her painted face
  if (r() < 0.4) butterfly(p, x, y, r.range(14, 24), r.range(0, 6.283), { bright: 0.5, opacity: 0.9 }); else if (r() < 0.55) fleck(p, x, y, 0.5 + 0.5 * near);
}
for (const [x, y, len, a] of [[1316, 872, 58, -0.6], [1452, 610, 40, 0.4], [300, 470, 34, 2.2]]) {
  p.stroke({ brush: 'soft', color: '#ffb030', width: len * 2.4, opacity: 0.2, points: [[x - len * 2.6, y], [x + len * 2.6, y]] });
  butterfly(p, x, y, len, a, { open: 0.9, bright: 0.3, opacity: 0.6, glow: false });
}

// The corners, a tone darker, so the eye stays with the two of them.
for (const [x0, y0, x1, y1, w, o] of [
  [-80, H + 40, 700, H + 60, 200, 0.34], [W + 80, H + 40, 900, H + 60, 200, 0.34], [-90, -50, 520, -80, 220, 0.3], [W + 90, -50, 1080, -80, 220, 0.3],
]) {
  p.stroke({ brush: 'soft', color: '#04030a', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

p.save();
