// The yard. It is a clear place in the wood, old and not kept: flat stones with moss
// between them, and tall plume grass at its edges, silver where the moon finds it. Two
// great cedars stand at its two sides, near us, each with a thick rope of straw round it
// and white papers that hang from the rope: they are holy trees. At each side stands an
// iron basket on three legs, in which wood burns.
'use strict';
const { studio, open, W, H, GROUND, FIRES, fire, moonAir, nA, nB, nC, hash } = require('./scene');
const { mix, clamp, smooth, glow } = studio;

const p = open('yard');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.14, dry: 0.03, rag: 0.2, cap: 'round' };

// ---------------------------------------------------------------- the ground
const VP = [800, GROUND - 60];
const floor = (x, y) => {
  const d = y - VP[1], row = Math.floor(Math.log(d) * 7), col = Math.floor(((x - VP[0]) / d) * 2.6 + (row % 2) * 0.5), t = clamp((y - GROUND) / (H - GROUND), 0, 1), k = fire(x, y, 250);
  let c = mix('#1a2030', '#2a3040', hash(row, col));                                              // the stones, grey-blue in the night
  c = mix(c, '#142418', smooth(0.5, 0.7, nA(x / 70, y / 26)) * 0.7);                              // moss
  c = mix(c, '#c8642c', k * 0.72);                                                                // the light of the fires
  c = mix(c, '#ffb060', Math.pow(k, 3) * 0.4);
  return mix(c, '#05070e', smooth(0.5, 1, t) * 0.5 * (1 - k));
};
p.fill({ bounds: [0, GROUND - 4, W, 880], width: 9, length: 100, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.02, 0.02), color: floor, stroke: { ...line, opacity: 0.97 } });
p.fill({ bounds: [0, 872, W, H + 4], width: 13, length: 150, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.02, 0.02), color: floor, stroke: { ...line, opacity: 0.97 } });
p.fill({ bounds: [0, GROUND, W, H], width: 6, length: 56, spacing: 1.1, overlap: 0.7, angle: () => r.range(-0.03, 0.03), color: (x, y) => floor(x + r.range(-10, 10), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.8 } });
// the lines between the stones
for (let i = 0; i < 9; i++) { const y = VP[1] + Math.exp((Math.log(GROUND - VP[1]) * 7 + i * 0.9 + 0.4) / 7); if (y > GROUND + 4 && y < H) p.tryStroke({ brush: 'round', color: '#05070c', width: 4, opacity: 0.5, points: [[-10, y], [W / 2, y + r.range(-1, 1)], [W + 10, y]] }); }
for (let k = -7; k <= 7; k++) { const x1 = VP[0] + k * 190 + 60; p.tryStroke({ brush: 'round', color: '#05070c', width: 4, opacity: 0.34, points: [[VP[0] + (x1 - VP[0]) * (GROUND - VP[1]) / (H - VP[1]), GROUND + 2], [x1, H + 4]] }); }

// ---------------------------------------------------------------- plume grass at the far edge of the yard and at its sides
// Each is a bunch of thin leaves that bend over, and tall stalks with a plume at the top, which is silver in the moon.
function plume(x, y, h) {
  for (let k = 0; k < 6; k++) { const lean = r.range(-0.7, 0.7), l = h * r.range(0.4, 0.8); p.tryStroke({ ...line, color: mix('#0a1420', '#1c3038', r()), width: r.range(4.8, 6), taper: [0, 0.85], points: [[x + r.range(-6, 6), y + 4], [x + lean * l * 0.4, y - l * 0.7], [x + lean * l, y - l * 0.86]] }); }
  for (let k = 0; k < 3; k++) { const lean = r.range(-0.3, 0.3), tip = [x + lean * h, y - h * r.range(0.85, 1.1)], f = fire(tip[0], tip[1], 300), m = moonAir(tip[0], tip[1], 700); p.tryStroke({ ...line, color: '#16242c', width: 4.8, points: [[x, y + 2], [x + lean * h * 0.4, y - h * 0.5], tip] }); p.tryStroke({ ...line, rag: 0.5, color: mix(mix('#5c6c8c', '#d4dcf0', m), '#f0a868', f * 0.8), width: r.range(6, 9), opacity: 0.9, taper: [0.2, 0.8], points: [tip, [tip[0] + lean * 14 + 6, tip[1] - h * 0.1], [tip[0] + lean * 30 + 16, tip[1] - h * 0.14 + 8]] }); }
}
for (let x = 10; x < W; x += r.range(34, 80)) if (Math.abs(x - 800) > 250) plume(x, GROUND + r.range(0, 22), r.range(80, 150));
for (let k = 0; k < 16; k++) { const side = k % 2 ? 1 : -1, x = side < 0 ? r.range(0, 150) : r.range(W - 150, W), y = r.range(840, 1000); plume(x, y, r.range(120, 220)); }

// ---------------------------------------------------------------- the two holy cedars, near us at the sides
for (const [x, w, side] of [[92, 150, 1], [1512, 160, -1]]) {
  p.fill({ inside: (px, py) => Math.abs(px - x) < w / 2 + (py - 500) * 0.03, bounds: [x - w, -10, x + w, 900], width: 14, length: 240, spacing: 0.5, angle: () => Math.PI / 2 + r.range(-0.02, 0.02), color: (px, py) => { const u = (px - x) / (w / 2), rib = nC(px / 8, py / 240); let c = mix('#04060c', '#0e1420', rib); c = mix(c, '#b85424', clamp(side * u * 0.9 - 0.2, 0, 0.6) * fire(px + side * 150, py, 420) * 1.2); return mix(c, '#3c5490', clamp(side * u - 0.7, 0, 0.3) * smooth(700, 200, py)); }, stroke: { ...line, mix: 0.05, opacity: 0.98 } });
  for (let k = 0; k < 6; k++) { const bx = x + r.range(-w * 0.3, w * 0.3), by = r.range(40, 700); p.tryStroke({ ...line, color: '#020308', width: r.range(6, 10), opacity: 0.7, taper: [0.3, 0.3], points: [[bx, by], [bx + r.range(-6, 6), by + r.range(120, 260)]] }); }
  // the rope of straw round it, thick, a little slack; and the white papers that hang from it, each folded in steps
  const ry = 470, ropeW = 26;
  p.tryStroke({ ...line, rag: 0.3, color: '#6c5830', width: ropeW, points: [[x - w / 2 - 12, ry - 6], [x, ry + 10], [x + w / 2 + 12, ry - 4]] });
  for (let k = 0; k < 9; k++) { const u = -0.5 + k / 8, px = x + u * (w + 20), py = ry + 10 - 14 * (u * u * 4 - 0.3); p.tryStroke({ brush: 'round', color: '#3a2e18', width: 4.4, opacity: 0.7, points: [[px - 5, py - ropeW * 0.4], [px + 5, py + ropeW * 0.4]] }); }
  p.tryStroke({ brush: 'round', color: mix('#d8a060', '#b8c4e8', side < 0 ? 0.2 : 0.4), width: 4.4, opacity: 0.6, points: [[x - w / 2 - 8, ry - 16], [x, ry - 1], [x + w / 2 + 8, ry - 14]] });
  for (const u of [-0.34, -0.1, 0.14, 0.38]) { let px = x + u * (w + 10), py = ry + 22; for (let i = 0; i < 3; i++) { const nx = px + (i % 2 ? -9 : 9); p.tryStroke({ ...line, cap: 'flat', rag: 0.03, color: mix('#c8ccd8', '#f4f4f8', r()), width: 11, points: [[px, py], [nx, py + 26]] }); px = nx; py += 24; } }
}

// ---------------------------------------------------------------- the two baskets of fire: an iron basket on three legs. The fire itself is painted later.
for (const [fx, fy] of FIRES) {
  p.stroke({ brush: 'soft', color: '#04050a', width: 34, opacity: 0.5, points: [[fx - 60, fy + 78], [fx, fy + 84], [fx + 60, fy + 78]] });
  for (const dx of [-34, 0, 34]) p.tryStroke({ ...line, mix: 0, color: '#06070c', width: 7, points: [[fx + dx * 0.3, fy + 6], [fx + dx, fy + 80]] });
  p.tryStroke({ ...line, cap: 'flat', mix: 0, color: '#08090e', width: 26, points: [[fx - 30, fy - 4], [fx + 30, fy - 4]] });
  for (const dx of [-26, -9, 9, 26]) p.tryStroke({ brush: 'round', color: '#e8742c', width: 4.4, opacity: 0.8, points: [[fx + dx, fy - 14], [fx + dx, fy + 6]] });
  for (const [w, op] of [[320, 0.05], [200, 0.08]]) glow(p, fx, fy - 30, w, '#ff8a3c', op, 5);
}
void nB;

p.save();
