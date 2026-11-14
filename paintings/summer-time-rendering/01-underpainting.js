// Underpainting: the blue of the sky, the sea and the pale sand, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, SHORE, skyColor } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#59a8e6', title: 'Summer Time Rendering — a shadow on the beach' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => (y < HORIZON ? skyColor(x, y) : y < SHORE ? mix('#1c6cb8', '#58c4cc', (y - HORIZON) / (SHORE - HORIZON)) : mix('#f2e6c4', '#e0cfa4', (y - SHORE) / (H - SHORE))), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
