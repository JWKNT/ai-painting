// Underpainting: grey sky and dark wet ground, laid in fast with wide strokes.
'use strict';
const { studio, W, H, skyColor, shine, nB } = require('./scene');
const { mix } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#3a4246', title: 'Monster — Ruhenheim',
});

p.fill({
  bounds: [0, 0, W, 520], width: 170, length: 640, spacing: 0.45, overlap: 0.5,
  angle: (x, y) => -0.1 + (nB(x / 500, y / 300) - 0.5) * 0.25, color: skyColor, stroke: { brush: 'soft', opacity: 0.95 },
});
p.fill({
  bounds: [0, 500, W, H], width: 150, length: 560, spacing: 0.45, overlap: 0.5,
  angle: (x, y) => (nB(x / 500, y / 300) - 0.5) * 0.15, color: (x, y) => mix('#262d31', '#c4ccc8', shine(x, y) * 0.8), stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
