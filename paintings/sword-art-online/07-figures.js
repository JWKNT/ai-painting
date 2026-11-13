// Kirito and Asuna, seen from behind, sitting side by side on the glass with the castle in
// front of them. He is in his black coat, one arm braced on the glass, the two swords he
// fought with crossed on his back: one black, one pale. She leans her head on his shoulder,
// and her long hair is down her back. The sun is beyond them and to the right, so they are
// dark, with its light along every edge that faces it.
'use strict';
const { studio, open, SUNLIGHT, KIRITO, ASUNA } = require('./scene');
const { mix, solid, glint } = studio;

const p = open('figures');
const r = p.rng;
const S = 1.3;                                                          // how big they are painted
const at = (F, dx) => (x, y, rad) => (rad == null ? [F.x + dx + x * S, F.y + y * S] : [F.x + dx + x * S, F.y + dx * 0 + y * S, rad * S]);
const K = at(KIRITO, -6), A = at(ASUNA, 12);
const o = { light: SUNLIGHT, turn: 0.5, width: 5.2, length: 24, vary: 0.05, dash: 16, gap: 9, edgeOpacity: 0.8 };
const warm = () => mix('#ff9c5c', '#ffe0a8', r());
const line = { brush: 'bristle', mix: 0, dry: 0, rag: 0.05, cap: 'round' };

const black = { shadow: '#0a0a14', half: '#171726', lit: '#3a3048', rim: '#ffa868', bounce: '#16203a' };
const jet = { shadow: '#06060c', half: '#11111a', lit: '#2a2434', rim: '#ffa868', bounce: '#121a30' };
const white = { shadow: '#3a3870', half: '#6866a4', lit: '#cfc3d0', rim: '#fff0d4', bounce: '#4c4c86' };
const hair = { shadow: '#34160c', half: '#6a3216', lit: '#b8682a', rim: '#ffcc80', bounce: '#3a1e30' };

// ---------------------------------------------------------------- Kirito
solid(p, [K(-40, -4, 8), K(-20, -6, 11), K(18, -6, 11), K(36, -4, 8)], black, { ...o, edge: false });                 // the skirts of his coat, out on the glass
solid(p, [K(27, -80, 9), K(31, -52, 8), K(33, -26, 7.5)], black, { ...o, edge: false });                                // the arm on her side
solid(p, [K(0, -14, 19), K(0, -46, 19.5), K(0, -74, 22)], black, { ...o, length: 30 });                                 // his back
solid(p, [K(-21, -82, 10.5), K(0, -85, 11), K(21, -82, 10.5)], black, o);                                               // his shoulders
solid(p, [K(-27, -80, 9), K(-32, -48, 8), K(-37, -14, 7.5)], black, o);                                                 // the arm that he leans on
// the two swords, crossed on his back, and their hilts over his shoulders
p.stroke({ ...line, color: '#05050a', width: 6.5, points: [K(21, -90), K(0, -57), K(-20, -24)] });
p.stroke({ ...line, color: '#22404f', width: 6.5, points: [K(-21, -90), K(0, -57), K(20, -24)] });
glint(p, [K(-19, -91), K(2, -58), K(22, -25)], () => mix('#8ccce0', '#e4f8ff', r()), { width: 4, dash: 18, gap: 10, opacity: 0.6, rng: r });
p.stroke({ ...line, color: '#05050a', width: 5.4, points: [K(21, -90), K(26, -106), K(31, -122)] });                   // the grip of the black one
p.stroke({ ...line, color: '#05050a', width: 5, points: [K(15, -97), K(29, -90)] });                                   // and its guard
p.stroke({ ...line, color: '#2c4a60', width: 5.4, points: [K(-21, -90), K(-26, -106), K(-31, -122)] });
p.stroke({ ...line, color: '#2c4a60', width: 5, points: [K(-29, -90), K(-15, -97)] });
glint(p, [K(-19, -92), K(-24, -107), K(-29, -122)], () => mix('#9cd8ec', '#eefcff', r()), { width: 4, dash: 14, gap: 6, opacity: 0.75, rng: r });
glint(p, [K(23.5, -91), K(28.5, -106), K(33.5, -121)], warm, { width: 4, dash: 14, gap: 8, opacity: 0.6, rng: r });
// his collar, his neck, his head: black hair, untidy
solid(p, [K(-9, -90, 6.5), K(9, -90, 6.5)], black, { ...o, edge: false });
solid(p, [K(0, -110, 14.5), K(0, -105, 14.5)], jet, { ...o, length: 15 });
for (const [deg, len] of [[40, 3], [80, 2], [120, 3], [160, 2], [15, 2], [-30, 1], [-150, 1], [195, 2]]) {            // the ends of it, at his neck and his ears
  const a = deg * Math.PI / 180, [x, y] = K(0, -107);
  p.tryStroke({ ...line, color: '#06060c', width: 6, taper: [0, 1], points: [[x + Math.cos(a) * 9, y + Math.sin(a) * 9], [x + Math.cos(a) * (16 + len), y + Math.sin(a) * (16 + len) + 1.5], [x + Math.cos(a + 0.2) * (21 + len), y + Math.sin(a + 0.2) * (21 + len) + 3]] });
}
glint(p, [K(-2, -125), K(8, -123), K(14, -116), K(16, -106)], warm, { width: 4, dash: 12, gap: 8, opacity: 0.75, rng: r });  // the sun in his hair
glint(p, [K(8, -95), K(20, -92), K(30, -84)], warm, { width: 4, dash: 14, gap: 8, opacity: 0.6, rng: r });                   // and on his shoulder

// ---------------------------------------------------------------- Asuna
solid(p, [A(-34, -4, 8), A(-16, -6, 11), A(18, -6, 11), A(38, -4, 8)], white, o);                                       // her skirt, out on the glass
glint(p, [A(-30, 4), A(2, 6), A(40, 4)], () => mix('#7a2030', '#c8404e', r()), { width: 4.2, dash: 30, gap: 10, opacity: 0.7, rng: r });   // its red hem
solid(p, [A(-11, -13, 13), A(13, -13, 13)], white, o);                                                                  // her hips
solid(p, [A(1, -18, 14), A(-2, -40, 12.5), A(-5, -66, 15)], white, { ...o, length: 26 });                               // her back, leaning toward him: narrow at the waist
solid(p, [A(-19, -73, 8), A(-5, -79, 9), A(10, -74, 8)], white, o);                                                     // her shoulders, sloping
solid(p, [A(14, -72, 7.5), A(20, -44, 7), A(25, -14, 6.5)], white, o);                                                  // the arm on our right
p.tryStroke({ ...line, color: '#b03040', width: 4.8, opacity: 0.85, points: [A(16, -22), A(32, -20)] });               // the red at her cuff
// her long hair, down her back, narrower as it falls; and her head, round, laid on his shoulder
solid(p, [A(-11, -92, 12.5), A(-5, -76, 13.5), A(-2, -56, 13), A(0, -36, 11), A(1, -22, 8)], hair, { ...o, length: 30 });
for (const [x0, y0, x1, y1, x2, y2, c, op] of [[-13, -82, -10, -54, -6, -24, '#22100a', 0.8], [-3, -84, 0, -54, 3, -22, '#2a140c', 0.75], [-9, -92, -6, -68, -3, -42, '#9a5424', 0.5], [2, -80, 5, -60, 6, -38, '#c87a34', 0.5]]) {
  p.tryStroke({ brush: 'bristle', color: c, width: 4.8, opacity: op, mix: 0.1, dry: 0.05, rag: 0.1, taper: [0.2, 0.6], points: [A(x0, y0), A(x1, y1), A(x2, y2)] });
}
solid(p, [A(-14, -104, 15), A(-13, -100, 15)], hair, { ...o, length: 15 });
glint(p, [A(-5, -118), A(1, -108), A(5, -92), A(9, -72), A(10, -52), A(9, -34)], () => mix('#ff9c44', '#ffd890', r()), { width: 4.2, dash: 20, gap: 12, opacity: 0.85, rng: r });   // the sun along its edge

p.save();
