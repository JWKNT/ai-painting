// Underpainting: the blue of the sky, the grey of the stands under it and the pale floor of the stadium, laid in fast with wide strokes.
'use strict';
const { studio, W, H, skyColor, rimLine, FIELD_EDGE, HAZE } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#86a8d8', title: '20th Century Boys — the resurrection',
});

p.fill({
  bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01,
  color: (x, y) => (y < rimLine(x) + 30 ? skyColor(x, Math.min(y, 520)) : y < FIELD_EDGE ? mix('#7f8eae', HAZE, 0.3) : mix('#e6dcc6', '#d6ccb8', (y - FIELD_EDGE) / (H - FIELD_EDGE))),
  stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
