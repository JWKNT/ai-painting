// What is close to us: the sunflowers at the foot of the hill, at each side of the path, as
// tall as we are, each with its face to the sun; and the petals that the wind has taken,
// which go across the whole picture.
'use strict';
const { studio, open, W, sunflower } = require('./scene');
const { mix } = studio;

const p = open('near');
const r = p.rng;

// The big ones, the further of them first.
const big = [
  [60, 838, 58], [210, 826, 62], [356, 850, 60], [850, 836, 60], [1000, 822, 64], [1150, 846, 60], [1300, 826, 62], [1450, 848, 60], [1570, 830, 58],
  [130, 912, 82], [318, 934, 86], [930, 910, 84], [1110, 936, 88], [1290, 914, 82], [1470, 938, 88],
  [20, 990, 104], [226, 1010, 108], [1010, 1000, 106], [1210, 1016, 110], [1400, 1004, 104], [1580, 1020, 108],
];
for (const [x, y, R] of big) sunflower(p, x + r.range(-14, 14), y, R * r.range(0.92, 1.08), { d: 0, stalk: 400 });

// Petals on the wind: each is a short yellow stroke that turns as it goes. They go from left to right and rise.
for (let k = 0; k < 90; k++) {
  const x = r.range(20, W - 20), y = r.range(60, 800), s = 0.7 + 1.5 * Math.pow(r(), 2) + (y > 600 ? 0.4 : 0), a = -0.25 + r.range(-0.9, 0.9), len = Math.max(13, 15 * s), w = Math.max(4.8, Math.min(len / 2.1, 6.5 * s));
  if (x > 800 && x < 1090 && y > 300 && y < 590) continue;                                       // not over the two of them
  p.tryStroke({ brush: 'bristle', color: mix(mix('#ffd21c', '#fff06c', r()), '#f0a010', r() * 0.4), width: w, opacity: r.range(0.75, 1), mix: 0.05, dry: 0, rag: 0.15, cap: 'round', taper: [0.25, 0.5], points: [[x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2], [x + Math.sin(a) * len * 0.12, y - Math.cos(a) * len * 0.12], [x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2]] });
}
// The light of the sun, which is behind us: a little more of it on the top of the hill.
for (const [w, o] of [[300, 0.08], [180, 0.08]]) p.stroke({ brush: 'soft', color: '#fffbe0', width: w, opacity: o, points: [[-100, 560], [700, 470], [1700, 400]] });

p.save();
