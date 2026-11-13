// The forest behind the glade: mist, the pale trunks of far trees going up out of sight, the
// dark of the leaves overhead with the sky showing through in small bright places, and the
// shafts of light that come down through those places.
'use strict';
const { studio, open, W, SLANT, SHAFTS, shaft, mist, far, nA, nB } = require('./scene');
const { shift, mix, clamp } = studio;

const p = open('forest');
const r = p.rng;
const fall = 1.17;                                                      // the way the shafts slant

p.fill({ bounds: [0, 0, W, 760], width: 46, length: 300, spacing: 0.55, overlap: 0.55, angle: (x, y) => fall + (nB(x / 300, y / 160) - 0.5) * 0.4, color: (x, y) => shift(mist(x, y), r.range(-4, 4), r.range(-0.03, 0.04), r.range(-0.012, 0.016)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, 740], width: 24, length: 170, spacing: 0.9, overlap: 0.7, angle: (x, y) => fall + (nB(x / 200, y / 100) - 0.5) * 0.6, color: (x, y) => shift(mist(x + r.range(-30, 30), y + r.range(-24, 24)), r.range(-6, 6), r.range(-0.02, 0.06), r.range(-0.02, 0.03)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });

for (let k = 0; k < 8; k++) {                                            // a clean brush through the mist, so that it is soft
  const x = r.range(300, 1100), y = r.range(200, 620);
  p.stroke({ brush: 'blend', width: 90, opacity: 0.5, points: [[x, y], [x + 80, y + 190], [x + 170, y + 400]] });
}

// Far trees: each a tall pale trunk, a little darker than the mist, with a branch or two.
for (const [x, w, d] of [[44, 70, 0.6], [196, 44, 0.74], [318, 56, 0.66], [432, 34, 0.8], [1174, 36, 0.8], [1286, 60, 0.66], [1410, 46, 0.74], [1548, 76, 0.6], [520, 26, 0.86], [1090, 28, 0.86]]) {
  const lean = r.range(-0.03, 0.03), color = (y) => far(mix('#1c3a2c', '#2c5240', nA(x / 20, y / 80)), x, y, d);
  p.stroke({ brush: 'bristle', color: color(380), width: w, mix: 0.12, dry: 0.04, rag: 0.12, streak: 0.3, jitter: 0.5, points: [[x - lean * 20, -20, 0.9], [x + lean * 250 + r.range(-4, 4), 250, 0.94], [x + lean * 520 + r.range(-4, 4), 520, 1], [x + lean * 780, 780, 1]] });
  p.tryStroke({ brush: 'bristle', color: far('#a8c890', x, 400, d * 0.7), width: Math.max(4.6, w * 0.16), opacity: 0.55, mix: 0.2, dry: 0.1, rag: 0.3, points: [[x - w * 0.36, 60], [x - w * 0.36 + lean * 300, 360], [x - w * 0.36 + lean * 600, 700]] });   // the light down its side
  for (let k = 0; k < 2; k++) {                                          // a branch
    const y = r.range(120, 420), s = r() < 0.5 ? -1 : 1, len = r.range(70, 150);
    p.tryStroke({ brush: 'bristle', color: color(y), width: Math.max(5, w * 0.24), taper: [0, 0.8], mix: 0.1, dry: 0.04, rag: 0.2, points: [[x + lean * y, y], [x + s * len * 0.6, y - len * 0.3], [x + s * len, y - len * 0.7]] });
  }
}

// The leaves overhead. They are painted leaf by leaf, in short strokes at every angle: thick
// at the top and in the corners, thinning downward, with gaps where the sky shows.
const cover = (x) => 150 + 150 * Math.pow(Math.abs(x - 800) / 800, 1.5) + 50 * (nA(x / 120, 7) - 0.5);   // how far down they come
const leafTone = (t, x, y) => mix(mix('#0c2619', '#22502e', t), '#9cc45e', clamp(shaft(x, y) * 1.3, 0, 1) * t);
for (const [n, w0, w1, len0, len1] of [[1500, 12, 20, 26, 46], [1500, 7, 12, 16, 30]]) {
  for (let k = 0; k < n; k++) {
    const x = r.range(-20, W + 20), depth = Math.pow(r(), 1.5), y = -10 + depth * cover(x);
    if (nB(x / 70, y / 50) < 0.3 + 0.35 * depth) continue;                // a gap
    const a = r.range(0, 3.14), len = r.range(len0, len1), fringe = depth > 0.7;
    p.tryStroke({ brush: 'bristle', color: leafTone(fringe ? r.range(0.4, 1) : r.range(0, 0.5), x, y), width: r.range(w0, w1), opacity: 0.95, taper: [0.15, 0.6], mix: 0.1, dry: 0, rag: 0.2, cap: 'round', points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
  }
}
// The sky through the gaps: small bright places, where the shafts come in.
for (const [x0, , k] of SHAFTS) {
  for (let q = 0; q < 4; q++) {
    const x = x0 + r.range(-40, 40), y = r.range(4, 70), a = r.range(0, 3.14), len = r.range(14, 30);
    p.tryStroke({ brush: 'bristle', color: mix('#e6f0c0', '#fffbe0', r()), width: r.range(7, 13), opacity: 0.5 + 0.4 * k, mix: 0.1, dry: 0, rag: 0.3, cap: 'round', points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
  }
}

// The shafts of light.
for (const [x0, w, k] of SHAFTS) {
  const at = (y) => [x0 + y * SLANT, y];
  p.stroke({ brush: 'soft', color: '#f2f2b4', width: w * 2.6, opacity: 0.13 * k, taper: [0.05, 0.3], points: [at(-40), at(360), at(760)] });
  p.stroke({ brush: 'soft', color: '#fbf8d0', width: w * 1.3, opacity: 0.14 * k, taper: [0.05, 0.4], points: [at(-40), at(330), at(700)] });
}

p.save();
