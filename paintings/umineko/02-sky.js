// The sky of the Golden Land. It is purple, and it turns about one place over the arbor, as
// water turns when it goes down: long arms of light magenta and of dark violet that wind in
// to a middle that is nearly white. Every stroke goes the way that the sky turns. Far from
// the middle the sky is nearly black.
'use strict';
const { studio, open, W, HZ, VORTEX, swirl, swirlAngle, armAt, skyColor, nC } = require('./scene');
const { mix, shift } = studio;

const p = open('sky');
const r = p.rng;
const bottom = HZ + 44;
const sky = (x, y) => skyColor(x, Math.min(y, HZ + 20));
const line = { brush: 'bristle', mix: 0.3, dry: 0.04, rag: 0.3, cap: 'round' };

// The body of it: wide strokes, then narrower ones over them, all along the turning.
p.fill({ bounds: [0, 0, W, bottom], width: 40, length: 300, spacing: 0.5, overlap: 0.55, angle: swirlAngle, color: (x, y) => shift(sky(x, y), r.range(-3, 3), r.range(-0.03, 0.03), r.range(-0.012, 0.012)), stroke: { ...line, opacity: 0.94 } });
p.fill({ bounds: [0, 0, W, bottom], width: 20, length: 220, spacing: 0.8, overlap: 0.7, angle: swirlAngle, color: (x, y) => shift(sky(x + r.range(-14, 14), y + r.range(-8, 8)), r.range(-4, 4), r.range(-0.02, 0.04), r.range(-0.014, 0.016)), stroke: { ...line, opacity: 0.8 } });
p.fill({ bounds: [0, 0, W, bottom], width: 11, length: 170, spacing: 1.1, overlap: 0.75, angle: swirlAngle, color: (x, y) => shift(sky(x + r.range(-8, 8), y + r.range(-5, 5)), r.range(-4, 4), r.range(-0.02, 0.04), r.range(-0.02, 0.022)), stroke: { ...line, opacity: 0.75, taper: [0.3, 0.3] } });
p.fill({ bounds: [0, 0, W, bottom], width: 7, length: 130, spacing: 1.3, overlap: 0.8, angle: swirlAngle, color: (x, y) => shift(sky(x + r.range(-6, 6), y + r.range(-4, 4)), r.range(-5, 5), r.range(-0.02, 0.05), r.range(-0.03, 0.035)), stroke: { ...line, mix: 0.2, opacity: 0.7, taper: [0.4, 0.4] } });
// Near the middle the turning is tight, so the strokes there are short and narrow.
p.fill({ inside: (x, y) => swirl(x, y).r < 330, bounds: [VORTEX.x - 340, VORTEX.y - 180, VORTEX.x + 340, VORTEX.y + 180], width: 10, length: 90, spacing: 0.7, overlap: 0.7, angle: swirlAngle, color: (x, y) => shift(sky(x + r.range(-5, 5), y + r.range(-3, 3)), r.range(-3, 3), 0, r.range(-0.01, 0.014)), stroke: { ...line, opacity: 0.85 } });

// Long threads of light in the light arms, and of dark in the dark ones: these give the arms their grain.
p.fill({ inside: (x, y) => armAt(x, y) > 0.35 && swirl(x, y).r > 70, bounds: [0, 0, W, bottom], width: 7, length: 340, spacing: 2.6, overlap: 0.8, angle: swirlAngle, color: (x, y) => mix(mix('#f070d0', '#ffc4f0', r()), sky(x, y), 0.25 + 0.4 * Math.min(1, swirl(x, y).r / 1000)), stroke: { ...line, mix: 0.15, opacity: 0.5, taper: [0.5, 0.5] } });
p.fill({ inside: (x, y) => armAt(x, y) < -0.35 && swirl(x, y).r > 90, bounds: [0, 0, W, bottom], width: 8, length: 340, spacing: 2.8, overlap: 0.8, angle: swirlAngle, color: () => mix('#0c0218', '#24083c', r()), stroke: { ...line, mix: 0.15, opacity: 0.5, taper: [0.5, 0.5] } });
p.fill({ inside: (x, y) => Math.abs(armAt(x, y)) < 0.3 && swirl(x, y).r > 110 && nC(x / 50, y / 30) > 0.5, bounds: [0, 0, W, bottom], width: 5.5, length: 240, spacing: 4, overlap: 0.8, angle: swirlAngle, color: (x, y) => mix(sky(x, y), r() < 0.5 ? '#ff9ce2' : '#16042a', 0.4), stroke: { ...line, mix: 0.15, opacity: 0.45, taper: [0.5, 0.5] } });

// The middle of the turning: a light with no edge, wider than it is high, and the last turns of the arms as they go into it.
for (const [w, o, n] of [[150, 0.1, 4], [96, 0.16, 5], [56, 0.3, 6], [30, 0.5, 6]]) for (let i = 0; i < n; i++) {
  const a = (i / n - 0.5) * 1.1, l = w * 1.7;
  p.stroke({ brush: 'soft', color: mix('#ffb0ea', '#ffffff', 1 - w / 170), width: w, opacity: o, points: [[VORTEX.x - Math.cos(a) * l, VORTEX.y - Math.sin(a) * l * 0.6], [VORTEX.x, VORTEX.y], [VORTEX.x + Math.cos(a) * l, VORTEX.y + Math.sin(a) * l * 0.6]] });
}
for (let k = 0; k < 26; k++) {
  const a0 = r.range(0, 6.283), rad = r.range(34, 120), pts = [];
  for (let i = 0; i <= 8; i++) { const a = a0 + i * 0.16, rr = rad * (1 - 0.05 * i); pts.push([VORTEX.x + Math.cos(a) * rr, VORTEX.y + Math.sin(a) * rr / VORTEX.squash]); }
  p.tryStroke({ ...line, mix: 0.1, color: mix('#ffd0f4', '#ffffff', r()), width: r.range(4.8, 7), opacity: r.range(0.3, 0.6), taper: [0.5, 0.6], points: pts });
}

p.save();
