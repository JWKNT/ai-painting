// Last touches: the glare of the sun spilling over the ridge and the figures, the light on
// the sword, a little more on the water, and the corners of the picture brought down.
'use strict';
const { studio, open, W, H, SUN, RANCE } = require('./scene');

const p = open('accents');
const k = RANCE.h / 400;
const R = (x, y) => [RANCE.x + x * k, RANCE.y + y * k];

// The sun's glare, over everything near it.
for (const [w, o] of [[300, 0.1], [170, 0.14], [90, 0.2]]) {
  p.stroke({ brush: 'soft', color: '#fff0c0', width: w, opacity: o, points: [[SUN.x - w * 1.05, SUN.y + 10], [SUN.x, SUN.y - 4], [SUN.x + w * 1.05, SUN.y + 10]] });
}

// The sword catches the sun along the edge turned to it, brightest near the point.
const d = [0.469, -0.883], n = [0.883, 0.469], fist = [134, -456];
const along = (t, s = 0) => R(fist[0] + d[0] * t + n[0] * s, fist[1] + d[1] * t + n[1] * s);
p.stroke({ brush: 'soft', color: '#fff0d0', width: 22, opacity: 0.35, points: [along(176, -12), along(212, -10), along(250, -5)] });
p.stroke({ color: '#fffaf0', width: 4.4, opacity: 0.95, points: [along(190, -12.5), along(216, -10.5), along(240, -6.5)] });

// Light on the river where it bends toward us.
for (const [x, y, len] of [[690, 664, 30], [668, 694, 34], [560, 734, 44]]) {
  p.line(x - len / 2, y + 1, x + len / 2, y - 1, { color: '#fff6e6', width: 4, opacity: 0.75 });
}

// The corners, a tone darker, so the eye stays with the light.
for (const [x0, y0, x1, y1, w, o] of [
  [-80, H + 30, 700, H + 50, 210, 0.3], [W + 80, H + 30, 900, H + 50, 210, 0.3], [-90, -50, 520, -80, 220, 0.22], [W + 90, -50, 1080, -80, 220, 0.22],
]) {
  p.stroke({ brush: 'soft', color: '#0a0a1c', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

p.save();
