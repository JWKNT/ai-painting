// Yuki. She stands in the middle of the roof with her back to us, and looks up at the sky
// with one hand over her eyes against the sun. Her long dark hair goes out to the right on
// the wind, and so does her skirt. In her other hand she has a small book. Her bag is on the
// floor beside her. The sun is in front of her, so we see her dark, with light along the
// top of her head, her shoulder and her raised arm; her shade comes toward us, and the
// water at her feet holds her, turned over.
'use strict';
const { studio, open, H, F, SUN, SUNDIR, YUKI, at, water } = require('./scene');
const { mix, solid, shape, glint } = studio;

const p = open('girl');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.06, dry: 0, rag: 0.1, cap: 'round' };
const [GX, GY] = at(YUKI.X, 0, YUKI.Z), S = F / YUKI.Z / 100;                       // where she stands, and how many units of the picture a centimetre of her is
const B = (fx, fy, rad) => (rad == null ? [GX + fx * S, GY - fy * S] : [GX + fx * S, GY - fy * S, rad * S]);
const poly = (pts) => pts.map(([x, y]) => B(x, y));
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: poly(pts) });
const o = { light: { at: [SUN.x, SUN.y] }, turn: 0.35, width: 5.2, length: 16, vary: 0.05, dash: 14, gap: 6, edgeOpacity: 0.85 };
const blouse = { shadow: '#6078b8', half: '#96aadc', lit: '#e6eeff', rim: '#ffffff', bounce: '#a4bce8' };
const skirt = { shadow: '#0c0e1a', half: '#1e2236', lit: '#444c70', rim: '#b4c4f8', bounce: '#34446c' };
const socks = { shadow: '#05060b', half: '#12131d', lit: '#343850', rim: '#94a4d8', bounce: '#28365c' };
const hair = { shadow: '#060916', half: '#10182f', lit: '#2c3c6c', rim: '#c0d0ff', bounce: '#1c2a50' };
const skin = '#b88c7c', skinLit = '#ffe6d0';

// ---------------------------------------------------------------- her shade on the floor, and her in the water
{
  const reach = 1.62 / SUNDIR.tan, tip = at(YUKI.X - SUNDIR.x * reach, 0, YUKI.Z - SUNDIR.z * reach), mid = at(YUKI.X - SUNDIR.x * reach * 0.5, 0, YUKI.Z - SUNDIR.z * reach * 0.5);
  for (const [w, op] of [[30, 0.3], [20, 0.34]]) p.stroke({ brush: 'soft', color: '#18223a', width: w, opacity: op, points: [[GX - 2, GY + 2], mid, tip] });
  // in the water: her legs, her skirt, the foot of her blouse, each as upright strokes that the small waves break
  const down = (fx, fy) => [GX + fx * S, GY + fy * S];
  const wetStroke = (a, b, color, width, op) => { const n = 7, pts = []; for (let i = 0; i <= n; i++) { const t = i / n; pts.push([a[0] + (b[0] - a[0]) * t + r.range(-1.6, 1.6), a[1] + (b[1] - a[1]) * t]); } if (water(a[0], (a[1] + b[1]) / 2) > 0.5) p.tryStroke({ ...line, color, width, opacity: op, points: pts }); };
  for (const fx of [-7.6, 7.4]) wetStroke(down(fx, 2), down(fx * 0.9, 64), '#141a2c', 8.5, 0.62);
  for (const fx of [-6.6, 6.1]) wetStroke(down(fx - 3, 62.5), down(fx - 3, 73), '#8c7478', 6, 0.5);
  for (let fx = -15; fx <= 21; fx += 5) wetStroke(down(fx * 0.6, 67), down(fx, 100 - Math.abs(fx) * 0.5), '#1a2036', 7.5, 0.6);
  for (let fx = -10; fx <= 10; fx += 5) wetStroke(down(fx, 99), [GX + fx * S, H + 6], '#7c90c4', 7, 0.5);
  for (let k = 0; k < 16; k++) { const y = GY + r.range(8, H - GY - 4), x = GX + r.range(-26, 30), len = r.range(22, 46); if (water(x, y) > 0.5) p.tryStroke({ ...line, color: mix('#9cc0ec', '#ffffff', r()), width: 4.8, opacity: 0.5, taper: [0.5, 0.5], points: [[x - len / 2, y], [x + len / 2, y + r.range(-1, 1)]] }); }   // the small waves across it
}

// ---------------------------------------------------------------- her bag, on the floor at her left
{
  const bag = { shadow: '#0a0e1c', half: '#1c2440', lit: '#44548c', rim: '#c0d0ff', bounce: '#34446c' };
  p.stroke({ brush: 'soft', color: '#18223a', width: 16, opacity: 0.4, points: [B(-46, -1), B(-24, -4), B(0, -9)] });
  shape(p, poly([[-47, 0], [-14, 0], [-13, 21], [-16, 25.6], [-45, 25.6], [-48, 21]]), bag, { ...o, round: 8, length: 16, flow: () => 0 });
  mark([[-47.4, 13.6], [-30, 12.4], [-13.4, 13.6]], '#070a16', 4.6, { opacity: 0.85 });                           // the edge of its flap
  for (const fx of [-39, -22]) mark([[fx, 15], [fx, 4.6]], '#b8a060', 4, { opacity: 0.75 });                      // its two straps
  mark([[-37, 28], [-23.6, 28]], '#141a30', 4.6);                                                                 // its handle, flat on the top of it
}

// ---------------------------------------------------------------- her legs and her shoes
for (const [fx, lean, knee] of [[-7.6, -0.6, 0], [7.4, 0.5, 1.8]]) {
  mark([[fx - 5.6, 2.4], [fx + 5.6, 2.4]], '#2c1a10', 6);                                                         // a shoe
  mark([[fx - 5.4, 5], [fx + 5, 5]], '#7c5434', 4, { opacity: 0.6 });
  mark([[fx - lean * 2 - 6.4, 65.4], [fx - lean * 2 + 6.4, 65.4]], skin, 8);                                      // the skin over the top of the stocking
  solid(p, [B(fx - lean * 2, 62, 6.3), B(fx - lean + knee, 44, 5.1), B(fx, 9, 3.7)], socks, { ...o, length: 22 });
}

// ---------------------------------------------------------------- her skirt: short, dark, in folds; the wind lifts it to the right
shape(p, poly([[-11, 100], [11, 100], [16.4, 88], [22.6, 76], [26, 69.4], [13, 65.6], [0, 66.6], [-10, 66.8], [-18.4, 69], [-15.4, 84]]), skirt, { ...o, round: 9, length: 18, flow: (x, y) => Math.atan2(y - B(2, 112)[1], x - B(2, 112)[0]) });
for (const [x1, y1] of [[-13, 70], [-5, 68], [3, 68], [11, 67.4], [19, 69.6]]) mark([[x1 * 0.45, 98], [x1 * 0.8, 84], [x1, y1]], '#06080f', 4.6, { opacity: 0.6, taper: [0.2, 0.3] });   // the dark between its folds
for (const [x1, y1] of [[-9, 69], [7, 67.6], [15, 68.6]]) mark([[x1 * 0.5 - 1, 96], [x1 * 0.82 - 1, 83], [x1, y1]], '#565e88', 4, { opacity: 0.5, taper: [0.3, 0.3] });                    // and the light on them
mark([[-18.6, 68.4], [-9.6, 66.2], [0.4, 66]], '#c4d0f4', 4.2, { opacity: 0.9 }); mark([[0.4, 66], [13, 65], [26, 68.8]], '#c4d0f4', 4.2, { opacity: 0.9 });                             // the white frill at its hem

// ---------------------------------------------------------------- her blouse, its collar, and her right arm with the book
shape(p, poly([[-11, 99], [11, 99], [12.4, 114], [14.6, 131], [8, 136.6], [0, 137.6], [-8, 136.6], [-14.6, 131], [-12.4, 114]]), blouse, { ...o, round: 10, length: 18, flow: () => Math.PI / 2 });
mark([[-11.2, 100], [0, 99.2], [11.2, 100]], '#2c3048', 5.5, { cap: 'flat' });                                    // the band of the skirt at her waist
shape(p, poly([[-14, 133.4], [-6, 137.8], [6, 137.8], [14, 133.4], [13.4, 120], [-13.4, 120]]), blouse, { ...o, round: 8, length: 16, flow: () => 0, turn: 0.1 });   // the collar: a square of white over her shoulders
mark([[-13.6, 119.4], [0, 118.6], [13.6, 119.4]], '#5068a8', 4.6, { opacity: 0.7 });                              // the shade under it
for (const pts of [[[-11.6, 132], [-11.2, 122]], [[11.2, 122], [11.6, 132]]]) mark(pts, '#b02838', 4, { opacity: 0.9 });   // the red line near its edge
{ // her right arm, down at her side
  shape(p, poly([[11.4, 134], [18.6, 131.6], [22, 121.6], [13.4, 119.6]]), blouse, { ...o, round: 5, length: 13 });                                // the sleeve
  mark([[13.6, 120.4], [22, 122.4]], '#b02838', 4, { opacity: 0.9 });
  mark([[17.6, 120], [19.2, 106], [19.8, 91]], skin, 7.2); mark([[15.4, 119], [17, 106], [17.6, 93]], skinLit, 4, { opacity: 0.55 });               // the arm, with the light of the sky down it
  mark([[21.4, 90], [21.6, 76.6]], '#c8c4d0', 7.6, { cap: 'flat' }); mark([[18.2, 90], [18.4, 76.6]], '#6c6884', 4, { opacity: 0.9 });               // the book, and its back
  mark([[19.6, 93], [19.9, 82]], skin, 6.4);                                                                                                       // her hand round it
}

// ---------------------------------------------------------------- her hair down her back, and what the wind takes
// On her back it lies over to the right. What the wind takes goes out as one long shape that narrows to a tip, as a flag
// does; a few loose strands leave it.
shape(p, poly([[-7, 147], [10.6, 147], [13.6, 128], [15, 110], [12.6, 97], [5, 92.6], [-1, 96], [-4.6, 110], [-6.6, 128]]), hair, { ...o, round: 8, length: 22, flow: () => Math.PI / 2 - 0.1 });
{
  const tip = B(64, 142), toTip = (x, y) => Math.atan2(tip[1] - y, tip[0] - x);
  shape(p, poly([[7, 160], [20, 164], [36, 162.4], [50, 155], [64, 142.6], [55, 138], [44, 131], [33, 121], [23, 109], [14, 98.6], [12, 118], [10, 140]]), hair, { ...o, round: 8, length: 24, flow: toTip, turn: 0.45 });
  const strand = (pts, w, color, op = 1) => p.tryStroke({ ...line, color, width: w, opacity: op, taper: [0.1, 0.9], points: poly(pts) });
  for (const [x0, y0, x1, y1, x2, y2] of [[9, 152, 30, 153, 52, 146], [10, 142, 30, 142, 50, 141], [11, 130, 28, 131, 46, 135], [12, 118, 27, 121, 42, 128], [13, 106, 25, 111, 37, 120]]) strand([[x0, y0], [x1, y1], [x2, y2]], 4.8, '#24345f', 0.6);   // the lie of it
  for (const [x0, y0, x1, y1, x2, y2] of [[50, 152, 62, 150, 74, 152.6], [56, 142, 68, 139, 80, 141.6], [44, 132, 56, 133, 66, 130], [24, 109, 34, 113, 44, 112], [30, 163, 44, 166, 57, 163]]) strand([[x0, y0], [x1, y1], [x2, y2]], 4.4, '#0c1226', 0.9);   // loose strands
  glint(p, poly([[8, 161.6], [20, 165.6], [36, 164], [50, 156.6], [62, 145.6]]), () => mix('#5c78c8', '#9cb4f0', r()), { width: 4, dash: 22, gap: 9, opacity: 0.6, rng: r });   // the sun along the top of it
}

// ---------------------------------------------------------------- her left arm: up, with the hand over her eyes
shape(p, poly([[-11.4, 134.6], [-15.6, 138.6], [-22.6, 141], [-21, 132.6], [-14, 126.6]]), blouse, { ...o, round: 5, length: 13 });                 // the sleeve
mark([[-22.4, 140], [-20.6, 133]].map(([x, y], i) => [x, y + (i ? -2.6 : 2.6)]), '#b02838', 4, { opacity: 0.9 });
mark([[-21, 137], [-26.6, 142.6], [-22, 150], [-13.6, 155.6]], skin, 7);                                                                           // the arm: out to her elbow, then up to her brow
mark([[-22.6, 139.6], [-28.4, 143.6], [-23, 151.8], [-14.6, 157.4]], skinLit, 4, { opacity: 0.85 });                                                // the sun along it

// ---------------------------------------------------------------- her head: we see only her hair
shape(p, poly([[-10.6, 146], [-11.6, 153], [-9.2, 160.6], [-2, 164.8], [5, 164], [10.6, 158.4], [11.6, 150], [10.2, 143], [0, 140.4], [-8.8, 142]]), hair, { ...o, round: 13, length: 16, flow: (x, y) => Math.atan2(y - B(0, 166)[1], x - B(0, 166)[0]) });
glint(p, poly([[-11, 154], [-8.6, 160.6], [-2, 164.6], [5, 163.8], [9.6, 159.6]]), () => mix('#a4bcf8', '#ffffff', r()), { width: 4.2, dash: 16, gap: 5, opacity: 0.9, rng: r });   // the sun on the top of it
mark([[-6.6, 157.6], [-2.6, 154.6], [1.6, 157]], '#f4f4ff', 4, { opacity: 0.8 });                                                                   // the clips in her hair

p.save();
