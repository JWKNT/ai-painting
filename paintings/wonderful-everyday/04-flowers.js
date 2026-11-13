// The sunflowers on the hill, from the top of it down to the middle. Far off they are dabs
// of yellow, close together; nearer, each has its petals and its heart, and they all look
// the same way, toward the sun, which is behind us.
'use strict';
const { open, W, crest, near, onPath, sunflower } = require('./scene');

const p = open('flowers');
const r = p.rng;
const list = [];
for (let k = 0; k < 2600; k++) {
  const x = r.range(-20, W + 20), y = crest(Math.max(0, Math.min(W, x))) + 4 + Math.pow(r(), 1.9) * 300;
  if (y > 820 || onPath(x, y, 6 + 26 * near(x, y))) continue;
  list.push([x, y]);
}
list.sort((a, b) => a[1] - b[1]);
for (const [x, y] of list) {
  const k = near(Math.max(0, Math.min(W, x)), y), R = (4 + 62 * Math.pow(k, 1.25)) * r.range(0.8, 1.2);
  sunflower(p, x, y - R * 0.6, R, { d: 0.5 * (1 - k * 2) });
}

p.save();
