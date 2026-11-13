// Shared layout, palette and brush habits for the Utawarerumono painting.
//
// The scene: the first game. It is late in an autumn day, and Hakuowlo stands on a ridge
// above Tuskur, the country that made him its emperor. He does not know who he was, and the
// white mask on his face will not come off. Eruruu, who found him and nursed him, is beside
// him. Her small sister Aruruu rides ahead on Mukkuru, the white tiger that she brought up
// from a cub. Below them is the fortress, with the smoke of the evening fires over it.
//
// The sun is low and out of the picture at the right. Its light comes level along the ridge:
// it is on the front of everything that faces it, and what is turned from it is in cool shade.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, through, clamp, smooth } = studio;

const W = 1600, H = 1000;
const SUN = { x: 1770, y: 250 };           // where the sun is, past the right edge
const SUNWARD = [0.94, -0.34];             // toward it, from the ridge
const FOOT = 352;                          // the foot of the far mountains
const FORT = { x: 940, y: 548 };
// The feet of each of them, and how big each is painted beside Hakuowlo, who is nearest.
const HAKUOWLO = { x: 452, y: 918, s: 1 }, ERURUU = { x: 676, y: 894, s: 0.92 }, MUKKURU = { x: 1236, y: 778, s: 0.52 };

const nA = noise2(61), nB = noise2(73), nC = noise2(89);

// The sky near sunset: gold by the sun, then rose, then the blue of evening at the far side.
const skyRamp = grad([[0, '#fff0b4'], [0.1, '#ffd98a'], [0.24, '#f7b47c'], [0.42, '#dc9488'], [0.62, '#a688a8'], [0.82, '#6f7cae'], [1, '#52629c']]);
function skyColor(x, y) {
  const t = clamp(Math.hypot(x - SUN.x, (y - SUN.y) * 1.5) / 1850 + (nA(x / 380, y / 160) - 0.5) * 0.05, 0, 1);
  return mix(skyRamp(t), '#f6c890', smooth(120, FOOT, y) * 0.3 * (1 - t * 0.5));               // warmer low in the sky
}
// What the air does to a thing at a distance: d is 0 close to us and 1 very far off. The air is gold on the side of the sun.
const far = (color, x, y, d) => mix(color, skyColor(x, FOOT - 30), clamp(d, 0, 1) * 0.85);

// The far edge of the ridge that we stand on. The valley is beyond it and below it.
const browLine = through([[0, 742], [300, 708], [640, 676], [1000, 652], [1300, 660], [1600, 700]]);
const brow = (x) => browLine(x) + 6 * (nB(x / 50, 3) - 0.5);

// The skyline of the wooded slope at the left, which comes down across the picture into the valley.
const slopeLine = through([[0, 262], [150, 290], [330, 352], [520, 432], [660, 506], [760, 580], [820, 646], [860, 704]]);

// A place on one of the figures: so far forward of the feet, so far up, and a size, all as for a figure painted at full size.
const body = (F) => (fx, fy, rad) => (rad == null ? [F.x + fx * F.s, F.y - fy * F.s] : [F.x + fx * F.s, F.y - fy * F.s, rad * F.s]);

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, SUN, SUNWARD, FOOT, FORT, HAKUOWLO, ERURUU, MUKKURU, nA, nB, nC, skyColor, far, brow, slopeLine, body };
