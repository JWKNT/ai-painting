// Shared layout, palette and brush habits for the Made in Abyss painting.
//
// The scene: the sixth layer of the Abyss, the Capital of the Unreturned. Riko, Reg and
// Nanachi have come down the last of the way and stand on a broken terrace, looking out.
// No one who comes this deep goes back up. Before them, in a hollow as wide as a country,
// are the ruins of the golden city: towers, a bridge of high arches over still water, and
// beyond it the great pale mound that is the village of the hollows. The light of the Abyss
// comes down from far above in long shafts, gold through the haze. What it does not reach
// is green and dark.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, through, clamp, smooth } = studio;

const W = 1600, H = 1000;
const SRC = { x: 720, y: -160 };          // where the light comes from, far above the picture
const LIGHT = { at: [760, 40] };          // the same, for the forms it falls on
const WATER = 704;                        // the far shore of the still water
const MOUND = { x: 1096, y: 600 };        // the village
const NANACHI = { x: 300, y: 850, h: 132 }, RIKO = { x: 376, y: 852, h: 124 }, REG = { x: 452, y: 858, h: 138 };

const nA = noise2(311), nB = noise2(331), nC = noise2(347);

// The shafts: each has a slant from straight down, a width, and a strength.
const SHAFTS = [[-0.42, 0.05, 0.6], [-0.2, 0.07, 1], [0.02, 0.05, 0.7], [0.2, 0.08, 1], [0.42, 0.05, 0.55], [0.6, 0.04, 0.4]];
function shaft(x, y) {
  const a = Math.atan2(x - SRC.x, y - SRC.y);
  let s = 0;
  for (const [c, w, k] of SHAFTS) s += k * Math.exp(-Math.pow((a - c) / w, 2));
  return clamp(s, 0, 1) * smooth(1300, 300, Math.hypot(x - SRC.x, y - SRC.y));
}
// The haze that fills the hollow: pale gold overhead, green lower down, dark at the bottom.
const hazeRamp = grad([[0, '#e8e0a6'], [0.22, '#b4c89c'], [0.45, '#629a8c'], [0.7, '#2c6062'], [1, '#12363e']]);
function haze(x, y) {
  let c = hazeRamp(clamp(y / 760 + (nA(x / 380, y / 220) - 0.5) * 0.1, 0, 1));
  c = mix(c, '#f6ecb4', 0.7 * Math.exp(-Math.pow(Math.hypot(x - 760, (y - 60) * 1.4) / 300, 2)));
  return mix(c, '#f0dc94', shaft(x, y) * 0.4);
}
// What the haze does to a thing at a distance: d is 0 close to us and 1 at the far wall.
const far = (color, x, y, d) => mix(color, haze(x, y), clamp(d, 0, 1) * 0.82);
// The gold the light puts on a face that is turned to it.
const gild = (color, x, y, k = 1) => mix(color, '#f6dc8c', clamp((0.3 + 0.7 * shaft(x, y)) * k, 0, 1));
// Which side of a thing the light is on: 1 if it is lit from the left, -1 from the right.
const lightSide = (x) => (x > SRC.x ? -1 : 1);

// The broken terrace close to us.
const ledgeLine = through([[0, 812], [240, 822], [520, 846], [760, 884], [1000, 930], [1300, 950], [1600, 938]]);
const ledge = (x) => ledgeLine(x) + 7 * (nB(x / 30, 51) - 0.5);

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, SRC, LIGHT, WATER, MOUND, NANACHI, RIKO, REG, nA, nB, nC, shaft, haze, far, gild, lightSide, ledge };
