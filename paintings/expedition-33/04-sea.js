// The sea, from the edge of the world toward us. It is dark and nearly still. The gold of
// the number lies on it in a broad path, with the dark of the Monolith down the middle of
// that path and the pale of the Paintress beside it; and the ring shows in it as a bow.
'use strict';
const { studio, open, W, HORIZON, NUM, RING, NEAR, skyColor, gold, nA, nB } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('sea');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.18, dry: 0.03, rag: 0.2, cap: 'round' };
const END = NEAR + 40;
const sea = (x, y) => {
  const t = clamp((y - HORIZON) / (END - HORIZON), 0, 1), half = 190 + (y - HORIZON) * 1.2, k = Math.exp(-Math.pow((x - NUM.x) / half, 2));
  let c = mix(mix('#1b3f47', '#08141b', Math.pow(t, 0.7)), skyColor(x + (nB(x / 80, y / 6) - 0.5) * 60, Math.max(20, HORIZON - 10 - (y - HORIZON) * 2.2)), 0.3 * (1 - t));
  c = mix(c, '#b89c5c', k * (0.5 - 0.26 * t));                                                     // the path of gold
  c = mix(c, '#0a141a', Math.exp(-Math.pow((x - 900) / (120 + (y - HORIZON) * 0.3), 2)) * smooth(HORIZON + 150, HORIZON, y) * 0.8);   // the dark of the Monolith in it
  return mix(c, '#050c12', smooth(0.5, 0.64, nA(x / 240, y / (5 + 14 * t))) * (0.2 + 0.3 * t));    // the dark sides of the low waves
};
for (const [y0, y1, w, len] of [[HORIZON - 2, 700, 5.5, 60], [692, 780, 8, 100], [772, END + 4, 11, 150]]) p.fill({ bounds: [0, y0, W, y1], width: w, length: len, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.012, 0.012), color: sea, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, HORIZON, W, END], width: 5.5, length: 50, spacing: 1.1, overlap: 0.7, angle: () => r.range(-0.012, 0.012), color: (x, y) => sea(x + r.range(-12, 12), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.78 } });
// level touches of light in the path, close together far off
for (let k = 0; k < 460; k++) { const t = Math.pow(r(), 1.4), y = HORIZON + 4 + t * (END - HORIZON - 8), half = 190 + (y - HORIZON) * 1.2, x = NUM.x + r.gauss() * half * 0.7, core = Math.exp(-Math.pow((x - 900) / (120 + (y - HORIZON) * 0.3), 2)) * smooth(HORIZON + 150, HORIZON, y); if (r() < core) continue; const len = Math.max(12.4, (10 + 60 * t) * r.range(0.6, 1.5)); p.tryStroke({ brush: 'round', color: mix('#a08c50', '#f6e6b0', r()), width: 4, opacity: (0.22 + 0.5 * Math.exp(-Math.pow((x - NUM.x) / half, 2))) * r.range(0.5, 1), taper: [0.5, 0.5], points: [[x - len / 2, y], [x + len / 2, y + r.range(-0.6, 0.6)]] }); }
// the number, down the water: a few short level touches of brighter gold under it
for (let k = 0; k < 12; k++) { const y = HORIZON + 8 + k * 8 + r.range(-2, 2), w = r.range(16, 40); p.tryStroke({ brush: 'round', color: '#ffc864', width: 4, opacity: 0.4 * (1 - k / 14), taper: [0.5, 0.5], points: [[NUM.x - w / 2 + r.range(-30, 30), y], [NUM.x + w / 2 + r.range(-30, 30), y]] }); }
// the pale of the Paintress, under her: upright touches that the level lines of the water break
for (let k = 0; k < 16; k++) { const x = 700 + r.gauss() * 46, d = Math.pow(r(), 1.3) * 90, l = r.range(18.5, 40); p.tryStroke({ brush: 'soft', color: mix('#5c686c', '#b0b09c', r()), width: 9, opacity: (0.2 - d * 0.0016) * r.range(0.5, 1), points: [[x, HORIZON + 8 + d], [x + r.range(-1.5, 1.5), HORIZON + 8 + d + l]] }); }
for (let k = 0; k < 24; k++) { const y = HORIZON + 10 + Math.pow(r(), 1.2) * 110, x = 700 + r.range(-110, 110), len = r.range(40, 130); p.tryStroke({ brush: 'round', color: '#060d12', width: 4, opacity: r.range(0.3, 0.55), taper: [0.4, 0.4], points: [[x, y], [x + len, y + r.range(-1, 1)]] }); }
// the ring, in the water: its two sides come down as faint bows
for (const s of [-1, 1]) for (let i = 0; i < 9; i++) { const a0 = 0.14 + i * 0.07, a = (ang) => [NUM.x + s * RING * Math.cos(ang), HORIZON + 6 + (HORIZON - NUM.y - RING * Math.sin(ang)) * 0.42], pts = [a(a0), a(a0 + 0.03), a(a0 + 0.06)]; if (pts[2][1] > HORIZON + 2 && pts[0][1] < END) p.tryStroke({ brush: 'round', color: '#ffd070', width: 4, opacity: 0.4 - i * 0.03, taper: [0.3, 0.3], points: pts }); }
for (let k = 0; k < 110; k++) { const y = HORIZON + 8 + Math.pow(r(), 1.3) * (END - HORIZON - 10), x = r.range(0, W), len = r.range(20, 90) * (0.5 + (y - HORIZON) / 200); p.tryStroke({ brush: 'round', color: mix('#3c6c70', '#8cb0a8', gold(x, HORIZON - 100, 700)), width: 4, opacity: r.range(0.1, 0.3), taper: [0.5, 0.5], points: [[x, y], [x + len, y + r.range(-0.8, 0.8)]] }); }

p.save();
