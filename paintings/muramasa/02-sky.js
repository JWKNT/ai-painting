// The sky: night, with stars where it is dark; the great moon, low enough to look huge, with
// its grey seas; the mountain at the edge of the world, against the last red; and thin bars
// of cloud that the red is on from below.
'use strict';
const { studio, open, W, HORIZON, MOON, FUJI, skyColor, glowOf, after, nB, nC } = require('./scene');
const { mix, shift, clamp, smooth, through, glow, orb } = studio;

const p = open('sky');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.25, dry: 0.04, rag: 0.3, cap: 'round' };
const level = (x, y) => (nB(x / 300, y / 140) - 0.5) * 0.2 - 0.02;
p.fill({ bounds: [0, 0, W, HORIZON + 16], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: level, color: (x, y) => shift(skyColor(x, Math.min(y, HORIZON)), r.range(-3, 3), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { ...line, opacity: 0.93 } });
p.fill({ bounds: [0, 0, W, HORIZON + 16], width: 18, length: 150, spacing: 0.9, overlap: 0.7, angle: level, color: (x, y) => shift(skyColor(x + r.range(-30, 30), Math.min(y + r.range(-12, 12), HORIZON)), r.range(-4, 4), r.range(-0.02, 0.04), r.range(-0.012, 0.014)), stroke: { ...line, opacity: 0.75 } });

// Stars: each a short level touch of light in a soft glow. There are none near the moon, and few low down.
for (let k = 0; k < 170; k++) {
  const x = r.range(10, W - 10), y = r.range(10, 470);
  if (glowOf(x, y, MOON.x, MOON.y, 330) > 0.2 || r() > 1 - y / 620) continue;
  const b = Math.pow(r(), 2.4);
  p.tryStroke({ brush: 'soft', color: '#aabcff', width: 9, opacity: 0.1 + 0.24 * b, points: [[x - 9.6, y], [x + 9.6, y]] });
  p.tryStroke({ brush: 'round', color: mix('#a8baff', '#ffffff', b), width: 4, opacity: 0.2 + 0.6 * b, points: [[x - 6.2, y], [x + 6.2, y]] });
}

// The moon: its light in the air, then the moon itself, with its grey seas.
for (const [w, op, n] of [[460, 0.06, 4], [300, 0.09, 5], [200, 0.12, 6]]) glow(p, MOON.x, MOON.y, w, '#aab8f4', op, n);
const sea = (x, y) => smooth(0.52, 0.62, nC((x - MOON.x) / 90 + 3, (y - MOON.y) / 80 + 7)) * 0.5 + smooth(0.6, 0.7, nB((x - MOON.x) / 40, (y - MOON.y) / 40)) * 0.2;
orb(p, [[MOON.x, MOON.y, MOON.r]], (x, y) => { const d = Math.hypot(x - MOON.x, y - MOON.y) / MOON.r; return mix(mix('#f8f6ea', '#9ca0c0', sea(x, y)), '#c8cce8', smooth(0.7, 1, d) * 0.5); }, { width: 11, reach: 60, turnAt: [MOON.x - 70, MOON.y - 80] });
for (let i = 0; i < 26; i++) p.tryStroke({ brush: 'round', color: '#fffdf4', width: 4.4, opacity: 0.7, points: studio.arc(MOON.x, MOON.y, MOON.r - 2, -2.9 + i * 0.13, -2.9 + (i + 0.9) * 0.13, 4) });   // its bright upper left edge

// The mountain: a wide cone with a flat top, far off, dark against the red. The moon is on the snow of its left side.
{
  const top = (x) => { const d = Math.abs(x - FUJI.x); return d < 26 ? FUJI.top + 3 * (nB(x / 9, 2) - 0.5) : FUJI.top + (HORIZON + 30 - FUJI.top) * Math.pow((d - 26) / FUJI.half, 0.82); };
  const rock = (x, y) => { const left = clamp((FUJI.x - x) / FUJI.half + 0.3, 0, 1), snow = smooth(FUJI.top + 44 + 20 * nC(x / 30, 5), FUJI.top + 4, y); return mix(mix(mix('#14102c', '#241c44', nB(x / 40, y / 16)), '#d0d4f4', snow * (0.25 + 0.6 * left)), '#a03048', (1 - left) * 0.35 * smooth(HORIZON, FUJI.top, y) + 0.1); };
  p.fill({ inside: (x, y) => y > top(x) && y < HORIZON + 14, bounds: [FUJI.x - FUJI.half - 60, FUJI.top - 4, FUJI.x + FUJI.half + 60, HORIZON + 14], width: 6, length: 34, spacing: 0.5, angle: (x) => clamp((x - FUJI.x) / 60, -1, 1) * 0.42 + r.range(-0.1, 0.1), color: rock, stroke: { ...line, mix: 0.1, opacity: 0.96 } });
  for (const s of [-1, 1]) for (let k = 0; k < 5; k++) { const x0 = FUJI.x + s * r.range(6, 40), y0 = FUJI.top + r.range(4, 14), len = r.range(40, 76); p.tryStroke({ brush: 'round', color: s < 0 ? '#eef0ff' : '#c87088', width: 4, opacity: s < 0 ? 0.7 : 0.4, taper: [0, 0.7], points: [[x0, y0], [x0 + s * len * 0.5, y0 + len * 0.42], [x0 + s * len, y0 + len * 0.8]] }); }   // the long hollows that run down from its top
}

// Thin bars of cloud low in the sky: dark, with the red of the day on their under sides.
for (let k = 0; k < 13; k++) {
  const x = r.range(520, W + 100), y = r.range(470, 626), len = r.range(160, 460), w = r.range(7, 15), g = after(x, y);
  p.tryStroke({ ...line, color: mix('#1c1640', '#3c2458', r()), width: w, opacity: 0.85, taper: [0.5, 0.5], points: [[x - len / 2, y], [x, y - r.range(0, 5)], [x + len / 2, y + r.range(-2, 3)]] });
  p.tryStroke({ ...line, color: mix('#c84058', '#ff9a50', g), width: Math.max(4.8, w * 0.5), opacity: 0.3 + 0.5 * g, taper: [0.5, 0.5], points: [[x - len * 0.42, y + w * 0.4], [x, y + w * 0.4 - r.range(0, 4)], [x + len * 0.42, y + w * 0.4]] });
}
p.save();
