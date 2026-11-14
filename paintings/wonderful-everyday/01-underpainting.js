// Underpainting: the blue of the sky, white toward the sun, and the grey of the wet roof, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HZ, skyColor, mirror } = require('./scene');

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#3270c4', title: 'Wonderful Everyday — the roof under the sky',
});

p.fill({
  bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01,
  color: (x, y) => (y < HZ + 30 ? skyColor(x, Math.min(y, HZ)) : mirror(x, y)), stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
