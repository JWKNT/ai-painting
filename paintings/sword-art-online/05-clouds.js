// The sea of clouds: heap behind heap of cumulus from the horizon to our feet. The sun is
// low beyond them, so each heap is violet in its body and takes the light along its top and
// on the side toward the sun; the farthest are almost lost in the glare.
'use strict';
const { studio, open, W, glow, toSun, skyColor } = require('./scene');
const { mix, clamp, ramp, mass, wave, noise2 } = studio;

const p = open('clouds');
const r = p.rng;

// Thin veils of cloud drifting in front of the castle, so it stands far off.
for (const [x, y, len, tilt] of [[520, 372, 330, 0.03], [880, 300, 260, -0.04], [600, 250, 200, 0.02], [930, 400, 240, 0.02]]) {
  for (let k = 0; k < 5; k++) {
    const yy = y + r.range(-10, 10), x0 = x + r.range(-0.2, 0.2) * len, span = len * r.range(0.5, 1);
    p.stroke({ brush: 'bristle', color: mix(skyColor(x0 + span / 2, yy), '#fff2e0', 0.3), width: r.range(8, 14), opacity: r.range(0.14, 0.3), mix: 0.3, dry: 0.1, rag: 0.4, taper: [0.5, 0.5], points: wave(x0, yy, x0 + span, yy + tilt * span, 3, 1.2, 7) });
  }
}

// One rank of cloud: a row of low domes rising out of a level floor, higher where the air
// has piled them up. It is painted in level strokes, like a sea; the light picks out the
// tops. `far` runs from 1 at the horizon to 0 at our feet.
function rank(base, rmin, rmax, far, seed) {
  const n = noise2(seed), mean = (rmin + rmax) / 2, puffs = [];
  for (let x = -rmax; x < W + rmax; x += mean * r.range(0.5, 0.85)) {
    const pile = n(x / (mean * 5), seed), rad = r.range(rmin, rmax) * (0.8 + 0.4 * pile);
    puffs.push([x, base + rad * (0.6 - 0.8 * pile), rad]);              // most of each dome is below the floor
    if (pile > 0.62) puffs.push([x + r.range(-0.5, 0.5) * rad, base - rad * (0.25 + 0.6 * pile), rad * r.range(0.45, 0.65)]);
  }
  const tones = (t, x, y) => {
    const g = clamp(glow(x, y, 440) * 1.3, 0, 1);
    let c = ramp(['#453e80', '#665696', '#a276a4', '#ee9c88', '#ffdca4'], t);
    c = mix(c, mix('#a98aa8', '#ffcc90', g), far * 0.62);                   // distance takes the darks away
    return mix(c, '#fff2c8', g * 0.45 * t);
  };
  const m = mass(p, puffs, { light: toSun, tones, base, bias: 0.4, contrast: 0.75, fall: 0.25, grain: 0.2, mix: 0.35, noise: n, stroke: { hardness: 0.6, rag: 0.3 },
    flow: (x, y) => (n(x / (mean * 3) + 5, y / (mean * 1.5)) - 0.5) * 1.1,
    layers: [[Math.max(8, mean * 0.3), mean * 1.6, 0.95, Math.max(3.5, mean * 0.14), 0.42], [Math.max(6, mean * 0.17), mean * 0.9, 0.85, Math.max(2.5, mean * 0.09), 0.7]] });
  // the sun on the tops: short strokes along the upper edge of each dome that stands clear, on the side that faces it
  for (const [cx, cy, rad] of puffs) {
    for (let k = 0; k < 3; k++) {
      const [lx, ly] = toSun(cx, cy), a = Math.atan2(ly, lx) + r.range(-0.9, 0.9), ax = Math.cos(a), ay = Math.sin(a);
      const x = cx + ax * (rad - 4), y = cy + ay * (rad - 4);
      if (ay > -0.15 || y > base - 6 || m.inside(0)(cx + ax * (rad + 6), cy + ay * (rad + 6))) continue;      // only the top, and only where it is the outline
      const span = clamp(rad * r.range(0.35, 0.7), 14, 80) / rad, w = clamp(rad * 0.16, 5, 13), g = clamp(glow(x, y, 440) * 1.3, 0, 1);
      const pts = [];
      for (let i = 0; i <= 4; i++) { const b = a + (i / 4 - 0.5) * span; pts.push([cx + Math.cos(b) * (rad - w * 0.6), cy + Math.sin(b) * (rad - w * 0.6)]); }
      p.tryStroke({ brush: 'bristle', color: mix(mix('#f0a08c', '#ffc89c', r()), '#ffecc0', g * 0.8), width: w, opacity: r.range(0.3, 0.5) + 0.25 * g, mix: 0.45, dry: 0.05, rag: 0.4, hardness: 0.7, taper: [0.5, 0.5], points: pts });
    }
  }
  // a clean brush drawn along the rank, so the strokes melt into cloud
  for (let k = 0; k < 3 + Math.round(3 * (1 - far)); k++) {
    const x = r.range(-80, W - 300), len = r.range(300, 620), y = base - mean * r.range(0.05, 0.4);
    p.tryStroke({ brush: 'blend', width: Math.max(14, mean * 0.5), opacity: 0.35, points: wave(x, y, x + len, y + r.range(-8, 8), mean * 0.15, r.range(1, 2.5), 10) });
  }
  // mist lying in the hollows in front of the rank, warm beneath the sun
  for (let k = 0; k < 8; k++) {
    const x = r.range(-100, W - 200), len = r.range(260, 520), y = base + r.range(-4, 12), g = clamp(glow(x + len / 2, y, 460) * 1.4, 0, 1);
    p.stroke({ brush: 'soft', color: mix(mix('#5c5296', '#8a70a4', r()), '#ffcf96', g), width: r.range(20, 34) * (1.6 - far), opacity: r.range(0.1, 0.2) + 0.1 * g, points: wave(x, y, x + len, y + r.range(-6, 6), 4, 1, 7) });
  }
}
rank(664, 24, 42, 1, 71);
// Where the first pieces have gone into the cloud, it is thrown up in pale bursts.
for (const [x, y, h] of [[624, 664, 46], [770, 668, 60], [906, 662, 44], [540, 662, 36]]) {
  for (let k = 0; k < 3; k++) p.tryStroke({ brush: 'soft', color: mix('#e8c0c0', '#fff0d4', glow(x, y, 380)), width: r.range(16, 24), opacity: r.range(0.16, 0.28), taper: [0.1, 0.7], points: [[x + r.range(-14, 14), y], [x + r.range(-18, 18), y - h * 0.5], [x + r.range(-24, 24), y - h * r.range(0.8, 1.1)]] });
}
rank(692, 34, 58, 0.82, 72);
rank(732, 48, 80, 0.62, 73);
rank(790, 66, 108, 0.42, 74);
rank(868, 90, 140, 0.22, 75);
rank(990, 120, 180, 0.04, 76);

p.save();
