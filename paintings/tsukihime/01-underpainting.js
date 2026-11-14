// Underpainting: the deep blue of the night, paler low down, laid in fast with wide strokes.
'use strict';
const { studio, W, H, FOOT, skyColor } = require('./scene');

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#070c3c', title: 'Tsukihime — the Millennium Castle' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => skyColor(x, Math.min(y, FOOT)), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
