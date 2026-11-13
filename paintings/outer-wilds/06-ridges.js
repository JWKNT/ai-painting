// The valley: three forested ridges stepping back to the horizon, with mist lying between
// them, a geyser venting under the sun, and the lights of the village.
'use strict';
const { studio, open, W, SUN, HORIZON, warmth, ridge1, ridge2, ridge3, nA, nB, clamp, spire } = require('./scene');
const { mix, wave } = studio;

const p = open('ridges');
const r = p.rng;

// A ridge: a firm stroke along its crest, the body filled beneath, then a fringe of treetops.
function ridge(line, colorAt, bottom, opts) {
  const { width, edge, trees } = opts;
  const slope = (x) => Math.atan2(line(x + 12) - line(x - 12), 24);
  p.fill({
    inside: (x, y) => y > line(x) + width * 0.5 && y < bottom, bounds: [-20, HORIZON - 40, W + 20, bottom],
    width, length: width * 6, spacing: 0.5, angle: (x, y) => slope(x) + (nB(x / 80, y / 40) - 0.5) * 0.3,
    color: (x, y) => colorAt(x, y), stroke: { brush: 'bristle', opacity: 0.96, mix: 0.12, dry: 0.05 },
  });
  for (let x = -30; x < W + 30; x += 130) {
    const pts = [];
    for (let k = 0; k <= 8; k++) { const xx = x + k * 20; pts.push([xx, line(xx) + edge / 2]); }
    p.stroke({ brush: 'bristle', color: colorAt(x + 80, line(x + 80)), width: edge, mix: 0.05, dry: 0, rag: 0.05, points: pts });
  }
  // treetops: stands of pine with gaps between them, a few standing well above the rest
  for (let x = -10; x < W + 10; x += trees.gap * r.range(0.35, 1.5)) {
    const stand = nA(x / 110, trees.h[0] * 3.1);
    if (stand < 0.3 && r() < 0.8) { x += trees.gap * r.range(1, 4); continue; }
    let h = r.range(trees.h[0], trees.h[1]) * (0.55 + 0.9 * stand);
    if (r() < 0.07) h *= r.range(1.4, 1.9);
    h = Math.max(13, h);
    spire(p, x, line(x) + 4, h, h * trees.wide * r.range(0.8, 1.3), mix(colorAt(x, line(x)), '#080814', (trees.dark || 0) * r.range(0.5, 1.2)));
  }
}

// Mist: long soft strokes lying in the valleys, lit warm beneath the sun.
function mist(line, lift, amount) {
  for (let k = 0; k < amount; k++) {
    const x = r.range(-100, W - 100), len = r.range(260, 560), w = r.range(44, 84), warm = warmth(x + len / 2);
    const y = line(x + len / 2) + lift + r.range(-14, 22);
    p.stroke({
      brush: 'soft', width: w, opacity: r.range(0.12, 0.22) + 0.16 * warm,
      color: mix(mix('#4a4f8c', '#7a5a8a', r()), mix('#ff9a52', '#ffc27a', r()), clamp(warm * 1.15, 0, 1)),
      points: wave(x, y, x + len, y + r.range(-10, 10), r.range(3, 9), r.range(0.6, 1.4), 9),
    });
  }
}

// Farthest ridge: hazy, taking the color of the air in front of it.
ridge(ridge1, (x, y) => mix(mix('#2f2c58', '#3a3566', nA(x / 60, y / 30)), mix('#8a3430', '#a8432f', nA(x / 50, y / 25)), warmth(x)), 810, {
  width: 26, edge: 12, trees: { gap: 9, h: [13, 20], wide: 0.3 },
});
mist(ridge2, -12, 16);

// Middle ridge.
ridge(ridge2, (x, y) => mix(mix('#1f2046', '#262852', nA(x / 60, y / 30)), mix('#582434', '#6a2c34', nA(x / 50, y / 25)), warmth(x)), 880, {
  width: 30, edge: 13, trees: { gap: 12, h: [20, 38], wide: 0.26, dark: 0.15 },
});

// The geyser, venting in front of the sun: steam lit through from behind.
{
  const gx = 1196, gy = ridge2(1196) + 10;
  for (const [dx, top, w, color, opacity] of [
    [-3, 196, 46, '#ffa868', 0.3], [0, 176, 32, '#ffc48a', 0.45], [-7, 142, 24, '#ffddb0', 0.5], [8, 156, 22, '#ffd29c', 0.45], [1, 118, 14, '#fff4dc', 0.65],
  ]) {
    p.stroke({ brush: 'soft', color, width: w, opacity, taper: [0.5, 0.15], points: [[gx + dx * 0.4, gy], [gx + dx, gy - top * 0.5], [gx + dx * 1.6 + 6, gy - top * 0.85], [gx + dx * 2 + 16, gy - top]] });
  }
  for (const [dx, dy, w, len] of [[10, -178, 56, 130], [38, -150, 44, 104], [-14, -140, 38, 86]]) {   // the plume spreading and drifting
    p.stroke({ brush: 'soft', color: '#ffd0a0', width: w, opacity: 0.3, points: [[gx + dx - len * 0.35, gy + dy + 10], [gx + dx, gy + dy], [gx + dx + len * 0.65, gy + dy - 8]] });
  }
}

// The village: a few lit windows down in the valley, and the launch tower standing over them.
{
  const tx = 356, ty = ridge2(356) + 6, top = ty - 78;
  const post = '#12122a';
  p.line(tx - 13, ty, tx - 7, top, { color: post, width: 4.5 });
  p.line(tx + 13, ty, tx + 7, top, { color: post, width: 4.5 });
  p.line(tx - 12, ty - 8, tx + 9, ty - 34, { color: post, width: 4 });
  p.line(tx + 12, ty - 8, tx - 9, ty - 34, { color: post, width: 4 });
  p.line(tx - 9, ty - 40, tx + 8, ty - 66, { color: post, width: 4 });
  p.line(tx + 9, ty - 40, tx - 8, ty - 66, { color: post, width: 4 });
  p.line(tx - 17, top, tx + 17, top, { color: post, width: 5.5 });
  p.line(tx - 2, top - 4, tx - 2, top - 20.5, { color: post, width: 8 });          // the lift cabin on the platform
  p.line(tx - 8, top - 22, tx + 5, top - 24, { color: '#ffd28a', width: 4, opacity: 0.95 });   // its lamp
  p.stroke({ brush: 'soft', color: '#ff9c48', width: 16, opacity: 0.35, points: [[tx - 18, top - 22], [tx + 16, top - 24]] });
  for (const [dx, dy] of [[-96, 34], [-70, 44], [-38, 30], [34, 40], [58, 28], [92, 46], [128, 36], [-130, 48], [10, 52]]) {
    const x = tx + dx, y = ridge2(x) + dy;
    p.stroke({ brush: 'soft', color: '#ff9440', width: 14, opacity: 0.3, points: [[x - 15, y], [x + 15, y]] });
    p.line(x - 6.2, y, x + 6.2, y, { color: r.pick(['#ffd088', '#ffc070', '#ffe0a0']), width: 4, opacity: 0.95 });
  }
}

mist(ridge3, -18, 20);

// Nearest ridge: dark, its pines distinct.
ridge(ridge3, (x, y) => mix(mix('#14173a', '#1a1c40', nA(x / 60, y / 30)), mix('#33182a', '#40202c', nA(x / 50, y / 25)), warmth(x)), 1110, {
  width: 34, edge: 14, trees: { gap: 15, h: [34, 70], wide: 0.22, dark: 0.3 },
});

// Light pooling in the valley below the sun, over the tops of the nearest pines.
for (let k = 0; k < 7; k++) {
  const x = SUN.x + r.range(-330, 250), y = ridge3(x) + r.range(40, 120), len = r.range(260, 420);
  p.stroke({ brush: 'soft', color: r.pick(['#ff8a48', '#ffae62', '#e8663c']), width: r.range(60, 96), opacity: r.range(0.07, 0.13), points: wave(x - len / 2, y, x + len / 2, y + r.range(-12, 12), 8, 1, 8) });
}

p.save();
