// The plain: fields in bands, a river, groves and a road, and two armies drawn up under
// their banners with dust between them.
'use strict';
const { studio, open, W, HORIZON, hillTop, nA, nB, nC } = require('./scene');
const { mix, wave, clamp, smooth, ramp } = studio;

const p = open('plain');
const r = p.rng;
const far = (y) => clamp(1 - (y - HORIZON) / 250, 0, 1);            // 1 at the horizon, 0 near us

// Fields: long level bands of spring green and young grain, paler with distance.
const fields = ['#b6d47a', '#9cc765', '#d9de8e', '#86b95a', '#c8da8c', '#a8cf70', '#e3e2a0', '#93c16a'];
const field = (x, y) => {
  const band = nA(x / 320 + 7, (y - HORIZON) / (14 + (y - HORIZON) * 0.16));
  let c = ramp(fields, clamp(band * 1.25 - 0.12, 0, 1));
  c = mix(c, '#d5e6cf', far(y) * 0.6);
  return mix(c, '#fff3c8', 0.16 * smooth(500, 1500, x) * far(y));
};
const onPlain = (m) => (x, y) => y > HORIZON + 18 + m && y < hillTop(x) + 30;
for (const [w, o] of [[30, 0.96], [16, 0.85]]) {
  p.fill({
    inside: onPlain(0), bounds: [-20, HORIZON + 18, W + 20, 830], width: (x, y) => Math.max(8, w * (0.4 + 0.6 * (1 - far(y)))), length: w * 9, spacing: 0.5, overlap: 0.55,
    angle: (x, y) => (nB(x / 200, y / 60) - 0.5) * 0.12, color: (x, y) => field(x + r.range(-20, 20), y), stroke: { brush: 'bristle', opacity: o, mix: 0.15, dry: 0.05 },
  });
}

// The river, winding toward us and widening.
const river = [[1330, 549, 0.12], [1180, 558, 0.16], [1010, 572, 0.22], [860, 590, 0.3], [740, 612, 0.4], [668, 640, 0.52], [690, 676, 0.66], [640, 712, 0.8], [520, 742, 0.92], [360, 774, 1], [250, 800, 1]];
p.stroke({ brush: 'bristle', color: '#8fc4e2', width: 54, mix: 0.1, dry: 0, rag: 0, cap: 'round', points: river });
p.stroke({ brush: 'bristle', color: '#b7dcf0', width: 34, opacity: 0.85, mix: 0.1, dry: 0, rag: 0, cap: 'round', points: river.map(([x, y, q]) => [x + 2, y - 1, q]) });
for (let k = 0; k < 16; k++) {                                        // light on the water
  const f = r.range(0.25, 0.97), i = Math.min(river.length - 2, Math.floor(f * (river.length - 1))), g = f * (river.length - 1) - i;
  const x = river[i][0] + (river[i + 1][0] - river[i][0]) * g, y = river[i][1] + (river[i + 1][1] - river[i][1]) * g, len = 14 + 40 * f;
  p.tryStroke({ color: '#f2fbff', width: 4, opacity: r.range(0.5, 0.9), points: [[x - len / 2, y + r.range(-4, 4) * f], [x + len / 2, y + r.range(-4, 4) * f]] });
}
p.stroke({ brush: 'bristle', color: '#6fa26a', width: 6, opacity: 0.7, mix: 0, dry: 0, points: river.slice(4).map(([x, y, q]) => [x - 27 * q - 3, y + 2]) });   // the near bank

// Groves and hedges: dabs of darker green, bluer far away.
for (let k = 0; k < 260; k++) {
  const y = HORIZON + 24 + Math.pow(r(), 1.6) * 240, x = r.range(0, W);
  if (y > hillTop(x) + 20 || nC(x / 120, y / 40) < 0.42) continue;
  const s = 0.5 + (1 - far(y)) * 1.1, w = 6 * s + 2, h = Math.max(12.5, 13 * s);
  p.tryStroke({ brush: 'bristle', color: mix(mix('#4f8f4c', '#3f7a3c', r()), '#7fa894', far(y) * 0.6), width: Math.max(4.5, w), taper: [0, 0.6], mix: 0, dry: 0, rag: 0.2, points: [[x, y], [x + r.range(-2, 2), y - h]] });
}

// A road from the castle hill down to the field of battle.
p.stroke({ brush: 'bristle', color: '#e6d9a8', width: 9, opacity: 0.85, mix: 0.2, dry: 0.1, points: [[470, 566], [520, 596], [500, 634], [440, 668], [470, 706], [600, 738]] });

// An army: ranks of soldiers, spears above them, banners on tall poles.
function army(x0, x1, y0, rows, facing, banner, dark) {
  const cols = Math.round((x1 - x0) / 15);
  for (let row = 0; row < rows; row++) {
    const y = y0 + row * 17, s = 1 + row * 0.12;
    for (let c = 0; c < cols; c++) {
      const x = x0 + (c + 0.5) * (x1 - x0) / cols + r.range(-3, 3) + row * 5 * facing, yy = y + r.range(-2, 2);
      p.line(x, yy, x + r.range(-1, 1), yy - 12.4 * s, { color: mix(dark, '#2a2a3a', r() * 0.5), width: 4.4 * s });
      if (r() < 0.45) p.line(x + 2 * facing, yy - 10, x + (5 + r.range(0, 4)) * facing, yy - r.range(26, 36) * s, { color: '#4a4038', width: 4, opacity: 0.75 });
    }
  }
  for (let c = 0; c < Math.round(cols / 2.4); c++) {
    const x = x0 + (c + r.range(0.2, 0.8)) * (x1 - x0) / Math.round(cols / 2.4), y = y0 + r.range(-4, (rows - 1) * 17), h = r.range(40, 52);
    p.line(x, y - 6, x, y - h, { color: '#3a332e', width: 4 });
    p.line(x + 5.5 * facing, y - h + 2, x + 5.5 * facing, y - h + 26, { brush: 'flat', color: mix(banner, '#ffffff', r() * 0.25), width: 8, rag: 0, cap: 'flat' });
  }
}
// dust under and between them
for (let k = 0; k < 10; k++) {
  const x = r.range(240, 900), y = r.range(650, 700), len = r.range(150, 300);
  p.stroke({ brush: 'soft', color: '#f1e6c4', width: r.range(30, 50), opacity: r.range(0.14, 0.26), points: wave(x, y, x + len, y + r.range(-8, 8), 5, 1, 7) });
}
army(250, 560, 652, 3, 1, '#f2c230', '#3d4a5e');     // Rance's army, under gold
army(650, 900, 632, 3, -1, '#c8362c', '#5a3a36');    // the enemy, under red

p.save();
