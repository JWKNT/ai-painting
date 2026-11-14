// The plain of Fittoa: wheat fields, in patches, with hedges between them, trees, and a
// river. All of it is dark under the cloud; the cold light of the column lies on it,
// brightest near the town, and each tree and each hedge throws a shade straight away from
// the light, toward us.
'use strict';
const { studio, open, W, H, HORIZON, COL, lit, nC, hash } = require('./scene');
const { mix, clamp, smooth, through, mass } = studio;

const p = open('land');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.14, dry: 0.03, rag: 0.2, cap: 'round' };
// A place of the plain: how far off it is (1 at our feet, great far off), and where it is across the plain.
const depth = (y) => 240 / (y - HORIZON + 14), across = (x, y) => (x - COL.x) * depth(y) / 60;
// The fields are patches, each sown with one thing: ripe wheat, stubble, green, or bare earth.
function field(x, y) {
  const d = depth(y), u = across(x, y), i = Math.floor(u / 2.4 + 0.4 * Math.sin(d * 1.3)), j = Math.floor(Math.log(d) * 3.2), h = hash(i, j);
  let c = h < 0.5 ? mix('#8c7430', '#b4983c', hash(j, i)) : h < 0.7 ? '#6c6038' : h < 0.88 ? mix('#3c5430', '#526c38', hash(i + 3, j)) : '#4c3c2c';
  c = mix(c, '#101410', 0.62);                                                                   // the dark of the day
  c = mix(c, '#c4e4fc', lit(x, y, 330) * 0.75);                                                  // the light of the column on it
  c = mix(c, '#f4fbff', Math.exp(-Math.pow((x - COL.x) / (60 + (y - HORIZON) * 1.5), 2)) * smooth(300, 0, y - HORIZON) * 0.55);   // and the path of that light, straight toward us
  return mix(c, '#08090a', smooth(760, 1000, y) * 0.5 + (nC(x / 60, y / 8) - 0.5) * 0.16);
}
const level = () => r.range(-0.03, 0.03);
p.fill({ bounds: [0, HORIZON, W, 680], width: 5.5, length: 50, spacing: 0.5, angle: level, color: field, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, 670, W, 800], width: 8, length: 90, spacing: 0.5, angle: level, color: field, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, 790, W, H], width: 12, length: 140, spacing: 0.5, angle: level, color: field, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, HORIZON, W, H], width: 5.5, length: 44, spacing: 1.0, overlap: 0.7, angle: level, color: (x, y) => field(x + r.range(-10, 10), y + r.range(-2, 2)), stroke: { ...line, opacity: 0.8 } });

// The river, which shows the light: it comes from the left, bends, and gets thin toward the town. Its near bank is a dark line.
{ const mid = through([[-20, 668], [120, 660], [260, 665], [400, 654], [520, 645], [620, 631], [700, 618]]);
  for (let x = -20; x < 690;) { const w = clamp((mid(x) - HORIZON) * 0.2, 5, 13), l = Math.max(w * 2.4, r.range(30, 60)), x1 = x + l, k = lit(x + l / 2, mid(x), 380);
    p.tryStroke({ ...line, rag: 0.35, color: '#0a0d10', width: Math.max(4.8, w * 0.5), opacity: 0.7, points: [[x, mid(x) + w * 0.6], [(x + x1) / 2, mid((x + x1) / 2) + w * 0.6], [x1, mid(x1) + w * 0.6]] });
    p.tryStroke({ ...line, rag: 0.35, color: mix('#34485c', '#cfe8f8', k), width: w, opacity: 0.9, points: [[x, mid(x)], [(x + x1) / 2, mid((x + x1) / 2)], [x1, mid(x1)]] });
    if (r() < 0.5) p.tryStroke({ brush: 'round', color: mix('#8cb0cc', '#ffffff', k), width: 4, opacity: 0.3 + 0.5 * k, taper: [0.5, 0.5], points: [[x + l * 0.3, mid(x + l * 0.3) - 1], [x + l * 0.3 + 13, mid(x + l * 0.3 + 13) - 1]] });
    x = x1 - 4; } }

// Hedges between the fields: long low dark lines that lie level, each with its shade on the side away from the light.
for (const [x0, y, len, tilt] of [[40, 640, 230, -0.03], [330, 700, 300, 0.02], [960, 650, 260, 0.03], [1220, 700, 300, -0.02], [1040, 760, 380, 0.01], [120, 770, 340, -0.01], [1380, 640, 200, 0.02], [520, 664, 120, -0.02]]) {
  const s = (y - HORIZON + 14) / 40, w = clamp(2.2 * s, 5, 11), dx = x0 + len / 2 - COL.x, away = dx > 0 ? 1 : -1;
  p.stroke({ brush: 'soft', color: '#04060a', width: Math.max(9, w * 1.6), opacity: 0.32, points: [[x0 + away * w, y + w * 0.8], [x0 + len / 2 + away * w * 2, y + len * tilt / 2 + w], [x0 + len + away * w, y + len * tilt + w * 0.8]] });
  for (let x = x0; x < x0 + len - 20;) { const l = r.range(26, 60), yy = y + (x - x0) * tilt; p.tryStroke({ ...line, rag: 0.5, color: mix('#060a08', '#121c14', r()), width: Math.max(4.8, w * r.range(0.8, 1.2)), points: [[x, yy + r.range(-1, 1)], [x + l / 2, yy - w * 0.2], [x + l, yy + r.range(-1, 1)]] }); if (r() < 0.6) p.tryStroke({ brush: 'round', color: mix('#4c6878', '#b4d8ec', lit(x, yy, 420)), width: 4, opacity: 0.4, taper: [0.4, 0.4], points: [[x + l * 0.2, yy - w * 0.55], [x + l * 0.2 + 13, yy - w * 0.6]] }); x += l - 6 + (r() < 0.2 ? r.range(20, 50) : 0); }
}

// Far off, the hedges are only thin dark lines that lie level, closer together toward the edge of the world.
for (let k = 0; k < 16; k++) { const y = HORIZON + 8 + Math.pow(r(), 1.4) * 50, x = r.range(-20, W - 80), len = r.range(60, 190); if (Math.abs(x + len / 2 - COL.x) < 110) continue; p.tryStroke({ ...line, rag: 0.4, color: mix('#07090b', '#141a18', r()), width: r.range(4.8, 5.6), opacity: 0.85, taper: [0.2, 0.2], points: [[x, y], [x + len / 2, y + r.range(-1, 1)], [x + len, y + r.range(-1.5, 1.5)]] }); }

// Trees on the plain, alone or two or three together, far ones first. Each is a head of leaves in round parts: dark, and lighter
// where it is turned to the column. Each has its shade, which lies straight away from the light.
const trees = [];
for (let k = 0; k < 60; k++) { const y = HORIZON + 52 + Math.pow(r(), 1.2) * 150, x = r.range(-20, W + 20); if (Math.abs(x - COL.x) < 90 + (y - HORIZON) * 0.7) continue; trees.push([x, y]); if (r() < 0.45) trees.push([x + r.range(18, 34) * (y - HORIZON) / 120, y + r.range(-3, 3)]); }
trees.sort((a, b) => a[1] - b[1]);
for (const [x, y] of trees) {
  const s = (y - HORIZON + 14) / 40, dx = x - COL.x, dy = (y - HORIZON + 30) * 2.2, l = Math.hypot(dx, dy), R = clamp(3.8 * s * r.range(0.8, 1.3), 8.5, 21), k = lit(x, y, 420);
  const toward = [-dx / l * 0.86, -0.5], cold = mix('#40586a', '#c4e4f6', k);                                                  // the way to the light, and the color of that light here
  p.tryStroke({ brush: 'soft', color: '#04060a', width: Math.max(8.4, R * 1.3), opacity: 0.36, taper: [0, 0.7], points: [[x, y], [x + dx / l * R * 2.6, y + dy / l * R * 1.3], [x + dx / l * R * 5.4, y + dy / l * R * 2.7]] });   // its shade
  const puffs = [[x - R * 0.7, y - R * 0.62, R * 0.72], [x + R * 0.66, y - R * 0.6, R * 0.68], [x + r.range(-0.2, 0.2) * R, y - R * 1.3, R * 0.8]]; if (r() < 0.5) puffs.push([x + R * r.range(-1.3, 1.3), y - R * 0.5, R * 0.5]);
  mass(p, puffs, { light: toward, tones: (t) => (t < 0.62 ? mix('#040705', '#0f1912', t / 0.62) : mix('#0f1912', cold, (t - 0.62) / 0.38 * 0.7)), base: y, bias: 0.34, contrast: 0.7, fall: 0.2, grain: 0.2, mix: 0.2, stroke: { rag: 0.4 }, flow: () => r.range(-0.5, 0.5), layers: [[Math.max(5, R * 0.42), Math.max(13, R * 0.9), 0.96, 1, 0.5], [5, 13, 0.8, 1, 0.9]] });
}

p.save();
