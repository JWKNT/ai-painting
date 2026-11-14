// Shared layout, palette and brush habits for the Metroid Prime painting.
//
// The scene: Metroid Quarantine, deep in the Phazon Mines of Tallon IV. The Space Pirates
// kept their Metroids here, in a cavern, and the Metroids are loose. A Metroid is a thing
// like a jellyfish that floats in the air: a clear green bell with red hearts inside it,
// and under the bell great fangs, with which it takes hold of a living thing and drinks
// the life out of it. The cavern is dark. Great mushrooms that give light stand in it,
// blue-green; Phazon, the blue poison that fell to this world from the sky, lies in a pit
// and runs in the rock, and it shines and cracks like lightning. Samus Aran stands on a
// ledge at the left, small, with her arm cannon up: one Metroid is in ice from her shot,
// and the greatest of them comes down at her.
//
// The lights. The mushrooms give a blue-green light from their caps and stems. The Phazon
// gives a hard blue from below. Each Metroid is a small green lamp with a red heart. So
// every form has three colors on it: blue-green from the side of the nearest mushroom,
// blue from below, and green where a Metroid is near; all the rest is the dark of the mine.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, clamp, smooth, through } = studio;

const W = 1600, H = 1000;
// The great mushrooms: where each stands, the height of its stem, half the width of its cap, and how far off it is (0 near, 1 far).
const FUNGI = [
  { x: 1344, base: 880, h: 590, cap: 236, d: 0.06 },
  { x: 118, base: 806, h: 430, cap: 150, d: 0.3 },
  { x: 566, base: 812, h: 350, cap: 118, d: 0.42 },
  { x: 772, base: 800, h: 230, cap: 78, d: 0.6 },
  { x: 1560, base: 790, h: 250, cap: 84, d: 0.55 },
];
const PHAZON = { x: 1050, y: 934 };                     // the pit of Phazon
const BIG = { x: 936, y: 326, R: 152 };                 // the greatest Metroid
const ICED = { x: 636, y: 468, R: 60 };                 // the one that is in ice
const SAMUS = { x: 236, feet: 826, U: 132 };            // where she stands, and the picture's units to the metre there
const MUZZLE = [SAMUS.x + 1.06 * SAMUS.U, SAMUS.feet - 1.72 * SAMUS.U];   // the mouth of the arm cannon

const nA = noise2(5501), nB = noise2(5507), nC = noise2(5519), nD = noise2(5521);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// How much of the light of the mushrooms is at a place, and how much of the light of the Phazon.
const fungal = (x, y) => { let k = 0; for (const f of FUNGI) { const cy = f.base - f.h; k += (1 - f.d * 0.7) * (Math.exp(-Math.pow(Math.hypot(x - f.x, (y - cy) * 0.9) / (f.cap * 1.5), 2)) + 0.5 * Math.exp(-Math.pow(Math.hypot((x - f.x) * 1.4, (y - f.base) * 1.0) / (f.cap * 1.2), 2))); } return clamp(k, 0, 1); };
const phazon = (x, y, reach = 300) => Math.exp(-Math.pow(Math.hypot(x - PHAZON.x, (y - PHAZON.y) * 1.25) / reach, 2));
// The floor of the cavern at an x: a ledge at the left, then lower ground.
const floorY = through([[0, 826], [300, 822], [430, 830], [520, 880], [700, 900], [900, 912], [1200, 916], [1400, 894], [1600, 880]]);
// The dark of the mine at a place, with the lights in it.
function mine(x, y) {
  let c = mix('#05060f', '#0c1028', nA(x / 380, y / 260));
  c = mix(c, '#12566c', fungal(x, y) * 0.42);
  return mix(c, '#1c3ccc', phazon(x, y, 380) * 0.36);
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, FUNGI, PHAZON, BIG, ICED, SAMUS, MUZZLE, nA, nB, nC, nD, hash, fungal, phazon, floorY, mine, smooth };
