// Underpainting: the blue of the night and the dark of the yard, laid in fast with wide strokes.
'use strict';
const { studio, W, H, GROUND, skyColor, fire } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#0b1432', title: 'Full Metal Daemon Muramasa — the crimson spider' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => (y < GROUND ? skyColor(x, y) : mix(mix('#141a2c', '#080a14', (y - GROUND) / (H - GROUND)), '#a8501c', fire(x, y, 300) * 0.5)), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
