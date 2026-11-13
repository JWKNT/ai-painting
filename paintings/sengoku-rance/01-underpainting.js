// Underpainting: sky, far land and near hill laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor, hillTop, nB } = require('./scene');
const { wave, mix } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#e9e2d0', title: 'Sengoku Rance — before the battle',
});
const r = p.rng;

p.fill({
  bounds: [0, 0, W, HORIZON + 20], width: 170, length: 640, spacing: 0.45, overlap: 0.5,
  angle: (x, y) => (nB(x / 500, y / 300) - 0.5) * 0.25, color: skyColor, stroke: { brush: 'soft', opacity: 0.95 },
});

// The plain: pale spring greens, yellower in the distance.
for (let k = 0; k < 5; k++) {
  const y = HORIZON + 30 + k * 52;
  for (const [x0, x1] of [[-40, 580], [540, 1120], [1080, 1640]]) {
    p.stroke({ brush: 'bristle', width: 92, opacity: 0.95, color: mix(mix('#cfdc8f', '#9cc46a', k / 4), '#e4e6a8', r() * 0.3), points: wave(x0, y + r.range(-8, 8), x1, y + r.range(-8, 8), 10, 1.2, 9) });
  }
}
// The near hill: deeper green.
for (let k = 0; k < 5; k++) {
  for (const [x0, x1] of [[-40, 560], [520, 1100], [1060, 1640]]) {
    const mid = (x0 + x1) / 2, y = hillTop(mid) + 46 + k * 60;
    p.stroke({ brush: 'bristle', width: 100, opacity: 0.96, color: mix(mix('#5d9a3e', '#3f7a31', k / 4), '#6fae48', r() * 0.3), points: wave(x0, hillTop(x0) + 46 + k * 60, x1, hillTop(x1) + 46 + k * 60, 10, 1.1, 9) });
  }
}

p.save();
