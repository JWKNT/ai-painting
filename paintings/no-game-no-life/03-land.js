// The land of Disboard, far below the cliff. Mountains stand along the edge of the world,
// rose and violet in the far air. Before them lie plains: the fields are squares of two
// greens, like the squares of a board. There are woods, a river that winds toward us and
// shines, and at the left a small walled city with red roofs and a castle: Elkia, the
// last city of the people who have no magic. Near the foot of the picture, under the
// cliff, the tops of the trees are close.
'use strict';
const { studio, open, W, H, HORIZON, far, cliffTop, nA, nB, nC, nD } = require('./scene');
const { mix, clamp, smooth, through } = studio;

const p = open('land');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.18, dry: 0.03, rag: 0.22, cap: 'round' };
const under = (x, y) => x < 560 || y < cliffTop(x) + 8;                     // the cliff will be painted over the rest
// A place of the land, in miles: to the right, and away from us. We look down on it from a height.
const G = (x, y) => { const Z = 60 / Math.max(2, y - HORIZON + 6); return [(x - 800) * Z / 400, Z]; };
const d = (y) => smooth(760, HORIZON, y);                                   // how far off: 1 at the edge of the world

// ---------------------------------------------------------------- the mountains at the edge of the world
for (const [pts, tone, dd] of [[[[-20, 566], [120, 548], [260, 560], [420, 540], [600, 562], [780, 546], [960, 560], [1120, 542], [1300, 560], [1460, 546], [1620, 558]], '#9a7cc8', 0.72], [[[-20, 584], [180, 570], [360, 582], [560, 566], [760, 584], [980, 572], [1180, 584], [1400, 570], [1620, 580]], '#7e68b8', 0.58]]) {
  const top = through(pts);
  p.fill({ inside: (x, y) => y > top(x) + 6 * (nC(x / 30, dd * 9) - 0.5) && y < HORIZON + 14, bounds: [0, 520, W, HORIZON + 14], width: 7, length: 40, spacing: 0.5, overlap: 0.6, angle: (x) => (nB(x / 60, dd) - 0.5) * 1.6, color: (x, y) => far(mix(tone, '#f4e6ff', smooth(0.5, 0.9, nA(x / 44, y / 20)) * 0.6), x, y, dd), stroke: { ...line, opacity: 0.95 } });
}

// ---------------------------------------------------------------- the plains
const wood = (X, Z) => smooth(0.55, 0.65, nD(X / 0.2 + 3, Z / 0.16 + 5));
const land = (x, y) => {
  const [X, Z] = G(x, y), k = d(y), sq = (Math.floor(X / 0.07 + 40) + Math.floor(Z / 0.07)) & 1;
  let c = sq ? '#6cc462' : '#a8de7e';                                                            // the fields: squares of two greens
  c = mix(c, '#ece48c', smooth(0.62, 0.8, nA(X / 0.14 + 9, Z / 0.14)) * 0.5);                    // some are ripe
  c = mix(c, mix('#1f7a5e', '#2f9a6a', nC(x / 9, y / 7)), wood(X, Z));                           // the woods
  c = mix(c, '#3c5cb0', (1 - smooth(-0.3, 0.5, nB(x / 200, y / 60) - 0.5 + (x - 800) / 2600)) * 0.16);   // the violet shade of a cloud here and there
  return far(c, x, y, k * 0.9);
};
const lie = () => r.range(-0.04, 0.04);
p.fill({ inside: under, bounds: [0, HORIZON - 2, W, 660], width: 5.5, length: 40, spacing: 0.5, angle: lie, color: land, stroke: { ...line, opacity: 0.96 } });
p.fill({ inside: under, bounds: [0, 652, W, 780], width: 8, length: 60, spacing: 0.5, angle: lie, color: land, stroke: { ...line, opacity: 0.96 } });
p.fill({ inside: under, bounds: [0, 772, W, H], width: 11, length: 80, spacing: 0.5, angle: lie, color: land, stroke: { ...line, opacity: 0.96 } });
p.fill({ inside: under, bounds: [0, HORIZON, W, H], width: 5.5, length: 34, spacing: 1.1, overlap: 0.7, angle: lie, color: (x, y) => land(x + r.range(-6, 6), y + r.range(-2, 2)), stroke: { ...line, opacity: 0.8 } });
// The trees of the woods: round tops, light on the left and violet on the right; they are bigger near us.
for (let k = 0; k < 1500; k++) {
  const y = HORIZON + 26 + Math.pow(r(), 0.8) * (H - HORIZON - 26), x = r.range(-10, W + 10), [X, Z] = G(x, y);
  if (!under(x, y) || wood(X, Z) < 0.5) continue;
  const s = clamp(5 / Z, 5, 34) * r.range(0.7, 1.3), w = Math.max(5, s * 0.8), l = Math.max(12.4, w * 2.1);
  p.tryStroke({ ...line, rag: 0.4, color: far(mix('#14664e', '#2c8c5e', r()), x, y, d(y) * 0.85), width: w, points: [[x - l / 2 + s * 0.2, y + s * 0.2], [x + s * 0.2, y], [x + l / 2 + s * 0.2, y + s * 0.2]] });
  if (s > 7 && r() < 0.5) p.tryStroke({ ...line, rag: 0.4, color: far(mix('#4cae62', '#b4e47c', r()), x, y, d(y) * 0.85), width: Math.max(4.8, w * 0.5), opacity: 0.7, points: [[x - l * 0.44, y - s * 0.2], [x - s * 0.1, y - s * 0.34], [x + l * 0.2, y - s * 0.2]] });
}

// ---------------------------------------------------------------- the river: it comes from the mountains, winds across the plain and passes under the cliff at the left
{ const pts = [[1010, 598], [900, 612], [800, 622], [860, 640], [740, 660], [560, 676], [600, 706], [470, 740], [300, 780], [340, 830], [210, 900], [60, 1010]], n = pts.length - 1;
  const at = (t) => { const f = clamp(t, 0, 0.9999) * n, i = Math.floor(f), u = f - i, a = pts[Math.max(0, i - 1)], b = pts[i], c = pts[i + 1], e = pts[Math.min(n, i + 2)]; const cr = (q) => 0.5 * (2 * b[q] + (-a[q] + c[q]) * u + (2 * a[q] - 5 * b[q] + 4 * c[q] - e[q]) * u * u + (-a[q] + 3 * b[q] - 3 * c[q] + e[q]) * u * u * u); return [cr(0), cr(1)]; };
  const path = []; for (let i = 0; i <= 600; i++) path.push(at(i / 600));
  for (let i = 0; i < 598;) {                                               // pieces along it, each long enough for its width, each begun a little before the last one ends
    const [x, y] = path[i], w = clamp(4.8 + Math.pow(Math.max(0, y - HORIZON) / 410, 1.5) * 64, 4.8, 64), need = Math.max(13, w * 2.3); let j = i, len = 0; while (j < 600 && len < need) { len += Math.hypot(path[j + 1][0] - path[j][0], path[j + 1][1] - path[j][1]); j++; }
    const seg = []; for (let k = i; k <= j; k += Math.max(1, Math.floor((j - i) / 6))) seg.push(path[k]); seg.push(path[j]);
    p.tryStroke({ ...line, rag: 0.12, color: far(mix('#74d4ee', '#d4f4fc', r()), x, y, d(y) * 0.7), width: w, points: seg });
    if (w > 9 && r() < 0.7) p.tryStroke({ brush: 'round', color: '#ffffff', width: 4.4, opacity: 0.7, taper: [0.4, 0.4], points: seg.map(([a, b]) => [a - w * 0.2, b - w * 0.12]) });
    if (j >= 600) break; i = Math.max(i + 1, j - Math.max(1, Math.floor((j - i) * 0.3)));
  } }

// ---------------------------------------------------------------- Elkia: a small city in a ring of pale wall, with red roofs, and its castle at the far side
{ const cx = 372, cy = 668, rx = 104, ry = 22;
  p.stroke({ brush: 'soft', color: '#3c5cb0', width: 26, opacity: 0.18, points: [[cx - rx + 30, cy + 16], [cx + 20, cy + 22], [cx + rx + 50, cy + 16]] });
  for (let k = 0; k < 110; k++) { const a = r.range(0, Math.PI * 2), q = Math.sqrt(r()) * 0.9, x = cx + Math.cos(a) * rx * q, y = cy + Math.sin(a) * ry * q; p.tryStroke({ brush: 'round', color: far(r() < 0.75 ? mix('#e0603c', '#f8a060', r()) : mix('#f4e8d0', '#ffffff', r()), x, y, 0.3), width: 4.6, opacity: 0.95, points: [[x - 6.3, y], [x + 6.3, y + r.range(-1, 1)]] }); }
  for (let i = 0; i < 22; i++) { const a0 = i / 22 * Math.PI * 2, q = (a) => [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry + (Math.sin(a) > 0 ? 3 : 0)]; p.tryStroke({ ...line, cap: 'round', color: far(Math.cos(a0) < 0.2 ? '#fffaf0' : '#cdbfe0', cx, cy, 0.3), width: 5, points: [q(a0), q(a0 + 0.17), q(a0 + 0.33)] }); }   // the wall
  for (const [dx, h, w] of [[-14, 34, 8], [0, 48, 9], [15, 30, 8], [-30, 22, 7], [30, 20, 7]]) { p.tryStroke({ ...line, cap: 'flat', color: far('#f2ece4', cx, cy, 0.34), width: w, points: [[cx + dx, cy - ry + 6], [cx + dx, cy - ry + 6 - h]] }); p.tryStroke({ ...line, color: far('#4c64c8', cx, cy, 0.34), width: w, taper: [0, 0.9], points: [[cx + dx, cy - ry + 8 - h], [cx + dx, cy - ry - 8 - h]] }); }   // the towers of the castle, each with a blue point
}
// roads go out from it over the plain: thin pale lines
for (const pts of [[[476, 672], [620, 664], [760, 652]], [[300, 684], [200, 720], [60, 740]], [[380, 646], [420, 620], [520, 606]]]) p.tryStroke({ brush: 'round', color: '#f4eccc', width: 4, opacity: 0.6, points: pts });

// ---------------------------------------------------------------- the rose air lies over the far part of the land
for (let k = 0; k < 20; k++) { const x = r.range(-200, W - 200), len = r.range(300, 760), y = r.range(HORIZON - 8, HORIZON + 50); p.stroke({ brush: 'soft', color: mix('#ffc8e4', '#fff0f6', r()), width: r.range(18, 40), opacity: r.range(0.08, 0.18), points: [[x, y], [x + len / 2, y + r.range(-4, 4)], [x + len, y]] }); }

p.save();
