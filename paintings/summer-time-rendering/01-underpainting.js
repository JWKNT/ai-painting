// Underpainting: the sky of the evening, the sea under it and the sand, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor, glare } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#8e5a8e', title: 'Summer Time Rendering — the goodbye on the beach' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => (y < HORIZON ? skyColor(x, y) : mix(mix('#7c5878', '#3c3450', (y - HORIZON) / (H - HORIZON)), '#ffc060', glare(x, y, 420) * 0.6)), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
