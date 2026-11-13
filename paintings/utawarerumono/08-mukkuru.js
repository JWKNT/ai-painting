// Mukkuru and Aruruu, ahead of the others on the path. Mukkuru is a white tiger as big as a
// horse, and Aruruu, who is a small girl, rides on his shoulders. He walks toward the sun:
// it is on his face, his chest and the front of his legs, and his flank, which is toward us,
// is in the half light, so that his stripes show. Aruruu has the ears of her people, white
// with brown tips, and her hair is in two long tails tied with blue.
'use strict';
const { studio, open, MUKKURU, SUNWARD, body } = require('./scene');
const { mix, solid } = studio;

const p = open('mukkuru');
const r = p.rng;
const B = body(MUKKURU), s = MUKKURU.s;
const o = { light: SUNWARD, turn: 0, width: 6.5, length: 26, vary: 0.05, dash: 22, gap: 9, edgeOpacity: 0.8 };
const fur = { shadow: '#7c7796', half: '#b9b0bc', lit: '#fff0d6', rim: '#fffbea', bounce: '#958eae' };
const furFar = { shadow: '#676384', half: '#948da6', lit: '#d9cbc2', bounce: '#7c7696' };

// his shadow, long on the grass, away from the sun
for (const [dy, w, op] of [[0, 34, 0.42], [14, 26, 0.3]]) p.stroke({ brush: 'soft', color: '#36402c', width: w, opacity: op, points: [B(250, -6 - dy), B(-80, -14 - dy), B(-420, -22 - dy), B(-760, -30 - dy)] });

// the tail, and the two legs on his far side: one front leg back, one hind leg forward, as he walks
solid(p, [B(-300, 290, 26), B(-372, 222, 22), B(-412, 144, 20), B(-442, 92, 18), B(-482, 98, 15)], fur, { ...o, length: 20 });
solid(p, [B(-180, 220, 58), B(-130, 150, 38), B(-160, 90, 24), B(-130, 30, 27), B(-102, 22, 20)], furFar, { ...o, edge: false });
solid(p, [B(170, 220, 44), B(150, 130, 30), B(120, 62, 26), B(128, 26, 28), B(154, 20, 20)], furFar, { ...o, edge: false });

// his body: deep at the chest, drawn up at the belly, heavy at the haunch
const trunk = solid(p, [B(-215, 262, 98), B(-70, 280, 80), B(120, 262, 112)], fur, { ...o, width: 7.5, length: 34 });
// the legs on our side: the hind leg back, pushing, and the front leg forward
solid(p, [B(-215, 230, 70), B(-190, 150, 42), B(-262, 96, 26), B(-250, 32, 28), B(-222, 22, 22)], fur, o);
solid(p, [B(130, 230, 52), B(150, 150, 36), B(176, 72, 28), B(196, 28, 30), B(226, 20, 22)], fur, o);
// his neck, his head, the ruff of his cheek and his jaw, his ears
solid(p, [B(258, 272, 44), B(300, 262, 30)], fur, { ...o, length: 20 });
solid(p, [B(200, 300, 84), B(262, 306, 66), B(318, 286, 40)], fur, { ...o, length: 28 });
solid(p, [B(274, 366, 16), B(276, 386, 10)], furFar, { ...o, edge: false });
solid(p, [B(238, 362, 20), B(232, 386, 13)], fur, o);

// His stripes. On his body each starts on his back and comes down his side, thinner as it
// goes, and none is straight; a few come up from his belly between them.
const dark = () => mix('#332e3a', '#574a4e', r());
const edge = (x, y0, dir) => { let y = y0; while (trunk.at(x, y).d > 0 && Math.abs(y - y0) < 300) y += 2 * dir; return y; };
const ink = { brush: 'bristle', opacity: 0.9, mix: 0.12, dry: 0.03, rag: 0.2, cap: 'round' };
for (let fx = -292; fx <= 196; fx += r.range(30, 46)) {
  const [x] = B(fx, 0), top = edge(x, B(0, 420)[1], 1), len = r.range(56, 92) * (fx > 90 || fx < -230 ? 0.8 : 1), lean = r.range(-12, 6), wig = r.range(-5, 5);
  p.tryStroke({ ...ink, color: dark(), width: r.range(6, 9), taper: [0.15, 0.85], points: [[x - lean * 0.4, top + 3], [x + lean * 0.5 + wig, top + len * 0.35], [x + lean, top + len * 0.7], [x + lean * 0.5 - 4, top + len]] });
  if (r() < 0.55) p.tryStroke({ ...ink, color: dark(), width: 4.8, opacity: 0.8, taper: [0.1, 0.7], points: [[x + 10, top + len * 0.25], [x + 14 + lean, top + len * 0.5], [x + 12 + lean * 0.5, top + len * 0.78]] });
  if (r() < 0.45 && fx > -200 && fx < 100) { const bot = edge(x + 12, B(0, 100)[1], -1), up = r.range(18, 34); p.tryStroke({ ...ink, color: dark(), width: 5, opacity: 0.8, taper: [0.1, 0.8], points: [[x + 12, bot - 3], [x + 16, bot - up * 0.5], [x + 12, bot - up]] }); }
}
for (const [fx, fy, half, tilt] of [[-196, 168, 40, 0.5], [-232, 118, 26, -0.5], [-256, 76, 26, 0.2], [146, 170, 36, -0.2], [166, 112, 30, -0.3], [182, 66, 28, -0.2], [-352, 246, 22, 0.8], [-396, 178, 20, 0.5], [-428, 114, 18, 0.5], [-464, 94, 16, 1.4]]) {   // bands round his legs and his tail
  const [x, y] = B(fx, fy), h = Math.max(6.4, half * s), c = Math.cos(tilt), sn = Math.sin(tilt);
  p.tryStroke({ ...ink, color: dark(), width: 5.2, opacity: 0.85, taper: [0.2, 0.4], points: [[x - h * c, y - h * sn], [x, y + 2], [x + h * c, y + h * sn]] });
}
// his face: stripes on his brow and his cheek, his eye, his nose, the line of his mouth, his whiskers
for (const [x0, y0, x1, y1] of [[232, 344, 256, 366], [258, 340, 278, 362], [212, 312, 240, 322], [218, 282, 246, 288], [284, 340, 296, 358], [238, 252, 262, 262]]) p.tryStroke({ ...ink, color: dark(), width: 4.8, opacity: 0.85, taper: [0.2, 0.5], points: [B(x0, y0), B(x1, y1)] });
p.tryStroke({ color: '#2a2228', width: 4, points: [B(282, 322), B(306, 318)] });
p.tryStroke({ ...ink, color: '#6a4448', width: 5.5, opacity: 1, points: [B(346, 302), B(358, 288), B(352, 274)] });
p.tryStroke({ color: '#4a3a40', width: 4, opacity: 0.8, points: [B(350, 270), B(330, 258), B(302, 262)] });
for (const [fy, len] of [[280, 34], [270, 28]]) p.tryStroke({ color: '#fffbee', width: 4, opacity: 0.7, points: [B(336, fy), B(336 + len, fy - 8)] });

// ---------------------------------------------------------------- Aruruu
{
  const seat = B(70, 374), k = 0.66;
  const A = (fx, fy, rad) => (rad == null ? [seat[0] + fx * k, seat[1] - fy * k] : [seat[0] + fx * k, seat[1] - fy * k, rad * k]);
  const robe = { shadow: '#8b859e', half: '#c5bec6', lit: '#fff2da', rim: '#fffbe8', bounce: '#a39cb4' };
  const hair = { shadow: '#2a1c18', half: '#4c3224', lit: '#8a6040', rim: '#e9b97a', bounce: '#3a2a2c' };
  const skin = { shadow: '#9a6856', half: '#cf987a', lit: '#f8d0a8', rim: '#ffe9ca', bounce: '#a87868' };
  const boot = { shadow: '#3c2a24', half: '#60442e', lit: '#9a7448', rim: '#e0bc88', bounce: '#4a3830' };
  const a = { ...o, width: 5, length: 15, dash: 12, gap: 6 };
  solid(p, [A(-4, 10, 21), A(38, -40, 18), A(36, -80, 15)], robe, a);                           // her leg, down his side
  solid(p, [A(36, -76, 14), A(34, -112, 15)], boot, a);
  p.tryStroke({ color: '#3f62a8', width: 4, opacity: 0.9, points: [A(20, -72), A(54, -74)] });   // the blue edge of her robe
  solid(p, [A(-14, 128, 12), A(-32, 92, 11), A(-38, 52, 9.5), A(-34, 22, 8)], hair, a);          // one of the two tails of her hair, down her back
  solid(p, [A(-6, 14, 30), A(-2, 66, 28), A(0, 88, 24)], robe, a);                              // her body
  p.tryStroke({ brush: 'bristle', color: '#6c2634', width: 6, mix: 0.1, dry: 0, rag: 0.1, points: [A(-32, 30), A(-4, 24), A(26, 30)] });         // her belt
  solid(p, [A(0, 84, 13), A(22, 46, 12), A(46, 24, 10)], robe, a);                              // her arm, forward to hold his fur
  p.tryStroke({ color: '#3f62a8', width: 4, opacity: 0.9, points: [A(36, 16), A(52, 36)] });
  solid(p, [A(48, 24, 8), A(58, 18, 7)], skin, { ...a, edge: false });
  solid(p, [A(2, 100, 9), A(4, 110, 9)], skin, { ...a, edge: false });                          // neck
  solid(p, [A(22, 126, 15), A(26, 114, 11)], skin, a);                                          // her face, turned to the sun
  solid(p, [A(0, 134, 30), A(2, 142, 27)], hair, a);                                            // her hair
  solid(p, [A(-2, 156, 11), A(-18, 144, 10.5), A(-28, 124, 9)], robe, a);                       // her ear: white
  p.tryStroke({ brush: 'bristle', color: '#6a4630', width: 4.8, mix: 0.1, dry: 0, rag: 0.1, cap: 'round', points: [A(-24, 134), A(-31, 113)] });   // with a brown tip
  p.tryStroke({ brush: 'bristle', color: '#3c6cc4', width: 5.5, mix: 0.1, dry: 0, rag: 0.1, cap: 'round', points: [A(-24, 136), A(-10, 114)] });   // the blue tie on her hair
}

p.save();
