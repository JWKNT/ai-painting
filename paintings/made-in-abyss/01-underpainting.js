// Underpainting: the bright haze of the layer, laid in fast with wide strokes that run the
// way the light falls.
'use strict';
const { studio, W, H, SHAFT, air } = require('./scene');

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#ecdcbc', title: 'Made in Abyss — the sixth layer',
});

p.fill({
  bounds: [0, 0, W, H], width: 170, length: 640, spacing: 0.45, overlap: 0.5,
  angle: () => Math.PI / 2 - SHAFT.lean, color: air, stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
