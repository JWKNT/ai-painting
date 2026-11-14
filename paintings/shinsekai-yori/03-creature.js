// The False Minoshiro. It is the size of a small dog, and it is made like a great slug: a
// long low body that lies on the moss, thick in the middle, with its head to the left and
// a little raised, and two short feelers on the head. Its body is white and shines so
// that we cannot see the make of it. From all along its back long thin feelers stand up
// and bend, and at the end of each is a point of colored light. Round it the air is white.
'use strict';
const { studio, open, SRC, SEVEN } = require('./scene');
const { mix, solid, glow } = studio;

const p = open('creature');
const r = p.rng;
const body = { shadow: '#4cc0d0', half: '#b4f2f2', lit: '#ffffff', rim: '#ffffff', bounce: '#8cdce4' };
const o = { light: [0, -1], turn: -0.4, width: 5, length: 16, vary: 0.04, edge: false };
const X = SRC.x, Y = SRC.y;

// its light on the moss under it, and its light in the air
for (const [w, op] of [[150, 0.16], [90, 0.24], [50, 0.34]]) p.stroke({ brush: 'soft', color: '#e8ffff', width: w, opacity: op, points: [[X - w * 1.3, Y + 76], [X, Y + 72], [X + w * 1.3, Y + 76]] });
for (const [w, op, n] of [[330, 0.07, 5], [220, 0.1, 6], [140, 0.16, 6]]) glow(p, X + 10, Y + 16, w, '#dcffff', op, n);

// the feelers on its back: thin and long, from all along it, up and out, each with its own bend; each ends in a point of colored light
const spines = [];
for (let k = 0; k < 17; k++) { const u = k / 16, a = -Math.PI + 0.3 + (Math.PI - 0.6) * u + r.range(-0.12, 0.12), len = r.range(64, 124) * (0.7 + 0.4 * Math.sin(u * Math.PI)); spines.push([a, len, X - 62 + 128 * u, Y + 30 + 12 * u - 10 * Math.sin(u * Math.PI), r.range(-0.3, 0.3)]); }
const tipOf = ([a, len, bx, by, bend]) => [bx + Math.cos(a + bend) * len, by + Math.sin(a + bend) * len];
for (const sp of spines) {
  const [a, len, bx, by, bend] = sp, [tx, ty] = tipOf(sp), mx = bx + Math.cos(a - bend * 0.6) * len * 0.52, my = by + Math.sin(a - bend * 0.6) * len * 0.52;
  p.tryStroke({ brush: 'round', color: '#e4ffff', width: 4.2, opacity: 0.92, taper: [0, 0.4], points: [[bx, by], [mx, my], [tx, ty]] });
}

// its body: a chain of round parts from its tail, at the right, to its head; and the two feelers on its head
solid(p, [[X + 96, Y + 62, 6], [X + 62, Y + 54, 14], [X + 18, Y + 48, 20], [X - 28, Y + 46, 19], [X - 60, Y + 40, 15], [X - 84, Y + 28, 12]], body, o);
for (const [dx, dy] of [[-22, -30], [-34, -12]]) p.tryStroke({ brush: 'round', color: '#e4ffff', width: 4.4, taper: [0, 0.5], points: [[X - 90, Y + 22], [X - 90 + dx * 0.5, Y + 22 + dy * 0.6], [X - 90 + dx, Y + 22 + dy]] });
// where it lies on the moss it is in its own shade a little
p.tryStroke({ brush: 'soft', color: '#6cc8d4', width: 12, opacity: 0.3, points: [[X - 70, Y + 62], [X + 10, Y + 68], [X + 84, Y + 68]] });
// the light is strongest on it: it is nearly all white
for (const [w, op, n] of [[90, 0.2, 6], [54, 0.3, 6]]) glow(p, X + 6, Y + 40, w, '#ffffff', op, n, 0.6);
// the points of colored light at the ends of its feelers: each a small round light
spines.forEach((sp, k) => {
  const [tx, ty] = tipOf(sp), c = SEVEN[(k * 3) % 7];
  glow(p, tx, ty, 30, c, 0.1, 6); glow(p, tx, ty, 17, mix(c, '#ffffff', 0.3), 0.16, 8);
  p.tryStroke({ brush: 'round', color: mix(c, '#ffffff', 0.7), width: 5.4, taper: [0.5, 0.5], points: [[tx - 6.4, ty], [tx + 6.4, ty]] });
});

p.save();
