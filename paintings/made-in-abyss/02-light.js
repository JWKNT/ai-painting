// The air and the light: the haze, worked over with a brush; the far wall of the layer, pale
// cliffs that go up out of sight; and the light itself, coming down the middle in a broad
// shaft with a little color at its edges.
'use strict';
const { studio, open, W, H, SHAFT, GROUND, shaft, air, far, nA, nB } = require('./scene');
const { shift, mix, wave, clamp, smooth } = studio;

const p = open('light');
const r = p.rng;
const fall = (x, y) => Math.PI / 2 - SHAFT.lean + (nB(x / 300, y / 200) - 0.5) * 0.5;

p.fill({ bounds: [0, 0, W, H], width: 46, length: 300, spacing: 0.55, overlap: 0.55, angle: fall, color: (x, y) => shift(air(x, y), r.range(-1.5, 1.5), r.range(-0.015, 0.02), r.range(-0.006, 0.007)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, H], width: 24, length: 170, spacing: 0.9, overlap: 0.7, angle: fall, color: (x, y) => shift(air(x + r.range(-30, 30), y + r.range(-24, 24)), r.range(-2.5, 2.5), r.range(-0.01, 0.025), r.range(-0.008, 0.01)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });

// The far wall: great pale buttresses of rock that go up out of sight. They are soft in the
// haze, lighter on the side toward the shaft, with level beds of stone across them and a few
// hollows. They are laid in with a soft brush, so that they are shapes and not streaks.
for (const [x0, x1, d, lean] of [[-60, 250, 0.76, 0.04], [286, 500, 0.84, -0.03], [1010, 1250, 0.82, 0.05], [1290, 1660, 0.74, -0.04], [560, 650, 0.9, 0.02]]) {
  const toShaft = SHAFT.x > (x0 + x1) / 2 ? 1 : -1;
  const e0 = (y) => x0 + lean * y + 26 * (nA(y / 120, x0) - 0.5), e1 = (y) => x1 + lean * y * 0.6 + 26 * (nA(y / 120, x1) - 0.5);
  const rock = (x, y) => { const u = (x - e0(y)) / Math.max(1, e1(y) - e0(y)), side = toShaft > 0 ? u : 1 - u; return far(mix(mix('#b98c96', '#e6c4b2', smooth(0.1, 0.9, side)), '#f4e0c8', smooth(0.55, 0.8, nB(x / 90, y / 44)) * 0.6), x, y, d); };
  const inside = (x, y) => x > e0(y) && x < e1(y) && y < GROUND + 4, up = () => Math.PI / 2 - lean + r.range(-0.06, 0.06);
  p.fill({ inside, bounds: [x0 - 40, -10, x1 + 60, GROUND + 4], width: 34, length: 170, spacing: 0.5, angle: up, color: rock, stroke: { brush: 'soft', opacity: 0.55 } });
  p.fill({ inside, bounds: [x0 - 40, -10, x1 + 60, GROUND + 4], width: 20, length: 110, spacing: 0.8, overlap: 0.7, angle: up, color: (x, y) => rock(x + r.range(-12, 12), y + r.range(-20, 20)), stroke: { brush: 'soft', opacity: 0.4 } });
  for (let k = 0; k < Math.round((x1 - x0) / 26); k++) {                 // beds of stone across it
    const y = r.range(20, GROUND - 30), x = r.range(e0(y) + 10, e1(y) - 50), len = r.range(50, 130);
    if (x + len > e1(y)) continue;
    p.tryStroke({ brush: 'bristle', color: far(r() < 0.5 ? '#a8848e' : '#f6e6d0', x, y, d), width: r.range(6, 10), opacity: 0.3, mix: 0.3, dry: 0.1, rag: 0.4, taper: [0.2, 0.3], points: [[x, y], [x + len / 2, y + r.range(-3, 3)], [x + len, y + r.range(-5, 5)]] });
  }
  for (let k = 0; k < 3; k++) {                                          // hollows in it
    const y = r.range(80, GROUND - 120), x = r.range(e0(y) + 30, e1(y) - 30), tall = r.range(60, 120);
    p.tryStroke({ brush: 'soft', color: far('#9c7c8a', x, y, d), width: r.range(24, 38), opacity: 0.22, points: [[x, y], [x + r.range(-6, 6), y + tall]] });
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
