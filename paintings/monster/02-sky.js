// The sky: low heavy cloud, torn open in one pale place beyond the end of the street. Under
// it the wooded hills, half lost in the rain, and behind the roofs on the left a column of
// smoke: something in the town is burning.
'use strict';
const { studio, open, W, BREAK, skyColor, glow, nA, nB, nC } = require('./scene');
const { shift, mix, wave, clamp, smooth, mass } = studio;

const p = open('sky');
const r = p.rng;
const slant = (x, y) => -0.12 + (nB(x / 300, y / 160) - 0.5) * 0.5;

p.fill({
  bounds: [0, 0, W, 520], width: 46, length: 300, spacing: 0.55, overlap: 0.55, angle: slant,
  color: (x, y) => shift(skyColor(x, y), r.range(-3, 3), r.range(-0.02, 0.03), r.range(-0.014, 0.016)),
  stroke: { brush: 'bristle', opacity: 0.9, mix: 0.3 },
});
p.fill({
  bounds: [0, 0, W, 510], width: 24, length: 170, spacing: 0.9, overlap: 0.7, angle: slant,
  color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-24, 24)), r.range(-4, 4), r.range(-0.02, 0.04), r.range(-0.02, 0.03)),
  stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 },
});

// Cloud: banks of it, dark above, and paler along their torn undersides where the break lights them.
function bank(cx, cy, len, thick, tilt = 0) {
  const g = clamp(glow(cx, cy + thick) * 1.2, 0, 1);
  const n = Math.round(10 + len / 40);
  for (let k = 0; k < n; k++) {
    const u = r.range(-0.5, 0.5), t = clamp(r() * 1.15 - 0.05, 0, 1), span = len * r.range(0.25, 0.6) * (1 - 0.6 * Math.abs(u));
    const x = cx + u * len * 0.8, y = cy + (t - 0.5) * thick * (1 - 0.5 * Math.abs(u)) + tilt * u * len;
    p.stroke({ brush: 'bristle', color: mix(mix(mix('#22282e', '#3e484f', r()), '#aab4b2', smooth(0.5, 1, t) * g), '#000000', r() * 0.06), width: r.range(16, 30) * (0.6 + 0.6 * (1 - Math.abs(u))), opacity: r.range(0.6, 0.9), mix: 0.35, dry: 0.08, rag: 0.4, taper: [0.5, 0.5],
      points: wave(x - span / 2, y - tilt * span / 2, x + span / 2, y + tilt * span / 2 + r.range(-4, 4), r.range(2, 6), 1.2, 7) });
  }
}
for (const [cx, cy, len, thick, tilt] of [
  [200, 60, 640, 100, 0.03], [760, 44, 720, 80, -0.01], [1380, 70, 660, 110, -0.03], [380, 180, 560, 80, 0.05], [1240, 190, 620, 90, -0.04],
  [120, 300, 460, 70, 0.07], [1500, 310, 460, 80, -0.06], [560, 250, 300, 44, 0.04], [1180, 290, 300, 40, -0.03],
]) bank(cx, cy, len, thick, tilt);
// The break itself: paler still, and long thin lights across it.
for (const [w, o] of [[240, 0.16], [130, 0.22]]) p.stroke({ brush: 'soft', color: '#eef0e4', width: w, opacity: o, points: [[BREAK.x - w * 1.05, BREAK.y + 6], [BREAK.x, BREAK.y - 6], [BREAK.x + w * 1.05, BREAK.y + 8]] });
for (let k = 0; k < 9; k++) {
  const x = BREAK.x + r.range(-230, 150), y = BREAK.y + r.range(-60, 70), len = r.range(120, 300);
  p.stroke({ brush: 'bristle', color: mix('#dfe4da', '#f6f6ec', r()), width: r.range(6, 11), opacity: r.range(0.3, 0.6), mix: 0.3, dry: 0.1, rag: 0.4, taper: [0.5, 0.5], points: wave(x, y, x + len, y + r.range(-10, 4), 3, 1, 7) });
}

// The hills: a far one, nearly gone in the rain, and nearer ones, dark with fir, at either side.
const farHill = (x) => 432 + 14 * Math.sin(x / 240 + 1) + 22 * (nA(x / 160, 5) - 0.5);
const nearHill = (x) => 474 - 70 * Math.exp(-Math.pow((x - 180) / 380, 2)) - 58 * Math.exp(-Math.pow((x - 1500) / 360, 2)) + 14 * (nA(x / 90, 9) - 0.5);
for (const [line, color, firs] of [[farHill, '#74827f', 0], [nearHill, '#43514d', 1]]) {
  p.fill({ inside: (x, y) => y > line(x) + 7 && y < 505, bounds: [-20, 340, W + 20, 505], width: 16, length: 90, spacing: 0.5, angle: (x) => Math.atan2(line(x + 12) - line(x - 12), 24), color: (x, y) => mix(color, '#8f9b9b', smooth(line(x), 500, y) * 0.5 + (nC(x / 40, y / 20) - 0.5) * 0.16), stroke: { brush: 'bristle', opacity: 0.95, mix: 0.15, dry: 0.05 } });
  for (let x = -30; x < W + 10; x += 90) {                               // its edge against the sky, soft
    const pts = [];
    for (let k = 0; k <= 6; k++) pts.push([x + k * 16, line(x + k * 16) + 6]);
    p.stroke({ brush: 'bristle', color: mix(color, '#8f9b9b', 0.1), width: 13, mix: 0.25, dry: 0.05, rag: 0.4, points: pts });
  }
  for (let x = -10; firs && x < W + 10; x += r.range(3, 8)) {            // firs along the top of the nearer one, in clumps
    if (nA(x / 46, 13) < 0.42) continue;
    const h = r.range(13, 24) * (0.6 + 0.8 * nA(x / 30, 17));
    p.tryStroke({ brush: 'bristle', color: mix(color, '#242c2e', r() * 0.4), width: r.range(4.6, 7.5), taper: [0, 1], mix: 0.15, dry: 0, rag: 0.35, points: [[x, line(x) + 9], [x + r.range(-2, 2), line(x) + 9 - Math.max(12.5, h)]] });
  }
}
for (let k = 0; k < 14; k++) {                                          // rain and cloud lying on them
  const x = r.range(-100, W - 200), y = r.range(400, 490), len = r.range(260, 560);
  p.stroke({ brush: 'soft', color: mix('#8c9896', '#b8c0bc', r()), width: r.range(30, 56), opacity: r.range(0.14, 0.26), points: wave(x, y, x + len, y + r.range(-6, 6), 4, 1, 7) });
}

// The smoke of the fire: it stands up behind the roofs on the left and leans away on the wind.
{
  const puffs = [], h = 300, path = (t) => [560 + 170 * t * t + Math.sin(t * 6) * 10 * t, 420 - h * t];
  for (let t = 0; t <= 1; t += 0.06) {
    const [x, y] = path(t), rad = 16 + 44 * t;
    puffs.push([x + r.range(-0.3, 0.3) * rad, y, rad * r.range(0.8, 1.1)]);
    if (t > 0.25) puffs.push([x + r.range(-0.9, 0.9) * rad, y + r.range(-0.4, 0.4) * rad, rad * r.range(0.5, 0.75)]);
  }
  const tones = (t, x, y) => { const up = clamp((420 - y) / h, 0, 1); return mix(mix(mix('#1c2024', '#3c444a', t), mix('#5a3024', '#b8603a', t), clamp(1 - up * 3.2, 0, 1) * 0.7), skyColor(x, y), 0.18 + 0.5 * up); };
  mass(p, puffs, { light: [0.5, -0.6], tones, bias: 0.4, contrast: 0.6, grain: 0.25, mix: 0.3, seed: 77, stroke: { rag: 0.4, hardness: 0.7 }, flow: (x, y) => -1.1 + (nB(x / 40, y / 40) - 0.5) * 1.2, layers: [[14, 44, 0.9, 5, 0.45], [8, 26, 0.75, 3, 0.75]] });
  p.stroke({ brush: 'soft', color: '#c8643a', width: 60, opacity: 0.2, points: [[490, 446], [556, 430], [620, 446]] });   // the fire under it, behind the roofs
}

p.save();
