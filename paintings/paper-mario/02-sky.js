// The sky and the far land. The sky is gold: deep amber overhead, pale and bright low down
// behind the Great Tree. It has no clouds, only long soft bands of lighter gold. At the
// edge of the world stand hills with flat tops, like round boxes, dark against the bright
// sky and soft with the gold air. High at the left hang strings of small white beads.
'use strict';
const { studio, open, W, HORIZON, SUN, skyColor, glare, far, nB, nC } = require('./scene');
const { mix, shift, glow } = studio;

const p = open('sky');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.28, dry: 0.04, rag: 0.3, cap: 'round' };
// the strokes of the sky lie nearly level, and bend a little over the bright place
const flow = (x, y) => (nB(x / 360, y / 170) - 0.5) * 0.22 + glare(x, y, 600) * Math.sign(x - SUN.x) * 0.12;
p.fill({ bounds: [0, 0, W, HORIZON + 12], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: flow, color: (x, y) => shift(skyColor(x, Math.min(y, HORIZON)), r.range(-2, 2), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { ...line, opacity: 0.93 } });
p.fill({ bounds: [0, 0, W, HORIZON + 12], width: 20, length: 160, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-30, 30), Math.min(y + r.range(-12, 12), HORIZON)), r.range(-3, 3), r.range(-0.02, 0.04), r.range(-0.012, 0.014)), stroke: { ...line, opacity: 0.72 } });
p.fill({ bounds: [0, 0, W, HORIZON + 12], width: 9, length: 110, spacing: 1.6, overlap: 0.8, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-10, 10), Math.min(y + r.range(-6, 6), HORIZON)), r.range(-4, 4), r.range(-0.02, 0.05), r.range(-0.02, 0.024)), stroke: { ...line, opacity: 0.6, taper: [0.4, 0.4] } });
// long soft bands of lighter gold
for (let k = 0; k < 16; k++) { const x = r.range(-200, W - 300), y = r.range(40, 480), len = r.range(360, 800), a = r.range(-0.05, 0.05); p.stroke({ brush: 'soft', color: mix('#ffd46c', '#fff0b8', r()), width: r.range(18, 44), opacity: r.range(0.06, 0.13), taper: [0.5, 0.6], points: [[x, y], [x + len / 2, y + len * a / 2 + r.range(-8, 8)], [x + len, y + len * a]] }); }
// the bright place
for (const [w, op, n] of [[460, 0.07, 5], [300, 0.1, 6], [170, 0.14, 6]]) glow(p, SUN.x, SUN.y, w, mix('#ffe08c', '#fff8dc', 1 - w / 480), op, n, 0.6);

// ---------------------------------------------------------------- the hills with flat tops, at the edge of the world
// Each is a round box: straight sides, a level top, and a rim of light along the top. They stand one behind another.
function box(x, w, h, tone, d) {
  const y0 = HORIZON + 6 - h, c = (px, py) => far(mix(tone, '#2c2208', (px - x + w / 2) / w * 0.5 + (nC(px / 60, 3) - 0.5) * 0.12), px, py, d);
  p.fill({ inside: (px, py) => Math.abs(px - x) < w / 2 && py > y0 + 3 * nC(px / 40, x) && py < HORIZON + 10, bounds: [x - w / 2, y0 - 2, x + w / 2, HORIZON + 10], width: 7, length: Math.max(15, h * 0.7), spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2 + r.range(-0.02, 0.02), color: c, stroke: { ...line, cap: 'flat', rag: 0.1, opacity: 0.96 } });
  p.tryStroke({ ...line, cap: 'round', color: far('#c89c34', x, y0, d * 0.7), width: 5.5, opacity: 0.85, points: [[x - w / 2 + 2, y0 + 3], [x, y0 + 1], [x + w / 2 - 2, y0 + 3]] });
  for (let k = 0; k < Math.round(w / 26); k++) { const px = x - w / 2 + 10 + r() * (w - 20), py = y0 + 12 + r() * Math.max(1, h - 30); if (py < HORIZON - 14) p.tryStroke({ brush: 'round', color: far('#b08828', px, py, d), width: 4, opacity: 0.4, taper: [0.5, 0.5], points: [[px - 6.2, py], [px + 6.2, py]] }); }   // the small gold marks on its side
}
for (const [x, w, h, d] of [[110, 190, 96, 0.42], [330, 150, 62, 0.52], [1010, 170, 74, 0.5], [1230, 240, 118, 0.4], [1470, 180, 84, 0.44], [1590, 120, 130, 0.34], [860, 110, 46, 0.58], [-10, 120, 140, 0.32]]) box(x, w, h, '#4a3a0e', d);

// ---------------------------------------------------------------- strings of white beads, high at the left
for (const [x0, y0, x1, y1, sag] of [[-20, 30, 520, 44, 120], [-20, 8, 660, 6, 96], [40, 0, 430, 0, 60]]) {
  const n = Math.round(Math.hypot(x1 - x0, y1 - y0) / 21);
  for (let i = 0; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + sag * 4 * t * (1 - t); p.tryStroke({ brush: 'round', color: '#fff8e4', width: 4.6, opacity: 0.6, taper: [0.5, 0.5], points: [[x - 6.2, y], [x + 6.2, y]] }); }
}

p.save();
