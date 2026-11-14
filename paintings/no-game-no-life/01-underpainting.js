// Underpainting: the sky, and the green of the land, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#86cdea', title: 'No Game No Life — Disboard' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => (y < HORIZON ? skyColor(x, y) : mix('#b8d8c0', '#2f8a6a', (y - HORIZON) / (H - HORIZON))), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
