// The sky and the moon. The night is deep blue and full of stars. The moon is huge, low
// behind the castle, and blue, like glass with a light behind it: paler at its rim, with
// its seas a deeper blue.
'use strict';
const { studio, open, W, FOOT, MOON, skyColor, moonGlow, nB, nC } = require('./scene');
const { mix, shift, smooth, glow, orb } = studio;

const p = open('sky');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.25, dry: 0.04, rag: 0.3, cap: 'round' };
const level = (x, y) => (nB(x / 300, y / 140) - 0.5) * 0.2;
p.fill({ bounds: [0, 0, W, FOOT + 20], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: level, color: (x, y) => shift(skyColor(x, Math.min(y, FOOT)), r.range(-3, 3), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { ...line, opacity: 0.93 } });
p.fill({ bounds: [0, 0, W, FOOT + 20], width: 18, length: 150, spacing: 0.9, overlap: 0.7, angle: level, color: (x, y) => shift(skyColor(x + r.range(-30, 30), Math.min(y + r.range(-12, 12), FOOT)), r.range(-4, 4), r.range(-0.02, 0.04), r.range(-0.012, 0.014)), stroke: { ...line, opacity: 0.75 } });

// Stars: each a short level touch of light in a soft glow. Most are faint. There are none in the light round the moon.
for (let k = 0; k < 330; k++) {
  const x = r.range(8, W - 8), y = r.range(8, 620);
  if (Math.hypot(x - MOON.x, y - MOON.y) < MOON.r + 40 || r() > 1.05 - y / 700) continue;
  const b = Math.pow(r(), 2.6);
  p.tryStroke({ brush: 'soft', color: '#a0b8ff', width: 9, opacity: 0.08 + 0.26 * b, points: [[x - 9.6, y], [x + 9.6, y]] });
  p.tryStroke({ brush: 'round', color: mix('#9cb4ff', '#ffffff', b), width: 4, opacity: 0.18 + 0.7 * b, points: [[x - 6.2, y], [x + 6.2, y]] });
}

// The moon. Its light in the air round it; then the moon itself; then the pale line of its rim.
for (const [w, op, n] of [[420, 0.05, 4], [300, 0.06, 5]]) glow(p, MOON.x, MOON.y, w, '#5c84e8', op, n);
const sea = (x, y) => smooth(0.46, 0.66, nC((x - MOON.x) / 170 + 3, (y - MOON.y) / 150 + 7)) * 0.55 + smooth(0.5, 0.74, nB((x - MOON.x) / 70, (y - MOON.y) / 70)) * 0.2;
const face = (x, y) => { const d = Math.hypot(x - MOON.x, y - MOON.y) / MOON.r; return mix(mix(mix('#c4dcff', '#7ca8f0', sea(x, y)), '#eef6ff', smooth(0.78, 1, d) * 0.6), '#a8c8fc', smooth(0.5, 0, d) * 0.2); };
p.fill({ inside: (x, y) => Math.hypot(x - MOON.x, y - MOON.y) < MOON.r - 4, bounds: [MOON.x - MOON.r, MOON.y - MOON.r, MOON.x + MOON.r, MOON.y + MOON.r], width: 16, length: 110, spacing: 0.5, overlap: 0.6, angle: (x, y) => (nC(x / 260, y / 260) - 0.5) * 5, color: face, stroke: { ...line, mix: 0.3, opacity: 0.96 } });
p.fill({ inside: (x, y) => Math.hypot(x - MOON.x, y - MOON.y) < MOON.r - 4, bounds: [MOON.x - MOON.r, MOON.y - MOON.r, MOON.x + MOON.r, MOON.y + MOON.r], width: 8, length: 60, spacing: 0.9, overlap: 0.7, angle: (x, y) => (nC(x / 260, y / 260) - 0.5) * 5, color: (x, y) => face(x + r.range(-8, 8), y + r.range(-8, 8)), stroke: { ...line, mix: 0.3, opacity: 0.8 } });
for (let i = 0; i < 70; i++) { const a0 = i / 70 * Math.PI * 2; p.tryStroke({ ...line, mix: 0.1, rag: 0.1, color: mix('#dceaff', '#ffffff', r()), width: 7, opacity: 0.55, points: studio.arc(MOON.x, MOON.y, MOON.r - 4, a0, a0 + Math.PI * 2 / 70 * 1.2, 5) }); }
for (let i = 0; i < 40; i++) { const a0 = i / 40 * Math.PI * 2; p.tryStroke({ brush: 'soft', color: '#8cb0ff', width: 20, opacity: 0.14, points: studio.arc(MOON.x, MOON.y, MOON.r + 8, a0, a0 + Math.PI * 2 / 40 * 1.3, 5) }); }

p.save();
