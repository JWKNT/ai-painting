// The sky. The sun is at the edge of the sea, a little to the right. Round it the sky is
// gold; higher it is rose, and overhead a deep violet-blue. Great heaped clouds of summer
// stand in it: the light comes at them from below, so their under sides and the sides
// toward the sun are fire and rose, and their tops are violet and grey. Long thin clouds
// lie across the gold, low down, with bright edges.
'use strict';
const { studio, open, W, HORIZON, SUN, SUNWARD, skyColor, glare, heap, nB } = require('./scene');
const { mix, shift, ramp, noise2, clamp, glow } = studio;

const p = open('sky');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.28, dry: 0.04, rag: 0.3, cap: 'round' };
const flow = (x, y) => (nB(x / 340, y / 160) - 0.5) * 0.26 + glare(x, y, 700) * Math.sign(x - SUN.x) * 0.1;
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: flow, color: (x, y) => shift(skyColor(x, Math.min(y, HORIZON)), r.range(-2, 2), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { ...line, opacity: 0.93 } });
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 20, length: 160, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-30, 30), Math.min(y + r.range(-12, 12), HORIZON)), r.range(-3, 3), r.range(-0.02, 0.04), r.range(-0.012, 0.014)), stroke: { ...line, opacity: 0.72 } });
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 9, length: 110, spacing: 1.6, overlap: 0.8, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-10, 10), Math.min(y + r.range(-6, 6), HORIZON)), r.range(-4, 4), r.range(-0.02, 0.05), r.range(-0.02, 0.024)), stroke: { ...line, opacity: 0.6, taper: [0.4, 0.4] } });

// Thin high cloud, drawn out long: rose where the light still reaches it.
for (let k = 0; k < 18; k++) {
  const x = r.range(-100, W - 200), y = r.range(30, 300), len = r.range(260, 640), a = -0.06 + r.range(-0.05, 0.05), pts = [];
  for (let t = 0; t <= 1.001; t += 0.125) pts.push([x + len * t * Math.cos(a), y + len * t * Math.sin(a) + 20 * t * t]);
  const warm = clamp(0.2 + 0.6 * glare(x + len / 2, y, 800) + y / 500, 0, 1);
  p.stroke({ brush: 'soft', color: mix('#6c6498', '#f09088', warm), width: r.range(14, 28), opacity: r.range(0.1, 0.2), taper: [0.4, 0.6], points: pts });
}

// The heaped clouds, far ones first. A place on a cloud is fire as it is turned to the sun and as it is low; its top is out of the light.
const tones = ['#34325e', '#5a4c7c', '#9a5e84', '#e4787a', '#ffa866', '#ffe2a4'];
[[41, -140, 520, 400, 96, 2.5, 0.42, 0.3], [42, 1120, 1760, 418, 86, 2.0, 0.5, 0.8], [43, 560, 900, 446, 40, 1.1, 0.56, 0.9], [44, 1180, 1500, 452, 30, 0.8, 0.6, 1], [45, 420, 980, 210, 64, 0.8, 0.32, 0.4], [46, -100, 300, 130, 60, 0.7, 0.26, 0.1]].forEach(([seed, x0, x1, floor, big, tall, bias, warmth], i) => {
  const puffs = heap(seed, x0, x1, floor, big, tall), top = Math.min(...puffs.map((q) => q[1] - q[2]));
  const tone = (t, x, y) => { const low = clamp((y - top) / (floor - top), 0, 1), k = clamp(t * 0.66 + 0.36 * low + 0.22 * warmth * glare(x, y, 900) - 0.08, 0, 1); return ramp(tones, k); };
  studio.mass(p, puffs, { light: SUNWARD, tones: tone, base: floor, bias, contrast: 0.66, fall: 0, grain: 0.12, mix: 0.34, noise: noise2(6700 + i), stroke: { rag: 0.35, hardness: 0.5 }, layers: [[Math.max(12, big * 0.3), big * 0.85, 0.95, big * 0.09, 0.45], [Math.max(8, big * 0.16), big * 0.5, 0.82, big * 0.05, 0.7], [Math.max(6, big * 0.08), big * 0.28, 0.6, big * 0.04, 1.2]] });
});

// Long thin clouds low over the sea, across the gold: soft, and bright along their under edges.
for (let k = 0; k < 10; k++) {
  const x = SUN.x + r.gauss() * 340, y = r.range(388, 452), len = r.range(200, 480), w = r.range(9, 16), sag = r.range(-4, 4);
  p.tryStroke({ brush: 'soft', color: mix('#a05c78', '#d0787c', r()), width: w * 1.5, opacity: 0.42, taper: [0.6, 0.6], points: [[x - len / 2, y], [x, y - sag], [x + len / 2, y + r.range(-3, 3)]] });
  p.tryStroke({ brush: 'soft', color: mix('#ffb068', '#fff0b4', glare(x, y, 400)), width: 9, opacity: 0.32 + 0.3 * glare(x, y, 500), taper: [0.6, 0.6], points: [[x - len * 0.4, y + w * 0.5], [x, y + w * 0.5 - sag], [x + len * 0.4, y + w * 0.5]] });
}
// The sun: a light with no edge, and in it the round of the sun itself, half down in the sea.
for (const [w, op, n] of [[440, 0.07, 5], [280, 0.1, 6], [160, 0.16, 6], [80, 0.3, 8]]) glow(p, SUN.x, SUN.y, w, mix('#ffb45c', '#fffbe8', 1 - w / 460), op, n, w > 200 ? 0.5 : 0.8);
studio.disc(p, SUN.x, SUN.y, 26, '#fffdf0', 9, { brush: 'soft', opacity: 0.9 });

p.save();
