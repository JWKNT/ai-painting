// New Home, the castle of the king, far off across the lake. It stands on a low shelf of
// rock: a keep with a gabled front and a tall tower behind it, a tower at each side, lower
// towers and walls beyond those, and the small houses of the town about its foot. Its
// walls are pale and its roofs are blue, and they come to points. It is so far off that
// it is small and a little soft; a few of its windows have lamps. The air round it is
// pale with it, and it shows again in the lake, under itself, broken by the water.
'use strict';
const { studio, open, CASTLE, SHORE, nC, hash } = require('./scene');
const { mix, clamp, glow, inPoly } = studio;

const p = open('castle');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.02, rag: 0.08, cap: 'flat' };
const cx = CASTLE.x, by = CASTLE.base;
// The stone of a wall: pale blue where it is turned to the left, where the falls and the open lake are, deeper at the right; lighter high up.
const stone = (side, y) => mix(mix(side < 0 ? '#9cb2d2' : '#5f779e', side < 0 ? '#b8cae4' : '#7890b4', clamp((by - y) / 260, 0, 1)), '#3c4c78', clamp((y - by + 30) / 60, 0, 1) * 0.5);
const slate = (side) => (side < 0 ? mix('#4c70b4', '#6488c8', r()) : mix('#263e70', '#34508c', r()));

// its light in the air round it
for (const [w, op, n] of [[420, 0.06, 5], [280, 0.09, 6], [170, 0.12, 6]]) glow(p, cx, by - 110, w, '#5c7cc0', op, n, 0.7);

// A part of a building: a wall between two heights, its left half lighter than its right; then its roof, a point.
function wallPart(x0, x1, y0, y1) {
  const mid = (x0 + x1) / 2, h = y1 - y0;
  for (let x = x0 + 3.2; x < x1 - 1; x += 5.6) p.tryStroke({ ...line, color: stone(x < mid ? -1 : 1, (y0 + y1) / 2), width: 6.4, points: [[x, y0], [x, y0 + Math.max(13, h)]] });
}
function point(x0, x1, y0, peak) {
  const mid = (x0 + x1) / 2;
  for (const side of [-1, 1]) { const quad = [[mid, y0], [side < 0 ? x0 - 3 : x1 + 3, y0], [mid, peak]]; p.fill({ inside: inPoly(quad), bounds: [x0 - 4, peak, x1 + 4, y0], width: 5, length: 16, spacing: 0.5, angle: () => (side < 0 ? -1 : 1) * Math.atan2(y0 - peak, (x1 - x0) / 2) + Math.PI, color: () => slate(side), stroke: { ...line, cap: 'round', opacity: 0.97 } }); }
  p.tryStroke({ brush: 'round', color: '#a8c4f0', width: 4, opacity: 0.7, taper: [0.1, 0.5], points: [[x0 - 2, y0 - 1], [mid - 1, peak + 2]] });   // the light along its left edge
}
const tower = (x, w, h, roof) => { wallPart(x - w / 2, x + w / 2, by - h, by); point(x - w / 2, x + w / 2, by - h, by - h - roof); };
// Small dark windows, and here and there a lamp.
function windows(x0, x1, y0, y1, n) {
  for (let k = 0; k < n; k++) { const x = r.range(x0 + 4, x1 - 4), y = r.range(y0 + 8, y1 - 16); if (r() < 0.34) { glow(p, x, y + 6, 9, '#ffe2a0', 0.14, 6); p.tryStroke({ brush: 'round', color: mix('#ffe6a8', '#fff6dc', r()), width: 4, opacity: 0.85, points: [[x, y], [x, y + 12.4]] }); } else p.tryStroke({ brush: 'round', color: '#1c2a52', width: 4, opacity: 0.75, points: [[x, y], [x, y + 12.4]] }); }
}

// ---------------------------------------------------------------- the shelf of rock, and the town on it
p.fill({ inside: (x, y) => y > by - 8 - 10 * Math.exp(-Math.pow((x - cx) / 200, 2)) + 5 * (nC(x / 30, 8) - 0.5) && y < SHORE + 8 && Math.abs(x - cx) < 300 - (y - by) * 2, bounds: [cx - 310, by - 26, cx + 310, SHORE + 8], width: 6, length: 40, spacing: 0.5, angle: () => r.range(-0.08, 0.08), color: (x) => mix('#1a2450', '#2a3870', hash(Math.floor(x / 22), 1)), stroke: { ...line, cap: 'round', opacity: 0.96 } });
for (const [dx, w, h, roof] of [[-262, 30, 22, 20], [-226, 36, 30, 24], [236, 34, 26, 22], [270, 28, 20, 18], [-194, 26, 34, 20], [204, 30, 32, 22]]) tower(cx + dx, w, h, roof);

// ---------------------------------------------------------------- the castle, from the back to the front
tower(cx, 52, 214, 60);                                                   // the tall tower behind the keep
tower(cx - 168, 34, 92, 40); tower(cx + 168, 34, 92, 40);                 // the outer towers
wallPart(cx - 152, cx - 124, by - 52, by); wallPart(cx + 124, cx + 152, by - 52, by);   // the walls that join them
tower(cx - 104, 46, 150, 56); tower(cx + 104, 46, 150, 56);               // the two great towers
wallPart(cx - 82, cx + 82, by - 108, by);                                 // the keep
{ const gable = [[cx - 90, by - 106], [cx + 90, by - 106], [cx, by - 166]];   // its gabled front: pale, with a roof edge of blue down each side
  p.fill({ inside: inPoly(gable), bounds: [cx - 90, by - 166, cx + 90, by - 104], width: 5.5, length: 20, spacing: 0.5, angle: () => Math.PI / 2, color: (x) => stone(x < cx ? -1 : 1, by - 130), stroke: { ...line, opacity: 0.97 } });
  for (const side of [-1, 1]) p.tryStroke({ ...line, cap: 'round', color: slate(side), width: 7, points: [[cx + side * 94, by - 103], [cx + side * 46, by - 136], [cx, by - 169]] }); }
for (let x = cx - 150; x <= cx + 150; x += 14) if (Math.abs(x - cx) > 84 && Math.abs(Math.abs(x - cx) - 104) > 26) p.tryStroke({ brush: 'round', color: '#8aa2c6', width: 4.4, points: [[x, by - 50], [x, by - 63]] });   // the teeth of the low walls
p.tryStroke({ ...line, cap: 'round', color: '#18244c', width: 15, points: [[cx, by - 2], [cx, by - 34]] });   // the gate: a dark arch
windows(cx - 78, cx + 78, by - 104, by - 34, 14); windows(cx - 124, cx - 84, by - 146, by - 10, 6); windows(cx + 84, cx + 124, by - 146, by - 10, 6); windows(cx - 22, cx + 22, by - 210, by - 166, 4); windows(cx - 180, cx - 156, by - 88, by - 8, 2); windows(cx + 156, cx + 180, by - 88, by - 8, 2);
p.tryStroke({ brush: 'round', color: '#18244c', width: 4.6, points: [[cx - 7, by - 142], [cx + 7, by - 142]] });   // a round window in the gable
// more of the town, far off at each side of it: only small lamps in the dark
for (let k = 0; k < 26; k++) { const side = r() < 0.5 ? -1 : 1, x = cx + side * r.range(250, 430), y = by - r.range(4, 26) + Math.abs(x - cx) * 0.012; p.tryStroke({ brush: 'round', color: mix('#c8b888', '#fff0c8', r()), width: 4, opacity: r.range(0.2, 0.55), taper: [0.5, 0.5], points: [[x - 6.2, y], [x + 6.2, y]] }); }
// the far air is over all of it, thin, so that it is a little soft; and it stands in mist at its foot
for (let k = 0; k < 9; k++) { const x = cx + r.range(-220, 220), y = by - r.range(20, 230), w = r.range(40, 80); p.stroke({ brush: 'soft', color: '#1c2a64', width: w, opacity: r.range(0.05, 0.1), points: [[x - w * 1.3, y], [x, y + r.range(-8, 8)], [x + w * 1.3, y]] }); }
for (let k = 0; k < 14; k++) { const x = cx + r.range(-330, 330), w = r.range(24, 46); p.stroke({ brush: 'soft', color: mix('#33488c', '#6c84c0', r()), width: w, opacity: r.range(0.08, 0.16), points: [[x - w * 1.3, by + r.range(-10, 12)], [x, by + r.range(-14, 8)], [x + w * 1.3, by + r.range(-10, 12)]] }); }

p.save();
