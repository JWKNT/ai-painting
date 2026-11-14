// The sky, and the cliffs of ice behind the lake. The sky is one grey cloud, a little
// lighter at the upper left. Far off, pale walls of ice and snow stand in the falling
// snow, each fainter than the one in front of it. At the left a wall of blue ice comes
// near, and down it hangs a fall of water that has frozen: a long pale column of ice.
// At the far left stands a dark crag of rock, with snow on its ledges and a lamp of the
// Chozo in a hollow of it.
'use strict';
const { studio, open, W, SHORE, skyColor, veil, nA, nB, nC, nD } = require('./scene');
const { mix, shift, clamp, smooth, through, glow } = studio;

const p = open('cliffs');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.24, dry: 0.04, rag: 0.3, cap: 'round' };

// ---------------------------------------------------------------- the sky
const flow = (x, y) => -0.12 + (nB(x / 380, y / 180) - 0.5) * 0.4;
p.fill({ bounds: [0, 0, W, SHORE + 10], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: flow, color: (x, y) => shift(skyColor(x, y), r.range(-2, 2), r.range(-0.02, 0.02), r.range(-0.012, 0.012)), stroke: { ...line, opacity: 0.93 } });
p.fill({ bounds: [0, 0, W, SHORE + 10], width: 20, length: 160, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-14, 14)), r.range(-3, 3), r.range(-0.02, 0.02), r.range(-0.016, 0.016)), stroke: { ...line, opacity: 0.7 } });

// ---------------------------------------------------------------- walls of ice and snow, far ones first
// A wall: its top line, how far off it is, its tone. Its face has upright streaks; snow lies on its top and on its ledges.
function wall(top, x0, x1, tone, d, seed, streak = 0.5) {
  p.fill({ inside: (x, y) => y > top(x) + 9 * (nC(x / 34, seed) - 0.5) && y < SHORE + 6, bounds: [x0, 0, x1, SHORE + 6], width: 13, length: 110, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2 + r.range(-0.07, 0.07),
    color: (x, y) => { const s = nA(x / 16, y / 260 + seed), led = smooth(0.62, 0.72, nD(x / 150 + seed, y / 26)); let c = mix(tone, '#4c6470', (s - 0.5) * streak + 0.1); c = mix(c, '#eef2f4', led * 0.7); c = mix(c, '#f4f6f8', smooth(26, 0, y - top(x)) * 0.8); return veil(c, x, y, d); }, stroke: { ...line, opacity: 0.95 } });
}
wall(through([[520, 300], [640, 262], [760, 276], [880, 250], [1010, 262], [1160, 232], [1320, 246], [1480, 210], [1620, 226]]), 520, W + 20, '#aebcc6', 0.84, 1, 0.3);
wall(through([[-20, 150], [120, 120], [260, 136], [400, 100], [520, 160], [600, 250], [660, 330], [720, 400], [780, 456]]), -20, 790, '#7894a8', 0.42, 2, 0.6);
wall(through([[1180, 330], [1280, 296], [1400, 250], [1500, 190], [1620, 150]]), 1180, W + 20, '#8aa2b4', 0.52, 3, 0.5);
// The frozen fall: a column of ice down the left wall, wide at its head and broken into long teeth at its foot. It is a pale blue-green, lighter than the wall.
{ const cx = 352, half = (y) => 46 - 12 * smooth(140, 420, y) + 5 * (nC(3, y / 30) - 0.5);
  p.fill({ inside: (x, y) => y > 112 && y < 474 && Math.abs(x - cx) < half(y), bounds: [cx - 56, 112, cx + 56, 474], width: 7, length: 90, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2 + r.range(-0.03, 0.03), color: (x, y) => veil(mix(mix('#b4d8dc', '#eaf6f6', nA(x / 7, y / 200)), '#7ca8b4', smooth(0.5, 1, Math.abs(x - cx) / half(y)) * 0.5), x, y, 0.36), stroke: { ...line, rag: 0.15, opacity: 0.95 } });
  for (let k = 0; k < 9; k++) { const x = cx + r.range(-40, 40), y0 = r.range(380, 440), l = r.range(40, 90); p.tryStroke({ ...line, color: veil(mix('#c8e4e8', '#f4fafa', r()), x, y0, 0.34), width: r.range(5, 9), taper: [0, 0.9], points: [[x, y0], [x + r.range(-2, 2), y0 + l * 0.5], [x + r.range(-3, 3), y0 + l]] }); }
  for (let k = 0; k < 7; k++) { const x = cx + r.range(-34, 34), y0 = r.range(130, 360); p.tryStroke({ brush: 'round', color: '#f8fcfc', width: 4, opacity: 0.6, taper: [0.3, 0.6], points: [[x, y0], [x + r.range(-2, 2), y0 + r.range(40, 110)]] }); }
  p.stroke({ brush: 'soft', color: '#e8f0f2', width: 60, opacity: 0.3, points: [[cx - 80, 100], [cx, 92], [cx + 80, 104]] }); }   // the snow at its head

// ---------------------------------------------------------------- the dark crag at the far left, nearer than the walls
{ const top = through([[-20, 40], [60, 20], [130, 60], [170, 150], [196, 260], [214, 380], [236, 470], [262, 530]]);
  p.fill({ inside: (x, y) => x < 270 && y < 700 && x < 236 + (y - 470) * 0.44 + 40 && y > top(clamp(x, -20, 262)) + 8 * (nC(x / 20, 9) - 0.5), bounds: [-20, 0, 300, 700], width: 12, length: 70, spacing: 0.5, overlap: 0.6, angle: () => 0.2 + r.range(-0.2, 0.2),
    color: (x, y) => { const bed = nA(x / 60, y / 22), snow = smooth(0.6, 0.7, nD(x / 90 + 5, y / 30)); return veil(mix(mix('#2c3238', '#4c545a', bed), '#e8eef0', snow * 0.85), x, y, 0.16); }, stroke: { ...line, rag: 0.4, opacity: 0.96 } });
  // the lamp in its hollow: a dark hollow, and in it a warm light
  p.tryStroke({ ...line, color: '#1c1c1e', width: 30, points: [[122, 232], [122, 296]] });
  for (const [w, op] of [[90, 0.1], [50, 0.2], [24, 0.4]]) glow(p, 122, 270, w, mix('#ff9a30', '#ffe6a0', 1 - w / 100), op, 6);
  p.tryStroke({ ...line, color: '#fff0c0', width: 7, taper: [0.2, 0.7], points: [[122, 284], [121, 262]] }); }

// ---------------------------------------------------------------- the falling snow hides the feet of the far walls
for (let k = 0; k < 22; k++) { const x = r.range(-100, W - 200), len = r.range(300, 760), y = r.range(SHORE - 110, SHORE - 6); p.stroke({ brush: 'soft', color: mix('#c4ced4', '#e8eeee', r()), width: r.range(26, 56), opacity: r.range(0.08, 0.18), points: [[x, y], [x + len / 2, y + r.range(-6, 6)], [x + len, y]] }); }

p.save();
