// The sky: level strokes from night blue down to the gold at the sun; the first stars; the
// Whorl, a small steady light, longer than it is wide; and long bars of cloud that the sun
// lights from beneath.
'use strict';
const { studio, open, W, HORIZON, GREEN, WHORL, skyColor, glow, greenGlow, nB } = require('./scene');
const { shift, mix, wave, clamp, smooth } = studio;

const p = open('sky');
const r = p.rng;
const level = (x, y) => (nB(x / 300, y / 160) - 0.5) * 0.36 - 0.02;

p.fill({ bounds: [0, 0, W, HORIZON + 10], width: 46, length: 300, spacing: 0.55, overlap: 0.55, angle: level, color: (x, y) => shift(skyColor(x, y), r.range(-4, 4), r.range(-0.03, 0.05), r.range(-0.012, 0.016)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, HORIZON], width: 24, length: 170, spacing: 0.9, overlap: 0.7, angle: level, color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-20, 20)), r.range(-6, 6), r.range(-0.02, 0.07), r.range(-0.015, 0.025)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });
for (let k = 0; k < 9; k++) {                                            // a clean brush along the bands, so the sky grades smoothly
  const y = 40 + k * 62 + r.range(-10, 10);
  p.stroke({ brush: 'blend', width: 80, opacity: 0.4, points: wave(-40, y, W + 40, y + r.range(-16, 16), 14, 2.5, 14) });
}

// Stars: each a short level touch of the brush, with a little glow under it.
for (let k = 0; k < 44; k++) {
  const x = r.range(20, W - 20), y = r.range(8, 340);
  if (glow(x, y, 560) > 0.3 || Math.hypot(x - GREEN.x, y - GREEN.y) < GREEN.r + 30 || r() > 1 - y / 520) continue;
  const a = level(x, y), len = r.range(12.4, 14), c = Math.cos(a), s = Math.sin(a), o = r.range(0.14, 0.42) * (1 - 0.5 * greenGlow(x, y, 300));
  p.stroke({ brush: 'soft', color: '#aebcf0', width: 9, opacity: o * 0.5, points: [[x - c * 10, y - s * 10], [x + c * 10, y + s * 10]] });
  p.line(x - c * len / 2, y - s * len / 2, x + c * len / 2, y + s * len / 2, { color: mix('#c8d4ff', '#fff2dc', r()), width: 4, opacity: o });
}

// The Whorl. It is a ship, and long: so it is one short bright stroke, with a glow round it.
{
  const { x, y } = WHORL, a = -0.5, c = Math.cos(a), s = Math.sin(a);
  for (const [w, o] of [[34, 0.14], [16, 0.3], [9, 0.5]]) p.stroke({ brush: 'soft', color: '#dfe8ff', width: w, opacity: o, points: [[x - c * w * 1.05, y - s * w * 1.05], [x + c * w * 1.05, y + s * w * 1.05]] });
  p.line(x - c * 9, y - s * 9, x + c * 9, y + s * 9, { color: '#ffffff', width: 5 });
}

// A cloud: a drift of long ragged strokes. Its top is in shadow, and its underside takes the
// sun: gold near it, rose farther off. Near Green its edges are green instead.
function cloud(cx, cy, len, thick, tilt = 0) {
  const g = glow(cx, cy, 560), hot = clamp(g * 1.5, 0, 1), gg = greenGlow(cx, cy, 380);
  const dusk = mix(mix('#141a48', '#3a2c62', g), '#143a3c', gg * 0.6), fire = mix(mix('#b85c84', '#ffc27a', hot), '#6ccc8c', gg * 0.7);
  const n = Math.round(6 + len / 60);
  for (let k = 0; k < n; k++) {
    const u = r.range(-0.5, 0.5), t = clamp(r() * 1.1 - 0.05, 0, 1), span = len * r.range(0.25, 0.6) * (1 - 0.6 * Math.abs(u));
    const x = cx + u * len * 0.8, y = cy + (t - 0.5) * thick * (1 - 0.5 * Math.abs(u)) + tilt * u * len;
    p.stroke({ brush: 'bristle', color: mix(dusk, fire, smooth(0.35, 1, t) * (0.5 + 0.5 * Math.max(hot, gg))), width: r.range(10, 18) * (0.6 + 0.6 * (1 - Math.abs(u))), opacity: r.range(0.7, 0.92), mix: 0.3, dry: 0.08, rag: 0.4, taper: [0.5, 0.5],
      points: wave(x - span / 2, y - tilt * span / 2, x + span / 2, y + tilt * span / 2 + r.range(-3, 3), r.range(1.5, 4), 1.2, 7) });
  }
  for (let k = 0; k < Math.round(2 + len / 150); k++) {                  // the light along its underside, in broken threads
    const u = r.range(-0.42, 0.42), span = r.range(40, 110), x = cx + u * len * 0.8, y = cy + thick * (0.52 - 0.25 * Math.abs(u)) + tilt * u * len + r.range(-2, 2);
    p.tryStroke({ brush: 'bristle', color: mix(mix('#e89ca0', '#fff0c0', hot), '#a4f0b4', gg * 0.7), width: r.range(4.6, 6.5), opacity: r.range(0.5, 0.9) * Math.max(hot, gg * 0.8, 0.25), mix: 0.2, dry: 0.1, rag: 0.3, taper: [0.5, 0.5], points: [[x - span / 2, y], [x, y + 2], [x + span / 2, y + r.range(-1, 2)]] });
  }
}
for (const [cx, cy, len, thick, tilt] of [
  [1000, 310, 460, 40, 0.03], [1400, 250, 420, 38, -0.04], [1180, 420, 520, 36, 0.02], [1480, 470, 300, 28, -0.03], [820, 470, 380, 30, 0.04],
  [640, 120, 300, 24, 0.02], [100, 470, 360, 32, -0.03], [560, 520, 320, 24, 0.02], [1500, 100, 280, 24, -0.02],
]) cloud(cx, cy, len, thick, tilt);
// Thin bars low over the horizon, burning near the sun.
for (let k = 0; k < 16; k++) {
  const x = r.range(-60, W - 160), y = r.range(520, 596), len = r.range(180, 420), g = glow(x + len / 2, y, 520);
  p.stroke({ brush: 'bristle', color: mix(mix('#2c3a66', '#7c4a78', r()), '#ffdc98', clamp(g * 1.4, 0, 1)), width: r.range(6, 12), opacity: r.range(0.45, 0.8), mix: 0.3, dry: 0.1, rag: 0.3, taper: [0.5, 0.5], points: wave(x, y, x + len, y + r.range(-5, 5), 3, 1, 7) });
}

p.save();
