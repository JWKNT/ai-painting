// Underpainting: the bright sky, the pale city under it, and the warm stone of the terrace, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor, far, wallTop } = require('./scene');
const { mix, smooth } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#d8dce4', title: 'Re:Zero — From Zero',
});

p.fill({
  bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01,
  color: (x, y) => (y < HORIZON ? skyColor(x, y) : y < wallTop(x) ? far('#b8a898', x, y, 0.6) : mix('#b4a698', '#d8c8ac', smooth(640, 900, y))),
  stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
