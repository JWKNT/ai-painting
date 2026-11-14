// The False Minoshiro. It is the size of a small dog and stands on four thin legs, side on
// to us, with its head to the left. Its body is white and shines so that we cannot see the
// make of it. From its neck and its back long spines stand out, like the rays of a sun, and
// at the end of each is a point of colored light. Round it the air is white.
'use strict';
const { studio, open, SRC, SEVEN, nA } = require('./scene');
const { mix, solid, glow } = studio;

const p = open('creature');
const r = p.rng;
const body = { shadow: '#4cc0d0', half: '#b4f2f2', lit: '#ffffff', rim: '#ffffff', bounce: '#8cdce4' };
const o = { light: [0, -1], turn: -0.4, width: 5, length: 16, vary: 0.04, edge: false };
const X = SRC.x, Y = SRC.y;

// its light on the moss under it, and its light in the air
for (const [w, op] of [[150, 0.16], [90, 0.24], [50, 0.34]]) p.stroke({ brush: 'soft', color: '#e8ffff', width: w, opacity: op, points: [[X - w * 1.3, Y + 76], [X, Y + 72], [X + w * 1.3, Y + 76]] });
for (const [w, op, n] of [[330, 0.07, 5], [220, 0.1, 6], [140, 0.16, 6]]) glow(p, X + 10, Y + 16, w, '#dcffff', op, n);

// its spines: thin, long, from its neck and its back, out and up like the rays of a sun; each ends in a point of colored light
const spines = [];
for (let k = 0; k < 15; k++) { const a = -Math.PI + 0.12 + (Math.PI - 0.24) * k / 14 + r.range(-0.05, 0.05), len = r.range(74, 128) * (0.8 + 0.3 * Math.sin((k / 14) * Math.PI)); spines.push([a, len, X - 24 + 46 * k / 14, Y - 2 - 8 * Math.sin((k / 14) * Math.PI)]); }
for (const [a, len, bx, by] of spines) {
  const tx = bx + Math.cos(a) * len, ty = by + Math.sin(a) * len;
  p.tryStroke({ brush: 'round', color: '#e4ffff', width: 4.2, opacity: 0.95, taper: [0, 0.3], points: [[bx, by], [(bx + tx) / 2 + Math.sin(a) * 4, (by + ty) / 2 - Math.cos(a) * 4], [tx, ty]] });
}

// its body, its neck and head, its legs and its short tail
for (const [x0, x1] of [[X + 52, X + 60], [X + 38, X + 36], [X - 38, X - 44], [X - 24, X - 22]]) solid(p, [[x0, Y + 28, 7], [x1, Y + 52, 5], [x1 + 1, Y + 76, 4.4]], body, { ...o, length: 14 });   // its legs
solid(p, [[X + 56, Y + 22, 25], [X + 6, Y + 18, 29], [X - 36, Y + 12, 23]], body, o);                                         // its body
solid(p, [[X - 40, Y + 6, 17], [X - 60, Y - 18, 14]], body, o);                                                              // its neck
solid(p, [[X - 62, Y - 22, 16], [X - 88, Y - 16, 10]], body, o);                                                             // its head: a long muzzle, toward the left
solid(p, [[X + 76, Y + 16, 9], [X + 100, Y + 6, 5]], body, { ...o, length: 13 });                                             // its tail
// the light is strongest on it: it is nearly all white
for (const [w, op, n] of [[90, 0.2, 6], [54, 0.3, 6]]) glow(p, X + 6, Y + 16, w, '#ffffff', op, n, 0.7);
// the points of colored light at the ends of its spines
spines.forEach(([a, len, bx, by], k) => {
  const tx = bx + Math.cos(a) * len, ty = by + Math.sin(a) * len, c = SEVEN[(k * 3) % 7];
  glow(p, tx, ty, 26, c, 0.16, 4);
  p.tryStroke({ brush: 'round', color: mix(c, '#ffffff', 0.6), width: 5, points: [[tx - 6.4, ty], [tx + 6.4, ty]] });
});

p.save();
