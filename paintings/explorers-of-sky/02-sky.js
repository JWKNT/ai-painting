// The sky: violet overhead, rose in the middle, gold round the sun; the sun itself, low over
// the sea; and banks of cloud along the horizon, violet, with the sun on their edges.
'use strict';
const { studio, open, W, HORIZON, SUN, skyColor, glow, nB } = require('./scene');
const { mix, shift, ramp, noise2, clamp } = studio;

const p = open('sky');
const r = p.rng;
// The strokes lie level far from the sun and bend round it close by.
const flow = (x, y) => { const k = glow(x, y, 420); let a = Math.atan2(x - SUN.x, -1.4 * (y - SUN.y)); if (a > Math.PI / 2) a -= Math.PI; else if (a < -Math.PI / 2) a += Math.PI; return a * k * 0.8 + (nB(x / 300, y / 140) - 0.5) * 0.3 * (1 - k); };
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: flow, color: (x, y) => shift(skyColor(x, y), r.range(-3, 3), r.range(-0.03, 0.03), r.range(-0.012, 0.012)), stroke: { brush: 'bristle', opacity: 0.92, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 20, length: 150, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-14, 14)), r.range(-4, 4), r.range(-0.02, 0.04), r.range(-0.014, 0.016)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });

// The sun: its glow, wide and then close, and its disc.
for (const [w, o] of [[420, 0.14], [240, 0.2], [130, 0.3]]) p.stroke({ brush: 'soft', color: '#fff2b4', width: w, opacity: o, points: [[SUN.x - w * 1.05, SUN.y + 8], [SUN.x, SUN.y - 6], [SUN.x + w * 1.05, SUN.y + 8]] });
studio.disc(p, SUN.x, SUN.y, SUN.r, '#fffbe0', 12, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round' });
p.stroke({ brush: 'soft', color: '#ffffff', width: 40, opacity: 0.5, points: [[SUN.x - 41, SUN.y], [SUN.x + 41, SUN.y]] });

// The clouds. Each bank is a heap of round tops on a level floor. Their bodies are violet,
// and the sun is on the side of every top that is turned to it.
const cloud = (t, x, y) => { const k = clamp(glow(x, y, 640) * 1.2, 0, 1); return ramp([mix('#7a68ae', '#a8709c', k), mix('#a488c8', '#e088a4', k), mix('#e8a4c8', '#ffc08c', k), mix('#ffd6e0', '#fff0b8', k)], t); };
const toSun = (x, y) => { const dx = SUN.x - x, dy = SUN.y - 40 - y, l = Math.hypot(dx, dy) || 1; return [dx / l * 0.75, dy / l * 0.75 - 0.35]; };
let seed = 0;
for (const [x0, x1, floor, big] of [[-60, 380, 543, 78], [300, 720, 543, 56], [1180, 1660, 543, 70], [640, 900, 543, 34], [1120, 1300, 543, 30]]) {
  const puffs = [], n = noise2(500 + ++seed);
  for (let x = x0; x < x1; x += big * 0.62) { const hump = Math.sin(Math.PI * clamp((x - x0) / (x1 - x0), 0.04, 0.96)), rad = big * r.range(0.55, 1) * (0.45 + 0.75 * hump); puffs.push([x + r.range(-10, 10), floor - rad * r.range(0.55, 1.1) - big * 0.5 * hump * r(), rad]); }
  studio.mass(p, puffs.filter((q) => q[2] > 9), { light: toSun, tones: cloud, base: floor, bias: 0.44, contrast: 0.75, grain: 0.2, mix: 0.3, noise: n, stroke: { rag: 0.35, hardness: 0.6 }, layers: [[Math.max(10, big * 0.3), big * 0.9, 0.94, big * 0.1, 0.45], [Math.max(6.5, big * 0.16), big * 0.5, 0.82, big * 0.06, 0.75]] });
}
// Thin cloud high up: long soft streaks, each made of a few lengths that lie over one another, violet above and rose where the sun is under them.
for (const [x, y, len, w] of [[120, 150, 520, 20], [560, 96, 420, 16], [1090, 180, 440, 18], [820, 250, 300, 13], [300, 300, 340, 14], [1380, 110, 300, 14]]) {
  for (let k = 0; k < 4; k++) {
    const x0 = x + len * r.range(0, 0.5), l = len * r.range(0.35, 0.6), yy = y + r.range(-w * 0.4, w * 0.4);
    p.stroke({ brush: 'soft', color: mix('#9c86c8', skyColor(x0 + l / 2, yy), 0.4), width: w * r.range(0.9, 1.4), opacity: 0.3, taper: [0.5, 0.5], points: [[x0, yy], [x0 + l * 0.5, yy - 4], [x0 + l, yy + 1]] });
    p.stroke({ brush: 'soft', color: mix('#ffc4cc', '#ffe2b0', clamp(glow(x0 + l / 2, yy, 700), 0, 1)), width: Math.max(8.2, w * 0.6), opacity: 0.34, taper: [0.5, 0.5], points: [[x0 + l * 0.1, yy + w * 0.45], [x0 + l * 0.5, yy + w * 0.4 - 3], [x0 + l * 0.9, yy + w * 0.5]] });
  }
}

p.save();
