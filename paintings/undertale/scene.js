// Shared layout, palette and brush habits for the Undertale painting.
//
// The scene: the castle far off. In Waterfall, deep under the mountain, it rains from the
// roof of the cavern. A human child has taken an umbrella from a box, and a monster child
// with no arms walks under it too. On a long ledge of rock the dark opens, and far across
// a black lake the castle of the king comes into view: New Home, pale and small, with its
// pointed blue roofs. Over it the roof of the cavern is full of crystals that shine like
// stars, which the monsters wish on. We stand behind the two children. Echo flowers grow
// by the ledge: blue flowers that give light and say again what they last heard.
//
// The light. There is no sun here. The crystals are small cold lights, far overhead. The
// castle is pale with its own lamps. The water near the ledge shines blue-green from
// below, and each echo flower is a lamp of the same color: so the wet rock, the grass
// and the backs of the two children take a blue-green light from low down, and all else
// is the dark. The umbrella is the one warm thing.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp } = studio;

const W = 1600, H = 1000;
const EYE = 520;                                        // the line of the eye: we stand on a rise behind the children, and look a little down
const cam = studio.camera({ hz: EYE, vx: 800, f: 933, eye: 2.7 });
const EDGE = 9.6;                                       // the far edge of the ledge, in metres from us
const KIDS = 6.2;                                       // how far off the two children stand
const FRISK = { X: -0.72, h: 1.26 };                    // the human child: where it stands across the ledge, and its height
const KID = { X: -1.56, h: 1.1 };                       // the monster child
const SHORE = 546;                                      // the far shore of the lake, in the picture
const CASTLE = { x: 1090, base: 540, s: 1 };            // New Home: the middle of its foot

const nA = noise2(3301), nB = noise2(3307), nC = noise2(3319), nD = noise2(3323);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// The glow of the castle in the dark air round it, and of the water near the ledge.
const castleGlow = (x, y, reach = 330) => Math.exp(-Math.pow(Math.hypot(x - CASTLE.x, (y - 440) * 1.3) / reach, 2));
// The dark of the cavern: nearly black overhead, a deep blue lower down where the far air holds a little light.
const dark = grad([[0, '#04050c'], [0.3, '#070a1a'], [0.5, '#0c1230'], [0.56, '#121a42'], [0.62, '#0a0f2a'], [1, '#05070f']]);
function cavern(x, y) {
  let c = dark(clamp(y / H + (nA(x / 500, y / 300) - 0.5) * 0.04, 0, 1));
  c = mix(c, '#2a3c7c', castleGlow(x, y, 380) * 0.5);
  return mix(c, '#3c5494', castleGlow(x, y, 170) * 0.35);
}
// The far edge of the ledge at an x of the picture: nearly level, a little broken.
const edgeY = (x) => cam.at(0, 0, EDGE)[1] + 5 * (nB(x / 140, 2) - 0.5) + 3 * (nC(x / 31, 5) - 0.5);
// The colors of the blue-green light.
const GLOW = '#3fe0d0', GLOW_DEEP = '#0f6c74';

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, EYE, cam, EDGE, KIDS, FRISK, KID, SHORE, CASTLE, nA, nB, nC, nD, hash, castleGlow, cavern, edgeY, GLOW, GLOW_DEEP };
