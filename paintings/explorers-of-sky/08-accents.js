// The last touches: the glare of the sun over what is near it, and the corners of the picture
// brought down a tone, so that the eye stays with the two on the sand.
'use strict';
const { open, W, H, SUN } = require('./scene');

const p = open('accents');
for (const [w, o] of [[300, 0.08], [170, 0.12], [90, 0.2]]) p.stroke({ brush: 'soft', color: '#fff4c4', width: w, opacity: o, points: [[SUN.x - w * 1.05, SUN.y + 8], [SUN.x, SUN.y - 4], [SUN.x + w * 1.05, SUN.y + 8]] });
for (const [x0, y0, x1, y1, w, o] of [[-80, H + 40, 640, H + 60, 200, 0.26], [W + 80, H + 40, 960, H + 60, 200, 0.26], [-90, -50, 480, -80, 200, 0.16], [W + 90, -50, 1120, -80, 200, 0.16]]) {
  p.stroke({ brush: 'soft', color: '#3c2858', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

// Small lights on the path of the sun on the sea: more of them far off, where the path is narrow. None lie over the two on the sand.
const r = p.rng;
for (let k = 0; k < 90; k++) {
  const y = 546 + Math.pow(r(), 1.4) * 116, x = SUN.x + r.gauss() * (12 + (y - 540) * 0.42), len = r.range(12.4, 15) + (y - 540) * r.range(0, 0.06);
  p.tryStroke({ brush: 'round', color: '#fffbe8', width: r.range(4, 4.6), opacity: r.range(0.45, 0.95), points: [[x - len / 2, y], [x + len / 2, y]] });
}

p.save();
