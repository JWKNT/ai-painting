// Underpainting: the sky, from blue to pink, laid in fast with wide strokes.
'use strict';
const { studio, W, H, skyColor } = require('./scene');

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#8cd2f0', title: 'No Game No Life — the fall into Disboard' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => -0.08, color: skyColor, stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
