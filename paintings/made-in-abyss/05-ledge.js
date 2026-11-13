// The terrace close to us: old paving and broken stone, dark against the bright hollow, with
// a fallen column, a piece of wall with half an arch, and the strange plants of the place,
// some of which give their own blue-green light.
'use strict';
const { studio, open, W, H, LIGHT, shaft, ledge, nA, nB } = require('./scene');
const { mix, clamp, smooth, solid, glint } = studio;

const p = open('ledge');
const r = p.rng;
const stroke = { brush: 'bristle', mix: 0.08, dry: 0.04, rag: 0.2, cap: 'flat', streak: 0.3, jitter: 0.5 };
const gold = () => mix('#c8b070', '#f6e2a0', r());

// The rock and paving of it.
const rock = (x, y) => { const depth = clamp((y - ledge(x)) / 140, 0, 1); return mix(mix('#0e262a', '#17363a', nA(x / 50, y / 18)), '#050f13', smooth(0.05, 1, depth) * 0.85); };
const lie = (x, y) => Math.atan2(ledge(x + 14) - ledge(x - 14), 28) * clamp(1 - (y - ledge(x)) / 160, 0.2, 1) + (nB(x / 80, y / 40) - 0.5) * 0.2;
p.fill({ inside: (x, y) => y > ledge(x) + 12, bounds: [-20, 790, W + 20, H + 10], width: 30, length: 150, spacing: 0.5, angle: lie, color: rock, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.1, dry: 0.05 } });
p.fill({ inside: (x, y) => y > ledge(x) + 6, bounds: [-20, 790, W + 20, H + 10], width: 14, length: 80, spacing: 0.7, overlap: 0.7, angle: lie, color: (x, y) => rock(x + r.range(-8, 8), y + r.range(-5, 5)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.1 } });
for (let x = -30; x < W + 10; x += 110) {                                // its edge, and the light along it
  const pts = [];
  for (let k = 0; k <= 6; k++) pts.push([x + k * 20, ledge(x + k * 20) + 6]);
  p.stroke({ brush: 'bristle', color: rock(x + 60, ledge(x + 60) + 8), width: 13, mix: 0.05, dry: 0, rag: 0.1, points: pts });
  glint(p, pts.map(([px, py]) => [px, py - 6]), gold, { width: 4.4, dash: 30, gap: 22, opacity: 0.25 + 0.6 * shaft(x + 60, 700), rng: r });
}
for (let k = 0; k < 40; k++) {                                           // the joints of the old paving
  const x = r.range(0, W), y = ledge(x) + r.range(16, 110), len = r.range(30, 90);
  p.tryStroke({ ...stroke, color: '#050f12', width: 4.6, opacity: 0.5, points: [[x, y], [x + len, y + lie(x, y) * len + r.range(-2, 2)]] });
}

// A piece of old wall at the left edge, with half of an arch still on it.
const stone = { shadow: '#07161a', half: '#143034', lit: '#3c5e58', rim: '#f0dc98', bounce: '#0e262c' };
const o = { light: LIGHT, turn: 0.45, width: 7, length: 40, vary: 0.06, dash: 30, gap: 14, edgeOpacity: 0.75 };
solid(p, [[60, 1010, 66], [60, 800, 62], [62, 640, 56]], stone, o);
for (const [x, top, w] of [[26, 560, 30], [62, 520, 34], [100, 596, 28]]) p.tryStroke({ ...stroke, rag: 0.35, color: mix('#07161a', '#143034', r()), width: w, points: [[x, 680], [x, top]] });   // its broken top
for (const y of [660, 740, 820, 900]) p.tryStroke({ ...stroke, color: '#050f12', width: 5, opacity: 0.6, points: [[4, y], [60, y + 3], [118, y]] });   // its courses
glint(p, [[124, 630], [126, 760], [124, 900]], gold, { width: 4.4, dash: 34, gap: 40, opacity: 0.35, rng: r });                                        // the light down its edge
for (let k = 0; k < 6; k++) {                                            // creepers hanging from it
  const x = r.range(10, 120), y = r.range(560, 700), len = r.range(60, 150);
  p.tryStroke({ brush: 'bristle', color: '#06181a', width: r.range(4.6, 6), opacity: 0.85, taper: [0, 0.8], mix: 0, dry: 0, rag: 0.2, points: [[x, y], [x + r.range(-8, 8), y + len * 0.5], [x + r.range(-12, 12), y + len]] });
}

// A fallen column: two drums lying where they rolled.
solid(p, [[560, 900, 30], [650, 912, 30]], stone, { ...o, length: 30 });
solid(p, [[694, 934, 26], [760, 946, 26]], stone, { ...o, length: 30 });
for (const [x, y, rad] of [[560, 900, 30], [694, 934, 26]]) p.tryStroke({ ...stroke, cap: 'round', color: '#050f12', width: 6, opacity: 0.6, points: [[x - 2, y - rad + 6], [x - 8, y], [x - 2, y + rad - 6]] });
// Blocks of the old city, lying about.
for (const [x, y, w, h] of [[900, 968, 110, 44], [1130, 980, 80, 36], [1380, 972, 130, 50], [820, 1000, 70, 30]]) {
  for (let k = 0; k < Math.round(h / 13); k++) p.tryStroke({ ...stroke, color: mix('#0a1e22', '#18363a', r()), width: 15, points: [[x - w / 2, y - h / 2 + 7 + k * 13], [x + w / 2, y - h / 2 + 7 + k * 13 + 3]] });
  glint(p, [[x - w / 2, y - h / 2 - 2], [x, y - h / 2 - 1], [x + w / 2, y - h / 2 + 1]], gold, { width: 4.4, dash: 28, gap: 16, opacity: 0.3 + 0.5 * shaft(x, 700), rng: r });
}

// The plants. Tall ones that curl over at the tip, dark against the water.
function frond(x, y, h, lean) {
  const pts = [];
  for (let k = 0; k <= 8; k++) { const t = k / 8, curl = t > 0.7 ? (t - 0.7) / 0.3 : 0; pts.push([x + lean * h * t + Math.sin(curl * 3.4) * h * 0.12 * Math.sign(lean || 1), y - h * t + (1 - Math.cos(curl * 3.4)) * h * 0.1]); }
  p.tryStroke({ brush: 'bristle', color: mix('#06181a', '#0e2a2a', r()), width: Math.max(5, h * 0.045), taper: [0, 0.75], mix: 0, dry: 0, rag: 0.1, cap: 'round', points: pts });
  for (let k = 2; k < 7; k++) {                                          // leaflets
    const [px, py] = pts[k], len = h * 0.16 * (1 - k / 9);
    for (const s of [-1, 1]) if (len > 12.4) p.tryStroke({ brush: 'bristle', color: '#081c1c', width: 5, taper: [0, 0.7], mix: 0, dry: 0, rag: 0.2, points: [[px, py], [px + s * len * 0.9, py - len * 0.3]] });
  }
}
for (const [x, y, h, lean] of [[1500, 1010, 250, -0.2], [1560, 1014, 320, -0.1], [1440, 1012, 170, -0.34], [1596, 1010, 200, -0.05], [1300, 1014, 120, 0.2]]) frond(x, y, h, lean);
// And small ones on thin stalks, each with a bulb that glows.
for (const [x, y, h] of [[640, 866, 70], [676, 878, 96], [716, 888, 60], [1056, 930, 80], [1090, 940, 54], [230, 826, 60], [196, 824, 84]]) {
  const tip = [x + r.range(-10, 10), y - h];
  p.tryStroke({ brush: 'bristle', color: '#0a2424', width: 4.6, mix: 0, dry: 0, rag: 0.1, points: [[x, y + 6], [(x + tip[0]) / 2 + r.range(-6, 6), y - h * 0.5], tip] });
  p.stroke({ brush: 'soft', color: '#58e8c8', width: 30, opacity: 0.25, points: [[tip[0] - 32, tip[1]], [tip[0] + 32, tip[1]]] });
  p.stroke({ brush: 'bristle', color: '#9cfbe0', width: 8, mix: 0, dry: 0, rag: 0, cap: 'round', points: [[tip[0], tip[1] + 9], [tip[0], tip[1] - 9]] });
  p.tryStroke({ color: '#f0fff8', width: 4, opacity: 0.9, points: [[tip[0] - 1.5, tip[1] + 6], [tip[0] - 1.5, tip[1] - 6.6]] });
}

p.save();
