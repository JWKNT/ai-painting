// The cavern. Its far wall is rock in great upright folds, which the lights only just
// reach. Teeth of rock hang from its roof, and thick pillars stand at each side, near us
// and black. Veins of Phazon run in the rock: thin lines of blue light, each with small
// branches. The floor is broken rock: a ledge at the left and lower ground beyond it,
// where the pit of Phazon lies. The Phazon is a blue so bright that it is white in the
// middle, and lines like lightning go out from it over the rock.
'use strict';
const { studio, open, W, H, PHAZON, fungal, phazon, floorY, mine, nA, nB, nC, hash } = require('./scene');
const { mix, clamp, smooth, glow, through } = studio;

const p = open('cavern');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.2, dry: 0.04, rag: 0.3, cap: 'round' };

// ---------------------------------------------------------------- the far wall
const fold = (x, y) => nB(x / 70 + 0.3 * Math.sin(y / 160), y / 500);
p.fill({ bounds: [0, 0, W, H], width: 30, length: 220, spacing: 0.5, overlap: 0.55, angle: (x, y) => Math.PI / 2 + (nA(x / 300, y / 300) - 0.5) * 0.5, color: (x, y) => { const f = fold(x, y); return mix(mine(x, y), f > 0.5 ? mix('#1a2a52', '#1e6a7c', fungal(x, y)) : '#02030a', Math.abs(f - 0.5) * 0.9); }, stroke: { ...line, opacity: 0.94 } });
p.fill({ bounds: [0, 0, W, H], width: 13, length: 130, spacing: 1.0, overlap: 0.7, angle: (x, y) => Math.PI / 2 + (nA(x / 300, y / 300) - 0.5) * 0.5, color: (x, y) => { const f = fold(x + r.range(-10, 10), y); return mix(mine(x, y), f > 0.5 ? mix('#22386a', '#2a8a98', fungal(x, y)) : '#02030a', Math.abs(f - 0.5) * 0.8); }, stroke: { ...line, opacity: 0.7 } });
// the mist of the cavern holds the light of the mushrooms and of the Phazon
for (let k = 0; k < 30; k++) { const x = r.range(-100, W - 200), len = r.range(300, 760), y = r.range(430, 800), g = fungal(x + len / 2, y), z = phazon(x + len / 2, y, 420); p.stroke({ brush: 'soft', color: mix(mix('#101a3c', '#2c98a8', g), '#3c5cf0', z * 0.6), width: r.range(40, 90), opacity: r.range(0.05, 0.12), points: [[x, y], [x + len / 2, y + r.range(-12, 12)], [x + len, y]] }); }

// ---------------------------------------------------------------- veins of Phazon in the far wall
function vein(x, y, a, len, w, op) {
  let done = 0;
  while (done < len) {
    const l = r.range(22, 46), a1 = a + r.range(-0.7, 0.7), x1 = x + Math.cos(a1) * l, y1 = y + Math.sin(a1) * l, t = done / len;
    p.tryStroke({ brush: 'soft', color: '#2c50f0', width: 9, opacity: 0.2 * op * (1 - t), points: [[x, y], [x1, y1]] });
    p.tryStroke({ brush: 'round', color: mix('#4c7cff', '#d8ecff', r() * (1 - t)), width: t < 0.4 ? w : 4, opacity: op * (1 - t * 0.7), points: [[x, y], [x1, y1]] });
    if (r() < 0.3 && len - done > 60) vein(x1, y1, a1 + (r() < 0.5 ? 1 : -1) * r.range(0.6, 1.1), (len - done) * 0.5, 4, op * 0.7);
    x = x1; y = y1; done += l;
  }
}
for (const [x, y, a, len] of [[1010, 760, -1.3, 220], [1150, 780, -1.0, 200], [900, 800, -1.9, 180]]) vein(x, y, a, len, 4.6, 0.6);

// ---------------------------------------------------------------- the teeth of rock that hang from the roof, and the roof itself
p.fill({ inside: (x, y) => y < 40 + 50 * nA(x / 200, 3) + 90 * Math.pow(Math.max(0, nB(x / 46, 9) - 0.42), 1.2) * 3, bounds: [0, 0, W, 320], width: 12, length: 70, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2 + r.range(-0.08, 0.08), color: (x, y) => mix(mix('#03040b', '#0a0e22', nC(x / 20, y / 60)), '#12485c', fungal(x, y + 80) * 0.3), stroke: { ...line, mix: 0.06, opacity: 0.97 } });
for (const [x, y0, l, w] of [[430, 20, 170, 34], [486, 10, 110, 24], [820, 0, 96, 26], [1010, 10, 150, 30], [1190, 0, 90, 22], [262, 10, 120, 28], [660, 0, 130, 26], [1470, 0, 200, 40], [1540, 10, 130, 28]]) { p.tryStroke({ ...line, mix: 0.04, color: mix('#03040b', '#0a0f24', r()), width: w, taper: [0, 0.9], points: [[x, y0 - 10], [x + r.range(-4, 4), y0 + l * 0.5], [x + r.range(-6, 6), y0 + l]] }); p.tryStroke({ brush: 'round', color: mix('#1e6a7c', '#3fb4c4', fungal(x, y0 + l)), width: 4, opacity: 0.2 + 0.4 * fungal(x, y0 + l), taper: [0.2, 0.7], points: [[x + w * 0.3, y0 + 10], [x + w * 0.16, y0 + l * 0.6]] }); }

// ---------------------------------------------------------------- the floor
const ground = (x, y) => {
  const d = clamp((y - floorY(x)) / 160, 0, 1), bed = nA(x / 90, y / 14), g = fungal(x, y - 40), z = phazon(x, y, 330);
  let c = mix('#0a0d1e', '#1a2038', bed);
  c = mix(c, '#1c7c8c', g * 0.5 * (1 - d * 0.6));                                                 // the light of the mushrooms on it
  c = mix(c, '#2c54f4', z * 0.7);                                                                 // the light of the Phazon
  c = mix(c, '#a8c8ff', Math.pow(z, 3) * 0.5);
  return mix(c, '#020308', smooth(0.3, 1, d) * 0.55 * (1 - z));
};
p.fill({ inside: (x, y) => y > floorY(x) + 6 * (nC(x / 24, 5) - 0.5), bounds: [0, 800, W, H + 4], width: 12, length: 110, spacing: 0.5, overlap: 0.6, angle: (x) => (x < 520 ? 0.02 : 0.03) + r.range(-0.05, 0.05), color: ground, stroke: { ...line, opacity: 0.97 } });
p.fill({ inside: (x, y) => y > floorY(x) + 8, bounds: [0, 800, W, H + 4], width: 6, length: 50, spacing: 1.1, overlap: 0.7, angle: () => r.range(-0.08, 0.08), color: (x, y) => ground(x + r.range(-8, 8), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.8 } });
// the face of the ledge, where it drops to the lower ground: dark, with a blue light on it from the pit
p.fill({ inside: (x, y) => x > 380 && x < 600 && y > floorY(x) + 4 && y < floorY(x) + 70 + (x - 380) * 0.1, bounds: [380, 820, 600, H], width: 9, length: 40, spacing: 0.5, angle: () => 1.3 + r.range(-0.2, 0.2), color: (x, y) => mix(mix('#04050c', '#10142c', nC(x / 12, y / 30)), '#2c54f4', phazon(x, y, 520) * 0.5), stroke: { ...line, opacity: 0.95 } });
{ const pts = []; for (let x = 0; x <= 520; x += 12) pts.push([x, floorY(x) + 2]); studio.glint(p, pts, () => mix('#1e7c8c', '#58d8e8', r()), { width: 4.4, dash: 50, gap: 30, opacity: 0.5, rng: r }); }   // the light of the mushrooms along the edge of the ledge
// rocks on the floor
for (const [x, s] of [[640, 30], [770, 22], [1260, 38], [1420, 26], [870, 18], [1500, 44], [560, 20]]) { const y = floorY(x) + 14; p.tryStroke({ brush: 'soft', color: '#020308', width: Math.max(12, s * 0.7), opacity: 0.5, points: [[x - s, y + s * 0.4], [x, y + s * 0.5], [x + s, y + s * 0.4]] }); studio.solid(p, [[x - s * 0.5, y, s * 0.5], [x + s * 0.5, y + 3, s * 0.42]], { shadow: '#03040a', half: '#0e1226', lit: mix('#1c4cb0', '#2a8a98', x < 800 ? 0.8 : 0.2), bounce: '#081030' }, { light: { at: [x < 800 ? 566 : PHAZON.x, x < 800 ? 460 : PHAZON.y] }, turn: 0.3, width: 6, length: Math.max(14, s * 0.5), vary: 0.1, flow: () => 0.1, edge: false }); }

// ---------------------------------------------------------------- the pit of Phazon
{ const { x, y } = PHAZON;
  for (const [w, op, n] of [[420, 0.07, 5], [260, 0.12, 6], [150, 0.2, 6]]) glow(p, x, y - 10, w, mix('#2c44f0', '#a8c4ff', 1 - w / 440), op, n, 0.4);
  p.fill({ inside: (px, py) => Math.pow((px - x) / 190, 2) + Math.pow((py - y) / 34, 2) < 1 + 0.3 * (nC(px / 30, 2) - 0.5), bounds: [x - 220, y - 46, x + 220, y + 46], width: 7, length: 60, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.03, 0.03), color: (px, py) => { const k = Math.hypot((px - x) / 190, (py - y) / 34); return mix(mix('#e8f4ff', '#5c8cff', smooth(0.1, 0.8, k)), '#2038d8', smooth(0.7, 1.1, k)); }, stroke: { ...line, mix: 0.1, opacity: 0.96 } });
  // lines like lightning go out from it over the rock, and a few stand up into the air
  for (let k = 0; k < 16; k++) vein(x + r.range(-150, 150), y + r.range(-20, 20), r.range(0, Math.PI * 2), r.range(70, 170), 4.4, 0.85);
  for (let k = 0; k < 5; k++) vein(x + r.range(-120, 120), y - 20, -Math.PI / 2 + r.range(-0.5, 0.5), r.range(90, 190), 4.4, 0.7);
  for (let k = 0; k < 40; k++) { const px = x + r.gauss() * 110, py = y + r.range(-24, 20), l = r.range(14, 50); p.tryStroke({ brush: 'round', color: mix('#a8c8ff', '#ffffff', r()), width: 4, opacity: r.range(0.4, 0.9), taper: [0.5, 0.5], points: [[px - l / 2, py], [px + l / 2, py + r.range(-1, 1)]] }); }
}
void H; void hash; void through; void clamp;

p.save();
