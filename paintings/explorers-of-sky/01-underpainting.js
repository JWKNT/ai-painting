// Underpainting: the sky of the sunset, the sea, the sand, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor, shoreLine } = require('./scene');
const { mix, smooth } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#d8a0a8', title: 'Pokémon Mystery Dungeon — the beach at sunset',
});

p.fill({
  bounds: [0, 0, W, H], width: 150, length: 600, spacing: 0.45, overlap: 0.5, angle: () => 0.01,
  color: (x, y) => (y < HORIZON ? skyColor(x, y) : y < shoreLine(x) ? mix('#4c8c9c', '#c8a0a0', smooth(HORIZON, HORIZON + 200, y) * 0.5) : mix('#c89c84', '#8c6c7c', smooth(760, 1000, y))),
  stroke: { brush: 'soft', opacity: 0.95 },
});

p.save();
