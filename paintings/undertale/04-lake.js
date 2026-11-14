// The lake and the ledge. The lake is black. It holds the castle and the crystals again,
// faintly, in short upright touches that the level lines of the water break. Near the
// ledge the water shines from below, blue-green, as much of the water of Waterfall does.
// The ledge is a shelf of blue-violet rock that goes across the picture. It is wet: the
// rain stands on it in pools, and the light of the water lies along its edge.
'use strict';
const { studio, open, W, H, cam, EDGE, SHORE, CASTLE, edgeY, castleGlow, GLOW, GLOW_DEEP, nA, nB, nC, nD } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('lake');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.16, dry: 0.03, rag: 0.2, cap: 'round' };
const cx = CASTLE.x;

// ---------------------------------------------------------------- the lake
// How near the ledge a place of the water is: 0 far off, 1 at the ledge.
const near = (x, y) => clamp((y - SHORE) / (edgeY(x) - SHORE), 0, 1);
const water = (x, y) => {
  const k = near(x, y);
  let c = mix('#070a1c', '#04050c', smooth(0, 0.5, k));
  c = mix(c, '#22346c', castleGlow(x, SHORE - 60 + (y - SHORE) * 0.5, 300) * smooth(0.7, 0, k) * 0.55);   // the pale of the castle on the far water
  c = mix(c, GLOW_DEEP, smooth(0.5, 1, k) * (0.5 + 0.3 * nA(x / 200, y / 30)));                          // the light of the near water
  return mix(c, GLOW, smooth(0.86, 1, k) * 0.34 * nB(x / 60, y / 8));
};
p.fill({ inside: (x, y) => y < edgeY(x) + 2, bounds: [0, SHORE - 4, W, 800], width: 9, length: 110, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.012, 0.012), color: water, stroke: { ...line, opacity: 0.96 } });
p.fill({ inside: (x, y) => y < edgeY(x) + 2, bounds: [0, SHORE - 4, W, 800], width: 5.5, length: 60, spacing: 1.1, overlap: 0.7, angle: () => r.range(-0.012, 0.012), color: (x, y) => water(x + r.range(-12, 12), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.75 } });
// The castle again, under itself: upright touches, pale, fainter as they go down; then level lines of dark water across them.
for (let k = 0; k < 60; k++) { const x = cx + r.gauss() * 96, d = Math.pow(r(), 1.3) * 120, l = r.range(14, 40); p.tryStroke({ brush: 'soft', color: mix('#4c64a0', '#a8bce0', r() * (1 - d / 150)), width: 9, opacity: (0.22 - d * 0.0014) * r.range(0.5, 1), points: [[x, SHORE + 2 + d], [x + r.range(-1.5, 1.5), SHORE + 2 + d + Math.max(18.5, l)]] }); }
for (let k = 0; k < 10; k++) { const x = cx + r.gauss() * 80, d = r.range(0, 50); p.tryStroke({ brush: 'round', color: '#ffe6a8', width: 4, opacity: 0.3 * (1 - d / 70), points: [[x, SHORE + 6 + d], [x, SHORE + 6 + d + 13]] }); }   // and its lamps
for (let k = 0; k < 46; k++) { const y = SHORE + 6 + Math.pow(r(), 1.2) * 150, x = cx + r.range(-260, 260), len = r.range(40, 160); p.tryStroke({ brush: 'round', color: '#05070f', width: 4, opacity: r.range(0.3, 0.6), taper: [0.4, 0.4], points: [[x, y], [x + len, y + r.range(-1, 1)]] }); }
// The crystals again, in the far water: a few faint level touches.
for (let k = 0; k < 70; k++) { const x = r.range(0, W), y = SHORE + 8 + Math.pow(r(), 1.6) * 130; if (Math.abs(x - cx) < 150 && y < SHORE + 90) continue; const b = Math.pow(r(), 2.4); p.tryStroke({ brush: 'round', color: mix('#2c50a0', '#9cc8f4', b), width: 4, opacity: 0.12 + 0.4 * b, taper: [0.5, 0.5], points: [[x - r.range(6.2, 12), y], [x + r.range(6.2, 12), y]] }); }
// Low rocks stand in the far water: each is a dark hump, with a thin pale line along its top on the side that is toward the castle.
for (const [x, y, w, h] of [[640, 598, 76, 15], [886, 628, 120, 22], [292, 616, 96, 18], [1330, 606, 84, 15], [1486, 646, 130, 24], [470, 660, 150, 26], [1150, 664, 100, 18]]) {
  for (let k = 0; k < 3; k++) { const ww = w * (1 - k * 0.24), yy = y - h * k * 0.3; p.tryStroke({ ...line, rag: 0.4, color: mix('#05060f', '#0b0f26', r()), width: Math.max(6, h * 0.6), taper: [0.5, 0.5], points: [[x - ww / 2, yy], [x + r.range(-6, 6), yy - h * 0.24], [x + ww / 2, yy]] }); }
  const s = x < cx ? 1 : -1; p.tryStroke({ brush: 'round', color: mix('#22306c', '#5c78b8', castleGlow(x, y, 420)), width: 4, opacity: 0.6, taper: [0.5, 0.5], points: [[x + s * w * 0.02, y - h * 0.86], [x + s * w * 0.2, y - h * 0.8], [x + s * w * 0.36, y - h * 0.5]] });
  p.tryStroke({ brush: 'soft', color: '#03040a', width: Math.max(9, h * 0.6), opacity: 0.4, points: [[x - w * 0.45, y + h * 0.5], [x, y + h * 0.6], [x + w * 0.45, y + h * 0.5]] });
}
// Near the ledge: bright threads of the blue-green light, which lie level and move with the water.
for (let k = 0; k < 150; k++) { const x = r.range(-20, W), t = Math.pow(r(), 2.2), y = edgeY(x) - 4 - t * 150, len = r.range(20, 110) * (1 - t * 0.5); p.tryStroke({ brush: 'round', color: mix(GLOW_DEEP, mix(GLOW, '#d8fff4', r() * 0.5), 1 - t * 0.7), width: r() < 0.3 ? 4.8 : 4, opacity: (0.6 - 0.45 * t) * r.range(0.4, 1), taper: [0.5, 0.5], points: [[x, y], [x + len / 2, y + r.range(-1.2, 1.2)], [x + len, y]] }); }
for (let k = 0; k < 16; k++) { const x = r.range(-100, W - 200), len = r.range(300, 700), w = r.range(22, 44); p.stroke({ brush: 'soft', color: GLOW, width: w, opacity: r.range(0.04, 0.09), points: [[x, edgeY(x + len / 2) - r.range(4, 60)], [x + len / 2, edgeY(x + len / 2) - r.range(4, 60)], [x + len, edgeY(x + len / 2) - r.range(4, 60)]] }); }   // and its glow in the air over it

// ---------------------------------------------------------------- the ledge
// A place of the ledge, in metres: to the right of the middle, and away from us.
const G = (x, y) => cam.groundAt(x, y);
// Pools of rain stand in the low places of it.
const pool = (x, y) => { const [X, Z] = G(x, y); return smooth(0.6, 0.68, nD(X / 1.9 + 4, Z / 1.1 + 2)) * smooth(EDGE - 0.2, EDGE - 0.7, Z); };
const rock = (x, y) => {
  const [X, Z] = G(x, y), bed = nA(X / 1.4 + 9, Z / 0.5), d = (y - edgeY(x)) / (H - edgeY(x));
  let c = mix('#151541', '#252563', bed);                                                        // blue-violet rock, in beds that lie level
  c = mix(c, '#0b0b28', smooth(0.3, 1, d) * 0.6);                                                // darker toward us
  c = mix(c, GLOW_DEEP, smooth(0.16, 0, d) * 0.7);                                               // the light of the water along its far edge
  c = mix(c, GLOW, smooth(0.06, 0, d) * 0.4);
  const q = pool(x, y); if (q > 0) c = mix(c, mix('#060818', '#0d1a3c', smooth(0.5, 0, d)), q * 0.9);   // a pool: darker, and it holds the dark overhead
  return mix(c, '#06060f', (nC(x / 9, y / 5) - 0.5) * 0.16);
};
const flat = () => r.range(-0.02, 0.02);
p.fill({ inside: (x, y) => y > edgeY(x), bounds: [0, 770, W, 880], width: 8, length: 90, spacing: 0.5, overlap: 0.6, angle: flat, color: rock, stroke: { ...line, opacity: 0.97 } });
p.fill({ inside: (x, y) => y > edgeY(x), bounds: [0, 870, W, H], width: 12, length: 140, spacing: 0.5, overlap: 0.6, angle: flat, color: rock, stroke: { ...line, opacity: 0.97 } });
p.fill({ inside: (x, y) => y > edgeY(x) + 2, bounds: [0, 770, W, H], width: 5.5, length: 50, spacing: 1.1, overlap: 0.7, angle: flat, color: (x, y) => rock(x + r.range(-8, 8), y + r.range(-2, 2)), stroke: { ...line, opacity: 0.8 } });
// Its far edge: a broken line of the blue-green light, where the wet rock turns down to the water.
{ const pts = []; for (let x = -10; x <= W + 10; x += 12) pts.push([x, edgeY(x) + 2]); studio.glint(p, pts, () => mix(GLOW, '#d8fff4', r() * 0.6), { width: 4.6, dash: 60, gap: 22, opacity: 0.8, rng: r }); }
// In each pool: the crystals overhead, as a few small cold lights, and a thin bright line along its far rim.
for (let k = 0; k < 260; k++) { const x = r.range(0, W), y = r.range(800, H - 6); if (y < edgeY(x) + 8 || pool(x, y) < 0.9) continue; const b = Math.pow(r(), 2.2); p.tryStroke({ brush: 'round', color: mix('#3460b0', '#bfe0fc', b), width: 4, opacity: 0.2 + 0.6 * b, taper: [0.5, 0.5], points: [[x - 6.2, y], [x + 6.2, y]] }); }
for (let k = 0; k < 400; k++) { const x = r.range(0, W), y = r.range(800, H - 6); if (y < edgeY(x) + 8) continue; if (pool(x, y) > 0.5 && pool(x, y - 7) < 0.3) { const len = r.range(20, 60); p.tryStroke({ brush: 'round', color: mix(GLOW_DEEP, GLOW, 0.5 + 0.5 * r()), width: 4, opacity: r.range(0.3, 0.6), taper: [0.4, 0.4], points: [[x - len / 2, y - 3], [x + len / 2, y - 3 + r.range(-1, 1)]] }); } }
// Lines between the beds of the rock, and small stones.
for (let k = 0; k < 40; k++) { const x = r.range(-20, W), y = r.range(810, H), len = r.range(60, 220) * (0.5 + (y - 780) / 300); p.tryStroke({ brush: 'round', color: '#07071c', width: 4, opacity: r.range(0.3, 0.55), taper: [0.3, 0.3], points: [[x, y], [x + len / 2, y + r.range(-2, 2)], [x + len, y + r.range(-3, 3)]] }); }

p.save();
