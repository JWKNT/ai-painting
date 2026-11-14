// The shadow on the sand. It lies under Shide, but it is not the shape of him: it is a
// pool of black with long tongues, and the longest runs across the sand toward Ushio.
// It has no light in it at all. The end of that tongue is a hand, flat on the sand, and
// small square pieces of black break off the edges of the pool and go up into the air,
// as they do from every shadow of this island.
'use strict';
const { studio, open, W, H, SHIDE, edge, pool, nA, nC } = require('./scene');
const { mix, clamp } = studio;

const p = open('shadow');
const r = p.rng;
const line = { brush: 'bristle', mix: 0, dry: 0, rag: 0.04, cap: 'round' };
const BLACK = () => mix('#030308', '#0b0b1a', r());
const onSand = (x, y) => y > edge(x) + 12;

// ---------------------------------------------------------------- the pool
p.fill({ inside: (x, y) => onSand(x, y) && pool(x, y) > 0, bounds: [260, 780, 1500, 990], width: 9, length: 90, spacing: 0.45, overlap: 0.7, angle: () => r.range(-0.03, 0.03), color: (x, y) => mix(mix('#020207', '#0c0c20', nA(x / 120, y / 10)), '#1c2450', clamp(pool(x, y) * 0.5, 0, 0.3) * nC(x / 30, y / 4)), stroke: { ...line, cap: 'flat', opacity: 0.99 } });
// its edge is a hard line: short black strokes along it close the gaps that the fill leaves
for (let k = 0; k < 420; k++) { const x = r.range(270, 1490), y = r.range(790, 985), q = pool(x, y); if (!onSand(x, y) || q < 0 || q > 0.06) continue; const l = r.range(14, 30); p.tryStroke({ ...line, cap: 'flat', color: '#040409', width: r.range(5, 8), points: [[x - l / 2, y], [x + l / 2, y + r.range(-1, 1)]] }); }

// ---------------------------------------------------------------- the small squares that break off it
function square(x, y, s, op) { const a = r.range(-0.3, 0.3); p.tryStroke({ ...line, cap: 'flat', rag: 0, color: '#05050c', width: Math.max(5, s * 0.5), opacity: op, points: [[x - Math.cos(a) * s / 2, y - Math.sin(a) * s / 2], [x + Math.cos(a) * s / 2, y + Math.sin(a) * s / 2]] }); if (r() < 0.4) p.tryStroke({ ...line, cap: 'flat', rag: 0, color: '#05050c', width: Math.max(5, s * 0.5), opacity: op, points: [[x - Math.cos(a) * s / 2, y - Math.sin(a) * s / 2 + s * 0.5], [x + Math.cos(a) * s / 2, y + Math.sin(a) * s / 2 + s * 0.5]] }); }
for (let k = 0; k < 150; k++) { const x = r.range(300, 1460), y0 = r.range(800, 980); if (!onSand(x, y0) || pool(x, y0) < 0.02 || pool(x, y0) > 0.5) continue; const up = Math.pow(r(), 1.8) * 190, s = Math.max(12.4, r.range(12, 24) * (1 - up / 300)); square(x + up * 0.14 + r.range(-10, 10), y0 - 10 - up, s, clamp(1 - up / 240, 0.25, 1)); }

// ---------------------------------------------------------------- the end of its longest tongue is a hand: flat on the sand, with long fingers that go toward her feet
for (const [a, l, w] of [[2.75, 150, 15], [2.95, 190, 17], [3.14, 200, 17], [3.34, 170, 15], [3.62, 110, 14]]) { const x0 = 470, y0 = 936, e = [x0 + Math.cos(a) * l, y0 + Math.sin(a) * l * 0.34]; p.tryStroke({ ...line, cap: 'round', color: '#040409', width: w, taper: [0, 0.85], points: [[x0 + 40, y0], [(x0 + e[0]) / 2, (y0 + e[1]) / 2 + 2], e] }); }
void W; void H; void SHIDE;

p.save();
