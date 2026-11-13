// Underpainting: the dusk sky and the dark sea, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor, seaColor, nB } = require('./scene');

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#14244c', title: 'The Book of the Short Sun — on Blue\'s waters',
});

p.fill({
  bounds: [0, 0, W, HORIZON + 20], width: 170, length: 640, spacing: 0.45, overlap: 0.5,
  angle: (x, y) => (nB(x / 500, y / 300) - 0.5) * 0.2, color: skyColor, stroke: { brush: 'soft', opacity: 0.95 },
});
p.fill({
  bounds: [0, HORIZON, W, H], width: 150, length: 560, spacing: 0.45, overlap: 0.5,
  angle: (x, y) => (nB(x / 500, y / 300) - 0.5) * 0.12, color: seaColor, stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
