// Pines: a few standing on the cliff and the slope, and two great trunks close by on the
// left with their boughs hanging into the sky.
'use strict';
const { studio, open, H, cliffTop, slopeTop, pine } = require('./scene');
const { mix } = studio;

const p = open('pines');
const r = p.rng;
const RIM = '#f08a3c';

// On the cliff, left of the camp.
pine(p, 296, cliffTop(296) + 10, 330, { rim: RIM, rimSide: 1, lean: 0.02 });
pine(p, 238, cliffTop(238) + 12, 530, { rim: RIM, rimSide: 1, lean: -0.012 });

// On the slope to the right, against the glow.
pine(p, 1372, slopeTop(1372) + 10, 250, { rim: RIM, rimSide: -1, lean: 0.02 });
pine(p, 1434, slopeTop(1434) + 12, 410, { rim: RIM, rimSide: -1, lean: -0.015 });
pine(p, 1574, slopeTop(1574) + 12, 560, { rim: RIM, rimSide: -1, lean: 0.01 });
pine(p, 1502, slopeTop(1502) + 14, 700, { rim: RIM, rimSide: -1, lean: -0.008, spread: 0.16 });

// The two near trunks: each a few heavy strokes, bark dragged down them, light along the right edge.
function trunk(x, width, leanTop) {
  const top = -30, base = H + 30, xa = (y) => x + leanTop * (base - y) / (base - top);
  for (const [dx, w, color] of [[0, width, '#0a0b16'], [-width * 0.18, width * 0.55, '#0d0e1b'], [width * 0.2, width * 0.45, '#10101f']]) {
    p.stroke({ brush: 'bristle', color, width: w, mix: 0, dry: 0, rag: 0, streak: 0.2, jitter: 0.5, points: [[xa(base) + dx, base], [xa(550) + dx, 550], [xa(top) + dx, top]] });
  }
  for (let k = 0; k < Math.round(width * 0.9); k++) {   // bark
    const y0 = r.range(-10, H - 90), len = r.range(50, 150), dx = r.range(-0.42, 0.42) * width;
    p.stroke({ brush: 'dry', color: r.pick(['#191a2e', '#14152a', '#1f1d33', '#07070f']), width: r.range(5, 9), opacity: 0.7, load: 0, dry: 0.5, points: [[xa(y0) + dx, y0], [xa(y0 + len / 2) + dx + r.range(-2, 2), y0 + len / 2], [xa(y0 + len) + dx, y0 + len]] });
  }
  for (let y = r.range(0, 80); y < H - 60; y += r.range(110, 240)) {   // the sun finding the edge of the trunk, here and there
    const len = r.range(30, 95);
    p.tryStroke({ color: mix('#c2582c', '#ffa04c', r()), width: r.range(4, 5), opacity: r.range(0.3, 0.7), taper: [0.35, 0.35], points: [[xa(y) + width * 0.47, y], [xa(y + len / 2) + width * 0.47 + r.range(-1.5, 1.5), y + len / 2], [xa(y + len) + width * 0.47, y + len]] });
  }
  return xa;
}

// A great bough: a branch reaching out, sagging and lifting again at the tip, bristling
// with short needles above and below, and smaller twigs along it.
function bough(x0, y0, reach, droop, side) {
  const at = (f) => [x0 + side * reach * f, y0 + droop * Math.sin(f * 2.2) * 0.75 + reach * 0.05 * f];
  p.stroke({ brush: 'bristle', color: '#0a0c18', width: 14, taper: [0, 0.85], rag: 0, mix: 0, dry: 0, cap: 'round', points: [at(0), at(0.3), at(0.65), at(1)] });
  const needle = (nx, ny, len, w, dir) => {
    p.tryStroke({ brush: 'bristle', color: r.pick(['#0a0e19', '#0e1822', '#0c141e', '#101c24']), width: Math.max(4.5, w), taper: [0, 0.75], rag: 0.3, mix: 0, dry: 0, streak: 0.12, jitter: 0.3, points: [[nx, ny], [nx + Math.cos(dir) * len * 0.55, ny + Math.sin(dir) * len * 0.5], [nx + Math.cos(dir) * len, ny + Math.sin(dir) * len]] });
    return [nx + Math.cos(dir) * len, ny + Math.sin(dir) * len];
  };
  const n = Math.round(reach / 6.5);
  for (let k = 0; k < n; k++) {
    const f = (k + r()) / n, [nx, ny] = at(f), thin = 1 - 0.4 * f;
    const below = r() < 0.68;
    const dir = (below ? r.range(0.7, 1.35) : -r.range(0.5, 1.1));
    const tip = needle(nx, ny, r.range(17, 34) * thin * (below ? 1 : 0.7), r.range(6, 10) * thin, side > 0 ? dir : Math.PI - dir);
    if (side > 0 && !below && r() < 0.5) {   // the low sun on the upper needles
      p.tryStroke({ color: RIM, width: 4, opacity: r.range(0.3, 0.7), taper: [0, 0.5], points: [[(nx + tip[0]) / 2 + 2, (ny + tip[1]) / 2 - 1], [tip[0] + 2, tip[1] - 1]] });
    }
  }
  for (let k = 0; k < Math.round(reach / 60); k++) {   // twigs: small boughs of their own
    const f = r.range(0.25, 0.85), [tx, ty] = at(f), len = reach * r.range(0.22, 0.36), dir = r.range(0.35, 0.8);
    const end = needle(tx, ty, len, 8, side > 0 ? dir : Math.PI - dir);
    for (let q = 0; q < Math.round(len / 9); q++) {
      const g = r.range(0.2, 1), qx = tx + (end[0] - tx) * g, qy = ty + (end[1] - ty) * g, d2 = r() < 0.6 ? r.range(0.9, 1.5) : -r.range(0.3, 0.9);
      needle(qx, qy, r.range(14, 22), 5.5, side > 0 ? d2 : Math.PI - d2);
    }
  }
}

const farTrunk = trunk(172, 44, 14);
for (const [y, reach, droop] of [[70, 170, 70], [210, 135, 84], [330, 100, 70]]) bough(farTrunk(y) + 14, y, reach, droop, 1);
for (const [y, reach, droop] of [[30, 90, 60], [150, 70, 60]]) bough(farTrunk(y) - 14, y, reach, droop, -1);

const nearTrunk = trunk(52, 66, -10);
for (const [y, reach, droop] of [[-10, 250, 110], [120, 200, 120], [255, 150, 105]]) bough(nearTrunk(y) + 24, y, reach, droop, 1);

p.save();
