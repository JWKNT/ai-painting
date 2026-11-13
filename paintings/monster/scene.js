// Shared layout, palette and brush habits for the Monster painting.
//
// The scene: Ruhenheim, a small town in the mountains of Bavaria, in the rain that will not
// stop. The street is empty. Johan stands in the middle of it, far off, and lifts one hand
// and puts a finger to his own forehead: here. Close to us, with his back to us, Dr. Tenma
// holds a pistol in both hands and aims it at him.
//
// It is day, but there is no sun. The light comes from a pale break in the cloud beyond the
// end of the street, and the wet road gives it back. Everything else is grey.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp } = studio;

const W = 1600, H = 1000;
const VP = { x: 860, y: 470 };              // the street runs to this point; it is also the height of every man's eyes
const BREAK = { x: 880, y: 385 };           // the pale place in the cloud
const JOHAN = { x: 862, y: 642, h: 184 };   // his feet, and his height
const TENMA = { x: 392, y: 1052, h: 632 };  // his feet are below the picture

const nA = noise2(211), nB = noise2(223), nC = noise2(239);

// How strongly the light of the break reaches a place in the sky.
const glow = (x, y) => Math.exp(-Math.pow((x - BREAK.x) / 270, 2) - Math.pow((y - BREAK.y) / 150, 2));
const skyRamp = grad([[0, '#2c343a'], [0.5, '#525e66'], [0.85, '#8a9698'], [1, '#a6b0ae']]);
function skyColor(x, y) {
  const c = skyRamp(clamp(y / 500 + (nA(x / 300, y / 160) - 0.5) * 0.16, 0, 1));
  return mix(c, '#e6eadf', clamp(glow(x, y) * 0.92, 0, 1));
}

// The two rows of houses. Each row is a wall that runs away from us to the vanishing point.
// A place on it is given by t, how far along the street (0 close to us, 1 at its end), and
// v, how far up the wall (0 at the road, 1 at the eaves; above 1 is roof).
// The street is wide, a market street, and the houses have two floors under steep roofs. A
// man is 1.09 times as tall as his feet are below the eye line, and the eaves are six metres
// up, so the lines of the eaves run 3.64 times as steeply as the lines of the road.
const LEFT = { sign: -1, x: (t) => VP.x - 920 / (1 + 3.18 * t), base: (x) => VP.y + 0.22 * (VP.x - x), eave: (x) => VP.y - 0.8 * (VP.x - x), top: (x) => VP.y - 1.15 * (VP.x - x) };
const RIGHT = { sign: 1, x: (t) => VP.x + 800 / (1 + 2.48 * t), base: (x) => VP.y + 0.26 * (x - VP.x), eave: (x) => VP.y - 0.946 * (x - VP.x), top: (x) => VP.y - 1.36 * (x - VP.x) };
function at(S, t, v, tall = 1) {
  const x = S.x(t), b = S.base(x), e = b + (S.eave(x) - b) * tall;
  return [x, v <= 1 ? b + (e - b) * v : e + (S.top(x) - S.eave(x)) * tall * (v - 1)];
}
// The air between: the farther off a thing is, the paler and greyer the rain makes it.
const veil = (color, t) => mix(color, '#8f9b9b', clamp(t, 0, 1) * 0.62);

// The road between the two rows.
const roadLeft = (y) => VP.x - (y - VP.y) / 0.22, roadRight = (y) => VP.x + (y - VP.y) / 0.26;
// The wet road gives back the break in the cloud as a long pale shape coming toward us.
function shine(x, y) {
  const d = (y - 500) / 500, mid = 862 + d * 26, half = 22 + d * 215;
  return clamp(1 - Math.abs(x - mid) / half, 0, 1) * (0.96 - 0.42 * d);
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, VP, BREAK, JOHAN, TENMA, nA, nB, nC, glow, skyColor, LEFT, RIGHT, at, veil, roadLeft, roadRight, shine };
