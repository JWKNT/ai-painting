// The sky proper: bristle strokes circling the sun over the underpainting, a faint band of
// starlight across the dark side, then a few passes of a clean brush to soften the glow.
'use strict';
const { studio, open, W, SUN, skyColor, aroundSun, nB, nC, clamp } = require('./scene');
const { shift, arc, mix } = studio;

const p = open('sky');
const r = p.rng;

const field = (x, y) => aroundSun(x, y) + (nB(x / 260, y / 260) - 0.5) * 0.7;

// Broad strokes.
p.fill({
  bounds: [0, 0, W, 800], width: 48, length: 280, spacing: 0.55, overlap: 0.55, angle: field,
  color: (x, y) => shift(skyColor(x, y), r.range(-6, 6), r.range(-0.04, 0.06), r.range(-0.015, 0.02)),
  stroke: { brush: 'bristle', opacity: 0.9, mix: 0.3 },
});

// A band of distant starlight: cool violet and teal drifts across the dark of the sky.
const band = [[60, 470], [330, 400], [640, 300], [930, 170], [1230, 60], [1500, -10]];
for (let k = 0; k < 20; k++) {
  const f = r.range(0.02, 0.9), i = Math.floor(f * (band.length - 1)), g = f * (band.length - 1) - i;
  const x = band[i][0] + (band[i + 1][0] - band[i][0]) * g + r.range(-40, 40);
  const y = band[i][1] + (band[i + 1][1] - band[i][1]) * g + r.range(-70, 70);
  const far = clamp((Math.hypot(x - SUN.x, y - SUN.y) - 380) / 500, 0, 1);
  if (far <= 0.05) continue;
  const width = r.range(70, 150), len = width * r.range(2.2, 3.2), a = -0.33 + r.range(-0.25, 0.25);
  p.stroke({
    brush: 'soft', width, opacity: 0.07 * far + 0.02,
    color: r.pick(['#4b56b8', '#6a4fb0', '#2f7fa6', '#8a5fc4', '#3f6fc0']),
    points: [[x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2], [x + r.range(-20, 20), y + r.range(-20, 20)], [x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2]],
  });
}

// Smaller strokes, with more color in them.
p.fill({
  bounds: [0, 0, W, 790], width: 26, length: 150, spacing: 0.8, overlap: 0.7, angle: field,
  color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-30, 30)), r.range(-14, 14), r.range(-0.02, 0.1), r.range(-0.02, 0.035)),
  stroke: { brush: 'bristle', opacity: 0.75, mix: 0.25 },
});

// Soften the glow around the sun with a clean brush.
for (let k = 0; k < 9; k++) {
  const rad = SUN.r + 40 + k * 46, a0 = Math.PI + 0.12 + r.range(0, 0.15), a1 = 2 * Math.PI - 0.12 - r.range(0, 0.15);
  p.stroke({ brush: 'blend', width: 74, opacity: 0.5, points: arc(SUN.x, SUN.y, rad, a0, a1, 22) });
}

p.save();
