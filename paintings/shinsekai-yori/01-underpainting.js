// Underpainting: the dark of the forest, with the light of seven colors about the place where the creature will be, laid in fast.
'use strict';
const { studio, W, H, lit } = require('./scene');

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#081410', title: 'Shinsekai Yori — the False Minoshiro' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => lit(x, y, 0.6), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
