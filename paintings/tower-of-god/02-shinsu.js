// The shinsu: it fills the great space behind the bars. It is green, and it moves slowly,
// like deep water; the light in it is strongest low down in the middle and goes to black in
// the upper corners. Long pale lines of light move in it, and small bright motes rise.
'use strict';
const { studio, open, W, FLOOR, LIGHT, bright, shinsu, nB, nC } = require('./scene');
const { mix, shift, glow } = studio;

const p = open('shinsu');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.3, dry: 0.03, rag: 0.3, cap: 'round' };
const drift = (x, y) => (nB(x / 340, y / 260) - 0.5) * 2.4 + (nC(x / 120, y / 120) - 0.5) * 0.6;   // the way that it moves at a place
p.fill({ bounds: [0, 0, W, FLOOR + 10], width: 36, length: 240, spacing: 0.5, overlap: 0.55, angle: drift, color: (x, y) => shift(shinsu(x, y), r.range(-4, 4), r.range(-0.03, 0.03), r.range(-0.012, 0.012)), stroke: { ...line, opacity: 0.93 } });
p.fill({ bounds: [0, 0, W, FLOOR + 10], width: 16, length: 150, spacing: 0.9, overlap: 0.7, angle: drift, color: (x, y) => shift(shinsu(x + r.range(-20, 20), y + r.range(-20, 20)), r.range(-5, 5), r.range(-0.02, 0.05), r.range(-0.02, 0.022)), stroke: { ...line, opacity: 0.75 } });
// long pale lines of light in it, which follow its movement
p.fill({ inside: (x, y) => bright(x, y) > 0.16 && nC(x / 70, y / 50) > 0.56, bounds: [0, 0, W, FLOOR], width: 7, length: 260, spacing: 3.4, overlap: 0.8, angle: drift, color: (x, y) => mix(shinsu(x, y), '#f4ffd8', 0.5), stroke: { ...line, mix: 0.15, opacity: 0.45, taper: [0.5, 0.5] } });
// the brightest of it, low in the middle: a light with no edge, wider than it is high
for (const [w, op, n] of [[420, 0.08, 4], [280, 0.12, 5], [170, 0.2, 6], [90, 0.3, 6]]) glow(p, LIGHT.x, LIGHT.y, w, mix('#b4f48c', '#ffffff', 1 - w / 440), op, n, 0.5);
// motes that rise in it
for (let k = 0; k < 150; k++) {
  const x = LIGHT.x + r.gauss() * 430, y = r.range(40, FLOOR - 20), b = bright(x, y);
  if (b < 0.1) continue;
  if (r() < 0.4) p.tryStroke({ brush: 'soft', color: '#c8f8a0', width: 9, opacity: 0.2 * b + 0.06, points: [[x - 9.6, y], [x + 9.6, y]] });
  p.tryStroke({ brush: 'round', color: mix('#b0f090', '#ffffff', r()), width: 4, opacity: (0.3 + 0.6 * r()) * (0.4 + 0.6 * b), points: [[x - 6.2, y], [x + 6.2, y]] });
}

p.save();
