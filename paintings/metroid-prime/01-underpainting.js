// Underpainting: the grey of the sky and the dark of the lake, laid in fast with wide strokes.
'use strict';
const { studio, W, H, SHORE, skyColor } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#9aaab8', title: 'Metroid Prime — the Phendrana Shorelines' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => (y < SHORE ? skyColor(x, y) : mix('#3c4a52', '#1c262c', (y - SHORE) / (H - SHORE))), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
