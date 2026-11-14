// The sky. The sun has gone down at the right, and the sky there is gold. Overhead it is a
// deep clear blue-green. Great heaped clouds stand in it: the light comes at them from
// below and from the right, so their right sides and their under parts are rose and gold,
// and their tops and left sides are a blue-violet grey. Low at the right, long thin clouds
// lie across the gold.
'use strict';
const { studio, open, W, HORIZON, SUN, SUNWARD, skyColor, glare, heap, nB } = require('./scene');
const { mix, shift, ramp, noise2, clamp, glow } = studio;

const p = open('sky');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.28, dry: 0.04, rag: 0.3, cap: 'round' };
// the strokes of the sky bend a little round the place where the sun went down
const flow = (x, y) => { const k = glare(x, y, 700), a = Math.atan2(y - SUN.y, x - SUN.x) + Math.PI / 2; let b = a; if (b > Math.PI / 2) b -= Math.PI; return b * k * 0.16 + (nB(x / 320, y / 150) - 0.5) * 0.24; };
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: flow, color: (x, y) => shift(skyColor(x, Math.min(y, HORIZON)), r.range(-2, 2), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { ...line, opacity: 0.93 } });
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 20, length: 160, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-30, 30), Math.min(y + r.range(-12, 12), HORIZON)), r.range(-3, 3), r.range(-0.02, 0.04), r.range(-0.012, 0.014)), stroke: { ...line, opacity: 0.72 } });
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 9, length: 110, spacing: 1.5, overlap: 0.8, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-10, 10), Math.min(y + r.range(-6, 6), HORIZON)), r.range(-4, 4), r.range(-0.02, 0.05), r.range(-0.02, 0.024)), stroke: { ...line, opacity: 0.6, taper: [0.4, 0.4] } });

// Thin high cloud, drawn out long: rose where the light still reaches it.
for (let k = 0; k < 20; k++) {
  const x = r.range(-100, W - 200), y = r.range(30, 330), len = r.range(260, 620), a = -0.1 + r.range(-0.06, 0.06), pts = [];
  for (let t = 0; t <= 1.001; t += 0.125) pts.push([x + len * t * Math.cos(a), y + len * t * Math.sin(a) + 26 * t * t]);
  const warm = clamp(0.3 + 0.7 * glare(x + len / 2, y, 900) + (y / 600), 0, 1);
  p.stroke({ brush: 'soft', color: mix('#8ca8b4', '#f8a890', warm), width: r.range(14, 28), opacity: r.range(0.1, 0.2), taper: [0.4, 0.6], points: pts });
  for (let i = 0; i < 2; i++) { const o = r.range(-8, 8); p.tryStroke({ brush: 'soft', color: mix('#b4c8cc', '#ffc8a8', warm), width: r.range(8.6, 12), opacity: r.range(0.1, 0.2), taper: [0.6, 0.7], points: pts.slice(1, 8).map(([px, py]) => [px, py + o]) }); }
}

// The heaped clouds, far ones first. A place on a cloud takes rose and gold as it is turned to the light and as it is low;
// the top of a tall cloud is out of the light, and grey.
const tones = ['#33405e', '#5a5a7c', '#9c7890', '#e88c7c', '#ffc094', '#ffe8c0'];
[[31, 1010, 1700, 546, 44, 1.0, 0.56, 0.55], [32, -160, 560, 470, 78, 1.9, 0.4, 0.0], [33, 520, 1030, 500, 54, 1.3, 0.48, 0.3], [34, 1240, 1760, 420, 100, 2.4, 0.5, 0.6], [35, 620, 1180, 250, 60, 0.9, 0.36, 0.4], [36, -100, 380, 180, 70, 0.8, 0.3, 0.1]].forEach(([seed, x0, x1, floor, big, tall, bias, warmth], i) => {
  const puffs = heap(seed, x0, x1, floor, big, tall), top = Math.min(...puffs.map((q) => q[1] - q[2]));
  const tone = (t, x, y) => { const low = clamp((y - top) / (floor - top), 0, 1), k = clamp(t * 0.7 + 0.34 * low + 0.2 * warmth * glare(x, y, 900) - 0.06, 0, 1); return ramp(tones, k); };
  studio.mass(p, puffs, { light: SUNWARD, tones: tone, base: floor, bias, contrast: 0.66, fall: 0, grain: 0.12, mix: 0.34, noise: noise2(1400 + i), stroke: { rag: 0.35, hardness: 0.5 }, layers: [[Math.max(12, big * 0.3), big * 0.85, 0.95, big * 0.09, 0.45], [Math.max(8, big * 0.16), big * 0.5, 0.82, big * 0.05, 0.7], [Math.max(6, big * 0.08), big * 0.28, 0.6, big * 0.04, 1.2]] });
});

// Long thin clouds low at the right, across the gold: soft, and bright along their under edges.
for (let k = 0; k < 9; k++) {
  const x = SUN.x + r.gauss() * 300, y = r.range(486, 548), len = r.range(200, 460), w = r.range(9, 16), sag = r.range(-5, 5);
  p.tryStroke({ brush: 'soft', color: mix('#a06c74', '#c8847c', r()), width: w * 1.5, opacity: 0.4, taper: [0.6, 0.6], points: [[x - len / 2, y], [x, y - sag], [x + len / 2, y + r.range(-3, 3)]] });
  p.tryStroke({ brush: 'soft', color: mix('#ffb070', '#ffe9b0', glare(x, y, 400)), width: 9, opacity: 0.3 + 0.3 * glare(x, y, 500), taper: [0.6, 0.6], points: [[x - len * 0.4, y + w * 0.5], [x, y + w * 0.5 - sag], [x + len * 0.4, y + w * 0.5]] });
}
// The light at the place where the sun went down: it has no edge, and it is wider than it is high.
for (const [w, op, n] of [[420, 0.07, 4], [260, 0.1, 5], [150, 0.16, 6]]) glow(p, SUN.x, SUN.y - 8, w, mix('#ffb060', '#fff4d0', 1 - w / 440), op, n, 0.42);

p.save();
