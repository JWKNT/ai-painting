// The sky: night coming down from above, rose and red below it, and the gold where the sun
// went down; long clouds, dark, with fire along their under sides.
'use strict';
const { studio, open, W, HORIZON, SUN, skyColor, glow, nB } = require('./scene');
const { mix, shift, ramp, noise2, clamp } = studio;

const p = open('sky');
const r = p.rng;
const flow = (x, y) => { const k = glow(x, y, 460); let a = Math.atan2(x - SUN.x, -1.4 * (y - SUN.y)); if (a > Math.PI / 2) a -= Math.PI; else if (a < -Math.PI / 2) a += Math.PI; return a * k * 0.7 + (nB(x / 300, y / 140) - 0.5) * 0.3 * (1 - k); };
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: flow, color: (x, y) => shift(skyColor(x, y), r.range(-3, 3), r.range(-0.03, 0.03), r.range(-0.012, 0.012)), stroke: { brush: 'bristle', opacity: 0.92, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 20, length: 150, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-14, 14)), r.range(-4, 4), r.range(-0.02, 0.04), r.range(-0.014, 0.016)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });

// The last of the sun: its glow along the sea.
for (const [w, o] of [[460, 0.14], [260, 0.2], [130, 0.3]]) p.stroke({ brush: 'soft', color: '#fff0a8', width: w, opacity: o, points: [[SUN.x - w * 1.3, SUN.y - 8], [SUN.x, SUN.y - 22], [SUN.x + w * 1.3, SUN.y - 8]] });

// The clouds: long, level, in bars. Each is dark above and has the red of the sun along its under side.
const cloud = (t, x, y) => { const k = clamp(glow(x, y, 700) * 1.25, 0, 1); return ramp([mix('#2c2658', '#5c2c5c', k), mix('#4c3c78', '#983c5c', k), mix('#a05c8c', '#f0704c', k), mix('#f0a0a8', '#ffd070', k)], t); };
const under = (x, y) => { const dx = SUN.x - x, dy = SUN.y + 120 - y, l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
let seed = 0;
for (const [x0, x1, y, big] of [[-60, 520, 150, 40], [380, 1040, 96, 30], [980, 1680, 176, 44], [-40, 400, 330, 30], [1160, 1640, 356, 32], [300, 760, 250, 22], [880, 1300, 286, 22], [-60, 300, 468, 22], [1300, 1680, 484, 22], [520, 720, 420, 13], [900, 1120, 440, 12]]) {
  const puffs = [], n = noise2(700 + ++seed);
  for (let x = x0; x < x1; x += big * 0.8) { const hump = Math.sin(Math.PI * clamp((x - x0) / (x1 - x0), 0.03, 0.97)); puffs.push([x + r.range(-8, 8), y + r.range(-big * 0.25, big * 0.25), big * r.range(0.6, 1.05) * (0.45 + 0.7 * hump)]); }
  studio.mass(p, puffs.filter((q) => q[2] > 7), { light: under, tones: cloud, bias: 0.4, contrast: 0.8, grain: 0.2, mix: 0.3, noise: n, stroke: { rag: 0.5, hardness: 0.5, taper: [0.45, 0.45], cap: 'round' }, flow: (x, yy) => (n(x / 70, yy / 30) - 0.5) * 0.3, layers: [[Math.max(9, big * 0.5), big * 3.4, 0.9, big * 0.14, 0.4], [Math.max(6, big * 0.28), big * 2.2, 0.8, big * 0.08, 0.7]] });
}

p.save();
