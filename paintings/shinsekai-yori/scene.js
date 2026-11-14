// Shared layout, palette and brush habits for the Shinsekai Yori painting.
//
// The scene: the cat on the roof. A thousand years from now, in the village of Kamisu 66,
// life is quiet: wooden houses, rice fields, canals, water wheels. Every person has a
// power that can kill. So the village watches its children, and a child that may go
// wrong does not grow up. The thing that comes for such a child is the impure cat: a
// cat made by the village, three meters long and black, thin, with legs and a neck that
// are much too long, a ruff of rough hair, and eyes that shine red. The children think
// that it is only a story. Here it is dusk. The song that tells the children to go home
// comes from the horns on the pole. One child is still out, and runs home along the
// canal with a paper lantern. On the ridge of the school roof stands the cat, black
// against the sky, and it looks down at the child.
//
// The light is the end of the day. The sun is down behind the school: the sky is gold and
// rose there, and violet overhead. So the roof and the cat are dark shapes with the light
// behind them, and each has only a thin warm edge. The rice fields, which are full of
// water, are the brightest things on the ground: they are pieces of the sky. The paper
// screens of the school, the lamps of the houses and the lantern are small and warm.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth, through } = studio;

const W = 1600, H = 1000;
const HORIZON = 566;                                    // the foot of the far hills
const BANK = 800;                                       // the edge of the path, where the bank goes down to the canal
const GLOW = { x: 640, y: 560 };                        // where the sun went down
const HALL = { x0: 760, x1: 1580, eaves: 556, ridge: 372, ground: 770, hip: 120, over: 70 };   // the school hall: its wall, its eaves, its ridge
const CHILD = { x: 430, feet: 792, U: 100 };              // the child: where its feet are, and its height

const nA = noise2(1011), nB = noise2(1013), nC = noise2(1019), nD = noise2(1021);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
const glare = (x, y, reach) => Math.exp(-Math.pow(Math.hypot(x - GLOW.x, (y - GLOW.y) * 1.3) / reach, 2));
// The sky of the dusk: violet-blue overhead, rose, then gold at the edge of the world; brightest where the sun went down.
const dusk = grad([[0, '#232a66'], [0.22, '#4a4088'], [0.42, '#8c5890'], [0.6, '#d87880'], [0.78, '#f8a868'], [1, '#ffd888']]);
function skyColor(x, y) {
  const c = dusk(clamp(y / HORIZON + (nA(x / 520, y / 240) - 0.5) * 0.05 - smooth(900, 1700, x) * 0.1 - smooth(500, -200, x) * 0.04, 0, 1));
  return mix(mix(c, '#ffc060', glare(x, y, 420) * 0.55), '#fff0c0', glare(x, y, 170) * 0.6);
}
const far = (color, x, y, d) => mix(color, skyColor(x, Math.min(y, HORIZON - 4)), clamp(d, 0, 1) * 0.85);
// The roof of the hall: its top line at an x (the ridge in the middle, the two hips at its ends), and the line of its eaves.
const roofTop = (x) => { const { x0, x1, eaves, ridge, hip, over } = HALL, l = x0 - over, rr = x1 + over, a = x0 + hip, b = x1 - hip; if (x < l || x > rr) return eaves; if (x < a) return eaves - (eaves - ridge) * (x - l) / (a - l); if (x > b) return eaves - (eaves - ridge) * (rr - x) / (rr - b); return ridge; };

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, BANK, GLOW, HALL, CHILD, nA, nB, nC, nD, hash, glare, skyColor, far, roofTop, smooth, through };
