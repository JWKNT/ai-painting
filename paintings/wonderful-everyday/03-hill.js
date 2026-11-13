// The hill: far blue hills at the left, beyond it; then the green of the hill itself, which
// is all the leaves of the sunflowers, pale and close far off, dark and large near us; and
// the path of dry earth that goes up through them to the top.
'use strict';
const { studio, open, W, H, crest, near, pathMid, pathHalf, onPath, far, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth, through } = studio;

const p = open('hill');
const r = p.rng;

// The far hills.
for (const [line, c] of [[through([[0, 600], [160, 574], [330, 596], [520, 622], [700, 640]]), '#7c9cd0'], [through([[0, 640], [220, 620], [420, 640], [640, 650]]), '#6c9c9c']]) {
  const top = (x) => line(x) + 5 * (nA(x / 40, c.length) - 0.5);
  p.fill({ inside: (x, y) => y > top(x) && y < crest(x) + 6, bounds: [0, 560, 720, 680], width: 8, length: 46, spacing: 0.5, angle: () => r.range(-0.2, 0.2), color: (x, y) => mix(c, '#c8e0f4', 0.3 + 0.3 * nB(x / 50, y / 20)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.2, rag: 0.3 } });
}

// The leaves. Far off they are a soft green with the yellow of the flowers in it; near us each stroke is a leaf, and it leans the way the wind goes.
const green = (x, y) => {
  const k = near(x, y), t = nC(x / (30 + 90 * k), y / (20 + 70 * k));
  let c = mix(mix('#86b84c', '#2f7a2a', smooth(0, 0.7, k)), '#15481e', smooth(0.5, 1, k) * 0.5);
  c = mix(c, t > 0.5 ? mix('#b4d85c', '#7cc040', k) : '#123c1a', Math.abs(t - 0.5) * (0.5 + 0.5 * k));
  return far(mix(c, '#e8cc3c', smooth(0.3, 0, k) * 0.35), 0.5 * (1 - k));                       // far off, the yellow of the flowers is in it
};
const leafWay = () => -Math.PI / 2 + 0.5 + r.range(-0.5, 0.5);
p.fill({ inside: (x, y) => y > crest(x), bounds: [0, 490, W, 700], width: 8, length: 22, spacing: 0.5, angle: leafWay, color: green, stroke: { brush: 'bristle', opacity: 0.95, mix: 0.2, dry: 0.04, rag: 0.3, cap: 'round' } });
p.fill({ inside: (x, y) => y > crest(x), bounds: [0, 680, W, 860], width: 14, length: 40, spacing: 0.5, angle: leafWay, color: green, stroke: { brush: 'bristle', opacity: 0.95, mix: 0.2, dry: 0.04, rag: 0.3, cap: 'round', taper: [0.2, 0.5] } });
p.fill({ inside: (x, y) => y > crest(x), bounds: [0, 840, W, H], width: 24, length: 70, spacing: 0.5, angle: leafWay, color: green, stroke: { brush: 'bristle', opacity: 0.95, mix: 0.2, dry: 0.04, rag: 0.3, cap: 'round', taper: [0.2, 0.5] } });
{                                                                        // the grass along the top of the hill, against the sky
  for (let x = 0; x < W; x += r.range(5, 10)) { const y = crest(x) + 3, h = r.range(13, 20); p.tryStroke({ brush: 'bristle', color: far(mix('#7cb048', '#c8dc6c', r()), 0.3), width: r.range(4.8, 6), mix: 0.15, dry: 0.04, rag: 0.3, taper: [0, 0.8], points: [[x, y + 4], [x + h * 0.3, y - h]] }); }
}

// The path: dry earth, pale in the sun, with two ruts in it and grass down the middle; the shade of the flowers lies across its right side.
const earth = (x, y) => {
  const u = (x - pathMid(y)) / pathHalf(y), k = near(x, y);
  let c = mix(mix('#f2deb0', '#e2c690', nA(x / 60, y / 24)), '#c8a878', smooth(0.5, 1, Math.abs(u)) * 0.5);
  c = mix(c, '#a88c64', smooth(0.3, 0.9, u) * smooth(0.3, 0.7, nB(x / 70, y / 30)) * 0.6);     // the shade on it
  c = mix(c, '#b89868', smooth(0.12, 0.02, Math.abs(Math.abs(u) - 0.45)) * 0.5);                // its two ruts
  return mix(c, '#86a84c', smooth(0.2, 0, Math.abs(u)) * smooth(0.45, 0.6, nC(x / 26, y / 40)) * 0.7 * k);   // the grass down the middle of it
};
const way = (x, y) => Math.atan2(40, pathMid(y + 20) - pathMid(y - 20)) + r.range(-0.1, 0.1);
p.fill({ inside: (x, y) => onPath(x, y), bounds: [300, 540, 1320, H], width: 9, length: 46, spacing: 0.5, angle: way, color: earth, stroke: { brush: 'bristle', opacity: 0.96, mix: 0.2, dry: 0.04, rag: 0.25 } });
for (const s of [-1, 1]) {                                               // the grass that leans in over its two edges
  for (let y = 566; y < H; y += r.range(5, 12)) { const k = clamp((y - 566) / 434, 0, 1), x = pathMid(y) + s * pathHalf(y), h = (10 + 34 * k) * r.range(0.6, 1.2); p.tryStroke({ brush: 'bristle', color: mix('#2c6c28', '#8cc044', r()), width: Math.max(4.8, 5 + 6 * k), mix: 0.15, dry: 0.04, rag: 0.3, taper: [0, 0.8], points: [[x + s * 4, y + 4], [x - s * h * 0.3, y - Math.max(13, h)]] }); }
}

p.save();
