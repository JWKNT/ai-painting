// Shared layout, palette and brush habits for the Metroid Prime painting.
//
// The scene: the Phendrana Shorelines. Samus Aran has come up out of the hot caves into
// the cold of Phendrana, and stands on a ledge of snow. Before her is a still dark lake
// with flat stones in it, each with a cap of snow, and on the far shore the Ice Temple
// of the Chozo: a round stone tower under a roof with curled red eaves, a long hall with
// a pale dome, and a second, smaller tower beyond. Cliffs of ice stand behind, with a
// frozen fall of water at the left. Snow comes down. We see her back: the red helmet,
// the great round shoulders of the Varia Suit, the arm cannon held low at her right side.
//
// The light is the whole grey sky: cold, soft, from above, a little brighter at the upper
// left. So each thing is pale on its top, where the snow lies, and dark under. The far
// things go into the falling snow. The only warm lights are the lamps of the Chozo, which
// still burn at the temple, and her suit.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, through } = studio;

const W = 1600, H = 1000;
const EYE_Y = 420;                                      // the line of the eye
const cam = studio.camera({ hz: EYE_Y, vx: 800, f: 1100, eye: 2.4 });   // we stand on the ledge, a little behind her and above
const WATER = -1.5;                                     // the lake lies so far below the ledge, in metres
const SAMUS = { X: -2.36, Z: 7 };                       // where she stands
const SHORE = 494;                                      // the line where the far shore meets the lake
const TOWER = { x: 1010, base: 442 };                   // the great tower of the temple

const nA = noise2(5501), nB = noise2(5507), nC = noise2(5519), nD = noise2(5521);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// The sky: grey-blue, paler low down and at the upper left, where the light is.
const skyRamp = grad([[0, '#7c8ea0'], [0.3, '#9aaab8'], [0.6, '#b8c4cc'], [1, '#d0d8dc']]);
function skyColor(x, y) {
  const c = skyRamp(clamp(y / 520 + (nA(x / 420, y / 240) - 0.5) * 0.14, 0, 1));
  return mix(c, '#e4eaec', 0.5 * Math.exp(-Math.pow(Math.hypot(x - 420, y + 60) / 620, 2)));
}
// What the falling snow does to a far thing: d is 0 near us and 1 very far off.
const veil = (color, x, y, d) => mix(color, skyColor(x, Math.min(y, 500)), clamp(d, 0, 1) * 0.9);
// The far edge of the ledge that we stand on, at an x of the picture; it turns down at the right and goes out of the foot of the picture.
const ledgeEdge = through([[0, 712], [200, 718], [420, 726], [600, 742], [720, 782], [790, 852], [830, 940], [850, 1010]]);
const onLedge = (x, y) => x < 850 && y > ledgeEdge(x) + 5 * (nC(x / 26, 3) - 0.5);

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, EYE_Y, cam, WATER, SAMUS, SHORE, TOWER, nA, nB, nC, nD, hash, skyColor, veil, ledgeEdge, onLedge };
