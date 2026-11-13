// Albert Cloudsley, on the edge, in the instant after the push: weight forward on a bent leg,
// both arms still thrust out, coat tails flying behind him. A long nose, a hard eye, a
// powdered wig under a three-cornered hat.
'use strict';
const { studio, open, INK, part, ink, dash, spot, beside } = require('./scene');
const { mix, arc } = studio;

const p = open('albert');

const coat = '#1f4b52', coatLit = '#46908a', coatDark = '#122f39';
const cloth = '#cdb994', clothLit = '#f2deb0', clothDark = '#8e7f69';
const skin = '#d9a183', skinLit = '#f8c89c', skinDark = '#a2685c';
const wig = '#e3ddd0', wigDark = '#a59fa6', black = '#1c1626', gold = '#e3b23e';

// His shadow, thrown back along the ground away from the sun.
p.stroke({ brush: 'soft', color: '#120e1c', width: 60, opacity: 0.5, taper: [0, 0.6], points: [[880, 812], [700, 826], [520, 846]] });

// The far arm, then the far leg: stepping forward, knee bent.
part(p, [[892, 548], [922, 546], [950, 544]], 27, coatDark, { lit: coat });
part(p, [[950, 544], [976, 540], [1000, 535]], 23, coatDark, { lit: coat });
dash(p, [1000, 524], [1002, 548], 9, '#efe8da');                                   // lace at the wrist
part(p, [[1004, 535], [1018, 533], [1032, 532]], 13, skinDark, { lit: skin });
part(p, [[864, 664], [880, 698], [894, 730]], 35, clothDark, { lit: cloth });
part(p, [[894, 730], [893, 762], [890, 792]], 25, '#cfc8b8', { lit: '#f4eedf', shade: '#948e8a' });
part(p, [[880, 801], [900, 800], [918, 796]], 15, black, { lit: '#4a4058' });
dash(p, [888, 794], [900, 792], 4.4, '#cfd3dc');                                    // buckle

// The near leg: straight, driving off the ground.
part(p, [[848, 664], [840, 700], [834, 734]], 35, cloth, { lit: clothLit, shade: clothDark });
part(p, [[834, 734], [828, 768], [822, 800]], 26, '#e6dfce', { lit: '#fffaea', shade: '#a39c96' });
part(p, [[806, 810], [826, 808], [844, 806]], 16, black, { lit: '#4a4058' });
dash(p, [816, 802], [828, 801], 4.4, '#cfd3dc');
dash(p, [826, 730], [846, 736], 6, gold);                                           // knee buckle

// The coat: tails flung out behind, then the body in two strokes.
part(p, [[846, 640], [814, 684], [778, 716], [744, 728]], 34, coatDark, { lit: coat, taper: [0, 0.5], ink: false });
ink(p, [[832, 634], [800, 678], [768, 706], [742, 722]], 4.4);
ink(p, [[862, 652], [828, 694], [790, 726], [746, 734]], 4.4);
part(p, [[858, 646], [836, 700], [806, 752]], 34, coat, { lit: coatLit, shade: coatDark, taper: [0, 0.4], ink: false });
ink(p, [[842, 644], [822, 696], [800, 748]], 4.4);
ink(p, [[874, 650], [850, 706], [812, 756]], 4.4);
part(p, [[876, 548], [862, 596], [848, 648]], 44, coat, { shade: coatDark, ink: false });
part(p, [[904, 554], [890, 600], [876, 652]], 40, coat, { lit: coatLit, ink: false });
ink(p, [[854, 540], [840, 594], [826, 650]], 4.6);                                  // his back
ink(p, [[926, 558], [912, 604], [896, 656]], 4.6);                                  // his front
part(p, [[916, 566], [906, 606], [894, 644]], 15, '#d9c9a0', { lit: '#fbeccb', ink: false });   // waistcoat
for (const [x, y] of [[911, 580], [905, 602], [898, 624]]) dash(p, [x - 3, y], [x + 3, y + 1], 4.2, gold);   // buttons
part(p, [[900, 536], [908, 548], [914, 560]], 13, '#efe8da', { lit: '#ffffff' });   // cravat

// The near arm, thrust out with the hand still open.
part(p, [[884, 558], [912, 562], [940, 566]], 28, coat, { lit: coatLit, shade: coatDark });
part(p, [[940, 566], [966, 566], [992, 562]], 25, coat, { lit: coatLit, shade: coatDark });
dash(p, [992, 550], [994, 576], 10, '#f4eee0');                                     // lace
part(p, [[998, 562], [1014, 560], [1028, 557]], 15, skin, { lit: skinLit, shade: skinDark });
for (const [x, y, a] of [[1030, 549], [1034, 557], [1031, 565]].map(([x, y], i) => [x, y, -0.35 + i * 0.3])) {
  dash(p, [x, y], [x + Math.cos(a) * 13, y + Math.sin(a) * 13], 5, skinLit);       // fingers
}

// The head, in profile. First the wig and its tail, then the face.
const hx = 912, hy = 494;
part(p, [[hx - 22, hy + 28], [hx - 38, hy + 46], [hx - 52, hy + 66]], 11, wig, { shade: wigDark });      // the queue
dash(p, [hx - 34, hy + 36], [hx - 26, hy + 46], 6, black);                                             // its ribbon
for (const [x, y] of [[hx - 30, hy + 2], [hx - 26, hy + 20], [hx - 16, hy + 32]]) spot(p, x, y, 8, wig);   // curls at the side
for (const [x, y] of [[hx - 30, hy + 2], [hx - 26, hy + 20], [hx - 16, hy + 32]]) p.stroke({ color: wigDark, width: 4.2, opacity: 0.8, points: arc(x, y, 7.5, 1.2, 3.6, 6) });
spot(p, hx - 4, hy - 2, 24, skin);                                                                     // the skull
part(p, [[hx + 22, hy - 26], [hx + 28, hy], [hx + 20, hy + 32]], 22, skin, { ink: false });             // the face front
part(p, [[hx - 12, hy + 24], [hx + 8, hy + 30], [hx + 28, hy + 30]], 20, skin, { ink: false });         // jaw
p.stroke({ color: skinLit, width: 8, opacity: 0.9, points: [[hx + 30, hy - 24], [hx + 35, hy - 2], [hx + 28, hy + 22]] });   // the sun on his face
p.stroke({ color: skinDark, width: 9, opacity: 0.7, points: [[hx - 14, hy + 12], [hx - 2, hy + 26], [hx + 16, hy + 34]] });  // under the cheek
part(p, [[hx + 30, hy - 10], [hx + 54, hy + 4], [hx + 60, hy + 14]], 13, '#de9480', { lit: skinLit, taper: [0, 0.3] });   // the nose
ink(p, [[hx + 22, hy - 30], [hx + 34, hy - 16], [hx + 38, hy - 6]], 4.2);                               // brow ridge and forehead
ink(p, [[hx + 44, hy + 20], [hx + 34, hy + 22], [hx + 36, hy + 34], [hx + 30, hy + 44]], 4.2);          // upper lip to chin
ink(p, [[hx + 30, hy + 44], [hx + 8, hy + 42], [hx - 12, hy + 34]], 4.2);                               // jaw line
spot(p, hx + 16, hy - 6, 8, '#fdf6e6');                                                                // the eye, wide
ink(p, arc(hx + 16, hy - 6, 12.5, 0, 6.283, 14), 4.2);
spot(p, hx + 21, hy - 5, 4.2, black);
dash(p, [hx - 2, hy - 26], [hx + 34, hy - 13], 7, black);                                               // the brow, drawn down
dash(p, [hx + 20, hy + 30], [hx + 40, hy + 27], 4.6, '#5a2430');                                        // the mouth, a hard line
dash(p, [hx - 16, hy + 2], [hx - 14, hy + 16], 7, skinDark);                                            // ear
p.stroke({ color: wig, width: 13, points: arc(hx - 4, hy - 2, 30, 2.0, 4.3, 10) });                    // wig over the back of the head
p.stroke({ color: wigDark, width: 4.4, opacity: 0.8, points: arc(hx - 4, hy - 2, 36.5, 2.1, 4.2, 10) });

// The hat: a low crown and a brim turned up into three corners, edged with gold.
part(p, [[hx - 28, hy - 44], [hx - 2, hy - 50], [hx + 26, hy - 46]], 24, black, { lit: '#3d3350' });
part(p, [[hx - 52, hy - 34], [hx - 8, hy - 30], [hx + 34, hy - 36], [hx + 64, hy - 30]], 13, black, { lit: '#3d3350' });
part(p, [[hx - 52, hy - 34], [hx - 40, hy - 50], [hx - 26, hy - 58]], 10, black, { lit: '#3d3350' });
p.stroke({ color: gold, width: 4.2, opacity: 0.95, points: [[hx - 46, hy - 28], [hx - 8, hy - 23.5], [hx + 32, hy - 29.5], [hx + 60, hy - 24]] });

// The idol's light on his back, the low sun on his front.
p.tryStroke({ color: '#ffd45a', width: 4.4, opacity: 0.7, points: [[850, 548], [836, 596], [823, 646]] });
p.tryStroke({ color: '#ffd45a', width: 4.4, opacity: 0.6, points: [[770, 708], [800, 696], [826, 668]] });
p.tryStroke({ color: '#ffd45a', width: 4.4, opacity: 0.55, points: [[816, 738], [810, 770], [806, 798]] });
p.tryStroke({ color: '#ffe0a0', width: 4.4, opacity: 0.8, points: [[930, 560], [918, 604], [903, 652]] });

p.save();
