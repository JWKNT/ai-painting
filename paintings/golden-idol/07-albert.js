// Albert Cloudsley, on the edge, in the instant after the push: weight forward on a bent
// leg, both arms still thrust out, coat tails flying. He stands against the evening sky, so
// he is mostly dark. The sun finds the front of him, his face and his hands, and the idol
// behind him puts a thin gold edge along his back.
'use strict';
const { studio, open, SUNLIGHT, dash } = require('./scene');
const { mix, solid, glint } = studio;

const p = open('albert');
const r = p.rng;
const o = { light: SUNLIGHT, turn: 0.3 };

const coat = { shadow: '#0d1820', half: '#1a363e', lit: '#557f6e', rim: '#ffb060', bounce: '#27284a' };
const coatFar = { shadow: '#0a131a', half: '#13272e', lit: '#35594f', rim: '#f09850' };
const buff = { shadow: '#2e2738', half: '#544652', lit: '#b8926e', rim: '#ffcf96', bounce: '#3c3858' };
const hose = { shadow: '#3a3650', half: '#6a6480', lit: '#d8c0a8', rim: '#fff0d0', bounce: '#4c4a70' };
const skin = { shadow: '#4c3038', half: '#8e5a50', lit: '#f0ac80', rim: '#ffe0b0' };
const dark = { shadow: '#0b0812', half: '#18121f', lit: '#44364a', rim: '#f0a058' };
const wig = { shadow: '#4c4860', half: '#807a90', lit: '#e8dccc', rim: '#fff4dc' };

// His shadow, thrown back along the ground away from the sun.
p.stroke({ brush: 'soft', color: '#0f0b18', width: 54, opacity: 0.5, taper: [0, 0.6], points: [[892, 810], [700, 826], [520, 848]] });
p.stroke({ brush: 'soft', color: '#0f0b18', width: 30, opacity: 0.45, points: [[806, 808], [860, 806], [916, 800]] });

// The far arm, and the far leg, which has stepped to the very edge and taken his weight.
solid(p, [[[900, 578, 12], [944, 566, 11], [980, 557, 10.5]], [[978, 557, 12.5], [990, 554, 12.5]]], coatFar, o);
solid(p, [[994, 553, 6.5], [1006, 550, 6.5], [1016, 548, 5]], skin, { ...o, turn: 0.1 });
solid(p, [[868, 676, 16], [886, 704, 14.5], [900, 731, 11.5]], buff, o);
solid(p, [[900, 731, 10.5], [900, 758, 11.5], [896, 790, 7]], hose, o);
solid(p, [[[884, 801, 6.5], [900, 799, 7.5], [915, 796, 5.5]]], dark, o);

// The near leg, straight, driving off the ground.
solid(p, [[854, 678, 16.5], [848, 708, 15], [842, 739, 11.5]], buff, o);
solid(p, [[842, 739, 10.5], [836, 763, 12], [829, 792, 7]], hose, o);
solid(p, [[[812, 806, 6.5], [829, 804, 8], [847, 802, 5.5]]], dark, o);

// The coat: the skirts flung out behind him, then the body, leaning into the push.
solid(p, [
  [[850, 656, 15], [832, 682, 17], [814, 702, 13], [800, 714, 7]],
  [[860, 666, 18], [848, 700, 22], [834, 732, 19], [824, 752, 11]],
], coat, { ...o, turn: 0.45, length: 34 });
solid(p, [[860, 670, 21], [868, 636, 21], [880, 604, 23], [890, 584, 20]], coat, { ...o, length: 30 });
solid(p, [[900, 596, 5.5], [893, 626, 6], [882, 660, 5.5]], { shadow: '#5c4c48', half: '#a88c6c', lit: '#f6d8a0', rim: '#fff0c8' }, { ...o, turn: -0.3 });   // the waistcoat, where the coat hangs open
for (const [x0, y0, x1, y1, w] of [[868, 604, 852, 664, 7], [840, 684, 820, 708, 6], [856, 700, 840, 746, 6]]) {                  // folds
  p.stroke({ brush: 'bristle', color: '#070d14', width: w, opacity: 0.6, mix: 0.2, dry: 0, rag: 0, cap: 'round', taper: [0.3, 0.4], points: [[x0, y0], [(x0 + x1) / 2 - 3, (y0 + y1) / 2], [x1, y1]] });
}

// The near arm, thrust out, the hand still open.
solid(p, [[[888, 586, 14.5], [914, 583, 13], [942, 578, 12], [972, 572, 11.5]], [[970, 572, 14], [986, 569, 14]]], coat, { ...o, turn: 0.2 });
dash(p, [991, 561], [993, 578], 5, '#b8b0b4', { brush: 'bristle', mix: 0.2, dry: 0, rag: 0, cap: 'round', opacity: 0.8 });        // lace at the wrist
solid(p, [[998, 568, 7], [1009, 566, 7.5], [1019, 564, 6]], skin, { ...o, turn: 0.1 });
for (const [x, y, a] of [[1019, 559, -0.42], [1022, 564, -0.08], [1020, 569, 0.3]]) dash(p, [x, y], [x + Math.cos(a) * 12.4, y + Math.sin(a) * 12.4], 4.2, mix('#d89070', '#ffd2a0', r()));   // fingers
dash(p, [1004, 572], [1014, 578], 4.2, '#a86450', { opacity: 0.9 });                                                             // the thumb

// The head, in profile, pushed forward.
const hx = 908, hy = 536;
solid(p, [[898, 566, 8], [903, 552, 8]], skin, o);                                                                               // the neck
dash(p, [895, 565], [904, 575], 6, '#a8a2ac', { brush: 'bristle', mix: 0.2, dry: 0, rag: 0, cap: 'round' });                      // the cravat
solid(p, [[[hx - 12, hy - 8, 9], [hx - 16, hy + 6, 9], [hx - 13, hy + 15, 7]], [[hx - 15, hy + 15, 5.5], [hx - 25, hy + 28, 5], [hx - 34, hy + 40, 4]]], wig, { ...o, turn: 0.4 });   // the wig and its queue
dash(p, [hx - 23, hy + 19], [hx - 16, hy + 28], 4.6, '#0c0912');                                                                  // tied with black ribbon
solid(p, [[[hx - 1, hy - 8, 14], [hx + 1, hy + 4, 13.5]], [[hx + 3, hy + 6, 10], [hx + 8, hy + 13, 7]]], skin, { ...o, turn: 0.0, length: 18, edge: false });   // the skull and the jaw
dash(p, [hx + 11, hy - 4], [hx + 21, hy + 4], 5, '#d89474', { brush: 'bristle', mix: 0.15, dry: 0, rag: 0, cap: 'round' });       // the nose
glint(p, [[hx + 13, hy - 16], [hx + 15, hy - 4], [hx + 22, hy + 3], [hx + 14, hy + 8], [hx + 13, hy + 18]], () => '#ffd8a8', { width: 4, dash: 12, gap: 5, opacity: 0.8 });   // the sun down his profile
dash(p, [hx + 2, hy - 7], [hx + 12, hy - 6], 4.2, '#2a1820', { opacity: 0.55 });                                                  // the eye, lost in the shadow of the hat
// The hat: a low crown, the brim cocked up at the back and jutting over his brow.
solid(p, [[[hx - 16, hy - 23, 8.5], [hx - 2, hy - 28, 9.5], [hx + 13, hy - 25, 8.5]],
  [[hx - 31, hy - 16, 5.5], [hx - 8, hy - 19, 6], [hx + 16, hy - 16, 6], [hx + 36, hy - 10, 4.5]],
  [[hx - 24, hy - 21, 5], [hx - 6, hy - 31, 5], [hx + 16, hy - 26, 4.5]]], dark, { ...o, turn: 0.45 });

p.save();
