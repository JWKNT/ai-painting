// Underpainting: the dark red of the place, with the fire of the black sun in the middle of its upper part, laid in fast with wide strokes.
'use strict';
const { studio, W, H, airColor } = require('./scene');

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#3a0a12', title: 'Berserk — the Eclipse',
});

p.fill({
  bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01,
  color: (x, y) => airColor(x, y), stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
