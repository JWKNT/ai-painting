// Underpainting: the burning sky and the black ground, laid in fast with wide strokes.
'use strict';
const { studio, W, H, HORIZON, skyColor, skyFlow, groundColor } = require('./scene');
const { wave } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#15101c', title: 'Muv-Luv Alternative — against the BETA',
});
const r = p.rng;

p.fill({
  bounds: [0, 0, W, HORIZON + 20], width: 170, length: 640, spacing: 0.45, overlap: 0.5,
  angle: skyFlow, color: skyColor, stroke: { brush: 'soft', opacity: 0.95 },
});
for (let k = 0; k < 7; k++) {
  const y = HORIZON + 26 + k * 54;
  for (const [x0, x1] of [[-40, 580], [540, 1120], [1080, 1640]]) {
    p.stroke({ brush: 'bristle', width: 96, opacity: 0.96, color: groundColor((x0 + x1) / 2 + r.range(-120, 120), y), points: wave(x0, y + r.range(-8, 8), x1, y + r.range(-8, 8), 10, 1.2, 9) });
  }
}

p.save();
