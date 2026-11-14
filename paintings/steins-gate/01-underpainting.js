// Underpainting: the pale blue of the sky, whiter toward the sun, laid in fast with wide strokes.
'use strict';
const { studio, W, H, skyColor } = require('./scene');

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#7cb8d8', title: 'Steins;Gate — the thing in the roof' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: skyColor, stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
