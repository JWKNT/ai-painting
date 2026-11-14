// Shared layout, palette and brush habits for the Muramasa painting.
//
// The scene: the crimson spider. In Full Metal Daemon Muramasa a tsurugi is a suit of
// armour that has a mind. When no one wears it, it has the shape of a beast, and it
// walks. Muramasa, the armour that is cursed, is a great spider of crimson steel. Here it
// hangs head down on threads of steel between two old cedars, in front of the moon: a
// round body like a helmet bowl, a smaller fore part with two yellow eyes, and eight
// legs in plates, each ending in a point. Under it stands Minato Kageaki, the man who
// wears it, with his sword drawn. Its two fore legs come down toward him. In a moment it
// will come apart and close on him as his armour. Two baskets of fire burn in the yard.
//
// The lights. The moon is behind the spider: it is cold, and it puts a thin pale line on
// the upper edges of things. The two fires are low and warm: they light the under side
// of the spider, so that its crimson shines, and they light the two sides of the man
// and the ground about him. All else is the blue dark of the night.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const MOON = { x: 800, y: 372, r: 300 };
const HEAD = { x: 800, y: 430, r: 62 };                 // the fore part of the spider, which hangs lowest
const BELLY = { x: 800, y: 286, r: 104 };               // its round body, above
const FIRES = [[318, 792], [1282, 792]];                // where the two fires burn
const MAN = { x: 800, feet: 966, U: 186 };              // where the man stands; the picture's units to the metre there
const GROUND = 800;                                     // the far edge of the yard, in the picture

const nA = noise2(9901), nB = noise2(9907), nC = noise2(9919), nD = noise2(9929);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// How much of the light of the fires is at a place, and of the moon in the air.
const fire = (x, y, reach = 260) => { let k = 0; for (const [fx, fy] of FIRES) k = Math.max(k, Math.exp(-Math.pow(Math.hypot(x - fx, (y - fy) * 1.1) / reach, 2))); return k; };
const moonAir = (x, y, reach = 520) => Math.exp(-Math.pow(Math.hypot(x - MOON.x, y - MOON.y) / reach, 2));
// The sky of the night: deep blue, lighter round the moon.
const night = grad([[0, '#060a1e'], [0.4, '#0b1432'], [0.75, '#142450'], [1, '#1e3468']]);
function skyColor(x, y) {
  let c = night(clamp(y / GROUND + (nA(x / 480, y / 260) - 0.5) * 0.06, 0, 1));
  c = mix(c, '#3c5aa0', moonAir(x, y, 560) * 0.6);
  return mix(c, '#93a8d8', moonAir(x, y, 380) * 0.3);
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, MOON, HEAD, BELLY, FIRES, MAN, GROUND, nA, nB, nC, nD, hash, fire, moonAir, skyColor, smooth };
