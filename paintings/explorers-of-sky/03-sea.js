// The sea: wave behind wave from the horizon to the sand, small and close together far off,
// longer near us. It is green and blue with the rose of the sky in it, and the sun lays a
// road of gold down the middle of it. At the edge it is thin and pale over the sand, and
// the last wave leaves a line of foam.
'use strict';
const { studio, open, W, HORIZON, nB, nC, glow, skyColor, shore, depthOf, sunPath } = require('./scene');
const { mix, clamp, smooth, glint } = studio;

const p = open('sea');
const r = p.rng;

function sea(x, y) {
  const d = depthOf(x, y);
  let c = mix(mix('#62b2a8', '#3a8a9c', smooth(0, 0.5, d)), '#3f7c8e', smooth(0.5, 1, d));
  c = mix(c, skyColor(x, HORIZON - 60 - 300 * d), 0.36 - 0.1 * d);                             // the sky in it
  return mix(c, '#c8d0a8', smooth(0.86, 1, d) * 0.55);                                         // thin over the sand at its edge
}
// One face of a wave: lighter if it tilts to the sky, darker if it tilts away, and gold where the road of the sun crosses it.
function facet(x, y) {
  const d = depthOf(x, y), tilt = nB(x / (14 + 70 * d), y / (4 + 14 * d));
  let c = sea(x, y);
  c = mix(c, tilt > 0.5 ? mix('#a8dccc', '#ffc4b4', clamp(glow(x, HORIZON, 700), 0, 1)) : '#1f4d6a', Math.abs(tilt - 0.5) * (0.5 + 0.4 * d));
  const s = sunPath(x, y) * (0.5 + 1.0 * nC(x / (10 + 40 * d), y / 5));
  return mix(c, mix('#ffb060', '#fff4c0', clamp(s, 0, 1)), clamp(s * 1.05, 0, 1));
}
for (let y = HORIZON + 3; y < 772;) {
  const d = clamp((y - HORIZON) / 210, 0, 1), h = 2.8 + 15 * Math.pow(d, 1.15);
  for (let x = -30 + r.range(0, 30); x < W + 30;) {
    const len = Math.max(2.3 * (h + 1.5), (18 + 84 * d) * r.range(0.55, 1.5)), lift = (0.4 + 5 * d * d) * r.range(-0.3, 1), yy = y + r.range(-0.3, 0.3) * h, peak = r.range(0.3, 0.7);
    if (yy < shore(x + len / 2) + 2) p.tryStroke({ brush: 'bristle', color: facet(x + len / 2, yy), width: Math.max(4.6, h + 1.5), mix: 0.14, dry: 0.04, rag: 0.25, cap: 'round', streak: 0.3, jitter: 0.5, taper: [0.25, 0.25], points: [[x, yy + lift * 0.5], [x + len * peak, yy - lift * 0.5], [x + len, yy + lift * 0.5]] });
    x += len * r.range(0.8, 0.98);
  }
  y += h * 0.82;
}
// The line where the sea meets the sky, in the haze of the evening.
for (let x = -40; x < W; x += 260) p.stroke({ brush: 'soft', color: mix('#ffc8b0', '#fff0c0', clamp(glow(x + 150, HORIZON, 500), 0, 1)), width: 16, opacity: 0.3, points: [[x, HORIZON + 1], [x + 150, HORIZON], [x + 300, HORIZON + 1]] });

// Foam: the edge of the last wave on the sand, and the wave behind it.
for (const [back, width, op] of [[30, 7, 0.6], [12, 6, 0.75], [0, 8, 0.95]]) {
  const pts = [];
  for (let x = -20; x <= W + 20; x += 14) pts.push([x, shore(x) - back + 5 * Math.sin(x / 37 + back) + 3 * (nC(x / 30, back) - 0.5)]);
  glint(p, pts, () => mix('#fff8f0', '#ffd8d0', r()), { width, dash: back ? 70 : 110, gap: back ? 34 : 10, opacity: op, rng: r });
}
for (let k = 0; k < 40; k++) {                                           // the thin sheet of water that runs back down the sand behind the foam
  const x = r.range(0, W), y = shore(x) - r.range(4, 26), len = r.range(40, 110);
  p.tryStroke({ brush: 'bristle', color: mix('#d8e4d0', '#ffe2c4', r()), width: r.range(5, 8), opacity: 0.4, mix: 0.3, dry: 0.1, rag: 0.4, taper: [0.3, 0.3], points: [[x, y], [x + len, y + r.range(-3, 3)]] });
}

p.save();
