// Shared layout, palette and brush habits for the Zelda painting.
//
// The place: Korok Forest, in the Great Hyrule Forest, from Breath of the Wild. In a glade
// at the foot of the Great Deku Tree stands a low platform of three stone steps, and in the
// stone at its middle the Master Sword, point down, waiting. The Deku Tree fills the back
// of the glade: a trunk as wide as a house, roots like hills, blossom in its crown. The
// forest is deep and green, and the light comes down through it in shafts from the upper
// left. One shaft falls on the sword.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, clamp, smooth } = studio;

const W = 1600, H = 1000;
const SUNWARD = [-0.42, -0.9];             // toward the light: up and to the left
const SLANT = 0.42;                        // how far a shaft moves to the right as it comes down
const SWORD = { x: 800, top: 480, foot: 706 };   // from the pommel to where the blade goes into the stone
const GROUND = 690;                        // the far edge of the floor of the glade, at the foot of the tree

const nA = noise2(401), nB = noise2(419), nC = noise2(433);

// The shafts: where each would meet the top of the picture, its width, its strength.
const SHAFTS = [[531, 74, 1], [150, 40, 0.5], [336, 30, 0.4], [770, 34, 0.42], [1010, 50, 0.55], [1250, 30, 0.35]];
function shaft(x, y) {
  let s = 0;
  for (const [x0, w, k] of SHAFTS) s += k * Math.exp(-Math.pow((x - (x0 + y * SLANT)) / w, 2));
  return clamp(s, 0, 1);
}
// The air of the forest: a pale green mist, bright in the middle of the glade, dark toward
// the edges and under the leaves overhead.
function mist(x, y) {
  const d = Math.hypot((x - 800) / 800, (y - 430) / 560);
  let c = mix(mix('#d6eac6', '#86b48e', smooth(0, 0.7, d)), '#2c5a44', smooth(0.5, 1.25, d));
  c = mix(c, '#16382c', smooth(260, -40, y) * 0.75);
  return mix(c, '#f2f2b8', shaft(x, y) * 0.45);
}
// What the mist does to a thing at a distance: d is 0 close to us and 1 far off in the forest.
const far = (color, x, y, d) => mix(color, mist(x, y), clamp(d, 0, 1) * 0.8);
// A thing that stands in a shaft takes its light.
const sun = (color, x, y, k = 1) => mix(color, '#f4f0a4', clamp(shaft(x, y) * k, 0, 1));

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, SUNWARD, SLANT, SWORD, GROUND, nA, nB, nC, SHAFTS, shaft, mist, far, sun };
