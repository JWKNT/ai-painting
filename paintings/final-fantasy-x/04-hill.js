// The hill that we are on: bare rock, in beds that lie on a slant. The last of the sun comes
// level over the top of it and finds every edge that stands up; the rest is in brown shade.
// The light of the camp fire lies on the rock round the fire. At the right the hill goes up,
// and on the top of it there is a piece of the city: the foot of a fallen tower.
'use strict';
const { studio, open, W, H, FIRE, glow, fireOn, ridge, tower, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth, shape, glint } = studio;

const p = open('hill');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.12, dry: 0.04, rag: 0.25, cap: 'round' };

// The piece of the city on the top of the hill, at the right: painted first, for the rock of the hill comes up in front of it.
tower(p, [1530, 470], [1496, 250], [[0, 110], [0.5, 104], [0.9, 96], [1, 80]], 0.06, { ribs: 4, windows: [0.3, 0.6], broken: true });
tower(p, [1400, 470], [1420, 380], [[0, 40], [0.7, 36], [1, 20]], 0.08, { ribs: 2, broken: true });

// The rock.
const slope = (x) => Math.atan2(ridge(x + 40) - ridge(x - 40), 80);
const rock = (x, y) => {
  const depth = clamp((y - ridge(x)) / 320, 0, 1), bed = nC(x / 90 + nA(x / 260, y / 200) * 2.4, (y - x * Math.tan(slope(x)) * 0.5) / 20);
  let c = mix('#4a342c', '#1a1216', smooth(0, 1, depth));
  c = mix(c, bed > 0.5 ? '#8a5a3c' : '#0e0a0e', Math.abs(bed - 0.5) * (0.9 - 0.3 * depth));     // the beds of it: a light one, a dark one
  c = mix(c, '#f09848', smooth(70, 0, y - ridge(x)) * 0.6 * (0.4 + 0.6 * glow(x, ridge(x), 800)));   // the sun on the top of it
  return mix(c, mix('#ff9a44', '#ffd27c', bed), fireOn(x, y) * (bed > 0.42 ? 0.7 : 0.3));          // the fire on the rock round it
};
const lie = (x, y) => slope(x) * clamp(1.2 - (y - ridge(x)) / 260, 0.2, 1) + (nB(x / 120, y / 60) - 0.5) * 0.3;
p.fill({ inside: (x, y) => y > ridge(x), bounds: [0, 380, W, 720], width: 9, length: 70, spacing: 0.5, angle: lie, color: rock, stroke: { ...line, opacity: 0.96 } });
p.fill({ inside: (x, y) => y > ridge(x), bounds: [0, 700, W, H], width: 15, length: 130, spacing: 0.5, angle: lie, color: rock, stroke: { ...line, opacity: 0.96 } });
p.fill({ inside: (x, y) => y > ridge(x) + 8, bounds: [0, 390, W, H], width: 7, length: 50, spacing: 1.1, overlap: 0.7, angle: lie, color: (x, y) => rock(x + r.range(-20, 20), y + r.range(-6, 6)), stroke: { ...line, opacity: 0.85 } });
{                                                                        // the fire of the sun along the top of the hill
  const pts = []; for (let x = -20; x <= W + 20; x += 16) pts.push([x, ridge(x) + 2.5]);
  glint(p, pts, () => mix('#ff9c40', '#ffe490', r()), { width: 5, dash: 70, gap: 22, opacity: 0.85, rng: r });
}
// Cracks in the rock, along its beds and across them.
for (let k = 0; k < 60; k++) {
  const x = r.range(-20, W), y = r.range(ridge(clamp(x, 0, W)) + 24, H), a = lie(x, y) + (r() < 0.3 ? r.pick([-1, 1]) * r.range(0.8, 1.3) : r.range(-0.2, 0.2)), len = r.range(40, 130) * (0.6 + (y - 500) / 600);
  p.tryStroke({ ...line, color: '#0c080c', width: r.range(4.8, 7), opacity: 0.55, rag: 0.3, taper: [0.2, 0.5], points: [[x, y], [x + Math.cos(a) * len * 0.5 + r.range(-5, 5), y + Math.sin(a) * len * 0.5 + r.range(-3, 3)], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
}
// Rocks that stand up out of it: each is one rounded mass, dark toward us, with the sun or the fire along the top of it.
const boulder = (x, y, s) => {
  const lit = fireOn(x, y) > 0.3, tones = lit ? { shadow: '#140e12', half: '#3c2822', lit: '#9c6038', rim: '#ffc070', bounce: '#241a26' } : { shadow: '#120c10', half: '#30241f', lit: '#74492e', rim: '#f09850', bounce: '#201824' };
  const lean = r.range(-6, 6), pts = [[-44, 10], [-38, -8], [-18 + lean, -24], [8 + lean, -28], [32, -16], [46, 10]].map(([a, b]) => [x + a * s, y + b * s]);
  p.tryStroke({ brush: 'soft', color: '#080508', width: Math.max(8.2, 20 * s), opacity: 0.5, points: [[x - 46 * s, y + 12 * s], [x, y + 16 * s], [x + 50 * s, y + 12 * s]] });
  shape(p, pts, tones, { light: lit ? { at: [FIRE.x, FIRE.y - 80] } : [-0.25, -0.95], turn: 0.2, width: Math.max(5.5, 7 * s), length: 20 * s + 8, vary: 0.05, round: 18 * s, flow: () => 0.1, dash: 30, gap: 14, edgeOpacity: 0.6 });
};
for (const [x, y, s] of [[1262, 700, 1.2], [1480, 810, 1.9], [1330, 944, 2.3], [730, 974, 2]]) boulder(x, y, s);

p.save();
