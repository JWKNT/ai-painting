// Underpainting: the dark of the snow cloud, and the blue of the snow on the ground, laid in fast with wide strokes.
'use strict';
const { studio, W, H, GROUND, skyColor, lance } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#111a38', title: 'Baldr Sky — Gray Christmas' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => (y < GROUND ? skyColor(x, y) : mix(mix('#52648c', '#28324c', (y - GROUND) / (H - GROUND)), '#c4d8f4', lance(x, y, 380) * 0.4)), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
