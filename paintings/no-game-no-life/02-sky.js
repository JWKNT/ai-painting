// The sky, and the pieces at the edge of the world. The sky is a clear blue, and pale rose
// low down. A great pale moon stands in it at the right. At the edge of the world, beyond
// the mountains, stand the pieces of a game of chess: a rook, a knight, a bishop, a king,
// a queen and a pawn, each many miles high. They are so far off that they are only a
// little darker than the sky, light on their left sides, and long clouds lie across their
// feet. Great heaped clouds stand in the sky nearer to us.
'use strict';
const { studio, open, W, HORIZON, SUNWARD, skyColor, far, heap, nA, nB } = require('./scene');
const { mix, shift, ramp, noise2, clamp, smooth, inPoly, glow } = studio;

const p = open('sky');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.28, dry: 0.04, rag: 0.3, cap: 'round' };
const flow = (x, y) => -0.05 + (nB(x / 340, y / 160) - 0.5) * 0.3;
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: flow, color: (x, y) => shift(skyColor(x, Math.min(y, HORIZON)), r.range(-2, 2), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { ...line, opacity: 0.93 } });
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 20, length: 160, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-30, 30), Math.min(y + r.range(-12, 12), HORIZON)), r.range(-3, 3), r.range(-0.02, 0.04), r.range(-0.012, 0.014)), stroke: { ...line, opacity: 0.72 } });

// ---------------------------------------------------------------- the moon: pale, a little lighter than the sky, with faint seas; its lower part is lost in the rose air
{ const mx = 1420, my = 196, R = 160;
  p.fill({ inside: (x, y) => Math.hypot(x - mx, y - my) < R - 3, bounds: [mx - R, my - R, mx + R, my + R], width: 12, length: 60, spacing: 0.5, overlap: 0.6, angle: (x, y) => 0.5 + (nB(x / 120, y / 120) - 0.5) * 2.4, color: (x, y) => { const sea = smooth(0.5, 0.66, nA((x - mx) / 150 + 4, (y - my) / 130 + 2)); let c = mix('#e6effa', '#bdd0f0', sea * 0.6); c = mix(c, '#fffaf6', smooth(0.2, -0.9, ((x - mx) * 0.62 + (y - my) * 0.78) / R) * 0.5); return mix(c, skyColor(x, y), 0.34 + 0.5 * smooth(my - 20, my + R, y)); }, stroke: { ...line, mix: 0.3, opacity: 0.9 } });
  for (let i = 0; i < 24; i++) { const a0 = Math.PI * 0.86 + i / 24 * Math.PI * 1.1; p.tryStroke({ brush: 'round', color: '#ffffff', width: 4.4, opacity: 0.4, points: studio.arc(mx, my, R - 4, a0, a0 + Math.PI * 1.1 / 24 * 1.2, 5) }); } }

// ---------------------------------------------------------------- the pieces
// Each is turned on its upright middle line, so it is given by its half width at each height: [height, half width], both as parts of
// its whole height. It is filled with short upright strokes, light at the left and violet at the right; then one clean stroke goes
// down each of its two sides, so that its shape is plain. All of it is pale with the far air.
const BASE = [[0, 0.19], [0.035, 0.19], [0.05, 0.155], [0.085, 0.165], [0.1, 0.125], [0.14, 0.105]];
const PIECES = {
  pawn: [...BASE, [0.3, 0.075], [0.5, 0.06], [0.55, 0.11], [0.6, 0.11], [0.62, 0.06], [0.66, 0.09], [0.72, 0.125], [0.82, 0.14], [0.92, 0.115], [0.98, 0.06], [1, 0.02]],
  rook: [...BASE, [0.3, 0.095], [0.62, 0.085], [0.67, 0.13], [0.73, 0.13], [0.76, 0.11], [0.8, 0.15], [1, 0.15]],
  bishop: [...BASE, [0.3, 0.075], [0.54, 0.055], [0.58, 0.105], [0.63, 0.105], [0.65, 0.055], [0.69, 0.08], [0.76, 0.115], [0.84, 0.105], [0.92, 0.055], [0.95, 0.03], [0.965, 0.045], [0.985, 0.04], [1, 0.008]],
  queen: [...BASE, [0.3, 0.08], [0.58, 0.055], [0.62, 0.105], [0.67, 0.105], [0.69, 0.06], [0.77, 0.08], [0.885, 0.14], [0.9, 0.09], [0.93, 0.06], [0.955, 0.035], [0.975, 0.05], [1, 0.03]],
  king: [...BASE, [0.28, 0.085], [0.56, 0.06], [0.6, 0.11], [0.65, 0.11], [0.67, 0.065], [0.75, 0.085], [0.85, 0.13], [0.87, 0.085], [0.885, 0.026], [1, 0.026]],
};
const shade = (k) => { let c = mix('#8a86d6', '#6660b4', smooth(-0.2, 1, k)); return mix(c, '#f6f2ff', smooth(-0.1, -1, k) * 0.75); };
function piece(kind, x, foot, h, d) {
  const prof = PIECES[kind], half = (t) => { for (let i = 0; i + 1 < prof.length; i++) if (t <= prof[i + 1][0]) { const u = (t - prof[i][0]) / (prof[i + 1][0] - prof[i][0] || 1); return (prof[i][1] + (prof[i + 1][1] - prof[i][1]) * u) * h; } return 0; };
  const haze = (py) => d + 0.16 * smooth(foot - h * 0.5, foot, py), tone = (px, py) => far(shade((px - x) / Math.max(1, half((foot - py) / h))), px, py, haze(py));
  p.fill({ inside: (px, py) => py < foot - 2 && py > foot - h + 4 && Math.abs(px - x) < half((foot - py) / h) - 2, bounds: [x - h * 0.2, foot - h, x + h * 0.2, foot], width: 6, length: 20, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2, color: tone, stroke: { ...line, cap: 'flat', rag: 0.04, mix: 0.1, opacity: 0.97 } });
  for (const side of [-1, 1]) for (let i = 0; i + 1 < prof.length; i++) {       // its two sides, piece by piece
    const a = [x + side * prof[i][1] * h, foot - prof[i][0] * h], b = [x + side * prof[i + 1][1] * h, foot - prof[i + 1][0] * h], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 12.4) { const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], ux = (b[0] - a[0]) / (len || 1), uy = (b[1] - a[1]) / (len || 1); p.tryStroke({ ...line, cap: 'round', rag: 0.03, mix: 0.05, color: far(side < 0 ? '#f6f2ff' : '#625cb0', mid[0], mid[1], haze(mid[1])), width: 5, points: [[mid[0] - ux * 6.3, mid[1] - uy * 6.3], [mid[0] + ux * 6.3, mid[1] + uy * 6.3]] }); }
    else p.tryStroke({ ...line, cap: 'round', rag: 0.03, mix: 0.05, color: far(side < 0 ? '#f6f2ff' : '#625cb0', a[0], a[1], haze(a[1])), width: 5, points: [a, b] });
  }
  return { half, tone };
}
// the knight is not turned on a line: it is the head of a horse, seen from the side, on a round foot
function knight(x, foot, h, d) {
  const o = [[-0.19, 0], [0.19, 0], [0.19, 0.035], [0.155, 0.05], [0.165, 0.085], [0.125, 0.1], [0.13, 0.2], [0.16, 0.36], [0.16, 0.52], [0.12, 0.68], [0.05, 0.82], [0.03, 0.9], [0.06, 1.0], [0.0, 0.96], [-0.05, 0.94], [-0.12, 0.9], [-0.2, 0.8], [-0.27, 0.68], [-0.3, 0.6], [-0.27, 0.55], [-0.19, 0.56], [-0.12, 0.61], [-0.07, 0.58], [-0.1, 0.48], [-0.13, 0.36], [-0.11, 0.2], [-0.125, 0.1], [-0.165, 0.085], [-0.155, 0.05], [-0.19, 0.035]].map(([u, v]) => [x + u * h, foot - v * h]);
  const haze = (py) => d + 0.16 * smooth(foot - h * 0.5, foot, py);
  p.fill({ inside: inPoly(o), bounds: [x - h * 0.32, foot - h, x + h * 0.2, foot], width: 6, length: 20, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2, color: (px, py) => far(shade((px - x + h * 0.04) / (h * 0.16)), px, py, haze(py)), stroke: { ...line, cap: 'flat', rag: 0.04, mix: 0.1, opacity: 0.97 } });
  for (let i = 0; i < o.length; i++) { const a = o[i], b = o[(i + 1) % o.length]; if (Math.hypot(b[0] - a[0], b[1] - a[1]) >= 12.4) p.tryStroke({ ...line, cap: 'round', rag: 0.03, mix: 0.05, color: far(a[0] < x - h * 0.02 || b[1] < a[1] - 4 && a[0] < x + h * 0.08 ? '#f6f2ff' : '#625cb0', a[0], a[1], haze(a[1])), width: 5, points: [a, b] }); }
  p.tryStroke({ brush: 'round', color: far('#4c469c', x, foot - h * 0.76, haze(foot - h * 0.76)), width: 5, opacity: 0.8, points: [[x - h * 0.115, foot - h * 0.775], [x - h * 0.075, foot - h * 0.765]].map(([a, b], i) => [a + (i ? 3 : -3), b]) });   // its eye
}
const FOOT = HORIZON - 6;
piece('rook', 150, FOOT, 310, 0.6);
knight(410, FOOT, 340, 0.56);
piece('bishop', 646, FOOT, 384, 0.54);
{ const { tone } = piece('king', 884, FOOT, 440, 0.5);                       // the king: the cross on his crown is an upright and a bar
  p.tryStroke({ ...line, cap: 'flat', rag: 0.03, color: tone(884, FOOT - 440 * 0.94), width: 14, points: [[884 - 34, FOOT - 440 * 0.94], [884 + 34, FOOT - 440 * 0.94]] }); }
{ const { tone } = piece('queen', 1116, FOOT, 410, 0.52);                    // the queen: the points of her crown
  for (const k of [-1, -0.5, 0, 0.5, 1]) p.tryStroke({ ...line, cap: 'round', rag: 0.03, color: tone(1116 + k * 46 - 6, FOOT - 410 * 0.9), width: 10, taper: [0, 0.6], points: [[1116 + k * 44, FOOT - 410 * 0.875], [1116 + k * 58, FOOT - 410 * 0.955]] }); }
piece('pawn', 1338, FOOT, 280, 0.62);
piece('rook', 1530, FOOT, 320, 0.64);
// long clouds lie across their feet and their middles: so we see how great they are
for (let k = 0; k < 26; k++) { const x = r.range(-200, W - 200), y = r.range(HORIZON - 170, HORIZON - 14), len = r.range(260, 700), w = r.range(14, 34); p.stroke({ brush: 'soft', color: mix('#ffe4f0', '#ffffff', r()), width: w, opacity: r.range(0.14, 0.34), taper: [0.5, 0.5], points: [[x, y], [x + len / 2, y + r.range(-6, 6)], [x + len, y + r.range(-4, 4)]] }); }
for (let k = 0; k < 9; k++) { const x = r.range(-100, W - 300), y = r.range(HORIZON - 330, HORIZON - 190), len = r.range(200, 460); p.stroke({ brush: 'soft', color: '#fff4f8', width: r.range(10, 20), opacity: r.range(0.14, 0.3), taper: [0.5, 0.5], points: [[x, y], [x + len / 2, y + r.range(-4, 4)], [x + len, y]] }); }

// ---------------------------------------------------------------- the heaped clouds, nearer than the pieces
const tones = ['#9a86d8', '#c0a8e8', '#e8c8f0', '#fbe4f2', '#fff6f8', '#ffffff'];
[[71, -160, 300, 190, 70, 1.2, 0.56], [72, 1420, 1760, 400, 56, 1.3, 0.52], [73, 500, 770, 120, 44, 0.9, 0.6], [74, 990, 1230, 84, 38, 0.8, 0.6]].forEach(([seed, x0, x1, floor, big, tall, bias], i) => {
  studio.mass(p, heap(seed, x0, x1, floor, big, tall), { light: SUNWARD, tones: (t) => ramp(tones, clamp(t, 0, 1)), base: floor, bias, contrast: 0.62, fall: 0.22, grain: 0.12, mix: 0.34, noise: noise2(7800 + i), stroke: { rag: 0.35, hardness: 0.5 }, layers: [[Math.max(12, big * 0.3), big * 0.85, 0.95, big * 0.09, 0.45], [Math.max(8, big * 0.16), big * 0.5, 0.82, big * 0.05, 0.7], [Math.max(6, big * 0.08), big * 0.28, 0.6, big * 0.04, 1.2]] });
});
// the light of the sun, which is out of the picture at the upper left
for (const [w, op] of [[460, 0.08], [280, 0.1]]) glow(p, -30, -40, w, '#fffaf0', op, 5);

p.save();
