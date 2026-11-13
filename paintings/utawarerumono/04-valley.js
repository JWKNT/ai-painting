// The floor of the valley: fields of ripe grain in strips, stubble, green, bare earth; a river
// that takes the light of the sky; lines of trees; and the roofs of the farms.
'use strict';
const { studio, open, W, FOOT, far, nA, nB, nC, brow, slopeLine, skyColor } = require('./scene');
const { mix, clamp, smooth, wave } = studio;

const p = open('valley');
const r = p.rng;
const near = (y) => clamp((y - FOOT) / 300, 0, 1);                       // 0 at the foot of the mountains, 1 under the ridge
const open2 = (x, y, m = 0) => y > FOOT + 8 && y < brow(x) + 8 && y < slopeLine(x) - m;
const field = (x, y) => {
  const k = near(y), cell = nA(x / (50 + 260 * k) + 11, y / (7 + 34 * k)), c2 = nB(x / (30 + 200 * k), y / (5 + 30 * k) + 7);
  let c = cell < 0.3 ? '#d9b452' : cell < 0.5 ? '#c79a4c' : cell < 0.66 ? '#93a052' : cell < 0.82 ? '#e2c468' : '#8c6c46';
  c = mix(c, c2 > 0.5 ? '#f0d47c' : '#7c7444', Math.abs(c2 - 0.5) * 0.5);
  return far(c, x, y, 0.66 - 0.44 * k);
};
const level = () => r.range(-0.03, 0.03), stroke = { brush: 'bristle', opacity: 0.94, mix: 0.2, dry: 0.04, rag: 0.25 };
p.fill({ inside: (x, y) => open2(x, y), bounds: [0, FOOT, W, FOOT + 110], width: 6.5, length: 64, spacing: 0.5, angle: level, color: field, stroke });
p.fill({ inside: (x, y) => open2(x, y), bounds: [0, FOOT + 96, W, 720], width: 12, length: 120, spacing: 0.5, angle: level, color: field, stroke });

// The river: from the far right it comes toward us in long bends and goes off behind the ridge.
// It is the brightest thing in the valley, for it takes the light of the sky; the strokes in
// it lie level, as water does.
{
  const pts = [[1640, 396], [1480, 402], [1330, 414], [1190, 432], [1110, 458], [1170, 488], [1300, 514], [1410, 548], [1470, 590], [1390, 628], [1250, 652], [1120, 672]];
  const toRiver = (x, y) => { let best = 1e9; for (let i = 0; i < pts.length - 1; i++) { const [ax, ay] = pts[i], [bx, by] = pts[i + 1], t = clamp(((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2), 0, 1); best = Math.min(best, Math.hypot(x - ax - (bx - ax) * t, (y - ay - (by - ay) * t) * 2.2)); } return best; };
  const half = (y) => 5 + 30 * near(y) * near(y) + 5 * near(y);
  const water = (x, y) => { const glare = smooth(600, 1600, x), rip = nC(x / 60, y / 3.5); return mix(mix(skyColor(x, 40 + 260 * near(y)), '#fff6cc', 0.3 + 0.55 * glare), rip > 0.6 ? '#ffffff' : '#b8a4b0', Math.abs(rip - 0.5) * 0.5); };
  p.fill({ inside: (x, y) => toRiver(x, y) < half(y) + 3 && open2(x, y), bounds: [1040, 384, W, 690], width: 6.5, length: 44, spacing: 0.5, angle: level, color: (x, y) => far('#57533a', x, y, 0.5 - 0.3 * near(y)), stroke: { ...stroke, rag: 0.4 } });   // its banks
  p.fill({ inside: (x, y) => toRiver(x, y) < half(y) && open2(x, y), bounds: [1040, 384, W, 690], width: 5.5, length: 40, spacing: 0.5, angle: level, color: water, stroke: { ...stroke, mix: 0.1, rag: 0.15 } });
}

// Trees between the fields. Far off they are lines of dark with the sun along the top; nearer, each stands by itself with the sun on one side of it.
for (let k = 0; k < 230; k++) {
  const y = FOOT + 14 + Math.pow(r(), 1.3) * 290, x = r.range(0, W), kk = near(y);
  if (!open2(x, y, 10) || nC(x / (40 + 200 * kk), y / (8 + 40 * kk) + 3) < 0.55) continue;
  const d = 0.6 - 0.4 * kk, s = r(), dark = s < 0.5 ? '#2c4034' : s < 0.8 ? '#6a3422' : '#74582a', lit = s < 0.5 ? '#6c8a50' : s < 0.8 ? '#e07840' : '#f4c458';
  if (kk < 0.45) {
    const len = r.range(16, 44), w = r.range(5, 7.5);
    p.tryStroke({ brush: 'bristle', color: far(dark, x, y, d), width: w, mix: 0.15, dry: 0.04, rag: 0.35, cap: 'round', points: [[x - len / 2, y], [x + len / 2, y + r.range(-1.5, 1.5)]] });
    p.tryStroke({ brush: 'bristle', color: far(lit, x, y, d), width: 4.8, opacity: 0.85, mix: 0.15, dry: 0.04, rag: 0.4, cap: 'round', points: [[x - len * 0.3, y - w * 0.45], [x + len * 0.5, y - w * 0.45]] });
  } else {
    const h = (14 + 22 * kk) * r.range(0.8, 1.2), w = Math.max(4.8, h * 0.5);
    p.tryStroke({ brush: 'soft', color: far('#3c3c44', x, y, d), width: Math.max(8.2, w), opacity: 0.3, points: [[x - w * 0.4, y + 1], [x - w * 0.4 - h * 1.8, y + 3]] });      // its long shadow
    p.tryStroke({ brush: 'bristle', color: far(dark, x, y, d), width: w, mix: 0.15, dry: 0.04, rag: 0.3, cap: 'round', taper: [0.1, 0.6], points: [[x, y], [x + r.range(-1, 1), y - h * 0.6], [x + r.range(-2, 2), y - h * 1.15]] });
    p.tryStroke({ brush: 'bristle', color: far(lit, x, y, d), width: Math.max(4.8, w * 0.5), mix: 0.15, dry: 0.04, rag: 0.3, cap: 'round', taper: [0.1, 0.6], points: [[x + w * 0.24, y - 3], [x + w * 0.2, y - h * 1.08]] });
  }
}

// Farms: a few roofs together, each a light stroke where the sun is on the thatch over a dark one.
for (const [cx, cy, n] of [[1210, 396, 5], [1440, 446, 6], [700, 420, 5], [1500, 560, 7], [1200, 560, 5], [620, 470, 4], [1060, 420, 4]]) {
  for (let k = 0; k < n; k++) {
    const kk = near(cy), x = cx + r.gauss() * (16 + 40 * kk), y = cy + r.gauss() * (3 + 9 * kk), w = Math.max(12.6, 10 + 16 * kk), d = 0.6 - 0.4 * kk;
    if (!open2(x, y, 12)) continue;
    p.tryStroke({ brush: 'bristle', color: far('#4a3a36', x, y, d), width: Math.max(4.8, w * 0.36), mix: 0.1, dry: 0.03, rag: 0.15, cap: 'flat', points: [[x - w / 2, y], [x + w / 2, y + r.range(-1, 1)]] });
    p.tryStroke({ brush: 'bristle', color: far(mix('#e6bc74', '#c89858', r()), x, y, d), width: Math.max(4.8, w * 0.3), mix: 0.1, dry: 0.03, rag: 0.2, cap: 'flat', points: [[x - w * 0.42, y - w * 0.3], [x + w * 0.5, y - w * 0.3 + r.range(-1, 1)]] });
  }
}

// The gold air of the evening over the far half of it, thicker toward the sun.
for (let k = 0; k < 14; k++) {
  const x = r.range(200, W - 200), y = FOOT + r.range(6, 150), len = r.range(300, 620);
  p.stroke({ brush: 'soft', color: far('#ffe9b6', x + len / 2, y, 0.3), width: r.range(26, 50), opacity: r.range(0.08, 0.16) * (0.6 + 0.8 * x / W), points: wave(x, y, x + len, y + r.range(-4, 4), 3, 1, 6) });
}

p.save();
