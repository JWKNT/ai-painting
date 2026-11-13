// The portrait of the Golden Witch, in its heavy gilt frame over the stairs, and under it the
// brass plate with her epitaph. It is an old dark picture: a woman in black standing by a
// curtain, golden hair, a white collar, a long pipe in her hand. The witch's light comes up
// across it from below.
'use strict';
const { studio, open, WITCH, nA, gold, lit, bar, post } = require('./scene');
const { mix, solid, glint, clamp, disc } = studio;

const p = open('portrait');
const r = p.rng;
const X0 = 668, X1 = 932, Y0 = 150, Y1 = 454;                         // the canvas inside the frame
const on = (x, y) => x > X0 && x < X1 && y > Y0 && y < Y1;

// The canvas: old dark paint, a little warmer behind her head.
p.fill({ inside: on, bounds: [X0, Y0, X1, Y1], width: 18, length: 80, spacing: 0.5, angle: (x, y) => Math.PI / 2 + (nA(x / 30, y / 30) - 0.5) * 0.6,
  color: (x, y) => mix(mix('#1a0f0c', '#0c0707', nA(x / 40, y / 40)), '#4a2a18', clamp(1 - Math.hypot(x - 800, (y - 230) * 0.8) / 150, 0, 1) * 0.6), stroke: { brush: 'bristle', opacity: 0.96, mix: 0.15, dry: 0.05 } });
for (const [x, w, c] of [[684, 22, '#2c080c'], [704, 16, '#4a1016'], [720, 12, '#22060a']]) post(p, x, Y0 + 4, Y1 - 4, w, () => c, { stroke: { opacity: 0.9 } });   // the curtain she stands by

// The painted figure.
const o = { light: { at: [WITCH.x, WITCH.y + 200] }, turn: 0.3, width: 5, length: 20, vary: 0.06, lights: false, dash: 14, gap: 8, edgeOpacity: 0.6 };
const black = { shadow: '#07050a', half: '#15101a', lit: '#3a2a36', rim: '#b08848' };
const flesh = { shadow: '#6a4a3c', half: '#b48c70', lit: '#ecc8a0', rim: '#ffe6c0' };
const blonde = { shadow: '#5a3e12', half: '#a8822c', lit: '#ecc866', rim: '#fff0b0' };
solid(p, [[800, 326, 32], [800, 370, 48], [800, 408, 58]], black, { ...o, length: 30 });        // the skirt
post(p, 800, 340, 448, 20, () => '#4c0b12', { stroke: { opacity: 0.9 } });                      // its red front
for (const dx of [-13, 13]) post(p, 800 + dx, 344, 446, 4.4, () => '#9a7428', { stroke: { opacity: 0.7 } });   // edged with gold
solid(p, [[800, 318, 25], [800, 284, 23], [800, 260, 29]], black, o);                            // the bodice
solid(p, [[[761, 258, 16], [765, 270, 15]], [[839, 258, 16], [835, 270, 15]]], black, o);        // the sleeves, full at the shoulder
solid(p, [[760, 272, 9], [752, 302, 8], [772, 326, 7]], black, o);                               // the arm at her waist
solid(p, [[840, 272, 9], [856, 296, 8], [846, 318, 7]], black, o);                               // the arm that holds the pipe
p.line(774, 327, 790, 331, { brush: 'bristle', color: '#d8b494', width: 6, mix: 0, dry: 0, rag: 0, cap: 'round' });
p.line(840, 318, 853, 314, { brush: 'bristle', color: '#d8b494', width: 6, mix: 0, dry: 0, rag: 0, cap: 'round' });
p.line(848, 316, 888, 290, { color: '#d8b050', width: 4 });                                      // the pipe
for (const [dx, a] of [[-18, 2.6], [-9, 2.1], [0, 1.57], [9, 1.05], [18, 0.55]]) {               // the white collar, standing out round her neck
  p.tryStroke({ brush: 'bristle', color: mix('#b8b0aa', '#e8e0d4', r()), width: 5.5, mix: 0.1, dry: 0, rag: 0.1, cap: 'round', points: [[800 + dx * 0.3, 240], [800 + dx * 0.3 + Math.cos(a) * 14, 240 + Math.sin(a) * 14]] });
}
p.line(800, 250, 800, 266, { brush: 'bristle', color: '#8a1420', width: 5.5, mix: 0, dry: 0, rag: 0, cap: 'round' });
solid(p, [[800, 232, 8], [800, 240, 8]], flesh, { ...o, edge: false });                          // her neck
solid(p, [[[800, 205, 19], [800, 208, 19]], [[813, 186, 10], [818, 184, 9]]], blonde, { ...o, length: 14 });   // her hair, piled up behind her head
disc(p, 800, 218, 14.5, '#c89c7c', 6.5, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round', streak: 0, jitter: 0 });   // her face
p.tryStroke({ brush: 'bristle', color: '#ecc8a0', width: 7, opacity: 0.8, mix: 0.2, dry: 0, rag: 0, cap: 'round', taper: [0.3, 0.3], points: [[806, 208], [809, 219], [804, 229]] });   // the light on her cheek
p.tryStroke({ brush: 'bristle', color: '#7a5644', width: 6, opacity: 0.7, mix: 0.2, dry: 0, rag: 0, cap: 'round', taper: [0.3, 0.3], points: [[792, 209], [789, 219], [794, 229]] });   // and the shadow on the other
solid(p, [[[788, 199, 8.5], [800, 195, 9.5], [812, 199, 8.5]], [[783, 212, 6.5], [780, 238, 6]], [[817, 212, 6.5], [820, 238, 6]]], blonde, { ...o, length: 14 });   // the hair over her brow, and a lock at either side
p.line(782, 190, 794, 186, { brush: 'bristle', color: '#c85a78', width: 6, mix: 0, dry: 0, rag: 0, cap: 'round' });   // the rose in it
p.stroke({ brush: 'soft', color: '#ffb850', width: 120, opacity: 0.12, points: [[720, 470], [840, 430], [960, 400]] });   // the witch's light, up across the paint

// The frame: gilt, heavy, bright where the gold light strikes its inner edges from below and
// from the right, cold along the side toward the window.
const gilt = (x, y) => lit(mix('#4a3210', '#7a5a1c', nA(x / 12, y / 12)), x, y, 1.2, 0.8);
bar(p, 648, 952, 140, 20, gilt);
bar(p, 648, 952, 464, 20, gilt);
post(p, 658, 130, 474, 20, gilt);
post(p, 942, 130, 474, 20, gilt);
const shine = (x, y) => mix('#8a6a20', '#ffe896', clamp(gold(x, y, 330) * 1.4, 0, 1));
bar(p, 670, 930, 455.5, 5, shine, { seg: 40 });
post(p, 931.5, 152, 452, 5, shine, { seg: 40 });
bar(p, 670, 930, 149, 4.4, (x, y) => mix('#5a4214', '#d8b860', clamp(gold(x, y, 330), 0, 1)), { seg: 40, stroke: { opacity: 0.8 } });
post(p, 668, 152, 452, 4.4, () => '#8c9ac8', { seg: 40, stroke: { opacity: 0.55 } });
for (const [x, y, sx, sy] of [[652, 134, 1, 1], [948, 134, -1, 1], [652, 470, 1, -1], [948, 470, -1, -1]]) {   // its carved corners
  p.stroke({ brush: 'bristle', color: shine(x, y), width: 7, opacity: 0.85, mix: 0.1, dry: 0, rag: 0.1, cap: 'round', points: [[x, y + sy * 16], [x + sx * 5, y + sy * 5], [x + sx * 16, y]] });
}

// The epitaph, on a brass plate under it.
bar(p, 722, 878, 500, 28, (x, y) => lit(mix('#4a3814', '#6a5220', nA(x / 10, y / 4)), x, y, 1.1, 0.5));
for (const [y, x0, x1] of [[491, 738, 862], [500, 738, 850], [509, 738, 866]]) bar(p, x0, x1, y, 4, () => '#20160a', { seg: 30, stroke: { opacity: 0.6, rag: 0.4 } });
glint(p, [[724, 487], [800, 486.5], [876, 487]], () => mix('#e8c060', '#fff0b0', r()), { width: 4, dash: 40, gap: 10, opacity: 0.7, rng: r });

p.save();
