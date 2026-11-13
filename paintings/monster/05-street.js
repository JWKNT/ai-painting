// The road: wet cobbles from the end of the street to our feet, with a channel down the
// middle and a flagged walk along each row of houses. It is dark where it shows the houses
// and bright where it shows the break in the cloud, in a long shape that comes straight
// toward us. The lamps in the windows lie on it too, and there are pools.
'use strict';
const { studio, open, W, H, VP, LEFT, RIGHT, at, roadLeft, roadRight, shine, nA, nB } = require('./scene');
const { mix, clamp } = studio;

const p = open('street');
const r = p.rng;
const walk = (y) => 0.6 * (y - VP.y);                                  // how wide the flagged walk is, at a depth

function wet(x, y) {
  const d = (y - 470) / 530;
  let c = mix('#272d31', '#414a4e', nA(x / 60, y / 14));
  const edge = Math.min(x - roadLeft(y), roadRight(y) - x);
  if (edge < walk(y) * 2.2) c = mix(c, '#7a7e78', clamp(1 - edge / (walk(y) * 2.2), 0, 1) * 0.35);   // near the walls it shows them, a little paler
  return mix(c, '#cfd6d0', clamp(shine(x, y) * (0.62 + 0.7 * nB(x / (20 + 60 * d), y / 8)), 0, 1));
}
// Cobbles: row behind row, each a line of short strokes, the rows close together far off.
for (let y = 524; y < H + 12;) {
  const d = (y - 470) / 530, h = 3.4 + 20 * d, xl = Math.max(-20, roadLeft(y) - 8), xr = Math.min(W + 20, roadRight(y) + 8);
  for (let x = xl + r.range(0, 20); x < xr;) {
    const len = Math.max(2.3 * (h + 1.5), (22 + 54 * d) * r.range(0.7, 1.3)), bow = r.range(-0.03, 0.03) * len;
    p.tryStroke({ brush: 'bristle', color: wet(x + len / 2, y), width: Math.max(4.6, h + 1.5), mix: 0.12, dry: 0.05, rag: 0.25, cap: 'round', streak: 0.3, jitter: 0.5, points: [[x, y], [x + len / 2, y + bow], [x + len, y + r.range(-1, 1)]] });
    x += len * r.range(0.86, 1.0);
  }
  y += h * 0.82;
}
// The joints between the stones: short dark marks, so that it is a road and not water.
for (let k = 0; k < 520; k++) {
  const y = 540 + Math.pow(r(), 0.7) * 470, d = (y - 470) / 530, x = r.range(Math.max(0, roadLeft(y)), Math.min(W, roadRight(y))), len = Math.max(12.4, (10 + 30 * d) * r.range(0.7, 1.2));
  p.tryStroke({ brush: 'bristle', color: '#14181a', width: 4.6, opacity: r.range(0.25, 0.5) * (1 - 0.5 * shine(x, y)), mix: 0.2, dry: 0.1, rag: 0.3, taper: [0.3, 0.3], points: [[x, y], [x + len, y + r.range(-1.5, 1.5)]] });
}
// The channel down the middle of the road.
for (let i = 0; i < 9; i++) {
  const ya = 530 + 470 * Math.pow(i / 9, 1.5), yb = 530 + 470 * Math.pow((i + 1) / 9, 1.5), xa = VP.x + (ya - VP.y) * 0.13, xb = VP.x + (yb - VP.y) * 0.13;
  p.tryStroke({ brush: 'bristle', color: '#181c1e', width: Math.max(4.6, 3 + 9 * (ya - 470) / 530), opacity: 0.5, mix: 0.2, dry: 0.05, rag: 0.2, points: [[xa, ya], [xb, yb]] });
}

// The flagged walk along each row: a little paler than the road, with a dark kerb.
for (const S of [LEFT, RIGHT]) {
  for (let i = 0; i < 7; i++) {
    const a = at(S, i / 7, 0), b = at(S, (i + 1) / 7, 0), wa = walk(a[1]), wb = walk(b[1]);
    if (wa < 5) continue;
    p.tryStroke({ brush: 'bristle', color: mix('#5a605c', '#7c827c', r()), width: Math.max(4.6, wa * 0.42), opacity: 0.85, mix: 0.2, dry: 0.05, rag: 0.2, points: [[a[0] - S.sign * wa * 0.5, a[1] + wa * 0.12, 1], [b[0] - S.sign * wb * 0.5, b[1] + wb * 0.12, clamp(wb / wa, 0.2, 1)]] });
    p.tryStroke({ brush: 'bristle', color: '#15191b', width: Math.max(4.6, wa * 0.12), opacity: 0.8, mix: 0.2, dry: 0.05, rag: 0.2, points: [[a[0] - S.sign * wa, a[1] + wa * 0.24], [b[0] - S.sign * wb, b[1] + wb * 0.24]] });
  }
}

// The lamps in the windows, long on the wet stones under them.
for (const [S, t, len] of [[LEFT, 0.43, 110], [LEFT, 0.82, 44], [RIGHT, 0.42, 110], [RIGHT, 0.9, 40]]) {
  const [x, y] = at(S, t, 0), w = walk(y);
  for (let k = 0; k < 4; k++) p.stroke({ brush: 'soft', color: mix('#e09a4c', '#ffcf86', r()), width: r.range(10, 16), opacity: r.range(0.1, 0.2), taper: [0.1, 0.7], points: [[x - S.sign * (w + 8 + k * 9), y + 10], [x - S.sign * (w + 10 + k * 10), y + 10 + len * 0.5], [x - S.sign * (w + 12 + k * 11), y + 10 + len]] });
}

// Pools standing on the road: smooth, and brighter than the stones round them.
for (const [cx, cy, w, h] of [[1184, 902, 250, 28], [650, 826, 170, 18], [1010, 742, 110, 10], [838, 946, 190, 22], [760, 690, 70, 7]]) {
  for (let k = 0; k < 3; k++) {
    const y = cy + (k - 1) * h * 0.3, half = w / 2 * (1 - 0.3 * Math.abs(k - 1));
    p.tryStroke({ brush: 'bristle', color: mix(wet(cx, cy), '#e2e6de', 0.3 + 0.5 * clamp(shine(cx, cy) * 1.5, 0, 1)), width: Math.max(4.6, h * 0.5), opacity: 0.85, mix: 0.3, dry: 0, rag: 0.1, cap: 'round', taper: [0.3, 0.3], points: [[cx - half, y], [cx, y + 1], [cx + half, y]] });
  }
  p.tryStroke({ brush: 'bristle', color: '#1c2226', width: 4.6, opacity: 0.5, mix: 0.2, dry: 0, rag: 0.1, taper: [0.4, 0.4], points: [[cx - w * 0.46, cy + h * 0.5], [cx, cy + h * 0.62], [cx + w * 0.46, cy + h * 0.5]] });
}

// A little mist low on the road, far off.
for (let k = 0; k < 7; k++) {
  const x = r.range(520, 1000), y = r.range(520, 580), len = r.range(140, 280);
  p.stroke({ brush: 'soft', color: mix('#aab4b0', '#d4dad4', r()), width: r.range(18, 30), opacity: r.range(0.1, 0.18), points: [[x, y], [x + len / 2, y + r.range(-3, 3)], [x + len, y]] });
}

p.save();
