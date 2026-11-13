// The water of the harbor: small waves far off, long slow ones near us. It holds the red
// and the gold of the sky, and it is dark toward us. The road of light from where the sun
// went down comes across it to the foot of the picture.
'use strict';
const { studio, open, W, H, HORIZON, depthOf, sunPath, seaColor, glow, nB, nC } = require('./scene');
const { mix, clamp } = studio;

const p = open('sea');
const r = p.rng;

// One face of a wave: lighter if it tilts to the sky and darker if it tilts away, and gold where the road of light crosses it.
function facet(x, y) {
  const d = depthOf(y), tilt = nB(x / (14 + 80 * d), y / (4 + 15 * d));
  let c = seaColor(x, y);
  c = mix(c, tilt > 0.5 ? mix('#c86c84', '#ffa070', clamp(glow(x, HORIZON, 800), 0, 1)) : '#1c0e2c', Math.abs(tilt - 0.5) * (0.55 + 0.4 * d));
  const s = sunPath(x, y) * (0.45 + 1.1 * nC(x / (10 + 44 * d), y / 5));
  return mix(c, mix('#ff8a44', '#fff0b0', clamp(s, 0, 1)), clamp(s * 1.05, 0, 1));
}
for (let y = HORIZON + 3; y < H + 14;) {
  const d = depthOf(y), h = 2.8 + 21 * Math.pow(d, 1.15);
  for (let x = -30 + r.range(0, 30); x < W + 30;) {
    const len = Math.max(2.3 * (h + 1.5), (18 + 100 * d) * r.range(0.55, 1.5)), lift = (0.4 + 6 * d * d) * r.range(-0.3, 1), yy = y + r.range(-0.3, 0.3) * h, peak = r.range(0.3, 0.7);
    p.tryStroke({ brush: 'bristle', color: facet(x + len / 2, yy), width: Math.max(4.6, h + 1.5), mix: 0.14, dry: 0.04, rag: 0.25, cap: 'round', streak: 0.3, jitter: 0.5, taper: [0.25, 0.25], points: [[x, yy + lift * 0.5], [x + len * peak, yy - lift * 0.5], [x + len, yy + lift * 0.5]] });
    x += len * r.range(0.8, 0.98);
  }
  y += h * 0.82;
}
// The line where the sea meets the sky.
for (let x = -40; x < W; x += 260) p.stroke({ brush: 'soft', color: mix('#ff9c70', '#fff0b0', clamp(glow(x + 150, HORIZON, 520), 0, 1)), width: 14, opacity: 0.4, points: [[x, HORIZON + 1], [x + 150, HORIZON], [x + 300, HORIZON + 1]] });

p.save();
