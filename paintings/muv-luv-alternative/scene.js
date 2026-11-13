// Shared layout, palette and brush habits for the Muv-Luv Alternative painting.
//
// The scene: a battle against the BETA at the end of a day. The plain has been ground flat
// and burnt; the sun is going down behind the smoke, and the fires and the sun together make
// one band of glare along the horizon. A Fort-class, the largest of the BETA, stands over the
// field on its ten legs with its tail drawn back to strike. A Tactical Surface Fighter comes
// at it low and fast on its jump units, sword raised, gun firing. Behind them the horde
// comes on: Destroyer-class with their armored fronts, Grappler-class, the small red
// Tank-class. Far off stands the monument of a Hive, and the lasers of the Laser-class cut
// the sky. We look into the glare, so everything near is dark with bright edges.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const FIRE = { x: 720, y: 612 };           // the heart of the glare: the low sun behind the smoke
const LIGHT = { at: [FIRE.x, FIRE.y] };
const HORIZON = 620;
const FORT = { x: 1170, y: 310 };          // the middle of the Fort-class's body
const TSF = { x: 460, y: 570 };            // the waist of the fighter

const nA = noise2(17), nB = noise2(29), nC = noise2(43);

// How strongly the glare reaches a place: 1 at its heart, 0 far from it.
const glow = (x, y, reach = 420) => Math.exp(-Math.pow(Math.hypot(x - FIRE.x, (y - FIRE.y) * 1.25) / reach, 2));
const toFire = (x, y) => { const dx = FIRE.x - x, dy = FIRE.y - y, l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };

// Sky: smoke overhead, almost black, then wine red, then fire down at the horizon. Away from
// the heart of the glare the horizon is duller, under more smoke.
const skyRamp = grad([[0, '#0c0b1a'], [0.22, '#151226'], [0.42, '#2a1630'], [0.58, '#541c32'], [0.72, '#962c2e'], [0.84, '#d4502a'], [0.93, '#f48a36'], [1, '#ffc468']]);
function skyColor(x, y) {
  const t = clamp(y / HORIZON + (nA(x / 380, y / 200) - 0.5) * 0.1, 0, 1);
  let c = skyRamp(t);
  c = mix(c, '#3c1426', smooth(260, 900, Math.abs(x - FIRE.x)) * 0.6 * t * t);
  c = mix(c, '#ff7a30', 0.45 * glow(x, y, 520));
  return mix(c, '#ffe6a0', 0.85 * glow(x, y, 170));
}
// The way the sky's strokes run: level far from the glare, curling round it close by.
function skyFlow(x, y) {
  const k = glow(x, y, 520);
  let a = Math.atan2(x - FIRE.x, -1.5 * (y - FIRE.y));
  if (a > Math.PI / 2) a -= Math.PI; else if (a < -Math.PI / 2) a += Math.PI;   // a stroke has no heading, only a slant
  return a * k + (nB(x / 300, y / 160) - 0.5) * 0.5 * (1 - k);
}

// The ground: burnt earth, nearly black, taking a little of the glare where it lies low and far.
function groundColor(x, y) {
  const far = clamp(1 - (y - HORIZON) / 300, 0, 1);            // 1 at the horizon, 0 at our feet
  let c = mix(mix('#0d0b14', '#17121c', nA(x / 70, y / 26)), '#3a1c1e', far * 0.5);
  c = mix(c, '#b8482a', clamp(glow(x, y, 330) * 1.1, 0, 1) * (0.25 + 0.5 * far));
  return c;
}

// The color of a dark thing at a distance: its own dark, with the air between taking it
// toward the color of the sky behind it. `far` is 0 close by and 1 at the horizon.
const veil = (color, x, y, far) => mix(color, skyColor(x, Math.min(y, HORIZON - 4)), clamp(far, 0, 1) * 0.6);

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, FIRE, LIGHT, HORIZON, FORT, TSF, nA, nB, nC, glow, toFire, skyColor, skyFlow, groundColor, veil };
