// The clouds. We are above most of them: a floor of cloud lies along the bottom of the
// picture, and two towers of it stand up out of the floor, white where the light strikes
// them and blue in their shadows.
'use strict';
const { studio, open, W, SUNWARD, far } = require('./scene');
const { mix, clamp, ramp, mass, wave, noise2 } = studio;

const p = open('clouds');
const r = p.rng;
const tone = (t) => ramp(['#6f8ed0', '#a6bfe8', '#dfeafa', '#ffffff', '#fffcf0'], t);

// A heap of cloud: rounded parts, painted in level strokes and then softened with a clean brush.
function heap(puffs, base, d, seed) {
  const n = noise2(seed), mean = puffs.reduce((s, q) => s + q[2], 0) / puffs.length;
  const m = mass(p, puffs, { light: SUNWARD, tones: (t, x, y) => far(tone(t), x, y, d), base, bias: 0.5, contrast: 0.62, fall: 0.3, grain: 0.16, mix: 0.35, noise: n, stroke: { hardness: 0.55, rag: 0.35 },
    flow: (x, y) => (n(x / (mean * 2.4) + 3, y / (mean * 1.3)) - 0.5) * 1.3,
    layers: [[Math.max(9, mean * 0.34), mean * 1.5, 0.95, Math.max(4, mean * 0.15), 0.42], [Math.max(6, mean * 0.18), mean * 0.85, 0.85, Math.max(3, mean * 0.09), 0.7]] });
  // the light on the tops: short strokes along the upper edges that face it
  for (const [cx, cy, rad] of puffs) {
    for (let k = 0; k < 3; k++) {
      const a = Math.atan2(SUNWARD[1], SUNWARD[0]) + r.range(-1, 1), ax = Math.cos(a), ay = Math.sin(a), x = cx + ax * (rad - 4), y = cy + ay * (rad - 4);
      if (y > base - 6 || m.inside(0)(cx + ax * (rad + 7), cy + ay * (rad + 7))) continue;          // only where it is the outline
      const span = clamp(rad * r.range(0.4, 0.8), 16, 90) / rad, w = clamp(rad * 0.2, 5, 16), pts = [];
      for (let i = 0; i <= 4; i++) { const b = a + (i / 4 - 0.5) * span; pts.push([cx + Math.cos(b) * (rad - w * 0.6), cy + Math.sin(b) * (rad - w * 0.6)]); }
      p.tryStroke({ brush: 'bristle', color: far(mix('#ffffff', '#fff8e2', r()), x, y, d), width: w, opacity: r.range(0.6, 0.9), mix: 0.35, dry: 0.05, rag: 0.4, hardness: 0.7, taper: [0.5, 0.5], points: pts });
    }
  }
  for (const [cx, cy, rad] of puffs) if (r() < 0.7) p.tryStroke({ brush: 'blend', width: Math.max(12, rad * 0.7), opacity: 0.4, points: [[cx - rad * 0.7, cy + rad * 0.1], [cx, cy + rad * 0.2], [cx + rad * 0.7, cy + rad * 0.1]] });   // softened
}
// A tower of cloud: wide below, narrow above, bulging to one side and the other as it goes up.
function tower(cx, base, wide, tall, d, seed) {
  const puffs = [], step = wide * 0.15, levels = Math.round(tall / step);
  for (let i = 0; i <= levels; i++) {
    const t = i / levels, y = base - tall * t, half = wide * 0.5 * Math.pow(1 - t, 0.55) + wide * 0.03, lean = wide * 0.14 * Math.sin(t * 4 + seed);
    for (let x = -half; x <= half + 1; x += wide * 0.13) puffs.push([cx + lean + x + r.range(-0.03, 0.03) * wide, y + r.range(-0.03, 0.03) * wide, wide * r.range(0.15, 0.21) * (1 - 0.35 * t)]);
  }
  heap(puffs, base + wide * 0.1, d, seed);
}

// Far off.
tower(1180, 780, 300, 240, 0.5, 11);
tower(360, 700, 260, 190, 0.55, 12);
// The floor of cloud: rows of low domes, the far rows first.
function floor(base, rmin, rmax, d, seed) {
  const n = noise2(seed), puffs = [];
  for (let x = -rmax; x < W + rmax; x += (rmin + rmax) / 2 * r.range(0.5, 0.85)) {
    const pile = n(x / ((rmin + rmax) * 2.5), seed), rad = r.range(rmin, rmax) * (0.8 + 0.4 * pile);
    puffs.push([x, base + rad * (0.55 - 0.8 * pile), rad]);
    if (pile > 0.6) puffs.push([x + r.range(-0.5, 0.5) * rad, base - rad * (0.3 + 0.6 * pile), rad * r.range(0.45, 0.65)]);
  }
  heap(puffs, base + rmax * 0.5, d, seed);
  for (let k = 0; k < 6; k++) {                                          // haze lying in front of the row
    const x = r.range(-100, W - 200), len = r.range(260, 520), y = base + r.range(0, rmax * 0.4);
    p.stroke({ brush: 'soft', color: mix('#c4dcf8', '#ffffff', r()), width: r.range(24, 44), opacity: r.range(0.1, 0.2), points: wave(x, y, x + len, y + r.range(-6, 6), 4, 1, 7) });
  }
}
floor(800, 26, 44, 0.5, 21);
floor(850, 40, 66, 0.36, 22);
// Nearer.
tower(1420, 930, 380, 300, 0.2, 13);
floor(916, 60, 96, 0.2, 23);
floor(1010, 90, 140, 0.06, 24);

p.save();
