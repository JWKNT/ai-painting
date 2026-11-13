// The two girls, half way up the path, hand in hand, their backs to us. They are in the
// summer uniform of their school: a white blouse with short sleeves and a wide collar that
// has a line of red near its edge, a short dark skirt in folds with a white frill at its
// hem, black on their legs to above the knee, and brown shoes.
// Hasaki is at the left. Her brown hair is tied up high with a yellow ribbon, and the tail of
// it goes out on the wind. She has turned her head to look back at us, and she laughs. Her
// rabbit doll hangs from her other hand by one of its arms.
// Yuki is at the right, taller. Her long dark hair goes out on the wind to the right. She
// has turned her head a little toward Hasaki.
// The sun is behind us and to the left, so they are in full light, and the shade is on the
// right of each thing and under it.
'use strict';
const { studio, open, HASAKI, YUKI, HANDS, SUNWARD } = require('./scene');
const { mix, clamp, smooth, solid, shape, glint, disc, noise2 } = studio;

const p = open('girls');
const r = p.rng;
const nF = noise2(1103);
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round' };
const o = { light: SUNWARD, turn: -0.15, width: 5.5, length: 18, vary: 0.05, dash: 16, gap: 7, edgeOpacity: 0.6 };
const blouse = { shadow: '#8494cc', half: '#c8d2ee', lit: '#ffffff', rim: '#ffffff', bounce: '#c4d49c' };
const socks = { shadow: '#08080e', half: '#1a1a26', lit: '#42425c', rim: '#9cacd8', bounce: '#283c20' };
const skin = { shadow: '#c08a74', half: '#eabc9c', lit: '#ffe4cc', rim: '#fff6ea', bounce: '#d0b88c' };
const shoe = { shadow: '#3a2212', half: '#6c4426', lit: '#a8743c', rim: '#ecc88c', bounce: '#4c3c20' };
// The frame of one of them: B puts a place on her, in centimetres from between her feet, into the picture.
function frame(G) {
  const S = G.s, B = (fx, fy, rad) => (rad == null ? [G.x + fx * S, G.y - fy * S] : [G.x + fx * S, G.y - fy * S, rad * S]);
  const poly = (pts) => pts.map(([x, y]) => B(x, y)), back = (x, y) => [(x - G.x) / S, (G.y - y) / S];
  const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: poly(pts) });
  return { S, B, poly, back, mark };
}

// The uniform, on one of them: shoes, legs, skirt, blouse, collar.
function uniform(G) {
  const { B, poly, back, mark } = frame(G);
  for (const [w, op] of [[34, 0.4], [20, 0.4]]) p.stroke({ brush: 'soft', color: '#806850', width: w, opacity: op, points: [B(-10, 1), B(14, -3), B(42, -6)] });   // her shade on the path
  for (const s of [-1, 1]) {
    shape(p, poly([[s * 7.4 - 4.6, 9], [s * 7.4 + 4.6, 9], [s * 7.4 + 5, 0], [s * 7.4 - 5, 0]]), shoe, { ...o, round: 5, length: 13 });         // her shoes
    mark([[s * 7.4 - 5, 1], [s * 7.4 + 5, 1]], '#2a1a10', 4.6);                                                                               // their heels
    solid(p, [B(s * 6.4, 78, 7), B(s * 6.6, 62, 6.6)], skin, { ...o, length: 13, edge: false });                                              // the skin above her stockings
    solid(p, [B(s * 6.6, 62, 6.6), B(s * 7, 44, 5.4), B(s * 7.4, 9, 3.9)], socks, { ...o, length: 26 });
    mark([[s * 6.6 - 6.4, 62.4], [s * 6.6 + 6.4, 62.4]], '#34344e', 4.8, { opacity: 0.9 });                                                   // the band at the top of each
    mark([[s * 7 - 4.6, 46], [s * 7 - 3.4, 40]].map(([x, y], i) => [x, y + (i ? -1 : 1)]), '#585876', 4, { opacity: 0.6 });                   // the light on the back of her knee
  }
  // the skirt: short, dark, in folds. The wind lifts it to the right.
  const down = (fy) => clamp((100 - fy) / 34, 0, 1), halfW = (fy) => 10.5 + 13 * Math.pow(down(fy), 0.8), axis = (fy) => 4 * down(fy);
  const hemAt = (fx) => 66 + 1.6 * Math.sin(fx * 1.3) + 0.12 * fx;
  const inside = (x, y) => { const [fx, fy] = back(x, y); return fy < 101 && fy > hemAt(fx) && Math.abs(fx - axis(fy)) < halfW(fy); };
  const cloth = (x, y) => {
    const [fx, fy] = back(x, y), u = clamp((fx - axis(fy)) / halfW(fy), -1, 1), fold = Math.sin(fx * 1.5 + 0.4 + G.x) * 0.5 + (nF(fx / 6 + G.x, fy / 12) - 0.5) * 0.5;
    const c = fold > 0 ? mix('#2e2e40', '#62627c', clamp(fold * 1.5, 0, 1)) : mix('#2e2e40', '#101018', clamp(-fold * 1.6, 0, 1));
    return mix(mix(c, '#7c7c98', smooth(-0.3, -1, u) * 0.35), '#0c0c14', smooth(0.3, 1, u) * 0.5);   // its left side is toward the sun
  };
  p.fill({ inside, bounds: [...B(-26, 103), ...B(34, 62)], width: 5.5, length: 22, spacing: 0.5, angle: (x, y) => { const [fx, fy] = back(x, y); return Math.atan2(106 - fy, fx - axis(fy) * 2); }, color: cloth, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.12, dry: 0.03, rag: 0.12, cap: 'round' } });
  for (let fx = -19; fx <= 27; fx += 6) { const fy = hemAt(fx) + 0.4; if (Math.abs(fx - axis(fy)) < halfW(fy) + 1) { mark([[fx - 3.1, fy + 1.4], [fx, fy - 1.6], [fx + 3.1, fy + 1.4]], mix('#d4dcf4', '#ffffff', r()), 6); mark([[fx - 3, fy - 2.6], [fx + 3, fy - 2.6]], '#8c94c0', 4, { opacity: 0.5 }); } }   // the white frill at its hem
  for (const fx of [-7, 0, 7, 14]) mark([[fx * 0.5 + 0.6, 98], [fx * 0.8 + 2, 84], [fx + 4, 72]], '#0c0c14', 4.6, { opacity: 0.5, taper: [0.2, 0.3] });   // the dark between its folds
  // the blouse
  shape(p, poly([[-10.4, 99], [10.4, 99], [11.6, 114], [13.4, 130], [-13.4, 130], [-11.6, 114]]), blouse, { ...o, round: 12, length: 20, flow: () => Math.PI / 2 });
  for (const [x0, y0, x1, y1, x2, y2] of [[-7, 104, -4, 108, -1, 105], [3, 103, 6, 107, 9, 104], [4, 126, 7, 116, 6, 108]]) mark([[x0, y0], [x1, y1], [x2, y2]], '#8c9cd4', 4.6, { opacity: 0.6, taper: [0.2, 0.3] });   // its folds, where it is tucked in
  mark([[-10.6, 100], [0, 99], [10.8, 100]], '#3a3a4c', 6, { cap: 'flat' });                                                                  // the band of the skirt at her waist
  // the collar: a square of white over her shoulders and the top of her back, with a line of red near its edge
  shape(p, poly([[-14, 133], [-6, 137.4], [6, 137.4], [14, 133], [13.4, 119], [-13.4, 119]]), blouse, { ...o, round: 9, length: 18, flow: () => 0, turn: -0.4 });
  mark([[-13.6, 118.6], [0, 117.8], [13.6, 118.6]], '#8494cc', 4.8, { opacity: 0.7 });                                                        // the shade under it
  for (const pts of [[[-11.4, 131], [-11, 121.6]], [[-11, 121.6], [0, 121], [11, 121.6]], [[11, 121.6], [11.4, 131]]]) mark(pts, '#c8283c', 4.2, { opacity: 0.95 });
  return frame(G);
}
// An arm: a short puffed sleeve with a band of red at its end, then the bare arm, then the hand.
function arm(F, shoulder, sleeveEnd, elbow, wrist, hand) {
  const { B, poly, mark } = F, s = Math.sign(shoulder[0]);
  solid(p, [B(...sleeveEnd, 3.5), B(...elbow, 3.1), B(...wrist, 2.7)], skin, { ...o, length: 16 });
  shape(p, poly([[wrist[0] - 2.6, wrist[1] + 1], [wrist[0] + 2.6, wrist[1] + 1], [hand[0] + 3, hand[1]], [hand[0], hand[1] - 3.6], [hand[0] - 3, hand[1]]]), skin, { ...o, round: 4, length: 13 });
  shape(p, poly([[shoulder[0] - s * 4.6, shoulder[1] + 3], [shoulder[0] + s * 4.4, shoulder[1] + 1], [sleeveEnd[0] + s * 5.4, sleeveEnd[1] + 0.6], [sleeveEnd[0] - s * 4.6, sleeveEnd[1] - 1.6], [shoulder[0] - s * 5, shoulder[1] - 6]]), blouse, { ...o, round: 6, length: 14 });
  mark([[sleeveEnd[0] - 5, sleeveEnd[1] - 1], [sleeveEnd[0] + 5.4, sleeveEnd[1] + 0.6]], '#c8283c', 4.4, { opacity: 0.95 });
}
const lock = (F, pts, w, color, op = 1) => p.tryStroke({ ...line, color, width: w, opacity: op, taper: [0, 0.8], points: F.poly(pts) });

// ---------------------------------------------------------------- Yuki
{
  const F = uniform(YUKI), { B, poly, mark, back } = F, [hx, hy] = back(...HANDS);
  const hair = { shadow: '#0a0e1c', half: '#182240', lit: '#3c4e84', rim: '#a4bcf4', bounce: '#14241c' };
  arm(F, [14.4, 131], [17, 121.6], [18.6, 107], [19, 92], [19.4, 86]);                                                                         // her right arm, down
  // the hair that falls down her back, at the right of it, and what the wind takes out
  shape(p, poly([[-5, 146], [11, 146], [15, 122], [18, 100], [14, 86], [4, 90], [-2, 110], [-5, 130]]), hair, { ...o, round: 10, length: 24, flow: () => Math.PI / 2 - 0.12 });
  for (let k = 0; k < 30; k++) {                                         // each lock goes out, rises a little, and falls at its end
    const t = r(), x0 = 9 - 6 * t, y0 = 158 - 62 * t, reach = (70 - 24 * t) * r.range(0.55, 1.05), y2 = y0 + 8 - 26 * t + r.range(-6, 6), wave = r.range(2, 9);
    lock(F, [[x0, y0], [x0 + reach * 0.35, y0 + (y2 - y0) * 0.25 + wave], [x0 + reach * 0.7, y0 + (y2 - y0) * 0.65 + wave * 0.4], [x0 + reach, y2 - wave * 1.2]], r.range(5.5, 10.5), mix('#0e1424', '#243260', r()));
  }
  for (const [x0, y0, x1, y1, x2, y2] of [[6, 160, 34, 163, 66, 165], [8, 150, 34, 148, 60, 150], [10, 136, 30, 130, 52, 128], [12, 116, 28, 108, 44, 106], [2, 142, 4, 120, 8, 98]]) lock(F, [[x0, y0 + 1], [x1, y1 + 2], [x2, y2 + 1]], 4.4, '#8ca8ec', 0.65);   // the sun on the tops of the locks
  arm(F, [-14.4, 131], [-17, 121.6], [-20.6, 105], [hx + 2, hy + 3.4], [hx, hy]);                                                             // her left arm, out to Hasaki
  // her neck and her head. She has turned it a little to the left, so the line of her cheek shows there.
  solid(p, [B(0, 136, 3.6), B(0, 141, 3.6)], skin, { ...o, length: 13, edge: false });
  shape(p, poly([[-11, 153], [-13.6, 149.4], [-14.4, 147.6], [-13.2, 146.6], [-13, 144], [-10.4, 141.6], [-8, 143], [-8.4, 150]]), skin, { ...o, round: 5, length: 13 });   // her cheek, the end of her nose, her chin
  mark([[-13.4, 150.6], [-9, 151.6]].map(([x, y], i) => [x + (i ? 0.7 : -0.7), y]), '#1c2440', 4, { opacity: 0.85 });                           // her lashes
  shape(p, poly([[-11.6, 147], [-12.6, 155], [-9, 162], [-1, 165], [7, 163.4], [11.8, 157], [12, 148], [9.4, 141], [0, 139], [-7.6, 140.4], [-9.4, 146]]), hair, { ...o, round: 16, length: 18, flow: (x, y) => Math.atan2(y - B(0, 166)[1], x - B(0, 166)[0]) });
  mark([[-9.6, 152], [-10.6, 146], [-9.6, 139]], '#141c38', 5.5, { taper: [0, 0.5] });                                                        // the lock in front of her ear
  for (const fx of [-9.6, -7]) mark([[fx, 156.6], [fx + 3.6, 153.4]].map(([x, y], i) => [x + (i ? 0.6 : -0.6), y + (i ? -0.5 : 0.5)]), '#f4f4ff', 4.2);   // the two clips in her hair
  glint(p, poly([[-10.6, 158], [-5, 162.6], [3, 163.6], [9, 160]]), () => mix('#8ca8ec', '#d0dcff', r()), { width: 4.4, dash: 18, gap: 7, opacity: 0.8, rng: r });   // the sun on the top of her head
}

// ---------------------------------------------------------------- Hasaki
{
  const F = uniform(HASAKI), { B, poly, mark, back } = F, [hx, hy] = back(...HANDS);
  const hair = { shadow: '#4a2a16', half: '#7e4e2a', lit: '#c08a54', rim: '#f8d4a0', bounce: '#5c4428' };
  const plush = { shadow: '#a4a8d0', half: '#dcdff0', lit: '#ffffff', rim: '#ffffff', bounce: '#c8d4a0' };
  // her rabbit doll. It hangs from her left hand by one of its arms: its head is up, and its long ears go out on the wind.
  mark([[-20.4, 72], [-19.6, 78], [-19.2, 84]], '#eef0fa', 5.5);                                                                              // the arm that she holds
  shape(p, poly([[-25.6, 73], [-18.4, 73], [-17, 62], [-20, 55.6], [-25, 55.6], [-27.4, 62]]), plush, { ...o, round: 7, length: 14 });         // its body
  for (const [x0, x1] of [[-24.6, -26], [-20.4, -19]]) mark([[x0, 56.6], [x1, 49]], '#e4e6f4', 6, { taper: [0, 0.3] });                         // its legs
  mark([[-25.4, 70], [-28, 66.6], [-30.4, 62.6]], '#e4e6f4', 5.5, { taper: [0, 0.3] });                                                        // its other arm
  for (const [pts, c] of [[[[-25.4, 82], [-31, 84.6], [-37.4, 81.6]], '#f4f4fc'], [[[-23, 84], [-28, 90], [-35, 91.6]], '#ffffff']]) { mark(pts, c, 6.5, { taper: [0, 0.4] }); mark(pts.map(([x, y]) => [x + 0.4, y - 0.6]), '#f4a8b8', 4, { opacity: 0.8, taper: [0.2, 0.5] }); }   // its ears
  disc(p, ...B(-22.4, 78.6), 5.6 * F.S, '#f8f8ff', 6.2, { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.1, cap: 'round' });                      // its head
  mark([[-24.8, 79.6], [-24.4, 74]].map(([x, y], i) => [x, y + (i ? 0 : 0.2)]), '#2a2030', 4, { opacity: 0.9 });                                // its eye
  mark([[-25.6, 73.4], [-18.6, 73.2]], '#d83848', 4.6);                                                                                      // the ribbon at its neck
  arm(F, [-14.4, 131], [-17, 121.6], [-18.6, 107], [-19, 92], [-19.2, 86]);                                                                   // her left arm, down, to the doll
  arm(F, [14.4, 131], [17, 121.6], [21.6, 108], [hx - 2, hy + 3.4], [hx, hy]);                                                                // her right arm, out to Yuki
  // the tail of her hair: it is tied high, and it goes out on the wind
  shape(p, poly([[-3, 162], [2, 167], [14, 169.4], [26, 166], [36, 158], [32, 154], [22, 158.6], [12, 160.6], [3, 158.6]]), hair, { ...o, round: 7, length: 18, flow: (x) => -0.1 - 0.3 * clamp((x - B(0, 0)[0]) / 60, 0, 1) });
  for (const [x0, y0, x1, y1, x2, y2] of [[2, 164, 16, 166, 34, 156], [3, 161, 16, 162, 30, 154.6], [4, 166, 18, 170, 38, 162], [6, 160, 18, 158, 28, 152]]) lock(F, [[x0, y0], [x1, y1], [x2, y2]], 5.5, mix('#6c4022', '#b07c44', r()));
  // her neck and her head. She has turned to look back at us over her right shoulder.
  solid(p, [B(0.6, 136, 3.6), B(1, 141, 3.6)], skin, { ...o, length: 13, edge: false });
  shape(p, poly([[-11.6, 146], [-12.4, 154], [-9, 161], [-2, 164.4], [6, 163.4], [11.4, 158.6], [12.8, 152], [5, 150], [2.4, 142], [-3.6, 138.4], [-9.4, 140]]), hair, { ...o, round: 14, length: 18, flow: (x, y) => Math.atan2(y - B(0, 166)[1], x - B(0, 166)[0]) });   // her hair: the back of her head
  shape(p, poly([[3.2, 157], [9.8, 157], [12.8, 153.4], [13.6, 150], [14.6, 148.2], [13.4, 146.6], [12.6, 143.6], [9.6, 140.2], [7.4, 139.4], [4.6, 141.4], [2.6, 144.6], [2, 150]]), skin, { ...o, round: 9, length: 13, turn: -0.5 });   // her face: round, with a small chin
  p.tryStroke({ brush: 'soft', color: '#f8a0a8', width: 8.4, opacity: 0.4, points: poly([[4, 145.4], [12, 145.6]]) });                         // the color in her cheeks
  // her eyes: each is a tall dark stroke with a line of brown down it; the hair over her brow will cover the top of it
  for (const [fx, w] of [[6.2, 5.4], [10.8, 4.8]]) mark([[fx, 147.2], [fx + 0.1, 153.4]], '#3c2010', w);
  mark([[6.6, 143.6], [8.8, 142.4], [11.4, 143.8]].map(([x, y], i) => [x + (i - 1) * 0.5, y]), '#c8505c', 4.2);                                  // her mouth: she laughs
  shape(p, poly([[1.4, 159], [11, 159.4], [13.8, 154.4], [13, 150.6], [10.6, 152.4], [8.6, 150.4], [6.2, 152.6], [3.8, 150.6], [1.8, 153]]), hair, { ...o, round: 6, length: 14, flow: () => 1.3, turn: -0.3 });   // the hair over her brow
  mark([[2.6, 155], [2, 148], [2.6, 141.6]], '#7e4e2a', 6, { taper: [0, 0.5] });                                                              // the lock at the side of her face
  mark([[13, 153], [14, 148.6], [13.4, 144]], '#8a5630', 4.8, { taper: [0, 0.6] });                                                           // and the one at the other side
  for (const [x0, y0, x1, y1] of [[-3, 163.6, -8.6, 168], [-2, 163, 2.6, 169.6]]) mark([[x0, y0], [x1, y1]], '#ffd84c', 6.5, { taper: [0, 0.3] });   // the yellow ribbon that ties it
  mark([[-4.6, 162.6], [-0.6, 163.4]].map(([x, y], i) => [x + (i ? 1 : -1), y]), '#e8a820', 5.5);
  glint(p, poly([[-10.6, 157], [-5, 162], [3, 163.4], [9, 160.4]]), () => mix('#f0c890', '#fff0d0', r()), { width: 4.4, dash: 18, gap: 7, opacity: 0.8, rng: r });   // the sun on the top of her head
}

// Their two hands, together: the fingers of one over the hand of the other, with the lines between them.
{
  const [x, y] = HANDS;
  shape(p, [[x - 13, y - 7], [x + 2, y - 9], [x + 13, y - 4], [x + 12, y + 6], [x - 2, y + 9], [x - 13, y + 5]], skin, { ...o, round: 7, length: 13 });
  for (const dx of [-5, 0, 5]) p.tryStroke({ color: '#b88068', width: 4, opacity: 0.6, points: [[x + dx - 1, y - 7], [x + dx + 1.4, y + 6]] });
}

p.save();
