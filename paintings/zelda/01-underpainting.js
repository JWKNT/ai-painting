// Underpainting: the green mist of the forest, laid in fast with wide strokes.
'use strict';
const { studio, W, H, mist, nB } = require('./scene');

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#2c5a44', title: 'The Legend of Zelda — Korok Forest',
});

p.fill({
  bounds: [0, 0, W, H], width: 170, length: 640, spacing: 0.45, overlap: 0.5,
  angle: (x, y) => 1.17 + (nB(x / 500, y / 300) - 0.5) * 0.3, color: mist, stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
