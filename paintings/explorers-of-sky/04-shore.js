// The shore: the sand that the last wave left wet, which holds the sky like a glass; the dry
// sand close to us, ridged by the wind, each ridge with the low sun on one side of it; the
// rocks at the left where the Krabby sit, and a smaller rock at the right; Sharpedo Bluff
// far off, a cliff in the shape of a shark's head; and the tracks of two small creatures up
// the sand to where they stand.
'use strict';
const { studio, open, W, H, HORIZON, SUN, SUNLIGHT, PIPLUP, CHIMCHAR, nA, nB, nC, skyColor, shore, wetEnd, sunPath } = require('./scene');
const { mix, clamp, smooth, solid, glint } = studio;

const p = open('shore');
const r = p.rng;
const level = () => r.range(-0.03, 0.03), stroke = { brush: 'bristle', opacity: 0.95, mix: 0.2, dry: 0.04, rag: 0.25 };

// Sharpedo Bluff: painted first, because it is the farthest thing here. Its nose points at
// the sun, its jaws are open, and the light is on the side of it that faces left.
{
  const outline = [[1296, 366], [1350, 330], [1420, 300], [1470, 280], [1500, 232], [1540, 270], [1602, 262], [1602, 546], [1318, 546], [1326, 500], [1312, 470], [1380, 452], [1432, 436], [1390, 414], [1340, 396]];
  const inside = (x, y) => { let c = false; for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) { const [xi, yi] = outline[i], [xj, yj] = outline[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const far = (c, x, y) => mix(c, skyColor(x, Math.min(y, HORIZON - 8)), 0.42);
  const rock = (x, y) => far(mix(mix('#6c5890', '#8a6c9c', nC(x / 50, y / 30)), '#ea9c94', smooth(1500, 1300, x) * 0.55 + (nB(x / 30, y / 16) - 0.5) * 0.2), x, y);
  p.fill({ inside, bounds: [1290, 226, W + 6, 548], width: 11, length: 60, spacing: 0.5, angle: () => 0.5 + r.range(-0.2, 0.2), color: rock, stroke });
  p.fill({ inside, bounds: [1290, 226, W + 6, 548], width: 7, length: 34, spacing: 0.95, overlap: 0.7, angle: () => 0.5 + r.range(-0.3, 0.3), color: (x, y) => rock(x + r.range(-8, 8), y + r.range(-8, 8)), stroke: { ...stroke, opacity: 0.85 } });
  p.stroke({ ...stroke, color: far('#3c2c58', 1380, 420), width: 15, opacity: 0.8, points: [[1352, 408], [1396, 426], [1428, 438]] });                                        // the dark inside its jaws
  for (const [x, y, dy] of [[1322, 386, 15], [1344, 398, 16], [1366, 408, 15], [1388, 418, 14], [1340, 464, -14], [1366, 458, -14], [1392, 452, -13]]) p.tryStroke({ color: far('#f8e0d8', x, y), width: 4.4, opacity: 0.85, taper: [0, 0.7], points: [[x, y], [x + 2, y + dy]] });   // its teeth
  p.stroke({ color: far('#2c2048', 1420, 344), width: 5, opacity: 0.8, points: [[1412, 340], [1426, 347]] });                                                                 // its eye
  glint(p, [[1298, 366], [1350, 331], [1420, 301], [1470, 281], [1499, 234]], () => far('#ffd0b8', 1400, 300), { width: 4.6, dash: 40, gap: 12, opacity: 0.8, rng: r });    // the light along its brow
  for (let x = 1320; x < W; x += 110) p.stroke({ brush: 'soft', color: far('#b890b4', x, 540), width: 18, opacity: 0.4, points: [[x, 546], [x + 60, 547], [x + 120, 546]] });   // the haze at its foot
}

// The wet sand: it holds the sky, a little darker, and the road of the sun goes on across it.
const wet = (x, y) => {
  const t = (y - shore(x)) / 84, s = sunPath(x, y) * (0.4 + 1.1 * nC(x / 34, y / 5));
  let c = mix(skyColor(x, HORIZON - 30 - t * 330), '#a07c6c', 0.34 + 0.12 * t);
  c = mix(c, '#7c5c68', (nB(x / 60, y / 8) - 0.5) * 0.3 + 0.08);
  return mix(c, mix('#ffb868', '#fff0c0', clamp(s, 0, 1)), clamp(s * 0.9, 0, 1));
};
p.fill({ inside: (x, y) => y > shore(x) - 3 && y < wetEnd(x) + 4, bounds: [0, 690, W, 860], width: 8.5, length: 96, spacing: 0.5, angle: level, color: wet, stroke });
// The dry sand: ridges, each with light on the side toward the sun and shade on the side toward us.
const dry = (x, y) => {
  const k = smooth(760, 1000, y), ridge = nC(x / (170 + 280 * k) + nA(x / 300, y / 200) * 2, y / (5 + 11 * k)), warm = Math.exp(-Math.pow((x - SUN.x) / 560, 2));
  let c = ridge > 0.5 ? mix('#dcb898', '#f6d6ac', (ridge - 0.5) * 2 * (0.5 + 0.5 * warm)) : mix('#c9a28e', '#a9849a', (0.5 - ridge) * 2);
  c = mix(c, '#b48e84', smooth(0, 26, wetEnd(x) + 26 - y) * 0.5);                               // damp where it joins the wet
  return mix(c, '#5c4664', k * 0.3 + Math.pow(Math.abs(x - 800) / 800, 2.4) * 0.3);            // darker toward us and at the two sides
};
p.fill({ inside: (x, y) => y > wetEnd(x), bounds: [0, 770, W, 900], width: 8, length: 90, spacing: 0.5, angle: level, color: dry, stroke });
p.fill({ inside: (x, y) => y > wetEnd(x), bounds: [0, 880, W, H], width: 13, length: 150, spacing: 0.5, angle: level, color: dry, stroke });
p.fill({ inside: (x, y) => y > wetEnd(x) + 6, bounds: [0, 780, W, H], width: 7, length: 120, spacing: 1.1, overlap: 0.7, angle: level, color: (x, y) => dry(x + r.range(-60, 60), y + r.range(-3, 3)), stroke: { ...stroke, opacity: 0.7, taper: [0.3, 0.3] } });   // the ridges again, finer, so that they run into each other

// The tracks of the two of them, up the sand from where we stand.
for (const [x0, y0, F, step] of [[888, 996, PIPLUP, 15], [1094, 998, CHIMCHAR, 17]]) {
  for (let y = y0, k = 0; y > F.y + 26; k++) {
    const t = (y0 - y) / (y0 - F.y), x = x0 + (F.x - x0) * t + (k % 2 ? 1 : -1) * (13 - 5 * t), s = 1.25 - 0.45 * t;
    p.tryStroke({ ...stroke, color: '#6f546e', width: 7 * s, opacity: 0.55, cap: 'round', points: [[x - 9 * s, y], [x + 9 * s, y + 0.5]] });
    p.tryStroke({ color: '#ffe6bc', width: 4, opacity: 0.5, points: [[x - 8 * s, y + 5 * s], [x + 8 * s, y + 5 * s]].map(([px, py]) => [px + (px < x ? -1 : 1) * Math.max(0, 6.2 - 8 * s), py]) });
    y -= step * s * 1.5;
  }
}

// The rocks. Each is a few round masses of stone, dark toward us, with the sun on the side that faces it.
const stone = { shadow: '#372a40', half: '#66495a', lit: '#bf8468', rim: '#ffd6a2', bounce: '#57497a' };
const o = { light: SUNLIGHT, turn: 0.3, width: 9, length: 46, vary: 0.08, dash: 40, gap: 14, edgeOpacity: 0.8 };
for (const [x, y, w] of [[60, 800, 150], [230, 820, 90], [1330, 808, 70]]) p.stroke({ brush: 'soft', color: '#3c2c44', width: 44, opacity: 0.4, points: [[x - w, y + 10], [x, y + 16], [x + w, y + 10]] });   // their shade on the sand
// the rocks at the left: masses of different heights, the far ones first. Their beds of stone lie on a slant, and the strokes go with them.
const beds = (x, y) => 0.42 + (nB(x / 80, y / 80) - 0.5) * 0.5;
solid(p, [[36, 800, 92], [30, 694, 72]], stone, { ...o, flow: beds, length: 40 });
solid(p, [[96, 700, 34], [112, 664, 26]], stone, { ...o, flow: beds, length: 26 });
solid(p, [[150, 806, 82], [156, 724, 64]], stone, { ...o, flow: beds, length: 40 });
solid(p, [[214, 760, 30], [226, 734, 22]], stone, { ...o, flow: beds, length: 24 });
solid(p, [[250, 812, 62], [266, 766, 48]], stone, { ...o, flow: beds, length: 34 });
solid(p, [[70, 836, 52], [160, 842, 44]], stone, { ...o, flow: beds, length: 34 });
solid(p, [[1296, 778, 42], [1362, 782, 34]], stone, { ...o, flow: beds, length: 28, width: 8 });
for (let k = 0; k < 26; k++) {                                           // cracks and ledges in them
  const big = r() < 0.8, x = big ? r.range(-10, 280) : r.range(1270, 1380), y = big ? r.range(660, 830) : r.range(760, 806), len = r.range(26, 64);
  p.tryStroke({ ...stroke, color: '#241a2c', width: r.range(5, 8), opacity: 0.45, taper: [0.2, 0.5], points: [[x, y], [x + len * 0.5, y + len * 0.2 + r.range(-3, 5)], [x + len, y + len * 0.42 + r.range(-3, 6)]] });
}
for (const [x0, x1, y] of [[10, 300, 826], [1270, 1392, 812]]) for (let k = 0; k < 9; k++) {   // the wet at their feet
  const x = r.range(x0, x1), len = r.range(40, 90);
  p.tryStroke({ ...stroke, color: mix('#4c3a50', '#8c6c70', r()), width: r.range(6, 9), opacity: 0.6, points: [[x, y + r.range(-4, 8)], [x + len, y + r.range(-4, 8)]] });
}

p.save();
