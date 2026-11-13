// The castle: its green hill, cherry trees behind it, the keep in three white storeys under
// dark roofs with gold at the ridge, then more cherry trees and a few pines in front.
'use strict';
const { studio, open, CASTLE, castleHill, nA, nB, lit } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('castle');
const r = p.rng;

// The hill.
{
  const slope = (x) => Math.atan2(castleHill(x + 12) - castleHill(x - 12), 24);
  const foot = (x) => castleHill(x) + 34 + 40 * smooth(60, 420, x) * smooth(760, 420, x);
  const hill = (x, y) => mix(mix('#6fae52', '#8cc463', nA(x / 50, y / 24)), '#5a9a48', clamp((x - 420) / -500 + 0.3, 0, 0.8));
  // toward its foot the hill takes the color of the fields, so it rises out of the plain
  const green = (x, y) => mix(hill(x, y), mix('#b6d47a', '#c8da8c', nA(x / 90, y / 20)), smooth(0.45, 1, (y - castleHill(x)) / (foot(x) - castleHill(x))) * 0.85);
  p.fill({ inside: (x, y) => x > 60 && x < 760 && y > castleHill(x) + 9 && y < foot(x), bounds: [60, 490, 760, 640], width: 18, length: 110, spacing: 0.5, angle: (x, y) => slope(x) * 0.8 + (nB(x / 60, y / 30) - 0.5) * 0.3, color: green, stroke: { brush: 'bristle', opacity: 0.95, mix: 0.2, dry: 0.05 } });
  for (let x = 70; x < 740; x += 110) {
    const pts = [];
    for (let k = 0; k <= 6; k++) pts.push([x + k * 20, castleHill(x + k * 20) + 6]);
    p.stroke({ brush: 'bristle', color: green(x + 60, castleHill(x + 60)), width: 12, mix: 0.1, dry: 0, points: pts });
  }
  for (let x = 40; x < 760; x += 170) {                             // a clean brush along the foot
    p.stroke({ brush: 'blend', width: 30, opacity: 0.6, points: [[x, foot(x) - 4], [x + 95, foot(x + 95) + 2], [x + 190, foot(x + 190) - 4]] });
  }
}

// A cherry tree in bloom: a dark trunk, then a crown of short dabs, deeper pink below and
// to the left, nearly white where the sun strikes it.
function cherry(x, y, size) {
  p.tryStroke({ color: '#4a3028', width: Math.max(4, size * 0.09), taper: [0, 0.5], points: [[x, y], [x + r.range(-3, 3), y - size * 0.45], [x + r.range(-6, 6), y - size * 0.8]] });
  const cx = x + r.range(-3, 3), cy = y - size * 0.95, rx = size * 0.62, ry = size * 0.46;
  const dabs = [];
  for (let k = 0; k < Math.round(10 + size * 0.5); k++) {
    const a = r() * 6.283, d = Math.sqrt(r());
    dabs.push([cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d]);
  }
  dabs.sort((a, b) => (a[0] - a[1]) - (b[0] - b[1]));              // shade first, sunlit last
  for (const [dx, dy] of dabs) {
    const light = clamp(0.5 + ((dx - cx) / rx - (dy - cy) / ry) * 0.42 + r.range(-0.15, 0.15), 0, 1);
    const color = light < 0.4 ? mix('#d9799d', '#ee9ab8', light / 0.4) : light < 0.8 ? mix('#ee9ab8', '#fcc3d6', (light - 0.4) / 0.4) : mix('#fcc3d6', '#fff1f5', (light - 0.8) / 0.2);
    const w = Math.max(5, size * r.range(0.16, 0.26)), a = r.range(-0.9, 0.9), len = w * 2.15 + 1;
    p.tryStroke({ brush: 'bristle', color, width: w, opacity: 0.95, mix: 0.1, dry: 0, rag: 0.25, streak: 0.15, points: [[dx - Math.cos(a) * len / 2, dy - Math.sin(a) * len / 2], [dx + r.range(-1, 1), dy - 2], [dx + Math.cos(a) * len / 2, dy + Math.sin(a) * len / 2]] });
  }
}
function pine(x, y, h) {
  p.tryStroke({ brush: 'bristle', color: mix('#2f6b3c', '#3f7f48', r()), width: Math.max(6, h * 0.3), taper: [0, 1], mix: 0, dry: 0, rag: 0.2, points: [[x, y], [x + r.range(-2, 2), y - h * 0.5], [x + r.range(-2, 2), y - h]] });
}

// Trees behind the keep.
for (const [x, size] of [[236, 40], [282, 46], [330, 44], [520, 46], [566, 42], [610, 40], [176, 34], [664, 36]]) cherry(x, castleHill(x) + 4, size);
for (const [x, h] of [[258, 34], [306, 40], [548, 40], [592, 34]]) pine(x, castleHill(x) + 6, h);

// The keep.
{
  const { x: cx, base, s } = CASTLE;
  const X = (u) => cx + u * s, Y = (v) => base + v * s;         // castle units: u to the right, v up is negative
  const sunny = (u) => clamp(0.5 + u / 150, 0, 1);

  // stone base, wider at the foot
  for (const [v, half] of [[-5, 73], [-16, 68], [-27, 63]]) {
    for (const [u0, u1] of [[-half, -8], [-12, half]]) {
      p.stroke({ brush: 'flat', color: mix(mix('#77736b', '#8e897e', r()), '#b3ad9f', sunny((u0 + u1) / 2) * 0.7), width: 12 * s * 0.72, rag: 0.05, jitter: 0.5, streak: 0.2, points: [[X(u0), Y(v)], [X((u0 + u1) / 2), Y(v) + r.range(-1, 1)], [X(u1), Y(v)]] });
    }
  }
  // a storey: plaster wall with window slits, a line of shadow under the eave above it
  const wall = (v0, v1, half) => {
    const rows = Math.max(2, Math.round((v0 - v1) / 9)), h = (v0 - v1) / rows;
    for (let k = 0; k < rows; k++) {
      const v = v0 - h * (k + 0.5);
      p.stroke({ brush: 'flat', color: mix('#cfccc6', '#e9e6de', r()), width: h * s + 3, rag: 0, cap: 'flat', jitter: 0.2, streak: 0.08, points: [[X(-half), Y(v)], [X(0), Y(v)], [X(half), Y(v)]] });
      p.line(X(-half * 0.08), Y(v), X(half), Y(v), { brush: 'flat', color: mix('#f6f3ea', '#fffdf8', r()), width: h * s + 3, rag: 0, cap: 'flat', jitter: 0.1 });   // the sunlit half
    }
    p.line(X(-half), Y(v1 + 2.4), X(half), Y(v1 + 2.4), { color: '#8f96a8', width: 4.5, opacity: 0.8 });                                              // shadow of the eave
    const n = Math.max(2, Math.round(half / 11));
    for (let k = 0; k < n; k++) {
      const u = -half + (k + 0.5) * (2 * half / n);
      p.line(X(u), Y(v0 - 2.5), X(u), Y(v0 - 2.5) - 12.5, { color: '#39404e', width: 4.5 });
    }
  };
  // a roof: tiles sloping from the wall above down to a wide eave whose corners flick up
  const roof = (vEave, vTop, halfEave, halfTop) => {
    for (const k of [0.82, 0.5, 0.18]) {
      const v = vEave + (vTop - vEave) * k, half = halfEave + (halfTop - halfEave) * k;
      p.stroke({ brush: 'flat', color: mix('#2c3546', '#4a566c', 0.3 + 0.5 * k + r() * 0.2), width: Math.abs(vTop - vEave) * s * 0.45 + 3, rag: 0, cap: 'flat', jitter: 0.4, streak: 0.2, points: [[X(-half), Y(v)], [X(0), Y(v)], [X(half), Y(v)]] });
    }
    p.stroke({ color: '#262e3c', width: 6.5, points: [[X(-halfEave - 7), Y(vEave - 6)], [X(-halfEave + 4), Y(vEave)], [X(0), Y(vEave + 1)], [X(halfEave - 4), Y(vEave)], [X(halfEave + 7), Y(vEave - 6)]] });
    p.line(X(halfEave * 0.15), Y(vEave - 3.4), X(halfEave - 5), Y(vEave - 3.4), { color: '#6f7d96', width: 4, opacity: 0.7 });   // light along the sunny end of the eave
  };

  wall(-33, -59, 56);
  roof(-59, -75, 76, 46);
  wall(-75, -99, 42);
  roof(-99, -113, 60, 32);
  wall(-113, -135, 28);
  // the top roof: a tall hipped gable with a ridge and two gold fish at its ends
  roof(-135, -150, 47, 30);
  for (const k of [0.25, 0.75]) {
    const v = -150 - 16 * k, half = 30 - 10 * k;
    p.stroke({ brush: 'flat', color: mix('#2c3546', '#46526a', k), width: 12 * s * 0.75, rag: 0, cap: 'flat', jitter: 0.4, points: [[X(-half), Y(v)], [X(0), Y(v)], [X(half), Y(v)]] });
  }
  p.line(X(-22), Y(-167), X(22), Y(-167), { color: '#232a38', width: 7 });
  p.line(X(-9), Y(-152), X(9), Y(-152), { brush: 'flat', color: '#f4efe4', width: 9, rag: 0, cap: 'flat' });      // the white gable end
  for (const side of [-1, 1]) p.line(X(side * 21), Y(-169), X(side * 24.5), Y(-176.5), { color: '#e8b838', width: 5.5 });
}

// Trees in front of the keep, larger, and along the hill.
for (const [x, dy, size] of [[352, 14, 52], [470, 14, 54], [300, 22, 58], [420, 30, 44], [530, 24, 60], [232, 30, 56], [600, 34, 58], [160, 30, 50], [670, 36, 52], [380, 44, 60], [480, 50, 62], [110, 34, 44], [722, 34, 44]]) {
  cherry(x, castleHill(x) + dy, size);
}
for (const [x, dy, h] of [[266, 34, 44], [565, 40, 46], [640, 44, 40], [196, 38, 40]]) pine(x, castleHill(x) + dy, h);

p.save();
