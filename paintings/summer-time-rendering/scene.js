// Shared layout, palette and brush habits for the Summer Time Rendering painting.
//
// The scene: a shadow on the beach at noon. On the island of Hitogashima a "shadow" is a
// thing that makes itself a copy of a person and then kills the person. The master of the
// shadows of this island is Shide: a thing in black armour, as tall as two men and as
// thin as a tree in winter, with four arms. He stands on the white sand in the full light
// of a summer day, and the shadow that lies under him is not his own: it runs out over
// the sand like ink, black hands come up out of it, and small black squares break off it
// and rise. Ushio stands against him. She is a shadow too, the copy of a girl who
// drowned, and she is on our side: fair hair, the dark blue swimsuit of her school, and
// the hair is her weapon. It goes up from her head and is made hard, like a great blade.
//
// The light is the sun of July, high and a little behind us at the left. Everything is
// bright: a deep blue sky with one white cloud as high as a mountain, a green and blue
// sea, sand that is nearly white. Only the shadows are black. So the picture is the day
// with a hole in it.
'use strict';
const studio = require('../../lib/studio');
const { noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const HORIZON = 548;
const SUNWARD = [-0.5, -0.86];
const SHORE = 668;                                      // where the water ends on the sand, in the middle of the picture
const SHIDE = { x: 1136, feet: 866, U: 176 };           // where he stands; the picture's units to the metre there
const USHIO = { x: 404, feet: 952, U: 208 };

const nA = noise2(6601), nB = noise2(6607), nC = noise2(6619), nD = noise2(6623);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// The sky: a deep blue overhead, paler and a little green toward the sea.
const blue = grad([[0, '#124ea8'], [0.35, '#2473cf'], [0.7, '#59a8e6'], [0.92, '#9fd3f0'], [1, '#c4e6f4']]);
const skyColor = (x, y) => blue(clamp(y / HORIZON + (nA(x / 520, y / 260) - 0.5) * 0.04, 0, 1));
// The edge of the water on the sand: a line that runs up and back in long shallow tongues.
const edge = (x) => SHORE + 16 * Math.sin(x / 230 + 0.6) + 8 * Math.sin(x / 87) + 4 * (nC(x / 40, 4) - 0.5) - (x - 800) * 0.02;
// The pool of shadow under Shide: how deep in it a place of the sand is (above 0 inside it). It has long tongues that go toward Ushio.
function pool(x, y) {
  const cx = SHIDE.x - 40, cy = SHIDE.feet + 6, dx = x - cx, dy = (y - cy) * 3.1, a = Math.atan2(dy, dx), d = Math.hypot(dx, dy);
  const reach = 250 + 90 * Math.sin(a * 5 + 1) + 60 * Math.sin(a * 11 + 2) + 520 * Math.pow(Math.max(0, Math.cos(a - 2.92)), 7) + 70 * (nB(a * 3, 5) - 0.5);
  return 1 - d / reach;
}
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

module.exports = { studio, open, W, H, HORIZON, SUNWARD, SHORE, SHIDE, USHIO, nA, nB, nC, nD, hash, skyColor, edge, pool, heap, smooth };
