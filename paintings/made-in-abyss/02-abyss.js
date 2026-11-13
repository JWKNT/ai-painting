// The Abyss itself: the haze, the far wall of the pit showing through it in pale ribs, the
// nearer walls at either side with their ledges and hanging roots, a fall of water coming
// down the left wall, and the shafts of light.
'use strict';
const { studio, open, W, SRC, WATER, shaft, haze, far, gild, nA, nB, nC } = require('./scene');
const { shift, mix, smooth, glint } = studio;

const p = open('abyss');
const r = p.rng;
const down = (x, y) => Math.atan2(y - SRC.y, x - SRC.x);                // the way the light falls at a place

p.fill({ bounds: [0, 0, W, 780], width: 46, length: 300, spacing: 0.55, overlap: 0.55, angle: down, color: (x, y) => shift(haze(x, y), r.range(-4, 4), r.range(-0.03, 0.04), r.range(-0.012, 0.016)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, 760], width: 24, length: 170, spacing: 0.9, overlap: 0.7, angle: down, color: (x, y) => shift(haze(x + r.range(-30, 30), y + r.range(-24, 24)), r.range(-6, 6), r.range(-0.02, 0.06), r.range(-0.02, 0.03)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });

// A wall of the pit: a great upright mass of rock, split into ribs, with ledges across it.
// `d` is how far off it is, `x0`..`x1` its width at the top and `lean` how its edge slants.
function wall(edge, side, d, seed) {
  // edge(y): where the wall ends, toward the middle of the picture; side: -1 if it stands at the left
  const inside = (x, y) => (side < 0 ? x < edge(y) : x > edge(y)) && y < WATER + 30;
  const rock = (x, y) => {
    const rib = nA(x / 34 + seed, y / 260) * 0.7 + nB(x / 90, y / 120 + seed) * 0.4;                      // upright ribs and clefts
    let c = mix(mix('#0f2a2e', '#1f4244', rib), '#081c20', smooth(0.5, 0.2, rib) * 0.6);
    const shelf = Math.sin(y / 38 + nC(x / 200 + seed, y / 300) * 5);                                     // ledges
    if (shelf > 0.86) c = gild(mix(c, '#4c6c5c', 0.5), x, y, 0.7);
    return far(c, x, y, d);
  };
  const [bx0, bx1] = side < 0 ? [-20, 520] : [1080, W + 20];
  p.fill({ inside: (x, y) => inside(x, y), bounds: [bx0, -10, bx1, WATER + 30], width: 26, length: 150, spacing: 0.5, angle: (x, y) => Math.PI / 2 + (nB(x / 80 + seed, y / 200) - 0.5) * 0.35, color: rock, stroke: { brush: 'bristle', opacity: 0.96, mix: 0.12, dry: 0.05 } });
  p.fill({ inside: (x, y) => inside(x + side * 6, y), bounds: [bx0, -10, bx1, WATER + 30], width: 12, length: 80, spacing: 0.8, overlap: 0.7, angle: (x, y) => Math.PI / 2 + (nB(x / 60 + seed, y / 120) - 0.5) * 0.6, color: (x, y) => rock(x + r.range(-5, 5), y + r.range(-8, 8)), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.12 } });
  for (let y = 0; y < WATER; y += 70) {                                  // its edge against the haze: a little light on it
    const pts = [[edge(y), y], [edge(y + 35), y + 35], [edge(y + 70), y + 70]];
    p.stroke({ brush: 'bristle', color: rock(edge(y + 35) + side * 8, y + 35), width: 14, mix: 0.1, dry: 0, rag: 0.2, points: pts });
    if (d < 0.6) glint(p, pts.map(([x, yy]) => [x - side * 3, yy]), () => mix('#d8c888', '#fff0b8', r()), { width: 4.4, dash: 26, gap: 30, opacity: 0.5 * (0.3 + shaft(pts[1][0], pts[1][1])), rng: r });
  }
}

// The far wall, across the pit: only its ribs show, a little darker than the haze.
for (const [x, w, top] of [[120, 150, 0], [330, 110, 60], [520, 80, 140], [1230, 120, 100], [1400, 150, 30], [1560, 120, 0], [960, 70, 200]]) {
  for (let k = 0; k < 4; k++) {
    const xx = x + r.range(-0.4, 0.4) * w, y0 = top + r.range(0, 120);
    p.stroke({ brush: 'bristle', color: far('#1c4446', xx, 380, 0.9), width: w * r.range(0.3, 0.5), opacity: 0.5, mix: 0.3, dry: 0.1, rag: 0.5, taper: [0.4, 0.1], points: [[xx, y0], [xx + r.range(-14, 14), (y0 + WATER) / 2], [xx + r.range(-20, 20), WATER]] });
  }
}
// The shafts of light, in the haze in front of it.
for (const [c, w, k] of [[-0.42, 0.05, 0.6], [-0.2, 0.07, 1], [0.02, 0.05, 0.7], [0.2, 0.08, 1], [0.42, 0.05, 0.55], [0.6, 0.04, 0.4]]) {
  const at = (d) => [SRC.x + Math.sin(c) * d, SRC.y + Math.cos(c) * d];
  p.stroke({ brush: 'soft', color: '#f6e6a4', width: 1300 * w * 1.5, opacity: 0.1 * k, taper: [0, 0.5], points: [at(180), at(560), at(980)] });
  p.stroke({ brush: 'soft', color: '#fff2c0', width: 1300 * w * 0.7, opacity: 0.1 * k, taper: [0, 0.6], points: [at(180), at(520), at(900)] });
}

// The nearer walls, at either side.
wall((y) => 250 - 120 * smooth(0, 700, y) + 40 * (nA(y / 120, 3) - 0.5) + 60 * Math.exp(-Math.pow((y - 300) / 90, 2)), -1, 0.42, 1);
wall((y) => 1370 + 110 * smooth(0, 700, y) + 44 * (nA(y / 120, 13) - 0.5) - 50 * Math.exp(-Math.pow((y - 420) / 110, 2)), 1, 0.36, 7);

// Roots hanging from the ledges.
for (let k = 0; k < 44; k++) {
  const left = r() < 0.5, x = left ? r.range(0, 250) : r.range(1400, W), y = r.range(40, 560), len = r.range(40, 150);
  p.tryStroke({ brush: 'bristle', color: far('#0a1e20', x, y, 0.3), width: r.range(4.6, 6), opacity: 0.7, taper: [0, 0.8], mix: 0.1, dry: 0.05, rag: 0.2, points: [[x, y], [x + r.range(-8, 8), y + len * 0.5], [x + r.range(-14, 14), y + len]] });
}

// Water falling down the left wall: a pale thread that comes apart into mist.
{
  const top = [262, 262], fall = (t) => [top[0] + 26 * t + 8 * Math.sin(t * 9), top[1] + (WATER - top[1]) * t];
  p.stroke({ brush: 'soft', color: '#dce8d0', width: 30, opacity: 0.3, taper: [0, 0.3], points: [0, 0.3, 0.62, 1].map(fall) });
  for (let k = 0; k < 3; k++) {
    const dx = (k - 1) * 7;
    p.stroke({ brush: 'bristle', color: mix('#c8dcc4', '#f2f6e0', r()), width: r.range(10, 16), opacity: r.range(0.3, 0.5), mix: 0.3, dry: 0.3, rag: 0.6, taper: [0.05, 0.5], points: [0, 0.3, 0.62, 1].map((t) => { const [x, y] = fall(t); return [x + dx * (0.6 + t * 1.6) + r.range(-3, 3), y]; }) });
  }
  for (const [w, o, y] of [[70, 0.2, WATER - 30], [110, 0.14, WATER - 8]]) p.stroke({ brush: 'soft', color: '#d8e6d0', width: w, opacity: o, points: [[300 - w * 1.05, y], [300, y - 10], [300 + w * 1.05, y]] });
}

p.save();
