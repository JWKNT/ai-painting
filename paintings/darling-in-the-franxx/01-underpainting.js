// Underpainting: the sky of the sunset, and the land in the blue shade of the evening, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor, glare } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#1f5c78', title: 'Darling in the Franxx — sunset over Plantation 13' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => (y < HORIZON ? skyColor(x, y) : mix(mix('#6c4458', '#2a1c2c', (y - HORIZON) / (H - HORIZON)), '#e0905c', glare(x, y, 500) * 0.5)), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
