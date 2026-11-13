// The wooded slope at the left, which comes down across the picture into the valley. It is
// painted tree by tree, the far ones first: dark firs, and among them trees that have turned
// red, orange and gold. The sun is on the right side of every one. The two near figures
// stand against this slope.
'use strict';
const { studio, open, far, nA, nC, brow, slopeLine } = require('./scene');
const { mix, smooth } = studio;

const p = open('slope');
const r = p.rng;
const dist = (x, y) => 0.46 - 0.26 * smooth(280, 700, y);
// Where the sun is on the slope and where it is not: the slope has folds, and the side of each fold that is turned from the sun is in shade.
const sunny = (x, y) => smooth(0.4, 0.62, nA(x / 190 + 20, y / 120 + 3) + 0.25 * (nC(x / 60, y / 50) - 0.5));
p.fill({ inside: (x, y) => y > slopeLine(x) + 6 && y < brow(x) + 8, bounds: [0, 250, 900, 760], width: 16, length: 50, spacing: 0.5, angle: () => 0.5 + r.range(-0.2, 0.2), color: (x, y) => far(mix(mix('#1e2a2c', '#2c3028', nC(x / 60, y / 60)), mix('#34402f', '#544428', nC(x / 60, y / 60)), sunny(x, y)), x, y, dist(x, y)), stroke: { brush: 'bristle', opacity: 0.95, mix: 0.2 } });

const trees = [];
for (let k = 0; k < 3000; k++) {
  const x = r.range(-12, 880), y0 = slopeLine(x), y1 = brow(x) + 10;
  if (y1 - y0 > 4) trees.push([x, y0 + (y1 - y0) * Math.pow(r(), 0.85)]);
}
trees.sort((a, b) => a[1] - b[1]);
const turned = [['#5e2a1e', '#de6238'], ['#6e4420', '#ec983c'], ['#72581e', '#f6c64c'], ['#4c5226', '#a4ac50'], ['#6a2420', '#c84434']];
for (const [x, y] of trees) {
  const size = (13 + 30 * smooth(280, 720, y)) * (r() < 0.08 ? r.range(1.3, 1.6) : r.range(0.7, 1.25)), d = dist(x, y), fir = nA(x / 90 + 3, y / 70) + r.range(-0.25, 0.25) < 0.47, sun = sunny(x, y);
  if (fir) {
    const h = size * 1.6, w = Math.max(4.8, size * 0.46);
    p.tryStroke({ brush: 'bristle', color: far(mix(mix('#16262a', '#20322e', r()), mix('#24392e', '#34503a', r()), sun), x, y, d), width: w, mix: 0.12, dry: 0.04, rag: 0.25, taper: [0, 0.75], cap: 'round', points: [[x, y], [x + r.range(-2.5, 2.5), y - h]] });
    p.tryStroke({ brush: 'bristle', color: far(mix(mix('#2c4640', '#3e5c4c', r()), mix('#6c8a48', '#b4b860', r()), sun), x, y, d), width: Math.max(4.8, w * 0.42), opacity: 0.55 + 0.4 * sun, mix: 0.12, dry: 0.04, rag: 0.3, taper: [0, 0.75], cap: 'round', points: [[x + w * 0.3, y - 2], [x + w * 0.16, y - h * 0.9]] });
  } else {                                                               // a round head of leaves: two dark dabs that cross, and the lit leaves on the side of the sun
    const [dark, lit] = turned[Math.min(4, Math.floor((nC(x / 70 + 9, y / 60 + 4) * 0.7 + r() * 0.5) * 4.2))], w = Math.max(4.8, size * 0.44), l = Math.max(size * 0.95, w * 2.1), cy = y - size * 0.62;
    for (const a of [-0.65, 0.6]) p.tryStroke({ brush: 'bristle', color: far(mix(mix(dark, '#1c2630', 0.45), dark, sun), x, y, d), width: w, mix: 0.12, dry: 0.04, rag: 0.35, cap: 'round', points: [[x - Math.sin(a) * l / 2, cy + Math.cos(a) * l / 2], [x + Math.sin(a) * l / 2, cy - Math.cos(a) * l / 2]] });
    const w2 = Math.max(4.8, w * 0.6), l2 = Math.max(l * 0.62, w2 * 2.1);
    for (const [a, ox, oy] of [[0.9, 0.16, -0.2], [-0.3, 0.3, 0.02]]) p.tryStroke({ brush: 'bristle', color: far(mix(mix(lit, dark, 0.55), mix(lit, '#ffe9a0', r() * 0.3), sun), x, y, d), width: w2, opacity: 0.92, mix: 0.12, dry: 0.04, rag: 0.4, cap: 'round', points: [[x + ox * size - Math.sin(a) * l2 / 2, cy + oy * size + Math.cos(a) * l2 / 2], [x + ox * size + Math.sin(a) * l2 / 2, cy + oy * size - Math.cos(a) * l2 / 2]] });
  }
}

p.save();
