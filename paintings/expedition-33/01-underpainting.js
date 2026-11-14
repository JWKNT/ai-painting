// Underpainting: the dark of the sky, the sea and the city, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#0f2731', title: 'Expedition 33 — the Paintress paints the number' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => (y < HORIZON ? skyColor(x, y) : mix('#173840', '#070e14', (y - HORIZON) / (H - HORIZON))), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
