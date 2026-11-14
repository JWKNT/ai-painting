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
  if (s < 9) { const a = turn + Math.PI / 2, c = Math.cos(a), sn = Math.sin(a); p.tryStroke({ brush: 'round', color: '#0a0c14', width: 4.6, opacity: 0.9, points: [[x - c * 7, y - sn * 7], [x + c * 7, y + sn * 7]] }); p.tryStroke({ brush: 'round', color: mix('#d82c20', '#ff5c3c', r()), width: 4, opacity: r.range(0.45, 0.9), taper: [0.5, 0.5], points: [[x - c * 6.2 + 1, y - sn * 6.2 - 1], [x + c * 6.2 + 1, y + sn * 6.2 - 1]] }); return; }
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
for (let k = 0; k < 16; k++) { const a = r.range(0, 6.283), rad = r.range(16, 150); list.push([VP.x + Math.cos(a) * rad, VP.y + Math.sin(a) * rad, 3 + rad / 60, a + Math.PI, rad / 600]); }   // and more of them, far down, all round the bright place
list.sort((a, b) => a[4] - b[4]);
for (const [x, y, s, turn] of list) if (!(x > 880 && y > 380 && y < 760)) virus(x, y, s, turn);

// ---------------------------------------------------------------- fire, where some of them have been hit
// Each is a ball of fire of no fixed shape, with dark smoke round it; its sparks fly on the way that the shot went.
function burst(x, y, R) {
  const way = Math.atan2(y - 583, x - 648);                                 // from Kagerou's gun to this place
  for (const [k, op] of [[3.2, 0.06], [2.2, 0.1], [1.3, 0.16]]) glow(p, x, y, R * k, '#ff8a24', op, 5);
  for (let k = 0; k < 7; k++) { const a = r.range(0, 6.283), d = R * r.range(0.5, 1.2), w = Math.max(9, R * r.range(0.6, 1.0)); p.tryStroke({ brush: 'soft', color: mix('#120c0e', '#34221e', r()), width: w, opacity: r.range(0.22, 0.4), points: [[x + Math.cos(a) * d - w * 1.1, y + Math.sin(a) * d + 3], [x + Math.cos(a) * d, y + Math.sin(a) * d - 3], [x + Math.cos(a) * d + w * 1.1, y + Math.sin(a) * d]] }); }   // the smoke of it
  for (const [n, spread, c0, c1, wide] of [[9, 0.62, '#d8401c', '#ff8c2c', 0.42], [7, 0.4, '#ff9a2c', '#ffd45c', 0.32], [4, 0.2, '#ffe890', '#fffbe8', 0.24]]) for (let k = 0; k < n; k++) {
    const cx = x + r.gauss() * R * spread, cy = y + r.gauss() * R * spread, w = Math.max(5, R * wide * r.range(0.7, 1.2)), a = r.range(0, Math.PI), l = Math.max(w * 2.2, 13) / 2;
    p.tryStroke({ ...line, cap: 'round', color: mix(c0, c1, r()), width: w, opacity: 0.92, mix: 0.25, rag: 0.4, taper: [0.3, 0.3], points: [[cx - Math.cos(a) * l, cy - Math.sin(a) * l], [cx + Math.cos(a) * l, cy + Math.sin(a) * l]] });
  }
  for (let k = 0; k < 6; k++) { const a = way + r.gauss() * 0.5, d0 = R * r.range(0.8, 1.5), l = r.range(13, 34); p.tryStroke({ brush: 'round', color: mix('#ff9a2c', '#ffe890', r()), width: 4, opacity: r.range(0.6, 0.95), taper: [0, 0.7], points: [[x + Math.cos(a) * d0, y + Math.sin(a) * d0], [x + Math.cos(a) * (d0 + l), y + Math.sin(a) * (d0 + l)]] }); }   // sparks
}
burst(452, 560, 34);
burst(368, 648, 50);
burst(540, 470, 18);

p.save();
