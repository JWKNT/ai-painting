// The rose bush that is close to us, at the left. Its canes come up out of the corner of
// the picture; its leaves are dark against the light of the beds behind them, with gold on
// the edges that are turned to a flower; and its roses are great heads of gold, each with
// its rings of petals, so near that they are the brightest things in the garden.
'use strict';
const { studio, open, rose, gold } = require('./scene');
const { mix, shape } = studio;

const p = open('near');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round' };

// The flowers, and where the cane of each comes from. The first ones are the furthest back.
const BLOOMS = [
  { x: 34, y: 598, R: 34, root: [-30, 880] },
  { x: 476, y: 704, R: 40, root: [310, 1016] },
  { x: 150, y: 708, R: 58, root: [130, 1016] },
  { x: 430, y: 914, R: 35, root: [372, 1020] },
  { x: 78, y: 904, R: 46, root: [16, 1016] },
  { x: 336, y: 808, R: 50, root: [226, 1016] },
  { x: 258, y: 950, R: 42, root: [262, 1040] },
];
const BUDS = [{ x: 566, y: 772, R: 15, root: [430, 1016], bend: -0.2 }, { x: 280, y: 634, R: 17, root: [150, 1016], bend: 0.2 }];
const nearest = (x, y) => { let best = BLOOMS[0], d = 1e9; for (const b of BLOOMS) { const q = Math.hypot(b.x - x, b.y - y) - b.R; if (q < d) { d = q; best = b; } } return best; };

// The air behind the bush is a little darker, so that the bed stands back from it.
for (const [x0, y0, x1, y1, w, op] of [[-40, 760, 300, 700, 170, 0.34], [-40, 930, 420, 900, 190, 0.4], [200, 860, 560, 800, 130, 0.26], [-40, 640, 200, 620, 110, 0.2], [-40, 980, 480, 960, 150, 0.4], [-40, 850, 260, 830, 150, 0.3], [140, 940, 520, 900, 120, 0.3]]) p.stroke({ brush: 'soft', color: '#03100a', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2 + 10], [x1, y1]] });

// A cane: from its root up to its flower, in one bend. It is dark green, with gold down the side of it that is toward the flower.
const caneAt = (b, t) => { const [rx, ry] = b.root, k = b.bend != null ? b.bend : 0.12, mx = (rx + b.x) / 2 - (b.y - ry) * k, my = (ry + b.y) / 2 + (b.x - rx) * k; return [(1 - t) * (1 - t) * rx + 2 * t * (1 - t) * mx + t * t * b.x, (1 - t) * (1 - t) * ry + 2 * t * (1 - t) * my + t * t * b.y]; };
function cane(b) {
  const pts = []; for (let i = 0; i <= 10; i++) pts.push(caneAt(b, i / 10 * 0.97));
  p.tryStroke({ ...line, color: '#061208', width: 9.5, taper: [0, 0.35], points: pts });
  p.tryStroke({ brush: 'round', color: '#5c6a20', width: 4, opacity: 0.6, points: pts.slice(4).map(([x, y]) => [x + 2.4, y - 1]) });
  for (const t of [0.3, 0.52, 0.7]) { const [x, y] = caneAt(b, t), s = r() < 0.5 ? -1 : 1; p.tryStroke({ ...line, color: '#0a1a0c', width: 5, taper: [0, 0.9], points: [[x, y], [x + s * 8, y - 5], [x + s * 14, y - 4]] }); }   // thorns
}

// A leaf: a pointed oval with a rib down it. It starts at (bx, by), points the way `a` and is L long and wide in proportion.
function leaf(bx, by, a, L, o = {}) {
  const wide = L * (o.wide || 0.56), bend = (o.bend != null ? o.bend : r.range(-0.12, 0.12)) * L, ca = Math.cos(a), sa = Math.sin(a), n = 9;
  const mid = (t) => { const u = L * t, v = bend * Math.sin(Math.PI * t); return [bx + ca * u - sa * v, by + sa * u + ca * v]; };
  const half = (t) => wide / 2 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.72)), 0.85);
  const one = [], two = [];
  for (let i = 0; i <= n; i++) { const t = i / n, [mx, my] = mid(t), h = half(t); one.push([mx - sa * h, my + ca * h]); two.push([mx + sa * h, my - ca * h]); }
  const back = o.back || 0, tip = mid(0.6), b = nearest(tip[0], tip[1]), close = Math.max(0, 1 - (Math.hypot(b.x - tip[0], b.y - tip[1]) - b.R) / 150);   // close: how near it is to a flower
  const dim = (c) => mix(c, '#061016', back * 0.5);
  const tones = { shadow: dim('#020905'), half: dim(mix('#0a2412', '#2c4a18', close * 0.5)), lit: dim(mix('#1c4a1c', '#8c9a2c', close * 0.8)), bounce: dim('#161c34') };
  if (close > 0.25 && !back) tones.rim = mix('#8c9a2c', '#ffd84c', close);
  shape(p, [...one, ...two.reverse().slice(1, -1)], tones, { light: { at: [b.x, b.y] }, turn: 0.1, width: 5.5, length: Math.max(14, L * 0.4), vary: 0.04, round: wide * 0.5, flow: () => a, dash: 20, gap: 8, edgeOpacity: 0.75 });
  const ribPts = [mid(0.04), mid(0.34), mid(0.64), mid(0.93)];
  p.tryStroke({ brush: 'round', color: dim(close > 0.3 ? '#5c7a28' : '#04100a'), width: 4, opacity: 0.55, points: ribPts });
}
// A leaf of a rose has five parts on one stalk: one at the end, and two pairs behind it.
function spray(bx, by, a, size, o = {}) {
  const ca = Math.cos(a), sa = Math.sin(a), L = size;
  p.tryStroke({ ...line, color: '#061208', width: 5, points: [[bx, by], [bx + ca * L * 0.5, by + sa * L * 0.5], [bx + ca * L * 0.95, by + sa * L * 0.95]] });
  for (const [t, da, k] of [[0.4, -1.0, 0.62], [0.4, 1.0, 0.62], [0.72, -0.86, 0.72], [0.72, 0.86, 0.72]]) leaf(bx + ca * L * t, by + sa * L * t, a + da + r.range(-0.12, 0.12), L * k, o);
  leaf(bx + ca * L * 0.9, by + sa * L * 0.9, a + r.range(-0.1, 0.1), L * 0.86, o);
}
// A bud: a pointed head of gold, held in green.
function bud(b) {
  const top = [b.x, b.y - b.R * 1.5], R = b.R;
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4 + 0.3, w = Math.max(9, R * 2.2); p.tryStroke({ brush: 'soft', color: '#ffc022', width: w, opacity: 0.11, points: [[b.x - Math.cos(a) * w * 1.06, b.y - R * 0.3 - Math.sin(a) * w * 1.06], [b.x + Math.cos(a) * w * 1.06, b.y - R * 0.3 + Math.sin(a) * w * 1.06]] }); }
  shape(p, [[b.x - R * 0.82, b.y], [b.x - R * 0.7, b.y - R * 0.8], top, [b.x + R * 0.7, b.y - R * 0.8], [b.x + R * 0.82, b.y], [b.x, b.y + R * 0.7]], { shadow: gold(0.2), half: gold(0.5), lit: gold(0.8), rim: gold(1) }, { light: [0.3, -0.9], turn: -0.2, width: 5, length: 16, round: R * 0.7, flow: () => -Math.PI / 2, dash: 16, gap: 5 });
  p.tryStroke({ brush: 'round', color: gold(0.22), width: 4, opacity: 0.7, points: [[b.x - R * 0.1, b.y + R * 0.3], [b.x + R * 0.16, b.y - R * 0.5], [b.x - R * 0.04, b.y - R * 1.3]] });   // the line where one petal lies over the next
  for (const s of [-1, 1]) p.tryStroke({ ...line, color: '#0c2410', width: 5.5, taper: [0, 0.8], points: [[b.x + s * R * 0.2, b.y + R * 0.8], [b.x + s * R * 0.95, b.y + R * 0.1], [b.x + s * R * 1.0, b.y - R * 0.7]] });   // the green that held it
  p.tryStroke({ ...line, color: '#0a1c0c', width: Math.max(6, R * 0.5), points: [[b.x - 6.4, b.y + R * 0.86], [b.x + 6.4, b.y + R * 0.86]] });
}

// ---------------------------------------------------------------- the low part of the bush: dark leaves, close together
for (const [x, y, a, size] of [[40, 1010, -1.5, 110], [150, 1016, -1.75, 120], [250, 1012, -1.3, 110], [350, 1016, -1.6, 100], [440, 1016, -1.9, 90], [-10, 930, -0.6, 100], [100, 950, -2.2, 90], [300, 960, -0.9, 90]]) spray(x, y, a, size, { back: 0.85 });

// ---------------------------------------------------------------- the canes, and the leaves that are behind the flowers
for (const b of [...BLOOMS, ...BUDS]) cane(b);
const SPRAYS = [];
for (const b of [...BLOOMS, ...BUDS]) for (const t of b.R > 20 ? [0.34, 0.56, 0.78] : [0.45, 0.72]) {
  const [x, y] = caneAt(b, t), [x2, y2] = caneAt(b, t + 0.03), along = Math.atan2(y2 - y, x2 - x), side = SPRAYS.length % 2 ? 1 : -1;
  SPRAYS.push([x, y, along + side * r.range(0.7, 1.2), r.range(66, 104) * (b.R > 20 ? 1 : 0.7)]);
}
SPRAYS.forEach(([x, y, a, size], i) => { if (i % 3 !== 0) spray(x, y, a, size, { back: i % 2 ? 0.6 : 0.2 }); });

// ---------------------------------------------------------------- the flowers
for (const b of BUDS) bud(b);
for (const b of BLOOMS) {
  // the green under the head, where it shows
  for (const a of [0.5, 1.4, 2.5]) p.tryStroke({ ...line, color: '#0a200e', width: Math.max(6, b.R * 0.22), taper: [0, 0.8], points: [[b.x + Math.cos(a) * b.R * 0.5, b.y + Math.sin(a) * b.R * 0.5], [b.x + Math.cos(a) * b.R * 0.95, b.y + Math.sin(a) * b.R * 0.95], [b.x + Math.cos(a + 0.2) * b.R * 1.24, b.y + Math.sin(a + 0.2) * b.R * 1.24]] });
  rose(p, b.x, b.y, b.R);
}

// ---------------------------------------------------------------- the leaves that are in front
SPRAYS.forEach(([x, y, a, size], i) => { if (i % 3 === 0) spray(x, y, a, size * 0.9, {}); });
for (const [x, y, a, L] of [[196, 1004, -1.3, 96], [330, 1010, -0.9, 88], [70, 1010, -1.9, 80], [470, 1010, -1.2, 70], [540, 880, -2.4, 60]]) leaf(x, y, a, L, {});

p.save();
