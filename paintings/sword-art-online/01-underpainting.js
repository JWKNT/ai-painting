// Underpainting: the sunset sky and the shadowed sea of clouds, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor, skyFlow, glow } = require('./scene');
const { wave, mix } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#262243', title: 'Sword Art Online — the end of Aincrad',
});
const r = p.rng;

p.fill({
  bounds: [0, 0, W, HORIZON + 20], width: 170, length: 640, spacing: 0.45, overlap: 0.5,
  angle: skyFlow, color: skyColor, stroke: { brush: 'soft', opacity: 0.95 },
});

// The sea of clouds: violet shadow, paler and warmer far off and under the sun.
for (let k = 0; k < 7; k++) {
  const y = HORIZON + 26 + k * 54;
  for (const [x0, x1] of [[-40, 580], [540, 1120], [1080, 1640]]) {
    const g = glow((x0 + x1) / 2, y, 520);
    p.stroke({ brush: 'bristle', width: 96, opacity: 0.96, color: mix(mix(mix('#8a6c9c', '#3a3672', k / 6), '#544a86', r() * 0.3), '#f6b078', g * 0.6 * (1 - k / 8)), points: wave(x0, y + r.range(-8, 8), x1, y + r.range(-8, 8), 10, 1.2, 9) });
  }
}

p.save();
