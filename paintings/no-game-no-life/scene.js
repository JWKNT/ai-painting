// Shared layout, palette and brush habits for the No Game No Life painting.
//
// The scene: the fall into Disboard. Sora and Shiro, a brother and a sister who have never
// lost a game, answer a message, and the god of another world pulls them through their
// screen. They come out high in the sky of his world and fall. What they fall past is
// this: a sea of cloud, and out of it, as high as the sky, the pieces of a game of chess.
// The king is the tallest, and the god sits on it. To win every game in this world, and
// then to take that piece, is to win all. Islands of rock float among the pieces, with
// water that falls from them into the cloud. A red moon stands behind the queen, and a
// dragon turns in the air below us. The two of them are small, hand in hand, in the air.
//
// The colors of this story are not those of our world. The sky goes from a clear blue
// to pink; the light is warm and a little rose; and every shade is violet or blue-green.
// The sun is high at the left: each piece is nearly white on its left side and violet on
// its right, and the clouds are white on top and pink and blue under.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const SEA = 760;                                        // where the top of the sea of cloud is, in the picture
const SUNWARD = [-0.62, -0.78];
const MOON = { x: 1236, y: 300, r: 196 };
const nA = noise2(7701), nB = noise2(7709), nC = noise2(7717), nD = noise2(7727);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// The sky: a clear blue at the upper left, violet at the upper right, pink low down, and nearly white where the sun is.
const up = grad([[0, '#2a8fe0'], [0.3, '#49b4ec'], [0.56, '#8cd2f0'], [0.76, '#e0c8f0'], [0.9, '#ffc0dc'], [1, '#ffd8e6']]);
function skyColor(x, y) {
  let c = up(clamp(y / SEA + (nA(x / 520, y / 260) - 0.5) * 0.05, 0, 1));
  c = mix(c, '#a486e4', smooth(700, 1600, x) * smooth(520, 0, y) * 0.5);
  return mix(c, '#fff6f0', 0.55 * Math.exp(-Math.pow(Math.hypot(x + 80, y + 80) / 620, 2)));
}
// The rose air between us and a far thing: d is 0 near us and 1 very far off.
const far = (color, x, y, d) => mix(color, mix(skyColor(x, Math.min(y, SEA - 4)), '#ffc8e2', 0.4), clamp(d, 0, 1) * 0.9);
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

module.exports = { studio, open, W, H, SEA, SUNWARD, MOON, nA, nB, nC, nD, hash, skyColor, far, heap, smooth };
