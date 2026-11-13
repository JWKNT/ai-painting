// The sky: strokes that lie level far from the sun and curl round it close by, the first
// stars, long clouds lit from beneath, rays of light spreading from the sun, and the sun
// itself in its glare.
'use strict';
const { studio, open, W, SUN, HORIZON, skyColor, skyFlow, glow } = require('./scene');
const { shift, arc, mix, wave, disc, clamp, smooth } = studio;

const p = open('sky');
const r = p.rng;

p.fill({
  bounds: [0, 0, W, HORIZON + 10], width: 46, length: 300, spacing: 0.55, overlap: 0.55, angle: skyFlow,
  color: (x, y) => shift(skyColor(x, y), r.range(-4, 4), r.range(-0.03, 0.05), r.range(-0.012, 0.016)),
  stroke: { brush: 'bristle', opacity: 0.9, mix: 0.3 },
});
p.fill({
  bounds: [0, 0, W, HORIZON], width: 24, length: 170, spacing: 0.9, overlap: 0.7, angle: skyFlow,
  color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-24, 24)), r.range(-8, 8), r.range(-0.02, 0.08), r.range(-0.02, 0.03)),
  stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 },
});

// The first stars, high up where it is already night.
for (let k = 0; k < 90; k++) {
  const x = r.range(0, W), y = r.range(0, 250);
  if (glow(x, y, 700) > 0.22 || r() > 1 - y / 290) continue;
  const a = skyFlow(x, y) + r.range(-0.2, 0.2), len = r.range(12.4, 15);
  p.line(x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2, x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2, { color: mix('#dfe6ff', '#ffe9d0', r()), width: 4, opacity: r.range(0.25, 0.75) });
}

// Rays: the sun is behind things, and its light comes past them in broad shafts.
for (let k = 0; k < 11; k++) {
  const a = -Math.PI * (0.06 + 0.88 * (k + r.range(0.1, 0.9)) / 11), len = r.range(520, 900), w = r.range(50, 110);
  p.stroke({ brush: 'soft', color: mix('#ffd08a', '#fff0c0', r()), width: w, opacity: r.range(0.035, 0.075), taper: [0, 0.5], points: [[SUN.x + Math.cos(a) * 70, SUN.y + Math.sin(a) * 70], [SUN.x + Math.cos(a) * len * 0.55, SUN.y + Math.sin(a) * len * 0.55], [SUN.x + Math.cos(a) * len, SUN.y + Math.sin(a) * len]] });
}

// A cloud: a drift of long ragged strokes. Its top is in shadow; its belly takes the sun,
// gold near it and rose far off, in broken threads along the underside.
function cloud(cx, cy, len, thick, tilt = 0) {
  const g = glow(cx, cy, 520), hot = clamp(g * 1.6, 0, 1);
  const dusk = mix('#514a86', '#a4607a', g), fire = mix('#ec7c8c', '#ffc27a', hot);
  const n = Math.round(6 + len / 60);
  for (let k = 0; k < n; k++) {
    const u = r.range(-0.5, 0.5), t = clamp(r() * 1.1 - 0.05, 0, 1), span = len * r.range(0.25, 0.6) * (1 - 0.6 * Math.abs(u));
    const x = cx + u * len * 0.8, y = cy + (t - 0.5) * thick * (1 - 0.5 * Math.abs(u)) + tilt * u * len;
    p.stroke({ brush: 'bristle', color: mix(mix(dusk, fire, smooth(0.3, 1, t)), '#ffffff', r() * 0.06), width: r.range(10, 18) * (0.6 + 0.6 * (1 - Math.abs(u))), opacity: r.range(0.7, 0.92), mix: 0.3, dry: 0.08, rag: 0.4, taper: [0.5, 0.5],
      points: wave(x - span / 2, y - tilt * span / 2, x + span / 2, y + tilt * span / 2 + r.range(-3, 3), r.range(1.5, 4), 1.2, 7) });
  }
  for (let k = 0; k < Math.round(2 + len / 150); k++) {
    const u = r.range(-0.42, 0.42), span = r.range(40, 110), x = cx + u * len * 0.8, y = cy + thick * (0.52 - 0.25 * Math.abs(u)) + tilt * u * len + r.range(-2, 2);
    p.tryStroke({ brush: 'bristle', color: mix('#ffb0a4', '#fff0c0', hot), width: r.range(4.6, 6.5), opacity: r.range(0.55, 0.9), mix: 0.2, dry: 0.1, rag: 0.3, taper: [0.5, 0.5], points: [[x - span / 2, y], [x, y + 2], [x + span / 2, y + r.range(-1, 2)]] });
  }
}
// They lie in lines that close toward the place where the sun goes down.
for (const [cx, cy, len, thick, tilt] of [
  [210, 96, 440, 38, 0.05], [1330, 84, 420, 36, -0.05], [300, 250, 480, 44, 0.09], [1380, 232, 440, 40, -0.08], [150, 404, 400, 34, 0.11],
  [1470, 380, 360, 32, -0.1], [330, 506, 380, 26, 0.07], [1320, 486, 300, 24, -0.04], [1150, 150, 260, 24, -0.04], [520, 150, 240, 22, 0.06],
]) cloud(cx, cy, len, thick, tilt);

// Thin bars of cloud low over the horizon, burning at the edges.
for (let k = 0; k < 18; k++) {
  const x = r.range(-60, W - 160), y = r.range(520, 606), len = r.range(180, 420), g = glow(x + len / 2, y, 460);
  p.stroke({ brush: 'bristle', color: mix(mix('#8e5c8e', '#d87a82', r()), '#ffe2a0', clamp(g * 1.3, 0, 1)), width: r.range(7, 13), opacity: r.range(0.45, 0.8), mix: 0.3, dry: 0.1, rag: 0.3, taper: [0.5, 0.5], points: wave(x, y, x + len, y + r.range(-6, 6), 3, 1, 7) });
}

// The sun: its glare, rings of light round it, and the disc.
for (const [w, color, o] of [[420, '#ffb468', 0.18], [280, '#ffd08a', 0.26], [170, '#ffe8b0', 0.36]]) {
  p.stroke({ brush: 'soft', color, width: w, opacity: o, points: [[SUN.x - w * 1.05, SUN.y + 6], [SUN.x, SUN.y - 8], [SUN.x + w * 1.05, SUN.y + 6]] });
}
for (const [rad, w, color, o] of [[170, 16, '#ffd294', 0.4], [134, 14, '#ffe0a8', 0.5], [102, 14, '#ffecbe', 0.6], [76, 12, '#fff4d4', 0.75]]) {
  for (let a = Math.PI * 0.95; a < Math.PI * 2.05; a += 0.5 + r() * 0.25) {
    p.stroke({ brush: 'bristle', color, width: w, opacity: o * r.range(0.7, 1), mix: 0.35, dry: 0.05, rag: 0.3, taper: [0.4, 0.4], points: arc(SUN.x, SUN.y, rad + r.range(-6, 6), a, a + r.range(0.5, 0.9), 7) });
  }
}
disc(p, SUN.x, SUN.y, SUN.r, '#fff7da', 12, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round' });
disc(p, SUN.x, SUN.y, 24, '#ffffff', 9, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round' });
p.stroke({ brush: 'soft', color: '#fffdf0', width: 66, opacity: 0.7, points: [[SUN.x - 70, SUN.y + 2], [SUN.x, SUN.y - 2], [SUN.x + 70, SUN.y + 2]] });

p.save();
