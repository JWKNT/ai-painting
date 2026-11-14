// Underpainting: the purple of the sky, lighter where it turns, and the dark of the garden under it, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HZ, skyColor } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#2c0b4c', title: 'Umineko — the Golden Land',
});

p.fill({
  bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01,
  color: (x, y) => (y < HZ + 40 ? skyColor(x, Math.min(y, HZ)) : mix('#3c3450', '#17131f', (y - HZ) / (H - HZ))), stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
