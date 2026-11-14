// Underpainting: the dark of the shaft, lighter and bluer toward the bright place far down, laid in fast with wide strokes.
'use strict';
const { studio, W, H, wall, toVP } = require('./scene');

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#0c1422', title: 'Baldr Sky — the dive' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 500, spacing: 0.45, overlap: 0.5, angle: toVP, color: wall, stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
