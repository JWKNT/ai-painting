// Underpainting: the dusk sky and the dark sea laid in with wide soft strokes.
'use strict';
const { studio, W, H, SEA, skyColor, nB } = require('./scene');
const { mix, wave } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#2a2238', title: 'The Case of the Golden Idol — a grim departure',
});
const r = p.rng;

p.fill({
  bounds: [0, 0, W, SEA + 16], width: 170, length: 640, spacing: 0.45, overlap: 0.5,
  angle: (x, y) => (nB(x / 500, y / 300) - 0.5) * 0.2, color: skyColor, stroke: { brush: 'soft', opacity: 0.95 },
});
for (let k = 0; k < 8; k++) {
  const y = SEA + 30 + k * 54;
  for (const [x0, x1] of [[-40, 580], [540, 1120], [1080, 1640]]) {
    p.stroke({ brush: 'bristle', width: 96, opacity: 0.96, color: mix(mix('#5a3f6e', '#1c2c4a', Math.min(1, k / 5)), '#2a2140', r() * 0.3), points: wave(x0, y + r.range(-8, 8), x1, y + r.range(-8, 8), 9, 1.2, 9) });
  }
}

p.save();
