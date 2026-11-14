// Ushio. She stands at the left with her back to us and her face to Shide: a girl of
// seventeen in the dark blue swimsuit of her school, bare feet in the sand. Her hair is
// fair, and it is her weapon. It goes up from her head in one thick stream, comes over
// toward him in a great bow, and is made hard, so that its end is a blade. The sun is on
// it, and it is gold. A small white shell is tied in it at the back of her head.
'use strict';
const { studio, open, USHIO, SHIDE } = require('./scene');
const { mix, solid, shape, glint, glow } = studio;

const p = open('ushio');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.05, cap: 'round' };
const U = USHIO.U, P = (X, Y) => [USHIO.x + X * U, USHIO.feet - Y * U];
const LIGHT = [-0.5, -0.86];
const o = { light: LIGHT, turn: 0, width: 5.5, length: 18, vary: 0.05, mix: 0.05, edge: false };
const chain = (pts) => pts.map(([X, Y, R]) => [...P(X, Y), R * U]);
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts.map(([X, Y]) => P(X, Y)) });
const skin = { shadow: '#b47c64', half: '#ecbc98', lit: '#ffe6cc', bounce: '#e8c8a0' };
const navy = { shadow: '#0c1030', half: '#1c2860', lit: '#4458a4', bounce: '#3c3c58' };
const gold = { shadow: '#a8741c', half: '#e4b034', lit: '#ffe684', bounce: '#f4d078' };

// her shade on the sand: short, to the right of her feet
for (const [w, op] of [[40, 0.34], [26, 0.3]]) p.stroke({ brush: 'soft', color: '#8c7854', width: w, opacity: op, points: [P(-0.1, -0.02), P(0.3, -0.07), P(0.76, -0.1)] });

// ---------------------------------------------------------------- her legs and her feet
for (const [s, k] of [[-1, 1], [1, 1.3]]) {
  solid(p, chain([[s * 0.085, 0.8, 0.1], [s * 0.11 * k, 0.46, 0.074], [s * 0.135 * k, 0.1, 0.05]]), skin, { ...o, flow: () => Math.PI / 2 });
  mark([[s * 0.135 * k - 0.075, 0.035], [s * 0.135 * k + 0.075, 0.035]], '#e0b08c', 10);
}
// ---------------------------------------------------------------- her swimsuit: her hips and her back
solid(p, chain([[-0.07, 0.87, 0.125], [0.08, 0.87, 0.125]]), navy, { ...o, flow: () => 0 });
solid(p, chain([[0, 1.0, 0.118], [0.015, 1.18, 0.135]]), navy, { ...o, flow: () => Math.PI / 2 });
for (const s of [-1, 1]) mark([[s * 0.16 + 0.01, 0.8], [s * 0.1 + 0.01, 0.76], [s * 0.02 + 0.01, 0.75]], '#f4f4f8', 4.4, { opacity: 0.9 });      // the white edge of the suit at each leg
// ---------------------------------------------------------------- her shoulders and her arms. The left arm is at her side, with the hand shut; the right arm is forward.
solid(p, chain([[-0.13, 1.3, 0.07], [0.16, 1.3, 0.07]]), skin, { ...o, flow: () => 0 });
for (const s of [-1, 1]) mark([[s * 0.085 + 0.015, 1.34], [s * 0.1 + 0.015, 1.22]], '#1c2860', 6.4);                                           // the two straps
mark([[-0.1, 1.215], [0.015, 1.2], [0.13, 1.215]], '#f4f4f8', 4.2, { opacity: 0.8 });                                                         // the white edge of the suit across her back
solid(p, chain([[-0.185, 1.29, 0.052], [-0.27, 1.06, 0.044], [-0.3, 0.86, 0.04]]), skin, o);
solid(p, chain([[-0.305, 0.8, 0.046], [-0.3, 0.77, 0.044]]), skin, o);
solid(p, chain([[0.2, 1.29, 0.052], [0.35, 1.13, 0.044], [0.5, 1.06, 0.04]]), skin, o);
solid(p, chain([[0.54, 1.05, 0.044], [0.57, 1.05, 0.042]]), skin, o);
// ---------------------------------------------------------------- her neck and her head
solid(p, chain([[0.02, 1.36, 0.048], [0.02, 1.4, 0.048]]), skin, o);
solid(p, chain([[0.01, 1.485, 0.112], [0.04, 1.49, 0.112]]), gold, { ...o, flow: () => Math.PI / 2 });
for (const [X, l, lean] of [[-0.08, 0.2, -0.06], [-0.02, 0.26, -0.02], [0.05, 0.24, 0.03], [0.11, 0.18, 0.07]]) mark([[X, 1.44], [X + lean * 0.5, 1.44 - l * 0.5], [X + lean, 1.44 - l]], mix('#d8a02c', '#ffe27c', r()), 6.4, { taper: [0, 0.8] });   // short locks on her neck, which the stream did not take up

// ---------------------------------------------------------------- her hair
// The stream of it: it leaves the top of her head as thick as a rope, goes up, comes over toward him in a bow, and is widest in
// the middle of the bow; then it comes to a point, like a blade. `mid` is its middle line, and `wide` half its width along it.
const mid = [], ctrl = [[0.03, 1.57], [-0.05, 1.86], [0.14, 2.2], [0.64, 2.47], [1.26, 2.48], [2.12, 2.24]];
for (let i = 0; i <= 40; i++) { const f = i / 40 * (ctrl.length - 1), k = Math.min(ctrl.length - 2, Math.floor(f)), u = f - k, a = ctrl[Math.max(0, k - 1)], b = ctrl[k], c = ctrl[k + 1], d = ctrl[Math.min(ctrl.length - 1, k + 2)], cr = (q) => 0.5 * (2 * b[q] + (-a[q] + c[q]) * u + (2 * a[q] - 5 * b[q] + 4 * c[q] - d[q]) * u * u + (-a[q] + 3 * b[q] - 3 * c[q] + d[q]) * u * u * u); mid.push([cr(0), cr(1)]); }
const wide = (t) => 0.05 + 0.13 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.8)), 0.8) * (t < 0.9 ? 1 : (1 - t) / 0.1) - 0.05 * Math.max(0, (t - 0.9) / 0.1);
const side = (off) => mid.map(([X, Y], i) => { const a = mid[Math.max(0, i - 1)], b = mid[Math.min(40, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = wide(i / 40) * off; return [X - dy / l * w, Y + dx / l * w]; });
const flow = (x, y) => { let best = 0, bd = 1e9; for (let i = 0; i < 40; i += 2) { const a = P(...mid[i]), b = P(...mid[i + 2]), d = Math.hypot(x - (a[0] + b[0]) / 2, y - (a[1] + b[1]) / 2); if (d < bd) { bd = d; best = Math.atan2(b[1] - a[1], b[0] - a[0]); } } return best; };
p.stroke({ brush: 'soft', color: '#ffe89c', width: 60, opacity: 0.1, points: mid.filter((q, i) => i % 5 === 0 && i > 4).map(([X, Y]) => P(X, Y)) });   // its light in the air: it shines in the sun
shape(p, [...side(1), ...side(-1).reverse()].map(([X, Y]) => P(X, Y)), gold, { light: LIGHT, turn: -0.1, width: 6, length: 36, round: 0.08 * U, vary: 0.07, mix: 0.06, flow, edge: false });
// the locks of it: long thin lines along it, some dark, some light, none the same
for (const [off, c, op, t0, t1] of [[-0.8, '#fff4b8', 0.8, 2, 38], [-0.5, '#b88424', 0.5, 0, 36], [-0.2, '#fff0a4', 0.6, 3, 40], [0.1, '#a87a20', 0.5, 0, 34], [0.4, '#ffeC94', 0.6, 4, 39], [0.7, '#9c6c1c', 0.6, 1, 36]]) p.tryStroke({ brush: 'round', color: c, width: 4.2, opacity: op, taper: [0.1, 0.5], points: side(off).slice(t0, t1).filter((q, i) => i % 3 === 0).map(([X, Y]) => P(X, Y)) });
// it is made hard: its upper edge is one clean bright line, and its under edge a clean dark one
p.tryStroke({ ...line, rag: 0.02, color: '#fffbe4', width: 5, points: side(1).filter((q, i) => i % 3 === 0 && i >= 6).map(([X, Y]) => P(X, Y)) });
p.tryStroke({ ...line, rag: 0.02, color: '#96661a', width: 5, opacity: 0.9, points: side(-1).filter((q, i) => i % 3 === 0 && i >= 9).map(([X, Y]) => P(X, Y)) });
// the white shell that is tied in it at the back of her head
p.tryStroke({ ...line, color: '#ffffff', width: 8, points: [P(0.0, 1.585), [P(0.0, 1.585)[0] + 14, P(0.0, 1.585)[1] - 2]] });
// where its point is, near his open hand, a small white light
{ const [x, y] = P(2.12, 2.24); for (const [w, op] of [[50, 0.1], [24, 0.2]]) glow(p, x, y, w, '#fff8d8', op, 6); }
void glint; void SHIDE;

p.save();
