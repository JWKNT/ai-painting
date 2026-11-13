// What is close to us: the sunflowers at the foot of the hill, at each side of the path, as
// tall as we are, each with its face to the sun; and the petals that the wind has taken,
// which go across the whole picture.
'use strict';
const { studio, open, W, pathMid, pathHalf, sunflower } = require('./scene');
const { mix } = studio;

const p = open('near');
const r = p.rng;

// The big ones, the further of them first. None stands on the path.
for (const [y, R, gap] of [[838, 60, 150], [914, 84, 186], [1004, 106, 204]]) {
  for (let x = 40 + r.range(-20, 20); x < W + 40; x += gap * r.range(0.86, 1.14)) {
    if (Math.abs(x - pathMid(y)) < pathHalf(y) + R * 0.7) continue;
    sunflower(p, x, y + r.range(-10, 10), R * r.range(0.92, 1.08), { d: 0, stalk: 400 });
  }
}

// Petals on the wind: each is a short yellow stroke that turns as it goes. They go from left to right and rise.
for (let k = 0; k < 90; k++) {
  const x = r.range(20, W - 20), y = r.range(60, 800), s = 0.7 + 1.5 * Math.pow(r(), 2) + (y > 600 ? 0.4 : 0), a = -0.25 + r.range(-0.9, 0.9), len = Math.max(13, 15 * s), w = Math.max(4.8, Math.min(len / 2.1, 6.5 * s));
  if (x > 630 && x < 1040 && y > 430 && y < 830) continue;                                       // not over the two of them
  p.tryStroke({ brush: 'bristle', color: mix(mix('#ffd21c', '#fff06c', r()), '#f0a010', r() * 0.4), width: w, opacity: r.range(0.75, 1), mix: 0.05, dry: 0, rag: 0.15, cap: 'round', taper: [0.25, 0.5], points: [[x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2], [x + Math.sin(a) * len * 0.12, y - Math.cos(a) * len * 0.12], [x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2]] });
}
// The light of the sun, which is behind us: a little more of it on the top of the hill.
for (const [w, o] of [[300, 0.08], [180, 0.08]]) p.stroke({ brush: 'soft', color: '#fffbe0', width: w, opacity: o, points: [[-100, 560], [700, 470], [1700, 400]] });

p.save();
