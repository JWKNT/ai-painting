// Underpainting: the whole canvas covered fast with wide soft strokes, sky first, then the dark of the land.
'use strict';
const { studio, W, H, skyColor, aroundSun, nB } = require('./scene');
const { wave, mix } = studio;

const p = studio.open(__dirname, {
  fresh: true, pass: 'underpainting', size: [W, H], background: '#11142b', title: 'Outer Wilds — the last evening',
});

p.fill({
  bounds: [0, 0, W, 830], width: 170, length: 620, spacing: 0.45, overlap: 0.5,
  angle: (x, y) => aroundSun(x, y) + (nB(x / 400, y / 400) - 0.5) * 0.4,
  color: skyColor,
  stroke: { brush: 'soft', opacity: 0.95 },
});

// The land: broad dark strokes, bluer to the left, warmer under the sun.
for (let k = 0; k < 4; k++) {
  const y = 815 + k * 56;
  for (const [x0, x1] of [[-40, 560], [520, 1100], [1060, 1640]]) {
    const warm = Math.max(0, 1 - Math.abs((x0 + x1) / 2 - 1010) / 600);
    p.stroke({
      brush: 'bristle', width: 96, opacity: 0.96,
      color: mix(mix('#14152e', '#2a1730', warm), '#0d0d1c', k / 5),
      points: wave(x0, y + p.rng.range(-8, 8), x1, y + p.rng.range(-8, 8), 12, 1.3, 9),
    });
  }
}

p.save();
