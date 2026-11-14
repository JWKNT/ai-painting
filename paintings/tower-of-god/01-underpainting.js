// Underpainting: the green light, brightest low in the middle, and the dark round it, laid in fast with wide strokes.
'use strict';
const { studio, W, H, FLOOR, shinsu } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#083420', title: 'Tower of God — the first test' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => (y < FLOOR ? shinsu(x, y) : mix(shinsu(x, 2 * FLOOR - y), '#040806', 0.7)), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
