// The ridge that we stand on: long grass, dry and gold at the end of the year, with the low
// sun raking across the tops of it; and the path that they have come along, which goes on
// over the brow and down to the fortress.
'use strict';
const { studio, open, W, H, nA, nB, nC, brow } = require('./scene');
const { mix, through, smooth } = studio;

const p = open('meadow');
const r = p.rng;
const pathLine = through([[160, 1010], [380, 962], [640, 898], [900, 826], [1160, 768], [1380, 724], [1520, 690]]);   // y of the path, by x
const onPath = (x, y) => { const k = smooth(650, 1000, y); return x > 150 && Math.abs(y - pathLine(x)) < (9 + 26 * k) * (0.8 + 0.4 * nB(x / 60, 5)); };
const grass = (x, y) => {
  const k = smooth(650, 1000, y), lit = nA(x / 170, y / 50), tuft = nC(x / 26, y / 26);
  let c = mix(mix('#a2964a', '#c9b05a', lit), mix('#4f5a34', '#74743c', lit), smooth(0.35, 0.7, tuft) * 0.75);
  c = mix(c, '#d8b862', smooth(0.55, 0.8, nB(x / 300, y / 60)) * 0.55);                       // patches of dry grass
  if (onPath(x, y)) c = mix(c, mix('#c9aa78', '#a88a60', nC(x / 30, y / 12)), 0.85);          // the path: trodden earth
  return mix(c, '#38402a', k * 0.5);                                                          // darker toward us
};
const blade = (x, y) => (onPath(x, y) ? r.range(-0.2, 0.1) - 0.24 : -Math.PI / 2 - 0.28 + (nC(x / 90, y / 90) - 0.5) * 0.5 + r.range(-0.2, 0.2));
const inside = (x, y) => y > brow(x);
const stroke = { brush: 'bristle', opacity: 0.95, mix: 0.2, dry: 0.04, rag: 0.3 };
p.fill({ inside, bounds: [0, 640, W, 800], width: 9, length: 30, spacing: 0.5, angle: blade, color: grass, stroke });
p.fill({ inside, bounds: [0, 780, W, H], width: 14, length: 56, spacing: 0.5, angle: blade, color: grass, stroke });
p.fill({ inside: (x, y) => inside(x, y) && !onPath(x, y), bounds: [0, 660, W, H], width: 7, length: 34, spacing: 1.2, overlap: 0.7, angle: blade, color: (x, y) => grass(x + r.range(-10, 10), y + r.range(-10, 10)), stroke: { ...stroke, opacity: 0.85, taper: [0, 0.6] } });

// The grass along the brow, against the valley.
for (let x = 0; x < W; x += r.range(5, 11)) {
  const y = brow(x) + 3, h = r.range(14, 26);
  p.tryStroke({ ...stroke, color: mix(mix('#8c8840', '#c8b458', r()), '#f4dc80', r() * 0.5), width: r.range(4.8, 6.5), taper: [0, 0.8], points: [[x, y + 4], [x - h * 0.22, y - h]] });
}
// The sun on the tops of the grass: the heads of it catch the light in drifts, where the ground rises a little.
for (let k = 0; k < 520; k++) {
  const x = r.range(0, W), y = r.range(680, H), kk = smooth(650, 1000, y), h = r.range(14, 20) + 22 * kk;
  if (!inside(x, y) || onPath(x, y) || nA(x / 170, y / 50) + 0.3 * (nB(x / 50, y / 30) - 0.5) < 0.6) continue;
  p.tryStroke({ ...stroke, color: mix(mix('#cdb45a', '#e6cc72', r()), '#fff0b0', r() * 0.2), width: r.range(4.8, 6), opacity: r.range(0.4, 0.7), taper: [0.1, 0.7], points: [[x, y], [x - h * 0.2, y - h * 0.6], [x - h * 0.5, y - h]] });
}

p.save();
