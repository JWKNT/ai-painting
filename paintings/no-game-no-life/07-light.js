// The last touches: the light of the sun over the left of the picture, the rose of the far
// air over the middle of it, and the corners a tone deeper.
'use strict';
const { studio, open, W, H } = require('./scene');
const { mix, glow } = studio;

const p = open('light');
const r = p.rng;
for (const [w, op] of [[560, 0.06], [360, 0.07]]) glow(p, 60, 80, w, '#fff6e8', op, 5);
// the rose of the far air, a little, over the middle of the picture
for (let k = 0; k < 8; k++) { const x = r.range(-100, W - 300), len = r.range(400, 800), y = r.range(600, 700); p.stroke({ brush: 'soft', color: mix('#ffd0e8', '#fff4f8', r()), width: r.range(24, 50), opacity: r.range(0.04, 0.08), points: [[x, y], [x + len / 2, y + r.range(-4, 4)], [x + len, y]] }); }
for (const [x0, y0, x1, y1, w, op] of [[W + 60, -40, 1140, -70, 190, 0.2], [-60, H + 50, 520, H + 60, 150, 0.26], [W + 60, H + 50, 1080, H + 60, 150, 0.3]]) p.stroke({ brush: 'soft', color: '#2a2a78', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
