// The last touches: the glare of the sun over what is near it, and the corners of the picture
// brought down a tone, so that the eye stays with the two on the sand.
'use strict';
const { open, W, H, SUN } = require('./scene');

const p = open('accents');
for (const [w, o] of [[300, 0.08], [170, 0.12], [90, 0.2]]) p.stroke({ brush: 'soft', color: '#fff4c4', width: w, opacity: o, points: [[SUN.x - w * 1.05, SUN.y + 8], [SUN.x, SUN.y - 4], [SUN.x + w * 1.05, SUN.y + 8]] });
for (const [x0, y0, x1, y1, w, o] of [[-80, H + 40, 640, H + 60, 200, 0.26], [W + 80, H + 40, 960, H + 60, 200, 0.26], [-90, -50, 480, -80, 200, 0.16], [W + 90, -50, 1120, -80, 200, 0.16]]) {
  p.stroke({ brush: 'soft', color: '#3c2858', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

p.save();
