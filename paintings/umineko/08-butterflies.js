// The golden butterflies. They leave the roses in two long streams, one from the beds at
// the left and one from the bed at the right, pass the arbor, and go up and round into the
// middle of the turning sky, smaller and smaller, until they are only flecks of gold in it.
// A few fly close to us, over the paving. Then the last touches: the gold of the beds on the
// stone beside them, petals that have come down, and the corners a tone darker.
'use strict';
const { studio, open, W, H, VORTEX, AVENUE, ARBOR, at, swirlAngle, butterfly, fleck, gold } = require('./scene');
const { mix, clamp } = studio;

const p = open('butterflies');
const r = p.rng;

// A stream: a line through some places. `along(t)` is a place on it and the way that it goes there.
function stream(pts) {
  const n = pts.length - 1;
  return (t) => {
    const f = clamp(t, 0, 0.9999) * n, i = Math.floor(f), u = f - i, a = pts[Math.max(0, i - 1)], b = pts[i], c = pts[i + 1], d = pts[Math.min(n, i + 2)];
    const cr = (k) => 0.5 * (2 * b[k] + (-a[k] + c[k]) * u + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * u * u + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * u * u * u);
    const dr = (k) => 0.5 * ((-a[k] + c[k]) + 2 * (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * u + 3 * (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * u * u);
    return { x: cr(0), y: cr(1), way: Math.atan2(dr(1), dr(0)) };
  };
}
// A butterfly that is near enough for its make to be seen. Each fore wing is three strokes that fan, and each hind wing two,
// so the wings are broad; the edge of the fore wing is deep gold; and between the wings is the dark body, with its two feelers.
function near(x, y, len, heading, spread) {
  const tone = () => mix(gold(r.range(0.42, 0.66)), '#fff4c0', 0.3 * r()), c = Math.cos(heading), s = Math.sin(heading);
  { const w = Math.max(9, len * 1.15), turn = r() * 3; for (let i = 0; i < 4; i++) { const a = turn + i * Math.PI / 4; p.tryStroke({ brush: 'soft', color: '#ffb030', width: w, opacity: 0.075, points: [[x - Math.cos(a) * w * 1.06, y - Math.sin(a) * w * 1.06], [x, y], [x + Math.cos(a) * w * 1.06, y + Math.sin(a) * w * 1.06]] }); } }   // its light, round it
  const tipOf = (a, l) => [x + Math.cos(heading + a) * l, y + Math.sin(heading + a) * l];
  const wing = (a, l, w, col) => p.tryStroke({ brush: 'bristle', color: col, width: Math.max(4.8, Math.min(w, l / 2.05)), taper: [0.75, 0.1], mix: 0.05, dry: 0, rag: 0.08, cap: 'round', points: [[x, y], tipOf(a, l * 0.55), tipOf(a, l)] });
  for (const side of [-1, 1]) {
    const k = side > 0 ? 1 : 0.8, fore = side * (0.44 + 0.6 * spread), hind = side * (Math.PI - 0.6 - 0.4 * spread);   // the wings of the far side are a little shorter
    for (const [da, kl] of [[0, 0.62], [0.32, 0.54]]) wing(hind - side * da, len * kl * k, len * 0.3 * k, tone());
    for (const [da, kl] of [[0.5, 0.76], [0.25, 0.92], [0, 1]]) wing(fore + side * da, len * kl * k, len * 0.44 * k, tone());
    p.tryStroke({ brush: 'round', color: gold(0.2), width: 4.2, opacity: 0.8, points: [tipOf(fore, len * k * 1.04), tipOf(fore + side * 0.25, len * k * 0.98), tipOf(fore + side * 0.5, len * k * 0.82)] });   // the deep gold along the edge of the fore wing
    p.tryStroke({ brush: 'round', color: '#fff8d4', width: 4, opacity: 0.75, taper: [0.2, 0.6], points: [tipOf(fore + side * 0.14, len * k * 0.2), tipOf(fore + side * 0.14, len * k * 0.74)] });                   // and the light in it
  }
  p.tryStroke({ brush: 'round', color: '#4c2606', width: 4.8, points: [[x - c * len * 0.3, y - s * len * 0.3], [x + c * len * 0.3, y + s * len * 0.3]] });                                                     // the body
  if (len >= 30) for (const side of [-1, 1]) p.tryStroke({ brush: 'round', color: '#6c3c0a', width: 4, opacity: 0.85, taper: [0, 0.8], points: [[x + c * len * 0.3, y + s * len * 0.3], [x + c * len * 0.5 - s * side * len * 0.1, y + s * len * 0.5 + c * side * len * 0.1], [x + c * len * 0.66 - s * side * len * 0.22, y + s * len * 0.66 + c * side * len * 0.22]] });   // its two feelers
}
const STREAMS = [
  [stream([[250, 646], [400, 590], [540, 520], [640, 420], [716, 320], [790, 250], [850, 218], [880, 206]]), 44],
  [stream([[1540, 650], [1400, 590], [1270, 500], [1150, 400], [1050, 310], [970, 248], [915, 216], [890, 206]]), 38],
];
// Each has room: none lies over another. They are big where they leave the roses and small where they go into the sky.
const list = [];
for (const [along, count] of STREAMS) for (let i = 0; i < count; i++) {
  for (let tries = 0; tries < 4; tries++) {
    const t = Math.pow((i + r()) / count, 0.9), q = along(t), off = r.gauss() * ((1 - t) * 46 + 9), len = 30 * Math.pow(1 - t, 1.3) + 10;
    const b = { x: q.x - Math.sin(q.way) * off, y: q.y + Math.cos(q.way) * off, len, way: q.way, t };
    if (list.every((o) => Math.hypot(o.x - b.x, o.y - b.y) > 0.8 * (o.len + b.len))) { list.push(b); break; }
  }
}
list.sort((a, b) => b.t - a.t);                                          // the far ones first
for (const b of list) {
  if (b.len < 13.5) fleck(p, b.x, b.y, 0.9);
  else if (b.len >= 21) near(b.x, b.y, b.len, b.way + r.range(-0.7, 0.7), r.range(0.5, 0.95));
  else butterfly(p, b.x, b.y, b.len, b.way + r.range(-0.7, 0.7), { bright: 0.2 + 0.3 * r(), opacity: 0.95, glow: b.len > 17 });
}
// In the turning itself they are only flecks that go round with it, more of them toward the middle.
for (let k = 0; k < 64; k++) {
  const rad = 30 + Math.pow(r(), 1.6) * 250, a = r.range(0, 6.283), x = VORTEX.x + Math.cos(a) * rad, y = VORTEX.y + Math.sin(a) * rad / VORTEX.squash;
  if (y > 300 && Math.abs(x - 860) < 60) continue;                                               // not over the point of the roof
  const w = swirlAngle(x, y), l = r.range(12.4, 15);
  p.tryStroke({ brush: 'round', color: gold(r.range(0.5, 0.95)), width: r.range(4, 4.6), opacity: clamp(1.05 - rad / 300, 0.3, 0.95) * r.range(0.6, 1), points: [[x - Math.cos(w) * l / 2, y - Math.sin(w) * l / 2], [x + Math.cos(w) * l / 2, y + Math.sin(w) * l / 2]] });
}

// Those that fly close to us, over the paving and by the bush.
near(1010, 786, 36, -1.1, 0.7);
near(1444, 800, 34, -2.4, 0.9);
near(600, 652, 34, -0.8, 0.8);
near(1206, 888, 52, -1.9, 0.8);

// ---------------------------------------------------------------- the last touches
// The gold of the beds on the paving beside them.
for (const [X, z0, z1] of [[AVENUE.left + 0.9, 6.6, 14.5], [AVENUE.right - 0.9, 8.6, 14.5]]) for (let k = 0; k < 4; k++) {
  const a = at(X + r.range(-0.3, 0.5), 0, z0), b = at(X + r.range(-0.3, 0.5), 0, (z0 + z1) / 2), c = at(X, 0, z1);
  p.stroke({ brush: 'soft', color: '#f0b830', width: r.range(40, 70), opacity: 0.08, points: [a, b, c] });
}
// Petals that have come down on the stone: short touches of deep gold that lie every way, most of them near the beds.
for (let k = 0; k < 30; k++) {
  const Z = r.range(5.4, 15), side = r() < 0.6 ? -1 : 1, X = side < 0 ? AVENUE.left + Math.pow(r(), 2.6) * 3 + 0.2 : AVENUE.right - Math.pow(r(), 2.6) * 2.4 - 0.2, [x, y] = at(X, 0, Z);
  if (x < 0 || x > W || y > H - 4) continue;
  const len = clamp(0.1 * 1150 / Z, 12.4, 22), a = r.range(-0.5, 0.5);
  p.tryStroke({ brush: 'round', color: gold(r.range(0.3, 0.7)), width: clamp(0.03 * 1150 / Z, 4, 6), opacity: r.range(0.6, 0.95), taper: [0.2, 0.4], points: [[x - Math.cos(a) * len / 2, y - Math.sin(a) * len * 0.2], [x + Math.cos(a) * len / 2, y + Math.sin(a) * len * 0.2]] });
}
// The white of the arbor, a little, in the stone in front of its steps.
{ const [ax, ay] = at(ARBOR.X, 0, ARBOR.Z - 4.3); p.stroke({ brush: 'soft', color: '#e8dcf4', width: 44, opacity: 0.1, points: [[ax - 170, ay + 6], [ax, ay + 12], [ax + 170, ay + 6]] }); }
// The gold of a near butterfly in the stone under it.
for (const [x, y, len] of [[1010, 786, 36], [1206, 888, 52]]) p.tryStroke({ brush: 'soft', color: '#ffb030', width: len * 0.9, opacity: 0.12, points: [[x, y + len * 0.5], [x, y + len * 2.6]] });
// The light of the middle of the sky, a little, in the stone under it; and the corners.
p.stroke({ brush: 'soft', color: '#ffc0f0', width: 120, opacity: 0.08, points: [[VORTEX.x - 150, 968], [VORTEX.x, 960], [VORTEX.x + 150, 968]] });
for (const [x0, y0, x1, y1, w, op] of [[W + 60, 1030, 1040, 1050, 190, 0.32], [-60, 1040, 520, 1056, 150, 0.3], [-60, -40, 420, -70, 180, 0.3], [W + 60, -40, 1180, -70, 180, 0.3]]) p.stroke({ brush: 'soft', color: '#08030f', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
