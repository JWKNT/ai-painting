// The islands that float in the air. Each is a mass of rock that comes to a point below,
// with grass and trees on its flat top; water falls from the edge of it and is blown to
// mist before it reaches the land. They are between us and the pieces at the edge of the
// world, and a little rose with the air.
'use strict';
const { studio, open, far, nA, nC } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('islands');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.14, dry: 0.03, rag: 0.25, cap: 'round' };

function island(cx, top, w, h, d, seed, fall) {
  const half = (y) => w / 2 * Math.pow(clamp(1 - (y - top) / h, 0, 1), 0.72) * (0.9 + 0.2 * nC(seed, y / (h * 0.2))), mid = (y) => cx + w * 0.07 * Math.sin((y - top) / h * 3 + seed);
  // the rock: beds that lean a little; light at the left, violet at the right, and darker toward its point
  p.fill({ inside: (x, y) => y > top - 2 && y < top + h && Math.abs(x - mid(y)) < half(y), bounds: [cx - w * 0.62, top - 2, cx + w * 0.62, top + h], width: Math.max(6, w * 0.04), length: Math.max(18, w * 0.12), spacing: 0.5, overlap: 0.6, angle: () => 1.2 + r.range(-0.25, 0.25),
    color: (x, y) => { const k = (x - mid(y)) / Math.max(1, half(y)), bed = nA(seed + x / (w * 0.2), y / (h * 0.12)); let c = mix('#a88cb4', '#6c5a98', smooth(-0.3, 0.9, k)); c = mix(c, '#f0dce8', smooth(0, -1, k) * 0.5); c = mix(c, '#4a3c7c', (bed - 0.5) * 0.4 + smooth(top + h * 0.3, top + h, y) * 0.3); return far(c, x, y, d); }, stroke: { ...line, rag: 0.35, opacity: 0.96 } });
  // its top: grass, in a thin band that is thicker in the middle, and small trees on it
  for (let k = 0; k < 3; k++) p.tryStroke({ ...line, rag: 0.3, color: far(k === 2 ? '#c8ee8c' : mix('#4cae5c', '#7cd06c', k / 2), cx, top, d), width: Math.max(5, Math.max(6, w * 0.05) * (1 - k * 0.25)), points: [[cx - w * 0.5 + k * w * 0.04, top + 3 - k * 3], [cx - w * 0.06, top - 3 - k * 3], [cx + w * 0.5 - k * w * 0.1, top + 3 - k * 3]] });
  for (let k = 0; k < Math.round(w / 26); k++) { const x = cx + r.range(-0.4, 0.4) * w, s = clamp(w * r.range(0.05, 0.085), 6, 20), l = Math.max(12.4, s * 2.1); p.tryStroke({ ...line, rag: 0.4, color: far(mix('#1f7a5a', '#35966a', r()), x, top, d), width: s, points: [[x - l / 2, top - s * 0.5], [x, top - s * 0.72], [x + l / 2, top - s * 0.5]] }); p.tryStroke({ ...line, rag: 0.4, color: far(mix('#7cd070', '#d0f090', r()), x, top, d), width: Math.max(4.8, s * 0.5), opacity: 0.9, points: [[x - l * 0.42, top - s * 0.84], [x - s * 0.1, top - s * 1.0], [x + l * 0.16, top - s * 0.86]] }); }
  // the water that falls from it: a thin pale line that widens to mist
  for (const [fx, len] of fall) { const x = cx + fx * w, y0 = top + 4, wd = Math.max(5, w * 0.03);
    p.tryStroke({ ...line, rag: 0.3, color: far('#eafaff', x, y0, d * 0.6), width: wd, opacity: 0.95, taper: [0, 0.5], points: [[x, y0], [x + 2, y0 + len * 0.5], [x + 6, y0 + len]] });
    for (let k = 0; k < 4; k++) p.tryStroke({ brush: 'soft', color: '#ffffff', width: Math.max(9, wd * (1.6 + k)), opacity: 0.2 - k * 0.035, taper: [0.5, 0.8], points: [[x + 3 + k * 3, y0 + len * (0.5 + 0.14 * k)], [x + 6 + k * 5, y0 + len * (0.8 + 0.14 * k)], [x + 10 + k * 7, y0 + len * (1.1 + 0.14 * k) + 20]] }); }
  // the shade under its near edge
  p.tryStroke({ brush: 'soft', color: far('#4a3c7c', cx, top, d), width: Math.max(9, w * 0.05), opacity: 0.4, points: [[cx - w * 0.44, top + w * 0.05], [cx, top + w * 0.07], [cx + w * 0.44, top + w * 0.05]] });
}
island(770, 320, 110, 76, 0.5, 1.3, [[0.3, 70]]);
island(1228, 372, 150, 104, 0.4, 4.1, [[-0.32, 100]]);
island(146, 436, 276, 176, 0.24, 7.7, [[0.36, 150], [-0.1, 110]]);

p.save();
