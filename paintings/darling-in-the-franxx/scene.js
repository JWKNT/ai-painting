// Shared layout, palette and brush habits for the Darling in the Franxx painting.
//
// The scene: the charge. The land is a waste of brown rock under a pale sky that is full
// of dust. People live in great domed cities that move, the Plantations, and take the
// fire out of the earth; and out of the earth come the klaxosaurs, which are black, with
// marks on them that shine blue. Here one of the great ones has come up: a thing like a
// hill that walks, made of black slabs, with a blue light in its chest. The Plantation is
// far off at the left, under its dome. And Strelizia goes at the klaxosaur through the
// air: a small white and red machine with a long lance, and a line of red fire behind it.
// No one is in the picture: only the machines, the beast and the land.
//
// The sun is behind the dust, high at the left. So each slab of the klaxosaur has its
// lighter face to the left and its top, and the dust at its feet is bright.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const HORIZON = 652;
const SUN = { x: 250, y: 70 };
const DOME = { x: 236, y: 640, rx: 212, ry: 150 };     // the Plantation: the middle of the foot of its dome
const CORE = { x: 1090, y: 372 };                      // the blue light in the chest of the klaxosaur
const STREL = { x: 388, y: 232, a: 0.2 };              // Strelizia, and the way that it goes
const DEPTH = [-64, -34];                              // a slab of the klaxosaur goes back this way: up and to the left

const nA = noise2(1201), nB = noise2(1213), nC = noise2(1223);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// The sky: pale, a grey that is a little warm, whiter toward the sun, and yellow-brown with dust low down.
const skyRamp = grad([[0, '#8c9cac'], [0.35, '#b4bcc0'], [0.7, '#d4d0c0'], [1, '#e4d0a8']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / HORIZON + (nA(x / 420, y / 240) - 0.5) * 0.08, 0, 1));
  return mix(c, '#fbf8ec', 0.7 * Math.exp(-Math.pow(Math.hypot(x - SUN.x, y - SUN.y) / 480, 2)));
}
// What the dust does to a thing at a distance: d is 0 close to us and 1 very far off.
const dust = (color, x, y, d) => mix(color, skyColor(x, Math.min(y, HORIZON - 4)), clamp(d, 0, 1) * 0.86);

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, SUN, DOME, CORE, STREL, DEPTH, nA, nB, nC, hash, skyColor, dust };
