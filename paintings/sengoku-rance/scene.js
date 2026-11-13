// Shared layout, palette and brush habits for the Sengoku Rance painting.
//
// The scene: a spring morning in JAPAN. Rance stands on a hill with his back to us and the
// sword Chaos raised, Sill beside him, Hannies cheering in the grass. Below them two armies
// face each other on the plain, a castle stands among cherry trees, and a snow peak rises
// beyond. Cherry branches hang into the sky and petals blow across everything.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, through, clamp, smooth } = studio;

const W = 1600, H = 1000;
const SUN = { x: 1178, y: 128, r: 34 };
const HORIZON = 528;                       // where the plain meets the far hills
const PEAK = { x: 1150, y: 292 };          // the snow mountain
const CASTLE = { x: 410, base: 508, s: 1.55 };
const RANCE = { x: 1058, y: 872, h: 400 }; // feet, and height to the top of the head
const SILL = { x: 836, y: 886, h: 300 };

const nA = noise2(101), nB = noise2(202), nC = noise2(303);

// Sky: deep blue overhead, pale at the horizon, warm around the sun.
const skyRamp = grad([[0, '#2a69bd'], [0.3, '#4585d2'], [0.6, '#7fb3e6'], [0.85, '#bcdcf3'], [1, '#e2f0f8']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / HORIZON + (nA(x / 380, y / 200) - 0.5) * 0.08, 0, 1));
  const d = Math.hypot(x - SUN.x, (y - SUN.y) * 1.15);
  c = mix(c, '#fff3d4', 0.78 * Math.exp(-Math.pow(d / 300, 2)));
  return mix(c, '#fdf2e0', 0.22 * Math.exp(-Math.pow(d / 760, 2)));
}

// The snow mountain: a long concave slope either side of a narrow top.
function peakLine(x) {
  const dx = Math.abs(x - PEAK.x);
  const y = dx < 24 ? PEAK.y + (nB(x / 9, 5) - 0.5) * 6 : PEAK.y + (HORIZON + 6 - PEAK.y) * (1 - Math.exp(-(dx - 24) / 175));
  return y + (nB(x / 40, 9) - 0.5) * 5;
}
// Far ranges either side of it, and the nearer green hills at the edge of the plain.
const farLine = (x) => 472 + 22 * Math.sin(x / 190 + 0.6) + 26 * (nA(x / 130, 3) - 0.5) + 8 * (nB(x / 30, 7) - 0.5);
const nearLine = (x) => 512 + 12 * Math.sin(x / 230 + 2) + 16 * (nA(x / 110, 11) - 0.5);

// The hill the castle stands on, and the hill in the foreground.
const castleHill = through([[60, 566], [200, 540], [320, 512], [380, 506], [450, 506], [520, 516], [640, 548], [760, 566]]);
const hillLine = through([[0, 812], [260, 786], [560, 752], [820, 716], [1060, 700], [1300, 706], [1600, 742]]);
const hillTop = (x) => hillLine(x) + 6 * (nB(x / 34, 40) - 0.5);

// Morning light comes from the sun, up and to the right.
const lit = (x, y, k = 1) => clamp(0.5 + k * ((x - 800) / 1600 - (y - 500) / 2000), 0, 1);

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, SUN, HORIZON, PEAK, CASTLE, RANCE, SILL, nA, nB, nC, skyColor, peakLine, farLine, nearLine, castleHill, hillTop, lit };
