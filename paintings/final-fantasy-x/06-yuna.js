// Yuna, on the top of the column, in the middle of a turn of the dance. We see her from the
// side. One arm holds her staff high over her head; the other is out from her side, and the
// long sleeves, which are tied to her arms above the elbow and leave her shoulders bare, go
// out with the turn. They are white at the arm and go to rose and deep rose at their ends.
// Her skirt is long and dark blue, in folds, with white flowers worked on it; it stands out
// round her. She has a wide yellow sash with a great bow at the back, a white top, brown
// hair to her chin, and a long string of blue beads at her ear. Her face is turned up.
// The last of the sun is behind her: she is in shade, with its fire along her edges.
'use strict';
const { studio, open, YUNA, glow } = require('./scene');
const { mix, clamp, smooth, solid, shape, glint, arc, noise2 } = studio;

const p = open('yuna');
const r = p.rng;
const K = 1.6;                                                         // she is laid out 200 high and painted 320 high
const Y = (fx, fy, rad) => (rad == null ? [YUNA.x + fx * K, YUNA.y - fy * K] : [YUNA.x + fx * K, YUNA.y - fy * K, rad * K]);
const poly = (pts) => pts.map(([x, y]) => Y(x, y));
const back = (x, y) => [(x - YUNA.x) / K, (YUNA.y - y) / K];
const nF = noise2(307);
const SUNSIDE = { at: [YUNA.x + 340, YUNA.y - 40] };
const o = { light: SUNSIDE, turn: 0.42, width: 5.5, length: 18, vary: 0.05, dash: 18, gap: 7, edgeOpacity: 0.9 };
const line = { brush: 'bristle', mix: 0.1, dry: 0, rag: 0.1, cap: 'round' };
const white = { shadow: '#665e94', half: '#a094bc', lit: '#eadce2', rim: '#fff6dc', bounce: '#8474ac' };
const skin = { shadow: '#7a4a50', half: '#b47c6c', lit: '#ecbc98', rim: '#ffe8c4', bounce: '#8c5c6c' };
const hair = { shadow: '#221216', half: '#42241c', lit: '#84522c', rim: '#ffc880', bounce: '#342034' };
const gold = { shadow: '#7c5c2a', half: '#bc923a', lit: '#f0cc64', rim: '#fff2b4', bounce: '#8c7050' };
const boot = { shadow: '#15101a', half: '#2a202e', lit: '#5c4c58', rim: '#ffc890', bounce: '#241c30' };

// The light round her: the sky is brightest behind her.
p.stroke({ brush: 'soft', color: '#fff0c0', width: 170, opacity: 0.16, points: [Y(0, 250), Y(0, 110), Y(0, -30)] });

// A length of thin cloth that the turn carries out from her arm: narrow at the arm and wide
// at its end. The sky shows through it. It is white at the arm, then rose, then deep rose,
// with a band of pale marks before its end, and there are folds along it.
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
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]), m = Math.max(...widths) + 4, box = [Math.min(...xs) - m, Math.min(...ys) - m, Math.max(...xs) + m, Math.max(...ys) + m];
  const tone = (x, y) => {
    const q = at(x, y), fold = nF(q.across * 2.6 + 3, q.along * 1.5) - 0.5;
    let c = q.along < 0.5 ? mix('#fbf4f0', '#f6c0cc', smooth(0.25, 0.5, q.along)) : mix('#f6c0cc', '#c84880', smooth(0.5, 0.95, q.along));
    c = mix(c, '#74549c', clamp(0.22 + fold * 0.8, 0, 0.72));                                   // it is in shade, and its folds are darker
    c = mix(c, '#fff0c8', clamp(glow(x, y, 520) * 0.75 - 0.1, 0, 0.6) * (0.7 + fold));           // the light of the sky through it
    return mix(c, '#fff8e0', smooth(0.72, 1, Math.abs(q.across)) * 0.6);                         // and bright along its two edges
  };
  const inside = (x, y, k = 1) => { const q = at(x, y); return q.d < q.w * k; };
  const stroke = { brush: 'bristle', mix: 0.2, dry: 0.03, rag: 0.2, cap: 'round' };
  p.fill({ inside: (x, y) => inside(x, y), bounds: box, width: 8, length: 34, spacing: 0.5, angle: (x, y) => at(x, y).ang + r.range(-0.12, 0.12), color: tone, stroke: { ...stroke, opacity: 0.95 } });
  p.fill({ inside: (x, y) => inside(x, y, 0.86), bounds: box, width: 5, length: 22, spacing: 0.9, overlap: 0.7, angle: (x, y) => at(x, y).ang + r.range(-0.2, 0.2), color: (x, y) => tone(x + r.range(-3, 3), y + r.range(-3, 3)), stroke: { ...stroke, opacity: 0.85 } });
  // the marks that are worked on it near its end, and the dark of its open end
  const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], l = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / l, uy = (b[1] - a[1]) / l, w = widths[widths.length - 1];
  for (let k = -2; k <= 2; k++) { const cx = b[0] - ux * l * 0.5 - uy * w * 0.34 * k, cy = b[1] - uy * l * 0.5 + ux * w * 0.34 * k; p.tryStroke({ ...line, color: '#ffe6ec', width: 4.8, opacity: 0.7, points: [[cx - ux * 6.4, cy - uy * 6.4], [cx + ux * 6.4, cy + uy * 6.4]] }); }
  p.tryStroke({ ...line, color: '#7c3460', width: 6, opacity: 0.5, taper: [0.3, 0.3], points: [[b[0] + uy * w * 0.7, b[1] - ux * w * 0.7], [b[0] + ux * 5, b[1] + uy * 5], [b[0] - uy * w * 0.7, b[1] + ux * w * 0.7]] });
  // the band that ties it to her arm
  const [h0, h1] = [pts[0], pts[1]], hl = Math.hypot(h1[0] - h0[0], h1[1] - h0[1]), hx = (h1[0] - h0[0]) / hl, hy = (h1[1] - h0[1]) / hl, hw = widths[0];
  p.tryStroke({ ...line, cap: 'flat', color: '#d0a43c', width: 6.5, points: [[h0[0] + hy * hw, h0[1] - hx * hw], [h0[0] - hy * hw, h0[1] + hx * hw]] });
}

// Her staff: a long rod, held high, with a ring of gold at one end of it, horns of gold on the ring, and ribbons that hang from it.
p.stroke({ ...line, color: '#34283c', width: 6.5, points: [Y(-112, 208), Y(-12, 229), Y(86, 250)] });
glint(p, [Y(-110, 211), Y(-12, 232), Y(84, 253)], () => mix('#ffc070', '#fff0c0', r()), { width: 4, dash: 40, gap: 12, opacity: 0.8, rng: r });
for (const t of [0.25, 0.75]) p.tryStroke({ ...line, cap: 'flat', color: '#c89a38', width: 9, points: [Y(-112 + 198 * t - 3, 208 + 42 * t - 1), Y(-112 + 198 * t + 3, 208 + 42 * t + 1)].map(([x, y], i) => [x + (i ? 3 : -3), y]) });   // bands of gold on the rod
{
  const [hx, hy] = Y(102, 254), R = 16 * K;
  p.stroke({ ...line, color: '#b08228', width: 7, points: arc(hx, hy, R, 0.5, 6.6, 18) });
  p.stroke({ color: '#fff0b0', width: 4.2, opacity: 0.9, points: arc(hx, hy, R, -2.3, 0.3, 9) });
  for (const [a0, len, bend] of [[-1.1, 34, 0.5], [-0.3, 40, -0.4], [0.5, 30, 0.6], [-1.9, 26, -0.5]]) {
    const x0 = hx + Math.cos(a0) * R, y0 = hy + Math.sin(a0) * R;
    p.stroke({ ...line, color: '#d8a838', width: 6.5, taper: [0, 0.75], points: [[x0, y0], [x0 + Math.cos(a0) * len * 0.5, y0 + Math.sin(a0) * len * 0.5], [x0 + Math.cos(a0 + bend) * len, y0 + Math.sin(a0 + bend) * len]] });
    p.tryStroke({ color: '#fff0b0', width: 4, opacity: 0.8, taper: [0, 0.7], points: [[x0 + 2, y0 - 2], [x0 + Math.cos(a0 + bend) * len * 0.8 + 2, y0 + Math.sin(a0 + bend) * len * 0.8 - 2]] });
  }
  p.tryStroke({ ...line, color: '#6c9cf0', width: 5.5, points: [[hx - 4, hy - 5], [hx + 5, hy + 6]].map(([x, y], i) => [x + (i ? 2 : -2), y + (i ? 2 : -2)]) });   // the blue stone in it
  for (const [dx, len, c] of [[-8, 56, '#c8d8ff'], [-2, 44, '#ffd0e0']]) p.tryStroke({ ...line, color: c, width: 5, opacity: 0.85, taper: [0, 0.6], points: [[hx + dx, hy + R], [hx + dx - 10, hy + R + len * 0.5], [hx + dx - 28, hy + R + len]] });   // its ribbons
}

// The sleeve of the arm that holds the staff: the turn carries it out behind her.
sleeve(poly([[-33, 190], [-52, 180], [-78, 160], [-108, 148], [-136, 152]]), [9, 13, 17, 20, 22].map((w) => w * K));

// Her boots: black, to the calf, with laces down the front.
for (const [x0, x1] of [[-10, -13], [9, 14]]) {
  shape(p, poly([[x0 - 6, 30], [x0 + 6, 30], [x1 + 7, 10], [x1 + 13, 3], [x1 + 12, -2], [x1 - 8, -2], [x1 - 7, 12]]), boot, { ...o, round: 7, length: 14 });
  for (const fy of [24, 17, 10]) p.tryStroke({ color: '#8c7c84', width: 4, opacity: 0.7, points: [Y(x0 + (x1 - x0) * (30 - fy) / 30 - 1, fy), Y(x0 + (x1 - x0) * (30 - fy) / 30 + 7, fy + 2)] });
}

// Her skirt: a long bell of dark blue cloth. It hangs from her waist in deep folds, and the turn swings it out and lifts its hem at the two sides.
{
  const halfW = (fy) => 13 + 63 * Math.pow(clamp((116 - fy) / 96, 0, 1), 0.82), axis = (fy) => -5 * clamp((116 - fy) / 96, 0, 1);
  const hemAt = (fx) => 17 + 5 * Math.sin(fx / 9 + 1) + 13 * Math.pow(fx / 76, 2);
  const inside = (x, y) => { const [fx, fy] = back(x, y); return fy < 117 && fy > hemAt(fx) && Math.abs(fx - axis(fy)) < halfW(fy); };
  const fan = (x, y) => { const [fx, fy] = back(x, y); return Math.atan2(118 - fy, fx - axis(fy) * 2); };
  const cloth = (x, y) => {
    const [fx, fy] = back(x, y), u = clamp((fx - axis(fy)) / halfW(fy), -1, 1), fold = Math.sin(Math.atan2(fx, 150 - fy) * 34 + 0.6) * 0.5 + (nF(fx / 30, fy / 50) - 0.5) * 0.5;
    let c = fold > 0 ? mix('#232a62', '#4658a0', clamp(fold * 1.4, 0, 1)) : mix('#232a62', '#0d0f30', clamp(-fold * 1.6, 0, 1));
    c = mix(c, '#7c8cd8', smooth(0.45, 1, u) * 0.35);
    return mix(c, '#ffb878', smooth(0.9, 1, Math.abs(u)) * 0.5 + smooth(8, 0, fy - hemAt(fx)) * 0.35);
  };
  const box = [...Y(-84, 120), ...Y(84, 8)];
  p.fill({ inside, bounds: box, width: 9, length: 46, spacing: 0.5, angle: (x, y) => fan(x, y) + r.range(-0.05, 0.05), color: cloth, stroke: { brush: 'bristle', opacity: 0.96, mix: 0.15, dry: 0.03, rag: 0.15, cap: 'round' } });
  p.fill({ inside, bounds: box, width: 5.5, length: 30, spacing: 0.9, overlap: 0.7, angle: (x, y) => fan(x, y) + r.range(-0.08, 0.08), color: (x, y) => cloth(x + r.range(-2, 2), y), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.15, dry: 0.03, rag: 0.2, cap: 'round' } });
  // The flowers that are worked on it: white, large, low on the side toward us. Each is three petals that open like a fan from one place, with a touch of rose where they meet.
  for (const [fx, fy, s, lean] of [[36, 44, 1, 0.3], [53, 36, 0.8, 0.6], [22, 32, 0.85, -0.1], [46, 62, 0.75, 0.4], [-38, 36, 0.9, -0.4], [-52, 50, 0.75, -0.7], [4, 26, 0.7, 0], [30, 58, 0.6, 0.2], [-24, 30, 0.65, -0.2]]) {
    const [cx, cy] = Y(fx, fy), len = 15 * s + 3;
    for (const da of [-0.62, 0, 0.62]) { const a = -Math.PI / 2 + lean + da; p.tryStroke({ ...line, color: mix('#c0aed6', '#fbeef6', r()), width: Math.max(4.8, 7 * s), opacity: 0.82, taper: [0.55, 0.1], points: [[cx, cy], [cx + Math.cos(a) * len, cy + Math.sin(a) * len]] }); }
    p.tryStroke({ ...line, color: '#e87ca0', width: 4.8, opacity: 0.9, points: [[cx - 2, cy + 2], [cx + Math.sin(lean) * 12.4 - 2, cy - Math.cos(lean) * 12.4 + 2]] });
  }
}

// Her sash: wide, yellow, with a red cord round the middle of it; and the great bow of it at her back, with two loops and two long ends that fly.
p.stroke({ ...line, cap: 'flat', color: '#b88e38', width: 14 * K, points: [Y(-15, 121), Y(0, 122), Y(15, 123)] });
p.stroke({ ...line, cap: 'flat', color: '#e4bc54', width: 6 * K, points: [Y(0, 126), Y(8, 126.5), Y(15, 127)] });
p.tryStroke({ color: '#b83840', width: 4.4, points: [Y(-15, 121.5), Y(0, 122.5), Y(15, 123.5)] });
shape(p, poly([[-14, 128], [-30, 142], [-42, 138], [-40, 124], [-24, 120]]), gold, { ...o, round: 7, length: 14 });
shape(p, poly([[-14, 120], [-32, 122], [-44, 112], [-36, 102], [-20, 110]]), gold, { ...o, round: 7, length: 14 });
shape(p, poly([[-18, 116], [-34, 96], [-52, 76], [-62, 72], [-58, 84], [-42, 104], [-26, 120]]), gold, { ...o, round: 6, length: 18 });
shape(p, poly([[-14, 112], [-22, 88], [-30, 64], [-38, 58], [-36, 72], [-28, 96], [-20, 114]]), gold, { ...o, round: 6, length: 18 });
for (const [fx, fy] of [[-32, 132], [-34, 112], [-46, 86], [-30, 78]]) p.tryStroke({ color: '#b83840', width: 4.4, opacity: 0.8, points: [Y(fx - 4, fy), Y(fx + 4, fy + 1)] });   // the red marks on it

// Her body: the white top, which is wound round her, and above it her bare back and shoulder.
shape(p, poly([[-13, 128], [13, 128], [15, 146], [12, 156], [-2, 158], [-13, 150]]), white, { ...o, round: 12, length: 16 });
for (const fy of [134, 141, 148]) p.tryStroke({ color: '#665e94', width: 4, opacity: 0.5, points: [Y(-11, fy + 2), Y(12, fy - 1)] });   // the folds where it is wound
shape(p, poly([[-13, 150], [-2, 158], [12, 156], [15, 162], [9, 168], [-4, 168], [-12, 162]]), skin, { ...o, round: 9, length: 14 });
p.tryStroke({ ...line, color: '#eadce2', width: 5, points: [Y(8, 156), Y(4, 170)] });                                   // the strap of it, up to her neck
solid(p, [Y(1, 166, 5.2), Y(3, 176, 5)], skin, { ...o, edge: false, length: 13 });                                      // her neck

// The arm that is out from her side: bare from the shoulder, then the sleeve.
solid(p, [Y(11, 160, 5.6), Y(26, 154, 5), Y(41, 151, 4.6)], skin, { ...o, length: 14 });
sleeve(poly([[38, 151], [66, 144], [94, 125], [112, 97], [118, 62]]), [7, 12, 17, 20, 22].map((w) => w * K));
shape(p, poly([[62, 155], [70, 158], [80, 159], [84, 156], [78, 152], [66, 150]]), skin, { ...o, round: 4, length: 13, edge: false });   // her hand, open
// The arm that holds the staff: bare from the shoulder, then the sleeve on her forearm; her hand is shut on the rod.
solid(p, [Y(-11, 161, 5.6), Y(-22, 176, 5), Y(-31, 190, 4.8)], skin, { ...o, length: 14 });
solid(p, [Y(-31, 188, 7.5), Y(-39, 212, 8)], white, { ...o, length: 16 });
shape(p, poly([[-44, 214], [-36, 216], [-35, 228], [-43, 230], [-47, 222]]), skin, { ...o, round: 4, length: 13, edge: false });

// Her head, from the side. Her face is turned up and away to the right: brow, nose, lips and chin. Her hair is cut to her chin, round, and the turn lifts the ends of it at her neck.
const face = { shadow: '#9a6660', half: '#d0a088', lit: '#f8d2b0', rim: '#fff2d8', bounce: '#a87870' };
shape(p, poly([[3, 198], [14, 200], [20, 194], [23, 187], [27, 182], [22, 180], [24, 176], [20, 172], [18, 167], [8, 167], [1, 174], [-1, 187]]), face, { ...o, round: 9, length: 13, turn: 0 });
p.tryStroke({ color: '#4c2428', width: 4, opacity: 0.9, points: [Y(13.5, 188.5), Y(21.5, 186)] });                       // her eye, nearly shut
p.tryStroke({ color: '#3c2018', width: 4, opacity: 0.75, points: [Y(12, 193), Y(21, 191)] });                            // her brow
p.tryStroke({ color: '#c05868', width: 4, opacity: 0.9, points: [Y(16.5, 174.5), Y(24, 176.5)] });                       // her lips
p.tryStroke({ brush: 'soft', color: '#f4a09c', width: 8.2, opacity: 0.3, points: [Y(9, 181), Y(17, 182)] });             // the color in her cheek
shape(p, poly([[-17, 190], [-13, 202], [-2, 208], [10, 207], [18, 201], [12, 198], [5, 193], [3, 183], [0, 173], [-7, 167], [-16, 171]]), hair, { ...o, round: 10, length: 16 });
for (const [x0, y0, x1, y1] of [[-12, 172, -22, 167], [-14, 178, -25, 176], [-13, 184, -23, 186]]) p.stroke({ ...line, color: mix('#2a1612', '#5a3420', r()), width: 6.5, taper: [0, 0.7], points: [Y(x0, y0), Y(x1, y1)] });   // the ends of it, lifted
for (const [x0, y0, x1, y1] of [[6, 205, 17, 198], [0, 206, 8, 197], [14, 202, 20, 192]]) p.tryStroke({ ...line, color: '#3a2018', width: 5.5, taper: [0, 0.5], points: [Y(x0, y0), Y(x1, y1)] });   // the hair over her brow
p.tryStroke({ ...line, color: '#e0b090', width: 4.8, points: [Y(3, 187), Y(4, 179)] });                                  // her ear
// The string of blue beads at her ear: the turn carries it out.
p.tryStroke({ color: '#3c2c44', width: 4, opacity: 0.8, points: [Y(4, 178), Y(18, 160), Y(38, 144)] });
for (const t of [0.25, 0.5, 0.75, 1]) p.tryStroke({ ...line, color: mix('#5c8cf0', '#a8d0ff', r()), width: 5.5, points: [Y(4 + 34 * t - 3, 178 - 34 * t + 3), Y(4 + 34 * t + 3, 178 - 34 * t - 3)].map(([x, y], i) => [x + (i ? 1.5 : -1.5), y + (i ? 1.5 : -1.5)]) });
glint(p, poly([[-14, 198], [-4, 205], [8, 205]]), () => mix('#ffc880', '#fff0c0', r()), { width: 4.2, dash: 14, gap: 6, opacity: 0.8, rng: r });   // the light on the top of her hair

p.save();
