// Last touches. Faces come up over the heel of the hand at the bottom of the picture, so
// that the hand stands in the storm and not in front of it. The fire of the sun lies in the
// air of the middle of the funnel, and sparks of it go round with the storm. And the far
// corners are deep in the dark.
'use strict';
const { studio, open, W, H, SUN, polar, glare, swirlAngle, fire, face, inHand, nA } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('fire');
const r = p.rng;

// ---- the faces nearest to us: great ones, low down at each side of the wrist and over its edges

for (const [x, y, s, rot, turn] of [[562, 966, 150, -1.45, 0.5], [1082, 984, 158, -1.72, -0.5], [404, 1012, 176, -1.3, 0.3], [1262, 1016, 180, -1.84, -0.3], [706, 1050, 124, -1.5, 0.2], [944, 1054, 122, -1.62, -0.2]]) {
  face(p, x, y, s, rot, { turn, gape: r.range(0.6, 1), k: clamp(glare(x, y) * 1.25, 0, 1), dim: 0.26 });
}

// ---- the fire in the air: a veil in the middle of the funnel, over the far faces and behind the hand's fingers... it is in front of nothing near

for (let k = 0; k < 26; k++) {
  const a = r() * 6.283, rad = r.range(110, 330), x = SUN.x + Math.cos(a) * rad, y = SUN.y + Math.sin(a) * rad * 0.9;
  if (inHand(x, y)) continue;
  const w = r.range(70, 130), l = w * r.range(1.05, 1.5), dir = swirlAngle(x, y);
  p.stroke({ brush: 'soft', color: mix('#ff8a38', '#ffc878', Math.exp(-rad / 200)), width: w, opacity: r.range(0.03, 0.06), points: [[x - Math.cos(dir) * l, y - Math.sin(dir) * l], [x, y], [x + Math.cos(dir) * l, y + Math.sin(dir) * l]] });
}

// ---- sparks: short bright marks that go the way of the storm, most of them near the sun

for (let k = 0; k < 64; k++) {
  const a = r() * 6.283, rad = 80 + Math.pow(r(), 1.6) * 330, x = SUN.x + Math.cos(a) * rad, y = SUN.y + Math.sin(a) * rad;
  if (x < 4 || x > W - 4 || y < 4 || y > H - 4 || inHand(x, y)) continue;
  const dir = swirlAngle(x, y), l = r.range(6.4, 15), near = Math.exp(-rad / 380);
  p.tryStroke({ brush: 'soft', color: '#ff9c44', width: 10, opacity: 0.12 * near + 0.03, points: [[x - Math.cos(dir) * 12, y - Math.sin(dir) * 12], [x + Math.cos(dir) * 12, y + Math.sin(dir) * 12]] });
  p.tryStroke({ brush: 'round', color: mix('#ffb04c', '#fff2c8', r() * near), width: r.range(4, 4.6), opacity: clamp(r.range(0.3, 0.7) * (0.3 + near), 0, 1), taper: [0.5, 0.2], points: [[x - Math.cos(dir) * l, y - Math.sin(dir) * l], [x + Math.cos(dir) * l, y + Math.sin(dir) * l]] });
}

// ---- the dark of the far corners, and of the bottom of the picture

for (const [x0, y0, x1, y1, o] of [[-80, 180, 300, -60, 0.22], [1300, -60, 1680, 180, 0.22], [-90, 640, 130, 1050, 0.2], [1470, 1050, 1690, 640, 0.2], [-60, 990, 500, 1030, 0.2], [1100, 1030, 1660, 990, 0.2], [500, 1030, 1100, 1030, 0.14]]) {
  p.stroke({ brush: 'soft', color: '#0a0208', width: 190, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2 + 0.5], [x1, y1]] });
}

p.save();
