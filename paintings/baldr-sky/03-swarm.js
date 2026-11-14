// What is in the shaft below Kagerou: plates that float in it, on which a machine can land;
// the swarm of viruses that comes up out of the bright place, small and far, each a dark
// shape with one red light; and the fire where some of them have been hit.
'use strict';
const { studio, open, W, H, VP, polar, core, hash } = require('./scene');
const { mix, clamp, shape, glow, inPoly } = studio;

const p = open('swarm');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'flat' };
const F = 900;                                                           // the lens: a thing so far across at a depth shows F / depth times as wide
// A place in the shaft: X to the right of its middle line, Y down from it, at a depth Z (all in metres).
const at = (X, Y, Z) => [VP.x + F * X / Z, VP.y + F * Y / Z];

// ---------------------------------------------------------------- the plates that float in the shaft
// Each is a slab that lies across the shaft. We look down on its top; and we see the two of its sides that are turned to the
// middle of the shaft, which go down from it toward the bright place.
function plate(X, Y, Z, w, h, t) {
  const top = [[X - w / 2, Y - h / 2], [X + w / 2, Y - h / 2], [X + w / 2, Y + h / 2], [X - w / 2, Y + h / 2]].map(([a, b]) => at(a, b, Z));
  const low = [[X - w / 2, Y - h / 2], [X + w / 2, Y - h / 2], [X + w / 2, Y + h / 2], [X - w / 2, Y + h / 2]].map(([a, b]) => at(a, b, Z + t));
  const lit = core(polar(...at(X, Y, Z)).r, 520);
  for (const [i, j] of [[0, 1], [1, 2], [2, 3], [3, 0]]) {                 // its sides: only those that we can see from here are painted over by its top
    const quad = [top[i], top[j], low[j], low[i]], xs = quad.map((q) => q[0]), ys = quad.map((q) => q[1]);
    p.fill({ inside: inPoly(quad), bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], width: 5.5, length: 26, spacing: 0.5, angle: () => Math.atan2(top[j][1] - top[i][1], top[j][0] - top[i][0]), color: () => mix(mix('#05080e', '#16202e', r()), '#7cc8ff', lit * 0.5), stroke: { ...line, opacity: 0.97 } });
  }
  const xs = top.map((q) => q[0]), ys = top.map((q) => q[1]), s = F / Z;
  p.fill({ inside: inPoly(top), bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], width: clamp(0.5 * s, 5.5, 12), length: clamp(3 * s, 26, 110), spacing: 0.5, angle: () => r.range(-0.02, 0.02), color: (x, y) => mix(mix('#222c3c', '#3a485e', hash(Math.floor(x / (1.2 * s)), Math.floor(y / (1.2 * s)))), '#06080e', 0.25 + 0.3 * r()), stroke: { ...line, opacity: 0.97 } });
  // a band of yellow and black along one edge, the lines between its plates, and a ring of light where a machine can land
  const a = top[3], b = top[2], n = Math.max(3, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / Math.max(26, 0.9 * s)));
  for (let i = 0; i < n; i++) if (i % 2 === 0) { const t0 = i / n, t1 = (i + 1) / n, e = Math.max(5, 0.28 * s); p.tryStroke({ ...line, color: '#e0a82c', width: e, points: [[a[0] + (b[0] - a[0]) * t0, a[1] - e * 0.7], [a[0] + (b[0] - a[0]) * t1, a[1] - e * 0.7]] }); }
  for (const k of [0.33, 0.66]) p.tryStroke({ brush: 'round', color: '#0a0e16', width: 4, opacity: 0.7, points: [[top[0][0] + (top[1][0] - top[0][0]) * k, top[0][1]], [top[3][0] + (top[2][0] - top[3][0]) * k, top[3][1]]] });
  const [cx, cy] = at(X, Y, Z), R = Math.min(w, h) * 0.3 * s;
  if (R > 16) { for (let i = 0; i < 8; i++) p.tryStroke({ brush: 'round', color: '#58e0ff', width: clamp(R * 0.08, 4, 7), opacity: 0.85, points: studio.arc(cx, cy, R, i * Math.PI / 4 + 0.08, (i + 1) * Math.PI / 4 - 0.08, 5) }); glow(p, cx, cy, R * 1.2, '#38b8ff', 0.07, 4); }
  p.tryStroke({ brush: 'round', color: mix('#7cc8ff', '#f0fbff', lit), width: 4, opacity: 0.8, points: [top[0], top[1]] });       // the light on its edges that are toward the bright place
  p.tryStroke({ brush: 'round', color: mix('#7cc8ff', '#f0fbff', lit), width: 4, opacity: 0.8, points: [top[0], top[3]] });
}
plate(-7.5, -5.2, 34, 9, 5.5, 1.4);
plate(3.4, 10.4, 27, 8, 5, 1.2);
plate(-12.5, 6.6, 20, 9, 6, 1.4);
plate(2.4, -9.6, 18, 7, 4.6, 1.2);

// ---------------------------------------------------------------- the swarm
// A virus: a machine with no one in it. Far off it is a dark mark with a red light; nearer it has a body with points, and legs.
function virus(x, y, s, turn) {
  if (s < 9) { p.tryStroke({ brush: 'round', color: '#0a0c14', width: 4.4, points: [[x - 6.4, y], [x + 6.4, y]] }); p.tryStroke({ brush: 'round', color: '#ff3c2c', width: 4, opacity: 0.9, points: [[x - 6.2, y - 1], [x + 6.2, y - 1]] }); return; }
  const c = Math.cos(turn), sn = Math.sin(turn), P = (a, b) => [x + (a * c - b * sn) * s, y + (a * sn + b * c) * s];
  for (const [a0, a1] of [[0.9, 1.9], [-0.9, -1.9], [2.3, 2.9], [-2.3, -2.9]]) p.tryStroke({ ...line, cap: 'round', color: '#0c1018', width: Math.max(4.8, s * 0.18), taper: [0, 0.7], points: [P(Math.cos(a0) * 0.5, Math.sin(a0) * 0.5), P(Math.cos((a0 + a1) / 2) * 1.2, Math.sin((a0 + a1) / 2) * 1.2), P(Math.cos(a1) * 1.9, Math.sin(a1) * 1.9)] });   // its legs
  shape(p, [P(1.2, 0), P(0.5, 0.62), P(-0.5, 0.7), P(-1.0, 0.3), P(-1.0, -0.3), P(-0.5, -0.7), P(0.5, -0.62)], { shadow: '#05070c', half: '#161c2a', lit: '#4c6488', rim: '#bfe6ff', bounce: '#0c1420' }, { light: { at: [VP.x, VP.y] }, turn: 0.2, width: 5, length: Math.max(13, s * 0.9), round: s * 0.5, flow: () => turn, dash: 16, gap: 6, edgeOpacity: 0.8 });
  glow(p, ...P(0.5, 0), Math.max(9, s * 0.9), '#ff3020', 0.14, 4);
  p.tryStroke({ brush: 'round', color: '#ff5c3c', width: Math.max(4, s * 0.2), points: [P(0.5, -0.32), P(0.5, 0.32)].map(([a, b], i) => (Math.abs(s * 0.64) < 12.6 ? [a + (i ? 1 : -1) * (6.4 - s * 0.32) * -sn, b + (i ? 1 : -1) * (6.4 - s * 0.32) * c] : [a, b])) });   // its red light
}
// They come up in a long line that turns, from the bright place toward the lower left, where they are nearest.
const list = [];
for (let k = 0; k < 110; k++) {
  const t = Math.pow(r(), 1.6), a = 2.5 + t * 0.9 + r.gauss() * (0.5 - 0.3 * t), rad = 22 + t * 520 + r.range(-20, 20) * t;
  list.push([VP.x + Math.cos(a) * rad, VP.y + Math.sin(a) * rad * 0.9, 3 + t * 34, a + Math.PI + r.range(-0.5, 0.5), t]);
}
for (let k = 0; k < 40; k++) { const a = r.range(0, 6.283), rad = r.range(16, 150); list.push([VP.x + Math.cos(a) * rad, VP.y + Math.sin(a) * rad, 3 + rad / 60, a + Math.PI, rad / 600]); }   // and more of them, far down, all round the bright place
list.sort((a, b) => a[4] - b[4]);
for (const [x, y, s, turn] of list) if (!(x > 880 && y > 380 && y < 760)) virus(x, y, s, turn);

// ---------------------------------------------------------------- fire, where some of them have been hit
function burst(x, y, R) {
  glow(p, x, y, R * 2.2, '#ff8a24', 0.1, 5);
  for (let k = 0; k < 9; k++) { const a = r.range(0, 6.283), d = R * r.range(0.5, 1.1), w = R * r.range(0.3, 0.5); p.tryStroke({ ...line, cap: 'round', color: mix('#140c0c', '#3c2420', r()), width: Math.max(6, w), opacity: 0.85, mix: 0.3, points: [[x + Math.cos(a) * d * 0.4, y + Math.sin(a) * d * 0.4], [x + Math.cos(a) * d, y + Math.sin(a) * d], [x + Math.cos(a + 0.4) * d * 1.5, y + Math.sin(a + 0.4) * d * 1.5]] }); }   // the smoke of it
  for (let k = 0; k < 12; k++) { const a = r.range(0, 6.283), d = R * r.range(0.2, 0.9), w = Math.max(5, R * r.range(0.16, 0.34)); p.tryStroke({ ...line, cap: 'round', color: mix('#e8501c', '#ffb43c', r()), width: w, taper: [0.1, 0.8], mix: 0.2, points: [[x + Math.cos(a) * d * 0.1, y + Math.sin(a) * d * 0.1], [x + Math.cos(a) * Math.max(d, w * 2.2), y + Math.sin(a) * Math.max(d, w * 2.2)]] }); }
  for (let k = 0; k < 6; k++) { const a = r.range(0, 6.283), d = Math.max(13, R * r.range(0.3, 0.55)); p.tryStroke({ ...line, cap: 'round', color: mix('#ffd45c', '#fffbe0', r()), width: Math.max(5, R * 0.2), taper: [0, 0.7], points: [[x - Math.cos(a) * d * 0.3, y - Math.sin(a) * d * 0.3], [x + Math.cos(a) * d * 0.7, y + Math.sin(a) * d * 0.7]] }); }
  for (let k = 0; k < 10; k++) { const a = r.range(0, 6.283), d0 = R * r.range(0.9, 1.4), l = r.range(13, 30); p.tryStroke({ brush: 'round', color: mix('#ff9a2c', '#ffe890', r()), width: 4, opacity: 0.9, taper: [0, 0.6], points: [[x + Math.cos(a) * d0, y + Math.sin(a) * d0], [x + Math.cos(a) * (d0 + l), y + Math.sin(a) * (d0 + l)]] }); }   // sparks that fly out
}
burst(452, 560, 34);
burst(368, 648, 50);
burst(540, 470, 18);

p.save();
