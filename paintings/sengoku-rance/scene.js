// Shared layout, palette and brush habits for the Sengoku Rance painting.
//
// The scene: dawn in JAPAN, on the morning of a battle. Rance stands on a hill with his back
// to us and the sword Chaos raised, Sill beside him, Hannies in the grass. The sun is coming
// up behind the shoulder of a snow peak. Below, two armies wait in the mist on the plain and
// a castle stands among cherry trees. Cherry branches hang into the sky and petals drift
// across everything. We look into the light, so the near things are dark with bright edges.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, through, clamp, smooth } = studio;

const W = 1600, H = 1000;
const SUN = { x: 930, y: 438, r: 38 };
const SUNLIGHT = { at: [SUN.x, SUN.y] };
const HORIZON = 528;                       // where the plain meets the far hills
const PEAK = { x: 1150, y: 292 };          // the snow mountain
const CASTLE = { x: 410, base: 508, s: 1.55 };
const RANCE = { x: 1066, y: 758, h: 300 }; // feet, and height to the top of the head
const SILL = { x: 846, y: 764, h: 222 };

const nA = noise2(101), nB = noise2(202), nC = noise2(303);

// How strongly the sun's glow reaches a place: 1 at the sun, 0 far from it.
const glow = (x, y, reach = 420) => Math.exp(-Math.pow(Math.hypot(x - SUN.x, (y - SUN.y) * 1.2) / reach, 2));

// Sky: night blue overhead, then violet, rose and gold down to the horizon, and the sun's
// own light spreading through all of it.
const skyRamp = grad([[0, '#25346c'], [0.24, '#46548f'], [0.44, '#7969a4'], [0.6, '#b8789c'], [0.76, '#ea9886'], [0.9, '#f9be8a'], [1, '#ffd9a2']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / HORIZON + (nA(x / 380, y / 200) - 0.5) * 0.09, 0, 1));
  c = mix(c, '#ffb070', 0.5 * glow(x, y, 560));
  return mix(c, '#fff0bc', 0.9 * glow(x, y, 200));
}
// The way the sky's strokes run: level far from the sun, curling round it close by.
function skyFlow(x, y) {
  const round = Math.atan2(x - SUN.x, -1.5 * (y - SUN.y)), k = glow(x, y, 520);
  let a = round;
  if (a > Math.PI / 2) a -= Math.PI; else if (a < -Math.PI / 2) a += Math.PI;   // a stroke has no heading, only a slant
  return a * k + (nB(x / 300, y / 160) - 0.5) * 0.5 * (1 - k);
}

// The snow mountain: a long concave slope either side of a narrow top.
function peakLine(x) {
  const dx = Math.abs(x - PEAK.x);
  const y = dx < 24 ? PEAK.y + (nB(x / 9, 5) - 0.5) * 6 : PEAK.y + (HORIZON + 6 - PEAK.y) * (1 - Math.exp(-(dx - 24) / 175));
  return y + (nB(x / 40, 9) - 0.5) * 5;
}
// Far ranges either side of it, and the nearer wooded hills at the edge of the plain.
const farLine = (x) => 472 + 22 * Math.sin(x / 190 + 0.6) + 26 * (nA(x / 130, 3) - 0.5) + 8 * (nB(x / 30, 7) - 0.5);
const nearLine = (x) => 512 + 12 * Math.sin(x / 230 + 2) + 16 * (nA(x / 110, 11) - 0.5);

// The hill the castle stands on, and the hill in the foreground.
const castleHill = through([[60, 566], [200, 540], [320, 512], [380, 506], [450, 506], [520, 516], [640, 548], [760, 566]]);
const hillLine = through([[0, 812], [260, 786], [560, 752], [820, 716], [1060, 700], [1300, 706], [1600, 742]]);
const hillTop = (x) => hillLine(x) + 6 * (nB(x / 34, 40) - 0.5);

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, SUN, SUNLIGHT, HORIZON, PEAK, CASTLE, RANCE, SILL, nA, nB, nC, glow, skyColor, skyFlow, peakLine, farLine, nearLine, castleHill, hillTop };
