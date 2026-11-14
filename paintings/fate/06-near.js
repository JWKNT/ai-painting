// The swords that are close to us: a few at each side of the picture, big, so that the make
// of each can be seen. And sparks that the wind carries up from the plain.
'use strict';
const { studio, open, W, GLOW, SHIROU, bigSword } = require('./scene');
const { mix } = studio;

const p = open('near');
const r = p.rng;
// The further of them first.
for (const [x, y, h, kind, tilt] of [
  [1090, 746, 212, 'long', 0.14], [196, 758, 226, 'katana', -0.2], [1206, 776, 270, 'saber', -0.14], [318, 800, 250, 'broad', 0.22],
  [1320, 846, 370, 'great', 0.16], [150, 870, 400, 'long', -0.12], [1126, 930, 420, 'katana', 0.1],
  [1490, 950, 500, 'broad', -0.14], [12, 976, 470, 'spear', 0.1], [1590, 900, 390, 'spear', 0.05], [330, 990, 460, 'great', -0.18],
]) bigSword(p, x, y, h, { kind, tilt });

// Sparks: short bright marks that go up and to the right, most of them low and near the glare.
for (let k = 0; k < 70; k++) {
  const x = r.range(40, W - 40), y = 620 - Math.pow(r(), 1.6) * 560, a = -0.9 + r.range(-0.5, 0.5), len = r.range(12.4, 22);
  if (Math.abs(x - SHIROU.x) < 46 && y > 460) continue;                                          // not over him
  p.tryStroke({ color: mix('#ff8a2c', '#ffe490', r()), width: r.range(4, 4.8), opacity: r.range(0.4, 0.9), taper: [0.6, 0], points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
}
// The glare, over what is near it.
for (const [w, o] of [[300, 0.08], [170, 0.12]]) p.stroke({ brush: 'soft', color: '#fff0b0', width: w, opacity: o, points: [[GLOW.x - w * 1.4, GLOW.y + 6], [GLOW.x, GLOW.y - 8], [GLOW.x + w * 1.4, GLOW.y + 6]] });
// The corners, a tone darker.
for (const [x0, y0, x1, y1, w, o] of [[-80, 1040, 640, 1060, 200, 0.3], [W + 80, 1040, 960, 1060, 200, 0.3]]) p.stroke({ brush: 'soft', color: '#120606', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
