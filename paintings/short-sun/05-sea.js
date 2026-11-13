// The sea of Blue: wave behind wave from the horizon to our feet, small and close together
// far off and long and slow near us. It is dark, with the sky's colors in it. The sun lays a
// road of gold across it and Green a narrower one of pale green. The wind takes the tops off
// the nearer waves.
'use strict';
const { studio, open, W, H, HORIZON, SUN, depthOf, sunPath, greenPath, seaColor, glow, nA, nB, nC } = require('./scene');
const { mix, clamp } = studio;

const p = open('sea');
const r = p.rng;

// The color of one facet of a wave: the sea's own color, lighter if it tilts to the sky and
// darker if it tilts away, and bright where one of the two roads of light crosses it.
function facet(x, y) {
  const d = depthOf(y), tilt = nB(x / (14 + 70 * d), y / (4 + 14 * d));
  let c = seaColor(x, y);
  c = mix(c, tilt > 0.5 ? mix('#3c6c8c', '#7c6a94', clamp(glow(x, HORIZON, 700), 0, 1)) : '#04121e', Math.abs(tilt - 0.5) * (0.5 + 0.4 * d));
  const s = sunPath(x, y) * (0.5 + 1.0 * nC(x / (10 + 40 * d), y / 5));
  c = mix(c, mix('#ff9a4c', '#ffe8a8', clamp(s, 0, 1)), clamp(s * 1.05, 0, 1));
  const g = greenPath(x, y) * (0.3 + 1.2 * nC(x / (10 + 40 * d) + 9, y / 5));
  return mix(c, '#7ce0a0', clamp(g, 0, 0.75));
}
// Wave behind wave: each row is a line of short strokes, every stroke a little arched like the back of a wave.
for (let y = HORIZON + 3; y < H + 14;) {
  const d = depthOf(y), h = 2.8 + 21 * Math.pow(d, 1.15);
  for (let x = -30 + r.range(0, 30); x < W + 30;) {
    const len = Math.max(2.3 * (h + 1.5), (18 + 96 * d) * r.range(0.55, 1.5)), lift = (0.4 + 7 * d * d) * r.range(-0.3, 1), yy = y + r.range(-0.3, 0.3) * h, peak = r.range(0.3, 0.7);
    p.tryStroke({ brush: 'bristle', color: facet(x + len / 2, yy), width: Math.max(4.6, h + 1.5), mix: 0.14, dry: 0.04, rag: 0.25, cap: 'round', streak: 0.3, jitter: 0.5, taper: [0.25, 0.25], points: [[x, yy + lift * 0.5], [x + len * peak, yy - lift * 0.5], [x + len, yy + lift * 0.5]] });
    x += len * r.range(0.8, 0.98);
  }
  y += h * 0.8;
}

// The swells: a few long ridges of water coming toward us, each with a dark hollow in front
// of it and a paler back.
for (const [y0, amp, phase] of [[700, 6, 0.4], [748, 9, 2.1], [806, 12, 4.0], [872, 16, 1.2], [946, 20, 3.3]]) {
  const d = depthOf(y0), at = (x, lift) => [x, y0 + lift + amp * Math.sin(x / (150 + 260 * d) + phase) + amp * 0.5 * Math.sin(x / 67 + phase * 2)];
  for (let x = -40; x < W; x += 150 + 200 * d) {
    const len = (160 + 260 * d) * r.range(0.8, 1.2);
    if (r() < 0.25) continue;
    p.tryStroke({ brush: 'bristle', color: '#04101c', width: 6 + 14 * d, opacity: 0.4, mix: 0.3, dry: 0.08, rag: 0.4, taper: [0.5, 0.5], points: [at(x, 8 + 12 * d), at(x + len / 2, 8 + 12 * d), at(x + len, 8 + 12 * d)] });
    const mx = x + len / 2, lit = sunPath(mx, y0) > 0.15;
    p.tryStroke({ brush: 'bristle', color: lit ? mix('#ffb060', '#fff0c0', r()) : mix('#3c6884', '#6c8cac', r()), width: 4.6 + 5 * d, opacity: lit ? 0.75 : 0.4, mix: 0.3, dry: 0.1, rag: 0.4, taper: [0.5, 0.5], points: [at(x, 0), at(mx, 0), at(x + len, 0)] });
  }
}

// The road of gold: its brightest flecks, thick near the sun and scattered near us.
for (let k = 0; k < 360; k++) {
  const y = HORIZON + 4 + Math.pow(r(), 1.7) * (H - HORIZON), d = depthOf(y), mid = SUN.x - d * 150, half = 12 + d * 210, x = mid + (r() + r() - 1) * half;
  const len = Math.max(12.4, (10 + 60 * d) * r.range(0.5, 1.2));
  p.tryStroke({ color: mix('#ffd890', '#fffbe8', r()), width: 4 + 3 * d * r(), opacity: r.range(0.45, 0.95) * (1 - 0.35 * d), taper: [0.3, 0.3], points: [[x - len / 2, y], [x, y - 1 - 2 * d], [x + len / 2, y]] });
}
// And the road of Green.
for (let k = 0; k < 110; k++) {
  const y = HORIZON + 4 + Math.pow(r(), 1.5) * (H - HORIZON), d = depthOf(y), mid = 372 + d * 40, half = 16 + d * 150, x = mid + (r() + r() - 1) * half;
  const len = Math.max(12.4, (10 + 50 * d) * r.range(0.5, 1.2));
  p.tryStroke({ color: mix('#6cd898', '#d4ffe0', r()), width: 4 + 2 * d * r(), opacity: r.range(0.25, 0.6) * (1 - 0.4 * d), taper: [0.3, 0.3], points: [[x - len / 2, y], [x, y - 1 - 2 * d], [x + len / 2, y]] });
}

// Foam: the wind takes the tops off the nearer waves, and drags them out in ragged streaks.
for (let k = 0; k < 60; k++) {
  const y = 720 + Math.pow(r(), 0.8) * 280, d = depthOf(y), x = r.range(0, W);
  if (nA(x / 200, y / 60) < 0.52) continue;
  const len = (18 + 40 * d) * r.range(0.6, 1.2), slope = r.range(-0.06, 0.02);
  p.tryStroke({ brush: 'dry', color: mix(mix('#6c88ac', '#b4c8e0', r()), '#ffd8a0', clamp(sunPath(x, y) * 2 + glow(x, y, 500) * 0.4, 0, 0.8)), width: 4.6 + 3 * d * r(), opacity: r.range(0.22, 0.5), load: 0, dry: 0.6, rag: 0.7, points: [[x, y], [x + len * 0.5, y + slope * len * 0.5], [x + len, y + slope * len]] });
}

p.save();
