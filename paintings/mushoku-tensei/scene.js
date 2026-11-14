// Shared layout, palette and brush habits for the Mushoku Tensei painting.
//
// The scene: the Displacement. On one afternoon the sky over the Fittoa region of the
// Asura Kingdom goes dark, a small red orb with a ring round it stands in the air, and a
// great column of blue-white light comes down on the citadel of Roa. Then the light grows
// and takes the whole region, and every person in it is thrown to some far part of the
// world. We look from the hill outside the town, over the wheat fields: the heavy cloud
// that turns about the column, the column itself and the light at its foot, where the
// walls and towers of Roa are being lost in it, the red orb, and the fields, dark, with
// the cold light on them. Near us, on the hill, is the tree, and the staff that Rudeus
// was given on that day: a long staff of twisted wood with a great blue stone in its head.
// No one is in the picture.
//
// The column is the light. Everything is against it: dark, with a cold edge toward it.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const HORIZON = 604;
const COL = { x: 770, half: 104, top: 236 };       // the column: its middle line, half its width at its foot, and where it goes into the cloud
const ORB = { x: 1176, y: 176 };                   // the red orb
const STAFF = { foot: [1372, 992], head: [1238, 628] };

const nA = noise2(8101), nB = noise2(8111), nC = noise2(8123);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// How much of the light of the column reaches a place.
const lit = (x, y, reach = 420) => Math.exp(-Math.pow(Math.hypot((x - COL.x) * 0.9, (y - 520) * 0.7) / reach, 2));
// The sky behind the clouds: nearly black above, a dull violet grey low down, and blue-white near the column.
const skyRamp = grad([[0, '#0c0b16'], [0.4, '#1c1b2c'], [0.75, '#34334c'], [1, '#56546c']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / HORIZON + (nA(x / 400, y / 240) - 0.5) * 0.1, 0, 1));
  c = mix(c, '#5c8cc0', 0.5 * Math.exp(-Math.pow((x - COL.x) / 330, 2)) * smooth(60, 520, y));
  return mix(c, '#3c1420', 0.5 * Math.exp(-Math.pow(Math.hypot(x - ORB.x, y - ORB.y) / 170, 2)));   // the red of the orb, in the air round it
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, COL, ORB, STAFF, nA, nB, nC, hash, lit, skyColor };
