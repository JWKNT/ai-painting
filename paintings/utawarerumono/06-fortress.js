// The fortress of Tuskur, on its low hill in the valley: a wall of upright logs, a gate with
// two watch towers, and inside it the great hall under its steep roof of thatch, with smaller
// halls and stores about it. The sun is on every roof and wall that faces right. Smoke goes
// up from the evening fires and drifts away from the sun.
'use strict';
const { studio, open, FORT, far, nB, nC } = require('./scene');
const { mix, clamp, wave, glint } = studio;

const p = open('fortress');
const r = p.rng;
const D = 0.3, X = FORT.x, Y = FORT.y;
const wood = { brush: 'bristle', mix: 0.12, dry: 0.03, rag: 0.15, cap: 'flat' };
const tint = (c, x, y) => far(c, x, y, D);

// The hill it stands on, and its long shadow.
p.stroke({ brush: 'soft', color: tint('#4a4a48', X - 180, Y + 60), width: 40, opacity: 0.36, points: [[X - 90, Y + 58], [X - 170, Y + 64], [X - 250, Y + 66]] });
p.fill({ inside: (x, y) => Math.pow((x - X) / 176, 2) + Math.pow((y - Y - 46) / 34, 2) < 1, bounds: [X - 180, Y + 10, X + 180, Y + 82], width: 9, length: 60, spacing: 0.5, angle: () => r.range(-0.04, 0.04),
  color: (x, y) => tint(mix(mix('#6a6a42', '#8a8648', nC(x / 40, y / 12)), '#c4ae5c', clamp((x - X) / 240 + 0.35, 0, 1) * 0.8), x, y), stroke: { brush: 'bristle', opacity: 0.95, mix: 0.2, rag: 0.25 } });

// A hall: low walls, and a roof of thatch that comes down from a short ridge to long eaves.
// The strokes of the roof run down it. The end of it that faces the sun is the brightest.
function hall(cx, ry, rw, ew, ey, wall) {
  const n = Math.max(4, Math.round(ew / 7));
  p.stroke({ ...wood, color: tint('#3c2e2c', cx, ey + wall / 2), width: wall, points: [[cx - ew * 0.43, ey + wall / 2], [cx + ew * 0.43, ey + wall / 2]] });                       // the walls, in the shade of the eaves
  for (let k = 0; k < Math.round(ew / 16); k++) { const x = cx - ew * 0.4 + ew * 0.8 * (k + 0.5) / Math.round(ew / 16); if (wall >= 12.4) p.tryStroke({ color: tint('#b48c5c', x, ey, 0), width: 4, opacity: 0.6, points: [[x, ey + 1], [x, ey + wall + 1]] }); }   // posts
  for (let k = 0; k < n; k++) {
    const f = (k + 0.5) / n, top = [cx - rw / 2 + rw * f, ry], foot = [cx - ew / 2 + ew * f, ey + 2];
    p.tryStroke({ ...wood, rag: 0.3, color: tint(mix(mix('#6e5644', '#b08e5c', f), '#d8b874', Math.pow(f, 2) * 0.8 + (nB(top[0] / 9, ry) - 0.5) * 0.3), top[0], ry), width: Math.max(4.8, ew / n * 1.7), points: [top, [(top[0] + foot[0]) / 2, (ry + ey) / 2 + 1], foot] });
  }
  for (let k = 0; k < 3; k++) p.tryStroke({ ...wood, rag: 0.3, color: tint(mix('#f8d890', '#e4b868', k / 2), cx + ew / 2, ey), width: Math.max(4.8, ew * 0.06), points: [[cx + rw / 2 - k * 2, ry + 1], [cx + ew / 2 - 3 - k * ew * 0.05, ey + 2]] });   // the end toward the sun
  p.tryStroke({ ...wood, color: tint('#3a2c2a', cx, ry), width: 5.5, points: [[cx - rw / 2 - 3, ry], [cx + rw / 2 + 3, ry]] });                                                 // the ridge
  p.tryStroke({ color: tint('#f4d898', cx, ry, 0), width: 4, opacity: 0.8, points: [[cx - rw / 2, ry - 3], [cx + rw / 2 + 3, ry - 3]] });
  p.tryStroke({ color: tint('#f0d088', cx, ey, 0), width: 4, opacity: 0.55, points: [[cx - ew * 0.2, ey + 2.5], [cx + ew / 2 - 2, ey + 2.5]] });                                // the light along the eaves
}
hall(X - 88, Y - 34, 30, 66, Y - 6, 13);
hall(X + 90, Y - 28, 28, 62, Y - 2, 13);
hall(X, Y - 72, 72, 146, Y - 20, 20);
p.stroke({ ...wood, color: tint('#241c1e', X, Y - 8), width: 9, points: [[X - 6, Y - 18], [X - 6, Y + 1]] });                                                                     // its door
hall(X - 42, Y + 6, 12, 30, Y + 18, 5);
hall(X + 48, Y + 8, 12, 30, Y + 20, 5);
for (const [x, y] of [[X - 52, Y + 20], [X - 32, Y + 20], [X + 38, Y + 22], [X + 58, Y + 22]]) p.stroke({ color: tint('#4a3830', x, y), width: 4, points: [[x, y], [x, y + 13]] });   // the legs of the stores

// Flags: a pole, and a strip of cloth that the wind takes away from the sun.
for (const [x, y, h, c] of [[X - 46, Y - 46, 52, '#b93a2c'], [X + 52, Y - 52, 56, '#f2e6cc'], [X + 126, Y - 10, 46, '#b93a2c']]) {
  p.stroke({ color: tint('#3c2e2a', x, y), width: 4, points: [[x, y + h * 0.5], [x, y - h * 0.5]] });
  p.stroke({ ...wood, cap: 'round', color: tint(c, x, y), width: 7, taper: [0, 0.5], points: [[x - 1, y - h * 0.5 + 5], [x - 10, y - h * 0.5 + 8], [x - 19, y - h * 0.5 + 6]] });
}

// The wall: logs on end. The side of it toward the sun is bright, the side away from it dark.
const log = (x, y, h, c) => p.tryStroke({ ...wood, color: tint(c, x, y), width: 5.6, points: [[x, y], [x + r.range(-0.6, 0.6), y - h]] });
for (let k = 0; k <= 8; k++) { const f = k / 8; log(X - 138 + 20 * f, Y + 48 - 52 * f, 15 - 2.4 * f, mix('#4c3a34', '#5e4a3c', r())); log(X + 138 - 22 * f, Y + 48 - 50 * f, 15 - 2.4 * f, mix('#e2b46c', '#c89a58', r())); }
const front = [];
for (let x = X - 138; x <= X + 138; x += 4.7) {
  const f = (x - X + 138) / 276, y = Y + 48 + 11 * Math.sin(Math.PI * f);
  front.push([x, y - 15]);
  if (Math.abs(x - X) > 15) log(x, y, 15.5, mix(mix('#6c5038', '#8e6c46', r()), '#c49a5c', f * 0.6));
}
glint(p, front.filter(([x]) => Math.abs(x - X) > 18), () => tint('#f2cc88', X, Y + 40), { width: 4, dash: 26, gap: 9, opacity: 0.7, rng: r });

// The gate: two towers, each with a floor to stand on and a small roof.
for (const s of [-1, 1]) {
  const x = X + s * 24, y = Y + 60;
  for (const dx of [-6, 6]) p.stroke({ ...wood, color: tint(dx * 1 > 0 ? '#b88c58' : '#4c3a30', x, y), width: 5, points: [[x + dx, y], [x + dx, y - 50]] });
  p.stroke({ ...wood, color: tint('#5a4434', x, y - 36), width: 6, points: [[x - 11, y - 36], [x + 11, y - 36]] });
  p.stroke({ ...wood, color: tint('#5e4a3c', x, y - 56), width: 7, points: [[x - 13, y - 50], [x - 1, y - 58]] });
  p.stroke({ ...wood, color: tint('#ecc880', x, y - 56), width: 7, points: [[x + 1, y - 58], [x + 13, y - 50]] });
}
p.stroke({ ...wood, color: tint('#4c3a30', X, Y + 26), width: 5.5, points: [[X - 20, Y + 24], [X + 20, Y + 24]] });                                                              // the beam over the way in

// Houses outside the wall.
for (const [cx, cy, n] of [[X + 226, Y + 56, 6], [X + 120, Y + 96, 4]]) {
  for (let k = 0; k < n; k++) {
    const x = cx + r.gauss() * 34, y = cy + r.gauss() * 7, w = r.range(20, 30);
    p.tryStroke({ ...wood, color: tint('#46362f', x, y), width: 8, points: [[x - w / 2, y], [x + w / 2, y]] });
    p.tryStroke({ ...wood, rag: 0.3, color: tint(mix('#e8c078', '#c0965c', r()), x, y), width: 7, points: [[x - w * 0.44, y - 7], [x + w * 0.52, y - 7]] });
  }
}

// Smoke from the fires: it goes up a little way and then lies out level, away from the sun.
for (const [x, y] of [[X - 24, Y - 78], [X + 94, Y - 34]]) {
  p.stroke({ brush: 'soft', color: '#f4e6d2', width: 16, opacity: 0.26, taper: [0.3, 0], points: [[x, y], [x - 6, y - 34], [x - 40, y - 62], [x - 110, y - 74]] });
  p.stroke({ brush: 'soft', color: '#f6ead8', width: 30, opacity: 0.16, points: wave(x - 70, y - 70, x - 330, y - 84, 4, 1, 6) });
}

p.save();
