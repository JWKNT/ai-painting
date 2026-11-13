// The sky: heavy banks of cloud, dark above and lit with fire from below, with the last of
// the sun in a band under them.
'use strict';
const { studio, open, W, HORIZON, GLOW, skyColor, glow, nB } = require('./scene');
const { mix, shift, ramp, noise2, clamp } = studio;

const p = open('sky');
const r = p.rng;
const flow = (x, y) => { const k = glow(x, y, 480); let a = Math.atan2(x - GLOW.x, -1.6 * (y - GLOW.y)); if (a > Math.PI / 2) a -= Math.PI; else if (a < -Math.PI / 2) a += Math.PI; return a * k * 0.6 + (nB(x / 300, y / 140) - 0.5) * 0.3 * (1 - k); };
p.fill({ bounds: [0, 0, W, HORIZON + 30], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: flow, color: (x, y) => shift(skyColor(x, y), r.range(-3, 3), r.range(-0.03, 0.03), r.range(-0.012, 0.012)), stroke: { brush: 'bristle', opacity: 0.92, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, HORIZON + 30], width: 20, length: 150, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-14, 14)), r.range(-4, 4), r.range(-0.02, 0.04), r.range(-0.014, 0.016)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });

// The last of the sun: its glow along the edge of the world.
for (const [w, o] of [[420, 0.14], [240, 0.2], [120, 0.3]]) p.stroke({ brush: 'soft', color: '#fff0a8', width: w, opacity: o, points: [[GLOW.x - w * 1.5, GLOW.y - 4], [GLOW.x, GLOW.y - 18], [GLOW.x + w * 1.5, GLOW.y - 4]] });

// The clouds: great banks, dark as slate and violet above, with the fire of the sun on their under sides. The high ones are the biggest and the darkest.
const cloud = (t, x, y) => { const k = clamp(glow(x, y, 760) * 1.3 + (y - 120) / 900, 0, 1); return ramp([mix('#12121e', '#3c1c24', k), mix('#262434', '#8c3424', k), mix('#4a3c4c', '#e8702c', k), mix('#7c6c7c', '#ffcc68', k)], t); };
const under = (x, y) => { const dx = GLOW.x - x, dy = GLOW.y + 120 - y, l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
let seed = 0;
for (const [x0, x1, y, big] of [[-120, 760, 70, 96], [560, 1500, 40, 110], [1180, 1760, 130, 90], [-100, 520, 200, 70], [380, 1000, 176, 60], [1000, 1700, 250, 64], [-80, 420, 318, 40], [320, 700, 286, 34], [1200, 1700, 350, 34], [640, 900, 332, 22], [940, 1200, 362, 18], [-60, 300, 392, 20]]) {
  const puffs = [], n = noise2(1700 + ++seed);
  for (let x = x0; x < x1; x += big * 0.62) { const hump = Math.sin(Math.PI * clamp((x - x0) / (x1 - x0), 0.03, 0.97)); puffs.push([x + r.range(-10, 10), y + r.range(-big * 0.3, big * 0.3), big * r.range(0.6, 1.05) * (0.45 + 0.7 * hump)]); if (r() < 0.5) puffs.push([x + r.range(-big, big) * 0.5, y + big * r.range(0.1, 0.5), big * r.range(0.4, 0.7) * (0.45 + 0.7 * hump)]); }
  studio.mass(p, puffs.filter((q) => q[2] > 8), { light: under, tones: cloud, bias: 0.36, contrast: 0.85, grain: 0.24, mix: 0.3, noise: n, stroke: { rag: 0.5, hardness: 0.5, taper: [0.4, 0.4], cap: 'round' }, flow: (x, yy) => (n(x / 80, yy / 40) - 0.5) * 0.5, layers: [[Math.max(9, big * 0.34), big * 2.2, 0.92, big * 0.12, 0.42], [Math.max(6, big * 0.2), big * 1.4, 0.8, big * 0.07, 0.72]] });
}

p.save();
