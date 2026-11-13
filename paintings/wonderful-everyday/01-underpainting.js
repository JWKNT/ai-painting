// Underpainting: the blue of the sky and the green of the hill, laid in fast with wide strokes.
'use strict';
const { studio, W, H, crest, near, skyColor } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#7cb4e8', title: 'Wonderful Everyday — the hill of sunflowers',
});

p.fill({
  bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => -0.04,
  color: (x, y) => (y < crest(x) ? skyColor(x, y) : mix('#8cbc54', '#2c6c2c', near(x, y))), stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
