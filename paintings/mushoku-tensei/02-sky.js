// The sky. Heavy cloud has come over the whole of it and turns slowly about the column: bank
// on bank of dark heads, with the cold light of the column on the sides of them that are
// toward it. Where the column goes up into the cloud, the cloud is white with it. At the
// right there is a hole in the cloud, and in it the red orb.
'use strict';
const { studio, open, W, HORIZON, COL, ORB, skyColor } = require('./scene');
const { mix, shift, ramp, noise2, clamp, smooth, glow, disc } = studio;

const p = open('sky');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.25, dry: 0.04, rag: 0.3, cap: 'round' };
// The cloud turns about the place where the column meets it: strokes go round that place, flattened, as we see it from below.
const HUB = { x: COL.x, y: COL.top + 20 };
const around = (x, y) => Math.atan2((y - HUB.y) * 2.4, x - HUB.x) + Math.PI / 2;
const flat = (x, y) => { const a = around(x, y); return Math.atan2(Math.sin(a) / 2.4, Math.cos(a)); };
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: flat, color: (x, y) => shift(skyColor(x, Math.min(y, HORIZON)), r.range(-3, 3), r.range(-0.03, 0.03), r.range(-0.012, 0.012)), stroke: { ...line, opacity: 0.93 } });

// The banks of cloud, far ones first: low on the far side of the town, then higher and greater, to those over our heads.
const toCol = (x, y) => { const dx = COL.x - x, dy = 460 - y, l = Math.hypot(dx, dy) || 1; return [dx / l * 0.9, dy / l * 0.9]; };
let seed = 0;
for (const [x0, x1, floor, big, tall, dark] of [[-80, 620, 590, 34, 0.6, 0.5], [920, 1700, 590, 34, 0.6, 0.5], [-100, 520, 520, 58, 0.9, 0.3], [1010, 1720, 520, 58, 0.9, 0.3], [-140, 600, 420, 90, 1.0, 0.15], [960, 1500, 430, 80, 0.9, 0.15], [-160, 760, 290, 130, 1.0, 0], [820, 1090, 300, 100, 0.7, 0], [1260, 1780, 330, 120, 0.9, 0], [-200, 1800, 150, 170, 0.8, 0]]) {
  const puffs = [], n = noise2(8200 + ++seed);
  for (let x = x0; x < x1; x += big * 0.5) {
    if (Math.hypot(x - ORB.x, (floor - big) - ORB.y) < 150 + big * 0.5) continue;                                     // the hole that the orb is in
    const rad = big * r.range(0.6, 1.1);
    puffs.push([x + r.range(-12, 12), floor - rad * r.range(0.5, 1.0) - big * tall * r.range(0, 0.6), rad]);
    if (r() < 0.6) puffs.push([x + r.range(-20, 20), floor - rad * 0.4, rad * r.range(0.7, 1)]);
  }
  if (!puffs.length) continue;
  const tones = (t, x, y) => { const near = Math.exp(-Math.pow((x - COL.x) / 520, 2)); let c = ramp(['#07070e', '#16151f', '#2c2b3c', '#566a8c', '#b8d8f4'], clamp(t * (0.55 + 0.6 * near), 0, 1)); c = mix(c, '#f0f8ff', smooth(0.5, 1, t) * Math.exp(-Math.pow(Math.hypot(x - COL.x, y - COL.top) / 240, 2)) * 0.9); return mix(c, '#7c2030', Math.exp(-Math.pow(Math.hypot(x - ORB.x, y - ORB.y) / 230, 2)) * 0.45 * t); };
  studio.mass(p, puffs, { light: toCol, tones, base: floor + big * 0.3, bias: 0.34, contrast: 0.66, fall: 0.2, grain: 0.2, mix: 0.3, noise: n, stroke: { rag: 0.4, hardness: 0.5 }, flow: flat, layers: [[Math.max(11, big * 0.26), Math.max(30, big * 0.9), 0.95, Math.max(3, big * 0.07), 0.5], [Math.max(7, big * 0.14), Math.max(20, big * 0.5), 0.8, Math.max(2, big * 0.04), 0.85]] });
}
// Torn pieces of cloud that the turning has pulled out long, between the banks.
for (let k = 0; k < 40; k++) {
  const a = r.range(0, Math.PI * 2), rad = r.range(180, 780), x = HUB.x + Math.cos(a) * rad, y = HUB.y + Math.sin(a) * rad / 2.4;
  if (y < 10 || y > HORIZON - 20 || x < -60 || x > W + 60 || Math.hypot(x - ORB.x, y - ORB.y) < 120) continue;
  const pts = []; for (let i = 0; i <= 6; i++) { const b = a + i * 0.05 * 300 / rad; pts.push([HUB.x + Math.cos(b) * rad, HUB.y + Math.sin(b) * rad / 2.4]); }
  p.tryStroke({ ...line, color: mix('#0c0b14', '#6c88b0', Math.exp(-Math.pow((x - COL.x) / 400, 2)) * r.range(0.2, 0.9)), width: r.range(7, 16), opacity: r.range(0.4, 0.8), taper: [0.5, 0.5], points: pts });
}

// The hole in the cloud, and the red orb in it: a small round of red fire with no edge to its light. The cloud round the hole is red with it.
for (const [w, op, n] of [[230, 0.07, 4], [150, 0.1, 5], [90, 0.15, 5], [48, 0.24, 6]]) glow(p, ORB.x, ORB.y, w, '#b01c30', op, n);
glow(p, ORB.x, ORB.y, 26, '#ff7c6c', 0.42, 6);
disc(p, ORB.x, ORB.y, 13, '#ff4c44', 6.2, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round' });
glow(p, ORB.x - 2, ORB.y - 2, 9, '#ffd0c0', 0.5, 4);

p.save();
