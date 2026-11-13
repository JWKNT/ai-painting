// Yuna, on the top of the column, in the middle of a turn of the dance. One arm holds her
// staff high over her head. The other is out from her side, and the long sleeves of her
// dress go out from her arms with the turn. Her skirt is long and dark blue and stands out
// round her. She has a yellow sash with a bow at the back, a white top, brown hair to her
// chin, and one long lock with beads on it. The last of the sun is behind her, so she is in
// shade, with the light along her edges and through the cloth of her sleeves.
'use strict';
const { studio, open, YUNA, glow } = require('./scene');
const { mix, clamp, smooth, solid, glint, arc, noise2 } = studio;

const p = open('yuna');
const r = p.rng;
const K = 1.2;                                                         // she is laid out 200 high and painted 240 high
const Y = (fx, fy, rad) => (rad == null ? [YUNA.x + fx * K, YUNA.y - fy * K] : [YUNA.x + fx * K, YUNA.y - fy * K, rad * K]);
const back = (x, y) => [(x - YUNA.x) / K, (YUNA.y - y) / K];           // from the picture to her own measure
const nF = noise2(307);
const o = { light: { at: [YUNA.x + 320, YUNA.y - 40] }, turn: 0.45, width: 5.5, length: 20, vary: 0.05, dash: 18, gap: 7, edgeOpacity: 0.9 };
const line = { brush: 'bristle', mix: 0.1, dry: 0, rag: 0.1, cap: 'round' };
const white = { shadow: '#6c6498', half: '#a498c0', lit: '#eadce2', rim: '#fff6dc', bounce: '#8474ac' };
const skin = { shadow: '#7c4c50', half: '#b47c6c', lit: '#eab894', rim: '#ffe6c0', bounce: '#8c5c6c' };
const hair = { shadow: '#241418', half: '#44261e', lit: '#84542e', rim: '#ffc880', bounce: '#342034' };
const gold = { shadow: '#80602c', half: '#bc923a', lit: '#ecc860', rim: '#fff0b0', bounce: '#8c7050' };
const boot = { shadow: '#18121c', half: '#2c2230', lit: '#5c4c58', rim: '#ffc890', bounce: '#241c30' };

// The light round her: the sky is brightest behind her.
p.stroke({ brush: 'soft', color: '#fff0c0', width: 150, opacity: 0.16, points: Y(0, 270).length ? [Y(0, 270), Y(0, 110), Y(0, -30)] : [] });

// A length of cloth that the turn carries out from her arm: narrow at the arm and wide at
// its end. It is thin, so the sky behind it shows through it; it is white at the arm and
// goes to rose and then to deep rose at its end, and there are folds along it.
function sleeve(pts, widths) {
  const seg = [];
  for (let i = 0; i < pts.length - 1; i++) seg.push([pts[i], pts[i + 1], widths[i], widths[i + 1]]);
  const total = seg.reduce((sum, [a, b]) => sum + Math.hypot(b[0] - a[0], b[1] - a[1]), 0);
  const at = (x, y) => {
    let best = null, run = 0;
    for (const [a, b, w0, w1] of seg) {
      const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy, t = clamp(((x - a[0]) * dx + (y - a[1]) * dy) / l2, 0, 1), px = a[0] + dx * t, py = a[1] + dy * t;
      const d = Math.hypot(x - px, y - py), w = w0 + (w1 - w0) * t, side = Math.sign(dx * (y - a[1]) - dy * (x - a[0]));
      if (!best || d - w < best.d - best.w) best = { d, w, along: (run + Math.sqrt(l2) * t) / total, across: side * d / w, ang: Math.atan2(dy, dx) };
      run += Math.sqrt(l2);
    }
    return best;
  };
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]), m = Math.max(...widths) + 4;
  const tone = (x, y) => {
    const q = at(x, y), fold = nF(q.across * 2.4 + 3, q.along * 1.3) - 0.5;
    let c = q.along < 0.5 ? mix('#fbf4f0', '#f6c0cc', smooth(0.25, 0.5, q.along)) : mix('#f6c0cc', '#c84880', smooth(0.5, 0.95, q.along));
    c = mix(c, '#74549c', clamp(0.22 + fold * 0.7, 0, 0.7));                                    // it is in shade, and its folds are darker
    c = mix(c, '#fff0c8', clamp(glow(x, y, 520) * 0.75 - 0.1, 0, 0.6) * (0.7 + fold));           // the light of the sky through it
    return mix(c, '#fff8e0', smooth(0.7, 1, Math.abs(q.across)) * 0.55);                         // and bright along its two edges
  };
  const inside = (x, y, k = 1) => { const q = at(x, y); return q.d < q.w * k; };
  p.fill({ inside: (x, y) => inside(x, y), bounds: [Math.min(...xs) - m, Math.min(...ys) - m, Math.max(...xs) + m, Math.max(...ys) + m], width: 8, length: 34, spacing: 0.5, angle: (x, y) => at(x, y).ang + r.range(-0.12, 0.12), color: tone, stroke: { brush: 'bristle', opacity: 0.95, mix: 0.2, dry: 0.03, rag: 0.2, cap: 'round' } });
  p.fill({ inside: (x, y) => inside(x, y, 0.85), bounds: [Math.min(...xs) - m, Math.min(...ys) - m, Math.max(...xs) + m, Math.max(...ys) + m], width: 5, length: 24, spacing: 1, overlap: 0.7, angle: (x, y) => at(x, y).ang + r.range(-0.2, 0.2), color: (x, y) => tone(x + r.range(-3, 3), y + r.range(-3, 3)), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.2, dry: 0.03, rag: 0.25, cap: 'round' } });
  // its open end: we see into it, and the inside of it is dark
  const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], l = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / l, ny = (b[0] - a[0]) / l, w = widths[widths.length - 1];
  p.tryStroke({ ...line, color: '#7c3460', width: 5.5, opacity: 0.45, taper: [0.3, 0.3], points: [[b[0] - nx * w * 0.7, b[1] - ny * w * 0.7], [b[0] + (b[0] - a[0]) / l * 5, b[1] + (b[1] - a[1]) / l * 5], [b[0] + nx * w * 0.7, b[1] + ny * w * 0.7]] });
}

// Her staff: a long rod, held high over her head, with a ring of gold at one end of it and two horns of gold on the ring.
p.stroke({ ...line, color: '#34283c', width: 5.6, points: [Y(-118, 206), Y(-12, 228), Y(90, 249)] });
glint(p, [Y(-116, 209), Y(-12, 231), Y(88, 252)], () => mix('#ffc070', '#fff0c0', r()), { width: 4, dash: 34, gap: 12, opacity: 0.8, rng: r });
{
  const [hx, hy] = Y(103, 252);
  p.stroke({ ...line, color: '#b88428', width: 5.4, points: arc(hx, hy, 15, 0.6, 6.5, 16) });
  p.stroke({ color: '#fff0b0', width: 4, opacity: 0.9, points: arc(hx, hy, 15, -2.2, 0.3, 8) });
  p.stroke({ ...line, color: '#d8a838', width: 5, taper: [0, 0.6], points: [[hx + 4, hy - 15], [hx + 14, hy - 28], [hx + 30, hy - 30]] });
  p.stroke({ ...line, color: '#d8a838', width: 5, taper: [0, 0.6], points: [[hx + 14, hy + 6], [hx + 28, hy + 4], [hx + 38, hy - 8]] });
  p.tryStroke({ color: '#c8d8ff', width: 4, opacity: 0.8, points: [[hx - 6, hy + 14], [hx - 9, hy + 30]] });                                   // a ribbon that hangs from it
}

// Her boots.
solid(p, [Y(-9, 13, 6), Y(-11, 3, 6.5)], boot, { ...o, length: 13 });
solid(p, [Y(9, 13, 6), Y(13, 3, 6.5)], boot, { ...o, length: 13 });

// Her skirt: a long bell of dark blue cloth. It hangs from her waist in deep folds, and the turn of the dance swings it out and lifts its hem at the two sides.
{
  const halfW = (fy) => 13 + 63 * Math.pow(clamp((116 - fy) / 96, 0, 1), 0.82), axis = (fy) => -5 * clamp((116 - fy) / 96, 0, 1);
  const hemAt = (fx) => 17 + 5 * Math.sin(fx / 9 + 1) + 13 * Math.pow(fx / 76, 2);
  const inside = (x, y) => { const [fx, fy] = back(x, y); return fy < 117 && fy > hemAt(fx) && Math.abs(fx - axis(fy)) < halfW(fy); };
  const fan = (x, y) => { const [fx, fy] = back(x, y); return Math.atan2(118 - fy, fx - axis(fy) * 2); };         // the folds go out from her waist
  const cloth = (x, y) => {
    const [fx, fy] = back(x, y), u = clamp((fx - axis(fy)) / halfW(fy), -1, 1), fold = Math.sin(Math.atan2(fx, 150 - fy) * 34 + 0.6) * 0.5 + (nF(fx / 30, fy / 50) - 0.5) * 0.5;
    let c = fold > 0 ? mix('#232a62', '#4658a0', clamp(fold * 1.4, 0, 1)) : mix('#232a62', '#0d0f30', clamp(-fold * 1.6, 0, 1));
    c = mix(c, '#7c8cd8', smooth(0.45, 1, u) * 0.35);                                           // the side of it that is toward the light
    return mix(c, '#ffb878', smooth(0.9, 1, Math.abs(u)) * 0.5 + smooth(8, 0, fy - hemAt(fx)) * 0.35);   // the fire of the sky at its edges and along its hem
  };
  const box = [...Y(-84, 120), ...Y(84, 8)];
  p.fill({ inside, bounds: box, width: 8.5, length: 44, spacing: 0.5, angle: (x, y) => fan(x, y) + r.range(-0.05, 0.05), color: cloth, stroke: { brush: 'bristle', opacity: 0.96, mix: 0.15, dry: 0.03, rag: 0.15, cap: 'round' } });
  p.fill({ inside, bounds: box, width: 5, length: 30, spacing: 1, overlap: 0.7, angle: (x, y) => fan(x, y) + r.range(-0.08, 0.08), color: (x, y) => cloth(x + r.range(-2, 2), y), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.15, dry: 0.03, rag: 0.2, cap: 'round' } });
  // the flowers that are worked on it, low on one side: pale, in two sprays
  for (const [fx, fy, a] of [[34, 44, 0.3], [44, 38, -0.4], [26, 36, 0.9], [40, 50, 1.3], [52, 46, 0.1], [-40, 40, 0.5], [-48, 34, -0.3], [-34, 32, 1.1]]) p.tryStroke({ ...line, color: mix('#c890c0', '#f4d4e4', r()), width: 5.4, opacity: 0.7, points: [Y(fx - Math.cos(a) * 6, fy - Math.sin(a) * 6), Y(fx + Math.cos(a) * 6, fy + Math.sin(a) * 6)] });
}

// Her sash and the bow of it at her back; her body; her neck.
p.stroke({ ...line, cap: 'flat', color: '#b88e38', width: 13 * K, points: [Y(-15, 121), Y(0, 122), Y(15, 123)] });
p.tryStroke({ color: '#fff0b0', width: 4, opacity: 0.8, points: [Y(3, 127), Y(15, 128)] });
solid(p, [Y(-17, 124, 7.5), Y(-33, 133, 6)], gold, { ...o, length: 13 });
solid(p, [Y(-17, 121, 7), Y(-34, 111, 5.5)], gold, { ...o, length: 13 });
p.stroke({ ...line, color: '#a08a38', width: 6, taper: [0, 0.5], points: [Y(-21, 118), Y(-31, 100), Y(-44, 84)] });
solid(p, [Y(0, 129, 12.5), Y(1, 148, 13.5)], white, o);

// The arm that is out from her side, bare to the elbow, and its sleeve.
solid(p, [Y(13, 156, 5.5), Y(27, 152, 5), Y(41, 150, 4.8)], skin, { ...o, length: 14 });
sleeve([Y(40, 150), Y(68, 143), Y(94, 124), Y(112, 96), Y(118, 64)], [7, 12, 17, 20, 22].map((w) => w * K));
p.stroke({ ...line, color: '#eab894', width: 5.5, points: [Y(66, 150), Y(78, 154)] });                              // her hand
// The arm that holds the staff, and its sleeve, which the turn carries out behind her.
solid(p, [Y(-13, 157, 5.5), Y(-30, 181, 5)], skin, { ...o, length: 14 });
sleeve([Y(-33, 190), Y(-50, 180), Y(-76, 160), Y(-106, 148), Y(-134, 152)], [9, 13, 17, 20, 22].map((w) => w * K));
solid(p, [Y(-31, 184, 7), Y(-39, 210, 7.5)], white, { ...o, length: 16 });                                          // the sleeve on her forearm
p.stroke({ ...line, color: '#eab894', width: 5.5, points: [Y(-40, 214), Y(-41, 226)] });

// Her head: brown hair to her chin; her face, which looks up and away to the right; the long lock with its beads, which the turn carries out.
solid(p, [Y(2, 168, 5.5), Y(4, 176, 5.5)], skin, { ...o, edge: false, length: 13 });                                // her neck, up to her jaw
solid(p, [Y(-3, 186, 15.5), Y(-5, 181, 14.5)], hair, { ...o, length: 16 });                                         // her hair: the back and the top of her head
solid(p, [Y(-15, 180, 7), Y(-19, 170, 6)], hair, { ...o, edge: false, length: 13 });                                // and where it comes down behind her ear
solid(p, [Y(6, 183, 10), Y(9, 177, 8.5)], skin, { ...o, length: 13 });                                              // her face
p.stroke({ ...line, color: '#eab894', width: 5, points: [Y(12, 185), Y(20, 177)] });                                 // her nose and her lip, forward of it
p.stroke({ ...line, color: '#3c2018', width: 8, points: [Y(-10, 196), Y(3, 197), Y(15, 191)] });                     // the hair over her brow
p.stroke({ ...line, color: '#3c2018', width: 5.5, taper: [0, 0.5], points: [Y(13, 192), Y(17, 186), Y(17, 178)] });  // and a lock of it down her cheek
p.stroke({ ...line, color: '#4c2c20', width: 4.8, taper: [0, 0.4], points: [Y(12, 176), Y(24, 154), Y(42, 136)] }); // the long lock
for (const [fx, fy] of [[22, 158], [34, 143]]) p.tryStroke({ color: '#6c9cf0', width: 4.4, points: [Y(fx, fy), Y(fx + 8, fy - 9)] });
glint(p, arc(...Y(-3, 186), 15 * K, -2.3, -0.5, 8), () => mix('#ffc880', '#fff0c0', r()), { width: 4.2, dash: 14, gap: 6, opacity: 0.8, rng: r });   // the light on the top of her hair

p.save();
