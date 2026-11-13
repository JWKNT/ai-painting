// The end of the street: the last houses, small with distance, dark trees, and beyond them
// the church with its onion tower. The rain has taken the darks out of all of it, so it is
// painted in greys only a little darker than the sky.
'use strict';
const { studio, open } = require('./scene');
const { mix, wave, solid, mass } = studio;

const p = open('church');
const r = p.rng;
const stroke = { brush: 'bristle', mix: 0.1, dry: 0.04, rag: 0.15, cap: 'flat', streak: 0.25, jitter: 0.4 };
const upright = (x, y0, y1, w, color, o = {}) => p.tryStroke({ ...stroke, ...o, color, width: w, points: [[x, y0], [x + (o.lean || 0), y1]] });
const level = (x0, x1, y, w, color, o = {}) => p.tryStroke({ ...stroke, ...o, color, width: w, points: [[x0, y], [x1, y + (o.drop || 0)]] });

// Trees round the church.
mass(p, [[900, 492, 26], [936, 484, 30], [1066, 486, 30], [1102, 496, 24], [760, 498, 22], [800, 492, 24]], { light: [0, -1], tones: (t) => mix('#55635f', '#7a8884', t), base: 516, bias: 0.4, contrast: 0.5, grain: 0.3, mix: 0.25, layers: [[10, 24, 0.95, 4, 0.45], [6, 15, 0.8, 3, 0.75]], seed: 5 });

// The church: far off, tall. Its roof and walls, then the tower with the onion dome.
for (let y = 478; y < 516; y += 10) level(1016, 1110, y, 12, mix('#99a4a1', '#7c8886', (y - 478) / 40));
level(1010, 1116, 466, 13, '#66726f');
level(1016, 1110, 455, 10, '#727e7c');
upright(988, 250, 514, 21, '#97a3a1');                                // the tower: its lit face
upright(1008, 250, 514, 20, '#737f7d');                               // and its shaded one
for (const x of [988, 1008]) upright(x, 270, 296, 6, '#4a5658', { opacity: 0.8 });   // the openings of the belfry
level(974, 1022, 310, 4.6, '#5c686a', { opacity: 0.7 });
level(972, 1024, 249, 8, '#56626a');
solid(p, [[998, 236, 25], [998, 216, 22], [998, 196, 10], [998, 172, 4.6]], { shadow: '#46525a', half: '#5c686e', lit: '#8c989a', rim: '#b4bebc' }, { light: [-0.7, -0.5], turn: 0, width: 5, length: 18, vary: 0.05, dash: 12, gap: 8, edgeOpacity: 0.5 });   // the onion
upright(998, 138, 172, 4.6, '#4a565c');                               // the cross on it
level(989, 1007, 148, 4.6, '#4a565c');

// The last houses of the street, across its end.
for (const [x0, x1, top, base, wall, roof] of [[640, 716, 462, 518, '#939d9a', '#667270'], [712, 800, 474, 520, '#a2aaa6', '#6c7876'], [796, 880, 468, 522, '#98a29e', '#64706e'], [1090, 1020, 458, 524, '#a6aea8', '#6e7a78'], [1024, 950, 472, 524, '#9ca6a2', '#687472']]) {
  const a = Math.min(x0, x1), b = Math.max(x0, x1);
  for (let y = top + 8; y < base; y += 11) level(a, b, y, 13, mix(wall, '#6f7b79', (y - top) / (base - top) * 0.45));
  level(a - 4, b + 4, top, 12, roof);
  level(a - 2, (a + b) / 2, top - 9, 10, mix(roof, '#8f9b9b', 0.3), { drop: -9 });
  level((a + b) / 2, b + 2, top - 18, 10, roof, { drop: 9 });
  for (let x = a + 13; x < b - 8; x += 20) upright(x, top + 15, top + 28, 5, '#4e5a5c', { opacity: 0.75 });   // windows
}

// Rain in front of all of it.
for (let k = 0; k < 10; k++) {
  const x = r.range(600, 1000), y = r.range(440, 520), len = r.range(160, 320);
  p.stroke({ brush: 'soft', color: mix('#9aa6a4', '#c4ccc8', r()), width: r.range(26, 44), opacity: r.range(0.12, 0.24), points: wave(x, y, x + len, y + r.range(-5, 5), 4, 1, 7) });
}

p.save();
