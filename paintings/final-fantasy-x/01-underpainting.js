// Underpainting: the dark sky with its band of fire, the water, and the dark hill, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor, ridge, waterColor } = require('./scene');

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#3a2a30', title: 'Final Fantasy X — the ruins of Zanarkand',
});

p.fill({
  bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01,
  color: (x, y) => (y > ridge(x) ? '#2a1c1c' : y < HORIZON + 20 ? skyColor(x, y) : waterColor(x, y)), stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
