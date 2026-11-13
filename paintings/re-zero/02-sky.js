// The sky: a clear summer blue, with the white of the sun's side of it at the right, and
// great heaped clouds that stand up from the horizon, white where the sun is on them and
// blue in their hollows.
'use strict';
const { studio, open, W, HORIZON, SUNWARD, skyColor, nB } = require('./scene');
const { mix, shift, ramp, noise2, clamp } = studio;

const p = open('sky');
const r = p.rng;
const level = (x, y) => (nB(x / 300, y / 140) - 0.5) * 0.3 - 0.06;
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: level, color: (x, y) => shift(skyColor(x, y), r.range(-2, 2), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { brush: 'bristle', opacity: 0.92, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 20, length: 150, spacing: 0.9, overlap: 0.7, angle: level, color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-14, 14)), r.range(-3, 3), r.range(-0.02, 0.03), r.range(-0.012, 0.014)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });

// The light of the sun, which is out of the picture at the upper right.
for (const [w, o] of [[420, 0.16], [260, 0.2]]) p.stroke({ brush: 'soft', color: '#fffdf0', width: w, opacity: o, points: [[W + 40, -380], [W + 60, 60], [W + 40, 500]] });

// The clouds. Each is a heap of round tops on a level floor.
const cloud = (t, x, y) => ramp([mix('#7c9cd0', '#a8b4d8', clamp(y / 440, 0, 1)), '#a9c2e6', '#e4eef8', '#ffffff', '#fffdf2'], t);
let seed = 0;
for (const [x0, x1, floor, big, tall] of [[-80, 520, 400, 96, 1.5], [330, 760, 414, 60, 1], [1080, 1700, 396, 104, 1.6], [760, 1100, 420, 44, 0.8], [-40, 300, 250, 50, 0.6], [1250, 1620, 190, 46, 0.5]]) {
  const puffs = [], n = noise2(900 + ++seed);
  for (let x = x0; x < x1; x += big * 0.5) {
    const hump = Math.pow(Math.sin(Math.PI * clamp((x - x0) / (x1 - x0), 0.03, 0.97)), 0.8), rad = big * r.range(0.5, 1) * (0.4 + 0.75 * hump);
    puffs.push([x + r.range(-12, 12), floor - rad * 0.7 - big * tall * hump * r.range(0.2, 1), rad]);
    if (r() < 0.6) puffs.push([x + r.range(-20, 20), floor - rad * 0.6, rad * r.range(0.8, 1.1)]);
  }
  studio.mass(p, puffs.filter((q) => q[2] > 10), { light: SUNWARD, tones: cloud, base: floor, bias: 0.52, contrast: 0.62, fall: 0.25, grain: 0.16, mix: 0.3, noise: n, stroke: { rag: 0.35, hardness: 0.55 }, layers: [[Math.max(11, big * 0.26), big * 0.8, 0.95, big * 0.09, 0.45], [Math.max(7, big * 0.14), big * 0.45, 0.85, big * 0.05, 0.75]] });
}
// The haze where the sky comes down to the land.
for (let x = -60; x < W; x += 240) p.stroke({ brush: 'soft', color: mix('#eef2f4', '#fff8e4', clamp((x - 300) / 1300, 0, 1)), width: 56, opacity: 0.36, points: [[x, HORIZON - 14], [x + 150, HORIZON - 18], [x + 300, HORIZON - 14]] });

p.save();
