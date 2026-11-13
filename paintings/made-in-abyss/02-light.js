// The air and the light: the haze, worked over with a brush; the far wall of the layer, pale
// cliffs that go up out of sight; and the light itself, coming down the middle in a broad
// shaft with a little color at its edges.
'use strict';
const { studio, open, W, H, SHAFT, GROUND, shaft, air, far, nA, nB } = require('./scene');
const { shift, mix, wave, clamp, smooth } = studio;

const p = open('light');
const r = p.rng;
const fall = (x, y) => Math.PI / 2 - SHAFT.lean + (nB(x / 300, y / 200) - 0.5) * 0.5;

p.fill({ bounds: [0, 0, W, H], width: 46, length: 300, spacing: 0.55, overlap: 0.55, angle: fall, color: (x, y) => shift(air(x, y), r.range(-3, 3), r.range(-0.03, 0.04), r.range(-0.012, 0.014)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, H], width: 24, length: 170, spacing: 0.9, overlap: 0.7, angle: fall, color: (x, y) => shift(air(x + r.range(-30, 30), y + r.range(-24, 24)), r.range(-5, 5), r.range(-0.02, 0.05), r.range(-0.016, 0.02)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });

// The far wall: great pale faces of rock, upright, a little rosier than the air, with darker clefts.
for (const [x0, x1, top, d] of [[-40, 300, -20, 0.8], [240, 520, 60, 0.86], [1040, 1320, 40, 0.84], [1280, 1640, -20, 0.78], [520, 700, 180, 0.92], [900, 1060, 150, 0.92]]) {
  const rock = (x, y) => far(mix(mix('#e0b8a8', '#c89c96', nA(x / 50, y / 200)), '#f2dcc4', smooth(0.5, 0.8, nB(x / 26, y / 300))), x, y, d);
  p.fill({ inside: (x, y) => x > x0 + 30 * (nA(y / 90, x0) - 0.5) && x < x1 + 30 * (nA(y / 90, x1) - 0.5) && y > top + 40 * (nB(x / 60, top) - 0.5) && y < GROUND, bounds: [x0, top, x1, GROUND], width: 22, length: 150, spacing: 0.5, angle: () => Math.PI / 2 + r.range(-0.06, 0.06), color: rock, stroke: { brush: 'bristle', opacity: 0.85, mix: 0.2, dry: 0.05, rag: 0.3 } });
  for (let k = 0; k < 5; k++) {                                          // clefts
    const x = r.range(x0 + 20, x1 - 20), y = r.range(top + 40, GROUND - 200), len = r.range(120, 300);
    p.tryStroke({ brush: 'bristle', color: far('#9a7880', x, y, d), width: r.range(6, 11), opacity: 0.45, mix: 0.3, dry: 0.1, rag: 0.4, taper: [0.3, 0.5], points: [[x, y], [x + r.range(-10, 10), y + len / 2], [x + r.range(-14, 14), y + len]] });
  }
}
// Haze lying in front of the wall, low down.
for (let k = 0; k < 16; k++) {
  const x = r.range(-100, W - 200), y = r.range(GROUND - 220, GROUND - 10), len = r.range(260, 560);
  p.stroke({ brush: 'soft', color: mix('#fff6de', '#f2dcc0', r()), width: r.range(40, 80), opacity: r.range(0.14, 0.26), points: wave(x, y, x + len, y + r.range(-8, 8), 5, 1, 7) });
}

// The shaft of light: wide and faint, then narrower and brighter, and a thread of color down each edge of it.
const at = (y, off = 0) => [SHAFT.x + y * SHAFT.lean + off * (SHAFT.half + y * 0.12), y];
for (const [k, o] of [[2.4, 0.16], [1.4, 0.2], [0.7, 0.24]]) p.stroke({ brush: 'soft', color: '#fffdf0', width: SHAFT.half * k * 1.2, opacity: o, taper: [0, 0.2], points: [at(-80), at(400), at(H + 40)] });
for (const [off, color] of [[-1.05, '#c8f0c8'], [-0.9, '#fff2a8'], [0.95, '#ffd0d8'], [1.1, '#d8d4ff']]) p.stroke({ brush: 'soft', color, width: 44, opacity: 0.12, taper: [0, 0.3], points: [at(-60, off), at(380, off), at(GROUND + 120, off)] });
for (let k = 0; k < 14; k++) {                                          // rays inside it
  const off = r.range(-0.9, 0.9), y0 = r.range(-40, 200), y1 = y0 + r.range(300, 620);
  p.stroke({ brush: 'bristle', color: '#fffef4', width: r.range(8, 20), opacity: r.range(0.08, 0.2) * clamp(shaft(...at(y0, off)) + 0.4, 0, 1), mix: 0.4, dry: 0.2, rag: 0.5, taper: [0.2, 0.5], points: [at(y0, off), at((y0 + y1) / 2, off), at(y1, off)] });
}

p.save();
