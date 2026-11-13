// The valley below: wooded hills at the foot of the range and either side, the flat floor
// with its frozen river, mist lying on it, and the village the travelers are making for,
// with a few lamps lit and the smoke of the morning fires going up into the light.
'use strict';
const { studio, open, W, BASE, VILLAGE, farHill, leftHill, rightHill, near, nA, nB, nC } = require('./scene');
const { mix, wave, clamp } = studio;

const p = open('valley');
const r = p.rng;

// A far-off conifer: one stroke, wide at the foot and thinning to the tip.
function spire(x, base, h, w, color, opacity = 1) {
  const tilt = r.range(-0.08, 0.08) * h;
  return p.tryStroke({ brush: 'bristle', color, width: Math.max(4.4, w), opacity, taper: [0, 1], rag: 0.25, mix: 0, dry: 0, streak: 0.1, jitter: 0.3, cap: 'round', points: [[x, base], [x + tilt * 0.4, base - h * 0.5], [x + tilt, base - h]] });
}
// A wooded hill. First the snow on it, then the forest: conifers standing close, each a dark
// stroke, thick where the wood is thick and thin or missing where the snow shows through.
// They are painted from the top of the hill down, so the nearer stand in front.
function hill(line, x0, x1, nearness, size, seed, deep = 1e9) {
  const snowy = (x, y) => mix(mix('#9aa8da', '#8796cc', nearness), '#a8b4e2', nA(x / 60, y / 20) * 0.5);
  const dark = (x, y) => mix(mix('#55649a', '#232e58', nearness), mix('#6272a4', '#34406c', nearness), nA(x / 24, y / 12 + seed));
  const slope = (x) => Math.atan2(line(x + 12) - line(x - 12), 24);
  p.fill({ inside: (x, y) => x > x0 && x < x1 && y > line(x) + 6 && y < Math.min(near(x) + 10, line(x) + deep), bounds: [x0, BASE - 20, x1, 900], width: 14, length: 70, spacing: 0.5, angle: (x, y) => slope(x) * 0.8 + (nB(x / 70, y / 30) - 0.5) * 0.3, color: snowy, stroke: { brush: 'bristle', opacity: 0.96, mix: 0.12, dry: 0.05 } });
  const wood = (x, y) => nC(x / 90 + seed, y / 50) * 0.65 + nB(x / 30, y / 26 + seed) * 0.45;      // how thick the forest is at a place
  const trees = [], step = size * 0.42;
  for (let y = BASE - 30; y < 900; y += step * 0.8) {
    for (let x = x0; x < x1; x += step) {
      const tx = x + r.range(-0.5, 0.5) * step, ty = y + r.range(-0.5, 0.5) * step, top = line(tx);
      if (ty < top + 2 || ty > Math.min(near(tx) + 4, top + deep)) continue;
      const edge = ty < top + size * 0.6;                                                        // along the top of the hill the trees stand against what is behind
      if (wood(tx, ty) < (edge ? 0.42 : 0.52)) continue;
      trees.push([tx, ty, size * r.range(0.7, 1.25) * (0.75 + 0.5 * wood(tx, ty)) * (edge && r() < 0.12 ? 1.5 : 1)]);
    }
  }
  trees.sort((a, b) => a[1] - b[1]);
  for (const [x, y, h] of trees) spire(x, y, Math.max(13, h), Math.max(13, h) * 0.34, mix(dark(x, y), '#10183a', r() * 0.3 * nearness));
}

// The hills at the foot of the range, blue with distance.
hill(farHill, -20, W + 20, 0.12, 15, 1, 46);

// The floor of the valley: level snow, in shadow, paler far off.
const floor = (x, y) => { const t = clamp((y - (BASE + 30)) / 240, 0, 1); return mix(mix('#aab6e2', '#9aa9dc', nA(x / 200, y / 20)), mix('#8494cc', '#7484c0', nA(x / 160, y / 26)), t); };
p.fill({ inside: (x, y) => y > farHill(x) + 34 && y < near(x) + 10, bounds: [-20, BASE + 20, W + 20, 900], width: (x, y) => 9 + 14 * clamp((y - BASE - 30) / 240, 0, 1), length: 150, spacing: 0.5, overlap: 0.55, angle: (x, y) => (nB(x / 200, y / 60) - 0.5) * 0.1, color: floor, stroke: { brush: 'bristle', opacity: 0.95, mix: 0.15, dry: 0.05 } });

// The river, frozen: it holds the sky, pale blue with rose in it.
const river = [[1016, 598, 0.2], [968, 614, 0.28], [1050, 632, 0.38], [1108, 650, 0.5], [1040, 676, 0.64], [960, 700, 0.8], [1010, 730, 0.92], [1130, 762, 1]];
p.stroke({ brush: 'bristle', color: '#b0bde8', width: 30, mix: 0.1, dry: 0, rag: 0.1, cap: 'round', points: river });
for (let i = 0; i + 3 < river.length; i++) {
  const seg = river.slice(i, i + 4);
  p.tryStroke({ brush: 'bristle', color: mix('#c8cdee', '#f2ccd4', r()), width: 16, opacity: 0.8, mix: 0.3, dry: 0.05, rag: 0.2, cap: 'round', points: seg.map(([x, y, q]) => [x + 1, y - 1, q]) });
}
for (let k = 0; k < 14; k++) {                                          // light on the ice
  const f = r.range(0.3, 0.98), i = Math.min(river.length - 2, Math.floor(f * (river.length - 1))), g = f * (river.length - 1) - i;
  const x = river[i][0] + (river[i + 1][0] - river[i][0]) * g, y = river[i][1] + (river[i + 1][1] - river[i][1]) * g, len = 13 + 26 * f;
  p.tryStroke({ color: '#f4f0fc', width: 4, opacity: r.range(0.4, 0.8), points: [[x - len / 2, y + r.range(-5, 5) * f], [x + len / 2, y + r.range(-5, 5) * f]] });
}

// The hills either side of the valley.
hill(leftHill, -20, 944, 0.6, 26, 2);
hill(rightHill, 1226, W + 20, 0.6, 26, 3);
for (let x = 0; x < 430; x += r.range(14, 30)) {                        // the first sun in the tops of the highest trees, far to the left
  const y = leftHill(x) - r.range(6, 22);
  p.tryStroke({ color: mix('#ffc8a8', '#ffe6cc', r()), width: 4, opacity: r.range(0.35, 0.7), taper: [0, 0.6], points: [[x - 2, y + 13], [x - 1, y]] });
}

// Mist lying on the floor of the valley.
for (let k = 0; k < 16; k++) {
  const x = r.range(-100, W - 200), y = r.range(BASE + 30, 760), len = r.range(260, 560);
  p.stroke({ brush: 'soft', color: mix('#b6c0e8', '#d4cdea', r()), width: r.range(24, 46), opacity: r.range(0.1, 0.2), points: wave(x, y, x + len, y + r.range(-5, 5), 4, 1, 7) });
}

// The village.
const V = (dx, dy) => [VILLAGE.x + dx, VILLAGE.y + dy];
const houses = [[-52, 6, 22], [-30, -6, 18], [-8, 4, 24], [14, -8, 20], [34, 6, 22], [56, -4, 18], [4, 20, 20], [-36, 20, 18]];
for (const [dx, dy] of [[-30, -6], [14, -8], [34, 6]]) {                // smoke: blue in the shade of the valley, rose where it climbs into the sun
  const [x, y] = V(dx, dy - 10), h = r.range(74, 110), drift = r.range(22, 46);
  p.stroke({ brush: 'bristle', color: '#929cca', width: 5, opacity: 0.5, mix: 0.3, dry: 0.2, rag: 0.4, taper: [0.2, 0.2], points: [[x, y], [x + 2, y - h * 0.3], [x + 6, y - h * 0.6]] });
  p.stroke({ brush: 'bristle', color: '#f4ccd0', width: 7, opacity: 0.5, mix: 0.3, dry: 0.2, rag: 0.4, taper: [0.2, 0.7], points: [[x + 6, y - h * 0.6], [x + 14, y - h * 0.85], [x + drift, y - h], [x + drift * 2, y - h - 8]] });
}
for (const [dx, dy, w] of houses.sort((a, b) => a[1] - b[1])) {
  const [x, y] = V(dx, dy), lamp = r() < 0.7;
  p.line(x - w / 2, y, x + w / 2, y, { brush: 'bristle', color: mix('#262a4c', '#34385c', r()), width: 7, mix: 0, dry: 0, rag: 0.1, cap: 'flat' });                                              // its wall
  p.stroke({ brush: 'bristle', color: mix('#9cacde', '#b4c0ea', r()), width: 6, mix: 0, dry: 0, rag: 0.1, cap: 'round', points: [[x - w / 2 - 3, y - 4.5], [x, y - 8.5], [x + w / 2 + 3, y - 4.5]] });   // the snow on its roof
  if (lamp) {
    p.stroke({ brush: 'soft', color: '#ff9c50', width: 12, opacity: 0.4, points: [[x - 13, y + 1], [x + 13, y + 1]] });
    p.line(x - 6.2, y + 1, x + 6.2, y + 1, { color: mix('#ffc070', '#ffe2a0', r()), width: 4, opacity: 0.95 });
  }
}
p.stroke({ brush: 'soft', color: '#ffa860', width: 60, opacity: 0.14, points: [V(-66, 8), V(0, 2), V(66, 8)] });   // the glow of the place

p.save();
