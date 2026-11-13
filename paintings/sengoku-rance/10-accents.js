// Last touches: the sun on the sword and on Rance's right side, a little more light on the
// water, and the bottom of the picture brought down a tone.
'use strict';
const { studio, open, W, H, RANCE } = require('./scene');

const p = open('accents');
const R = (x, y) => [RANCE.x + x, RANCE.y + y];

// The sword catches the sun near its point.
const d = [0.469, -0.883], n = [0.883, 0.469], fist = [132, -456];
const along = (t, s = 0) => R(fist[0] + d[0] * t + n[0] * s, fist[1] + d[1] * t + n[1] * s);
p.stroke({ brush: 'soft', color: '#fff6dc', width: 30, opacity: 0.4, points: [along(176, 10), along(210, 9), along(240, 5)] });
p.stroke({ color: '#ffffff', width: 4.5, points: [along(196, 11.5), along(214, 10.5), along(232, 7)] });

// Sun along the edge of the cape, the shoulder plate and the hair.
p.stroke({ color: '#fffaf0', width: 5, opacity: 0.9, points: [R(64, -300), R(104, -240), R(132, -196)] });
p.stroke({ color: '#a7f0b8', width: 4.5, opacity: 0.85, points: [R(80, -340), R(98, -326), R(106, -300)] });
p.stroke({ color: '#c79a5c', width: 4.5, opacity: 0.8, points: [R(22, -398), R(34, -382), R(38, -362)] });

// Light on the river where it bends.
for (const [x, y, len] of [[690, 664, 30], [668, 694, 34], [560, 734, 44], [430, 762, 50]]) {
  p.line(x - len / 2, y + 1, x + len / 2, y - 1, { color: '#ffffff', width: 4, opacity: 0.8 });
}

// The foot of the picture, a tone darker.
p.stroke({ brush: 'soft', color: '#245a26', width: 96, opacity: 0.3, points: [[-60, H + 16], [W / 2, H + 26], [W + 60, H + 16]] });

p.save();
