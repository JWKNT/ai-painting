// The sky of a hot afternoon: a bleached blue, thin streaks of high cloud, and the great
// heaped clouds of summer at the right, white where the sun is on them and a pale grey
// blue in their bodies. Low at the right are the tops of the next buildings, far enough to
// be pale, with the frames of signs and a tank on their roofs.
'use strict';
const { studio, open, W, H, SUNWARD, skyColor, heap, nB, hash } = require('./scene');
const { mix, shift, ramp, noise2, clamp } = studio;

const p = open('sky');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.3, dry: 0.04, rag: 0.3, cap: 'round' };
const level = (x, y) => (nB(x / 300, y / 140) - 0.5) * 0.3 - 0.05;
p.fill({ bounds: [0, 0, W, H], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: level, color: (x, y) => shift(skyColor(x, y), r.range(-2, 2), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { ...line, opacity: 0.92 } });
p.fill({ bounds: [0, 0, W, H], width: 20, length: 150, spacing: 0.9, overlap: 0.7, angle: level, color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-14, 14)), r.range(-3, 3), r.range(-0.02, 0.03), r.range(-0.012, 0.014)), stroke: { ...line, opacity: 0.7 } });
// thin high cloud: long soft streaks that rise a little to the right
for (let k = 0; k < 16; k++) { const x = r.range(-80, 1300), y = r.range(20, 300), len = r.range(260, 560), a = -0.12 + r.range(-0.06, 0.06); p.stroke({ brush: 'soft', color: '#ffffff', width: r.range(16, 32), opacity: r.range(0.08, 0.18), taper: [0.4, 0.6], points: [[x, y], [x + len * 0.5 * Math.cos(a), y + len * 0.5 * Math.sin(a) + r.range(-8, 8)], [x + len * Math.cos(a), y + len * Math.sin(a)]] }); }
// the heaped clouds, far ones first
const tones = ['#8ca8c0', '#b4c8d8', '#dce8ec', '#fbfdfa', '#ffffff'];
[[21, 1040, 1700, 1010, 130, 2.6, 0.45], [22, 1180, 1640, 640, 96, 2.4, 0.5], [23, 930, 1330, 1000, 70, 1.5, 0.5], [24, 60, 520, 250, 46, 0.7, 0.6]].forEach(([seed, x0, x1, floor, big, tall, bias], i) => {
  studio.mass(p, heap(seed, x0, x1, floor, big, tall), { light: SUNWARD, tones: (t) => ramp(tones, t), base: floor, bias, contrast: 0.6, fall: 0.2, grain: 0.12, mix: 0.34, noise: noise2(7300 + i), stroke: { rag: 0.35, hardness: 0.5 }, layers: [[Math.max(12, big * 0.3), big * 0.85, 0.95, big * 0.09, 0.45], [Math.max(8, big * 0.16), big * 0.5, 0.8, big * 0.05, 0.7]], crown: '#ffffff', crownOpacity: 0.7, crownSpan: 0.5 });
});

// The tops of the next buildings, low at the right: pale blocks in the haze, one behind another.
function block(x0, x1, top, wall, o = {}) {
  for (let y = top + 4; y < H + 6; y += 7.6) p.stroke({ brush: 'bristle', mix: 0.1, rag: 0.1, cap: 'flat', color: mix(wall, '#8898a8', clamp((y - top) / 500, 0, 1) * 0.4), width: 9, points: [[x0, y], [x1, y + r.range(-0.3, 0.3)]] });
  p.stroke({ brush: 'bristle', mix: 0.1, cap: 'flat', color: mix(wall, '#ffffff', 0.5), width: 5, points: [[x0 - 2, top + 1], [x1 + 2, top + 1]] });
  for (let y = top + 22; y < H; y += 26) for (let x = x0 + 8; x + 26 < x1 - 4; x += 34) if (hash(Math.floor(x), Math.floor(y)) < 0.8) p.tryStroke({ brush: 'bristle', mix: 0.1, cap: 'flat', color: hash(x, y) < 0.3 ? '#dcecf0' : mix('#5c7890', '#7c98ac', r()), width: 9, opacity: 0.8, points: [[x, y], [x + 24, y]] });   // its windows
  if (o.sign) { const [sx, sw, sh] = o.sign; for (let y = top - sh + 5; y < top - 6; y += 8) p.stroke({ brush: 'bristle', mix: 0.1, cap: 'flat', color: o.signColor || '#d8c8a0', width: 9.5, points: [[sx, y], [sx + sw, y]] }); for (const x of [sx + 10, sx + sw - 10]) p.tryStroke({ brush: 'round', color: '#5c6c7c', width: 4, points: [[x, top - 4], [x, top + 3 + 12.4]] }); }   // a sign on its roof, on two legs
  if (o.tank) { const tx = o.tank; for (let y = top - 30; y < top - 2; y += 7.4) p.stroke({ brush: 'bristle', mix: 0.1, cap: 'flat', color: mix('#a8b4bc', '#dce4e4', (tx - x0) / (x1 - x0)), width: 8.6, points: [[tx, y], [tx + 40, y]] }); }
  if (o.mast) p.tryStroke({ brush: 'round', color: '#6c7c8c', width: 4, points: [[o.mast, top], [o.mast + 2, top - 70]] });
}
block(1250, 1460, 812, '#b8c4cc', { sign: [1270, 120, 66], signColor: '#e0b8a8', mast: 1436 });
block(1420, 1640, 742, '#c8ccc8', { tank: 1500, sign: [1560, 60, 50], signColor: '#a8c8d8' });
block(1100, 1290, 892, '#c4ccd0', { tank: 1150 });

p.save();
