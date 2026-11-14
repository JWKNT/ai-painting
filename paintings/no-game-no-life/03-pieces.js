// The pieces. They stand in a row at the edge of the world, each as high as the sky: a
// pawn, a knight, a bishop, the king, the queen and a rook. Their feet are under the sea
// of cloud. They are of pale stone. The sun is on their left sides, which are nearly
// white; their right sides are violet, with a thin blue light at the edge from the sky
// behind. Each ring round a piece bends up in its middle, because we look up at it. The
// far ones are faint in the rose air; the king is the nearest and the greatest, and its
// top is the highest thing in this world.
'use strict';
const { studio, open, SEA, far, nA } = require('./scene');
const { mix, clamp, smooth, inPoly, glow } = studio;

const p = open('pieces');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.02, rag: 0.05, cap: 'flat' };
const FOOT = SEA + 110;
// Each piece is turned on its upright middle line, so it is given by half its width at each height: [height, half width], both as
// parts of its whole height.
const BASE = [[0, 0.19], [0.035, 0.19], [0.05, 0.155], [0.085, 0.165], [0.1, 0.125], [0.14, 0.105]];
const PIECES = {
  pawn: [...BASE, [0.3, 0.075], [0.5, 0.06], [0.55, 0.11], [0.6, 0.11], [0.62, 0.06], [0.66, 0.09], [0.72, 0.125], [0.82, 0.14], [0.92, 0.115], [0.98, 0.06], [1, 0.02]],
  rook: [...BASE, [0.3, 0.095], [0.62, 0.085], [0.67, 0.13], [0.73, 0.13], [0.76, 0.11], [0.8, 0.15], [1, 0.15]],
  bishop: [...BASE, [0.3, 0.075], [0.54, 0.055], [0.58, 0.105], [0.63, 0.105], [0.65, 0.055], [0.69, 0.08], [0.76, 0.115], [0.84, 0.105], [0.92, 0.055], [0.95, 0.03], [0.965, 0.045], [0.985, 0.04], [1, 0.008]],
  queen: [...BASE, [0.3, 0.08], [0.58, 0.055], [0.62, 0.105], [0.67, 0.105], [0.69, 0.06], [0.77, 0.08], [0.885, 0.14], [0.9, 0.09], [0.93, 0.06], [0.955, 0.035], [0.975, 0.05], [1, 0.03]],
  king: [...BASE, [0.28, 0.085], [0.56, 0.06], [0.6, 0.11], [0.65, 0.11], [0.67, 0.065], [0.75, 0.085], [0.85, 0.13], [0.87, 0.085], [0.885, 0.026], [1, 0.026]],
};
// The stone at a place across a piece: k is -1 at its left edge and 1 at its right.
const stone = (k) => { let c = mix('#cdbdf0', '#5c46b4', smooth(-0.25, 0.8, k)); c = mix(c, '#fffaf6', smooth(-0.1, -0.8, k)); return mix(c, '#9ad4f4', smooth(0.84, 1, k) * 0.75); };
function piece(kind, x, h, d) {
  const prof = PIECES[kind], half = (t) => { for (let i = 0; i + 1 < prof.length; i++) if (t <= prof[i + 1][0]) { const u = (t - prof[i][0]) / (prof[i + 1][0] - prof[i][0] || 1); return (prof[i][1] + (prof[i + 1][1] - prof[i][1]) * u) * h; } return 0; };
  const haze = (py) => d + (1 - d) * 0.5 * smooth(SEA - 260, SEA + 40, py), tone = (px, py) => far(mix(stone((px - x) / Math.max(1, half((FOOT - py) / h))), '#5a48a8', (nA(px / 60, py / 200) - 0.5) * 0.12), px, py, haze(py));
  p.fill({ inside: (px, py) => py < FOOT - 2 && py > FOOT - h + 4 && Math.abs(px - x) < half((FOOT - py) / h) - 2, bounds: [x - h * 0.2, FOOT - h, x + h * 0.2, Math.min(FOOT, SEA + 70)], width: h > 600 ? 8 : 6.5, length: h > 600 ? 30 : 22, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2, color: tone, stroke: { ...line, rag: 0.04, opacity: 0.97 } });
  // its two sides, piece by piece: a light line down the left, a dark one down the right
  for (const side of [-1, 1]) for (let i = 0; i + 1 < prof.length; i++) {
    const a = [x + side * prof[i][1] * h, FOOT - prof[i][0] * h], b = [x + side * prof[i + 1][1] * h, FOOT - prof[i + 1][0] * h], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (a[1] > SEA + 60 && b[1] > SEA + 60) continue;
    const c = far(side < 0 ? '#fff8f8' : '#6a54b8', a[0], a[1], haze(a[1])), w = h > 600 ? 6 : 5;
    if (len < 12.4) { const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], ux = (b[0] - a[0]) / (len || 1), uy = (b[1] - a[1]) / (len || 1); p.tryStroke({ ...line, cap: 'round', rag: 0.03, mix: 0.05, color: c, width: w, points: [[mid[0] - ux * 6.3, mid[1] - uy * 6.3], [mid[0] + ux * 6.3, mid[1] + uy * 6.3]] }); }
    else p.tryStroke({ ...line, cap: 'round', rag: 0.03, mix: 0.05, color: c, width: w, points: [a, b] });
  }
  // the rings round it: under each place where it is wide and then narrow, a dark line that bends up in the middle, and a light one over it
  for (let i = 1; i + 1 < prof.length; i++) if (prof[i][1] > prof[i - 1][1] * 1.2 || prof[i][1] > prof[i + 1][1] * 1.2) {
    const y = FOOT - prof[i][0] * h, w = prof[i][1] * h, bend = clamp((SEA - 60 - y) / 700, 0, 1) * w * 0.3, pts = (dy, k = 1) => { const out = []; for (let j = 0; j <= 8; j++) { const u = -1 + 2 * j / 8; out.push([x + u * w * 0.96 * k, y + dy - bend * (1 - u * u)]); } return out; };
    if (y > SEA + 50 || w < 14) continue;
    p.tryStroke({ brush: 'round', color: far('#5a46a8', x, y, haze(y)), width: h > 600 ? 5.4 : 4.4, opacity: 0.6, points: pts(h > 600 ? 9 : 6) });
    p.tryStroke({ brush: 'round', color: far('#fffafa', x, y, haze(y)), width: 4.4, opacity: 0.7, points: pts(0).slice(0, 5) });
  }
  return { half, tone, haze };
}
// The knight is not turned on a line: it is the head of a horse, seen from the side, on a round foot.
function knight(x, h, d) {
  const o = [[-0.19, 0], [0.19, 0], [0.19, 0.035], [0.155, 0.05], [0.165, 0.085], [0.125, 0.1], [0.13, 0.2], [0.16, 0.36], [0.16, 0.52], [0.12, 0.68], [0.05, 0.82], [0.03, 0.9], [0.06, 1.0], [0.0, 0.96], [-0.05, 0.94], [-0.12, 0.9], [-0.2, 0.8], [-0.27, 0.68], [-0.3, 0.6], [-0.27, 0.55], [-0.19, 0.56], [-0.12, 0.61], [-0.07, 0.58], [-0.1, 0.48], [-0.13, 0.36], [-0.11, 0.2], [-0.125, 0.1], [-0.165, 0.085], [-0.155, 0.05], [-0.19, 0.035]].map(([u, v]) => [x + u * h, FOOT - v * h]);
  const haze = (py) => d + (1 - d) * 0.5 * smooth(SEA - 260, SEA + 40, py);
  p.fill({ inside: inPoly(o), bounds: [x - h * 0.32, FOOT - h, x + h * 0.2, SEA + 70], width: 6.5, length: 22, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2, color: (px, py) => far(stone(clamp((px - x + h * 0.04) / (h * 0.17), -1, 1)), px, py, haze(py)), stroke: { ...line, rag: 0.04, opacity: 0.97 } });
  for (let i = 0; i < o.length; i++) { const a = o[i], b = o[(i + 1) % o.length]; if (a[1] > SEA + 60 && b[1] > SEA + 60) continue; if (Math.hypot(b[0] - a[0], b[1] - a[1]) >= 12.4) p.tryStroke({ ...line, cap: 'round', rag: 0.03, mix: 0.05, color: far(a[0] < x - h * 0.02 || (b[1] < a[1] - 4 && a[0] < x + h * 0.08) ? '#fff8f8' : '#6a54b8', a[0], a[1], haze(a[1])), width: 5, points: [a, b] }); }
  p.tryStroke({ brush: 'round', color: far('#4c3c9c', x, FOOT - h * 0.76, haze(FOOT - h * 0.76)), width: 5, opacity: 0.8, points: [[x - h * 0.115 - 4, FOOT - h * 0.775], [x - h * 0.075 + 4, FOOT - h * 0.765]] });   // its eye
  for (const k of [0.3, 0.5, 0.68]) p.tryStroke({ brush: 'round', color: far('#5a46a8', x, FOOT - h * k, haze(FOOT - h * k)), width: 4.4, opacity: 0.45, taper: [0.2, 0.5], points: [[x + h * 0.14, FOOT - h * k], [x + h * 0.06, FOOT - h * (k + 0.07)], [x, FOOT - h * (k + 0.16)]] });   // the locks of its mane
}

piece('pawn', 146, 540, 0.56);
piece('rook', 1512, 600, 0.5);
knight(388, 650, 0.42);
piece('bishop', 648, 700, 0.34);
{ const { tone } = piece('queen', 1236, 730, 0.26);                          // the queen: the points of her crown
  for (const k of [-1, -0.5, 0, 0.5, 1]) p.tryStroke({ ...line, cap: 'round', rag: 0.03, color: tone(1236 + k * 76 - 10, FOOT - 730 * 0.9), width: 15, taper: [0, 0.6], points: [[1236 + k * 76, FOOT - 730 * 0.875], [1236 + k * 100, FOOT - 730 * 0.96]] }); }
{ const { tone } = piece('king', 930, 850, 0.14);                            // the king: the cross on his crown is an upright and a bar
  p.tryStroke({ ...line, rag: 0.03, color: tone(930 - 10, FOOT - 850 * 0.945), width: 24, points: [[930 - 62, FOOT - 850 * 0.945], [930 + 62, FOOT - 850 * 0.945]] });
  p.tryStroke({ brush: 'round', color: '#fffafa', width: 5, opacity: 0.85, points: [[930 - 62, FOOT - 850 * 0.945 - 11], [930 + 40, FOOT - 850 * 0.945 - 11]] });
  for (const [w, op] of [[120, 0.1], [60, 0.16]]) glow(p, 930, FOOT - 850 * 0.93, w, '#fff0c8', op, 6); }   // a light at its top: the god of this world sits there
// thin cloud lies across them, at more than one height: so we see how great they are
for (let k = 0; k < 30; k++) { const x = r.range(-200, 1500), y = r.range(SEA - 420, SEA - 30), len = r.range(260, 700), w = r.range(12, 30); p.stroke({ brush: 'soft', color: mix('#ffe4f0', '#ffffff', r()), width: w, opacity: r.range(0.1, 0.26), taper: [0.5, 0.5], points: [[x, y], [x + len / 2, y + r.range(-6, 6)], [x + len, y + r.range(-4, 4)]] }); }

p.save();
