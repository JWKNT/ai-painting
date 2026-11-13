// Underpainting: the haze of the hollow, pale gold above and dark green below, laid in fast
// with wide strokes that run the way the light falls.
'use strict';
const { studio, W, H, SRC, haze } = require('./scene');

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#1c4a4c', title: 'Made in Abyss — the sixth layer',
});

p.fill({
  bounds: [0, 0, W, H], width: 170, length: 640, spacing: 0.45, overlap: 0.5,
  angle: (x, y) => Math.atan2(y - SRC.y, x - SRC.x), color: haze, stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
