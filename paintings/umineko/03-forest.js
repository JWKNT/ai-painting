// The forest of the island, beyond the garden: low hills, then the trees, dark against the
// sky. They are round heaps of leaves. The light of the sky is on their tops, and the gold
// of the garden comes up a little into their feet.
'use strict';
const { studio, open, W, VORTEX, skyColor, nA, nB } = require('./scene');
const { mix, ramp, noise2, clamp, through } = studio;

const p = open('forest');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.12, dry: 0.03, rag: 0.25, cap: 'round' };
const FOOT = 632;                                                        // where the long hedge hides their feet
const toSky = (x, y) => { const dx = VORTEX.x - x, dy = VORTEX.y - y, l = Math.hypot(dx, dy) || 1; return [dx / l * 0.5, dy / l * 0.5 - 0.5]; };

// The hills behind them: two long dark backs.
for (const [pts, c, d] of [[[[-20, 470], [200, 452], [420, 470], [640, 496], [860, 504], [1080, 492], [1300, 470], [1480, 452], [1620, 462]], '#1c0c30', 0.5], [[[-20, 492], [260, 478], [500, 496], [760, 512], [1000, 514], [1240, 500], [1460, 482], [1620, 488]], '#140a22', 0.3]]) {
  const top = through(pts);
  p.fill({ inside: (x, y) => y > top(x) + 4 * (nB(x / 40, d * 9) - 0.5), bounds: [0, 440, W, FOOT], width: 9, length: 70, spacing: 0.5, angle: () => r.range(-0.1, 0.1), color: (x, y) => mix(mix(c, '#2c1244', nA(x / 120, y / 30) * 0.6), skyColor(x, 430), d * 0.4), stroke: { ...line, opacity: 0.92 } });
}

// The trees. Each is a round tree: a crown that is a heap of round tops, on a body of leaves that goes down behind the hedge.
// They stand higher at each side of the picture than in the middle, behind the arbor. The far row is pale with the air; the
// near row is dark. The light of the sky is on the tops that are turned to the middle of its turning.
const skyline = through([[-20, 414], [140, 398], [300, 430], [460, 468], [640, 500], [860, 514], [1060, 504], [1240, 474], [1400, 440], [1540, 422], [1620, 430]]);
let seed = 0;
function tree(x, top, wide, far) {
  const puffs = [[x + r.range(-4, 4), top + wide * 0.42, wide * 0.42], [x - wide * 0.3, top + wide * 0.72, wide * 0.4], [x + wide * 0.32, top + wide * 0.76, wide * 0.4]];
  for (let y = top + wide * 1.12; y < FOOT + 16; y += wide * 0.52) for (const s of [-1, 1]) puffs.push([x + s * wide * 0.27 + r.range(-6, 6), y, wide * 0.47]);
  const tones = (t, px, py) => mix(mix(ramp(['#04040a', '#080d10', '#0f1c1b', '#1c3030', '#3c3458'], t), '#3c1c58', far * 0.34), '#3a2a12', clamp((py - 592) / 46, 0, 1) * 0.4);
  studio.mass(p, puffs, { light: toSky, tones, base: FOOT + 6, bias: 0.24, contrast: 0.6, fall: 0.16, grain: 0.3, mix: 0.2, noise: noise2(3400 + ++seed), stroke: { rag: 0.4 }, layers: [[20, 46, 0.95, 6, 0.55], [11, 26, 0.7, 4, 2.2]] });
}
const rows = [[], []];
for (let x = -30; x < W + 40; x += r.range(40, 64)) rows[0].push([x, skyline(clamp(x, 0, W)) + r.range(-12, 18), r.range(52, 74)]);
for (let x = -10; x < W + 40; x += r.range(52, 84)) rows[1].push([x, skyline(clamp(x, 0, W)) + r.range(22, 58), r.range(64, 96)]);
for (const [x, top, wide] of rows[0]) tree(x, top, wide, 1);
for (const [x, top, wide] of rows[1]) tree(x, top, wide, 0);
// The gold of the garden in the air at their feet.
for (let k = 0; k < 14; k++) { const x = r.range(-100, W - 200), len = r.range(300, 600), y = r.range(604, 634); p.stroke({ brush: 'soft', color: mix('#b07818', '#e8b83c', r()), width: r.range(22, 40), opacity: r.range(0.07, 0.13), points: [[x, y], [x + len / 2, y + r.range(-3, 3)], [x + len, y]] }); }

p.save();
