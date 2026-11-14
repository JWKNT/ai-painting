// The sky of a summer noon: a deep blue, paler toward the sea. One great cloud stands in
// it, heaped up as high as a mountain, white where the sun is on it and blue-grey in its
// folds and under it; smaller heaps lie along the edge of the sea, and thin white streaks
// are high overhead.
'use strict';
const { studio, open, W, HORIZON, SUNWARD, skyColor, heap, nB } = require('./scene');
const { mix, shift, ramp, noise2, clamp, glow } = studio;

const p = open('sky');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.28, dry: 0.04, rag: 0.3, cap: 'round' };
const flow = (x, y) => -0.04 + (nB(x / 340, y / 160) - 0.5) * 0.24;
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: flow, color: (x, y) => shift(skyColor(x, Math.min(y, HORIZON)), r.range(-2, 2), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { ...line, opacity: 0.93 } });
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 20, length: 160, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-30, 30), Math.min(y + r.range(-12, 12), HORIZON)), r.range(-3, 3), r.range(-0.02, 0.04), r.range(-0.012, 0.014)), stroke: { ...line, opacity: 0.72 } });
// thin high cloud
for (let k = 0; k < 12; k++) { const x = r.range(-100, W - 200), y = r.range(20, 200), len = r.range(260, 620), a = -0.1 + r.range(-0.05, 0.05), pts = []; for (let t = 0; t <= 1.001; t += 0.125) pts.push([x + len * t * Math.cos(a), y + len * t * Math.sin(a) + 16 * t * t]); p.stroke({ brush: 'soft', color: '#e4f2fc', width: r.range(12, 24), opacity: r.range(0.08, 0.18), taper: [0.4, 0.6], points: pts }); }
// The heaped clouds, far ones first. White in the sun; blue-grey in the folds and under.
const tones = ['#6f93c4', '#93b1d6', '#bcd0e6', '#e2ecf6', '#f8fbfd', '#ffffff'];
[[51, 1040, 1700, 536, 44, 1.0, 0.56], [52, -140, 360, 540, 54, 1.2, 0.54], [53, 250, 1080, 532, 150, 2.5, 0.5], [54, 470, 860, 300, 96, 1.2, 0.56]].forEach(([seed, x0, x1, floor, big, tall, bias], i) => {
  studio.mass(p, heap(seed, x0, x1, floor, big, tall), { light: SUNWARD, tones: (t) => ramp(tones, clamp(t, 0, 1)), base: floor, bias, contrast: 0.66, fall: 0.3, grain: 0.12, mix: 0.34, noise: noise2(6700 + i), stroke: { rag: 0.35, hardness: 0.5 }, layers: [[Math.max(12, big * 0.3), big * 0.85, 0.95, big * 0.09, 0.45], [Math.max(8, big * 0.16), big * 0.5, 0.82, big * 0.05, 0.7], [Math.max(6, big * 0.08), big * 0.28, 0.6, big * 0.04, 1.2]] });
});
// the haze at the edge of the sea, and the light of the sun, which is out of the picture at the upper left
for (let k = 0; k < 12; k++) { const x = r.range(-200, W - 200), len = r.range(300, 700), y = r.range(HORIZON - 26, HORIZON + 2); p.stroke({ brush: 'soft', color: '#d8eef8', width: r.range(14, 28), opacity: r.range(0.1, 0.2), points: [[x, y], [x + len / 2, y + r.range(-2, 2)], [x + len, y]] }); }
for (const [w, op] of [[520, 0.08], [320, 0.1]]) glow(p, -40, -60, w, '#ffffff', op, 5);
void mix;

p.save();
