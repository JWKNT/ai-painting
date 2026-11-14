// Shared layout, palette and brush habits for the Summer Time Rendering painting.
//
// The scene: the goodbye on the beach. Hitogashima is a small island in the sea off
// Wakayama. At the end of the story the long summer day that was lived again and again is
// over, and Ushio, who has been at Shinpei's side through all of it, cannot stay. The sun
// goes down into the sea. She stands at the edge of the water with her back to us, her
// long fair hair in the wind, and she is going: the side of her that is toward the sun
// comes apart into small pieces of light, which the wind takes up and away. Shinpei
// stands a few steps behind her and does not hold her back. At the left is the hill of
// the island with its two tops, and the sea wall with its heap of concrete blocks.
//
// The light is the sun, low over the sea in front of us and a little to the right. So all
// that we see is against the light: the two of them, the hill and the blocks are dark,
// each with a line of gold along its edge, and their long shades come toward us over the
// wet sand. The sky is gold low down, rose in its clouds and violet overhead; the sea has
// the same colors, and a broad path of the sun's light lies on it from the edge of the
// world to her feet.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const HORIZON = 470;
const cam = studio.camera({ hz: HORIZON, vx: 800, f: 1000, eye: 1.6 });
const SUN = { x: 1016, y: 458 };
const SUNWARD = [0.3, 0.95];                            // toward the sun, for a cloud high in the air: the light comes from below
const SHINPEI = { X: -1.62, Z: 5.5 };
const USHIO = { X: 1.2, Z: 7.2 };
const WATERLINE = 668;                                  // where the thin water ends on the sand, in the picture, at her feet

const nA = noise2(6601), nB = noise2(6607), nC = noise2(6619), nD = noise2(6623);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
const glare = (x, y, reach) => Math.exp(-Math.pow(Math.hypot(x - SUN.x, (y - SUN.y) * 1.2) / reach, 2));
// The sky: violet-blue overhead, rose, then gold at the edge of the world, and nearly white round the sun.
const dusk = grad([[0, '#2c2f66'], [0.24, '#4d4682'], [0.46, '#8e5a8e'], [0.66, '#d6787c'], [0.82, '#f6a45c'], [0.94, '#ffd070'], [1, '#ffe08c']]);
function skyColor(x, y) {
  const c = dusk(clamp(y / HORIZON + (nA(x / 520, y / 240) - 0.5) * 0.05, 0, 1));
  return mix(mix(c, '#ffc864', glare(x, y, 520) * 0.6), '#fff6d0', glare(x, y, 170) * 0.9);
}
// A far thing takes the color of the sky behind it: d is 0 near us and 1 very far off.
const far = (color, x, y, d) => mix(color, skyColor(x, Math.min(y, HORIZON - 4)), clamp(d, 0, 1) * 0.85);
// The top line of the hill of the island, at the left: two tops, and a long fall to the sea.
const hillTop = (x) => HORIZON - 4 - 156 * Math.exp(-Math.pow((x - 130) / 120, 2)) - 112 * Math.exp(-Math.pow((x - 400) / 92, 2)) - 30 * Math.exp(-Math.pow((x - 268) / 60, 2)) - 24 * Math.exp(-Math.pow((x - 560) / 70, 2)) + 7 * (nC(x / 22, 2) - 0.5);
// The heaped clouds: each is a heap of round tops on a level floor.
function heap(seed, x0, x1, floor, big, tall) {
  const r = studio.rng(seed), puffs = [];
  for (let x = x0; x < x1; x += big * 0.45) {
    const hump = Math.pow(Math.sin(Math.PI * clamp((x - x0) / (x1 - x0), 0.03, 0.97)), 0.8), rad = big * r.range(0.5, 1) * (0.4 + 0.75 * hump);
    puffs.push([x + r.range(-12, 12), floor - rad * 0.7 - big * tall * hump * r.range(0.15, 1), rad]);
    puffs.push([x + r.range(-20, 20), floor - rad * 0.6 - big * tall * hump * r.range(0, 0.5), rad * r.range(0.8, 1.1)]);
  }
  return puffs.filter((q) => q[2] > 10);
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, cam, SUN, SUNWARD, SHINPEI, USHIO, WATERLINE, nA, nB, nC, nD, hash, glare, skyColor, far, hillTop, heap, smooth };
