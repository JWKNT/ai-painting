// Shared layout, palette and brush habits for the No Game No Life painting.
//
// The scene: Disboard, on the day that Sora and Shiro come to it. They are a brother and
// a sister from our world, who have never lost a game. A god who is a boy has called them
// to his world, where every quarrel is settled by a game. They stand at the edge of a
// cliff, hand in hand, with their backs to us, and the whole of that world lies before
// them: plains and woods and a river, a small walled city, mountains, islands that float
// in the air with water falling from them, and, at the edge of the world, the pieces of a
// game of chess, each as high as the sky. To take the last of those is to challenge the
// god himself.
//
// The colors of this story are not those of our world: the far air is rose, the shades
// are violet, the sky is a blue-green that goes to pink at the edge of the world. The sun
// is high at the left, so each thing is light on its left and its top and violet on its
// right.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth, through } = studio;

const W = 1600, H = 1000;
const HORIZON = 590;
const SUNWARD = [-0.62, -0.78];
const nA = noise2(7701), nB = noise2(7709), nC = noise2(7717), nD = noise2(7727);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// The sky: a deep clear blue overhead, blue-green, then pale rose at the edge of the world.
const air = grad([[0, '#2f78d8'], [0.3, '#4fa4e8'], [0.56, '#86cdea'], [0.76, '#d8c4ee'], [0.9, '#ffc4e0'], [1, '#ffdcec']]);
function skyColor(x, y) {
  const c = air(clamp(y / HORIZON + (nA(x / 520, y / 260) - 0.5) * 0.05, 0, 1));
  return mix(c, '#fff4f0', 0.5 * Math.exp(-Math.pow(Math.hypot(x + 60, y + 80) / 600, 2)));
}
// The rose air between us and a far thing: d is 0 near us and 1 very far off.
const far = (color, x, y, d) => mix(color, mix(skyColor(x, Math.min(y, HORIZON - 4)), '#ffc8e4', 0.3), clamp(d, 0, 1) * 0.9);
// The edge of the cliff that they stand on: it comes in from the right and from the foot of the picture.
const cliffTop = through([[560, 1010], [660, 940], [780, 884], [900, 846], [1040, 818], [1200, 800], [1380, 792], [1620, 780]]);
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

module.exports = { studio, open, W, H, HORIZON, SUNWARD, nA, nB, nC, nD, hash, skyColor, far, cliffTop, heap, smooth };
