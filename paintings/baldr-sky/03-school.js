// The academy, and the square in front of it. The school is a long building of three
// storeys with a clock tower in its middle; snow lies on its roofs, and its windows are
// lit, as on any evening. The lance is behind it, so its front is in blue shade and its
// right edges are white. The square is deep in snow: blue in the shade, white where the
// light of the lance comes over it, with long blue shades from each thing that stands.
// Lamps on posts burn along it.
'use strict';
const { studio, open, W, H, GROUND, TOWER, lance, nA, nB, nC, hash } = require('./scene');
const { mix, clamp, smooth, glow } = studio;

const p = open('school');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.02, rag: 0.08, cap: 'flat' };
const ROOF = 438;
const wall = (x, y) => mix(mix('#1c2644', '#28345a', nA(x / 90, y / 40)), '#5c78b0', lance(x, y, 520) * 0.3);

// ---------------------------------------------------------------- the long building
p.fill({ inside: (x, y) => x > 60 && x < 1120 && y > ROOF && y < GROUND + 6, bounds: [60, ROOF, 1120, GROUND + 6], width: 9, length: 90, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.01, 0.01), color: wall, stroke: { ...line, opacity: 0.97 } });
// its roof: a low slope with snow on it
p.fill({ inside: (x, y) => x > 44 && x < 1130 && y > ROOF - 34 && y < ROOF + 2, bounds: [44, ROOF - 34, 1130, ROOF + 2], width: 7, length: 70, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.01, 0.01), color: (x, y) => mix(mix('#6c7ca8', '#9cacd0', nB(x / 60, y / 8)), '#e4eeff', smooth(ROOF - 20, ROOF - 34, y) * 0.5 + lance(x, y, 420) * 0.4), stroke: { ...line, cap: 'round', rag: 0.3, opacity: 0.97 } });
p.tryStroke({ ...line, color: '#0c1228', width: 6, points: [[44, ROOF + 3], [600, ROOF + 3], [1130, ROOF + 3]] });                          // the shade under the edge of the roof
// its windows: three rows; most are lit
for (let row = 0; row < 3; row++) for (let x = 84; x < 1100; x += 34) {
  if (Math.abs(x - TOWER.x) < 70) continue;
  const y = ROOF + 34 + row * 70, lit = hash(Math.floor(x / 34), row) < 0.62;
  if (lit) glow(p, x + 8, y + 16, 14, '#ffb050', 0.1, 6);
  p.tryStroke({ ...line, color: lit ? mix('#ffc468', '#ffe8b0', hash(x, row)) : '#0a1024', width: 15, opacity: 0.96, points: [[x + 8, y], [x + 8, y + 32]] });
  p.tryStroke({ brush: 'round', color: '#18223e', width: 4, opacity: 0.8, points: [[x + 8, y + 2], [x + 8, y + 30]] });                 // the bar down the middle of the window
  p.tryStroke({ ...line, cap: 'round', rag: 0.3, color: '#b8c8e8', width: 5, opacity: 0.85, points: [[x - 1, y + 34], [x + 17, y + 34]] });   // snow on its sill
}
// the door, under the tower, with a light over it
p.tryStroke({ ...line, color: '#0a1024', width: 44, points: [[TOWER.x, GROUND + 2], [TOWER.x, GROUND - 90]] });
for (const [w, op] of [[60, 0.14], [30, 0.3]]) glow(p, TOWER.x, GROUND - 100, w, '#ffd088', op, 6);

// ---------------------------------------------------------------- the clock tower
{ const x = TOWER.x, top = TOWER.top, w = 116;
  p.fill({ inside: (px, py) => Math.abs(px - x) < w / 2 && py > top + 60 && py < ROOF + 4, bounds: [x - w / 2, top + 60, x + w / 2, ROOF + 4], width: 8, length: 60, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2, color: (px, py) => mix(wall(px, py), '#0c1228', clamp((x - px) / w + 0.3, 0, 0.5)), stroke: { ...line, opacity: 0.97 } });
  // its pointed roof, with snow on the right slope, where the wind put it
  for (const s of [-1, 1]) p.fill({ inside: (px, py) => py < top + 62 && py > top && s * (px - x) > 0 && s * (px - x) < (py - top) * (w / 2 + 10) / 62, bounds: [x - w, top, x + w, top + 62], width: 6, length: 30, spacing: 0.5, angle: () => s * 0.8, color: () => (s > 0 ? mix('#c8d8f4', '#ffffff', r()) : mix('#39466e', '#4c5c88', r())), stroke: { ...line, cap: 'round', opacity: 0.97 } });
  p.tryStroke({ ...line, cap: 'round', color: '#0c1228', width: 5.5, taper: [0, 0.6], points: [[x, top + 4], [x, top - 34]] });
  // the clock: a round pale face with a light behind it, and two hands
  const cy = top + 118, R = 34;
  for (const [k, op] of [[2.2, 0.1], [1.4, 0.18]]) glow(p, x, cy, R * k, '#ffe0a0', op, 6);
  studio.disc(p, x, cy, R, '#f4e6c0', 9, { ...line, cap: 'round', mix: 0 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; p.tryStroke({ brush: 'round', color: '#6c5c44', width: 4.4, opacity: 0.8, points: studio.arc(x, cy, R, a, a + 0.4, 4) }); }
  p.tryStroke({ ...line, cap: 'round', color: '#18142c', width: 5, points: [[x, cy], [x + 4, cy - 26]] }); p.tryStroke({ ...line, cap: 'round', color: '#18142c', width: 5, points: [[x, cy], [x - 15, cy + 9]] });
  for (let row = 0; row < 2; row++) { const y = top + 180 + row * 60; p.tryStroke({ ...line, color: hash(row, 9) < 0.5 ? '#ffd088' : '#0a1024', width: 18, points: [[x, y], [x, y + 36]] }); }
  p.tryStroke({ brush: 'round', color: '#e8f0ff', width: 4.6, opacity: 0.9, points: [[x + w / 2 - 1, top + 64], [x + w / 2 - 1, ROOF - 36]] }); }   // the light of the lance down its right edge

// ---------------------------------------------------------------- the square
const snow = (x, y) => {
  const t = clamp((y - GROUND) / (H - GROUND), 0, 1), drift = nA(x / 280, y / 60), k = lance(x, y, 520);
  let c = mix('#5c709c', '#34405e', smooth(0.1, 1, t));                                            // snow in the shade of the night
  c = mix(c, drift > 0.5 ? '#8ca0c8' : '#222c48', Math.abs(drift - 0.5) * 0.6);                     // low drifts
  c = mix(c, '#dce8fc', k * smooth(0.7, 0, t) * 0.75);                                             // the light of the lance over the far part of it
  return mix(c, '#161c30', smooth(0.6, 1, t) * 0.4);
};
p.fill({ bounds: [0, GROUND - 2, W, 800], width: 9, length: 110, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.02, 0.02), color: snow, stroke: { ...line, cap: 'round', rag: 0.2, opacity: 0.97 } });
p.fill({ bounds: [0, 792, W, H + 4], width: 13, length: 160, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.02, 0.02), color: snow, stroke: { ...line, cap: 'round', rag: 0.2, opacity: 0.97 } });
p.fill({ bounds: [0, GROUND, W, H], width: 6, length: 60, spacing: 1.1, overlap: 0.7, angle: () => r.range(-0.03, 0.03), color: (x, y) => snow(x + r.range(-10, 10), y + r.range(-3, 3)), stroke: { ...line, cap: 'round', rag: 0.2, opacity: 0.8 } });
// a path that people have trodden, from the door of the school toward us: a darker, bluer band
for (const [t0, t1, w] of [[0, 0.42, 30], [0.3, 0.78, 50], [0.6, 1.14, 70]]) { const at = (t) => [TOWER.x - 60 * t * t + 40 * Math.sin(t * 3), GROUND + 10 + (H - GROUND) * t]; p.stroke({ brush: 'soft', color: '#2c3858', width: w, opacity: 0.3, points: [at(t0), at((t0 + t1) / 2), at(t1)] }); }
// the lamps of the square: an iron post, a round lamp, its warm light on the snow, and its long shade away from the lance
for (const [x, y, s] of [[150, 716, 0.8], [560, 760, 1.0], [70, 880, 1.3]]) {
  const h = 190 * s;
  p.stroke({ brush: 'soft', color: '#1c2440', width: 12 * s + 6, opacity: 0.4, taper: [0, 0.6], points: [[x, y], [x - 80 * s, y + 20 * s], [x - 170 * s, y + 44 * s]] });
  p.stroke({ brush: 'soft', color: '#e8a050', width: 60 * s, opacity: 0.2, points: [[x - 70 * s, y + 8], [x, y + 12], [x + 70 * s, y + 8]] });
  p.tryStroke({ ...line, mix: 0, color: '#070a16', width: Math.max(5, 7 * s), points: [[x, y + 4], [x, y - h]] });
  for (const [w, op] of [[90 * s, 0.1], [50 * s, 0.2]]) glow(p, x, y - h - 8 * s, w, '#ffb85c', op, 6);
  studio.disc(p, x, y - h - 8 * s, Math.max(8, 13 * s), '#ffe8b8', 6.2, { ...line, cap: 'round', mix: 0 });
  p.tryStroke({ ...line, cap: 'round', rag: 0.3, color: '#e4ecfc', width: 5, points: [[x - 8 * s - 2, y - h - 22 * s], [x + 8 * s + 2, y - h - 22 * s]] });   // snow on the top of the lamp
}
void nC; void W;

p.save();
