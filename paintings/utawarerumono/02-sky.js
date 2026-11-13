// The sky: the gold of the low sun at the right, rose across the middle, evening blue at the
// left, and long clouds that are lit from below on the side of the sun.
'use strict';
const { studio, open, W, FOOT, SUN, skyColor, nB } = require('./scene');
const { mix, shift, ramp, noise2, clamp } = studio;

const p = open('sky');
const r = p.rng;
const level = (x, y) => (nB(x / 300, y / 120) - 0.5) * 0.24 - 0.04 * (1 - x / W);
p.fill({ bounds: [0, 0, W, FOOT + 20], width: 40, length: 280, spacing: 0.5, overlap: 0.55, angle: level, color: (x, y) => shift(skyColor(x, y), r.range(-3, 3), r.range(-0.03, 0.03), r.range(-0.012, 0.012)), stroke: { brush: 'bristle', opacity: 0.92, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, FOOT + 20], width: 20, length: 160, spacing: 0.9, overlap: 0.7, angle: level, color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-14, 14)), r.range(-4, 4), r.range(-0.02, 0.04), r.range(-0.014, 0.016)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });

// The glow of the sun at the right edge.
for (const [w, o] of [[420, 0.16], [260, 0.2], [150, 0.24]]) p.stroke({ brush: 'soft', color: '#fff6cc', width: w, opacity: o, points: [[W + 60, -200], [W + 20, 250], [W + 60, 700]] });

// The clouds: long, level, in rows that come down the sky toward the sun.
const cloud = (t, x, y) => {
  const k = clamp(Math.hypot(x - SUN.x, y - SUN.y) / 1700, 0, 1);                             // far from the sun they are greyer and cooler
  return ramp([mix('#8a6c94', '#5c6494', k), mix('#c8808c', '#8878a4', k), mix('#f6ac74', '#c898a4', k), mix('#ffe2a0', '#ecc0b0', k)], t);
};
let seed = 0;
for (const [x0, x1, y, big] of [[60, 700, 96, 42], [470, 1240, 158, 46], [900, 1660, 220, 40], [880, 1460, 62, 32], [120, 600, 240, 28], [1100, 1580, 296, 20], [620, 1000, 268, 18], [-60, 320, 164, 30]]) {
  const puffs = [], n = noise2(300 + ++seed);
  for (let x = x0; x < x1; x += big * 0.8) puffs.push([x + r.range(-8, 8), y + r.range(-big * 0.3, big * 0.3) - big * 0.5 * Math.sin((x - x0) / (x1 - x0) * Math.PI), big * r.range(0.6, 1.1) * (0.5 + 0.7 * Math.sin((x - x0) / (x1 - x0) * Math.PI))]);
  studio.mass(p, puffs.filter((q) => q[2] > 7), { light: (x, y) => { const dx = SUN.x - x, dy = SUN.y + 260 - y, k = Math.hypot(dx, dy); return [dx / k, dy / k]; }, tones: cloud, base: y + big * 0.45, bias: 0.5, contrast: 0.7, grain: 0.22, mix: 0.32, noise: n, stroke: { rag: 0.4, hardness: 0.6 }, flow: (x, y) => (n(x / 60, y / 30) - 0.5) * 0.5, layers: [[Math.max(9, big * 0.5), big * 2.4, 0.9, big * 0.16, 0.45], [Math.max(6, big * 0.28), big * 1.4, 0.8, big * 0.1, 0.75]] });
}

p.save();
