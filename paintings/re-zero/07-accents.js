// The last touches: the light of the sun, which comes in from the upper right over
// everything; and a few feathers that the doves have let fall.
'use strict';
const { open, W } = require('./scene');

const p = open('accents');
const r = p.rng;
for (const [w, o] of [[420, 0.1], [260, 0.1]]) p.stroke({ brush: 'soft', color: '#fff8dc', width: w, opacity: o, points: [[W + 60, -200], [W - 200, 380], [W - 560, 1000]] });
for (const [x, y, a] of [[520, 610, 0.5], [900, 560, -0.6], [1010, 700, 1.0], [420, 760, -0.3], [1180, 620, 0.2]]) {
  const len = r.range(16, 22), c = Math.cos(a), s = Math.sin(a);
  p.tryStroke({ brush: 'bristle', color: '#ffffff', width: 6, opacity: 0.9, mix: 0.05, dry: 0, rag: 0.1, cap: 'round', taper: [0.3, 0.6], points: [[x - c * len / 2, y - s * len / 2], [x + s * 3, y - c * 3], [x + c * len / 2, y + s * len / 2]] });
}

p.save();
