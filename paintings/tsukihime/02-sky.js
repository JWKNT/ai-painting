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

// Stars: each a small touch of light. Most are faint; only the bright ones have a soft glow. There are none in the light round the moon.
for (let k = 0; k < 260; k++) {
  const x = r.range(8, W - 8), y = r.range(8, 620);
  if (Math.hypot(x - MOON.x, y - MOON.y) < MOON.r + 40 || r() > 1.05 - y / 700) continue;
  const b = Math.pow(r(), 2.8);
  if (b > 0.42) p.tryStroke({ brush: 'soft', color: '#a0b8ff', width: 9, opacity: 0.06 + 0.24 * b, points: [[x - 9.6, y], [x + 9.6, y]] });
  p.tryStroke({ brush: 'round', color: mix('#8ca4f0', '#ffffff', b), width: 4, opacity: 0.2 + 0.72 * b, taper: [0.55, 0.55], points: [[x - 6.2, y], [x + 6.2, y]] });
}

// The moon. Its light in the air round it; then the moon itself; then the pale line of its rim.
for (const [w, op, n] of [[420, 0.05, 4], [300, 0.06, 5]]) glow(p, MOON.x, MOON.y, w, '#5c84e8', op, n);
const sea = (x, y) => smooth(0.46, 0.66, nC((x - MOON.x) / 170 + 3, (y - MOON.y) / 150 + 7)) * 0.55 + smooth(0.5, 0.74, nB((x - MOON.x) / 70, (y - MOON.y) / 70)) * 0.2;
const face = (x, y) => { const d = Math.hypot(x - MOON.x, y - MOON.y) / MOON.r; return mix(mix(mix('#c4dcff', '#7ca8f0', sea(x, y)), '#eef6ff', smooth(0.78, 1, d) * 0.6), '#a8c8fc', smooth(0.5, 0, d) * 0.2); };
p.fill({ inside: (x, y) => Math.hypot(x - MOON.x, y - MOON.y) < MOON.r - 4, bounds: [MOON.x - MOON.r, MOON.y - MOON.r, MOON.x + MOON.r, MOON.y + MOON.r], width: 16, length: 110, spacing: 0.5, overlap: 0.6, angle: (x, y) => (nC(x / 260, y / 260) - 0.5) * 5, color: face, stroke: { ...line, mix: 0.3, opacity: 0.96 } });
p.fill({ inside: (x, y) => Math.hypot(x - MOON.x, y - MOON.y) < MOON.r - 4, bounds: [MOON.x - MOON.r, MOON.y - MOON.r, MOON.x + MOON.r, MOON.y + MOON.r], width: 8, length: 60, spacing: 0.9, overlap: 0.7, angle: (x, y) => (nC(x / 260, y / 260) - 0.5) * 5, color: (x, y) => face(x + r.range(-8, 8), y + r.range(-8, 8)), stroke: { ...line, mix: 0.3, opacity: 0.8 } });
for (let i = 0; i < 70; i++) { const a0 = i / 70 * Math.PI * 2; p.tryStroke({ ...line, mix: 0.1, rag: 0.1, color: mix('#dceaff', '#ffffff', r()), width: 7, opacity: 0.55, points: studio.arc(MOON.x, MOON.y, MOON.r - 4, a0, a0 + Math.PI * 2 / 70 * 1.2, 5) }); }
for (let i = 0; i < 40; i++) { const a0 = i / 40 * Math.PI * 2; p.tryStroke({ brush: 'soft', color: '#8cb0ff', width: 20, opacity: 0.14, points: studio.arc(MOON.x, MOON.y, MOON.r + 8, a0, a0 + Math.PI * 2 / 40 * 1.3, 5) }); }

// Thin cloud of the night, drawn out long. Near the moon it is pale with its light, and a little of it lies across the moon's lower part.
for (const [dx, dy, len, w, a] of [[-560, 40, 520, 30, 0.05], [-380, 150, 620, 24, -0.04], [300, 120, 640, 28, 0.06], [420, -60, 500, 22, 0.03], [-200, 206, 560, 20, 0.02], [120, 226, 600, 18, -0.03], [-700, -120, 480, 26, 0.04], [560, 240, 520, 22, -0.02]]) {
  const x0 = MOON.x + dx, y0 = MOON.y + dy, near = Math.exp(-Math.pow(Math.hypot(dx + len / 2, dy * 1.6) / 420, 2)), pts = []; for (let t = 0; t <= 1.001; t += 0.2) pts.push([x0 + len * t, y0 + len * t * a + 12 * Math.sin(t * 3 + dx)]);
  p.stroke({ brush: 'soft', color: mix('#3c5cc0', '#d0e2ff', near), width: w, opacity: 0.08 + 0.1 * near, taper: [0.5, 0.6], points: pts });
  p.tryStroke({ brush: 'soft', color: mix('#5c7cd8', '#f0f6ff', near), width: Math.max(8.6, w * 0.4), opacity: 0.08 + 0.12 * near, taper: [0.6, 0.7], points: pts.slice(1, 5).map(([x, y]) => [x, y - w * 0.2]) });
}

p.save();
