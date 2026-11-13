// The swords that are close to us: a few at each side of the picture, big, so that the make
// of each can be seen. And sparks that the wind carries up from the plain.
'use strict';
const { studio, open, W, GLOW, sword } = require('./scene');
const { mix } = studio;

const p = open('near');
const r = p.rng;
for (const [x, y, h, kind, tilt] of [
  [1010, 760, 250, 'long', 0.14], [270, 772, 270, 'katana', -0.2], [1180, 800, 330, 'broad', -0.1], [396, 830, 300, 'long', 0.24],
  [1330, 880, 440, 'long', 0.18], [120, 900, 470, 'broad', -0.12], [1500, 960, 560, 'katana', -0.16], [-10, 980, 420, 'spear', 0.1], [1570, 860, 300, 'spear', 0.06],
]) sword(p, x, y, h, { kind, tilt, d: 0 });

// Sparks: short bright marks that go up and to the right, most of them low and near the glare.
for (let k = 0; k < 70; k++) {
  const x = r.range(40, W - 40), y = 620 - Math.pow(r(), 1.6) * 560, a = -0.9 + r.range(-0.5, 0.5), len = r.range(12.4, 22);
  if (Math.abs(x - 620) < 70 && y > 330) continue;                                               // not over him
  p.tryStroke({ color: mix('#ff8a2c', '#ffe490', r()), width: r.range(4, 4.8), opacity: r.range(0.4, 0.9), taper: [0.6, 0], points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
}
// The glare, over what is near it.
for (const [w, o] of [[300, 0.08], [170, 0.12]]) p.stroke({ brush: 'soft', color: '#fff0b0', width: w, opacity: o, points: [[GLOW.x - w * 1.4, GLOW.y + 6], [GLOW.x, GLOW.y - 8], [GLOW.x + w * 1.4, GLOW.y + 6]] });
// The corners, a tone darker.
for (const [x0, y0, x1, y1, w, o] of [[-80, 1040, 640, 1060, 200, 0.3], [W + 80, 1040, 960, 1060, 200, 0.3]]) p.stroke({ brush: 'soft', color: '#120606', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
