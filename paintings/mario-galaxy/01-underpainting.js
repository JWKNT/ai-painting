// Underpainting: the blue of the sky, laid in fast with wide strokes that go with the wind.
'use strict';
const { studio, W, H, skyColor, wind } = require('./scene');

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#4f9ae4', title: 'Super Mario Galaxy — Gusty Garden Galaxy',
});

p.fill({
  bounds: [0, 0, W, H], width: 170, length: 640, spacing: 0.45, overlap: 0.5,
  angle: wind, color: skyColor, stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
