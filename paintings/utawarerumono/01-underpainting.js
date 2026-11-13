// Underpainting: the dawn sky and the land in blue shadow, laid in fast with wide strokes.
'use strict';
const { studio, W, BASE, skyColor, skyFlow } = require('./scene');
const { wave, mix } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, 1000], background: '#7f8fc4', title: 'Utawarerumono — the snow road',
});
const r = p.rng;

p.fill({
  bounds: [0, 0, W, BASE + 20], width: 170, length: 640, spacing: 0.45, overlap: 0.5,
  angle: skyFlow, color: skyColor, stroke: { brush: 'soft', opacity: 0.95 },
});
for (let k = 0; k < 9; k++) {
  const y = BASE + 26 + k * 54;
  for (const [x0, x1] of [[-40, 580], [540, 1120], [1080, 1640]]) {
    p.stroke({ brush: 'bristle', width: 96, opacity: 0.96, color: mix(mix('#a8b6e0', '#6072b4', k / 8), '#8c9cd0', r() * 0.3), points: wave(x0, y + r.range(-8, 8), x1, y + r.range(-8, 8), 10, 1.2, 9) });
  }
}

p.save();
