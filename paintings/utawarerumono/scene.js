// Shared layout, palette and brush habits for the Utawarerumono painting.
//
// The scene: the beginning of Mask of Deception. A man has woken in the snow with no memory.
// Kuon, a traveler with the ears and the long white tail of her people, has found him, named
// him Haku, and is leading him down out of the mountains. It is first light. The sun has
// come up behind us and to the left: it is on the high peaks and on the strip of snow where
// the two of them walk, and everything else is still in blue shadow. She points down to the
// village in the valley. The moon has not yet set.
//
// Unlike the other paintings, the sun is not in this one. The light comes from the side.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, through, clamp, smooth } = studio;

const W = 1600, H = 1000;
const SUNWARD = [-0.92, -0.38];            // toward the sun: low, behind us and to the left
const BASE = 548;                          // the foot of the far range
const MOON = { x: 1296, y: 130, r: 30 };
const VILLAGE = { x: 1180, y: 668 };
const KUON = { x: 716, y: 842, h: 178 }, HAKU = { x: 566, y: 874, h: 200 };   // their feet, and their heights

const nA = noise2(61), nB = noise2(73), nC = noise2(89);

// Sky at dawn, looking away from the sun: night blue overhead, paler down the sky, then a
// band of rose, and under it, along the horizon, the grey-blue shadow of the earth.
const skyRamp = grad([[0, '#1c2c70'], [0.26, '#3250a0'], [0.5, '#6c8ccc'], [0.68, '#b4b2dc'], [0.8, '#f0b4c0'], [0.9, '#c4a6c8'], [1, '#8a94c2']]);
function skyColor(x, y) {
  const t = clamp(y / BASE + (nA(x / 380, y / 200) - 0.5) * 0.07, 0, 1);
  return mix(skyRamp(t), '#ffe0c0', smooth(1100, 0, x) * 0.22 * smooth(0.2, 0.8, t));   // lighter on the side the sun is on
}
const skyFlow = (x, y) => (nB(x / 300, y / 160) - 0.5) * 0.3 - 0.03;

// The wooded hills at the foot of the range and either side of the valley, and the slope
// close to us that the travelers are coming down.
const farHill = (x) => BASE + 4 + 16 * Math.sin(x / 230 + 0.5) + 24 * (nA(x / 140, 21) - 0.5);
const leftHill = through([[0, 572], [240, 588], [520, 610], [760, 640], [880, 672], [940, 720]]);
const rightHill = through([[1230, 716], [1290, 676], [1380, 640], [1480, 612], [1600, 590]]);
const nearLine = through([[0, 690], [260, 712], [560, 752], [820, 792], [1060, 830], [1300, 868], [1600, 900]]);
const near = (x) => nearLine(x) + 5 * (nB(x / 40, 31) - 0.5);

// Where the first sun lies on the near slope: a strip along the way the travelers have come,
// crossed by the long shadows of trees that stand behind us. 0 in shadow, 1 in full sun.
function sunlit(x, y) {
  const mid = 806 + x * 0.06 + 14 * (nB(x / 120, 7) - 0.5), half = 78 - x * 0.03;
  let b = 1 - Math.abs(y - mid) / half;
  if (b <= 0) return 0;
  b = smooth(0, 0.4, b) * smooth(1040, 840, x);                                  // it ends a little past them
  const bar = Math.sin((x + (y - 800) * 8.3) / 29 + 1) + (nC(x / 50, y / 50) - 0.5) * 0.8;
  let open = smooth(0.6, 0.2, bar);
  for (const f of [KUON, HAKU]) open = Math.max(open, Math.exp(-Math.pow(Math.hypot(x - f.x, (y - f.y) * 1.6) / 64, 2)));   // they stand in the light
  return b * open;
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, SUNWARD, BASE, MOON, VILLAGE, KUON, HAKU, nA, nB, nC, skyColor, skyFlow, farHill, leftHill, rightHill, near, sunlit };
