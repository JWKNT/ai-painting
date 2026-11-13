// Last touches. In this world a thing that is destroyed breaks into splinters of light, so
// the air round the castle is full of them, pale blue, rising and scattering. Then the glare
// of the sun over what is near it, and the corners of the picture brought down.
'use strict';
const { studio, open, W, H, SUN, AX, breakLine, glow } = require('./scene');
const { mix, clamp } = studio;

const p = open('accents');
const r = p.rng;

// Splinters of light: thickest along the break, where the stone is going to pieces, and
// drifting up and away from it; a few far out in the sky. Each is a short pale mark, some
// with a glow round them.
function splinter(x, y, a, strength) {
  const len = r.range(12.4, 16), c = Math.cos(a), s = Math.sin(a), big = r() < 0.6;
  if (big) p.tryStroke({ brush: 'soft', color: '#9fd8ff', width: 13, opacity: 0.32 * strength, points: [[x - c * 14, y - s * 14], [x + c * 14, y + s * 14]] });
  p.line(x - c * len / 2, y - s * len / 2, x + c * len / 2, y + s * len / 2, { color: mix(mix('#9fd4ff', '#eefaff', r()), '#fff0d8', clamp(glow(x, y, 300), 0, 0.5)), width: big ? 5 : 4, opacity: clamp(r.range(0.5, 1) * strength, 0, 1) });
}
for (let k = 0; k < 30; k++) {
  const x = AX + r.range(-1, 1) * r.range(30, 250), up = Math.pow(r(), 1.8) * 120, y = breakLine(clamp(x, AX - 230, AX + 230)) + 26 - up;
  if (Math.hypot(x - SUN.x, y - SUN.y) < 80) continue;
  splinter(x + (x - AX) * up / 500, y, -1.57 + (x - AX) / 420 + r.range(-0.9, 0.9), 1 - up / 220);
}
for (const [x, y] of [[560, 500], [962, 512], [664, 558], [868, 578], [520, 598], [752, 560], [716, 640], [620, 656], [918, 660], [1046, 506]]) {   // and off each falling piece
  splinter(x + r.range(-40, 40), y - r.range(10, 70), -1.57 + r.range(-0.6, 0.6), r.range(0.6, 0.9));
}
for (let k = 0; k < 5; k++) splinter(r.range(300, W - 300), r.range(120, 420), r.range(0, 3.14), r.range(0.3, 0.5));

// The glare of the sun, over everything near it.
for (const [w, o] of [[320, 0.1], [180, 0.14], [100, 0.24], [64, 0.4]]) {
  p.stroke({ brush: 'soft', color: '#fff0c0', width: w, opacity: o, points: [[SUN.x - w * 1.05, SUN.y + 10], [SUN.x, SUN.y - 4], [SUN.x + w * 1.05, SUN.y + 10]] });
}

// The corners, a tone darker, so the eye stays with the light.
for (const [x0, y0, x1, y1, w, o] of [
  [-80, H + 40, 700, H + 60, 200, 0.3], [W + 80, H + 40, 900, H + 60, 200, 0.3], [-90, -50, 520, -80, 220, 0.24], [W + 90, -50, 1080, -80, 220, 0.24],
]) {
  p.stroke({ brush: 'soft', color: '#0a0a20', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

p.save();
