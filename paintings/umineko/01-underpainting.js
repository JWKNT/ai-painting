// Underpainting: the dark of the hall, laid in fast with wide strokes. The walls are a deep
// wine color, the floor near black, and both lights already show faintly.
'use strict';
const { studio, W, H, BACK, lit, nB } = require('./scene');
const { mix, smooth } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#0a0710', title: 'Umineko — the witch in the hall',
});

p.fill({
  bounds: [0, 0, W, H], width: 150, length: 520, spacing: 0.45, overlap: 0.5,
  angle: (x, y) => (y > BACK ? 0 : Math.PI / 2) + (nB(x / 400, y / 300) - 0.5) * 0.2,
  color: (x, y) => (y > BACK ? lit('#0d0914', x, y, 0.3, 0.3) : lit(mix('#0e070c', '#241019', smooth(0, 520, y)), x, y, 0.35, 0.3)),
  stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
