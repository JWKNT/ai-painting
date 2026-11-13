// The sky: the deep blue of a summer noon, the long white line that an aeroplane has left
// across it, and the great heaped clouds of summer, white where the sun is on them and blue
// in their hollows and under them.
'use strict';
const { studio, open, W, SUNWARD, skyColor, nB } = require('./scene');
const { shift, ramp, noise2, clamp } = studio;

const p = open('sky');
const r = p.rng;
const level = (x, y) => (nB(x / 300, y / 140) - 0.5) * 0.3 - 0.04;
p.fill({ bounds: [0, 0, W, 690], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: level, color: (x, y) => shift(skyColor(x, y), r.range(-2, 2), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { brush: 'bristle', opacity: 0.92, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, 690], width: 20, length: 150, spacing: 0.9, overlap: 0.7, angle: level, color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-14, 14)), r.range(-3, 3), r.range(-0.02, 0.03), r.range(-0.012, 0.014)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });

// The line of the aeroplane: thin and sharp at its head, wide and soft at its tail.
p.stroke({ brush: 'soft', color: '#ffffff', width: 16, opacity: 0.3, taper: [0, 0.6], points: [[60, 250], [420, 176], [760, 112]] });
p.stroke({ brush: 'bristle', color: '#ffffff', width: 5, opacity: 0.85, mix: 0.1, dry: 0.05, rag: 0.3, taper: [0.7, 0], points: [[300, 201], [620, 139], [900, 86]] });

// The clouds. Each is a heap of round tops on a level floor.
const cloud = (t) => ramp(['#6f9bdc', '#a4c4ee', '#e2eefb', '#ffffff', '#ffffff'], t);
let seed = 0;
for (const [x0, x1, floor, big, tall] of [[1020, 1720, 540, 120, 2.6], [-120, 420, 660, 96, 1.7], [520, 820, 600, 50, 1], [1300, 1650, 200, 44, 0.5]]) {
  const puffs = [], n = noise2(1500 + ++seed);
  for (let x = x0; x < x1; x += big * 0.45) {
    const hump = Math.pow(Math.sin(Math.PI * clamp((x - x0) / (x1 - x0), 0.03, 0.97)), 0.8), rad = big * r.range(0.5, 1) * (0.4 + 0.75 * hump);
    puffs.push([x + r.range(-12, 12), floor - rad * 0.7 - big * tall * hump * r.range(0.15, 1), rad]);
    puffs.push([x + r.range(-20, 20), floor - rad * 0.6 - big * tall * hump * r.range(0, 0.5), rad * r.range(0.8, 1.1)]);
  }
  studio.mass(p, puffs.filter((q) => q[2] > 10), { light: SUNWARD, tones: cloud, base: floor, bias: 0.6, contrast: 0.6, fall: 0.3, grain: 0.14, mix: 0.3, noise: n, stroke: { rag: 0.35, hardness: 0.55 }, layers: [[Math.max(11, big * 0.26), big * 0.8, 0.95, big * 0.09, 0.45], [Math.max(7, big * 0.14), big * 0.45, 0.85, big * 0.05, 0.75]] });
}

p.save();
