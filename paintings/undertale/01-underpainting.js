// Underpainting: the gold of the wall and the orange of the floor, laid in fast with wide strokes.
'use strict';
const { studio, W, H, BASE } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#e8a030', title: 'Undertale — the last corridor' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => (y < BASE ? mix('#c88428', '#f4b838', y / BASE) : mix('#e08430', '#b85c28', (y - BASE) / (H - BASE))), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
