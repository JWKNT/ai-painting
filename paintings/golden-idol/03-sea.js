// The sea far below: dark water in level strokes, the sun's road across it, a headland on
// the horizon, and the ship at anchor.
'use strict';
const { studio, open, W, H, SUN, SEA, nA, nB } = require('./scene');
const { mix, clamp, smooth, wave } = studio;

const p = open('sea');
const r = p.rng;

const near = (y) => clamp((y - SEA) / (H - SEA), 0, 1);               // 0 at the horizon, 1 at the bottom
function water(x, y) {
  const n = near(y);
  let c = mix(mix('#7a4f7c', '#4a3d6e', smooth(0, 0.3, n)), mix('#2a3760', '#172844', smooth(0.4, 1, n)), smooth(0.15, 0.8, n));
  const road = Math.exp(-Math.pow((x - SUN.x) / (46 + 190 * n), 2));    // the path of light widens toward us
  c = mix(c, mix('#ffd27a', '#f08a4a', n), road * (0.85 - 0.45 * n) * (0.55 + 0.9 * nA(x / 30, y / 5)));
  return mix(c, '#b85e6a', 0.25 * (1 - n) * nB(x / 200, y / 9));
}
for (const [w, o] of [[26, 0.96], [13, 0.85]]) {
  p.fill({
    bounds: [-20, SEA + 4, W + 20, H + 10], width: (x, y) => Math.max(6, w * (0.3 + 0.8 * near(y))), length: w * 9, spacing: 0.5, overlap: 0.55,
    angle: (x, y) => (nB(x / 220, y / 40) - 0.5) * 0.1, color: (x, y) => water(x + r.range(-16, 16), y), stroke: { brush: 'bristle', opacity: o, mix: 0.15, dry: 0.05 },
  });
}
p.stroke({ brush: 'blend', width: 26, opacity: 0.5, points: wave(-40, SEA + 2, W + 40, SEA + 2, 2, 3, 12) });   // the horizon, softened

// The sun's road: bright dashes, small far off and long near us.
for (let k = 0; k < 110; k++) {
  const n = Math.pow(r(), 1.3), y = SEA + 6 + n * (H - SEA - 20), spread = 40 + 200 * n;
  const x = SUN.x + r.gauss() * spread * 0.55, len = Math.max(12.4, 14 + 70 * n * r());
  p.tryStroke({ color: mix('#fff0b8', '#ffb45c', n * r()), width: 4 + 3 * n * r(), opacity: r.range(0.45, 0.9) * (1 - 0.35 * n), points: [[x - len / 2, y], [x + len / 2, y + r.range(-1.5, 1.5)]] });
}

// A headland on the horizon, hazy with distance.
p.stroke({ brush: 'bristle', color: '#6a4670', width: 20, opacity: 0.9, taper: [0.7, 0.9], mix: 0.1, dry: 0, points: [[-30, SEA - 6], [120, SEA - 20], [260, SEA - 12], [420, SEA - 4]] });
p.stroke({ brush: 'bristle', color: '#7c4f74', width: 12, opacity: 0.8, taper: [0.6, 0.9], mix: 0.1, dry: 0, points: [[1400, SEA - 3], [1500, SEA - 10], [1620, SEA - 8]] });

// The ship at anchor: a dark hull, three masts, sails furled to their yards, a lantern astern.
{
  const sx = 1392, sy = SEA + 10, hull = '#241a30', sail = '#e8c9a0';
  p.stroke({ brush: 'flat', color: hull, width: 15, rag: 0, cap: 'round', points: [[sx - 62, sy - 6], [sx - 20, sy], [sx + 40, sy - 1], [sx + 66, sy - 10]] });
  p.line(sx + 52, sy - 10, sx + 88, sy - 22, { color: hull, width: 4.4 });                                     // bowsprit
  for (const [dx, h] of [[-36, 84], [4, 104], [40, 80]]) {
    p.line(sx + dx, sy - 6, sx + dx + 1, sy - h, { color: hull, width: 4.4 });
    for (const f of [0.52, 0.8]) p.line(sx + dx - 15 * (1.3 - f), sy - h * f, sx + dx + 15 * (1.3 - f), sy - h * f, { brush: 'flat', color: sail, width: 6.5, rag: 0, cap: 'round' });
  }
  p.line(sx - 36, sy - 84, sx - 62, sy - 12, { color: hull, width: 4, opacity: 0.6 });                         // rigging
  p.line(sx + 40, sy - 80, sx + 84, sy - 22, { color: hull, width: 4, opacity: 0.6 });
  p.line(sx - 66, sy - 14, sx - 53.5, sy - 14, { color: '#ffd27a', width: 4.4 });                              // the stern lantern
  p.stroke({ brush: 'soft', color: '#1a1830', width: 22, opacity: 0.5, points: [[sx - 70, sy + 12], [sx, sy + 15], [sx + 72, sy + 11]] });   // its shadow on the water
  for (let k = 0; k < 5; k++) p.line(sx - 58 + k * 26, sy + 20 + k % 2 * 5, sx - 40 + k * 26, sy + 21 + k % 2 * 5, { color: '#ffcf8a', width: 4, opacity: 0.5 });
}

p.save();
