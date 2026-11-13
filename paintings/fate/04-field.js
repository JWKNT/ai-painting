// The swords in the plain, and those on the hill round him. There are more of them than can
// be counted: far off they are only marks, close together, and nearer each has its blade,
// its guard and its grip. No two stand the same way.
'use strict';
const { studio, open, W, HORIZON, EYE, ARCHER, hillTop, sword } = require('./scene');
const { clamp } = studio;

const p = open('field');
const r = p.rng;
const list = [];
// On the plain: thick near its far edge, where they are small.
for (let k = 0; k < 520; k++) {
  const x = r.range(-20, W + 20), top = hillTop(clamp(x, 0, W)), y = HORIZON + 5 + Math.pow(r(), 1.7) * (top - HORIZON - 8);
  list.push([x, y, r.range(0.75, 1.15), r() < 0.12 ? 'spear' : undefined, clamp(0.72 - (y - HORIZON) / 150, 0.1, 0.72)]);
}
// On the hill, behind him and at each side of him. The place where he stands is clear.
for (let k = 0; k < 40; k++) {
  const x = r.range(-20, W + 20), y = hillTop(clamp(x, 0, W)) + 8 + Math.pow(r(), 1.3) * 110;
  if (Math.abs(x - ARCHER.x) < 190 + (y - 640) * 0.8) continue;
  list.push([x, y, r.range(0.7, 1.05), r() < 0.14 ? 'spear' : undefined, 0.06]);
}
list.sort((a, b) => a[1] - b[1]);
for (const [x, y, L, kind, d] of list) sword(p, x, y, (y - HORIZON) / EYE * (kind === 'spear' ? L * 1.35 : L), { kind, d });

p.save();
