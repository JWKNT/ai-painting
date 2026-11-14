// Shared layout, palette and brush habits for the Tsukihime painting.
//
// The scene: the Millennium Castle. In Tsukihime the castle of the princess of the True
// Ancestors is not a building that men made: she makes it real by her will, and on one
// night it stands in the middle of the city. It is like blue glass with a light inside it:
// a tower of round storeys, each smaller than the one under it, to a thin spire; a wide
// skirt of roofs half way up; long bridges that hang out from it over the town. Behind it
// is the moon of the title, huge and blue. Under it are the small lit blocks of the city,
// and a white mist where the castle meets them. No one is in the picture.
//
// The castle gives its own light. It is white where it comes out of the mist, and deep blue
// at its top, where the moon shows through it.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const CX = 800;                             // the middle line of the castle
const MOON = { x: 812, y: 338, r: 318 };
const TOP = 34, FOOT = 830;                 // the tip of its spire, and where the mist hides its foot
// The storeys of the tower, from the top down: each is a round drum, so wide, from one height to another.
const TIERS = [
  { w: 124, y0: 196, y1: 292 },
  { w: 204, y0: 280, y1: 400 },
  { w: 300, y0: 388, y1: 566 },
  { w: 452, y0: 590, y1: 730 },
  { w: 640, y0: 716, y1: 930 },
];

const nA = noise2(6101), nB = noise2(6113), nC = noise2(6131);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
const moonGlow = (x, y, reach) => Math.exp(-Math.pow((Math.hypot(x - MOON.x, y - MOON.y) - MOON.r) / reach, 2));
// The sky: nearly black at the top, deep blue, and a paler blue low down, where the light of the castle and of the town is in the air.
const skyRamp = grad([[0, '#03041a'], [0.3, '#070c3c'], [0.62, '#101c6c'], [0.84, '#2440a4'], [1, '#5c8ce0']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / FOOT + (nA(x / 400, y / 240) - 0.5) * 0.06, 0, 1));
  const d = Math.hypot(x - MOON.x, y - MOON.y);
  if (d > MOON.r) c = mix(c, '#3c64d0', 0.55 * moonGlow(x, y, 150));
  return c;
}
// The light of the castle at a height: 0 at its top, 1 at its foot.
const depth = (y) => clamp((y - TOP) / (FOOT - TOP), 0, 1);
const glass = grad([[0, '#0c1c6c'], [0.3, '#1c3ca4'], [0.55, '#3c74d8'], [0.78, '#8cc0f8'], [0.92, '#d8eeff'], [1, '#ffffff']]);

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, CX, MOON, TOP, FOOT, TIERS, nA, nB, nC, hash, moonGlow, skyColor, depth, glass };
