// The plain: dim fields going off into the mist, a river that holds the sky, groves and a
// road, and two armies waiting under their banners with the first light on their spears.
'use strict';
const { studio, open, W, SUN, HORIZON, hillTop, glow, nA, nB, nC } = require('./scene');
const { mix, wave, clamp, smooth, ramp } = studio;

const p = open('plain');
const r = p.rng;
const far = (y) => clamp(1 - (y - HORIZON) / 250, 0, 1);            // 1 at the horizon, 0 near us
const under = (x) => Math.exp(-Math.pow((x - SUN.x) / 250, 2));     // 1 on the ground straight below the sun

// Fields: long level bands, grey-green in the half light, warmer and paler under the sun.
const fields = ['#5f6c62', '#566a58', '#74796a', '#4e6456', '#687262', '#7e8270'];
const field = (x, y) => {
  const band = nA(x / 320 + 7, (y - HORIZON) / (14 + (y - HORIZON) * 0.16));
  let c = ramp(fields, clamp(band * 1.25 - 0.12, 0, 1));
  c = mix(c, mix('#a494ae', '#f6cda0', clamp(glow(x, y, 480) * 1.3, 0, 1)), far(y) * 0.8);
  return mix(c, '#f0c48c', under(x) * (0.16 + 0.36 * far(y)));
};
const onPlain = (m) => (x, y) => y > HORIZON + 18 + m && y < hillTop(x) + 30;
for (const [w, o] of [[30, 0.96], [16, 0.85]]) {
  p.fill({
    inside: onPlain(0), bounds: [-20, HORIZON + 18, W + 20, 830], width: (x, y) => Math.max(8, w * (0.4 + 0.6 * (1 - far(y)))), length: w * 9, spacing: 0.5, overlap: 0.55,
    angle: (x, y) => (nB(x / 200, y / 60) - 0.5) * 0.12, color: (x, y) => field(x + r.range(-20, 20), y), stroke: { brush: 'bristle', opacity: o, mix: 0.15, dry: 0.05 },
  });
}

// The river, winding toward us and widening. It holds the low sky: pale gold below the sun,
// rose further off, and it is the brightest thing on the ground.
const river = [[1330, 549, 0.1], [1180, 558, 0.13], [1010, 572, 0.18], [860, 590, 0.25], [740, 612, 0.34], [668, 640, 0.46], [690, 676, 0.6], [640, 712, 0.74], [520, 742, 0.88], [360, 774, 1], [230, 804, 1], [90, 846, 1]];
const water = (x, y) => mix(mix('#d8a8b8', '#f4c4a8', far(y)), '#fff0c4', clamp(under(x) * 1.3, 0, 1) * (0.45 + 0.55 * far(y)));
p.stroke({ brush: 'bristle', color: '#c49cb4', width: 50, mix: 0.1, dry: 0, rag: 0.1, cap: 'round', points: river });
for (let i = 0; i + 3 < river.length; i++) {
  const seg = river.slice(i, i + 4), [mx, my] = seg[1];
  p.tryStroke({ brush: 'bristle', color: water(mx, my), width: 44, mix: 0.3, dry: 0.05, rag: 0.2, streak: 0.4, cap: 'round', points: seg });
  p.tryStroke({ brush: 'bristle', color: mix(water(seg[2][0], seg[2][1]), '#fff6e0', 0.45), width: 24, opacity: 0.85, mix: 0.3, dry: 0.05, rag: 0.2, cap: 'round', points: seg.map(([x, y, q]) => [x + 2, y - 1.5, q]) });
}
const onRiver = (f) => { const i = Math.min(river.length - 2, Math.floor(f * (river.length - 1))), g = f * (river.length - 1) - i; return [river[i][0] + (river[i + 1][0] - river[i][0]) * g, river[i][1] + (river[i + 1][1] - river[i][1]) * g, river[i][2] + (river[i + 1][2] - river[i][2]) * g]; };
for (let k = 0; k < 34; k++) {                                        // light on the water, thickest under the sun
  const [x, y, q] = onRiver(k < 14 ? r.range(0.16, 0.36) : r.range(0.2, 0.97)), len = 13 + 34 * q;
  p.tryStroke({ color: mix('#ffe9d0', '#fffdf0', under(x)), width: 4, opacity: r.range(0.45, 0.8) + 0.2 * under(x), points: [[x - len / 2, y + r.range(-10, 10) * q], [x + len / 2, y + r.range(-10, 10) * q]] });
}
for (let k = 0; k < 40; k++) {                                        // reeds and shadow along the near bank
  const [x, y, q] = onRiver(r.range(0.74, 0.98)), h = r.range(12.5, 20) * (0.6 + 0.5 * q);
  p.tryStroke({ brush: 'bristle', color: mix('#26342f', '#3a4638', r()), width: r.range(4.5, 7), opacity: 0.85, taper: [0, 0.8], mix: 0.1, dry: 0, rag: 0.2, points: [[x + r.range(-8, 8), y + 24 * q + 4], [x + r.range(-10, 10), y + 24 * q + 4 - h]] });
}

// Groves and hedges: dark dabs, upright close by, low smudges far off in the mist.
for (let k = 0; k < 260; k++) {
  const y = HORIZON + 24 + Math.pow(r(), 1.6) * 240, x = r.range(0, W);
  if (y > hillTop(x) + 20 || nC(x / 120, y / 40) < 0.42) continue;
  const s = 0.5 + (1 - far(y)) * 1.1, w = 6 * s + 2, h = Math.max(12.5, 13 * s), color = mix(mix(mix('#2c3e38', '#384a40', r()), '#84809a', far(y) * 0.7), '#e8b890', clamp(glow(x, y, 300), 0, 0.5));
  if (far(y) > 0.6) p.tryStroke({ brush: 'bristle', color, width: Math.max(4.5, w * 0.8), opacity: 0.7, taper: [0.4, 0.4], mix: 0.2, dry: 0, rag: 0.3, points: [[x - r.range(8, 16), y], [x, y - 1.5], [x + r.range(8, 16), y]] });
  else p.tryStroke({ brush: 'bristle', color, width: Math.max(4.5, w), taper: [0, 0.6], mix: 0.1, dry: 0, rag: 0.2, points: [[x, y], [x + r.range(-2, 2), y - h]] });
}

// A road from the castle hill down to the field of battle.
p.stroke({ brush: 'bristle', color: '#a89c94', width: 9, opacity: 0.6, mix: 0.3, dry: 0.1, points: [[470, 566], [520, 596], [500, 634], [440, 668], [470, 706], [600, 738]] });

// Dust and mist round the armies, lit from beyond.
for (let k = 0; k < 14; k++) {
  const x = r.range(180, 860), y = r.range(626, 700), len = r.range(150, 300);
  p.stroke({ brush: 'soft', color: mix('#c8b0b8', '#ffd9a8', clamp(under(x + len / 2) * 1.2 + r() * 0.3, 0, 1)), width: r.range(30, 50), opacity: r.range(0.14, 0.26), points: wave(x, y, x + len, y + r.range(-8, 8), 5, 1, 7) });
}

// Mist lying on the far fields.
for (let k = 0; k < 16; k++) {
  const x = r.range(-100, W - 200), y = r.range(HORIZON + 14, HORIZON + 86), len = r.range(260, 560);
  p.stroke({ brush: 'soft', color: mix(mix('#b0a0c0', '#d0b0b8', r()), '#ffdcae', clamp(glow(x + len / 2, y, 440) * 1.4, 0, 1)), width: r.range(26, 48), opacity: r.range(0.12, 0.24), points: wave(x, y, x + len, y + r.range(-5, 5), 4, 1, 7) });
}

// An army: rank behind rank of dark strokes that run together into a crowd, spears above it,
// banners on tall poles. The sun is beyond them, so each man is a dark mark, and here and
// there one has light on him. Far off, an army is only bars of shadow with points of color.
function army(cx, cy, hw, hh, banner, scale = 1) {
  const ranks = Math.max(3, Math.round(hh * 2 / (9 * scale)));
  for (let k = 0; k < ranks; k++) {
    const t = k / (ranks - 1), y = cy + (t - 0.5) * 2 * hh, half = hw * (0.75 + 0.25 * Math.sin(Math.PI * t)) * r.range(0.9, 1.05), off = r.range(-0.08, 0.08) * hw;
    for (let x = cx + off - half; x < cx + off + half; x += r.range(50, 110)) {       // each rank in broken lengths
      const len = Math.min(cx + off + half - x, r.range(46, 100));
      if (len > 30) p.stroke({ brush: 'bristle', color: mix('#232336', '#3a3448', r()), width: (7 + 4 * t) * scale + 2, opacity: 0.75, mix: 0.2, dry: 0.15, rag: 0.5, taper: [0.3, 0.3], points: wave(x, y + r.range(-2, 2), x + len, y + r.range(-2, 2), 2, 1, 5) });
    }
  }
  const men = [];
  for (let k = 0; k < hw * hh / 26 / scale; k++) { const a = r() * 6.283, d = Math.pow(r(), 0.6); men.push([cx + Math.cos(a) * d * hw, cy + Math.sin(a) * d * hh]); }
  men.sort((a, b) => a[1] - b[1]);
  for (const [x, y] of men) {
    const h = 12.4 * r.range(1, 1.12);
    if (scale >= 1 || r() < 0.6) p.line(x, y + 3, x + r.range(-1, 1), y + 3 - h, { color: mix('#1a1a28', '#302c40', r()), width: 4.4, opacity: scale >= 1 ? 1 : 0.7 });
    if (r() < 0.16) p.tryStroke({ color: mix('#e88c58', '#ffcc90', r()), width: 4, opacity: r.range(0.25, 0.5) * Math.min(1, scale + 0.2), points: [[x + 2.4, y + 2], [x + 2.6, y - 10.6]] });   // light on a helmet or a shoulder
    if (r() < 0.3) p.line(x + 2, y - 6, x + r.range(2, 7), y - 6 - r.range(16, 24), { color: '#2c2834', width: 4, opacity: 0.5 * Math.min(1, scale + 0.2) });                                 // a spear
  }
  for (let k = 0; k < Math.round(hw / (scale >= 1 ? 30 : 20)); k++) {
    const x = cx + r.range(-0.9, 0.9) * hw, y = cy + r.range(-0.7, 0.5) * hh, h = r.range(36, 50) * Math.min(1, scale + 0.15), fl = Math.max(13, 24 * scale);
    p.line(x, y - 2, x, y - h, { color: '#2a2630', width: 4, opacity: 0.8 });
    p.line(x + 5, y - h + 1, x + 5, y - h + 1 + fl, { brush: 'bristle', color: mix(banner, '#30283c', scale >= 1 ? r.range(0.35, 0.6) : r.range(0.05, 0.25)), width: scale >= 1 ? 7 : 6, mix: 0.1, dry: 0, rag: 0.2, cap: 'flat' });
    p.tryStroke({ color: mix(banner, '#ffe6b0', 0.4), width: 4, opacity: 0.7, points: [[x + 7.2, y - h + 2], [x + 7.4, y - h + Math.max(14.6, fl)]] });                                       // the edge the sun comes through
  }
}
army(566, 614, 136, 10, '#d83a2c', 0.7);      // the enemy, far off across the field, under red
army(392, 676, 196, 24, '#e8b830');          // Rance's army, nearer, under gold

p.save();
