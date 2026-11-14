// Underpainting: the dark of the mine with its lights in it, laid in fast with wide strokes.
'use strict';
const { studio, W, H, mine } = require('./scene');

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#070916', title: 'Metroid Prime — Metroid Quarantine' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.3, color: mine, stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
