// The hill that we are on: bare rock, in beds that lie on a slant. The last of the sun comes
// level over the top of it and finds every edge that stands up; the rest is in brown shade.
// The light of the camp fire lies on the rock round the fire. At the right the hill goes up,
// and on the top of it there is a piece of the city: the foot of a fallen tower.
'use strict';
const { studio, open, W, H, FIRE, glow, fireOn, ridge, tower, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth, glint } = studio;

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
// Rocks that stand up out of it. Against the light a rock is a dark heap of two or three lumps, darker than the ground round it,
// with the sun or the fire only along the tops of the lumps, and its own shade at its foot.
const boulder = (x, y, s) => {
  const lit = fireOn(x, y) > 0.3, light = lit ? { at: [FIRE.x, FIRE.y - 80] } : [-0.3, -0.95];
  const tones = lit ? { shadow: '#0a0608', half: '#1a1112', lit: '#6c4028', rim: '#ffc070', bounce: '#1c141e' } : { shadow: '#090507', half: '#170f10', lit: '#50301f', rim: '#f09850', bounce: '#1a121c' };
  const k = r.range(-4, 4);
  p.tryStroke({ brush: 'soft', color: '#060305', width: Math.max(8.2, 26 * s), opacity: 0.6, points: [[x - 56 * s, y + 8 * s], [x, y + 12 * s], [x + 60 * s, y + 8 * s]] });
  studio.solid(p, [[[x - 26 * s, y - 2 * s, 15 * s], [x - 4 * s + k, y - 12 * s, 21 * s], [x + 22 * s, y - 6 * s, 17 * s], [x + 38 * s, y + 2 * s, 9 * s]]], tones, { light, turn: 0.45, width: Math.max(5.5, 6.5 * s), length: 16 * s + 8, vary: 0.08, flow: () => 0.1, dash: 22, gap: 10, edgeOpacity: 0.8 });
  p.tryStroke({ ...line, color: '#050304', width: Math.max(4.8, 2.6 * s), opacity: 0.7, taper: [0.1, 0.7], points: [[x + 8 * s + k, y - 24 * s], [x + 12 * s, y - 10 * s], [x + 7 * s, y + 4 * s]] });   // the cleft between two of the lumps
  p.tryStroke({ brush: 'soft', color: '#060305', width: Math.max(8.2, 12 * s), opacity: 0.55, points: [[x - 44 * s, y + 9 * s], [x, y + 11 * s], [x + 48 * s, y + 9 * s]] });                             // the ground over its foot
};
for (const [x, y, s] of [[1262, 700, 1.2], [1480, 810, 1.9], [1330, 944, 2.3], [730, 974, 2]]) boulder(x, y, s);

p.save();
