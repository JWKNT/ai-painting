// The sky: level strokes from night blue down to the rose band and the earth's shadow, the
// last stars, thin high cloud with the sun on it, and the moon going down.
'use strict';
const { studio, open, W, BASE, MOON, skyColor, skyFlow } = require('./scene');
const { shift, mix, wave, disc, clamp } = studio;

const p = open('sky');
const r = p.rng;

p.fill({
  bounds: [0, 0, W, BASE + 10], width: 46, length: 300, spacing: 0.55, overlap: 0.55, angle: skyFlow,
  color: (x, y) => shift(skyColor(x, y), r.range(-4, 4), r.range(-0.03, 0.05), r.range(-0.012, 0.016)),
  stroke: { brush: 'bristle', opacity: 0.9, mix: 0.3 },
});
p.fill({
  bounds: [0, 0, W, BASE], width: 24, length: 170, spacing: 0.9, overlap: 0.7, angle: skyFlow,
  color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-20, 20)), r.range(-6, 6), r.range(-0.02, 0.06), r.range(-0.015, 0.025)),
  stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 },
});
// A clean brush drawn along the bands, so the sky grades smoothly.
for (let k = 0; k < 9; k++) {
  const y = 40 + k * 56 + r.range(-10, 10);
  p.stroke({ brush: 'blend', width: 80, opacity: 0.4, points: wave(-40, y, W + 40, y + r.range(-16, 16), 14, 2.5, 14) });
}

// The last stars, high up and away from the sun.
for (let k = 0; k < 56; k++) {
  const x = r.range(260, W), y = r.range(0, 230);
  if (r() > (1 - y / 250) * clamp((x - 200) / 700, 0.2, 1)) continue;
  const a = r.range(-0.3, 0.3), len = r.range(12.4, 14);
  p.line(x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2, x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2, { color: mix('#dfe6ff', '#fff0e0', r()), width: 4, opacity: r.range(0.15, 0.45) });
}

// High cloud: long thin streaks, lilac in themselves and rose and gold where the sun is on them.
function streak(cx, cy, len, tilt) {
  const sun = clamp(1.15 - cx / 1500, 0.15, 1);
  for (let k = 0; k < Math.round(7 + len / 60); k++) {
    const u = r.range(-0.5, 0.5), span = len * r.range(0.3, 0.7) * (1 - 0.6 * Math.abs(u)), x = cx + u * len * 0.8, y = cy + r.range(-9, 9) * (1 - Math.abs(u)) + tilt * u * len, t = r();
    p.stroke({ brush: 'bristle', color: mix(mix('#8088c4', '#b0a4d4', t), mix('#f6b4b0', '#ffe0c0', t), sun * (0.35 + 0.65 * t)), width: r.range(7, 13), opacity: r.range(0.4, 0.75), mix: 0.3, dry: 0.1, rag: 0.4, taper: [0.5, 0.5],
      points: wave(x - span / 2, y - tilt * span / 2, x + span / 2, y + tilt * span / 2 + r.range(-2, 2), r.range(1, 3), 1.2, 7) });
  }
}
for (const [cx, cy, len, tilt] of [[300, 150, 520, -0.06], [760, 246, 440, -0.04], [150, 300, 380, -0.05], [1060, 96, 320, -0.03], [560, 70, 320, -0.05], [1420, 380, 300, -0.03]]) streak(cx, cy, len, tilt);

// The moon, pale in the lightening sky.
for (const [w, o] of [[150, 0.1], [84, 0.16]]) p.stroke({ brush: 'soft', color: '#e8e6f6', width: w, opacity: o, points: [[MOON.x - w * 1.02, MOON.y + 4], [MOON.x, MOON.y - 4], [MOON.x + w * 1.02, MOON.y + 4]] });
disc(p, MOON.x, MOON.y, MOON.r, '#f0ece4', 10, { brush: 'round' });
for (const a of [0.3, 1.9]) p.line(MOON.x - Math.cos(a) * 14, MOON.y - Math.sin(a) * 14, MOON.x + Math.cos(a) * 14, MOON.y + Math.sin(a) * 14, { color: '#f0ece4', width: 13 });   // its middle
p.stroke({ brush: 'soft', color: '#fffaf0', width: 26, opacity: 0.5, points: [[MOON.x - 27, MOON.y - 2], [MOON.x, MOON.y - 4], [MOON.x + 27, MOON.y - 2]] });   // its own soft light

p.save();
