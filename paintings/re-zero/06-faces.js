// The two heads, their joined hands, and the small things of their clothes. This pass is as
// long as the pass before it, which laid in their bodies.
// Rem looks up at him. We see the left side of her face: a small nose, a mouth that smiles,
// one large blue eye under hair that is cut straight across her brow. Her hair is pale blue
// and comes to her jaw. On it is the white frilled band of a maid, with a flower of ribbon at
// the side and a ribbon that hangs.
// Subaru looks down at her. His hair is black and short and stands up at the front; his
// brow is straight and heavy, and his eye is narrow. He has begun to smile.
// The sun is high and behind him, so her face is in the light and his is in his own shade.
'use strict';
const { studio, open, SUNWARD, rem, subaru } = require('./scene');
const { mix, solid, shape, glint } = studio;

const p = open('faces');
const r = p.rng;
const o = { light: SUNWARD, turn: 0, width: 5.5, length: 16, vary: 0.05, dash: 16, gap: 7, edgeOpacity: 0.8 };
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round' };
// Turn a set of places about a point, so that a head can be tilted up or down.
const turned = (pts, [cx, cy], deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]); };
const thin = (width) => (width < 4.8 ? { brush: 'round' } : {});       // a thin mark is made with the round brush, which may be 4px wide
const mark = (who, pts, color, width, extra = {}) => p.tryStroke({ ...line, ...thin(width), color, width, ...extra, points: pts.map(([x, y]) => who(x, y)) });

// ---------------------------------------------------------------- Rem's head
{
  const R = rem, pivot = [6, 140], T = (pts) => turned(pts, pivot, 13).map(([x, y]) => R(x, y));   // her head is tilted back
  const skin = { shadow: '#c48a78', half: '#eab89c', lit: '#fde0c6', rim: '#fff6e8', bounce: '#d4a090' };
  const blue = { shadow: '#4470b4', half: '#70a4e0', lit: '#b4dcfa', rim: '#ffffff', bounce: '#6484cc' };
  const M = (pts, color, width, extra) => p.tryStroke({ ...line, ...thin(width), color, width, ...extra, points: T(pts) });
  solid(p, [R(3, 126, 3.8), R(4, 133, 3.8)], skin, { ...o, length: 13, edge: false });                               // her neck
  shape(p, T([[-11, 147], [-9, 154], [-3, 158], [6, 158.5], [12, 155], [9, 152], [5, 150], [4, 140], [5, 131], [1, 127], [-5, 128], [-10, 133], [-12, 140]]), blue, { ...o, round: 26, length: 20, flow: () => 1.5 });   // her hair: the back and the top of her head, down to her jaw
  shape(p, T([[6, 151], [13, 152], [15.5, 148.5], [15.6, 145], [18.6, 142], [16.6, 140.2], [17.2, 138.2], [15.6, 137], [15.6, 134.4], [13, 132.2], [8, 131.6], [5, 136], [5, 145]]), skin, { ...o, round: 16, length: 14, turn: -0.2 });   // her face
  p.tryStroke({ brush: 'soft', color: '#f89ca4', width: 12, opacity: 0.4, points: T([[8, 138.5], [15, 139]]) });       // the color in her cheek
  // her eye: large. A dark line above it, the blue of it, the dark middle, and a thin line under it.
  M([[9.6, 146.4], [12.4, 147], [15.2, 145.8]], '#28304c', 5);
  M([[12, 146.2], [12.4, 142.4]], '#4c84e0', 6.5);
  M([[12.6, 146], [12.9, 142.4]], '#1c2c58', 4.6);
  M([[10.2, 142], [14.4, 142.2]], '#b07868', 4, { opacity: 0.7 });
  M([[10, 148.8], [14.6, 149.2]], '#5c84c4', 4, { opacity: 0.8 });                                                   // her brow, the color of her hair
  M([[13.4, 136.6], [15.2, 136.2], [16.8, 137.6]], '#d06880', 4.4);                                                  // her mouth: she smiles
  M([[16.4, 141], [18, 141.6]].map(([x, y], i) => [x + (i ? 1.2 : -1.2), y]), '#e8a890', 4, { opacity: 0.6 });         // the shade under her nose
  // the hair that is cut straight across her brow, and the lock that falls in front of her ear
  shape(p, T([[3, 157], [13, 155], [16.4, 150.6], [15.2, 147.2], [13, 149.6], [11, 147.6], [9, 150], [6.6, 148.4], [5, 151]]), blue, { ...o, round: 9, length: 14, flow: () => 1.2 });
  shape(p, T([[2, 150], [6, 148], [6.6, 138], [5.4, 130], [2.4, 128], [1.4, 138]]), blue, { ...o, round: 8, length: 16, flow: () => 1.5 });
  for (const [x0, y0, x1, y1] of [[-8, 154, -10, 140], [-3, 156, -6, 136], [0, 156, -2, 132], [-10, 146, -11, 134]]) M([[x0, y0], [(x0 + x1) / 2 - 0.6, (y0 + y1) / 2], [x1, y1]], mix('#5c8cd0', '#c8e4fc', r()), 4.6, { opacity: 0.6, taper: [0.2, 0.5] });   // the fall of it
  glint(p, T([[-9, 153], [-3, 157.4], [5, 158]]), () => '#ffffff', { width: 4.4, dash: 18, gap: 8, opacity: 0.75, rng: r });   // the sun on the top of it
  // the band of a maid on her hair: white, with a frill that stands up
  shape(p, T([[-4, 158], [3, 160], [10, 157.6], [10.6, 155.2], [3, 157.4], [-3.4, 155.6]]), { shadow: '#98a0cc', half: '#d0d6ee', lit: '#ffffff', rim: '#ffffff' }, { ...o, round: 5, length: 13, edge: false });
  for (const [x, y] of [[-3, 159], [0.5, 160.6], [4, 161.2], [7.6, 160.2], [10.4, 158.2]]) { M([[x + 0.8, y - 0.4], [x + 1.1, y + 3.6]], '#8ca0d8', 5.5); M([[x, y], [x + 0.3, y + 3.8]], '#ffffff', 5.5); }   // each fold of the frill, with its shade beside it
  M([[-3.6, 154.8], [3, 156.6], [10.6, 154.4]], '#4c78bc', 4.6, { opacity: 0.7 });                                   // the shade of the band on her hair
  // the flower of ribbon at the side of it, and the ribbon that hangs from it
  for (const a of [0.3, 1.5, 2.7]) M([[0.6 - Math.cos(a) * 2, 151.4 - Math.sin(a) * 2], [0.6 + Math.cos(a) * 2, 151.4 + Math.sin(a) * 2]].map(([x, y], i) => [x + (i ? 0.3 : -0.3) * Math.cos(a), y + (i ? 0.3 : -0.3) * Math.sin(a)]), '#f08cb8', 5);
  M([[0, 150], [-1.4, 143], [-3.4, 136]], '#c85c98', 5, { taper: [0, 0.4] });
  M([[1, 150], [1.4, 143], [0.6, 137]], '#e078b0', 4.6, { taper: [0, 0.4] });
}

// ---------------------------------------------------------------- Subaru's head
{
  const B = subaru, pivot = [6, 158], T = (pts) => turned(pts, pivot, -9).map(([x, y]) => B(x, y));   // his head is bent down to her
  const skin = { shadow: '#a87462', half: '#d4a488', lit: '#f2ccb0', rim: '#fff0e0', bounce: '#c09484' };   // his face is in his own shade
  const black = { shadow: '#0c0c14', half: '#1c1c2a', lit: '#44465c', rim: '#e4eaf6', bounce: '#22223a' };
  const M = (pts, color, width, extra) => p.tryStroke({ ...line, ...thin(width), color, width, ...extra, points: T(pts) });
  solid(p, [B(3, 145, 4.2), B(4, 152, 4.2)], { ...skin, lit: '#d8a88c', half: '#b88468' }, { ...o, length: 13, edge: false });   // his neck, in the shade of his jaw
  shape(p, [B(-6, 141), B(7, 142.4), B(11.4, 147.6), B(8, 150.6), B(1, 147.4), B(-6, 147.6)], black, { ...o, round: 8, length: 14 });   // the collar of his jacket, which stands up
  p.tryStroke({ ...line, color: '#f08a2c', width: 5, points: [B(2, 147.4), B(8, 149.8), B(11, 146.6)] });              // the orange inside it
  shape(p, T([[-8, 158], [-8, 166], [-4, 172], [3, 175], [10, 174], [15, 170], [12, 168], [8, 170], [6, 165], [5, 158], [3, 152], [-2, 149], [-7, 152]]), black, { ...o, round: 26, length: 20, flow: () => 1.3 });   // his hair: the back and the top of his head
  shape(p, T([[6, 169], [14, 169.4], [16.4, 165.4], [16.4, 162.4], [20, 158.6], [17.4, 157.2], [17.8, 155], [16.2, 153.8], [16.8, 151.4], [13.8, 148.6], [8, 149], [5.6, 153.4], [6, 163]]), skin, { ...o, round: 16, length: 14, turn: 0.25 });   // his face
  M([[9.8, 164.6], [13, 164], [16, 162.6]], '#16161f', 5.5);                                                         // his brow: straight and heavy
  M([[10.8, 161.6], [15.2, 160.8]], '#1c1c26', 5);                                                                   // his eye: narrow
  M([[11.4, 159.8], [15, 159.4]], '#a87462', 4, { opacity: 0.6 });
  M([[13.6, 152.8], [16.4, 152.8], [17.4, 154]], '#9c5850', 4.4);                                                    // his mouth: it has begun to smile
  M([[5.6, 160.6], [5.8, 155.8]], '#d8a890', 6);                                                                     // his ear
  M([[6.6, 160], [6.8, 156.4]], '#9c6c5c', 4, { opacity: 0.7 });
  M([[4, 158], [4.6, 151.4]], '#14141c', 6, { taper: [0, 0.5] });                                                    // the hair in front of his ear
  // the hair at his brow stands up and forward, in points
  for (const [x0, y0, x1, y1] of [[8, 170, 13.6, 175.6], [5, 172, 8.6, 178.4], [1, 173, 2, 179.6], [-4, 171, -7, 176.6], [11, 169, 17, 171.4]]) M([[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2 + 0.4], [x1, y1]], mix('#0e0e16', '#2c2c40', r()), 11, { taper: [0, 0.75] });
  for (const [x0, y0, x1, y1] of [[-6, 170, -7, 158], [-2, 173, -3, 156], [2, 174, 0, 160]]) M([[x0, y0], [x1, y1]], '#3c4058', 4.6, { opacity: 0.6, taper: [0.2, 0.5] });   // the fall of it
  glint(p, T([[-8, 166], [-8.4, 158], [-7, 151]]), () => '#e4eaf6', { width: 4.4, dash: 16, gap: 8, opacity: 0.85, rng: r });   // the sun on the back of his head
  glint(p, T([[-4, 172.6], [3, 175.6], [9, 174.6]]), () => '#c8d0e4', { width: 4.4, dash: 16, gap: 8, opacity: 0.6, rng: r });
}

// ---------------------------------------------------------------- their hands
// His hand is under, open, with the thumb on top. Both of hers are shut round it: we see the backs of her fingers.
{
  const skinH = { shadow: '#b8806c', half: '#e0ac90', lit: '#fbdcc0', rim: '#fff4e0', bounce: '#c89484' };
  const [hx, hy] = rem(30, 112);                                        // where the hands meet
  shape(p, [[hx - 6, hy - 9], [hx + 30, hy - 13], [hx + 40, hy - 5], [hx + 36, hy + 9], [hx + 6, hy + 13], [hx - 8, hy + 5]], { ...skinH, shadow: '#a87462', lit: '#eac4a8' }, { ...o, round: 10, length: 14 });   // his hand
  shape(p, [[hx - 22, hy - 12], [hx - 2, hy - 15], [hx + 14, hy - 10], [hx + 16, hy + 1], [hx + 2, hy + 6], [hx - 20, hy + 3]], skinH, { ...o, round: 8, length: 14, turn: -0.2 });   // her upper hand
  shape(p, [[hx - 18, hy + 2], [hx + 4, hy + 5], [hx + 14, hy + 11], [hx + 8, hy + 19], [hx - 12, hy + 16], [hx - 22, hy + 9]], skinH, { ...o, round: 8, length: 14, turn: -0.1 });      // her lower hand
  for (const [x0, y0, x1, y1] of [[2, -13, 5, -1], [8, -11, 11, 0], [-4, -13, -1, -1], [0, 7, 3, 18], [6, 9, 9, 18.5]]) p.tryStroke({ color: '#b8806c', width: 4, opacity: 0.6, points: [[hx + x0, hy + y0], [hx + x1, hy + y1]] });   // the lines between her fingers
  p.tryStroke({ ...line, color: '#e8c0a4', width: 6, points: [[hx + 12, hy - 15], [hx + 28, hy - 16]] });               // his thumb, over them
}

// ---------------------------------------------------------------- the small things of Rem's dress
{
  const R = rem, W = (pts, width = 5.5, color) => mark(R, pts, color || mix('#d4dcf4', '#ffffff', r()), width);
  for (let k = 0; k < 9; k++) { const t = k / 8, x = -17 + 33 * t, y = 62.4 + 2.4 * Math.sin(t * 3.1); W([[x - 2.2, y + 1.6], [x, y - 1], [x + 2.2, y + 1.6]], 6.5); }   // the frill of the white under her skirt
  for (let k = 0; k < 7; k++) { const t = k / 6, x = 14.8 - 3 * t, y = 68 + 27 * t; W([[x, y - 2], [x + 2.4, y], [x, y + 2]], 5.5); }                                // the frill down the edge of the apron
  for (const [x, y] of [[5, 122.6], [8, 121.6], [10.6, 119.4]]) W([[x - 1.6, y + 1], [x + 1.8, y - 1.4]].map(([px, py], i) => [px + (i ? 0.4 : -0.4), py]), 5.5);   // the frill at her breast
  mark(R, [[6, 124], [7, 119.4]], '#7c50b0', 5.5); mark(R, [[7.4, 124.4], [10, 121]], '#9468c8', 5);                                                                 // the ribbon at her neck
  for (const dx of [0, 1.5]) { W([[20.4 + dx, 106.8 + dx * 1.6], [21.6 + dx, 110.6 + dx * 1.6], [20.8 + dx, 114.6 + dx * 1.6]], 5); }                                 // the frill of each cuff
  mark(R, [[-1, 124.6], [2.4, 121], [5.4, 117.4]], '#f4f6ff', 5);                                                                                                    // the white edge at the top of her sleeve
  for (const dx of [-5, 0]) { mark(R, [[0.4 + dx, 59], [6 + dx, 58.6]], '#7c50b0', 4.6); mark(R, [[3 + dx, 44.6], [3.4 + dx, 40.6]], '#aab2d6', 4.6, { opacity: 0.6 }); mark(R, [[-2 + dx, 7.2], [5 + dx, 6.2]], '#0c0c14', 4.6); }   // the ribbon at the top of each stocking, the knee, the strap of each shoe
  for (const [x0, y0, x1, y1] of [[-13, 92, -16, 70], [-6, 94, -8, 69], [9, 92, 12, 70]]) mark(R, [[x0, y0], [x1, y1]], '#4c5078', 4.6, { opacity: 0.5, taper: [0.2, 0.5] });   // the light on the folds of her skirt
}

// ---------------------------------------------------------------- the small things of Subaru's clothes
{
  const B = subaru;
  for (const [x0, y0, x1, y1, x2, y2] of [[4, 123, 9, 120, 12, 123], [5, 119, 10, 116.4, 13, 119], [-9, 121, -5, 118, -2, 120]]) mark(B, [[x0, y0], [x1, y1], [x2, y2]], '#0e0f18', 5, { opacity: 0.6, taper: [0.2, 0.4] });   // the folds at his elbow and his side
  mark(B, [[-9.4, 95.6], [0, 93.6], [10.4, 95.6]], '#5c6278', 4.6, { opacity: 0.7 });                                  // the light on the band at the foot of his jacket
  mark(B, [[-8, 128], [-8.6, 120]], '#eef0f6', 4.6, { opacity: 0.7 }); mark(B, [[-6.4, 128], [-7, 120]], '#eef0f6', 4.6, { opacity: 0.5 });   // the mark on his sleeve
  mark(B, [[4.6, 108], [9, 106.8]], '#0e0f18', 5, { opacity: 0.6 });                                                   // his pocket
  for (const [x0, y0, x1, y1] of [[5, 60, 9.6, 52], [1, 56, 6, 49], [-6, 60, -2, 53], [3, 18, 7.6, 12], [-8, 18, -4, 12]]) mark(B, [[x0, y0], [x1, y1]], '#12131c', 5, { opacity: 0.5, taper: [0.2, 0.4] });   // the folds at his knees and his ankles
  for (const dx of [-10, 0]) {                                                                                         // his shoes: the sole, a band of orange, the laces
    mark(B, [[1 + dx, 0.6], [12 + dx, 0.4], [21.6 + dx, 0.8]], '#8c8ea4', 4.6);
    mark(B, [[6 + dx, 4.4], [11 + dx, 3]], '#f08a2c', 4.6);
    for (const lx of [10, 13.4]) mark(B, [[lx + dx, 5.6], [lx + 2.6 + dx, 2.8]].map(([x, y], i) => [x, y + (i ? -0.5 : 0.5)]), '#aab0c4', 4, { opacity: 0.8 });
  }
}

p.save();
