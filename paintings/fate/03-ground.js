// The plain, and the hill. The plain is dry red earth, bright with the glare at its far
// edge and dark near us, and the earth of it is cracked. The hill is far off, to the left of
// the glare: a long low heap, dark against the sky, with the glare over its top and on its
// right side.
'use strict';
const { studio, open, W, H, HORIZON, GLOW, hillTop, hillFoot, ground, far, nA, nC } = require('./scene');
const { mix, clamp, smooth, wave, glint } = studio;

const p = open('ground');
const r = p.rng;
const level = () => r.range(-0.03, 0.03), stroke = { brush: 'bristle', opacity: 0.95, mix: 0.2, dry: 0.04, rag: 0.25 };

// The far plain, at each side of the hill.
const plain = (x, y) => mix(ground(x, y), nC(x / 90, y / 6) > 0.5 ? '#ffc870' : '#6c2c14', Math.abs(nC(x / 90, y / 6) - 0.5) * 0.4);
p.fill({ bounds: [0, HORIZON - 2, W, 640], width: 6.5, length: 70, spacing: 0.5, angle: level, color: plain, stroke });
for (let x = -40; x < W; x += 260) p.stroke({ brush: 'soft', color: mix('#ffb050', '#fff0b0', clamp(Math.exp(-Math.pow((x + 150 - GLOW.x) / 420, 2)), 0, 1)), width: 18, opacity: 0.4, points: [[x, HORIZON + 1], [x + 150, HORIZON], [x + 300, HORIZON + 1]] });   // the line where it meets the sky, in the glare

// The hill. Its strokes lie along its slope. It is darkest at its left, far from the glare; the glare is warm on its right
// side and in a thin band under its top, where the light comes over.
const slope = (x) => Math.atan((hillTop(x + 12) - hillTop(x - 12)) / 24);
const onMound = (x, y) => y > hillTop(x) && y < hillFoot(x) + 4;
const mound = (x, y) => {
  const top = hillTop(x), t = clamp((y - top) / Math.max(8, hillFoot(x) - top), 0, 1), side = Math.exp(-Math.pow((x - GLOW.x) / 300, 2));
  let c = mix(mix('#3c150d', '#5c2414', nA(x / 120, y / 30)), '#7a3418', t * 0.5);
  c = mix(c, '#e08434', side * (0.2 + 0.4 * smooth(0.5, 0, t)));                                // the glare on the side of it that is toward the glare
  c = mix(c, '#f09038', smooth(0.16, 0, t) * 0.4);                                             // and under its top
  c = mix(c, nC(x / 60, y / 7) > 0.5 ? '#a04c20' : '#1c0a08', Math.abs(nC(x / 60, y / 7) - 0.5) * 0.4);
  return far(c, x, y, 0.16);
};
p.fill({ inside: onMound, bounds: [0, 410, W, 600], width: 6.5, length: 60, spacing: 0.5, angle: (x, y) => slope(x) * clamp(1 - (y - hillTop(x)) / 90, 0, 1) + r.range(-0.03, 0.03), color: mound, stroke });
p.fill({ inside: onMound, bounds: [0, 410, W, 600], width: 5, length: 34, spacing: 0.9, overlap: 0.7, angle: (x, y) => slope(x) * clamp(1 - (y - hillTop(x)) / 90, 0, 1) + r.range(-0.05, 0.05), color: (x, y) => mound(x + r.range(-6, 6), y + r.range(-2, 2)), stroke: { ...stroke, opacity: 0.85 } });
{                                                                        // the glare along the top of it
  const pts = []; for (let x = 100; x <= 960; x += 18) pts.push([x, hillTop(x) + 2]);
  glint(p, pts, () => mix('#ff9c3c', '#ffe090', r()), { width: 4.6, dash: 60, gap: 22, opacity: 0.7, rng: r });
}

// The plain in front of the hill, down to us.
const near = (x, y) => {
  const k = smooth(620, 1000, y), lit = Math.exp(-Math.pow((x - (GLOW.x - (y - HORIZON) * 0.1)) / (130 + k * 420), 2));
  let c = mix(mix('#7a3018', '#963f1c', nA(x / 200, y / 60)), '#2a100c', k * 0.72 + Math.pow(Math.abs(x - 800) / 900, 2) * 0.35);
  c = mix(c, '#f8a040', lit * (0.62 - 0.36 * k));                                               // the road of the glare, down the middle of it
  return mix(c, nC(x / 120, y / 9) > 0.5 ? '#c86428' : '#1c0a08', Math.abs(nC(x / 120, y / 9) - 0.5) * 0.36);
};
const below = (x, y) => y > hillFoot(x) + 2;
p.fill({ inside: below, bounds: [0, 574, W, 660], width: 6, length: 64, spacing: 0.5, angle: level, color: near, stroke });
p.fill({ inside: below, bounds: [0, 648, W, 800], width: 8, length: 90, spacing: 0.5, angle: level, color: near, stroke });
p.fill({ bounds: [0, 780, W, H], width: 13, length: 150, spacing: 0.5, angle: level, color: near, stroke });
// The smoke that lies at the foot of the hill and on the far plain.
for (let k = 0; k < 12; k++) { const x = r.range(-100, W - 300), y = HORIZON + r.range(6, 34), len = r.range(300, 600); p.stroke({ brush: 'soft', color: mix('#ffb858', '#ffe6a0', r()), width: r.range(14, 26), opacity: r.range(0.1, 0.2), points: wave(x, y, x + len, y + r.range(-3, 3), 2, 1, 6) }); }
// The cracks in the earth: thin dark lines that wander and fork. They lie flatter the further off they are.
for (let k = 0; k < 60; k++) {
  let x = r.range(-40, W), y = 640 + Math.pow(r(), 0.8) * 360, a = r.range(-0.4, 0.4) + (r() < 0.3 ? r.pick([-1, 1]) * 0.9 : 0);
  const kk = smooth(620, 1000, y), flat = 0.16 + 0.34 * kk, pts = [[x, y]];
  for (let i = 0; i < 4; i++) { const len = r.range(26, 60) * (0.5 + kk); a += r.range(-0.7, 0.7); x += Math.cos(a) * len; y += Math.sin(a) * len * flat; pts.push([x, y]); }
  p.tryStroke({ ...stroke, color: '#1a0908', width: 4.8, opacity: 0.36 + 0.24 * kk, rag: 0.3, taper: [0.3, 0.5], points: pts });
  if (r() < 0.5) { const [bx, by] = pts[2], b = a + r.pick([-1, 1]) * r.range(0.8, 1.3), len = r.range(24, 50) * (0.5 + kk); p.tryStroke({ ...stroke, color: '#1a0908', width: 4.8, opacity: 0.35, rag: 0.3, taper: [0.1, 0.7], points: [[bx, by], [bx + Math.cos(b) * len, by + Math.sin(b) * len * flat]] }); }
}

p.save();
