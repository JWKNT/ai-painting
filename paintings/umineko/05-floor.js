// The floor: black and pale marble in squares, like a chessboard, running back to the foot of
// the stairs and on past them at either side. It is polished. The lightning lies on it in a
// long cold shape with the bars of the window across it, and under the witch it holds her gold.
'use strict';
const { studio, open, W, FLOOR, BOLT, nA, nB, gold, cold, rowY, colX, stairLeft, stairRight } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('floor');
const r = p.rng;

// Where the flash through the window lies on the floor: 0 outside it, 1 in it.
function flash(x, y) {
  const d = y - FLOOR, mid = 420 + d * 0.95, half = 118 + d * 0.5, u = (x - mid) / half, v = d / 232;
  if (d < -6 || Math.abs(u) > 1) return 0;
  const pane = smooth(0.05, 0.11, Math.abs(u)) * smooth(1, 0.9, Math.abs(u)), row = v * 3 + 0.25, cross = smooth(0.06, 0.12, Math.abs(row - Math.round(row)));
  return pane * cross;
}
// What the floor gives back of the witch's light, straight below her.
const glow = (x, y) => Math.exp(-Math.pow((x - (905 + (y - FLOOR) * 0.1)) / (150 + (y - FLOOR) * 0.4), 2)) * clamp(0.8 - 0.5 * (y - FLOOR) / 230, 0, 1);
function tile(x, y, pale) {
  const n = nA(x / 50, y / 20);
  let c = pale ? mix('#383250', '#4a4462', n) : mix('#0d0a15', '#161222', n);
  if (y < FLOOR) c = mix(mix(c, pale ? '#b89050' : '#4a3418', clamp(gold(x, y, 420) * 0.7, 0, 1)), pale ? '#9aa8d8' : '#34406c', clamp(cold(x, y, 260) * 0.5, 0, 1));
  else c = mix(c, pale ? '#e4b868' : '#6c4a20', clamp(glow(x, y), 0, 1));
  return mix(c, pale ? '#b8c6f0' : '#3c4a7a', flash(x, y));
}

// Each row of squares is laid in thin level strokes. A stroke ends where its square ends at
// that height, so the sides of the squares run away to the vanishing point.
for (let k = 12; k >= 0; k--) {                                        // the farthest row first
  const y0 = rowY(k + 1), y1 = rowY(k), h = y1 - y0, lanes = Math.max(1, Math.round(h / 8));
  for (let i = 0; i < lanes; i++) {
    const y = y0 + h * (i + 0.5) / lanes, w = Math.max(4.6, h / lanes + 1.5);
    for (let j = -14; j < 14; j++) {
      const x0 = colX(j, y), x1 = colX(j + 1, y);
      if (x1 < -30 || x0 > W + 30) continue;
      const pale = (((j + k) % 2) + 2) % 2 === 0;
      const spans = y1 > FLOOR + 1 ? [[x0, x1]] : [[x0, Math.min(x1, stairLeft(y) - 6)], [Math.max(x0, stairRight(y) + 6), x1]];   // behind the foot of the stairs there is floor only at the sides
      for (const [a, b] of spans) {
        if (b - a < 10) continue;
        const n = Math.max(1, Math.round((b - a) / 110));
        for (let q = 0; q < n; q++) {
          const sa = a + (b - a) * q / n, sb = a + (b - a) * (q + 1) / n;
          p.tryStroke({ brush: 'bristle', color: tile((sa + sb) / 2 + r.range(-6, 6), y, pale), width: w, mix: 0.06, dry: 0.03, rag: 0.12, cap: 'flat', streak: 0.3, jitter: 0.5, points: [[sa + (q ? -1 : 1), y], [sb + (q < n - 1 ? 1 : -1), y]] });
        }
      }
    }
  }
}

// The joints between the squares: thin dark lines, the long ones running to the vanishing point.
for (let j = -14; j <= 14; j++) {
  const top = Math.abs(colX(j, 700) - 800) < 322 ? FLOOR : 664;       // behind the foot of the stairs there is no floor
  p.tryStroke({ brush: 'bristle', color: '#07050c', width: 4.6, opacity: 0.5, mix: 0.1, dry: 0.05, rag: 0.2, points: [[colX(j, top), top], [colX(j, 1010), 1010]] });
}
for (let k = 1; k <= 12; k++) {
  const y = rowY(k);
  for (const [a, b] of y > FLOOR ? [[-10, W + 10]] : [[-10, stairLeft(y) - 6], [stairRight(y) + 6, W + 10]]) {
    p.tryStroke({ brush: 'bristle', color: '#07050c', width: 4.6, opacity: 0.42, mix: 0.1, dry: 0.05, rag: 0.2, points: [[a, y], [(a + b) / 2, y], [b, y]] });
  }
}

// The polish: what stands above the floor shows in it, drawn straight down.
for (let k = 0; k < 12; k++) {
  const x = 905 + r.range(-90, 90), y0 = FLOOR + r.range(4, 30), len = r.range(70, 190);
  p.stroke({ brush: 'soft', color: mix('#ffb040', '#ffe08a', r()), width: r.range(12, 22), opacity: r.range(0.07, 0.14), taper: [0.1, 0.7], points: [[x, y0], [x + r.range(-3, 3), y0 + len / 2], [x + r.range(-6, 6), y0 + len]] });
}
for (let k = 0; k < 7; k++) {
  const x = BOLT.x + r.range(-56, 56), y0 = 668 + r.range(0, 10), len = r.range(60, 96);
  p.stroke({ brush: 'soft', color: '#c4d2fa', width: r.range(10, 16), opacity: r.range(0.1, 0.2), taper: [0.1, 0.6], points: [[x, y0], [x + r.range(-2, 2), y0 + len / 2], [x + r.range(-3, 3), y0 + len]] });
}
// A little dust in the cold light.
for (let k = 0; k < 10; k++) {
  const x = r.range(0, W - 300), y = r.range(700, 990), len = r.range(200, 420);
  p.stroke({ brush: 'soft', color: mix('#141024', '#1e1a34', nB(x / 90, y / 40)), width: r.range(30, 50), opacity: 0.12, points: [[x, y], [x + len / 2, y + r.range(-4, 4)], [x + len, y]] });
}

p.save();
