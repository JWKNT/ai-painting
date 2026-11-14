// The cliff that they stand on. It comes into the picture from the right: a high edge of
// rock with grass on it. The grass is long and bright, and leans in the wind; flowers
// grow in it in clumps. Along the edge the rock shows, rose where the sun is on it and
// violet under.
'use strict';
const { studio, open, W, H, cliffTop, nA, nB, nC, nD } = require('./scene');
const { mix, clamp, smooth, solid } = studio;

const p = open('cliff');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.16, dry: 0.03, rag: 0.22, cap: 'round' };
const on = (x, y) => x > 540 && y > cliffTop(x) + 6 * (nC(x / 22, 3) - 0.5);
// the rock of its edge: a band under the line of the top, which we see where the grass does not hang over it
p.fill({ inside: (x, y) => x > 520 && y > cliffTop(x) - 18 && y < cliffTop(x) + 30, bounds: [520, 760, W, H], width: 9, length: 40, spacing: 0.5, overlap: 0.6, angle: () => 1.1 + r.range(-0.3, 0.3), color: (x, y) => mix(mix('#b08cb8', '#6c5898', smooth(-10, 26, y - cliffTop(x))), '#f4dce8', smooth(-6, -18, y - cliffTop(x)) * 0.6 + (nA(x / 20, y / 20) - 0.5) * 0.2), stroke: { ...line, rag: 0.4, opacity: 0.96 } });
// the grass
const grass = (x, y) => {
  const t = clamp((y - cliffTop(x)) / 220, 0, 1), tuft = nA(x / 60, y / 26), fine = nD(x / 12, y / 9);
  let c = mix('#78d05c', '#2f9a52', smooth(0, 1, t) * 0.8);                                        // bright at the edge, where the sun is on it; deeper toward us
  c = mix(c, tuft > 0.5 ? '#c4ec6c' : '#1f7a54', Math.abs(tuft - 0.5) * 0.8);
  c = mix(c, '#4a4aa8', smooth(0.6, 1, t) * 0.34);                                                 // the violet shade of the foot of the picture
  return mix(c, '#e8f890', (fine > 0.74 ? 0.3 : 0) * (1 - t));
};
const lean = (x, y) => -1.2 + (nB(x / 240, y / 120) - 0.5) * 0.7;
p.fill({ inside: (x, y) => on(x, y - 14), bounds: [540, 770, W, H + 4], width: 9, length: 46, spacing: 0.5, overlap: 0.6, angle: lean, color: grass, stroke: { ...line, taper: [0, 0.7], opacity: 0.96 } });
p.fill({ inside: (x, y) => on(x, y - 6), bounds: [540, 770, W, H + 4], width: 6, length: 34, spacing: 0.8, overlap: 0.7, angle: lean, color: (x, y) => grass(x + r.range(-6, 6), y + r.range(-6, 6)), stroke: { ...line, taper: [0, 0.8], opacity: 0.85 } });
// long blades that stand up over the edge, against the far land
for (let x = 560; x < W + 10; x += r.range(7, 20)) { const y = cliffTop(x) + r.range(0, 12), h = r.range(16, 44), a = -1.2 + r.range(-0.4, 0.4); p.tryStroke({ ...line, color: mix('#4cb858', '#d0f078', r()), width: r.range(4.8, 6.4), taper: [0, 0.85], points: [[x, y + 6], [x + Math.cos(a) * h * 0.5, y + Math.sin(a) * h * 0.5], [x + Math.cos(a) * h + 3, y + Math.sin(a) * h]] }); }
// rocks at the edge: rose in the sun, violet under
for (const [x, s] of [[700, 26], [876, 20], [1330, 30], [1500, 22], [612, 18]]) { const y = cliffTop(x) + s * 0.5; solid(p, [[x - s * 0.5, y, s * 0.5], [x + s * 0.5, y + 2, s * 0.42]], { shadow: '#4c3e84', half: '#8a70a8', lit: '#f0d4e4', bounce: '#5a9a6a' }, { light: [-0.62, -0.78], turn: 0, width: 6, length: Math.max(14, s * 0.5), vary: 0.1, flow: () => 0.2, edge: false }); }
// flowers, in clumps: each is a short bright touch that stands the way the grass does. They are bigger near us.
for (const [c0, c1, n] of [['#ffffff', '#f4f8e4', 90], ['#ffc4dc', '#ffe0ec', 50], ['#fff0a0', '#fffbd0', 50]]) for (let k = 0; k < n; k++) {
  const x = r.range(560, W), y = cliffTop(x) + 14 + Math.pow(r(), 0.8) * (H - cliffTop(x) - 14);
  if (r() > smooth(0.42, 0.62, nD(x / 110 + n, y / 60))) continue;
  const s = 0.7 + (y - 780) / 200, l = Math.max(12.4, 9 * s), a = -1.2 + r.range(-0.7, 0.7);
  p.tryStroke({ brush: 'round', color: mix(c0, c1, r()), width: clamp(4 * s, 4, 5), opacity: 0.72, taper: [0.65, 0.65], points: [[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l]] });
}

p.save();
