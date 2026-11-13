// The sky: strokes that lie level far from the glare and curl round it close by, then the
// smoke of the battle, black above and lit red from beneath, and the dull disc of the sun
// going down through it.
'use strict';
const { studio, open, W, FIRE, HORIZON, skyColor, skyFlow, glow } = require('./scene');
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

// The glare itself: the sun low behind the smoke, and the fires under it.
for (const [w, color, o] of [[460, '#ff6a2a', 0.16], [300, '#ff9440', 0.24], [180, '#ffc468', 0.34]]) {
  p.stroke({ brush: 'soft', color, width: w, opacity: o, points: [[FIRE.x - w * 1.05, FIRE.y + 6], [FIRE.x, FIRE.y - 8], [FIRE.x + w * 1.05, FIRE.y + 6]] });
}
for (const [rad, w, color, o] of [[176, 16, '#ff9a48', 0.4], [138, 14, '#ffb45a', 0.5], [104, 14, '#ffcc74', 0.6], [76, 12, '#ffe09a', 0.7]]) {
  for (let a = Math.PI * 0.95; a < Math.PI * 2.05; a += 0.5 + r() * 0.25) {
    p.stroke({ brush: 'bristle', color, width: w, opacity: o * r.range(0.7, 1), mix: 0.35, dry: 0.05, rag: 0.3, taper: [0.4, 0.4], points: arc(FIRE.x, FIRE.y, rad + r.range(-6, 6), a, a + r.range(0.5, 0.9), 7) });
  }
}
disc(p, FIRE.x, FIRE.y - 16, 40, '#ffe8b0', 12, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round' });
p.stroke({ brush: 'soft', color: '#fff4d0', width: 64, opacity: 0.6, points: [[FIRE.x - 68, FIRE.y - 14], [FIRE.x, FIRE.y - 18], [FIRE.x + 68, FIRE.y - 14]] });

// Smoke: a bank of it is a drift of long ragged strokes, black above, and red where the
// fires below light its underside.
function bank(cx, cy, len, thick, tilt = 0) {
  const g = glow(cx, cy, 620), hot = clamp(g * 1.5, 0, 1);
  const dark = mix('#0b0a16', '#2a1422', g), lit = mix('#6a1c2a', '#f0682c', hot);
  const n = Math.round(10 + len / 40);
  for (let k = 0; k < n; k++) {
    const u = r.range(-0.5, 0.5), t = clamp(r() * 1.15 - 0.05, 0, 1), span = len * r.range(0.25, 0.6) * (1 - 0.6 * Math.abs(u));
    const x = cx + u * len * 0.8, y = cy + (t - 0.5) * thick * (1 - 0.5 * Math.abs(u)) + tilt * u * len;
    p.stroke({ brush: 'bristle', color: mix(mix(dark, lit, smooth(0.55, 1, t) * 0.8), '#000000', r() * 0.08), width: r.range(16, 30) * (0.6 + 0.6 * (1 - Math.abs(u))), opacity: r.range(0.75, 0.95), mix: 0.3, dry: 0.08, rag: 0.4, taper: [0.5, 0.5],
      points: wave(x - span / 2, y - tilt * span / 2, x + span / 2, y + tilt * span / 2 + r.range(-4, 4), r.range(2, 6), 1.2, 7) });
  }
  for (let k = 0; k < Math.round(2 + len / 130); k++) {            // the fire on its underside, in broken threads
    const u = r.range(-0.42, 0.42), span = r.range(50, 130), x = cx + u * len * 0.8, y = cy + thick * (0.5 - 0.25 * Math.abs(u)) + tilt * u * len + r.range(-2, 2);
    p.tryStroke({ brush: 'bristle', color: mix('#c83a2a', '#ffb060', hot), width: r.range(5, 8), opacity: r.range(0.4, 0.75) * (0.4 + 0.6 * hot), mix: 0.25, dry: 0.1, rag: 0.3, taper: [0.5, 0.5], points: [[x - span / 2, y], [x, y + 3], [x + span / 2, y + r.range(-1, 2)]] });
  }
}
for (const [cx, cy, len, thick, tilt] of [
  [220, 70, 620, 90, 0.03], [760, 50, 700, 80, -0.01], [1340, 80, 640, 96, -0.03], [420, 190, 560, 70, 0.05], [1120, 180, 600, 76, -0.04],
  [150, 300, 440, 56, 0.07], [1460, 300, 420, 60, -0.06], [760, 150, 380, 50, 0], [300, 410, 360, 40, 0.06], [1330, 420, 380, 44, -0.05],
]) bank(cx, cy, len, thick, tilt);

// Thin bars of smoke low over the horizon, burning at the edges.
for (let k = 0; k < 18; k++) {
  const x = r.range(-60, W - 160), y = r.range(486, 590), len = r.range(180, 420), g = glow(x + len / 2, y, 460);
  p.stroke({ brush: 'bristle', color: mix(mix('#2a1222', '#6a1e2a', r()), '#ffa850', clamp(g * 1.1, 0, 1) * r.range(0.3, 1)), width: r.range(7, 14), opacity: r.range(0.45, 0.8), mix: 0.3, dry: 0.1, rag: 0.3, taper: [0.5, 0.5], points: wave(x, y, x + len, y + r.range(-6, 6), 3, 1, 7) });
}

p.save();
