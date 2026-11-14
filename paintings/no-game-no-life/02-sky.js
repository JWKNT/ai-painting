// The sky, and the red moon. The sky is a clear blue at the upper left, where the sun is,
// and goes to violet at the right and to pink low down. The moon is great and red, like a
// coral, with darker seas on it; its lower part is pale, where the rose air is in front
// of it. Thin cloud, drawn out long, lies high across the sky.
'use strict';
const { studio, open, W, SEA, MOON, skyColor, nA, nB } = require('./scene');
const { mix, shift, smooth, glow } = studio;

const p = open('sky');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.28, dry: 0.04, rag: 0.3, cap: 'round' };
const flow = (x, y) => -0.1 + (nB(x / 340, y / 160) - 0.5) * 0.3;
p.fill({ bounds: [0, 0, W, SEA + 60], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: flow, color: (x, y) => shift(skyColor(x, Math.min(y, SEA)), r.range(-2, 2), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { ...line, opacity: 0.93 } });
p.fill({ bounds: [0, 0, W, SEA + 60], width: 20, length: 160, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-30, 30), Math.min(y + r.range(-12, 12), SEA)), r.range(-3, 3), r.range(-0.02, 0.04), r.range(-0.012, 0.014)), stroke: { ...line, opacity: 0.72 } });

// ---------------------------------------------------------------- the moon
{ const { x: mx, y: my, r: R } = MOON;
  for (const [w, op] of [[R * 2.2, 0.05], [R * 1.5, 0.07]]) glow(p, mx, my, w, '#ff9cb0', op, 5);
  const face = (x, y) => { const sea = smooth(0.48, 0.66, nA((x - mx) / 150 + 4, (y - my) / 130 + 2)), k = ((x - mx) * -0.62 + (y - my) * -0.78) / R; let c = mix('#f0607c', '#c03c68', sea * 0.75); c = mix(c, '#ffa8a0', smooth(-0.1, 0.9, k) * 0.6); c = mix(c, '#8c3c84', smooth(0.1, -0.9, k) * 0.4); return mix(c, skyColor(x, y), 0.14 + 0.55 * smooth(my, my + R, y)); };
  p.fill({ inside: (x, y) => Math.hypot(x - mx, y - my) < R - 3, bounds: [mx - R, my - R, mx + R, my + R], width: 13, length: 64, spacing: 0.5, overlap: 0.6, angle: (x, y) => 0.5 + (nB(x / 120, y / 120) - 0.5) * 2.4, color: face, stroke: { ...line, mix: 0.3, opacity: 0.93 } });
  p.fill({ inside: (x, y) => Math.hypot(x - mx, y - my) < R - 4, bounds: [mx - R, my - R, mx + R, my + R], width: 7, length: 40, spacing: 1.0, overlap: 0.7, angle: (x, y) => 0.5 + (nB(x / 120, y / 120) - 0.5) * 2.4, color: (x, y) => face(x + r.range(-6, 6), y + r.range(-6, 6)), stroke: { ...line, mix: 0.3, opacity: 0.8 } });
  for (let i = 0; i < 30; i++) { const a0 = Math.PI * 0.8 + i / 30 * Math.PI * 1.3; p.tryStroke({ brush: 'round', color: '#ffd8d4', width: 4.6, opacity: 0.6, points: studio.arc(mx, my, R - 4, a0, a0 + Math.PI * 1.3 / 30 * 1.2, 5) }); } }   // the light on its edge, on the side of the sun

// ---------------------------------------------------------------- thin high cloud
for (let k = 0; k < 16; k++) { const x = r.range(-100, W - 200), y = r.range(20, 330), len = r.range(260, 640), a = -0.14 + r.range(-0.05, 0.05), pts = []; for (let t = 0; t <= 1.001; t += 0.125) pts.push([x + len * t * Math.cos(a), y + len * t * Math.sin(a) + 18 * t * t]); p.stroke({ brush: 'soft', color: mix('#ffffff', '#ffd4e8', r()), width: r.range(12, 26), opacity: r.range(0.1, 0.22), taper: [0.4, 0.6], points: pts }); }
// the light of the sun, which is out of the picture at the upper left
for (const [w, op] of [[520, 0.08], [320, 0.1]]) glow(p, -40, -50, w, '#fffaf0', op, 5);
void mix;

p.save();
