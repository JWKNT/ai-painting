// The sky, the far land and the Plantation. The sky is pale and full of dust, with long
// grey clouds. Far off are flat-topped hills and tall rocks, faint in the dust. At the
// left stands the Plantation: a great dome like a glass bowl turned over, with ribs, on a
// wide base that has legs and lights. Then the waste itself: brown rock and sand, cracked,
// with a few standing stones.
'use strict';
const { studio, open, W, H, HORIZON, DOME, CORE, skyColor, dust, nA, nB, nC, hash } = require('./scene');
const { mix, shift, clamp, smooth, through, solid } = studio;

const p = open('land');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.2, dry: 0.04, rag: 0.25, cap: 'round' };
const level = (x, y) => (nB(x / 300, y / 140) - 0.5) * 0.24 - 0.03;
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: level, color: (x, y) => shift(skyColor(x, Math.min(y, HORIZON)), r.range(-2, 2), r.range(-0.02, 0.02), r.range(-0.012, 0.012)), stroke: { ...line, mix: 0.3, opacity: 0.93 } });
// long clouds: grey under, pale on top
for (let k = 0; k < 22; k++) { const x = r.range(-200, W), y = r.range(30, 520), len = r.range(300, 800), w = r.range(14, 44); p.stroke({ brush: 'soft', color: mix('#8c949c', '#a4a8a8', r()), width: w, opacity: r.range(0.12, 0.26), points: [[x, y], [x + len / 2, y + r.range(-8, 8)], [x + len, y + r.range(-6, 6)]] }); p.stroke({ brush: 'soft', color: '#f4f0e4', width: Math.max(9, w * 0.5), opacity: r.range(0.1, 0.22), points: [[x + 20, y - w * 0.5], [x + len / 2, y - w * 0.5 + r.range(-6, 6)], [x + len - 20, y - w * 0.5]] }); }

// ---------------------------------------------------------------- the waste
const ground = (x, y) => {
  const d = clamp((y - HORIZON) / (H - HORIZON), 0, 1);
  let c = mix(mix('#cfae7c', '#9c7448', smooth(0, 0.5, d)), '#4c3422', smooth(0.4, 1, d) * 0.8);
  c = mix(c, nC(x / (40 + 160 * d), y / (5 + 20 * d)) > 0.5 ? '#e0c494' : '#5c4028', Math.abs(nC(x / (40 + 160 * d), y / (5 + 20 * d)) - 0.5) * 0.5);
  c = mix(c, '#2c2018', Math.exp(-Math.pow((x - 1180) / 420, 2)) * smooth(HORIZON, HORIZON + 160, y) * smooth(H, HORIZON + 120, y) * 0.5);   // the shade of the klaxosaur on the land
  return mix(c, '#3ca8e0', Math.exp(-Math.pow(Math.hypot(x - CORE.x, (y - 700) * 1.6) / 240, 2)) * 0.16);                                // and a little of its blue light
};
p.fill({ bounds: [0, HORIZON - 2, W, 760], width: 6.5, length: 70, spacing: 0.5, angle: () => r.range(-0.03, 0.03), color: ground, stroke: { ...line, opacity: 0.95 } });
p.fill({ bounds: [0, 748, W, H], width: 12, length: 140, spacing: 0.5, angle: () => r.range(-0.03, 0.03), color: ground, stroke: { ...line, opacity: 0.95 } });
p.fill({ bounds: [0, HORIZON, W, H], width: 5.5, length: 50, spacing: 1.0, overlap: 0.7, angle: () => r.range(-0.04, 0.04), color: (x, y) => ground(x + r.range(-8, 8), y + r.range(-2, 2)), stroke: { ...line, opacity: 0.8 } });
// cracks in the dry ground: thin dark lines that wander and fork, flatter far off
for (let k = 0; k < 40; k++) {
  let x = r.range(-40, W), y = 700 + Math.pow(r(), 0.8) * 300, a = r.range(-0.4, 0.4) + (r() < 0.3 ? r.pick([-1, 1]) * 0.9 : 0);
  const kk = smooth(660, 1000, y), flat = 0.16 + 0.34 * kk, pts = [[x, y]];
  for (let i = 0; i < 4; i++) { const len = r.range(26, 60) * (0.5 + kk); a += r.range(-0.7, 0.7); x += Math.cos(a) * len; y += Math.sin(a) * len * flat; pts.push([x, y]); }
  p.tryStroke({ ...line, color: '#3c2818', width: 4.8, opacity: 0.2 + 0.25 * kk, rag: 0.3, taper: [0.3, 0.5], points: pts });
}

// Far hills with flat tops, and tall rocks, in the dust.
for (const [pts, d] of [[[[-20, 610], [140, 600], [300, 612], [520, 596], [700, 606], [900, 590], [1120, 602], [1340, 588], [1620, 600]], 0.86], [[[-20, 634], [220, 624], [480, 632], [760, 620], [1000, 630], [1280, 618], [1620, 628]], 0.7]]) {
  const top = through(pts);
  p.fill({ inside: (x, y) => y > top(x) + 3 * (nB(x / 40, d * 7) - 0.5) && y < HORIZON + 12, bounds: [0, 576, W, HORIZON + 12], width: 6, length: 60, spacing: 0.5, angle: () => r.range(-0.04, 0.04), color: (x, y) => dust(mix('#7c5c40', '#9c7850', nA(x / 80, y / 20)), x, y, d), stroke: { ...line, opacity: 0.94 } });
}
for (const [x, h, w, d] of [[560, 150, 44, 0.74], [470, 96, 30, 0.8], [1420, 190, 60, 0.66], [1510, 120, 40, 0.72], [820, 80, 26, 0.82]]) solid(p, [[x, HORIZON + 6, w * 0.6], [x + w * 0.1, HORIZON - h * 0.5, w * 0.42], [x - w * 0.06, HORIZON - h, w * 0.24]], { shadow: dust('#4c3828', x, 560, d), half: dust('#7c5c40', x, 560, d), lit: dust('#c8a070', x, 560, d), bounce: dust('#5c4838', x, 560, d) }, { light: [-0.8, -0.5], turn: 0.1, width: 5.5, length: 26, vary: 0.08, flow: () => Math.PI / 2, edge: false });

// ---------------------------------------------------------------- the Plantation
{
  const D = DOME, far = 0.5, c = (col, y) => dust(col, D.x, y, far);
  // its base: a wide low drum with a rim of lights, on thick legs
  for (const [dx, w] of [[-170, 30], [-70, 34], [40, 34], [150, 30]]) p.stroke({ ...line, cap: 'flat', color: c('#4c4640', 660), width: w, points: [[D.x + dx, D.y + 26], [D.x + dx, D.y + 26 + Math.max(64, w * 2.1)]] });
  p.fill({ inside: (x, y) => Math.abs(x - D.x) < D.rx + 34 - (y - D.y) * 0.3 && y > D.y - 6 && y < D.y + 46, bounds: [D.x - D.rx - 40, D.y - 6, D.x + D.rx + 40, D.y + 46], width: 7, length: 70, spacing: 0.5, angle: () => 0, color: (x, y) => c(mix(mix('#8c8478', '#b8b0a0', clamp((D.x + 100 - x) / 300, 0, 1)), '#4c4640', smooth(D.y + 10, D.y + 46, y) * 0.6), y), stroke: { ...line, cap: 'flat', opacity: 0.96 } });
  for (let x = D.x - D.rx - 20; x < D.x + D.rx + 20; x += 26) p.tryStroke({ brush: 'round', color: '#ffc468', width: 4, opacity: 0.8, points: [[x, D.y + 18], [x + 12.6, D.y + 18]] });   // the lights along its rim
  // the dome: glass, pale and a little gold; lighter at the left, where the sun is; a city shows faintly through it
  const inDome = (x, y) => y < D.y && Math.pow((x - D.x) / D.rx, 2) + Math.pow((y - D.y) / D.ry, 2) < 1;
  p.fill({ inside: inDome, bounds: [D.x - D.rx, D.y - D.ry, D.x + D.rx, D.y], width: 8, length: 60, spacing: 0.5, angle: (x, y) => Math.atan2((y - D.y) / (D.ry * D.ry), (x - D.x) / (D.rx * D.rx)) + Math.PI / 2, color: (x, y) => { const u = (x - D.x) / D.rx, v = (D.y - y) / D.ry; let col = mix('#c8c4a8', '#eee8d0', clamp(0.5 - u * 0.6 + v * 0.3, 0, 1)); col = mix(col, '#8c8c84', smooth(0.5, 1, u) * 0.5); if (v < 0.5 && hash(Math.floor(x / 11), 3) < 0.5 && v < 0.12 + 0.36 * hash(Math.floor(x / 11), 7) * (1 - u * u)) col = mix(col, '#7c7c78', 0.5); return c(col, y); }, stroke: { ...line, mix: 0.15, opacity: 0.96 } });   // the dark touches low in it are the towers of the city
  for (const k of [-0.8, -0.5, -0.2, 0.2, 0.5, 0.8]) { const pts = []; for (let t = 0; t <= 1.001; t += 0.125) { const a = Math.PI * t; pts.push([D.x + Math.cos(a) * D.rx * k / Math.max(0.2, 1) * (1), D.y - Math.sin(a) * D.ry]); } const rib = []; for (let i = 0; i <= 8; i++) { const v = i / 8; rib.push([D.x + k * D.rx * Math.sqrt(Math.max(0, 1 - v * v)), D.y - v * D.ry]); } p.tryStroke({ brush: 'round', color: c('#9c9480', 560), width: 4, opacity: 0.6, points: rib }); }   // its ribs
  for (const v of [0.34, 0.66]) { const pts = []; for (let i = 0; i <= 12; i++) { const u = -1 + 2 * i / 12; pts.push([D.x + u * D.rx * Math.sqrt(1 - v * v), D.y - v * D.ry - 6 * (1 - u * u)]); } p.tryStroke({ brush: 'round', color: c('#9c9480', 560), width: 4, opacity: 0.5, points: pts }); }
  { const pts = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * (0.56 + 0.4 * i / 12); pts.push([D.x + Math.cos(a) * (D.rx - 5), D.y - Math.sin(a) * (D.ry - 4)]); } p.tryStroke({ brush: 'round', color: '#fffdf4', width: 5, opacity: 0.8, points: pts }); }   // the sun on its left side
  p.stroke({ ...line, cap: 'flat', color: c('#6c665c', 480), width: 7, points: [[D.x, D.y - D.ry + 4], [D.x, D.y - D.ry - 40]] });                                         // the mast on its top
}

p.save();
