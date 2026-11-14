// The last touches: the glare of the sun, which is out of the picture at the upper right,
// over the sky and the corner of the building; the heat that makes the far roofs pale; and
// the lower corners a tone darker.
'use strict';
const { open, W, H } = require('./scene');

const p = open('accents');
for (const [w, op] of [[520, 0.1], [340, 0.12], [200, 0.14]]) p.stroke({ brush: 'soft', color: '#ffffff', width: w, opacity: op, points: [[W + 60 - w * 1.1, -40 + w * 0.6], [W + 40, -40], [W + 60 + w * 0.2, -40 - w * 1.0]] });
p.stroke({ brush: 'soft', color: '#fffdf0', width: 60, opacity: 0.1, points: [[940, 300], [960, 600], [980, 900]] });                 // the sun on the side wall, in the air beside it
p.stroke({ brush: 'soft', color: '#e8f0f0', width: 130, opacity: 0.16, points: [[1040, 990], [1320, 960], [1640, 940]] });            // the heat over the far roofs
for (const [x0, y0, x1, y1, w, op] of [[-60, H + 50, 520, H + 60, 150, 0.2], [-70, 420, -70, 1010, 130, 0.14]]) p.stroke({ brush: 'soft', color: '#2c3440', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
p.save();
