// The bubbles. They come up from the mouths of the Krabby, small, and the wind off the land
// takes them out over the sea; the ones that have come near to us are big. Each is a film:
// we see its edge all round, in the colors that a film of soap has, with the sun bright in
// the side of it that is toward the sun, a window of light high on its other side, and only
// a breath of color across the middle of it.
'use strict';
const { studio, open, SUN } = require('./scene');
const { mix, clamp, arc } = studio;

const p = open('bubbles');
const r = p.rng;
const film = ['#fff4f8', '#c4f2ff', '#ffe9a6', '#dcc6ff', '#ffc8e0', '#c8ffe4'];

function bubble(x, y, R, strength = 1) {
  const toSun = Math.atan2(SUN.y - y, SUN.x - x), w = clamp(R * 0.1, 4, 6);
  // the breath of color across it
  if (R >= 12) p.tryStroke({ brush: 'soft', color: mix('#ffd6e8', '#c6f0ff', r()), width: Math.max(8.2, R * 0.9), opacity: 0.1 * strength, points: [[x - R * 0.95, y + R * 0.1], [x + R * 0.95, y - R * 0.1]] });
  if (R >= 24) p.tryStroke({ brush: 'soft', color: '#fff6ee', width: R * 0.7, opacity: 0.1 * strength, points: [[x - R * 0.2, y - R * 0.8], [x + R * 0.1, y + R * 0.75]] });
  // Its edge: it goes all the way round with no break. It is in lengths that lie over one
  // another at their ends, each a color of the film, brightest on the side of the sun and
  // faint on the side away from it.
  const n = clamp(Math.round(R / 5), 3, 10), turn = r.range(0, 6.283);
  for (let i = 0; i < n; i++) {
    const a0 = turn + i / n * 6.283 - 0.12, a1 = turn + (i + 1) / n * 6.283 + 0.12, sunward = Math.cos((a0 + a1) / 2 - toSun);
    const color = sunward > 0.5 ? mix('#ffe2a0', '#fffbe6', r()) : film[Math.floor(r() * film.length)];
    p.tryStroke({ color, width: w, opacity: clamp((0.3 + 0.24 * (1 + sunward)) * strength, 0, 1), taper: [0.3, 0.3], points: arc(x, y, R - w / 2, a0, a1, 8) });
  }
  // The light on it: a soft shine high on the side away from the sun, bent to its curve, and a smaller one low on the side of the sun.
  if (R >= 22) {
    p.tryStroke({ brush: 'soft', color: '#ffffff', width: clamp(R * 0.22, 8.2, 14), opacity: 0.5 * strength, taper: [0.4, 0.4], points: arc(x, y, R * 0.62, toSun + 2.25, toSun + 3.3, 7) });
    if (R >= 36) p.tryStroke({ brush: 'soft', color: '#fff0c8', width: 8.4, opacity: 0.4 * strength, taper: [0.4, 0.4], points: arc(x, y, R * 0.66, toSun - 0.5, toSun + 0.3, 6) });
  }
}

// From each Krabby: a string of them, close together and small at its mouth, wider apart and bigger as they go.
const all = [];
for (const [mx, my, dx, dy] of [[108, 588, 620, -330], [212, 632, 760, -250], [316, 700, 700, -120], [1286, 708, -420, -300]]) {
  for (let k = 0; k < 15; k++) {
    const t = Math.pow((k + r.range(0.2, 1)) / 15, 1.25);
    all.push([mx + dx * t + r.range(-1, 1) * (10 + 110 * t), my + dy * t - 60 * Math.sin(t * 3.1) + r.range(-1, 1) * (8 + 70 * t), (7 + 22 * t) * r.range(0.75, 1.3), 1]);
  }
}
// Others that have gone far out over the sea, small, and a few that have come close to us, big.
for (let k = 0; k < 16; k++) all.push([r.range(420, 1500), r.range(120, 500), r.range(7, 13), 0.75]);
for (const [x, y, R] of [[246, 286, 58], [508, 176, 42], [1350, 238, 50], [704, 392, 34], [1492, 628, 62], [160, 904, 74], [1188, 92, 38], [860, 250, 28], [612, 620, 30], [1250, 430, 30]]) all.push([x, y, R, 1]);
// Small ones first, so that the big ones are in front; none over the two partners.
all.sort((a, b) => a[2] - b[2]);
for (const [x, y, R, s] of all) {
  if (Math.hypot(x - 995, (y - 716) * 0.85) < 170 + R || Math.hypot(x - SUN.x, y - SUN.y) < SUN.r + R * 0.6) continue;
  bubble(x, y, R, s);
}

p.save();
