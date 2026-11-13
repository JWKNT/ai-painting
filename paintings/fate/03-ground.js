// The plain, and the hill that he stands on. The plain is dry red earth, bright with the
// glare at its far edge. The hill is nearer and darker; the glare comes over the top of it
// and down the middle of it, and the earth of it is cracked.
'use strict';
const { studio, open, W, H, HORIZON, GLOW, hillTop, ground, nA, nC } = require('./scene');
const { mix, clamp, smooth, wave, glint } = studio;

const p = open('ground');
const r = p.rng;
const level = () => r.range(-0.03, 0.03), stroke = { brush: 'bristle', opacity: 0.95, mix: 0.2, dry: 0.04, rag: 0.25 };

// The plain.
const plain = (x, y) => mix(ground(x, y), nC(x / 90, y / 6) > 0.5 ? '#ffc870' : '#6c2c14', Math.abs(nC(x / 90, y / 6) - 0.5) * 0.4);
p.fill({ bounds: [0, HORIZON - 2, W, 720], width: 6.5, length: 70, spacing: 0.5, angle: level, color: plain, stroke });
for (let x = -40; x < W; x += 260) p.stroke({ brush: 'soft', color: mix('#ffb050', '#fff0b0', clamp(Math.exp(-Math.pow((x + 150 - GLOW.x) / 420, 2)), 0, 1)), width: 18, opacity: 0.4, points: [[x, HORIZON + 1], [x + 150, HORIZON], [x + 300, HORIZON + 1]] });   // the line where it meets the sky, in the glare

// The hill.
const hill = (x, y) => {
  const k = smooth(640, 1000, y), lit = Math.exp(-Math.pow((x - (GLOW.x - (y - HORIZON) * 0.5)) / (150 + k * 380), 2));
  let c = mix(mix('#6c2a16', '#8c3c1c', nA(x / 200, y / 60)), '#2a100c', k * 0.7 + Math.pow(Math.abs(x - 760) / 900, 2) * 0.35);
  c = mix(c, '#f09038', lit * (0.55 - 0.3 * k));                                                // the glare down the middle of it
  return mix(c, nC(x / 120, y / 9) > 0.5 ? '#c86428' : '#1c0a08', Math.abs(nC(x / 120, y / 9) - 0.5) * 0.36);
};
p.fill({ inside: (x, y) => y > hillTop(x), bounds: [0, 610, W, 800], width: 8, length: 90, spacing: 0.5, angle: level, color: hill, stroke });
p.fill({ inside: (x, y) => y > hillTop(x), bounds: [0, 780, W, H], width: 13, length: 150, spacing: 0.5, angle: level, color: hill, stroke });
{                                                                        // the glare along the top of it
  const pts = []; for (let x = -20; x <= W + 20; x += 20) pts.push([x, hillTop(x) + 2]);
  glint(p, pts, () => mix('#ff9c3c', '#ffe090', r()), { width: 5, dash: 90, gap: 26, opacity: 0.75, rng: r });
}
// The cracks in the earth: thin dark lines that wander and fork. They lie flatter the further off they are.
for (let k = 0; k < 46; k++) {
  let x = r.range(-40, W), y = 690 + Math.pow(r(), 0.8) * 310, a = r.range(-0.4, 0.4) + (r() < 0.3 ? r.pick([-1, 1]) * 0.9 : 0);
  if (y < hillTop(clamp(x, 0, W)) + 14) continue;
  const kk = smooth(640, 1000, y), flat = 0.2 + 0.3 * kk, pts = [[x, y]];
  for (let i = 0; i < 4; i++) { const len = r.range(26, 60) * (0.6 + kk); a += r.range(-0.7, 0.7); x += Math.cos(a) * len; y += Math.sin(a) * len * flat; pts.push([x, y]); }
  p.tryStroke({ ...stroke, color: '#1a0908', width: 4.8, opacity: 0.4 + 0.2 * kk, rag: 0.3, taper: [0.3, 0.5], points: pts });
  if (r() < 0.5) { const [bx, by] = pts[2], b = a + r.pick([-1, 1]) * r.range(0.8, 1.3), len = r.range(24, 50) * (0.6 + kk); p.tryStroke({ ...stroke, color: '#1a0908', width: 4.8, opacity: 0.35, rag: 0.3, taper: [0.1, 0.7], points: [[bx, by], [bx + Math.cos(b) * len, by + Math.sin(b) * len * flat]] }); }
}
// The smoke that lies on the plain, far off.
for (let k = 0; k < 9; k++) { const x = r.range(-100, W - 300), y = HORIZON + r.range(4, 40), len = r.range(300, 600); p.stroke({ brush: 'soft', color: mix('#ffb858', '#ffe6a0', r()), width: r.range(16, 30), opacity: r.range(0.12, 0.22), points: wave(x, y, x + len, y + r.range(-3, 3), 2, 1, 6) }); }

p.save();
