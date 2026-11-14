// Underpainting: the night sky, with the red of the day low at the right, and the dark of the clouds under it, laid in fast.
'use strict';
const { studio, W, H, HORIZON, skyColor } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, { fresh: true, pass: 'underpainting', size: [W, H], background: '#0e1244', title: 'Full Metal Daemon Muramasa — the duel in the sky' });
p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01, color: (x, y) => (y < HORIZON + 20 ? skyColor(x, Math.min(y, HORIZON)) : mix('#2a2858', '#0c0a22', (y - HORIZON) / (H - HORIZON))), stroke: { brush: 'soft', opacity: 0.95 } });
p.save();
