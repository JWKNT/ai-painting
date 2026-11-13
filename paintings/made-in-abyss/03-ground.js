// The plain: the floor of the layer, pale sand with moss on it, going back level to the foot
// of the far wall. Pieces of the city lie on it, each with light on top and a shadow beside it.
'use strict';
const { studio, open, W, H, GROUND, shaft, far, lightAt, nA, nB, nC, STONE, CRUST } = require('./scene');
const { mix, wave, clamp, smooth } = studio;

const p = open('ground');
const r = p.rng;
const near = (y) => clamp((y - GROUND) / (H - GROUND), 0, 1);           // 0 at the far edge of the plain, 1 at the bottom of the picture
const sand = (x, y) => {
  const k = near(y), moss = smooth(0.5, 0.64, nA(x / (140 + 520 * k) + 3, y / (12 + 62 * k)) + 0.12 * (nB(x / 44, y / 12) - 0.5));
  let c = mix(mix('#f2dcc8', '#e6c0ac', nB(x / 320, y / 50)), '#f8e8d0', smooth(0.5, 0.8, nC(x / 220, y / 28)));
  c = mix(c, mix('#bccc94', '#8fb272', nC(x / 96, y / 18)), moss * 0.85);
  c = mix(c, '#fff9e4', shaft(x, y) * 0.5);
  return far(c, x, y, 0.82 - 0.6 * k);
};
const level = () => r.range(-0.035, 0.035), stroke = { brush: 'bristle', opacity: 0.92, mix: 0.25, dry: 0.04, rag: 0.3 };
p.fill({ bounds: [0, GROUND, W, GROUND + 120], width: 8, length: 84, spacing: 0.5, angle: level, color: sand, stroke });
p.fill({ bounds: [0, GROUND + 100, W, H], width: 17, length: 170, spacing: 0.5, angle: level, color: sand, stroke });
p.fill({ bounds: [0, GROUND + 60, W, H], width: 9, length: 96, spacing: 1.1, overlap: 0.7, angle: level, color: (x, y) => sand(x + r.range(-40, 40), y + r.range(-6, 6)), stroke: { ...stroke, opacity: 0.8 } });

// Pieces of the city on the plain, the far ones first: low blocks, half in the sand.
const pieces = [];
for (let k = 0; k < 30; k++) { const k1 = Math.pow(r(), 1.5); pieces.push([r.range(-20, 1190), k1]); }
pieces.sort((a, b) => a[1] - b[1]);
for (const [x, k1] of pieces) {
  const y = GROUND + 8 + k1 * 170, s = Math.max(7, (8 + 30 * k1) * r.range(0.6, 1.2)), d = 0.8 - 0.42 * k1, L = lightAt(x, y), lean = r.range(-0.3, 0.3);
  const lit = far(mix(STONE.lit, r.pick(CRUST), 0.5), x, y, d), shade = far(mix(STONE.shade, STONE.half, r.range(0.3, 0.8)), x, y, d);
  p.tryStroke({ brush: 'soft', color: far('#b48f96', x, y, d), width: Math.max(8.2, s * 0.55), opacity: 0.28, points: [[x - L[0] * s * 0.4 - s * 0.7, y + s * 0.2], [x - L[0] * s * 2.4 + s * 0.7, y + s * 0.28]] });   // its shadow
  const w = Math.max(4.8, s * 0.56), ends = [[x - s, y - w * 0.4], [x + s, y - w * 0.4 + lean * s * 0.3]];
  p.tryStroke({ brush: 'bristle', color: shade, width: w, mix: 0.15, dry: 0.04, rag: 0.3, cap: 'round', points: ends });
  p.tryStroke({ brush: 'bristle', color: lit, width: Math.max(4.8, s * 0.3), mix: 0.1, dry: 0.04, rag: 0.4, cap: 'round', points: ends.map(([px, py]) => [px * 0.9 + x * 0.1 + lean * 3, py - w * 0.5]) });
}

// Haze on the far part of the plain.
for (let k = 0; k < 12; k++) {
  const x = r.range(-120, W - 300), y = GROUND + r.range(-10, 50), len = r.range(300, 620);
  p.stroke({ brush: 'soft', color: mix('#fff6de', '#f4e0c6', r()), width: r.range(34, 64), opacity: r.range(0.14, 0.26), points: wave(x, y, x + len, y + r.range(-5, 5), 4, 1, 7) });
}

p.save();
