// The horizon: the Short Sun going down, small and white-hot in its glare; a low dark shore
// under Green, at the left, with rain over it; and at the right a rock that stands out of
// the sea, with a broken tower of the Vanished People on it, black against the light.
'use strict';
const { studio, open, HORIZON, SUN, glow, greenGlow, skyColor, nA } = require('./scene');
const { mix, clamp, disc, mass, glint, wave } = studio;

const p = open('horizon');
const r = p.rng;

// The far shore at the left: low, wooded, dark, with the green of the near world on its tops.
{
  const puffs = [];
  for (let x = -40; x < 560; x += 34) {
    const h = 30 + 46 * nA(x / 160, 3) + 20 * Math.exp(-Math.pow((x - 160) / 150, 2));
    puffs.push([x, HORIZON - h * 0.5, 26 + h * 0.4]);
    if (h > 50) puffs.push([x + r.range(-10, 10), HORIZON - h, 20 + h * 0.2]);
  }
  mass(p, puffs, { light: [0.2, -1], tones: (t, x, y) => mix(mix('#0c1634', '#1c2c52', t), '#3c9a6c', t * t * 0.55 * clamp(greenGlow(x, y, 420) * 1.6, 0, 1)), base: HORIZON + 2, bias: 0.4, contrast: 0.6, grain: 0.22, mix: 0.3, seed: 4, stroke: { hardness: 0.6, rag: 0.35 }, flow: (x, y) => (nA(x / 60, y / 30) - 0.5) * 1.2, layers: [[13, 44, 0.95, 5, 0.42], [8, 26, 0.85, 3, 0.7]] });
  for (let k = 0; k < 5; k++) { const x = r.range(-60, 360), len = r.range(200, 360); p.stroke({ brush: 'soft', color: '#16264a', width: r.range(24, 40), opacity: 0.2, points: wave(x, HORIZON - r.range(4, 20), x + len, HORIZON - r.range(4, 20), 3, 1, 7) }); }   // rain under it
}

// The glare of the sun along the horizon, and the sun.
for (const [w, color, o] of [[440, '#ff9450', 0.16], [280, '#ffb868', 0.22], [150, '#ffe0a0', 0.3], [70, '#fff4d0', 0.5]]) {
  p.stroke({ brush: 'soft', color, width: w, opacity: o, points: [[SUN.x - w * 1.3, SUN.y + 4], [SUN.x, SUN.y - 4], [SUN.x + w * 1.3, SUN.y + 4]] });
}
disc(p, SUN.x, SUN.y, SUN.r, '#fff8dc', 7, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round' });
p.stroke({ brush: 'bristle', color: '#ffffff', width: 12, mix: 0, dry: 0, rag: 0, cap: 'round', points: [[SUN.x - 12.4, SUN.y], [SUN.x + 12.4, SUN.y]] });
p.stroke({ brush: 'soft', color: '#ffffff', width: 40, opacity: 0.6, points: [[SUN.x - 46, SUN.y + 1], [SUN.x, SUN.y - 1], [SUN.x + 46, SUN.y + 1]] });
for (const [len, w, o] of [[420, 9, 0.5], [240, 6, 0.7]]) p.stroke({ brush: 'bristle', color: '#fff0c4', width: w, opacity: o, mix: 0.2, dry: 0.05, rag: 0.3, taper: [0.5, 0.5], points: [[SUN.x - len / 2, SUN.y + 9], [SUN.x, SUN.y + 10], [SUN.x + len / 2, SUN.y + 9]] });   // the bright line where sea and sky meet under it

// The rock and its tower.
{
  const dark = (x, y) => mix(mix('#0c0a1c', '#1a1430', nA(x / 20, y / 20)), skyColor(x, y), 0.12);
  const stroke = { brush: 'bristle', mix: 0, dry: 0, rag: 0.2, cap: 'flat', streak: 0.3, jitter: 0.5 };
  const top = (x) => HORIZON - 4 - 64 * Math.exp(-Math.pow((x - 1500) / 54, 2)) - 30 * Math.exp(-Math.pow((x - 1576) / 30, 2)) - 12 * Math.exp(-Math.pow((x - 1436) / 20, 2)) + 9 * (nA(x / 9, 9) - 0.5);
  // the rock: it slopes up out of the sea to the foot of the tower, in strokes that lie along its slopes
  p.fill({ inside: (x, y) => x > 1392 && y > top(x) + 5 && y < HORIZON + 6, bounds: [1392, HORIZON - 80, 1620, HORIZON + 6], width: 11, length: 44, spacing: 0.45, angle: (x, y) => Math.atan2(top(x + 8) - top(x - 8), 16) + (nA(x / 14, y / 14) - 0.5) * 0.5, color: (x, y) => dark(x + r.range(-5, 5), y), stroke: { ...stroke, opacity: 0.97 } });
  for (let x = 1396; x < 1612; x += 26) p.tryStroke({ ...stroke, color: dark(x, top(x)), width: 8, points: [[x, top(x) + 5], [x + 13, top(x + 13) + 5], [x + 26, top(x + 26) + 5]] });   // its edge against the sky
  // the tower: tall and thin, leaning a very little, its top broken off at a slant
  for (const [x, w, y0] of [[1482, 15, 426], [1494, 13, 410], [1506, 12, 438]]) p.stroke({ ...stroke, rag: 0.3, color: dark(x, 500), width: w, points: [[x + 4, HORIZON - 40], [x + 1, (HORIZON - 40 + y0) / 2], [x - 2, y0]] });
  for (const y of [470, 520]) p.tryStroke({ ...stroke, color: dark(1494, y), width: 6, points: [[1470, y], [1494, y - 1.5], [1518, y]] });     // rings of stone round it
  for (const [x, y] of [[1489, 446], [1497, 492], [1493, 540]]) p.tryStroke({ color: mix('#ffb060', '#ffe6a0', r()), width: 4, opacity: 0.55, points: [[x, y], [x, y + 13]] });   // its windows: the sky shows through them
  p.stroke({ ...stroke, color: dark(1560, 560), width: 13, points: [[1562, HORIZON - 14], [1560, HORIZON - 70]] });                                                                   // a second one, fallen to a stump
  glint(p, [[1474, 444], [1477, 500], [1480, 566]], () => mix('#ff9c50', '#ffe0a0', r()), { width: 4, dash: 30, gap: 14, opacity: 0.8, rng: r });                                     // the sun down its side
  glint(p, [[1412, HORIZON - 20], [1440, HORIZON - 28], [1466, HORIZON - 44]], () => mix('#ff9c50', '#ffe0a0', r()), { width: 4, dash: 22, gap: 12, opacity: 0.6, rng: r });
  for (let k = 0; k < 6; k++) { const x = r.range(1396, 1600); p.tryStroke({ color: '#fff4dc', width: 4, opacity: r.range(0.3, 0.6), points: [[x - 8, HORIZON + 5], [x + 8, HORIZON + 5 + r.range(-1, 1)]] }); }   // surf at its foot
}

// Haze along the whole horizon.
for (let k = 0; k < 10; k++) {
  const x = r.range(-100, 1500), len = r.range(260, 520), y = HORIZON - r.range(0, 16), g = clamp(glow(x + len / 2, y, 520) * 1.3, 0, 1);
  p.stroke({ brush: 'soft', color: mix('#3c5c7c', '#ffd494', g), width: r.range(16, 28), opacity: r.range(0.1, 0.2), points: wave(x, y, x + len, y + r.range(-3, 3), 3, 1, 7) });
}

p.save();
