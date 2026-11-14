// Shirou. He is far off and small: a boy who walks toward the hill, with his back to us. His
// hair is the color of rust. His shirt is white, with blue sleeves, and he has in each hand
// one of the two short swords, the white one and the black one. The glare is beyond him, so
// he is dark, with fire down both his sides, and his shade comes straight toward us.
'use strict';
const { studio, open, HORIZON, EYE, GLOW, SHIROU } = require('./scene');
const { mix, disc, arc } = studio;

const p = open('shirou');
const r = p.rng;
const S = (SHIROU.y - HORIZON) / EYE / 100;                               // units of the picture to a centimetre of him
const B = (fx, fy) => [SHIROU.x + fx * S, SHIROU.y - fy * S];
const line = { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.08, cap: 'round' };
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts.map(([x, y]) => B(x, y)) });
const fire = () => mix('#ff9c40', '#ffe090', r());

// his shade, on the plain: long, straight away from the glare
{ const dx = SHIROU.x - GLOW.x, dy = SHIROU.y - HORIZON, l = Math.hypot(dx, dy), len = 120;
  for (const [w, op] of [[34, 0.3], [20, 0.36]]) p.stroke({ brush: 'soft', color: '#1a0808', width: w, opacity: op, taper: [0, 0.5], points: [[SHIROU.x, SHIROU.y - 1], [SHIROU.x + dx / l * len * 0.5, SHIROU.y + dy / l * len * 0.5], [SHIROU.x + dx / l * len, SHIROU.y + dy / l * len]] }); }
// the glare, a little, in the air round his head and shoulders
p.stroke({ brush: 'soft', color: '#fff0b0', width: 60, opacity: 0.16, points: [B(-100, 140), B(0, 150), B(100, 140)] });

// the two swords: short, wide, bent. The one in his left hand is black; the one in his right hand is white.
mark([[-22, 84], [-27, 60], [-36, 34]], '#120a0c', 6.4, { taper: [0, 0.6] }); mark([[-25, 80], [-31, 58], [-38, 36]], '#ff8c38', 4, { opacity: 0.8, taper: [0.2, 0.5] });
mark([[22, 84], [27, 60], [36, 34]], '#b8a898', 6.4, { taper: [0, 0.6] }); mark([[25, 80], [31, 58], [38, 36]], '#fff4d0', 4, { opacity: 0.95, taper: [0.2, 0.5] });
// his legs: he is in the middle of a step. Blue cloth, dark against the light.
mark([[-6, 86], [-7.5, 46], [-9.5, 3]], '#161c30', 7.6); mark([[6, 86], [8, 50], [6.5, 9]], '#1c2238', 7.4);
mark([[-15, 2.4], [-4, 2.4]].map(([x, y], i) => [x + (i ? 1 : -1) * 4.4, y]), '#0c0808', 5.2); mark([[2, 8.6], [12, 8.6]].map(([x, y], i) => [x + (i ? 1 : -1) * 4.8, y]), '#0c0808', 5);   // his shoes
// his shirt: the white of its back is grey in the shade; the sleeves and the shoulders are blue
for (const [fx, c] of [[-8.6, '#7c6c70'], [0, '#94848a'], [8.6, '#8a7a7c']]) mark([[fx * 0.86, 88], [fx, 112], [fx * 1.06, 136]], c, 7.4);
mark([[-15, 139], [0, 142.5], [15, 139]], '#2a3260', 7);                                                       // the blue across his shoulders
mark([[-16, 136], [-20.5, 112], [-22, 92]], '#222a54', 6.6); mark([[16, 136], [20.5, 112], [22, 92]], '#262e5a', 6.6);   // his arms
mark([[-22, 94], [-22.4, 74.4]], '#8c5c48', 5.6); mark([[22, 94], [22.4, 74.4]], '#9c6c54', 5.6);                 // his hands, round the grips
// the fire of the glare down both his sides
mark([[-11.6, 80], [-12.6, 46], [-14.8, 6]], fire(), 4, { opacity: 0.5 }); mark([[11.4, 80], [13.2, 50], [11.8, 12]], fire(), 4, { opacity: 0.5 });
mark([[-21, 134], [-25.6, 112], [-27, 92]], fire(), 4, { opacity: 0.6 }); mark([[21, 134], [25.6, 112], [27, 92]], fire(), 4, { opacity: 0.6 });
mark([[-17, 143.6], [-6, 146.4]].map(([x, y], i) => [x - (i ? 0 : 3.4), y]), fire(), 4, { opacity: 0.8 }); mark([[6, 146.4], [17, 143.6]].map(([x, y], i) => [x + (i ? 3.4 : 0), y]), fire(), 4, { opacity: 0.8 });
// his head: we see only his hair, which stands up in points
{ const [hx, hy] = B(0, 156.5), R = 7.6;
  disc(p, hx, hy, R, '#5c2410', 6.2, { ...line });
  for (const a of [-2.3, -1.5, -0.8]) p.tryStroke({ ...line, color: '#6c2c12', width: 5, taper: [0, 0.7], points: [[hx + Math.cos(a) * (R - 6), hy + Math.sin(a) * (R - 6)], [hx + Math.cos(a) * (R - 0.5), hy + Math.sin(a) * (R - 0.5)], [hx + Math.cos(a - 0.25) * (R + 4.2), hy + Math.sin(a - 0.25) * (R + 4.2)]] });   // short ones: he has cut it close
  p.tryStroke({ brush: 'round', color: '#ffb458', width: 4, opacity: 0.9, points: arc(hx, hy, R, -3.3, -1.9, 6) });
  p.tryStroke({ brush: 'round', color: '#ffc468', width: 4, opacity: 0.9, points: arc(hx, hy, R, -1.2, 0.2, 6) }); }

p.save();
