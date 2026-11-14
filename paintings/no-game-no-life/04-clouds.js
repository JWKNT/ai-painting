// The sea of cloud, and what is in the air over it. Through the breaks in the cloud we see
// the land of Disboard far below: fields like the squares of a board, a river, and all of
// it faint with the height. The cloud is heaped, white where the sun is on it and pink
// and blue under. Islands of rock float over it, each with grass and trees on its top and
// water that falls from its edge; and a dragon turns in the air at the left, with the
// sun on its back.
'use strict';
const { studio, open, W, H, SEA, SUNWARD, far, heap, nA, nB, nC, nD } = require('./scene');
const { mix, clamp, smooth, ramp, noise2, shape, solid } = studio;

const p = open('clouds');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.14, dry: 0.03, rag: 0.25, cap: 'round' };

// ---------------------------------------------------------------- the land far below
const land = (x, y) => {
  const X = (x - 800) / (40 + (y - SEA) * 0.9), Z = 300 / (y - SEA + 40), sq = (Math.floor(X * 6 + 40) + Math.floor(Z * 6)) & 1;
  let c = sq ? '#7cc87c' : '#a8dc8c';
  c = mix(c, '#e4dc8c', smooth(0.62, 0.8, nA(X * 3 + 9, Z * 3)) * 0.5);
  c = mix(c, '#2f8a66', smooth(0.56, 0.66, nD(X * 2 + 3, Z * 2 + 5)));                             // woods
  c = mix(c, '#5cc0e8', smooth(0.07, 0.03, Math.abs(X * 0.3 + 0.3 * Math.sin(Z * 2.2) - 0.1)));    // a river
  return far(c, x, y, 0.5 + 0.3 * smooth(H, SEA, y));
};
p.fill({ bounds: [0, SEA - 10, W, H + 4], width: 9, length: 60, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.04, 0.04), color: land, stroke: { ...line, opacity: 0.96 } });

// ---------------------------------------------------------------- the islands that float: far ones first
function island(cx, top, w, h, d, seed, fall) {
  const half = (y) => w / 2 * Math.pow(clamp(1 - (y - top) / h, 0, 1), 0.72) * (0.9 + 0.2 * nC(seed, y / (h * 0.2))), mid = (y) => cx + w * 0.07 * Math.sin((y - top) / h * 3 + seed);
  p.fill({ inside: (x, y) => y > top - 2 && y < top + h && Math.abs(x - mid(y)) < half(y), bounds: [cx - w * 0.62, top - 2, cx + w * 0.62, top + h], width: Math.max(6, w * 0.04), length: Math.max(18, w * 0.12), spacing: 0.5, overlap: 0.6, angle: () => 1.2 + r.range(-0.25, 0.25),
    color: (x, y) => { const k = (x - mid(y)) / Math.max(1, half(y)), bed = nA(seed + x / (w * 0.2), y / (h * 0.12)); let c = mix('#b08cb8', '#6c58a0', smooth(-0.3, 0.9, k)); c = mix(c, '#f4dcea', smooth(0, -1, k) * 0.55); c = mix(c, '#46367c', (bed - 0.5) * 0.4 + smooth(top + h * 0.3, top + h, y) * 0.3); return far(c, x, y, d); }, stroke: { ...line, rag: 0.35, opacity: 0.96 } });
  for (let k = 0; k < 3; k++) p.tryStroke({ ...line, rag: 0.3, color: far(k === 2 ? '#d4f494' : mix('#4cae5c', '#7cd06c', k / 2), cx, top, d), width: Math.max(5, Math.max(6, w * 0.05) * (1 - k * 0.25)), points: [[cx - w * 0.5 + k * w * 0.04, top + 3 - k * 3], [cx - w * 0.06, top - 3 - k * 3], [cx + w * 0.5 - k * w * 0.1, top + 3 - k * 3]] });
  for (let k = 0; k < Math.round(w / 26); k++) { const x = cx + r.range(-0.4, 0.4) * w, s = clamp(w * r.range(0.05, 0.085), 6, 20), l = Math.max(12.4, s * 2.1); p.tryStroke({ ...line, rag: 0.4, color: far(mix('#1f7a5a', '#35966a', r()), x, top, d), width: s, points: [[x - l / 2, top - s * 0.5], [x, top - s * 0.72], [x + l / 2, top - s * 0.5]] }); p.tryStroke({ ...line, rag: 0.4, color: far(mix('#7cd070', '#d8f494', r()), x, top, d), width: Math.max(4.8, s * 0.5), opacity: 0.9, points: [[x - l * 0.42, top - s * 0.84], [x - s * 0.1, top - s * 1.0], [x + l * 0.16, top - s * 0.86]] }); }
  for (const [fx, len] of fall) { const x = cx + fx * w, y0 = top + 4, wd = Math.max(5, w * 0.03);
    p.tryStroke({ ...line, rag: 0.3, color: far('#f0fcff', x, y0, d * 0.6), width: wd, opacity: 0.95, taper: [0, 0.5], points: [[x, y0], [x + 2, y0 + len * 0.5], [x + 6, y0 + len]] });
    for (let k = 0; k < 4; k++) p.tryStroke({ brush: 'soft', color: '#ffffff', width: Math.max(9, wd * (1.6 + k)), opacity: 0.2 - k * 0.035, taper: [0.5, 0.8], points: [[x + 3 + k * 3, y0 + len * (0.5 + 0.14 * k)], [x + 6 + k * 5, y0 + len * (0.8 + 0.14 * k)], [x + 10 + k * 7, y0 + len * (1.1 + 0.14 * k) + 20]] }); }
}
island(1410, 520, 120, 84, 0.42, 1.3, [[0.3, 80]]);
island(520, 470, 110, 76, 0.46, 4.4, [[-0.3, 70]]);
island(1120, 640, 210, 140, 0.2, 7.7, [[0.36, 120], [-0.14, 90]]);

// ---------------------------------------------------------------- the dragon
// It turns in the air at the left, far off: a long neck, a long tail, and two wide wings like those of a bat. It is blue;
// the sun is on its back and on the tops of its wings.
{ const X = 250, Y = 664, s = 1.0, P = (u, v) => [X + u * 150 * s, Y + v * 150 * s], d = 0.22;
  const hide = { shadow: far('#1c3c84', X, Y, d), half: far('#2f66b8', X, Y, d), lit: far('#8cd0f4', X, Y, d), bounce: far('#5c4ca8', X, Y, d) }, o = { light: SUNWARD, turn: 0, width: 5.5, length: 18, vary: 0.05, edge: false }, ch = (pts) => pts.map(([u, v, q]) => [...P(u, v), q * 150 * s]);
  // the far wing, the body, the near wing
  const wing = (root, tips, tone) => { for (let i = 0; i + 1 < tips.length; i++) shape(p, [P(...root), P(...tips[i]), P(...tips[i + 1])], tone, { light: SUNWARD, turn: 0.1, width: 5.5, length: 22, round: 8, vary: 0.05, flow: () => Math.atan2(tips[i][1] - root[1], tips[i][0] - root[0]), edge: false }); for (const t of tips) p.tryStroke({ ...line, color: far('#1c3c84', X, Y, d), width: 5, taper: [0, 0.6], points: [P(...root), P((root[0] + t[0]) / 2, (root[1] + t[1]) / 2 - 0.03), P(...t)] }); };
  wing([0.06, -0.04], [[0.5, -0.56], [0.86, -0.4], [0.9, -0.12], [0.6, 0.0]], { shadow: far('#2c4c98', X, Y, d + 0.1), half: far('#5c8cd4', X, Y, d + 0.1), lit: far('#a8dcf8', X, Y, d + 0.1), bounce: far('#7c6cc0', X, Y, d + 0.1) });
  solid(p, ch([[0.86, 0.5, 0.012], [0.56, 0.3, 0.03], [0.3, 0.14, 0.06], [0.0, 0.02, 0.1], [-0.22, -0.02, 0.085]]), hide, o);   // the tail and the body
  solid(p, ch([[-0.22, -0.02, 0.07], [-0.44, -0.16, 0.045], [-0.6, -0.3, 0.04]]), hide, o);                                  // the neck
  solid(p, ch([[-0.6, -0.3, 0.05], [-0.74, -0.27, 0.035]]), hide, o);                                                         // the head
  for (const dv of [-0.02, 0.03]) p.tryStroke({ ...line, color: far('#f4f0e0', X, Y, d), width: 5, taper: [0, 0.8], points: [P(-0.58, -0.33 + dv), P(-0.48, -0.42 + dv)] });   // its horns
  wing([-0.02, -0.04], [[-0.1, -0.74], [0.34, -0.7], [0.62, -0.44], [0.44, -0.1]], { shadow: far('#2a4c9c', X, Y, d), half: far('#4c84d0', X, Y, d), lit: far('#b8e4fc', X, Y, d), bounce: far('#7c6cc0', X, Y, d) });
  for (const [a, b] of [[[0.3, 0.1], [0.44, 0.3]], [[0.06, 0.1], [0.1, 0.26]]]) p.tryStroke({ ...line, color: far('#2f66b8', X, Y, d), width: 6, taper: [0, 0.7], points: [P(...a), P(...b)] }); }   // its legs, drawn up under it

// ---------------------------------------------------------------- the sea of cloud: rows of heaps, far ones first, with breaks between them
const tones = ['#8c9ce0', '#b4b4ec', '#ecc8e8', '#ffe4ee', '#fff8fa', '#ffffff'];
[[81, -100, 700, 790, 44, 0.9], [82, 600, 1700, 786, 46, 0.9], [83, 820, 1400, 846, 70, 1.0], [84, -160, 380, 870, 84, 1.1], [85, 1320, 1780, 900, 96, 1.1], [86, 380, 900, 1010, 120, 1.0], [87, 1000, 1500, 1040, 130, 0.9], [88, -200, 300, 1050, 140, 0.9]].forEach(([seed, x0, x1, floor, big, tall], i) => {
  studio.mass(p, heap(seed, x0, x1, floor, big, tall), { light: SUNWARD, tones: (t) => ramp(tones, clamp(t, 0, 1)), base: floor, bias: 0.56, contrast: 0.62, fall: 0.3, grain: 0.12, mix: 0.34, noise: noise2(7900 + i), stroke: { rag: 0.35, hardness: 0.5 }, layers: [[Math.max(12, big * 0.3), big * 0.85, 0.95, big * 0.09, 0.45], [Math.max(8, big * 0.16), big * 0.5, 0.82, big * 0.05, 0.7], [Math.max(6, big * 0.08), big * 0.28, 0.6, big * 0.04, 1.2]] });
});
// thin cloud between the heaps, and the rose air over the far part of the sea of cloud
for (let k = 0; k < 20; k++) { const x = r.range(-200, W - 200), len = r.range(300, 760), y = r.range(SEA - 20, SEA + 60); p.stroke({ brush: 'soft', color: mix('#ffd0e6', '#ffffff', r()), width: r.range(18, 40), opacity: r.range(0.1, 0.22), points: [[x, y], [x + len / 2, y + r.range(-4, 4)], [x + len, y]] }); }
void nB; void mix;

p.save();
