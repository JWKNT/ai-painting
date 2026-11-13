// Last touches: petals coming down from the crown, small lights drifting in the shade, dust
// in the shaft that falls on the sword, and the corners of the picture brought down.
'use strict';
const { studio, open, W, H, SWORD, SLANT, shaft } = require('./scene');
const { mix } = studio;

const p = open('accents');
const r = p.rng;

// Petals, falling.
for (let k = 0; k < 60; k++) {
  const x = r.range(200, 1400), y = r.range(120, 760), a = r.range(0.2, 2.9), len = r.range(12.4, 16);
  p.tryStroke({ brush: 'bristle', color: mix('#f09ab8', '#ffe0ea', r()), width: r.range(4.6, 6.5), opacity: r.range(0.5, 0.9), mix: 0, dry: 0, rag: 0, cap: 'round', taper: [0.2, 0.4], points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
}
// Dust in the shaft over the sword.
for (let k = 0; k < 120; k++) {
  const y = r.range(60, 700), x = 531 + y * SLANT + r.range(-70, 70);
  if (r() > shaft(x, y)) continue;
  const a = r.range(0, 3.14), len = 12.6;
  p.line(x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2, x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2, { color: '#fffbe0', width: 4, opacity: r.range(0.15, 0.45) });
}
// Small lights in the shade: the forest has many. Each is a soft round glow, built from
// short soft strokes that cross at its middle.
for (let k = 0; k < 16; k++) {
  const x = r.range(180, W - 180), y = r.range(330, 900);
  if (shaft(x, y) > 0.3 || Math.hypot(x - SWORD.x, y - 600) < 170) continue;
  const turn = r.range(0, 0.78);
  for (let q = 0; q < 4; q++) { const a = turn + q * Math.PI / 4; p.stroke({ brush: 'soft', color: '#d8ffa0', width: 12, opacity: 0.2, points: [[x - Math.cos(a) * 12.3, y - Math.sin(a) * 12.3], [x + Math.cos(a) * 12.3, y + Math.sin(a) * 12.3]] }); }
  for (let q = 0; q < 3; q++) { const a = turn + q * Math.PI / 3; p.stroke({ brush: 'soft', color: '#fbffe6', width: 8.2, opacity: 0.34, points: [[x - Math.cos(a) * 8.4, y - Math.sin(a) * 8.4], [x + Math.cos(a) * 8.4, y + Math.sin(a) * 8.4]] }); }
}

// The corners, a tone darker, so the eye stays on the sword.
for (const [x0, y0, x1, y1, w, o] of [
  [-80, H + 40, 700, H + 60, 200, 0.34], [W + 80, H + 40, 900, H + 60, 200, 0.34], [-90, -50, 420, -80, 200, 0.24], [W + 90, -50, 1180, -80, 200, 0.24],
]) {
  p.stroke({ brush: 'soft', color: '#04100a', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

p.save();
