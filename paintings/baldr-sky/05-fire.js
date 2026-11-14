// The fight. Kagerou's gun fires: a flash at its mouth, and lines of light that go from it
// down to the swarm. Three of the viruses are close, at the left: each a dark shell with
// points, on six legs, with red lights. Then the last touches: thin lines of light that go
// by us at the edges of the picture, as the wall goes by, and the corners a tone darker.
'use strict';
const { studio, open, W, H, VP, K, toVP } = require('./scene');
const { mix, shape, glow } = studio;

const p = open('fire');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round' };

// ---------------------------------------------------------------- the viruses that are close
function virus(x, y, s, turn) {
  const c = Math.cos(turn), sn = Math.sin(turn), P = (a, b) => [x + (a * c - b * sn) * s, y + (a * sn + b * c) * s];
  const shell = { shadow: '#04060a', half: '#141a28', lit: '#46587a', rim: '#bfe6ff', bounce: '#0c1420' }, o = { light: { at: [VP.x, VP.y] }, turn: 0.2, width: 5.5, vary: 0.06, dash: 22, gap: 10, edgeOpacity: 0.45 };
  for (const side of [-1, 1]) for (const [a0, reach] of [[0.7, 2.0], [1.5, 2.2], [2.4, 2.1]]) {                      // its legs: each has a joint, and ends in a point
    const a = side * a0, knee = P(Math.cos(a) * 1.25, Math.sin(a) * 1.25), end = P(Math.cos(a + side * 0.5) * reach, Math.sin(a + side * 0.5) * reach);
    p.tryStroke({ ...line, color: '#0a0e16', width: Math.max(5, s * 0.17), points: [P(Math.cos(a) * 0.5, Math.sin(a) * 0.5), knee] });
    p.tryStroke({ ...line, color: '#0a0e16', width: Math.max(5, s * 0.13), taper: [0, 0.8], points: [knee, end] });
    p.tryStroke({ brush: 'round', color: '#7cb4e8', width: 4, opacity: 0.6, points: [P(Math.cos(a) * 0.6, Math.sin(a) * 0.6), knee] });
  }
  shape(p, [P(-0.2, 0.74), P(-1.3, 0.5), P(-1.55, 0), P(-1.3, -0.5), P(-0.2, -0.74)], shell, { ...o, length: s * 0.6, round: s * 0.5, flow: () => turn });                 // its hind part
  shape(p, [P(1.3, 0), P(0.6, 0.66), P(-0.3, 0.72), P(-0.3, -0.72), P(0.6, -0.66)], shell, { ...o, length: s * 0.6, round: s * 0.5, flow: () => turn });                     // its fore part
  for (const side of [-1, 1]) p.tryStroke({ ...line, color: '#0a0e16', width: Math.max(5, s * 0.14), taper: [0, 0.8], points: [P(1.1, side * 0.3), P(1.6, side * 0.5), P(1.95, side * 0.2)] });   // the two points at its front
  p.tryStroke({ brush: 'round', color: '#02040a', width: Math.max(4, s * 0.1), opacity: 0.8, points: [P(-0.3, -0.66), P(-0.3, 0.66)] });                               // the joint between its two parts
  glow(p, ...P(0.62, 0), s * 0.9, '#ff3020', 0.13, 4);
  p.tryStroke({ ...line, color: '#ff5c3c', width: Math.max(5, s * 0.2), points: [P(0.62, -0.36), P(0.62, 0.36)] });                                                     // its red light: a bar across it
  p.tryStroke({ brush: 'round', color: '#ffd0a8', width: 4, opacity: 0.9, points: [P(0.66, -0.2), P(0.66, 0.2)].map(([a, b], i) => (s * 0.4 < 12.6 ? [a - (i ? 1 : -1) * (6.4 - s * 0.2) * sn, b + (i ? 1 : -1) * (6.4 - s * 0.2) * c] : [a, b])) });
  for (const side of [-1, 1]) p.tryStroke({ brush: 'round', color: '#ff4c34', width: 4, opacity: 0.85, points: [P(-0.8, side * 0.3), P(-0.8 + Math.max(0.3, 12.6 / s), side * 0.3)] });   // two small lights on its back
}
virus(72, 548, 40, -0.1);
virus(250, 786, 46, -0.5);
virus(96, 880, 66, -0.42);

// ---------------------------------------------------------------- the fire of the gun
const muzzle = K(1.39, -153);
glow(p, muzzle[0], muzzle[1], 46, '#ffb43c', 0.12, 5);
for (let k = 0; k < 7; k++) { const a = toVP(...muzzle) + Math.PI + r.range(-1.1, 1.1), l = r.range(16, 40); p.tryStroke({ ...line, color: mix('#ffb43c', '#fffbe0', r()), width: r.range(5, 8), taper: [0, 0.8], points: [muzzle, [muzzle[0] + Math.cos(a) * l, muzzle[1] + Math.sin(a) * l]] }); }
for (const [tx, ty] of [[452, 560], [368, 648], [300, 590], [210, 700]]) {                                               // the lines of light that go from it to the swarm: each is in pieces
  const dx = tx - muzzle[0], dy = ty - muzzle[1], len = Math.hypot(dx, dy);
  p.tryStroke({ brush: 'soft', color: '#ffb43c', width: 12, opacity: 0.1, points: [muzzle, [tx, ty]] });
  for (let d = r.range(20, 50); d < len - 30; d += r.range(46, 80)) { const l = r.range(20, 38); p.tryStroke({ brush: 'round', color: mix('#ffd45c', '#fffbe0', r()), width: 4.4, opacity: 0.9, taper: [0.3, 0.3], points: [[muzzle[0] + dx * d / len, muzzle[1] + dy * d / len], [muzzle[0] + dx * (d + l) / len, muzzle[1] + dy * (d + l) / len]] }); }
}

// ---------------------------------------------------------------- the last touches
for (let k = 0; k < 40; k++) {                                              // thin lines of light that go by us, near the edges of the picture
  const a = r.range(0, Math.PI * 2), r0 = r.range(620, 1100), len = r.range(60, 200), x = VP.x + Math.cos(a) * r0, y = VP.y + Math.sin(a) * r0;
  if (x < -40 || x > W + 40 || y < -40 || y > H + 40) continue;
  p.tryStroke({ brush: 'round', color: mix('#58c8ff', '#eaffff', r()), width: r.range(4, 6), opacity: r.range(0.2, 0.5), taper: [0.6, 0.4], points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
}
for (const [x0, y0, x1, y1, w, op] of [[W + 60, -40, 1150, -70, 200, 0.4], [W + 60, H + 40, 1100, H + 70, 200, 0.4], [-60, -40, 380, -70, 160, 0.3], [-60, H + 40, 420, H + 70, 150, 0.26], [W + 70, 200, W + 70, 800, 150, 0.3]]) p.stroke({ brush: 'soft', color: '#02040a', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
