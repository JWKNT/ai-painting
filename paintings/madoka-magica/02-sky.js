// The storm. The clouds turn round the witch in a great wheel: the strokes of the sky go
// round her, and long arms of dark cloud go round her too, each with her light on the side
// of it that is turned to her.
'use strict';
const { studio, open, W, WITCH, skyColor, aura, nB } = require('./scene');
const { mix, shift, ramp, noise2, clamp } = studio;

const p = open('sky');
const r = p.rng;
// The way the storm turns, at a place: round her, and a little in toward her.
const turn = (x, y) => Math.atan2(y - WITCH.y, x - WITCH.x) + Math.PI / 2 + 0.28 + (nB(x / 260, y / 200) - 0.5) * 0.5;
p.fill({ bounds: [0, 0, W, 820], width: 40, length: 240, spacing: 0.5, overlap: 0.55, angle: turn, color: (x, y) => shift(skyColor(x, y), r.range(-3, 3), r.range(-0.03, 0.03), r.range(-0.014, 0.014)), stroke: { brush: 'bristle', opacity: 0.92, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, 820], width: 20, length: 140, spacing: 0.9, overlap: 0.7, angle: turn, color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-20, 20)), r.range(-4, 4), r.range(-0.02, 0.04), r.range(-0.02, 0.024)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });

// The arms of cloud. Each is a broken line of banks, of different sizes, along a path that winds in toward her.
const cloud = (t, x, y) => { const k = clamp(aura(x, y, 620) * 1.2, 0, 1); return ramp([mix('#0a1018', '#1c2c34', k), mix('#131e2a', '#2c444e', k), mix('#22323e', '#587878', k), mix('#34464e', '#9cb8b0', k)], t); };
const toWitch = (x, y) => { const dx = WITCH.x - x, dy = WITCH.y - y, l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
let seed = 0;
for (const [a0, r0, a1, r1, big] of [[2.3, 940, 4.5, 560, 100], [5.2, 900, 7.0, 540, 90], [0.2, 800, 1.9, 500, 80], [3.5, 680, 5.2, 430, 58], [0.9, 600, 2.5, 410, 52], [5.8, 470, 7.2, 370, 40], [2.6, 500, 3.6, 400, 34]]) {
  const steps = Math.round((a1 - a0) * (r0 + r1) / 2 / (big * 0.55));
  let bank = [];
  const paint = () => {
    const keep = bank.filter((q) => q[2] > 11);
    if (keep.length > 1) studio.mass(p, keep, { light: toWitch, tones: cloud, bias: 0.36, contrast: 0.7, grain: 0.3, mix: 0.32, noise: noise2(1300 + ++seed), stroke: { rag: 0.5, hardness: 0.45 }, flow: turn, layers: [[Math.max(11, big * 0.3), big * 1.5, 0.9, big * 0.1, 0.45], [Math.max(7, big * 0.17), big * 0.9, 0.78, big * 0.06, 0.75]] });
    bank = [];
  };
  for (let k = 0; k <= steps; k++) {
    const t = k / steps, a = a0 + (a1 - a0) * t, rr = r0 + (r1 - r0) * t + (nB(k * 0.4, seed + 3) - 0.5) * big * 1.2, size = big * (0.35 + 0.9 * nB(k * 0.33 + 9, seed)) * Math.sin(Math.PI * clamp(t, 0.05, 0.95));
    const x = WITCH.x + Math.cos(a) * rr, y = WITCH.y + Math.sin(a) * rr * 0.86;
    if (size < 14 || y > 770 || x < -200 || x > W + 200) { paint(); continue; }                  // a gap in the arm
    bank.push([x + r.range(-10, 10), y + r.range(-10, 10), size]);
    if (r() < 0.5) bank.push([x + r.range(-size, size) * 0.6, y + r.range(-size, size) * 0.5, size * r.range(0.5, 0.8)]);
  }
  paint();
}
// Her light, in the middle of it all.
for (const [w, o] of [[520, 0.12], [320, 0.16], [200, 0.2]]) p.stroke({ brush: 'soft', color: '#e4f4e0', width: w, opacity: o, points: [[WITCH.x - w * 1.02, WITCH.y + 30], [WITCH.x, WITCH.y - 10], [WITCH.x + w * 1.02, WITCH.y + 30]] });

p.save();
