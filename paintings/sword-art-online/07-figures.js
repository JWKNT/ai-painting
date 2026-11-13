// Kirito and Asuna, seen from behind, sitting side by side on the glass with the castle in
// front of them. He is in his black coat with the hilts of his two swords over his
// shoulders; she leans her head on his shoulder, her long hair down her back. The sun is
// beyond them, so they are dark, with its light along the edges that face it.
'use strict';
const { studio, open, SUNLIGHT, KIRITO, ASUNA } = require('./scene');
const { mix, solid, glint } = studio;

const p = open('figures');
const r = p.rng;
const o = { light: SUNLIGHT, turn: 0.55, width: 5, length: 24, vary: 0.05, lights: false, edge: false };
const lit = { ...o, edge: true, dash: 15, gap: 9, edgeOpacity: 0.75 };
const K = (x, y, rad) => (rad == null ? [KIRITO.x + x, KIRITO.y + y] : [KIRITO.x + x, KIRITO.y + y, rad]);
const A = (x, y, rad) => (rad == null ? [ASUNA.x + x, ASUNA.y + y] : [ASUNA.x + x, ASUNA.y + y, rad]);
const warm = () => mix('#ff9c5c', '#ffe0a8', r());
const line = (a, b, w, color, extra = {}) => p.stroke({ brush: 'bristle', color, width: w, mix: 0, dry: 0, rag: 0, cap: 'round', ...extra, points: [a, b] });

const black = { shadow: '#0a0a14', half: '#151522', lit: '#30283c', rim: '#ffa868', bounce: '#131a2c' };
const white = { shadow: '#383668', half: '#62609a', lit: '#c4b8c8', rim: '#fff0d4', bounce: '#48487e' };
const hair = { shadow: '#1e0f0b', half: '#3c1c0e', lit: '#7a3c1a', rim: '#ffb868', bounce: '#2c1626' };
const inner = { ...black, rim: undefined };                 // for the parts of him that the sun cannot reach

// ---------------------------------------------------------------- Kirito
solid(p, [K(-24, -6, 12), K(24, -6, 12)], inner, o);                                                   // the skirts of his coat, on the glass
// the hilts of his two swords, standing up over his shoulders: one black, one pale
p.stroke({ brush: 'bristle', color: '#0a0a14', width: 5, mix: 0, dry: 0, rag: 0, cap: 'round', points: [K(-12, -88), K(-21, -107), K(-30, -126)] });
line(K(-27, -101), K(-13, -108), 4.6, '#0a0a14');                                                      // its guard
p.stroke({ brush: 'bristle', color: '#2c4a60', width: 5, mix: 0, dry: 0, rag: 0, cap: 'round', points: [K(13, -88), K(17, -108), K(21, -128)] });
line(K(10, -109), K(24, -106), 4.6, '#2c4a60');
glint(p, [K(15.5, -90), K(19.5, -110), K(23.5, -128)], () => mix('#9cd8ec', '#eefcff', r()), { width: 4, dash: 14, gap: 6, opacity: 0.75, rng: r });
// his back: the body, the line of the shoulders, the two arms close against it
solid(p, [K(0, -12, 20), K(0, -48, 20), K(0, -78, 21)], inner, { ...o, length: 32 });
solid(p, [K(-18, -84, 11), K(18, -84, 11)], inner, o);
solid(p, [K(-23, -80, 9.5), K(-25, -48, 9), K(-25, -16, 8.5)], inner, o);
solid(p, [K(23, -80, 9.5), K(25, -48, 9), K(25, -16, 8.5)], inner, o);
glint(p, [K(31, -78), K(34, -50), K(33, -22)], warm, { width: 4, dash: 16, gap: 16, opacity: 0.55, rng: r });                 // the sun down his arm, where it shows between them
// his neck and head: black hair, untidy at the nape
solid(p, [K(0, -93, 8), K(0, -99, 8)], inner, o);
solid(p, [K(1, -113, 17), K(1, -109, 17)], inner, { ...o, length: 16 });
for (const [deg, len] of [[35, 6], [70, 5], [110, 5], [145, 6], [178, 5], [2, 5], [-40, 4], [-90, 4], [-140, 4]]) {
  const a = deg * Math.PI / 180, x = KIRITO.x + 1, y = KIRITO.y - 111;
  p.tryStroke({ brush: 'bristle', color: '#0a0a14', width: 6.5, taper: [0, 1], mix: 0, dry: 0, rag: 0, cap: 'round', points: [[x + Math.cos(a) * 8, y + Math.sin(a) * 8], [x + Math.cos(a) * (13 + len * 0.5), y + Math.sin(a) * (13 + len * 0.5) + 1], [x + Math.cos(a) * (16 + len), y + Math.sin(a) * (16 + len) + 2.5]] });
}
glint(p, [K(-1, -129), K(9, -127), K(15, -121), K(17, -112)], warm, { width: 4, dash: 12, gap: 8, opacity: 0.7, rng: r });   // the sun in his hair

// ---------------------------------------------------------------- Asuna
solid(p, [A(-22, -6, 12), A(24, -6, 12)], white, o);                                                   // her skirt, on the glass
glint(p, [A(-18, 5), A(4, 6.5), A(32, 5)], () => mix('#7a2030', '#c8404e', r()), { width: 4.2, dash: 30, gap: 10, opacity: 0.65, rng: r });   // its red hem
// her back, leaning toward him: the body, the shoulders, the arm on our side
solid(p, [A(0, -12, 16.5), A(-2, -46, 15.5), A(-5, -74, 16)], white, { ...o, length: 30 });
solid(p, [A(-20, -79, 9), A(10, -80, 9)], white, lit);
solid(p, [A(14, -76, 8), A(18, -46, 7.5), A(18, -16, 7)], white, lit);
// her head on his shoulder, and her long hair down her back: round at the crown, narrowing as it falls
solid(p, [A(-12, -106, 15.5), A(-11, -102, 15.5)], hair, { ...o, length: 16 });
solid(p, [A(-12, -98, 14.5), A(-9, -76, 13.5), A(-5, -52, 12), A(-2, -32, 9.5)], hair, { ...o, length: 34 });
for (const [x0, y0, x1, y1, x2, y2, c, op] of [[-17, -84, -12, -52, -7, -14, '#160a08', 0.8], [-7, -86, -2, -52, 3, -18, '#1e0e0a', 0.8], [-12, -56, -8, -34, -3, -10, '#2c140c', 0.8], [-13, -100, -9, -70, -5, -40, '#7a401c', 0.4], [-5, -102, -1, -74, 1, -46, '#8a4a20', 0.4]]) {   // the fall of it, strand by strand
  p.tryStroke({ brush: 'bristle', color: c, width: 4.8, opacity: op, mix: 0.1, dry: 0.05, rag: 0.1, taper: [0.2, 0.6], points: [A(x0, y0), A(x1, y1), A(x2, y2)] });
}
glint(p, [A(-2, -119), A(3, -108), A(4, -94), A(5, -72), A(7, -50), A(8, -34)], () => mix('#ff9c44', '#ffd890', r()), { width: 4.2, dash: 20, gap: 12, opacity: 0.8, rng: r });   // the sun along its edge

p.save();
