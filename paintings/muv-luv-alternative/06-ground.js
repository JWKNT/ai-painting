// The near ground: shell holes, the wreck of an earlier fight, and the first of the
// Tank-class already close.
'use strict';
const { studio, open, W, H, LIGHT, glow } = require('./scene');
const { tank } = require('./beta');
const { mix, solid, glint, clamp } = studio;

const p = open('ground');
const r = p.rng;
const ember = () => mix('#ff8a3a', '#ffd088', r());

// Shell holes: a dark hollow, and the glare along its far lip.
for (const [x, y, w] of [[860, 880, 150], [1210, 846, 110], [640, 936, 190], [1420, 880, 120], [300, 900, 140]]) {
  for (let k = 0; k < 4; k++) p.stroke({ brush: 'bristle', color: mix('#07060c', '#120e16', r()), width: w * 0.085, opacity: 0.85, mix: 0.2, dry: 0.05, rag: 0.4, taper: [0.4, 0.4], points: [[x - w * (0.5 - k * 0.04), y + k * w * 0.05], [x, y + w * 0.06 + k * w * 0.05], [x + w * (0.5 - k * 0.04), y + k * w * 0.05]] });
  glint(p, [[x - w * 0.42, y - w * 0.02], [x, y - w * 0.07], [x + w * 0.42, y - w * 0.02]], () => mix('#a83a26', '#ff9a50', r() * clamp(glow(x, y, 600) + 0.3, 0, 1)), { width: 4.6, dash: 34, gap: 12, opacity: 0.6, rng: r });
}

// Wreckage: the blade of a fallen fighter standing in the ground, a plate of its armor, and
// broken steel.
const steel = { shadow: '#08090f', half: '#151a28', lit: '#3a4664', rim: '#ffac6c', bounce: '#101624' };
const o = { light: LIGHT, turn: 0.5, width: 5.5, length: 30, vary: 0.05, dash: 30, gap: 12, edgeOpacity: 0.8 };
solid(p, [[176, 968, 8], [160, 880, 9.5], [142, 780, 8], [134, 730, 4.6]], steel, { ...o, length: 44 });                 // the blade
solid(p, [[158, 906, 14], [192, 898, 14]], steel, o);                                                                 // its guard, half buried
solid(p, [[236, 986, 26], [300, 962, 30], [352, 976, 22]], steel, o);                                                 // a plate of armor
for (const [x0, y0, x1, y1, w] of [[52, 996, 92, 884, 8], [20, 950, 120, 918, 7], [1512, 998, 1560, 930, 8]]) {                  // broken steel
  p.stroke({ brush: 'bristle', color: '#08090f', width: w, mix: 0, dry: 0, rag: 0.2, cap: 'flat', points: [[x0, y0], [x1, y1]] });
  if (r() < 0.6) glint(p, [[x0 + 3, y0], [(x0 + x1) / 2 + 3, (y0 + y1) / 2], [x1 + 3, y1]], ember, { width: 4, dash: 22, gap: 26, opacity: 0.4, rng: r });
}

// Stones and clods: short dark marks, a few with the glare on them.
for (let k = 0; k < 90; k++) {
  const x = r.range(0, W), y = r.range(800, H), len = r.range(13, 30), a = r.range(-0.2, 0.2);
  p.tryStroke({ brush: 'bristle', color: mix('#07060c', '#17111a', r()), width: r.range(5, 10), opacity: 0.8, mix: 0.1, dry: 0.05, rag: 0.4, points: [[x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2], [x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2]] });
  if (r() < 0.3) p.tryStroke({ color: ember(), width: 4, opacity: r.range(0.25, 0.5) * clamp(glow(x, y, 700) + 0.3, 0, 1), points: [[x - 6.3, y - 4], [x + 6.3, y - 4.5]] });
}

// The Tank-class that are nearest: red, low, running at us.
tank(p, 1096, 874, 1.3);
tank(p, 1262, 906, 1.6);
tank(p, 1438, 958, 2.0);
tank(p, 980, 944, 1.5);

p.save();
