// Oberon Geller, already off the edge: falling backward into the air in front of the sun,
// one hand still reaching for Albert, the other flung wide, his hat and his papers leaving
// him. The sun is behind him, so he is a dark shape with light round its edges.
'use strict';
const { studio, open, SUN, SUNLIGHT, dash } = require('./scene');
const { mix, solid, glint } = studio;

const p = open('oberon');
const r = p.rng;
const o = { light: SUNLIGHT, turn: 0.4 };

const coat = { shadow: '#1a0b15', half: '#3a1620', lit: '#8c3c30', rim: '#ffcc6a', bounce: '#30203c' };
const coatFar = { shadow: '#150912', half: '#2c111a', lit: '#6c2c28', rim: '#ffc060' };
const vest = { shadow: '#32241c', half: '#5e4424', lit: '#c4963e', rim: '#ffe9a0' };
const cloth = { shadow: '#181014', half: '#30221f', lit: '#74543e', rim: '#ffc878', bounce: '#2c2238' };
const hose = { shadow: '#343046', half: '#625c72', lit: '#dcc4a6', rim: '#fff2d0', bounce: '#48466a' };
const skin = { shadow: '#452a30', half: '#845246', lit: '#e6a276', rim: '#ffe6b0' };
const wig = { shadow: '#4e4a62', half: '#827c90', lit: '#eee2ce', rim: '#fffbe8' };
const dark = { shadow: '#0b0812', half: '#18121f', lit: '#44364a', rim: '#ffb860' };

// The far arm, reaching back toward the hands that pushed him.
solid(p, [[[1148, 574, 15], [1108, 544, 13], [1074, 514, 12]], [[1076, 516, 14], [1066, 507, 14]]], coatFar, o);
solid(p, [[1061, 503, 7], [1052, 494, 7.5], [1045, 486, 5.5]], skin, o);
for (const a of [-2.75, -2.3, -1.85]) dash(p, [1045, 486], [1045 + Math.cos(a) * 12.4, 486 + Math.sin(a) * 12.4], 4.2, mix('#7c4c44', '#c88868', r()));   // fingers, spread

// The far leg, trailing back toward the rock it has just left.
solid(p, [[1082, 656, 19], [1058, 678, 17], [1034, 700, 13]], { ...cloth, lit: '#5c4234' }, o);
solid(p, [[1034, 700, 12], [1010, 724, 13], [986, 752, 8]], hose, o);
solid(p, [[[990, 764, 7], [976, 752, 7.5], [964, 740, 5.5]]], dark, o);

// Coat tails, hanging straight down as he tips.
solid(p, [[1098, 668, 17], [1112, 706, 20], [1120, 748, 10]], coat, { ...o, length: 32 });

// The near leg, kicking at nothing.
solid(p, [[1088, 666, 20], [1098, 698, 18], [1108, 730, 13.5]], cloth, o);
solid(p, [[1108, 730, 12.5], [1095, 759, 13.5], [1078, 788, 8]], hose, o);
solid(p, [[[1066, 794, 7], [1082, 802, 8], [1098, 808, 5.5]]], dark, o);

// The body: a round belly under a mustard waistcoat, the red coat open over it.
solid(p, [[1088, 650, 29], [1112, 618, 37], [1142, 584, 28]], coat, { ...o, length: 30 });
solid(p, [[1078, 640, 17], [1100, 607, 25], [1130, 576, 17]], vest, { ...o, turn: 0.2 });
for (const [x, y] of [[1117, 577], [1101, 593], [1086, 611], [1074, 630]]) dash(p, [x - 4, y - 4], [x + 4, y + 4], 4, '#20140f', { opacity: 0.6 });   // buttons
dash(p, [1140, 566], [1150, 576], 6, '#b0a8ae', { brush: 'bristle', mix: 0.2, dry: 0, rag: 0, cap: 'round' });                                // cravat

// The near arm, flung out and back.
solid(p, [[[1158, 580, 17], [1186, 588, 15], [1212, 592, 13.5], [1250, 579, 12.5]], [[1248, 579, 14.5], [1262, 574, 14.5]]], coat, o);
dash(p, [1264, 564], [1270, 582], 5, '#b8b0b4', { brush: 'bristle', mix: 0.2, dry: 0, rag: 0, cap: 'round', opacity: 0.8 });                   // lace
solid(p, [[1272, 570, 7], [1282, 566, 7.5], [1292, 562, 6]], skin, o);
for (const a of [-1.15, -0.7, -0.25, 0.2]) dash(p, [1292, 562], [1292 + Math.cos(a) * 12.4, 562 + Math.sin(a) * 12.4], 4.2, mix('#a86a56', '#f0b488', r()));

// The head, tipped back, the mouth open.
solid(p, [[1154, 568, 9], [1164, 556, 9]], skin, o);                                                                                           // the neck
solid(p, [[[1190, 536, 8], [1192, 549, 9], [1183, 558, 7.5]], [[1166, 556, 7], [1176, 560, 6.5]]], wig, o);                                    // the wig, behind and below
solid(p, [[[1172, 547, 15.5], [1179, 538, 16]], [[1168, 541, 9.5], [1162, 544, 7.5]]], skin, { ...o, length: 18, edge: false });               // the skull and the jaw
dash(p, [1169, 529], [1160, 527], 5, '#7a4a42', { brush: 'bristle', mix: 0.15, dry: 0, rag: 0, cap: 'round' });                                // the nose
dash(p, [1165, 533], [1158, 541], 4.6, '#1c0a12');                                                                                             // the mouth
solid(p, [[1168, 528, 6], [1180, 522, 7], [1192, 527, 6.5]], wig, { ...o, turn: 0.1 });                                                        // the wig over his brow

// His hat, tumbling away above him.
solid(p, [[[1240, 412, 9], [1262, 402, 10], [1284, 398, 9]], [[1218, 434, 5.5], [1250, 418, 6], [1290, 411, 6], [1316, 418, 4.5]]], dark, { ...o, turn: 0.3 });

// Papers from his pocket, turning in the air with the light coming through them.
for (const [x, y, a, w] of [[1352, 520, -0.5, 20], [1392, 640, 0.35, 18], [1300, 716, -0.2, 17], [1196, 766, 0.6, 15]]) {
  const c = Math.cos(a), s = Math.sin(a), len = w * 2.3, glow = Math.exp(-Math.hypot(x - SUN.x, y - SUN.y) / 300);
  p.stroke({ brush: 'bristle', color: mix('#a8866a', '#f6dca6', glow), width: w, mix: 0.1, dry: 0, rag: 0.1, cap: 'flat', streak: 0.2, points: [[x - c * len / 2, y - s * len / 2], [x + c * len / 2, y + s * len / 2]] });
  p.tryStroke({ brush: 'bristle', color: mix('#e8cfa0', '#fff6d8', glow), width: Math.max(4.4, w * 0.45), mix: 0.15, dry: 0, rag: 0.1, cap: 'flat', opacity: 0.9, points: [[x - c * len / 2 + s * w * 0.22, y - s * len / 2 - c * w * 0.22], [x + c * len / 2 + s * w * 0.22, y + s * len / 2 - c * w * 0.22]] });
}

// The sun's glare, spilling over the edges of him.
for (const [x0, y0, x1, y1, w, op] of [[1098, 524, 1252, 552, 70, 0.2], [1088, 566, 1218, 596, 60, 0.12], [1208, 426, 1318, 398, 50, 0.1]]) {
  p.stroke({ brush: 'soft', color: '#ffe6a8', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2 - 4], [x1, y1]] });
}

p.save();
