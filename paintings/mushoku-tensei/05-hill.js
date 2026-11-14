// The hill that we stand on, outside the town. Its grass is dark, and the wind that the
// light makes lays it over, away from the column. At the left is the tree, black against
// the sky, with its leaves going from it on the wind. At the right, near us, a rock, and
// against the rock the staff: twisted wood, as tall as a man, with a great blue stone held
// in the wood of its head. The stone has its own light.
'use strict';
const { studio, open, W, H, COL, STAFF, lit, nA, nC } = require('./scene');
const { mix, clamp, smooth, through, solid, glow, noise2, orb } = studio;

const p = open('hill');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.03, rag: 0.2, cap: 'round' };
const top = through([[0, 800], [240, 836], [560, 880], [900, 896], [1200, 870], [1420, 826], [1600, 794]]);
const away = (x) => (x < COL.x ? -1 : 1);                                   // the side that the wind goes to
// The body of the hill.
p.fill({ inside: (x, y) => y > top(x) + 5 * (nC(x / 14, 2) - 0.5), bounds: [0, 780, W, H], width: 10, length: 70, spacing: 0.5, angle: (x) => away(x) * 0.5 + (away(x) > 0 ? 0 : Math.PI) + r.range(-0.2, 0.2), color: (x, y) => mix(mix('#0a100a', '#182014', nA(x / 80, y / 40)), '#04060a', smooth(top(x), H, y) * 0.5), stroke: { ...line, opacity: 0.97 } });
// The grass along its top, laid over by the wind: dark blades, and the cold light on some of them.
for (let x = -10; x < W + 10; x += r.range(5, 11)) {
  const y = top(clamp(x, 0, W)) + r.range(-2, 10), h = r.range(16, 40), lean = away(x) * r.range(0.5, 1.2);
  p.tryStroke({ ...line, color: mix('#060a06', '#141c10', r()), width: r.range(4.8, 7), taper: [0, 0.8], points: [[x, y + 6], [x + lean * h * 0.4, y - h * 0.5], [x + lean * h, y - h * 0.8]] });
  if (r() < 0.1) p.tryStroke({ brush: 'round', color: '#7ca4bc', width: 4, opacity: lit(x, y, 700) * 0.6, taper: [0, 0.7], points: [[x - away(x) * 2, y + 2], [x + lean * h * 0.4 - away(x) * 2, y - h * 0.5], [x + lean * h, y - h * 0.8]] });
}
for (let k = 0; k < 150; k++) { const x = r.range(0, W), y = r.range(top(x) + 14, H), h = r.range(20, 50) * (0.6 + (y - 800) / 300), lean = away(x) * r.range(0.6, 1.3); p.tryStroke({ ...line, color: mix('#04060a', '#101810', r()), width: r.range(5, 9), opacity: 0.85, taper: [0, 0.8], points: [[x, y], [x + lean * h * 0.4, y - h * 0.5], [x + lean * h, y - h * 0.75]] }); }

// ---------------------------------------------------------------- the tree
{
  const tx = 214, base = top(tx) + 10, dark = { shadow: '#030405', half: '#090b0c', lit: '#1c2a34', rim: '#5c849c', bounce: '#06080a' };
  solid(p, [[tx - 4, base, 26], [tx + 4, base - 120, 19], [tx + 16, base - 240, 15]], dark, { light: [1, -0.2], turn: 0.6, width: 6.5, length: 30, vary: 0.1, flow: () => Math.PI / 2, dash: 30, gap: 22, edgeOpacity: 0.3 });
  for (const [x1, y1, x2, y2, w] of [[tx + 16, base - 230, tx - 110, base - 360, 12], [tx + 10, base - 200, tx + 140, base - 330, 12], [tx + 14, base - 240, tx + 30, base - 400, 11], [tx - 20, base - 300, tx - 190, base - 330, 8], [tx + 80, base - 280, tx + 200, base - 270, 8]]) solid(p, [[x1, y1, w], [(x1 + x2) / 2, (y1 + y2) / 2 - 12, w * 0.7], [x2, y2, w * 0.36]], dark, { light: [1, -0.2], turn: 0.5, width: 5.5, length: 22, edge: false });
  // its leaves: dark heaps, with the cold light on the under sides of those toward the column
  const puffs = []; for (let k = 0; k < 34; k++) { const a = r.range(0, 6.283), d = Math.sqrt(r()) * 190; puffs.push([tx + 20 + Math.cos(a) * d * 1.2, base - 380 + Math.sin(a) * d * 0.62, r.range(34, 66)]); }
  studio.mass(p, puffs, { light: [0.8, 0.6], tones: (t) => mix(mix('#030405', '#0c1210', clamp(t * 2, 0, 1)), '#4c7088', smooth(0.7, 1, t) * 0.7), bias: 0.2, contrast: 0.6, grain: 0.4, mix: 0.1, noise: noise2(8301), stroke: { rag: 0.5 }, layers: [[13, 30, 0.97, 5, 0.5], [7.5, 18, 0.85, 3, 1.0]] });
  // leaves that the wind takes from it, to the left and up
  for (let k = 0; k < 44; k++) { const x = tx - r.range(40, 420) * Math.pow(r(), 0.6) + 60, y = base - 380 + r.range(-200, 160), a = Math.PI + r.range(-0.5, 0.3), l = r.range(12.4, 18); if (x > 0) p.tryStroke({ ...line, color: '#060809', width: r.range(4.8, 6.5), taper: [0.2, 0.6], points: [[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l]] }); }
}

// ---------------------------------------------------------------- the rock, and the staff against it
{
  const rock = { shadow: '#040506', half: '#101216', lit: '#2c3a48', rim: '#a8d4ee', bounce: '#08090c' };
  solid(p, [[1250, 968, 60], [1330, 946, 76], [1420, 972, 60], [1486, 990, 40]], rock, { light: [-0.8, -0.5], turn: 0.4, width: 7, length: 30, vary: 0.1, flow: () => 0.1, dash: 26, gap: 12, edgeOpacity: 0.6 });
  p.tryStroke({ ...line, color: '#030405', width: 6, opacity: 0.8, taper: [0.1, 0.7], points: [[1356, 880], [1348, 930], [1362, 980]] });
  // the staff
  const [fx, fy] = STAFF.foot, [hx, hy] = STAFF.head, dx = hx - fx, dy = hy - fy, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const P = (t, off = 0) => [fx + dx * t + nx * off, fy + dy * t + ny * off];
  const wood = { shadow: '#0c0806', half: '#2a1c12', lit: '#6c5038', rim: '#b8d8ec', bounce: '#14100c' };
  // its shaft: not straight; it has knots, and it is thicker toward the head
  solid(p, [[...P(0, 0), 7], [...P(0.2, 3), 7.5], [...P(0.42, -3), 8.5], [...P(0.62, 2), 9.5], [...P(0.8, -2), 11], [...P(0.92, 0), 13]], wood, { light: [-0.9, -0.3], turn: 0.3, width: 5.2, length: 24, vary: 0.12, dash: 30, gap: 8, edgeOpacity: 0.7 });
  for (const t of [0.3, 0.55, 0.74]) p.tryStroke({ ...line, color: '#0a0604', width: 5, opacity: 0.7, points: [P(t, -7), P(t + 0.012, 0), P(t, 8)] });                           // rings of its grain
  for (const t of [0.36, 0.385, 0.41, 0.435]) p.tryStroke({ ...line, cap: 'flat', color: mix('#5c3a34', '#8c5c4c', r()), width: 6, points: [P(t, -10), P(t + 0.006, 10)] });       // the cord that is wound round it where the hand holds it
  // its head: the wood divides into three arms, which bend round the stone and hold it
  const [sx, sy] = P(1.075, 0), R = 30;
  for (const [a0, a1, w] of [[2.2, 3.9, 10], [-0.9, 0.8, 10], [0.9, 1.9, 8]]) { const pts = []; for (let i = 0; i <= 8; i++) { const a = Math.atan2(uy, ux) + Math.PI + a0 + (a1 - a0) * i / 8; pts.push([sx + Math.cos(a) * (R + 9), sy + Math.sin(a) * (R + 9), w * (1 - 0.5 * i / 8)]); } solid(p, [[...P(0.94, 0), 11], ...pts.slice(2)], wood, { light: [-0.9, -0.3], turn: 0.3, width: 5.2, length: 18, edge: false }); }
  // the stone: deep blue, with a white light in the upper part of it, and its own light in the air round it
  for (const [w, op, n] of [[150, 0.07, 4], [90, 0.12, 5], [54, 0.2, 6]]) glow(p, sx, sy, w, '#2c8cff', op, n);
  orb(p, [[sx, sy, R]], (x, y) => { const k = clamp(((x - sx) * -0.6 + (y - sy) * -0.7) / R, -1, 1); return k > 0 ? mix('#1c5cd8', '#a8e0ff', k) : mix('#1c5cd8', '#081c58', -k); }, { width: 6, reach: 22 });
  p.tryStroke({ brush: 'round', color: '#ffffff', width: 5, points: [[sx - 14, sy - 12], [sx - 4, sy - 16], [sx + 4, sy - 13]] });
  p.tryStroke({ brush: 'round', color: '#58b0ff', width: 4, opacity: 0.8, points: studio.arc(sx, sy, R - 4, 0.3, 1.9, 7) });
  // the light of the stone on the wood under it and on the rock
  p.stroke({ brush: 'soft', color: '#3c94f0', width: 16, opacity: 0.3, points: [P(0.72, -6), P(0.84, -8), P(0.95, -9)] });
  glow(p, 1330, 900, 70, '#2c7ce0', 0.06, 4);
}

p.save();
