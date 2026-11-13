// The sky: night, with the moon high at the right behind thin cloud, a few stars at the left
// where the sky is clear, and the mist that the whale brings with it: long banks of it,
// pale on top where the moon is on them.
'use strict';
const { studio, open, W, HORIZON, MOON, skyColor, halo, nB } = require('./scene');
const { mix, shift, ramp, noise2, clamp, wave } = studio;

const p = open('sky');
const r = p.rng;
const level = (x, y) => (nB(x / 300, y / 140) - 0.5) * 0.3 - 0.05;
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: level, color: (x, y) => shift(skyColor(x, y), r.range(-3, 3), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { brush: 'bristle', opacity: 0.92, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 20, length: 150, spacing: 0.9, overlap: 0.7, angle: level, color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-14, 14)), r.range(-4, 4), r.range(-0.02, 0.04), r.range(-0.012, 0.014)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });

// Stars, where the sky is clear: each is a short level touch of light in a soft glow. Most of them are faint.
for (let k = 0; k < 150; k++) {
  const x = r.range(20, W - 20), y = r.range(16, 580);
  if (halo(x, y, 380) > 0.25 || r() > 0.95 - y / 900) continue;
  const b = Math.pow(r(), 2.2);
  p.tryStroke({ brush: 'soft', color: '#aac4ff', width: 9, opacity: 0.12 + 0.26 * b, points: [[x - 9.6, y], [x + 9.6, y]] });
  p.tryStroke({ color: mix('#b8ccff', '#ffffff', b), width: 4, opacity: 0.22 + 0.6 * b, points: [[x - 6.2, y], [x + 6.2, y]] });
}

// The moon: its light in the thin cloud round it, then the moon itself.
for (const [w, o] of [[420, 0.12], [260, 0.16], [140, 0.22]]) p.stroke({ brush: 'soft', color: '#b8ccff', width: w, opacity: o, points: [[MOON.x - w * 1.02, MOON.y + 6], [MOON.x, MOON.y - 6], [MOON.x + w * 1.02, MOON.y + 6]] });
studio.disc(p, MOON.x, MOON.y, MOON.r, '#f6f8ff', 13, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round' });
for (const [dx, dy, len] of [[-12, -8, 26], [8, 10, 22], [-4, 16, 18]]) p.tryStroke({ brush: 'soft', color: '#c8d2ee', width: 11, opacity: 0.4, points: [[MOON.x + dx - len / 2, MOON.y + dy], [MOON.x + dx + len / 2, MOON.y + dy + 3]] });   // the grey places on it
for (let k = 0; k < 7; k++) { const y = MOON.y + r.range(-70, 80), x = MOON.x + r.range(-260, 60), len = r.range(200, 420); p.stroke({ brush: 'soft', color: '#8ca4dc', width: r.range(14, 28), opacity: r.range(0.14, 0.26), points: wave(x, y, x + len, y + r.range(-8, 8), 4, 1, 6) }); }   // the thin cloud across it

// The banks of mist. Each is a long heap, dark and blue below, pale on the side of the moon.
const mist = (t, x, y) => { const k = clamp(halo(x, y, 700) * 1.2, 0, 1); return ramp([mix('#101a38', '#24386c', k), mix('#1c2c58', '#4c68a8', k), mix('#3c5488', '#8cacdc', k), mix('#6c84b4', '#dce8ff', k)], t); };
const toMoon = (x, y) => { const dx = MOON.x - x, dy = MOON.y - y, l = Math.hypot(dx, dy) || 1; return [dx / l * 0.6, dy / l * 0.6 - 0.4]; };
let seed = 0;
for (const [x0, x1, floor, big, tall] of [[720, 1260, 420, 100, 0.8], [1380, 1720, 300, 70, 0.6], [1180, 1700, 540, 90, 0.9], [560, 1100, 600, 70, 0.7], [-100, 300, 640, 60, 0.6], [1000, 1640, 690, 60, 0.5], [300, 760, 700, 44, 0.5]]) {
  const puffs = [], n = noise2(1900 + ++seed);
  for (let x = x0; x < x1; x += big * 0.5) { const hump = Math.pow(Math.sin(Math.PI * clamp((x - x0) / (x1 - x0), 0.03, 0.97)), 0.7), rad = big * r.range(0.5, 1) * (0.4 + 0.75 * hump); puffs.push([x + r.range(-12, 12), floor - rad * 0.6 - big * tall * hump * r.range(0.1, 0.8), rad]); puffs.push([x + r.range(-20, 20), floor - rad * 0.5, rad * r.range(0.8, 1.1)]); }
  studio.mass(p, puffs.filter((q) => q[2] > 10), { light: toMoon, tones: mist, base: floor, bias: 0.4, contrast: 0.7, fall: 0.2, grain: 0.2, mix: 0.4, noise: n, stroke: { rag: 0.5, hardness: 0.4 }, flow: (x, y) => (n(x / 90, y / 40) - 0.5) * 0.6, layers: [[Math.max(12, big * 0.3), big * 1.5, 0.85, big * 0.1, 0.45], [Math.max(8, big * 0.18), big * 0.9, 0.7, big * 0.06, 0.75]] });
}

p.save();
