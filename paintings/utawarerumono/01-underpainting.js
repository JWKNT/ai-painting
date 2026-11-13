// Underpainting: the evening sky, the warm floor of the valley and the grass of the ridge,
// laid in fast with wide strokes.
'use strict';
const { studio, W, H, FOOT, skyColor, far, brow } = require('./scene');
const { mix, smooth } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#c8a070', title: 'Utawarerumono — above Tuskur',
});

p.fill({
  bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.02,
  color: (x, y) => (y < FOOT ? skyColor(x, y) : y < brow(x) ? far(mix('#a88c4c', '#6c6c44', smooth(0, 1, (y - FOOT) / 300)), x, y, 0.5) : mix('#8a8440', '#4c5030', smooth(700, 1000, y))),
  stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
