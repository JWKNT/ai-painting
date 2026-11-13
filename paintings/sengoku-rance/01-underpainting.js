// Underpainting: the dawn sky, the dim plain and the dark near hill, laid in fast with wide
// strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor, skyFlow, hillTop, glow } = require('./scene');
const { wave, mix } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#2a2a44', title: 'Sengoku Rance — before the battle',
});
const r = p.rng;

p.fill({
  bounds: [0, 0, W, HORIZON + 20], width: 170, length: 640, spacing: 0.45, overlap: 0.5,
  angle: skyFlow, color: skyColor, stroke: { brush: 'soft', opacity: 0.95 },
});

// The plain: dusky green, warmer and paler where the sun stands over it.
for (let k = 0; k < 5; k++) {
  const y = HORIZON + 30 + k * 52;
  for (const [x0, x1] of [[-40, 580], [540, 1120], [1080, 1640]]) {
    const g = glow((x0 + x1) / 2, y, 500);
    p.stroke({ brush: 'bristle', width: 92, opacity: 0.95, color: mix(mix(mix('#8f8690', '#4f6654', k / 4), '#6a6f7c', r() * 0.3), '#f0c090', g * 0.55 * (1 - k / 6)), points: wave(x0, y + r.range(-8, 8), x1, y + r.range(-8, 8), 10, 1.2, 9) });
  }
}
// The near hill: in its own shadow.
for (let k = 0; k < 5; k++) {
  for (const [x0, x1] of [[-40, 560], [520, 1100], [1060, 1640]]) {
    p.stroke({ brush: 'bristle', width: 100, opacity: 0.96, color: mix(mix('#213f33', '#12261f', k / 4), '#2c4a36', r() * 0.3), points: wave(x0, hillTop(x0) + 46 + k * 60, x1, hillTop(x1) + 46 + k * 60, 10, 1.1, 9) });
  }
}

p.save();
