// Underpainting: the sky of the dusk, and the blue of the ground, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor, glare } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#7c5088', title: 'Shinsekai Yori — the cat on the roof' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => (y < HORIZON ? skyColor(x, y) : mix(mix('#3a3460', '#141830', (y - HORIZON) / (H - HORIZON)), '#c87848', glare(x, y, 360) * 0.4)), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
