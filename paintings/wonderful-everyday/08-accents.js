// The last touches: the light of the sun where it comes past the edges of things near it,
// a little more of the deep blue in the corner of the sky that is far from the sun, and a
// little dark in the low corners, so that the eye stays in the middle of the roof.
'use strict';
const { open, SUN, HUT, TANK, F, HZ, EYE, at } = require('./scene');

const p = open('accents');
// the sun past the right side of the tank, the top of the aerial, and the edge of the roof of the hut
const tx = at(TANK.x, 0, TANK.z)[0] + F * TANK.r / TANK.z, ty = HZ - F * (TANK.h1 - EYE) / TANK.z;
for (const [x, y, len, w, op] of [[tx, ty + 30, 150, 46, 0.14], [tx - 10, ty - 6, 120, 34, 0.12], [at(-3.1, 5.75, 13.5)[0], at(-3.1, 5.75, 13.5)[1], 110, 30, 0.14], [at(HUT.x1, HUT.h, HUT.z0)[0], at(HUT.x1, HUT.h + 0.18, HUT.z0)[1], 120, 30, 0.1]]) {
  const dx = SUN.x - x, dy = SUN.y - y, l = Math.hypot(dx, dy);
  p.stroke({ brush: 'soft', color: '#ffffff', width: w, opacity: op, points: [[x - dx / l * len * 0.25, y - dy / l * len * 0.25], [x + dx / l * len * 0.3, y + dy / l * len * 0.3], [x + dx / l * len, y + dy / l * len]] });
}
// the deep blue of the far corner of the sky, and the low corners of the picture
p.stroke({ brush: 'soft', color: '#061c64', width: 150, opacity: 0.22, points: [[1150, -30], [1420, -20], [1660, 40]] });
p.stroke({ brush: 'soft', color: '#061c64', width: 110, opacity: 0.16, points: [[1640, -20], [1640, 110], [1630, 260]] });
p.stroke({ brush: 'soft', color: '#0c1830', width: 130, opacity: 0.3, points: [[-40, 1020], [220, 1024], [520, 1030]] });
p.stroke({ brush: 'soft', color: '#1c2a44', width: 110, opacity: 0.2, points: [[1100, 1030], [1380, 1026], [1650, 1010]] });

p.save();
