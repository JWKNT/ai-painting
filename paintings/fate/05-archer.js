// Archer, on the top of the hill, his back to us. His hair is white and short. The red coat
// is in two parts: one covers his shoulders and his arms, and the other hangs from his waist
// to his ankles, open in the middle, and the wind takes it. Between them his body is in
// black. In his right hand is Bakuya, the white sword, and in his left is Kanshou, the black
// one: short, broad, curved blades, held low and out from his sides.
// The glare is in front of him and to his right, so he is dark, with fire along his right edge.
'use strict';
const { studio, open, ARCHER, GLOW, HORIZON } = require('./scene');
const { mix, clamp, smooth, solid, glint, noise2 } = studio;

const p = open('archer');
const r = p.rng;
const S = ARCHER.s;
const A = (fx, fy, rad) => (rad == null ? [ARCHER.x + fx * S, ARCHER.y - fy * S] : [ARCHER.x + fx * S, ARCHER.y - fy * S, rad * S]);
const back = (x, y) => [(x - ARCHER.x) / S, (ARCHER.y - y) / S];
const nF = noise2(613);
const o = { light: { at: [GLOW.x + 60, GLOW.y] }, turn: 0.5, width: 6.5, length: 26, vary: 0.05, dash: 22, gap: 8, edgeOpacity: 0.9 };
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round' };
const red = { shadow: '#4a1012', half: '#7e1816', lit: '#c8321e', rim: '#ffb060', bounce: '#5c1830' };
const black = { shadow: '#0a080c', half: '#18141a', lit: '#403640', rim: '#ffa850', bounce: '#1a1424' };
const skin = { shadow: '#4a2c20', half: '#7c4c30', lit: '#b87c4c', rim: '#ffc880', bounce: '#5a3430' };
const white = { shadow: '#7c7288', half: '#b8aeb8', lit: '#f0eae4', rim: '#fff6dc', bounce: '#8c80a0' };

// His shadow: it comes down the hill toward us, away from the glare.
{
  const [fx, fy] = A(0, 0), dx = fx - GLOW.x, dy = fy - HORIZON, l = Math.hypot(dx, dy);
  for (const [w, len, op] of [[60, 380, 0.5], [40, 520, 0.3]]) p.stroke({ brush: 'soft', color: '#140808', width: w, opacity: op, taper: [0, 0.5], points: [[fx, fy - 4], [fx + dx / l * len * 0.5, fy + dy / l * len * 0.5], [fx + dx / l * len, fy + dy / l * len]] });
}

// His boots and his legs.
for (const s of [-1, 1]) {
  solid(p, [A(s * 12, 5, 5.5), A(s * 15, 3, 5)], black, { ...o, length: 14 });
  solid(p, [A(s * 9, 94, 9), A(s * 11, 52, 7.5), A(s * 12, 10, 6)], black, { ...o, length: 34 });
  p.tryStroke({ ...line, color: '#6c5c5c', width: 5, opacity: 0.7, points: [A(s * 9, 30), A(s * 14, 28)].map(([x, y], i) => [x + (i ? 4 : -4), y]) });   // the plate on his boot
}

// The part of the coat that hangs from his waist. The wind is from the left: it carries the cloth out to the right, and lifts its hem.
{
  const down = (fy) => clamp((99 - fy) / 78, 0, 1);
  const halfW = (fy) => 14.5 + 26 * Math.pow(down(fy), 0.85), axis = (fy) => 22 * Math.pow(down(fy), 1.5);
  const hemAt = (fx) => 13 + 4 * Math.sin(fx / 6 + 1) + 3 * Math.sin(fx / 2.3) + 0.3 * Math.max(0, fx);   // the hem is ragged, and higher at the right, where the wind lifts it
  const split = (fx, fy) => fy < 58 && Math.abs(fx - axis(fy) * 0.7 + 1) < (58 - fy) * 0.09;    // it is open down the middle of the back, from the knee
  const inside = (x, y) => { const [fx, fy] = back(x, y); return fy < 100 && fy > hemAt(fx) && Math.abs(fx - axis(fy)) < halfW(fy) && !split(fx, fy); };
  const fan = (x, y) => { const [fx, fy] = back(x, y); return Math.atan2(104 - fy, fx - axis(fy) * 1.6); };
  const cloth = (x, y) => {
    const [fx, fy] = back(x, y), u = clamp((fx - axis(fy)) / halfW(fy), -1, 1), fold = Math.sin(Math.atan2(fx - 4, 150 - fy) * 30 + 0.4) * 0.5 + (nF(fx / 26, fy / 44) - 0.5) * 0.6;
    let c = fold > 0 ? mix('#70161a', '#b02a1c', clamp(fold * 1.5, 0, 1)) : mix('#70161a', '#2e0a10', clamp(-fold * 1.6, 0, 1));
    c = mix(c, '#e04a24', smooth(0.3, 1, u) * 0.4);                                             // the side of it that is toward the glare
    return mix(c, '#ffb060', smooth(0.9, 1, u) * 0.75 + smooth(6, 0, fy - hemAt(fx)) * 0.2);    // fire at its edge and a little along its hem
  };
  const box = [...A(-46, 102), ...A(76, 6)];
  p.fill({ inside, bounds: box, width: 9, length: 46, spacing: 0.5, angle: (x, y) => fan(x, y) + r.range(-0.05, 0.05), color: cloth, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.15, dry: 0.03, rag: 0.15, cap: 'round' } });
  p.fill({ inside, bounds: box, width: 5.5, length: 30, spacing: 1, overlap: 0.7, angle: (x, y) => fan(x, y) + r.range(-0.08, 0.08), color: (x, y) => cloth(x + r.range(-2, 2), y), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.15, dry: 0.03, rag: 0.2, cap: 'round' } });
  // the corner of it that the wind has got: one piece of the cloth that flies out to the right and comes to a point
  const tip = [84, 47];
  for (const [bx, by, w, c] of [[37, 31, 12, '#4a1014'], [40, 40, 13, '#7a1818'], [41, 50, 13, '#a82a1c'], [38, 60, 12, '#c8361e']]) {
    p.stroke({ ...line, cap: 'flat', color: c, width: w * S * 0.55, taper: [0, 0.85], points: [A(bx, by), A((bx + tip[0]) / 2, (by + tip[1]) / 2 + (by > 45 ? 2 : -2)), A(tip[0] - (60 - by) * 0.2, tip[1] + (by - 45) * 0.12)] });
  }
  glint(p, [A(38, 65), A(60, 59), A(82, 49)], () => mix('#ff9c50', '#ffd088', r()), { width: 4.2, dash: 30, gap: 10, opacity: 0.8, rng: r });
}

// His body: black, with lines of silver across it; then the part of the coat that covers his shoulders and his arms.
solid(p, [A(0, 99, 13.5), A(0, 114, 14), A(0, 128, 16)], black, { ...o, length: 26 });
for (const fy of [104, 114]) glint(p, [A(-12, fy), A(0, fy - 1), A(13, fy)], () => mix('#8c8088', '#d8c8b8', r()), { width: 4, dash: 18, gap: 6, opacity: 0.7, rng: r });
p.stroke({ ...line, cap: 'flat', color: '#b8aca0', width: 5.5, opacity: 0.85, points: [A(-14, 99), A(0, 98), A(15, 99)] });                    // the band at his waist
solid(p, [A(0, 127, 16.5), A(0, 140, 18), A(0, 150, 16)], red, { ...o, length: 28 });                                                            // his upper back
for (const s of [-1, 1]) solid(p, [A(0, 157, 6), A(s * 12, 155, 7), A(s * 20, 150, 7.5)], red, { ...o, length: 20 });                            // his shoulders, which slope down from his neck
for (const s of [-1, 1]) {
  solid(p, [A(s * 22, 148, 7.5), A(s * 28, 123, 6.6), A(s * 33, 99, 5.6)], red, { ...o, length: 26 });                                           // his arms, a little out from his sides
  p.tryStroke({ ...line, color: '#d8ccc0', width: 5, opacity: 0.8, points: [A(s * 28.5, 100), A(s * 38, 98)] });                                 // the band at his wrist
  solid(p, [A(s * 34, 93, 4.6), A(s * 35, 87, 4.4)], skin, { ...o, length: 13, width: 5, edge: false });                                         // his hands
}
for (const pts of [[A(-8, 147), A(-6, 135), A(-9, 128)], [A(9, 147), A(7, 135), A(10, 128)], [A(0, 152), A(0, 139), A(0, 128)]]) p.tryStroke({ ...line, color: '#2e0a10', width: 6, opacity: 0.5, rag: 0.25, taper: [0.3, 0.3], points: pts });   // the folds across his back

// The two swords. Each is a short broad blade with a curve to it, held low, point down and out from his side.
for (const [s, body, shade, edge] of [[-1, '#17111a', '#08060a', '#ffa850'], [1, '#ece6dc', '#a89ca8', '#fff8e4']]) {
  const hand = [s * 35, 86], tip = [s * 62, 34], mid = [s * 53, 62];
  p.stroke({ ...line, cap: 'flat', color: shade, width: 15 * S * 0.62, taper: [0, 0.75], points: [A(hand[0] + s * 1, hand[1] - 3), A(mid[0] + s * 2, mid[1]), A(...tip)] });   // the back of the blade
  p.stroke({ ...line, cap: 'flat', color: body, width: 15 * S * 0.5, taper: [0, 0.75], points: [A(hand[0] - s * 1.5, hand[1] - 3), A(mid[0] - s * 1, mid[1] - 1), A(tip[0] - s * 1, tip[1] + 1)] });
  glint(p, [A(hand[0] + s * 4, hand[1] - 4), A(mid[0] + s * 5, mid[1]), A(tip[0] + s * 1, tip[1])], () => edge, { width: 4, dash: 30, gap: 6, opacity: 0.85, rng: r });           // the light along its edge
  if (s < 0) for (const t of [0.3, 0.5, 0.7]) p.tryStroke({ color: '#7c2228', width: 4, opacity: 0.8, points: [A(hand[0] + (tip[0] - hand[0]) * t - 3, hand[1] + (tip[1] - hand[1]) * t + 3), A(hand[0] + (tip[0] - hand[0]) * t + 3, hand[1] + (tip[1] - hand[1]) * t - 4)].map(([x, y], i) => [x + (i ? 2.2 : -2.2), y + (i ? -2.2 : 2.2)]) });   // the red marks on the black one
  p.stroke({ ...line, color: s < 0 ? '#2a2028' : '#c8beb4', width: 7.5, points: [A(hand[0] - s * 4, hand[1] - 1), A(hand[0] + s * 5, hand[1] - 5)].map(([x, y], i) => [x + (i ? s * 2 : -s * 2), y]) });   // its guard
  p.stroke({ ...line, color: '#1c1418', width: 5, points: [A(hand[0] - s * 1, hand[1] + 1), A(hand[0] - s * 3, hand[1] + 9)] });                    // its grip, above his hand
}

// His neck and his head. His hair is white and short, and it stands up from his brow.
solid(p, [A(0, 159, 5.8), A(0, 165, 5.8)], skin, { ...o, length: 13, width: 5, edge: false });
p.stroke({ ...line, color: '#7e1816', width: 7, points: [A(-8, 158.5), A(0, 160), A(8, 158.5)] });                                               // the collar of the coat
solid(p, [A(0, 174, 11.5), A(0, 176, 11)], white, { ...o, length: 16, width: 5.5 });
for (const [x0, y0, x1, y1] of [[-7, 181, -12, 187], [-1, 183, -3, 190], [5, 183, 8, 189.5], [9, 180, 14, 185], [-11, 176, -16, 179]]) p.tryStroke({ ...line, color: mix('#a89ca8', '#f0eae4', r()), width: 12, taper: [0, 0.75], points: [A(x0, y0), A(x1, y1)] });   // the ends of it: short
p.tryStroke({ ...line, color: '#7c7088', width: 6, opacity: 0.6, taper: [0.2, 0.4], points: [A(-8, 180), A(-9, 171), A(-7, 165)] });             // the shade on the side of it that is away from the glare
for (const s of [-1, 1]) p.tryStroke({ ...line, color: s > 0 ? '#b87c4c' : '#5c3828', width: 5, points: [A(s * 11.5, 175), A(s * 11.5, 168)] });  // his ears

p.save();
