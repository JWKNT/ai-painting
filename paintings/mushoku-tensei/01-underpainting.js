// Underpainting: the dark sky, with the cold light where the column will stand, and the dark land, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor, lit } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#1c1b2c', title: 'Mushoku Tensei — the Displacement' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => (y < HORIZON ? skyColor(x, y) : mix(mix('#2c2c24', '#0c0e0c', (y - HORIZON) / (H - HORIZON)), '#9cc4e0', lit(x, y, 300) * 0.5)), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
