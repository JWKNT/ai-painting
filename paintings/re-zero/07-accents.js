// The last touches. The mist that comes with the whale: veils behind it, so that its tail is
// half in them, veils that hang from it toward the army, and thin mist low on the plain.
// Then a little of the rose light of the wheel in the mist near it, and the dark of the
// corners of the picture, so that the eye goes to the whale and to the lamps under it.
'use strict';
const { studio, open, onWhale } = require('./scene');
const { mix, wave } = studio;

const p = open('accents');
const r = p.rng;
const veil = (x, y, len, width, color, opacity, sag = 10) => p.stroke({ brush: 'soft', color, width, opacity, points: wave(x - len / 2, y, x + len / 2, y + r.range(-sag, sag), 8, 1, 6) });

for (let k = 0; k < 12; k++) { const [x, y] = onWhale(r.range(0.8, 1.32), r.range(-0.14, 0.24)); veil(x, y, r.range(220, 420), r.range(40, 80), mix('#6c84c0', '#c4d4fc', r()), r.range(0.08, 0.15), 16); }
for (let k = 0; k < 10; k++) veil(r.range(560, 1420), r.range(610, 730), r.range(260, 520), r.range(30, 60), mix('#5c74b0', '#a8bcec', r()), r.range(0.06, 0.12));
for (let k = 0; k < 8; k++) veil(r.range(200, 1300), r.range(800, 868), r.range(300, 600), r.range(22, 40), mix('#4c64a0', '#8ca4d8', r()), r.range(0.06, 0.11), 5);
for (let k = 0; k < 5; k++) veil(r.range(40, 520), r.range(690, 760), r.range(260, 460), r.range(24, 44), mix('#4c64a0', '#9cb4e4', r()), r.range(0.08, 0.14), 5);   // round the foot of the tree

{ const [x, y] = onWhale(0.43, 0.31); for (const [w, op] of [[150, 0.07], [90, 0.09]]) p.stroke({ brush: 'soft', color: '#ff8cd8', width: w, opacity: op, points: [[x - w * 1.1, y + 8], [x, y], [x + w * 1.1, y - 8]] }); }

for (const [x0, y0, x1, y1, w, op] of [[-40, 1020, 560, 1020, 170, 0.34], [1060, 1024, 1650, 1004, 130, 0.3], [-40, 660, -40, 1010, 140, 0.3], [1640, 620, 1640, 1010, 120, 0.26], [-30, -20, 460, -20, 130, 0.3], [1100, -30, 1640, -30, 110, 0.22]]) p.stroke({ brush: 'soft', color: '#02040a', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
