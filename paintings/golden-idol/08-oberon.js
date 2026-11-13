// Oberon Geller, already off the edge: tipping backward into the air in front of the sun,
// one hand still reaching for Albert, the other flung wide, his mouth open, his hat and his
// papers leaving him.
'use strict';
const { studio, open, INK, SUN, part, ink, dash, spot } = require('./scene');
const { mix, arc } = studio;

const p = open('oberon');

const coat = '#7c2f36', coatLit = '#c0584c', coatDark = '#4a1c2a';
const vest = '#c99a3c', vestLit = '#f0c860', vestDark = '#8a6426';
const cloth = '#4a3430', clothLit = '#7a5848';
const skin = '#d49a80', skinLit = '#f6c49a', skinDark = '#9c6258';
const wig = '#e3ddd0', wigDark = '#a59fa6', black = '#1c1626';

// The far arm, reaching back toward the hands that pushed him.
part(p, [[1120, 598], [1098, 574], [1078, 550]], 30, coatDark, { lit: coat });
part(p, [[1078, 550], [1062, 530], [1048, 512]], 24, coatDark, { lit: coat });
dash(p, [1038, 520], [1056, 506], 10, '#efe8da');
part(p, [[1046, 510], [1036, 498], [1028, 486]], 15, skinDark, { lit: skin });
for (const a of [-2.5, -2.1, -1.7]) dash(p, [1028, 486], [1028 + Math.cos(a) * 13, 486 + Math.sin(a) * 13], 5, skin);   // fingers, spread

// The far leg, its heel just leaving the rock.
part(p, [[1040, 692], [1012, 712], [984, 732]], 34, mix(cloth, black, 0.3), { lit: cloth });
part(p, [[990, 728], [974, 754], [960, 780]], 25, '#cfc8b8', { lit: '#f4eedf', shade: '#948e8a' });
part(p, [[964, 790], [950, 776], [938, 760]], 15, black, { lit: '#4a4058' });

// Coat tails, hanging straight down as he tips.
part(p, [[1058, 702], [1076, 746], [1086, 792]], 32, coatDark, { lit: coat, taper: [0, 0.5], ink: false });
ink(p, [[1044, 708], [1062, 750], [1078, 790]], 4.4);
ink(p, [[1074, 698], [1092, 744], [1094, 790]], 4.4);

// The near leg, kicking at nothing.
part(p, [[1048, 702], [1064, 736], [1078, 768]], 36, cloth, { lit: clothLit });
part(p, [[1078, 768], [1064, 800], [1050, 830]], 26, '#e6dfce', { lit: '#fffaea', shade: '#a39c96' });
part(p, [[1040, 838], [1056, 846], [1072, 852]], 16, black, { lit: '#4a4058' });
dash(p, [1052, 838], [1062, 842], 4.4, '#cfd3dc');

// The body: a round belly under a mustard waistcoat, the red coat open over it.
part(p, [[1150, 612], [1108, 660], [1066, 706]], 44, coat, { lit: coatLit, ink: false });          // his back, toward the sun
part(p, [[1124, 586], [1080, 634], [1040, 682]], 44, vest, { shade: vestDark, ink: false });       // his front, toward Albert
part(p, [[1138, 600], [1094, 648], [1054, 694]], 40, vest, { lit: vestLit, ink: false });
ink(p, [[1110, 570], [1062, 618], [1020, 668]], 4.6);                                              // the line of the belly
ink(p, [[1166, 626], [1124, 674], [1082, 720]], 4.6);                                              // the line of the back
ink(p, [[1146, 610], [1102, 658], [1062, 704]], 4.2, { opacity: 0.6 });                            // the edge of the coat
for (const [x, y] of [[1112, 606], [1090, 630], [1068, 654], [1048, 676]]) dash(p, [x - 3, y - 3], [x + 3, y + 3], 4.4, black);   // buttons
part(p, [[1118, 584], [1130, 596], [1142, 606]], 14, '#efe8da', { lit: '#ffffff' });               // cravat

// The near arm, flung out and back.
part(p, [[1140, 590], [1178, 600], [1214, 608]], 31, coat, { lit: coatLit, shade: coatDark });
part(p, [[1214, 608], [1244, 596], [1272, 582]], 26, coat, { lit: coatLit, shade: coatDark });
dash(p, [1266, 572], [1282, 594], 11, '#f4eee0');
part(p, [[1276, 580], [1292, 572], [1306, 562]], 16, skin, { lit: skinLit, shade: skinDark });
for (const a of [-1.2, -0.75, -0.3, 0.15]) dash(p, [1306, 562], [1306 + Math.cos(a) * 14, 562 + Math.sin(a) * 14], 5, skinLit);

// The head, tipped back: bulging eyes, a red nose, the mouth wide open.
{
  const cx = 1180, cy = 532, t = -0.5, co = Math.cos(t), si = Math.sin(t);
  const F = (u, v) => [cx + u * co - v * si, cy + u * si + v * co];                   // a place on the face
  for (const [u, v] of [[40, -10], [44, 10], [38, 28], [-42, -4], [-44, 16]]) spot(p, ...F(u, v), 9, wig);      // wig curls at both sides
  for (const [u, v] of [[40, -10], [44, 10], [38, 28], [-42, -4], [-44, 16]]) p.stroke({ color: wigDark, width: 4.2, opacity: 0.8, points: arc(...F(u, v), 8.5, 0.6, 3, 6) });
  spot(p, cx, cy, 29, skin);                                                         // the face, round
  part(p, [F(-26, 30), F(0, 38), F(26, 30)], 22, skin, { ink: false });               // chin and jowls
  p.stroke({ color: skinDark, width: 9, opacity: 0.6, points: [F(-34, 6), F(-26, 30), F(-6, 44)] });
  p.stroke({ color: skinLit, width: 9, opacity: 0.85, points: [F(30, -24), F(38, 2), F(28, 30)] });
  ink(p, arc(cx, cy, 44, t - 3.6, t + 0.5, 20), 4.4);                                // the outline of the skull
  ink(p, [F(-36, 22), F(-22, 44), F(0, 50), F(22, 44), F(36, 22)], 4.4);              // the outline of the jaw
  p.stroke({ color: wig, width: 12, points: arc(cx, cy, 36, t - 2.7, t - 0.45, 10) });   // the wig over his brow
  for (const [u, big] of [[-15, 1], [13, 1]]) {
    spot(p, ...F(u, -8), 8.5, '#fdf6e6');                                            // eyes, starting out of his head
    ink(p, arc(...F(u, -8), 13.2, 0, 6.283, 14), 4.2);
    spot(p, ...F(u - 4, -11), 4.2, black);
    p.stroke({ color: black, width: 5.5, points: [F(u - 14, -27), F(u, -32), F(u + 13, -26)] });   // brows, up
  }
  spot(p, ...F(-1, 8), 6.5, '#d86a5c');                                              // the nose
  dash(p, F(-3, 4), F(5, 3), 4.2, '#f7b0a0', { opacity: 0.8 });
  spot(p, ...F(-1, 31), 9, '#3a1220');                                               // the open mouth
  dash(p, F(-8, 23), F(6, 23), 4.6, '#f7f1e2');                                       // teeth
  dash(p, F(-6, 37), F(5, 37), 5, '#c0424c', { opacity: 0.9 });                       // tongue
}

// His hat, tumbling away above him.
part(p, [[1236, 408], [1262, 396], [1288, 392]], 24, black, { lit: '#3d3350' });
part(p, [[1214, 432], [1250, 414], [1292, 408], [1318, 416]], 13, black, { lit: '#3d3350' });
p.stroke({ color: '#e3b23e', width: 4.2, opacity: 0.95, points: [[1218, 438], [1252, 421], [1292, 415], [1314, 422]] });

// Papers from his pocket, turning in the air.
for (const [x, y, a, w] of [[1352, 520, -0.5, 22], [1390, 640, 0.35, 20], [1300, 716, -0.2, 18], [1196, 760, 0.6, 16]]) {
  const c = Math.cos(a), s = Math.sin(a), len = w * 2.2;
  p.stroke({ brush: 'flat', color: '#efe3c4', width: w, rag: 0, cap: 'flat', jitter: 0.2, points: [[x - c * len / 2, y - s * len / 2], [x + c * len / 2, y + s * len / 2]] });
  p.tryStroke({ color: '#fff7de', width: 4.2, opacity: 0.8, points: [[x - c * len / 2 + s * w * 0.4, y - s * len / 2 - c * w * 0.4], [x + c * len / 2 + s * w * 0.4, y + s * len / 2 - c * w * 0.4]] });
  for (const k of [-0.18, 0.12]) p.tryStroke({ color: '#6a5a66', width: 4, opacity: 0.6, points: [[x - c * len * 0.3 - s * w * k, y - s * len * 0.3 + c * w * k], [x + c * len * 0.3 - s * w * k, y + s * len * 0.3 + c * w * k]] });
}

// The sun behind him: a thin edge of light round his head, shoulder and arm.
p.tryStroke({ color: '#fff0b8', width: 4.4, opacity: 0.9, points: arc(1180, 532, 47.5, -1.9, 0.35, 12) });
p.tryStroke({ color: '#ffe0a0', width: 4.4, opacity: 0.8, points: [[1170, 630], [1128, 678], [1088, 722]] });
p.tryStroke({ color: '#ffe0a0', width: 4.4, opacity: 0.8, points: [[1146, 574], [1182, 583], [1216, 591]] });

p.save();
