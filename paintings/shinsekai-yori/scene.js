// Shared layout, palette and brush habits for the Shinsekai Yori painting.
//
// The scene: the False Minoshiro. A thousand years from now, five children on a summer
// camp go where they must not, and in the forest they find a thing that the grown people
// say does not exist: a creature the size of a small dog, on four legs, with long spines
// on its back, that shines. It is a machine, and it holds the books of the old world. When
// it is in danger, its spines stand up and give out light of seven colors, which goes
// through the forest in rays and takes the will from any who look at it. We see it from
// far enough: the dark trunks of the cedars, the ferns, the mist, the creature small and
// white in the middle of its own light, and the rays. No one is in the picture.
//
// The creature is the light. A ray has the color of the way that it goes out from the
// creature, so each trunk and each fern takes the color of the ray that falls on it.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const SRC = { x: 930, y: 628 };             // the middle of the light: the spines on its back
const GROUND = 700;                         // the forest floor under it

const nA = noise2(1011), nB = noise2(1013), nC = noise2(1019);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// The seven colors. The light goes out in rays of unequal width; each ray has one of the seven colors and its own strength,
// and they do not come in the order of the rainbow.
const SEVEN = ['#ff3838', '#ff982c', '#ffe838', '#58f058', '#38d8ff', '#4868ff', '#c058ff'];
const RAYS = 22;
const sector = (a) => { const w = a + 0.3 * Math.sin(3 * a + 1) + 0.16 * Math.sin(7 * a + 2), t = ((w / (Math.PI * 2) + 3) % 1) * RAYS; return { i: Math.floor(t) % RAYS, u: t - Math.floor(t) }; };
const colorOf = (i) => SEVEN[Math.floor(hash(i % RAYS, 5) * 7 + (i % 2) * 3) % 7];
const strengthOf = (i) => 0.2 + 0.8 * hash(i % RAYS, 9);
function rayColor(a) { const { i, u } = sector(a); return mix(colorOf(i), colorOf(i + 1), smooth(0.38, 0.62, u)); }
const angleFrom = (x, y) => Math.atan2(y - SRC.y, x - SRC.x);
const dist = (x, y) => Math.hypot(x - SRC.x, y - SRC.y);
// How strong the light is at a place: it is strong near the creature and weak far off, and it comes in rays, with dark between them.
const beam = (x, y) => { const { i, u } = sector(angleFrom(x, y)), k = smooth(0.38, 0.62, u); return strengthOf(i) * (1 - k) + strengthOf(i + 1) * k; };
const reach = (x, y, far = 520) => Math.exp(-Math.pow(dist(x, y) / far, 2));
// The dark of the forest: nearly black, a little blue-green where the mist is.
const dark = (x, y) => mix(mix('#030705', '#0c1814', nA(x / 300, y / 300)), '#16282c', smooth(760, 300, y) * 0.3 + smooth(0.5, 0.8, nB(x / 200, y / 60)) * 0.2);
// A place in the light: the dark of the forest, with the color of its ray on it.
const lit = (x, y, k = 1) => mix(mix(dark(x, y), rayColor(angleFrom(x, y)), clamp(reach(x, y) * beam(x, y) * k, 0, 0.9)), '#f4ffff', clamp(reach(x, y, 150) * k, 0, 0.9));   // near the creature the light is white

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, SRC, GROUND, nA, nB, nC, hash, SEVEN, RAYS, sector, colorOf, strengthOf, rayColor, angleFrom, dist, beam, reach, dark, lit };
