// Shared layout, palette and brush habits for the Steins;Gate painting.
//
// The scene: the thing in the roof. On a hot day in July a round machine, which the news
// calls a satellite, is found driven into the top of the Radio Kaikan building in Akihabara.
// No one saw it fall. It is a time machine. We stand in the street and look up: the upper
// storeys of the building, with a long band of bright painted boards under the roof, a tall
// yellow sign, and rows of windows; the machine in the edge of the roof, a great drum in
// steps with a small dome on top and two panels that stand out from it at an angle; the
// cracks that go out from it across the front of the building; and the big sky of summer,
// pale and a little bleached, as everything is in this story. No one is in the picture.
//
// The sun is high at the right. So the right side of each round thing is light and its
// left side is in shade, and the front of the building, which is turned a little from the
// sun, is a pale warm grey.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, rng } = studio;

const W = 1600, H = 1000;
const ROOF = 300;                           // the top edge of the front of the building
const FRONT = { x0: -20, x1: 900 };         // its front, which faces us
const SIDE = { x1: 986, vx: 1050, vy: 1180 };        // its side wall goes away from us to here; the lines of that wall run to the point (vx, vy), far below, because we look up
const BOARDS = { y0: 316, y1: 444 };        // the band of painted boards under the roof
const SAT = { x: 648, y: 330, tilt: 0.2 };  // the middle of the foot of the machine, and how it leans
const SUNWARD = [0.72, -0.69];

const nA = noise2(7101), nB = noise2(7109), nC = noise2(7121);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// A place on the machine: u across it, v up it from its foot, both in units of the picture.
const S = (u, v) => [SAT.x + u * Math.cos(SAT.tilt) + v * Math.sin(SAT.tilt), SAT.y + u * Math.sin(SAT.tilt) - v * Math.cos(SAT.tilt)];
// The sky: a blue that is not deep, paler and greener low down, nearly white toward the sun.
const skyRamp = grad([[0, '#5c9cc8'], [0.35, '#7cb8d8'], [0.7, '#a8d4e0'], [1, '#d4ecec']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / H + (nA(x / 420, y / 260) - 0.5) * 0.08, 0, 1));
  return mix(c, '#f6fbf8', 0.75 * Math.exp(-Math.pow(Math.hypot(x - 1640, y + 60) / 620, 2)));
}
// The heaped clouds: each is a heap of round tops on a level floor.
function heap(seed, x0, x1, floor, big, tall) {
  const r = rng(seed), puffs = [];
  for (let x = x0; x < x1; x += big * 0.45) {
    const hump = Math.pow(Math.sin(Math.PI * clamp((x - x0) / (x1 - x0), 0.03, 0.97)), 0.8), rad = big * r.range(0.5, 1) * (0.4 + 0.75 * hump);
    puffs.push([x + r.range(-12, 12), floor - rad * 0.7 - big * tall * hump * r.range(0.15, 1), rad]);
    puffs.push([x + r.range(-20, 20), floor - rad * 0.6 - big * tall * hump * r.range(0, 0.5), rad * r.range(0.8, 1.1)]);
  }
  return puffs.filter((q) => q[2] > 10);
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, ROOF, FRONT, SIDE, BOARDS, SAT, SUNWARD, nA, nB, nC, hash, S, skyColor, heap };
