// The rain: over everything, slanting with the wind. Far off it is only a greyness; nearer,
// short pale strokes; close to us, long ones. It splashes on the road and runs off the man's
// shoulders. Then the corners of the picture are brought down.
'use strict';
const { studio, open, W, H, nA } = require('./scene');
const { mix } = studio;

const p = open('rain');
const r = p.rng;
const SLANT = 0.2;                                                     // how far it goes sideways as it falls

// Veils of it, far off.
for (let k = 0; k < 12; k++) {
  const x = r.range(-100, W - 100), y = r.range(60, 520), len = r.range(260, 480);
  p.stroke({ brush: 'soft', color: mix('#9ea8a6', '#c8d0cc', r()), width: r.range(40, 80), opacity: r.range(0.05, 0.1), points: [[x, y], [x + SLANT * len * 0.5, y + len * 0.5], [x + SLANT * len, y + len]] });
}
// The drops: three depths of them.
for (const [n, len0, len1, w0, w1, o0, o1] of [[380, 26, 44, 4, 4.2, 0.1, 0.24], [230, 54, 96, 4, 4.6, 0.09, 0.22], [70, 140, 240, 4.6, 5.6, 0.08, 0.18]]) {
  for (let k = 0; k < n; k++) {
    const x = r.range(-60, W + 20), y = r.range(-80, H - 20), len = r.range(len0, len1);
    const dark = nA(x / 200, y / 200);                                 // it shows most against what is dark
    p.tryStroke({ brush: w1 > 5 ? 'bristle' : 'round', color: mix('#c2cac6', '#eef0ea', r()), width: r.range(w0, w1), opacity: r.range(o0, o1) * (0.7 + 0.6 * dark), mix: 0.1, dry: 0.1, rag: 0.2, taper: [0.2, 0.2], points: [[x, y], [x + SLANT * len, y + len]] });
  }
}
// Where it strikes the road: a few pale flecks, and broken light on the pools.
for (let k = 0; k < 70; k++) {
  const y = 560 + Math.pow(r(), 0.6) * 440, d = (y - 470) / 530, x = r.range(0, W), len = Math.max(12.4, 8 + 14 * d);
  p.tryStroke({ color: mix('#aab2ae', '#e2e6e0', r()), width: 4, opacity: r.range(0.08, 0.2), taper: [0.4, 0.4], points: [[x - len / 2, y], [x + len / 2, y + r.range(-0.6, 0.6)]] });
}
for (const [cx, cy, w] of [[1184, 902, 250], [650, 826, 170], [838, 946, 190], [1010, 742, 110]]) {
  for (let k = 0; k < 3; k++) {
    const x = cx + r.range(-0.3, 0.3) * w, half = r.range(9, 16);
    p.tryStroke({ color: '#f0f2ec', width: 4, opacity: r.range(0.2, 0.4), taper: [0.3, 0.3], points: [[x - half, cy + r.range(-3, 3)], [x + half, cy + r.range(-3, 3)]] });
  }
}
// It runs off his shoulders and his arm, and off the eaves.
for (const [x0, x1, y] of [[304, 480, 552], [510, 610, 536]]) {
  for (let x = x0; x < x1; x += r.range(24, 44)) p.tryStroke({ color: '#dfe4de', width: 4, opacity: r.range(0.18, 0.36), points: [[x, y + r.range(-6, 6)], [x + r.range(1, 4), y + r.range(14, 30)]] });
}

// The corners, a tone darker, so the eye stays in the street.
for (const [x0, y0, x1, y1, w, o] of [
  [-80, H + 40, 700, H + 60, 200, 0.34], [W + 80, H + 40, 900, H + 60, 200, 0.34], [-90, -50, 520, -80, 220, 0.3], [W + 90, -50, 1080, -80, 220, 0.3],
]) {
  p.stroke({ brush: 'soft', color: '#0a0c0e', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

p.save();
