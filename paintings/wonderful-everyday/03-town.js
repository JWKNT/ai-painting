// The town, below the roof. We see it over the far edge of the roof and, nearer, down
// through the fence at the right: low hills at the edge of the world, then roofs and walls,
// trees between them, a few tall blocks and the poles of the streets. The sun is behind it
// all, so each wall that faces us is in shade and each roof has a line of light on its top.
// The haze of the afternoon is in it: the far part is nearly the color of the sky.
'use strict';
const { studio, open, W, HZ, F, EYE, glare, nA, nB } = require('./scene');
const { mix, clamp, through } = studio;

const p = open('town');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.03, rag: 0.15, cap: 'flat' };
const DROP = 15;                                               // the streets are this far below the roof, in metres
const baseY = (d) => HZ + F * (EYE + DROP) / d;                // where the ground of the town is in the picture, at a distance
const hazed = (c, d, x) => mix(c, mix('#b0cdea', '#f0f7ff', glare(x, HZ, 560)), clamp(0.06 + d / 1300, 0, 0.8));

// The hills at the edge of the world: two low lines of them, pale.
for (const [pts, c, d] of [[[[-20, 752], [180, 744], [360, 756], [560, 748], [760, 758], [960, 750], [1180, 740], [1400, 752], [1620, 746]], '#7896c0', 900], [[[-20, 764], [240, 758], [470, 766], [700, 760], [900, 766], [1150, 758], [1380, 764], [1620, 760]], '#6488ac', 760]]) {
  const top = through(pts);
  p.fill({ inside: (x, y) => y > top(x) + 2.5 * (nB(x / 26, d) - 0.5) && y < HZ + 10, bounds: [0, 736, W, HZ + 10], width: 6, length: 46, spacing: 0.5, angle: () => r.range(-0.08, 0.08), color: (x, y) => hazed(mix(c, '#4c7088', nA(x / 80, y / 12) * 0.5), d, x), stroke: { ...line, cap: 'round', opacity: 0.85 } });
}
// The far part of the town: too far for houses. Level touches of pale and dark, with small lights where a roof or a window turns the sun to us.
p.fill({ bounds: [0, HZ - 2, W, HZ + 34], width: 5.5, length: 26, spacing: 0.5, angle: () => r.range(-0.03, 0.03), color: (x, y) => hazed(r.pick(['#6c7c9c', '#8494b0', '#566884', '#9cacc4', '#486470']), 17000 / Math.max(6, y - HZ + 6), x), stroke: { ...line, opacity: 0.85 } });
for (let k = 0; k < 50; k++) { const x = r.range(0, W), y = r.range(HZ, HZ + 30); p.tryStroke({ brush: 'round', color: '#ffffff', width: 4, opacity: r.range(0.2, 0.6), points: [[x, y], [x + r.range(12.4, 20), y]] }); }

// A house or a block, at a distance: the wall in shade, and the roof over it. A house has a dark roof of tiles that is
// narrower at its top; a block has a flat pale one. Now and then a roof turns the sun to us, and a window is dark or holds the sky.
function house(x0, d, w, h, flat) {
  const s = F / d, yb = baseY(d), x1 = x0 + Math.max(13, w * s), yt = yb - h * s, wall = hazed(mix('#4c5e82', '#7888a8', r()), d, x0), roof = hazed(flat ? mix('#7c88a4', '#98a4bc', r()) : r.pick(['#2c3854', '#38445e', '#44384c', '#2c444c', '#4c4048']), d, x0);
  for (let y = yt + 3; y < yb + 3; y += 5.2) p.stroke({ ...line, color: mix(wall, '#2c3a54', clamp((y - yt) / (yb - yt), 0, 1) * 0.3), width: 6.5, points: [[x0, y], [x1, y + r.range(-0.4, 0.4)]] });
  const rw = flat ? 4.8 : clamp(0.26 * h * s, 4.8, 12), cut = flat ? 0 : Math.min((x1 - x0 - 13) / 2, rw * 0.9);
  p.stroke({ ...line, color: roof, width: rw, points: [[x0 - 1.5, yt - rw * 0.3], [x1 + 1.5, yt - rw * 0.3]] });
  if (!flat && rw > 6) p.tryStroke({ ...line, color: mix(roof, '#1c2438', 0.25), width: Math.max(4.8, rw * 0.7), points: [[x0 + cut, yt - rw * 0.95], [x1 - cut, yt - rw * 0.95]] });   // the upper part of the roof, narrower
  if (r() < (flat ? 0.5 : 0.22)) p.tryStroke({ brush: 'round', color: '#f4f9ff', width: 4, opacity: r.range(0.4, 0.9), points: [[x0 + cut + r.range(0, 4), yt - rw * (flat ? 0.8 : 1.4)], [x1 - cut - r.range(0, 4), yt - rw * (flat ? 0.8 : 1.4) + r.range(-0.5, 0.5)]] });
  if (s > 3) { const n = Math.floor(r.range(0, 3)); for (let k = 0; k < n; k++) { const x = r.range(x0 + 2, Math.max(x0 + 3, x1 - 15)), y = r.range(yt + 1.4 * s, yb - 1.2 * s); p.tryStroke({ brush: 'round', color: r() < 0.2 ? hazed('#bcd8f8', d, x) : mix(wall, '#1c2840', 0.5), width: 4, opacity: 0.55, points: r() < 0.4 ? [[x, y - 6.2], [x, y + 6.2]] : [[x, y], [x + 12.4, y]] }); } }
  return x1;
}
// A tree: a dark round heap. A pole of the street: a thin upright line with a bar across its top.
function tree(x, d, h) {
  const s = F / d, yb = baseY(d), c = hazed(mix('#24443c', '#34544c', r()), d, x), th = Math.max(13, h * s), w1 = clamp(th * 0.5, 6, 20), l1 = Math.max(w1 * 2.1, th * 0.9);
  p.tryStroke({ ...line, cap: 'round', color: mix(c, '#14262c', 0.3), width: w1, points: [[x - l1 / 2, yb - th * 0.34], [x, yb - th * 0.4], [x + l1 / 2, yb - th * 0.34]] });                    // the low part of its crown, in shade
  const w2 = clamp(th * 0.36, 5, 14), l2 = Math.max(w2 * 2.1, th * 0.6);
  p.tryStroke({ ...line, cap: 'round', color: c, width: w2, points: [[x - l2 / 2 - 1, yb - th * 0.66], [x, yb - th * 0.74], [x + l2 / 2 - 1, yb - th * 0.66]] });                              // the top of it
  p.tryStroke({ brush: 'round', color: hazed('#a8c8a0', d, x), width: 4, opacity: 0.45, points: [[x - l2 / 2, yb - th * 0.84], [x + Math.max(0.4, l2 / 2 - 6.2), yb - th * 0.88]] });         // and the sun on that
}
function pole(x, d) { const s = F / d, yb = baseY(d), c = hazed('#3c4860', d, x); p.tryStroke({ brush: 'round', color: c, width: 4, opacity: 0.75, points: [[x, yb + 2], [x + r.range(-1, 1), yb - 9 * s]] }); p.tryStroke({ brush: 'round', color: c, width: 4, opacity: 0.7, points: [[x - Math.max(6.5, 0.9 * s), yb - 8.4 * s], [x + Math.max(6.5, 0.9 * s), yb - 8.4 * s]] }); }

// The tall things far off, that stand up into the sky: blocks of flats, a chimney, the tower of a radio.
for (const [x, d, w, h] of [[470, 1500, 26, 52], [556, 1900, 22, 70], [784, 1700, 34, 46], [1010, 1300, 28, 44], [1240, 1600, 30, 58], [1470, 1200, 30, 40]]) house(x, d, w, h, true);
{ const x = 1392, top = 708, c = hazed('#5c6c8c', 1300, x);                                                  // the tower of a power line: two legs that meet, and its arms
  for (const k of [-1, 1]) p.tryStroke({ brush: 'round', color: c, width: 4, opacity: 0.6, points: [[x + k * 9, HZ + 2], [x + k * 2, top]] });
  for (const [dy, half] of [[8, 13], [24, 10]]) p.tryStroke({ brush: 'round', color: c, width: 4, opacity: 0.5, points: [[x - half, top + dy], [x + half, top + dy]] }); }

// The streets of houses, far ones first. Near us they are bigger and the haze is less.
for (const d of [640, 540, 455, 385, 325, 275, 232, 198, 170, 148]) {
  const s = F / d, yb = baseY(d), from = Math.max(360, 640 + (yb - HZ - 26) / 0.12);            // what the roof hides, we do not paint
  for (let x = from - r.range(0, 30); x < W + 20;) {
    const k = r();
    if (k < 0.24) { tree(x + 3 * s, d, r.range(5, 10)); x += r.range(4, 8) * s; continue; }
    const x1 = house(x, d, r.range(7, 13), k > 0.92 ? r.range(12, 18) : r.range(5.5, 8.5), k > 0.8);
    if (r() < 0.3) pole(x1 + 1.2 * s, d);
    x = x1 + r.range(0.6, 3) * s;
  }
}
// The haze over all of it: most over the far part.
for (let k = 0; k < 10; k++) { const x = r.range(-100, W - 400), len = r.range(400, 800), y = r.range(HZ - 14, HZ + 22); p.stroke({ brush: 'soft', color: mix('#cfe6f6', '#ffffff', glare(x + len / 2, y, 600)), width: r.range(18, 34), opacity: r.range(0.1, 0.2), points: [[x, y], [x + len / 2, y + r.range(-3, 3)], [x + len, y]] }); }
for (let k = 0; k < 8; k++) { const x = r.range(700, W - 300), len = r.range(400, 700), y = r.range(HZ + 20, HZ + 110); p.stroke({ brush: 'soft', color: '#c4dcf4', width: r.range(30, 56), opacity: r.range(0.07, 0.13), points: [[x, y], [x + len / 2, y + r.range(-4, 4)], [x + len, y + r.range(0, 30)]] }); }

p.save();
