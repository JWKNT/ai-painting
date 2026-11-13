// Underpainting: the sky of the forge and the red plain under it, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor, ground } = require('./scene');

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#6c2c18', title: 'Fate/stay night — Unlimited Blade Works',
});

p.fill({
  bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01,
  color: (x, y) => (y < HORIZON ? skyColor(x, y) : ground(x, y)), stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
