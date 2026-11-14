// The sky and the moon. It is night, clear, with a few thin clouds that the moon lights
// at their edges. The moon is full and very great, low enough to be behind the place
// where the spider hangs: pale, a little yellow, with its grey seas. Far off is a line of
// mountains, and nearer, at each side, the black wall of a wood of cedars.
'use strict';
const { studio, open, W, GROUND, MOON, skyColor, moonAir, nA, nB, nC } = require('./scene');
const { mix, shift, smooth, glow, through } = studio;

const p = open('sky');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.28, dry: 0.04, rag: 0.3, cap: 'round' };
const flow = (x, y) => (nB(x / 340, y / 160) - 0.5) * 0.3;
p.fill({ bounds: [0, 0, W, GROUND + 14], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: flow, color: (x, y) => shift(skyColor(x, Math.min(y, GROUND)), r.range(-2, 2), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { ...line, opacity: 0.93 } });
p.fill({ bounds: [0, 0, W, GROUND + 14], width: 20, length: 160, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-30, 30), Math.min(y + r.range(-12, 12), GROUND)), r.range(-3, 3), r.range(-0.02, 0.04), r.range(-0.012, 0.014)), stroke: { ...line, opacity: 0.72 } });
// stars, where the sky is dark: small touches
for (let k = 0; k < 90; k++) { const x = r.range(10, W - 10), y = r.range(10, 520); if (moonAir(x, y, 460) > 0.25 || r() > 1 - y / 700) continue; const b = Math.pow(r(), 2.4); p.tryStroke({ brush: 'round', color: mix('#8ca4e8', '#ffffff', b), width: 4, opacity: 0.2 + 0.6 * b, taper: [0.6, 0.6], points: [[x - 6.2, y], [x + 6.2, y]] }); }

// ---------------------------------------------------------------- the moon
{ const { x: mx, y: my, r: R } = MOON;
  for (const [w, op, n] of [[R * 2.0, 0.05, 5], [R * 1.5, 0.07, 6]]) glow(p, mx, my, w, '#7c98e0', op, n);
  const face = (x, y) => { const sea = smooth(0.46, 0.66, nC((x - mx) / 170 + 3, (y - my) / 150 + 7)) * 0.6 + smooth(0.5, 0.74, nB((x - mx) / 70, (y - my) / 70)) * 0.2, d = Math.hypot(x - mx, y - my) / R; return mix(mix(mix('#f6f0d4', '#b8b4a8', sea), '#fffbe8', smooth(0.8, 1, d) * 0.6), '#d8d4c0', smooth(0.5, 0, d) * 0.14); };
  p.fill({ inside: (x, y) => Math.hypot(x - mx, y - my) < R - 4, bounds: [mx - R, my - R, mx + R, my + R], width: 16, length: 110, spacing: 0.5, overlap: 0.6, angle: (x, y) => (nC(x / 260, y / 260) - 0.5) * 5, color: face, stroke: { ...line, mix: 0.3, opacity: 0.96 } });
  p.fill({ inside: (x, y) => Math.hypot(x - mx, y - my) < R - 4, bounds: [mx - R, my - R, mx + R, my + R], width: 8, length: 60, spacing: 0.9, overlap: 0.7, angle: (x, y) => (nC(x / 260, y / 260) - 0.5) * 5, color: (x, y) => face(x + r.range(-8, 8), y + r.range(-8, 8)), stroke: { ...line, mix: 0.3, opacity: 0.8 } });
  for (let i = 0; i < 70; i++) { const a0 = i / 70 * Math.PI * 2; p.tryStroke({ ...line, mix: 0.1, rag: 0.1, color: mix('#fff4d0', '#ffffff', r()), width: 7, opacity: 0.55, points: studio.arc(mx, my, R - 4, a0, a0 + Math.PI * 2 / 70 * 1.2, 5) }); } }

// ---------------------------------------------------------------- thin clouds, lit at their edges
for (let k = 0; k < 9; k++) { const x = r.range(-100, W - 300), y = r.range(60, 600), len = r.range(300, 680), w = r.range(14, 26), near = moonAir(x + len / 2, y, 600); p.stroke({ brush: 'soft', color: mix('#1c2c5c', '#8ca0d0', near), width: w * 1.6, opacity: 0.3, taper: [0.5, 0.5], points: [[x, y], [x + len / 2, y - r.range(0, 10)], [x + len, y + r.range(-4, 4)]] }); p.tryStroke({ brush: 'soft', color: mix('#5c74b0', '#e8ecff', near), width: 9, opacity: 0.2 + 0.4 * near, taper: [0.6, 0.6], points: [[x + len * 0.1, y - w * 0.5], [x + len / 2, y - w * 0.5 - r.range(0, 10)], [x + len * 0.9, y - w * 0.5]] }); }

// ---------------------------------------------------------------- the far mountains, and the wood of cedars at each side
{ const top = through([[-20, 700], [160, 668], [330, 706], [520, 690], [700, 716], [900, 720], [1080, 700], [1260, 712], [1440, 676], [1620, 700]]);
  p.fill({ inside: (x, y) => y > top(x) + 4 * (nC(x / 30, 3) - 0.5) && y < GROUND + 10, bounds: [0, 650, W, GROUND + 10], width: 7, length: 50, spacing: 0.5, angle: () => r.range(-0.1, 0.1), color: (x, y) => mix('#0c1838', '#1c3468', moonAir(x, y, 700) * 0.8), stroke: { ...line, opacity: 0.95 } }); }
// the cedars: each a tall dark point; they stand close, and they are higher toward the edges of the picture
for (let k = 0; k < 90; k++) { const side = k % 2 ? 1 : -1, t = Math.pow(r(), 1.3), x = side < 0 ? t * 430 - 20 : W + 20 - t * 430, h = (160 + 300 * (1 - t)) * r.range(0.7, 1.1), w = h * r.range(0.1, 0.15), y = GROUND + r.range(-10, 14), c = mix('#03050e', '#0a1228', r() * (0.3 + 0.7 * t));
  p.tryStroke({ ...line, mix: 0.04, rag: 0.4, color: c, width: Math.max(8, w), taper: [0, 0.9], points: [[x, y], [x + r.range(-3, 3), y - h * 0.5], [x + r.range(-4, 4), y - h]] });
  p.tryStroke({ ...line, mix: 0.04, rag: 0.5, color: c, width: Math.max(8, w * 1.7), taper: [0.2, 0.7], points: [[x, y + 4], [x, y - h * 0.3], [x, y - h * 0.56]] }); }
void nA; void MOON;

p.save();
