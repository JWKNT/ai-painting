// The land. Far off, low flat-topped hills stand along the edge of the world. The plain is
// red earth, dead and dry. The sun is down for it, so it is in the shade of the evening:
// plum near us, rose far off in the dusty air. It is not flat: it has long low swells, and
// what is turned to the right, to the bright sky, is a warm red, and what is turned from
// it is a blue-violet. Dry beds of old streams wind across it, and stones lie on it.
'use strict';
const { studio, open, W, H, HORIZON, cam, away, glare, far, nA, nB, nC, nD, FOOT } = require('./scene');
const { mix, clamp, smooth, through } = studio;

const p = open('land');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.18, dry: 0.04, rag: 0.25, cap: 'round' };

// The far hills: two rows of them, with flat tops.
for (const [pts, c, d] of [[[[-20, 540], [90, 536], [150, 520], [330, 520], [390, 540], [640, 544], [720, 526], [880, 526], [940, 546], [1140, 548], [1200, 532], [1420, 530], [1480, 548], [1620, 546]], '#5c4c6c', 0.8], [[[-20, 556], [220, 552], [300, 544], [520, 546], [600, 556], [980, 558], [1060, 548], [1300, 550], [1380, 558], [1620, 556]], '#4c3c58', 0.62]]) {
  const top = through(pts);
  p.fill({ inside: (x, y) => y > top(x) + 2.5 * (nB(x / 30, d * 9) - 0.5) && y < HORIZON + 10, bounds: [0, 510, W, HORIZON + 10], width: 6, length: 56, spacing: 0.5, angle: () => r.range(-0.04, 0.04), color: (x, y) => far(mix(c, '#7c5868', nA(x / 80, y / 16) * 0.5), x, y, d), stroke: { ...line, opacity: 0.94 } });
  for (let x = 0; x < W; x += r.range(40, 130)) { const y = top(x) + 2, k = glare(x, y, 620); if (k > 0.1) p.tryStroke({ brush: 'round', color: mix('#f09c64', '#ffe4a8', k), width: 4, opacity: 0.2 + 0.6 * k, points: [[x, y], [x + r.range(14, 50), top(x + 30) + 2]] }); }   // the light on their tops, near the sun
}

// ---------------------------------------------------------------- the plain
// The ground under a place of the picture, in metres: to the right, and away from us.
const G = (x, y) => cam.groundAt(x, Math.max(y, HORIZON + 1));
// How high the land is at a place: long swells, lower ridges on them, and small roughness.
const height = (X, Z) => 16 * nA(X / 460 + 3, Z / 560) + 7 * nB(X / 140, Z / 230 + 7) + 2.6 * nC(X / 36, Z / 64);
// How much a place is turned to the bright sky, which is at the right and far off: from -1 to 1.
const turned = (x, y) => { const [X, Z] = G(x, y), d = Math.max(5, Z * 0.035); return clamp(4.6 * ((height(X - d, Z) - height(X + d, Z)) * 0.8 + (height(X, Z - d) - height(X, Z + d)) * 0.3) / d, -1, 1); };
// The great klaxosaur is between a part of the plain and the bright sky: that part is darker.
const shaded = (x, y) => smooth(-160, 140, x - (1040 - (y - FOOT) * 0.75)) * (0.5 + 0.5 * smooth(H, 640, y));
const earth = (x, y) => {
  const Z = away(y), [X] = G(x, y), k = turned(x, y), near = smooth(2400, 160, Z);
  let c = mix('#6a4258', '#35202e', near);                                                     // the red earth in the shade of the evening
  const patch = nD(X / 620 + 11, Z / 900);                                                    // wide fields of darker stones and of paler dust
  c = mix(c, patch > 0.5 ? '#7c4a54' : '#281a2c', Math.abs(patch - 0.5) * 0.55);
  c = k > 0 ? mix(c, mix('#c06c50', '#96483a', near), k * 0.72) : mix(c, '#221b38', -k * 0.72);   // warm on what is turned to the bright sky, blue-violet on what is turned from it
  c = mix(c, '#1e1830', shaded(x, y) * 0.5);
  return far(c, x, y, smooth(900, 8000, Z) * 0.8);                                             // the far part is in the dusty air
};
const lie = (x, y) => (nB(x / 340, y / 130) - 0.5) * 0.34 * smooth(600, 900, y) + r.range(-0.03, 0.03);
p.fill({ bounds: [0, HORIZON - 3, W, 640], width: 5.5, length: 50, spacing: 0.5, angle: lie, color: earth, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, 632, W, 760], width: 8, length: 76, spacing: 0.5, angle: lie, color: earth, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, 750, W, H], width: 13, length: 110, spacing: 0.5, angle: lie, color: earth, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, HORIZON, W, H], width: 5.5, length: 44, spacing: 1.0, overlap: 0.7, angle: lie, color: (x, y) => earth(x + r.range(-8, 8), y + r.range(-2, 2)), stroke: { ...line, opacity: 0.8 } });

// The dry beds of old streams. Each winds away from us across the plain, so it gets thin and its bends get flat as it goes.
// Its bed is a little darker than the plain, and its left bank, which is turned to the bright sky, a little warmer.
function bed(X0, drift, amp, lam, phase, wide, Z0, Z1) {
  const at = (Z) => { const X = X0 + drift * Z + amp * Math.sin(Z / lam + phase) + amp * 0.4 * Math.sin(Z / (lam * 0.37) + phase * 2.3); return [...cam.at(X, 0, Z), cam.unit(Z) * wide]; };
  let Z = Z0;
  while (Z < Z1) {
    const [x0, y0, w0] = at(Z); if (w0 < 4.9) break;
    let Zb = Z; for (let i = 0; i < 40; i++) { Zb *= 1.02; const q = at(Zb); if (Math.hypot(q[0] - x0, q[1] - y0) > Math.max(16, w0 * 2.6)) break; }
    const [xm, ym] = at((Z + Zb) / 2), [x1, y1] = at(Zb), d = smooth(900, 8000, Z) * 0.8;
    if (y0 < H + 20 && x0 > -80 && x0 < W + 80) {
      p.tryStroke({ ...line, color: far(mix('#1c1220', '#2a1a2a', r()), xm, ym, d), width: Math.min(w0, 22), opacity: 0.62, points: [[x0, y0], [xm, ym], [x1, y1]] });
      if (w0 > 7 && r() < 0.6) p.tryStroke({ brush: 'soft', color: far('#8c4c48', xm, ym, d), width: 8.6, opacity: 0.22, points: [[x0 - w0 * 0.7, y0 - 1], [xm - w0 * 0.7, ym - 1], [x1 - w0 * 0.7, y1 - 1]] });
    }
    Z = Zb * 0.995;
  }
}
bed(-120, 0.02, 60, 210, 0.4, 4, 260, 2400);
bed(70, 0.16, 46, 170, 2.1, 3.4, 330, 2000);
bed(-310, -0.05, 70, 260, 4.0, 4, 360, 2600);

// Stones on the plain, most of them near us: each is a dark low shape with warm red on its right side.
for (let k = 0; k < 60; k++) {
  const y = HORIZON + 50 + Math.pow(r(), 0.9) * 380, x = r.range(-20, W + 20), s = cam.unit(away(y)) * r.range(1.2, 3.6), len = Math.max(13, s * r.range(2, 4)), h = Math.max(5, s * r.range(0.8, 1.4)), sh = shaded(x, y);
  p.tryStroke({ brush: 'soft', color: '#120b16', width: Math.max(8.4, h * 1.3), opacity: 0.26, taper: [0, 0.6], points: [[x + len * 0.4, y + 2], [x - len * 0.6, y + 4], [x - len * 1.5, y + 5]] });
  p.tryStroke({ ...line, color: mix(mix('#1e141e', '#3a2430', r()), '#161226', sh * 0.6), width: h, taper: [0.3, 0.3], points: [[x - len / 2, y], [x, y - h * 0.2], [x + len / 2, y + r.range(-1, 1)]] });
  if (h >= 7 && r() < 0.7) p.tryStroke({ ...line, color: mix('#6c3c3c', '#8c4c42', r()), width: Math.max(4.8, h * 0.5), opacity: 0.5 * (1 - 0.6 * sh), taper: [0.4, 0.3], points: [[x + len * 0.08, y - h * 0.16], [x + len * 0.46, y + r.range(-1, 1)]] });
}
// The dust that hangs low over the far part of the plain.
for (let k = 0; k < 18; k++) { const x = r.range(-100, W - 200), len = r.range(300, 700), y = r.range(HORIZON - 6, HORIZON + 40); p.stroke({ brush: 'soft', color: mix('#a08490', '#f0bc90', glare(x + len / 2, y, 600)), width: r.range(16, 32), opacity: r.range(0.08, 0.16), points: [[x, y], [x + len / 2, y + r.range(-3, 3)], [x + len, y]] }); }

p.save();
