// The Great Deku Tree. Its trunk fills the back of the glade and goes up out of the picture;
// its roots run out to either side like the ridges of hills. The bark is deeply furrowed and
// green with moss. High on the trunk, half lost in the mist, are the heavy brows, the long
// nose and the hanging moustache of its face. Its crown is in blossom.
'use strict';
const { studio, open, SUNWARD, GROUND, shaft, mist, far, sun, nB, nC } = require('./scene');
const { mix, wave, clamp, solid, glint, ramp } = studio;

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

// The roots: they leave the trunk well above the ground and go down into it, curving.
for (const pts of [
  [[610, 560, 86], [488, 632, 60], [392, 690, 40], [316, 736, 24]], [[990, 560, 86], [1112, 632, 60], [1208, 690, 40], [1284, 736, 24]],
  [[700, 610, 66], [634, 690, 46], [590, 752, 28]], [[900, 610, 66], [966, 690, 46], [1010, 752, 28]],
  [[520, 610, 40], [430, 640, 28], [330, 668, 18], [240, 700, 12]], [[1080, 610, 40], [1170, 640, 28], [1270, 668, 18], [1360, 700, 12]],
]) {
  solid(p, pts, bark, { ...o, length: 60, width: 9 });
  glint(p, pts.map(([x, y, rad]) => [x - rad * 0.3, y - rad * 0.86]), () => far(sun(mix('#4c7a36', '#96b856', r()), pts[1][0], pts[1][1], 0.8), pts[1][0], pts[1][1], D * 0.7), { width: 7, dash: 36, gap: 14, opacity: 0.8, rng: r });   // moss along their tops
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
