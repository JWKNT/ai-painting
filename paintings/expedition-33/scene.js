// Shared layout, palette and brush habits for the Expedition 33 painting.
//
// The scene: the Paintress paints the number. In Clair Obscur: Expedition 33 a tower of
// dark stone, the Monolith, stands far out at sea, and a woman as big as a hill sits at
// its foot under her long white hair. Each year she wakes and paints a number on the
// stone, one less than the last, and every person of that age in the city of Lumiere
// goes to petals and smoke. This year she paints 33. We see her with her arm raised to
// the last stroke, the number bright and wet, and the great ring of gold light that
// stands round it. Lumiere is a piece of Paris that was broken from the world: its tower
// of iron is bent, and blocks of its houses hang in the air. From it the petals of this
// year's dead go up and away over the water.
//
// The light is the number and its ring: gold, from high in the middle. So the Paintress
// is gold on her head and her raised arm and blue-grey below; the Monolith is dark with a
// pale edge; the sea has a path of gold; and the sides of the tower and of the houses
// that are turned to the number have a thin line of it. The windows and lamps of the
// city are a warmer, smaller light.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const HORIZON = 640;
const NUM = { x: 884, y: 236, h: 132 };                 // the number: its middle, and its height
const RING = 326;                                       // the ring of light round it
const NEAR = 870;                                       // the sea is seen down to here; the roofs of the city are in front of the rest

const nA = noise2(8801), nB = noise2(8807), nC = noise2(8819), nD = noise2(8821);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// How much of the light of the number is in the air at a place.
const gold = (x, y, reach = 300) => Math.exp(-Math.pow(Math.hypot((x - NUM.x) * 0.9, y - NUM.y - 30) / reach, 2));
// The sky: dark blue-green cloud, a little lighter low down, and a pale gold where the number lights it.
const dusk = grad([[0, '#081219'], [0.3, '#0f2731'], [0.6, '#1a3f48'], [0.85, '#31595c'], [1, '#4c6f70']]);
function skyColor(x, y) {
  let c = dusk(clamp(y / HORIZON + (nA(x / 420, y / 220) - 0.5) * 0.16, 0, 1));
  c = mix(c, '#b09a62', gold(x, y, 400) * 0.6);
  return mix(c, '#ecd69c', gold(x, y, 190) * 0.5);
}
const far = (color, x, y, d) => mix(color, skyColor(x, Math.min(y, HORIZON - 4)), clamp(d, 0, 1) * 0.85);
// The Monolith: its middle line and half its width at a height. It leans a little, it is wider at its foot, and its sides are broken.
const monoMid = (y) => 894 + (236 - y) * 0.03;
const monoHalf = (y) => (116 + 0.12 * y + 150 * Math.pow(clamp((y - 470) / 170, 0, 1), 2)) * (1 + 0.1 * (nC(1.7, y / 46) - 0.5)) + 5 * (nB(2.2, y / 13) - 0.5);
const inMono = (x, y) => y < HORIZON + 6 && Math.abs(x - monoMid(y)) < monoHalf(y);

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, NUM, RING, NEAR, nA, nB, nC, nD, hash, gold, skyColor, far, monoMid, monoHalf, inMono, smooth };
