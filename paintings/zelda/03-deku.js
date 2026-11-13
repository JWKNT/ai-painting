// The Great Deku Tree. Its trunk fills the back of the glade and goes up out of the picture;
// its roots run out to either side like the ridges of hills. The bark is deeply furrowed and
// green with moss. High on the trunk, half lost in the mist, are the heavy brows, the long
// nose and the hanging moustache of its face. Its crown is in blossom.
'use strict';
const { studio, open, SUNWARD, GROUND, shaft, mist, far, sun, nB, nC } = require('./scene');
const { mix, wave, clamp, solid, ramp } = studio;

const p = open('deku');
const r = p.rng;
const D = 0.36;                                                         // how far off it stands
const bark = { shadow: far('#14221a', 800, 400, D), half: far('#33442e', 800, 400, D), lit: far('#7c8a56', 800, 400, D), rim: far('#e2e4a0', 800, 400, D * 0.5), bounce: far('#1c3a34', 800, 400, D) };
const o = { light: SUNWARD, turn: 0.1, width: 9, length: 70, vary: 0.08, dash: 40, gap: 20, edgeOpacity: 0.5 };

// The trunk.
solid(p, [[800, -120, 236], [800, 220, 252], [800, 470, 276], [800, 640, 300]], bark, { ...o, length: 90, width: 11 });
// The furrows of the bark, and the moss on the side that the light finds.
for (let k = 0; k < 150; k++) {
  const x = 800 + r.range(-1, 1) * 268, y = r.range(-20, 620), len = r.range(60, 190), wob = r.range(-10, 10);
  if (Math.abs(x - 800) > 240 + y * 0.09) continue;
  p.tryStroke({ brush: 'bristle', color: far(r() < 0.7 ? '#0b1711' : '#55663e', x, y, D), width: r.range(5, 10), opacity: r.range(0.35, 0.7), mix: 0.2, dry: 0.1, rag: 0.3, taper: [0.2, 0.4], points: [[x, y], [x + wob, y + len * 0.5], [x + wob * 0.3, y + len]] });
}
for (let k = 0; k < 130; k++) {
  const x = 800 + r.range(-1, 0.5) * 262, y = r.range(60, 660), a = r.range(1.2, 1.9), len = r.range(16, 40);
  if (Math.abs(x - 800) > 240 + y * 0.09 || nC(x / 60, y / 80) < 0.45) continue;
  p.tryStroke({ brush: 'bristle', color: far(sun(mix('#3c6a34', '#6c9a44', r()), x, y, 0.9), x, y, D), width: r.range(7, 13), opacity: 0.8, mix: 0.2, dry: 0.1, rag: 0.4, taper: [0.2, 0.5], points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
}

// Its face, high on the trunk: heavy brows, a long nose, a moustache that hangs to either
// side. They are ridges of the same bark, and the mist takes most of them: they are only a
// little lighter above and darker beneath than the trunk they grow from.
const quiet = { ...bark, lit: far('#5c6c48', 800, 400, D + 0.1), rim: undefined };
const ridge = (pts, extra = {}) => solid(p, pts, quiet, { ...o, turn: 0.3, length: 40, width: 8, ...extra });
for (const x of [738, 862]) p.stroke({ brush: 'soft', color: far('#101e16', x, 330, D), width: 40, opacity: 0.4, points: [[x - 42, 332], [x, 324], [x + 42, 332]] });   // the eyes, deep under the brows
ridge([[694, 292, 18], [744, 280, 22], [784, 294, 16]]);                 // the brows
ridge([[906, 292, 18], [856, 280, 22], [816, 294, 16]]);
ridge([[800, 296, 15], [800, 350, 20], [800, 392, 25]]);                 // the nose
p.stroke({ brush: 'soft', color: far('#101e16', 800, 470, D), width: 40, opacity: 0.4, points: [[750, 474], [800, 482], [850, 474]] });   // the mouth, in shadow
ridge([[800, 426, 22], [744, 440, 22], [700, 478, 17], [680, 524, 10]]);  // the moustache
ridge([[800, 426, 22], [856, 440, 22], [900, 478, 17], [920, 524, 10]]);
for (let k = 0; k < 6; k++) {                                            // mist across it
  const x = r.range(560, 860), y = r.range(260, 520), len = r.range(160, 300);
  p.stroke({ brush: 'soft', color: mist(x + len / 2, y), width: r.range(40, 70), opacity: r.range(0.12, 0.2), points: wave(x, y, x + len, y + r.range(-8, 8), 5, 1, 7) });
}

// The roots: each leaves the foot of the trunk as thick as a man, runs out over the ground
// in long bends, gets thinner, forks, and goes under. There is shade below each where it
// lifts clear of the ground, and moss along the top of it.
const roots = [
  [[640, 596, 46], [560, 640, 38], [470, 672, 30], [372, 690, 22], [280, 720, 15], [200, 728, 9]],
  [[960, 596, 46], [1040, 636, 38], [1130, 676, 30], [1230, 694, 22], [1320, 716, 15], [1400, 730, 9]],
  [[590, 596, 30], [500, 606, 24], [400, 624, 17], [300, 640, 11]], [[1010, 596, 30], [1100, 610, 24], [1200, 622, 17], [1300, 642, 11]],
  [[470, 672, 17], [430, 712, 13], [384, 744, 8]], [[1130, 676, 17], [1176, 714, 13], [1222, 742, 8]],
  [[700, 618, 42], [660, 676, 34], [600, 716, 27], [520, 740, 20], [452, 772, 13]], [[900, 618, 42], [944, 680, 34], [1004, 712, 27], [1082, 744, 20], [1150, 770, 13]],
  [[600, 716, 14], [588, 752, 10], [560, 780, 7]], [[1004, 712, 14], [1020, 750, 10], [1050, 778, 7]],
  [[760, 636, 32], [742, 682, 24], [704, 706, 15]], [[840, 636, 32], [860, 684, 24], [898, 708, 15]],
];
for (const pts of roots) {
  const mid = pts[Math.floor(pts.length / 2)];
  p.tryStroke({ brush: 'soft', color: far('#0c1a14', mid[0], mid[1], D * 0.6), width: Math.max(8.2, pts[0][2] * 0.9), opacity: 0.42, taper: [0, 0.5], points: pts.map(([x, y, rad]) => [x + 4, y + rad * 0.95]) });        // the shade under it
  solid(p, pts, bark, { ...o, length: 44, width: 7.5, turn: 0 });
  for (let k = 0; k < pts.length - 1; k++) {                             // moss along the top of it, in short strokes that run with it
    const [x0, y0, r0] = pts[k], [x1, y1, r1] = pts[k + 1], n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 16));
    for (let q = 0; q < n; q++) {
      const f = (q + r()) / n, x = x0 + (x1 - x0) * f, y = y0 + (y1 - y0) * f, rad = r0 + (r1 - r0) * f, len = Math.max(13, rad * r.range(0.7, 1.2)), a = Math.atan2(y1 - y0, x1 - x0) + r.range(-0.3, 0.3);
      if (rad < 9 && r() < 0.5) continue;
      const mx = x - rad * 0.2 + r.range(-0.3, 0.3) * rad, my = y - rad * r.range(0.45, 0.85);
      p.tryStroke({ brush: 'bristle', color: far(sun(mix('#3f6a30', '#8cb450', r()), mx, my, 0.8), mx, my, D * 0.7), width: Math.max(4.8, Math.min(len / 2.1, rad * 0.5)), opacity: 0.85, mix: 0.15, dry: 0.05, rag: 0.35, cap: 'round', points: [[mx - Math.cos(a) * len / 2, my - Math.sin(a) * len / 2], [mx + Math.cos(a) * len / 2, my + Math.sin(a) * len / 2]] });
    }
  }
}

// Mist at its foot.
for (let k = 0; k < 10; k++) {
  const x = r.range(200, 1100), y = r.range(GROUND - 70, GROUND + 6), len = r.range(220, 420);
  p.stroke({ brush: 'soft', color: mix(mist(x + len / 2, y), '#f4f4c4', clamp(shaft(x + len / 2, y) * 0.8, 0, 1)), width: r.range(30, 56), opacity: r.range(0.14, 0.26), points: wave(x, y, x + len, y + r.range(-5, 5), 4, 1, 7) });
}

// The blossom in its crown, painted flower by flower: clouds of rose and white, deep in
// their hearts and pale toward the light, hanging lower at either side.
const petal = (t) => ramp(['#7a3454', '#b85c80', '#e894b0', '#ffc8d8', '#fff2f2'], t);
for (const [cx, cy, sx, sy, n] of [[560, 90, 170, 54, 420], [1050, 80, 180, 56, 440], [800, 24, 150, 34, 240], [420, 200, 70, 44, 150], [1196, 196, 70, 46, 150], [330, 96, 80, 40, 120], [1290, 92, 80, 40, 120]]) {
  for (let k = 0; k < n; k++) {
    const u = (r() + r() + r() - 1.5) / 1.5, v = (r() + r() + r() - 1.5) / 1.5, x = cx + u * sx * 1.4, y = cy + v * sy * 1.4;
    if (nB(x / 44, y / 36) < 0.34) continue;                              // gaps in it
    const a = r.range(0, 3.14), len = r.range(13, 24), light = clamp(0.5 - u * 0.25 - v * 0.6 + r.range(-0.3, 0.3), 0, 1);
    p.tryStroke({ brush: 'bristle', color: far(mix(petal(light), '#fff8e0', clamp(shaft(x, y), 0, 1) * 0.5 * light), x, y, 0.18), width: r.range(6, 11), opacity: 0.92, taper: [0.2, 0.5], mix: 0.1, dry: 0, rag: 0.2, cap: 'round', points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
  }
}

p.save();
