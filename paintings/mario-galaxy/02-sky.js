// The sky: long strokes that go with the wind, the brightness of the sun at the upper left,
// and thin high cloud drawn out by the wind.
'use strict';
const { studio, open, W, H, skyColor, wind } = require('./scene');
const { shift, mix, clamp } = studio;

const p = open('sky');
const r = p.rng;

p.fill({ bounds: [0, 0, W, H], width: 46, length: 320, spacing: 0.55, overlap: 0.55, angle: wind, color: (x, y) => shift(skyColor(x, y), r.range(-3, 3), r.range(-0.03, 0.04), r.range(-0.012, 0.016)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, H], width: 24, length: 180, spacing: 0.9, overlap: 0.7, angle: wind, color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-24, 24)), r.range(-5, 5), r.range(-0.02, 0.06), r.range(-0.02, 0.025)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });
// A clean brush drawn along the wind, so that the blue grades smoothly.
for (let k = 0; k < 12; k++) {
  let x = r.range(-60, 200), y = 40 + k * 84 + r.range(-20, 20);
  const pts = [[x, y]];
  for (let i = 0; i < 12; i++) { const a = wind(x, y); x += Math.cos(a) * 150; y += Math.sin(a) * 150; pts.push([x, y]); }
  p.stroke({ brush: 'blend', width: 90, opacity: 0.4, points: pts });
}

// The sun is out of the picture at the upper left: its brightness comes in at the corner.
for (const [w, o] of [[520, 0.12], [300, 0.16], [160, 0.2]]) p.stroke({ brush: 'soft', color: '#fff6d8', width: w, opacity: o, points: [[-w * 1.1, 130], [-20, -10], [w * 1.1, -110]] });

// High cloud: thin white streaks drawn out along the wind.
for (let k = 0; k < 26; k++) {
  let x = r.range(-100, W - 200), y = r.range(60, 560);
  const pts = [[x, y]], len = r.range(180, 460), step = len / 6;
  for (let i = 0; i < 6; i++) { const a = wind(x, y) + r.range(-0.08, 0.08); x += Math.cos(a) * step; y += Math.sin(a) * step; pts.push([x, y]); }
  p.stroke({ brush: 'bristle', color: mix('#e6f2fe', '#ffffff', r()), width: r.range(7, 16), opacity: r.range(0.14, 0.34) * clamp(y / 300, 0.4, 1), mix: 0.4, dry: 0.15, rag: 0.5, taper: [0.5, 0.5], points: pts });
}

p.save();
