// The ruins of Zanarkand. Far off, along the edge of the world, the towers of the city stand
// in the last of the light, and the broken shell of the stadium with them. Between them and
// us is the water that has come in over the city, bright where the sun goes down. Nearer,
// towers stand in the water and lean; and nearest, at the left, a great round tower has
// fallen half over, and two of the great ribs stand up beside it against the sky.
'use strict';
const { studio, open, W, GLOW, SHORE, far, ridge, waterColor, tower, rib, glow } = require('./scene');
const { mix, clamp, wave } = studio;

const p = open('ruins');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.03, rag: 0.15, cap: 'round' };

// Shapes of towers. A beehive: wide at the foot, with a round top. A jar: narrow at the foot, wide in the middle.
const hive = (w) => [[0, w], [0.5, w * 0.92], [0.8, w * 0.62], [1, w * 0.16]];
const jar = (w) => [[0, w * 0.7], [0.3, w], [0.7, w * 0.86], [0.9, w * 0.5], [1, w * 0.2]];
const drum = (w) => [[0, w], [0.9, w * 0.94], [1, w * 0.8]];

// ---------------------------------------------------------------- the far city
for (const [x, w, h, kind, cap] of [[24, 16, 60, hive, 14], [90, 12, 44, jar, 0], [182, 20, 78, hive, 20], [250, 11, 40, drum, 0], [330, 15, 56, jar, 12], [420, 12, 40, hive, 10],
  [748, 13, 52, hive, 14], [806, 18, 84, jar, 22], [860, 10, 40, drum, 0], [1010, 12, 50, hive, 12], [1064, 20, 96, hive, 26], [1126, 13, 56, jar, 0], [1190, 16, 70, hive, 16], [1262, 11, 44, drum, 0], [1330, 18, 80, jar, 18], [1410, 13, 52, hive, 12], [1480, 16, 64, hive, 14], [1560, 12, 46, jar, 0]]) {
  tower(p, [x, SHORE + 4], [x + r.range(-0.12, 0.12) * h, SHORE + 4 - h], kind(w), 0.66, { ribs: Math.round(h / 26), cap, broken: !cap });
}
// The stadium: a great round shell, broken open. What is left of it is its ribs, which go up and over, and the rings that tie them.
{
  const cx = 566, base = SHORE + 6, R = 150, d = 0.56, tint = (c, k = 1) => far(c, cx, base - 60, d * k);
  for (let k = 0; k < 9; k++) {
    const a0 = Math.PI + 0.05, f = (k + 0.5) / 9, top = Math.PI + (0.5 + 0.8 * Math.abs(f - 0.5)) + r.range(-0.1, 0.1), x0 = cx - R + 2 * R * f;
    const pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8 * (k % 3 === 1 ? 0.6 : 1); pts.push([x0 + (cx - x0) * t * 0.9, base - R * 0.86 * Math.sin(Math.PI / 2 * t) * (0.7 + 0.5 * Math.sin(Math.PI * f))]); }
    p.tryStroke({ ...line, color: tint('#1a1016'), width: 7.5, taper: [0, 0.5], points: pts });
    p.tryStroke({ color: tint('#f09a50', 0.5), width: 4, opacity: 0.6, taper: [0, 0.5], points: pts.map(([x, y]) => [x + 3, y - 1]) });
  }
  for (const [k, half] of [[0.3, 140], [0.58, 118], [0.8, 84]]) p.tryStroke({ ...line, color: tint('#1a1016'), width: 6, opacity: 0.9, points: [[cx - half, base - R * k], [cx - half * 0.3, base - R * k - 8], [cx + half * 0.5, base - R * k - 5]] });
  p.tryStroke({ ...line, cap: 'flat', color: tint('#160e14'), width: 22, points: [[cx - R - 6, base - 8], [cx, base - 12], [cx + R + 6, base - 8]] });   // the wall at the foot of it
}
// The light of the sun through the air of the city, along the edge of the world.
for (let k = 0; k < 8; k++) { const x = r.range(-100, W - 300), len = r.range(300, 600); p.stroke({ brush: 'soft', color: mix('#ffb860', '#fff0b0', clamp(glow(x + len / 2, SHORE, 500), 0, 1)), width: r.range(20, 36), opacity: r.range(0.14, 0.26), points: wave(x, SHORE - r.range(0, 26), x + len, SHORE - r.range(0, 26), 2, 1, 6) }); }

// ---------------------------------------------------------------- the water
p.fill({ inside: (x, y) => y > SHORE && y < ridge(x) + 10, bounds: [0, SHORE, W, 680], width: 6, length: 80, spacing: 0.5, angle: () => r.range(-0.02, 0.02), color: waterColor, stroke: { brush: 'bristle', opacity: 0.95, mix: 0.18, dry: 0.04, rag: 0.25 } });
p.fill({ inside: (x, y) => y > SHORE + 30 && y < ridge(x) + 10, bounds: [0, SHORE + 30, W, 680], width: 10, length: 130, spacing: 0.6, angle: () => r.range(-0.02, 0.02), color: (x, y) => waterColor(x + r.range(-60, 60), y), stroke: { brush: 'bristle', opacity: 0.8, mix: 0.2, dry: 0.04, rag: 0.3 } });
for (let k = 0; k < 40; k++) {                                           // the road of the sun on it: short bright strokes, thick under the sun and thin toward us
  const y = SHORE + 3 + Math.pow(r(), 1.6) * 130, half = 30 + (y - SHORE) * 2.2, x = GLOW.x + r.gauss() * half * 0.5, len = r.range(20, 70);
  if (y < ridge(x) - 4) p.tryStroke({ ...line, color: mix('#ffd070', '#fffbe0', r()), width: r.range(4.8, 7), opacity: r.range(0.5, 0.95), rag: 0.3, taper: [0.3, 0.3], points: [[x - len / 2, y], [x + len / 2, y + r.range(-1, 1)]] });
}

// ---------------------------------------------------------------- the towers that stand in the water
for (const [x, foot, w, h, kind, lean, d, o] of [
  [730, 478, 26, 104, hive, 0.1, 0.44, { windows: [0.3, 0.55], cap: 26 }], [1150, 474, 24, 92, jar, -0.14, 0.44, { windows: [0.4], broken: true }], [1250, 486, 30, 120, hive, 0.06, 0.4, { windows: [0.28, 0.5], cap: 30 }],
  [846, 500, 34, 86, drum, -0.2, 0.36, { windows: [0.5], broken: true }], [1010, 506, 20, 60, hive, 0.3, 0.38, { cap: 16 }], [640, 520, 40, 150, jar, 0.16, 0.3, { windows: [0.3, 0.52, 0.72], broken: true }],
]) tower(p, [x, foot], [x + lean * h, foot - h], kind(w), d, { ...o, water: foot });
// Pieces of the roads of the city, which went through the air: a length of one still stands on its piers.
{
  const tint = (c) => far(c, 980, 520, 0.34);
  p.tryStroke({ ...line, cap: 'flat', color: tint('#180e14'), width: 13, points: [[900, 540], [1000, 528], [1100, 536]] });
  p.tryStroke({ color: tint('#f09a50'), width: 4, opacity: 0.7, points: [[904, 532], [1000, 520], [1096, 528]] });
  for (const x of [920, 1000, 1080]) p.tryStroke({ ...line, cap: 'flat', color: tint('#180e14'), width: 9, points: [[x, 536], [x + r.range(-3, 3), 566]] });
  p.tryStroke({ ...line, cap: 'flat', color: tint('#180e14'), width: 12, points: [[1100, 536], [1150, 560], [1176, 590]] });   // the end of it, which has fallen
}

// ---------------------------------------------------------------- the great tower that has fallen half over, and the two ribs
tower(p, [150, 660], [262, 396], [[0, 132], [0.18, 138], [0.6, 120], [0.84, 84], [1, 40]], 0.16, { ribs: 6, windows: [0.2, 0.42, 0.64], cap: 0, broken: true });
tower(p, [420, 640], [398, 500], [[0, 60], [0.5, 56], [0.86, 40], [1, 12]], 0.2, { ribs: 3, windows: [0.36], cap: 30 });
rib(p, [[330, 650], [352, 560], [392, 460], [450, 360], [520, 280], [584, 232]], [26, 25, 22, 18, 12, 5], 0.14);
rib(p, [[560, 630], [566, 560], [584, 486], [614, 418], [650, 366]], [17, 16, 14, 10, 4.6], 0.2);
rib(p, [[40, 660], [26, 560], [34, 470], [66, 388], [112, 330]], [20, 19, 16, 11, 5], 0.2);
// Haze about their feet, where the water is.
for (let k = 0; k < 7; k++) { const x = r.range(-80, 700), y = r.range(590, 640), len = r.range(200, 400); p.stroke({ brush: 'soft', color: far('#c8704c', x + len / 2, y, 0.3), width: r.range(24, 40), opacity: r.range(0.1, 0.18), points: wave(x, y, x + len, y + r.range(-4, 4), 3, 1, 6) }); }

p.save();
