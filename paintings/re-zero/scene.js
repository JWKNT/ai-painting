// Shared layout, palette and brush habits for the Re:Zero painting.
//
// The scene: the night of the White Whale. For four hundred years the Witchbeast of the Mist
// has swum in the sky over the Lifaus plain and eaten those who use the road. Tonight an army
// waits for it under Flugel's Tree, the great tree that stands alone in the plain and goes
// up past the clouds. Then the mist comes, and the whale comes out of it: as long as fifty
// men, white, with a horn on its brow, long fins tipped with red, and a wheel of rose light
// over its back. The riders of the army, on their ground dragons, are small lights under it.
//
// The moon is high at the right, behind thin cloud. Its light is on the back of the whale,
// on the right side of the tree and on the tops of the mist. Everything else is the blue
// of night, and the lamps of the army are the only warm things.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const HORIZON = 716;                       // the far edge of the plain
const MOON = { x: 1296, y: 150, r: 38 };
const MOONWARD = [0.55, -0.83];            // toward the moon
const TREE = { x: 300, foot: 742 };        // the middle of the trunk, and the ground at its foot
const WHALE = { x: 632, y: 436, len: 800, turn: -0.11 };   // its snout, its length, and how its body lies: its tail is to the right and a little up

const nA = noise2(1301), nB = noise2(1319), nC = noise2(1327);

// How strongly the light of the moon reaches a place in the sky.
const halo = (x, y, reach = 420) => Math.exp(-Math.pow(Math.hypot(x - MOON.x, y - MOON.y) / reach, 2));
// The night sky: nearly black overhead at the left, a deep blue toward the moon, and paler low down where the mist is.
const skyRamp = grad([[0, '#070b20'], [0.35, '#0e1838'], [0.7, '#1c2c5a'], [1, '#34487c']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / HORIZON + (nA(x / 380, y / 200) - 0.5) * 0.08, 0, 1));
  c = mix(c, '#4c68a8', 0.6 * halo(x, y, 520));
  return mix(c, '#c8d8fc', 0.7 * halo(x, y, 150));
}
// What the mist does to a thing at a distance: d is 0 close to us and 1 very far off.
const far = (color, x, y, d) => mix(color, mix('#2c3e6c', skyColor(x, Math.min(y, HORIZON - 10)), 0.5), clamp(d, 0, 1) * 0.85);

// The plain: grass in the dark, a little lighter far off, where the mist lies on it.
function ground(x, y) {
  const d = clamp((y - HORIZON) / (H - HORIZON), 0, 1);
  return mix(mix('#2c4264', '#12222c', smooth(0, 0.5, d)), '#070e14', smooth(0.4, 1, d) * 0.8);
}

// A place on the whale: u along it from its snout (0) to the root of its tail (1), and v up from the middle line of it, both as parts of its length.
const onWhale = (u, v) => { const c = Math.cos(WHALE.turn), s = Math.sin(WHALE.turn), a = u * WHALE.len, b = -v * WHALE.len; return [WHALE.x + a * c - b * s, WHALE.y + a * s + b * c]; };

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, MOON, MOONWARD, TREE, WHALE, nA, nB, nC, halo, skyColor, far, ground, onWhale };
