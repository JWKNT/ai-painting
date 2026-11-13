// Underpainting: the dark of the storm, the pale light in the middle of it, and the red of the fires low down, laid in fast with wide strokes.
'use strict';
const { studio, W, H, skyColor } = require('./scene');

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#1c2a34', title: 'Madoka Magica — Walpurgisnacht',
});

p.fill({ bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.2, color: skyColor, stroke: { brush: 'soft', opacity: 0.95 } });

p.save();
