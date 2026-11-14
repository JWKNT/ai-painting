// The last touches: the light of the sun, which is out of the picture at the upper left;
// the heat over the sand; and the corners of the picture, a tone deeper.
'use strict';
const { studio, open, W, H } = require('./scene');
const { glow } = studio;

const p = open('light');
for (const [w, op] of [[600, 0.06], [380, 0.07]]) glow(p, -40, -40, w, '#fffdf0', op, 5);
p.stroke({ brush: 'soft', color: '#fffbe8', width: 60, opacity: 0.06, points: [[-40, 720], [W / 2, 712], [W + 40, 720]] });
for (const [x0, y0, x1, y1, w, op] of [[W + 60, -40, 1140, -70, 190, 0.2], [-60, H + 50, 520, H + 60, 130, 0.14], [W + 60, H + 50, 1080, H + 60, 130, 0.14]]) p.stroke({ brush: 'soft', color: '#0c2c6c', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
void H;

p.save();
