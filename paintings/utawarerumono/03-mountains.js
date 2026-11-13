// The mountains beyond the valley, in two ranges, with the sun on the flanks that face it,
// and the mist at their feet.
'use strict';
const { studio, open, W, FOOT, far, nA, nB, nC } = require('./scene');
const { mix, through, clamp, smooth, wave } = studio;

const p = open('mountains');
const r = p.rng;

// A range: its skyline, how far off it is, its color in the light and its color out of it.
function range(line, d, lit, shade, o = {}) {
  const ridge = (x) => line(x) + (o.rough || 16) * (nA(x / (o.grain || 60), d * 40) - 0.5) + 5 * (nB(x / 17, d * 30) - 0.5);
  const fall = (x) => (ridge(x + 30) - ridge(x - 30)) / 60;                     // more than 0 where it goes down to the right, toward the sun
  const tone = (x, y) => clamp(0.5 + fall(x - (y - ridge(x)) * 0.6) * 2.2 + (nC(x / 170, y / 120 + d * 9) - 0.5) * 0.3, 0, 1);
  p.fill({ inside: (x, y) => y > ridge(x) && y < FOOT + 14, bounds: [0, 170, W, FOOT + 16], width: o.width || 13, length: o.length || 56, spacing: 0.5, angle: (x, y) => (tone(x, y) > 0.5 ? 0.85 : 2.25) + r.range(-0.35, 0.35),
    color: (x, y) => far(mix(shade, lit, smooth(0.2, 0.8, tone(x + r.range(-10, 10), y))), x, y, d + 0.16 * smooth(ridge(x), FOOT, y)), stroke: { brush: 'bristle', opacity: 0.94, mix: 0.2, dry: 0.04, rag: 0.25 } });
}
range(through([[0, 250], [180, 232], [330, 262], [520, 226], [700, 258], [880, 236], [1060, 270], [1240, 248], [1420, 280], [1600, 262]]), 0.76, '#eeb48c', '#6a6496');
range(through([[0, 300], [240, 284], [460, 316], [700, 300], [940, 326], [1180, 308], [1400, 332], [1600, 320]]), 0.56, '#cf955c', '#4b4b72', { rough: 12, grain: 44, width: 10, length: 40 });
for (let k = 0; k < 9; k++) {                                            // mist at their feet
  const x = r.range(-100, W - 300), y = FOOT + r.range(-14, 12), len = r.range(300, 600);
  p.stroke({ brush: 'soft', color: far('#fff0c8', x + len / 2, y, 0.5), width: r.range(22, 40), opacity: r.range(0.16, 0.3), points: wave(x, y, x + len, y + r.range(-4, 4), 3, 1, 6) });
}

p.save();
