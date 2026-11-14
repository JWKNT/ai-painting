// The last touches: the cold light of the column in the air over the plain, and the corners of the picture darker.
'use strict';
const { open, W, H, COL, HORIZON } = require('./scene');

const p = open('accents');
p.stroke({ brush: 'soft', color: '#8cc8f4', width: 200, opacity: 0.06, points: [[COL.x - 420, HORIZON + 60], [COL.x, HORIZON + 20], [COL.x + 420, HORIZON + 60]] });
for (const [x0, y0, x1, y1, w, op] of [[-60, -40, 480, -70, 200, 0.4], [W + 60, -40, 1120, -70, 200, 0.3], [-70, 200, -70, 760, 150, 0.3], [W + 70, 300, W + 70, 800, 150, 0.3], [-60, H + 50, 560, H + 60, 130, 0.36], [W + 60, H + 50, 1040, H + 60, 130, 0.3]]) p.stroke({ brush: 'soft', color: '#020308', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
p.save();
