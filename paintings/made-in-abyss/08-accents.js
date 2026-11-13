// The last touches: rays of the light down through the haze, in front of the far ruins and
// the edge of the cap, and a brighter place on the plain where the shaft comes down.
'use strict';
const { studio, open, SHAFT, GROUND } = require('./scene');
const { wave } = studio;

const p = open('accents');
const r = p.rng;
const at = (y, off = 0) => [SHAFT.x + y * SHAFT.lean + off * (SHAFT.half + y * 0.12), y];
for (let k = 0; k < 9; k++) {
  const off = r.range(-0.8, 0.7), y0 = r.range(-40, 120), y1 = r.range(560, 740);
  p.stroke({ brush: 'soft', color: '#fffdf0', width: r.range(22, 46), opacity: r.range(0.06, 0.11), taper: [0.15, 0.45], points: [at(y0, off), at((y0 + y1) / 2, off), at(y1, off)] });
}
for (let k = 0; k < 2; k++) {
  const y = GROUND + 30 + k * 22, [x] = at(y);
  p.stroke({ brush: 'soft', color: '#fffbe6', width: 34 + k * 8, opacity: 0.14, points: wave(x - 170 - k * 30, y, x + 170 + k * 30, y + 2, 3, 1, 6) });
}

p.save();
