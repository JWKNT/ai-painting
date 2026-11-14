// The sky and the far land. The sun is down behind the place of the school. Long clouds lie across the sky,
// dark above and red and gold under, where the light still reaches them. The first stars
// are out at the right. Far off are hills with woods on them, blue in the evening. In
// front of the hills lie the rice fields, full of water: each is a bright piece of the
// sky, with a dark bank round it, and the young rice stands in it in thin rows.
'use strict';
const { studio, open, W, HORIZON, GLOW, skyColor, glare, far, nB, nC, through } = require('./scene');
const { mix, shift, smooth, glow } = studio;

const p = open('sky');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.28, dry: 0.04, rag: 0.3, cap: 'round' };
const flow = (x, y) => -0.03 + (nB(x / 340, y / 160) - 0.5) * 0.22;
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: flow, color: (x, y) => shift(skyColor(x, Math.min(y, HORIZON)), r.range(-2, 2), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { ...line, opacity: 0.93 } });
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 20, length: 160, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-30, 30), Math.min(y + r.range(-12, 12), HORIZON)), r.range(-3, 3), r.range(-0.02, 0.04), r.range(-0.012, 0.014)), stroke: { ...line, opacity: 0.72 } });
// the first stars, high up, where the sky is dark
for (let k = 0; k < 90; k++) { const x = r.range(40, W - 10), y = r.range(10, 240); if (r() > (0.35 + 0.65 * Math.abs(x - 640) / 960) * (1 - y / 260)) continue; const b = Math.pow(r(), 2.2); p.tryStroke({ brush: 'round', color: mix('#b4b4e8', '#ffffff', b), width: 4, opacity: 0.2 + 0.6 * b, taper: [0.6, 0.6], points: [[x - 6.2, y], [x + 6.2, y]] }); }
// long clouds: each a dark band with a bright under edge, brighter toward the place where the sun went down.
// None lies behind the place of the cat: there the sky is clear.
for (const [x, y, len, w] of [[-80, 96, 700, 30], [760, 60, 820, 22], [-120, 250, 640, 34], [-60, 372, 560, 26], [80, 462, 540, 20], [1380, 250, 420, 22], [1420, 420, 380, 18], [330, 168, 420, 16]]) {
  const k = glare(x + len * 0.4, y, 800), pts = [[x, y + 10], [x + len * 0.3, y - 6], [x + len * 0.7, y - 2], [x + len, y + 12]];
  p.stroke({ brush: 'soft', color: mix('#3c3470', '#74487c', k), width: w * 1.7, opacity: 0.5, taper: [0.5, 0.5], points: pts });
  p.stroke({ ...line, color: mix('#4c3c78', '#8c5480', k), width: w, opacity: 0.8, taper: [0.5, 0.5], points: pts });
  p.tryStroke({ ...line, color: mix('#d0647c', '#ffc868', k), width: Math.max(6, w * 0.4), opacity: 0.5 + 0.45 * k, taper: [0.5, 0.5], points: pts.map(([a, b]) => [a, b + w * 0.42]) });
}
// the light where the sun went down
for (const [w, op, n] of [[420, 0.07, 5], [260, 0.1, 6], [150, 0.14, 6]]) glow(p, GLOW.x, GLOW.y - 6, w, mix('#ffb060', '#fff4d0', 1 - w / 440), op, n, 0.45);

// ---------------------------------------------------------------- the far hills: two rows, with woods on them
for (const [pts, c, d] of [[[[-20, 500], [160, 468], [330, 496], [520, 470], [720, 500], [900, 474], [1100, 498], [1300, 462], [1480, 490], [1620, 470]], '#3c3c78', 0.56], [[[-20, 540], [220, 520], [420, 544], [640, 524], [860, 546], [1080, 526], [1300, 544], [1620, 528]], '#2c2c60', 0.34]]) {
  const top = through(pts);
  p.fill({ inside: (x, y) => y > top(x) + 5 * (nC(x / 18, d * 9) - 0.5) && y < HORIZON + 8, bounds: [0, 440, W, HORIZON + 8], width: 7, length: 26, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.8, 0.8), color: (x, y) => far(mix(c, '#b85c58', smooth(24, 0, y - top(x)) * glare(x, y, 700) * 0.8), x, y, d), stroke: { ...line, rag: 0.4, opacity: 0.95 } });
}

// ---------------------------------------------------------------- the rice fields
// They lie in front of the hills, one behind another. Each is water: it has the color of the sky over it. Between them are low dark banks.
const FIELD0 = HORIZON + 4, FIELD1 = 730;
const water = (x, y) => { const t = (y - FIELD0) / (FIELD1 - FIELD0), up = HORIZON - 20 - t * 420; return mix(skyColor(x + (nB(x / 60, y / 5) - 0.5) * 40, Math.max(30, up)), '#2c2858', 0.16 + 0.16 * t); };
p.fill({ bounds: [0, FIELD0 - 2, W, FIELD1 + 4], width: 6, length: 70, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.01, 0.01), color: water, stroke: { ...line, rag: 0.1, opacity: 0.96 } });
// the banks: level ones, further apart near us; and ones that go away from us to one point
const rows = [FIELD0, 580, 596, 618, 648, 686, FIELD1];
for (const y of rows) p.tryStroke({ ...line, color: mix('#1c1c40', '#2c2c58', r()), width: 5 + (y - FIELD0) * 0.03, points: [[-10, y + r.range(-2, 2)], [W * 0.3, y + r.range(-2, 2)], [W * 0.7, y + r.range(-2, 2)], [W + 10, y + r.range(-2, 2)]] });
// The banks that go away from us are not in one line from field to field: each row of fields has its own.
for (let i = 0; i < rows.length - 1; i++) {
  const ya = rows[i], yb = rows[i + 1], gap = 1.7 * (yb - 536);
  for (let xb = -200 + r.range(0, gap); xb < W + 200; xb += gap * r.range(0.6, 1.5)) { const xa = 800 + (xb - 800) * (ya - 536) / (yb - 536); if (yb - ya < 12.5) continue; p.tryStroke({ ...line, color: mix('#22224c', '#2c2c58', r()), width: 5, points: [[xa, ya + 1], [xb, yb]] }); }
}
// the young rice: short thin dark rows in the water, more of them near us
for (let k = 0; k < 420; k++) { const y = FIELD0 + 6 + Math.pow(r(), 0.7) * (FIELD1 - FIELD0 - 10), x = r.range(0, W), l = 12.4 + (y - FIELD0) * 0.1; p.tryStroke({ brush: 'round', color: mix('#1c3038', '#3c5c4c', r()), width: 4, opacity: r.range(0.3, 0.6), taper: [0.3, 0.3], points: [[x, y], [x + l, y + r.range(-0.5, 0.5)]] }); }

p.save();
