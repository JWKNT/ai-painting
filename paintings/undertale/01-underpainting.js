// Underpainting: the dark of the cavern, laid in fast with wide strokes.
'use strict';
const { studio, W, H, cavern } = require('./scene');

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#05060f', title: 'Undertale — the castle far off' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: cavern, stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
