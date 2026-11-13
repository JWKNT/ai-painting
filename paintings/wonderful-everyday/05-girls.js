// The two girls, at the top of the path, hand in hand, their backs to us. They are in the
// uniform of their school: a white blouse with a wide collar, a short dark skirt with a
// white frill at its hem, black on their legs to above the knee. Hasaki is at the left: her
// brown hair is tied up high, and the tail of it goes out on the wind; her rabbit doll hangs
// from her other hand. Yuki is at the right, taller, and the wind takes her long dark hair
// out to the right. The sun is behind us and to the left, so they are in full light.
'use strict';
const { studio, open, HASAKI, YUKI, FEET, SUNWARD } = require('./scene');
const { mix, clamp, smooth, solid, glint, arc, noise2 } = studio;

const p = open('girls');
const r = p.rng;
const nF = noise2(1103);
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round' };
const o = { light: SUNWARD, turn: -0.15, width: 5.5, length: 20, vary: 0.05, dash: 16, gap: 7, edgeOpacity: 0.6 };
const blouse = { shadow: '#8c9cd0', half: '#cdd6ee', lit: '#ffffff', rim: '#ffffff', bounce: '#b4cc9c' };
const socks = { shadow: '#08080e', half: '#1a1a26', lit: '#40405a', rim: '#9cacd8', bounce: '#1c2c1c' };
const skin = { shadow: '#c08e78', half: '#eac0a0', lit: '#ffe6cf', rim: '#fff4e6', bounce: '#c8b090' };

// The uniform, on one of them: legs, skirt, blouse, collar. B puts a place on her into the picture; S is her size.
function uniform(G) {
  const S = G.s, B = (fx, fy, rad) => (rad == null ? [G.x + fx * S, FEET - fy * S] : [G.x + fx * S, FEET - fy * S, rad * S]), back = (x, y) => [(x - G.x) / S, (FEET - y) / S];
  p.stroke({ brush: 'soft', color: '#2c5c2c', width: 22, opacity: 0.4, points: [B(-14, 0), B(4, -2), B(26, 1)] });                                 // her shade on the ground
  for (const s of [-1, 1]) {
    p.tryStroke({ ...line, color: '#5c3a24', width: 6.5, points: [B(s * 8.5, 2.5), B(s * 4, 2)].map(([x, y], i) => [x + (i ? -s * 3 : s * 3), y]) });   // her shoes
    solid(p, [B(s * 6.2, 75, 7), B(s * 6.4, 62, 6.6)], skin, { ...o, length: 13, width: 5, edge: false });                                         // the skin above her stockings
    solid(p, [B(s * 6.4, 62, 6.6), B(s * 6.8, 44, 5.4), B(s * 7, 8, 3.8)], socks, { ...o, length: 26 });
  }
  // the skirt: short, dark, in folds; the wind lifts it to the right
  const down = (fy) => clamp((100 - fy) / 30, 0, 1), halfW = (fy) => 10 + 11.5 * Math.pow(down(fy), 0.8), axis = (fy) => 4 * down(fy);
  const hemAt = (fx) => 70 + 1.6 * Math.sin(fx * 1.3) + 0.14 * fx;
  const inside = (x, y) => { const [fx, fy] = back(x, y); return fy < 101 && fy > hemAt(fx) && Math.abs(fx - axis(fy)) < halfW(fy); };
  const cloth = (x, y) => {
    const [fx, fy] = back(x, y), u = clamp((fx - axis(fy)) / halfW(fy), -1, 1), fold = Math.sin(fx * 1.5 + 0.4) * 0.5 + (nF(fx / 6 + G.x, fy / 12) - 0.5) * 0.5;
    const c = fold > 0 ? mix('#2c2c3c', '#5a5a74', clamp(fold * 1.5, 0, 1)) : mix('#2c2c3c', '#101018', clamp(-fold * 1.6, 0, 1));
    return mix(c, '#0c0c14', smooth(0.3, 1, u) * 0.5);                                         // its right side is away from the sun
  };
  p.fill({ inside, bounds: [...B(-24, 103), ...B(30, 66)], width: 5.5, length: 20, spacing: 0.5, angle: (x, y) => { const [fx, fy] = back(x, y); return Math.atan2(105 - fy, fx - axis(fy) * 2); }, color: cloth, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.12, dry: 0.03, rag: 0.12, cap: 'round' } });
  glint(p, [B(-17, 72), B(-4, 70.5), B(10, 71.5), B(25, 74)], () => mix('#d4dcf4', '#ffffff', r()), { width: 4.4, dash: 14, gap: 4, opacity: 0.9, rng: r });   // the white frill at its hem
  // the blouse, and its wide collar across her shoulders, with a line of red near its edge
  solid(p, [B(0, 100, 10.5), B(0, 116, 11), B(0, 130, 12.5)], blouse, { ...o, length: 24 });
  solid(p, [B(-12, 133, 5), B(0, 136, 5), B(12, 133, 5)], blouse, { ...o, length: 16 });
  p.stroke({ ...line, cap: 'flat', color: '#9aa8d8', width: 5, opacity: 0.7, points: [B(-10.5, 121.5), B(0, 120.5), B(10.5, 121.5)] });                // the shade under the collar
  p.stroke({ ...line, cap: 'flat', color: '#fbfcff', width: 14 * S * 0.6, points: [B(-10.5, 128), B(0, 127), B(10.5, 128)] });
  p.stroke({ ...line, cap: 'flat', color: '#ffffff', width: 12 * S * 0.6, points: [B(-10.5, 134), B(0, 135), B(10.5, 134)] });
  p.tryStroke({ color: '#c8283c', width: 4, opacity: 0.9, points: [B(-10, 125), B(0, 124), B(10, 125)] });
  p.stroke({ ...line, cap: 'flat', color: '#3a3a4c', width: 5.5, points: [B(-10, 100.5), B(0, 99.5), B(10.5, 100.5)] });                                // the band of the skirt at her waist
  return B;
}
const arm = (B, pts) => { solid(p, pts.slice(0, 3).map((q) => B(...q)), blouse, { ...o, length: 20 }); solid(p, [B(pts[2][0], pts[2][1], 3.2), B(pts[3][0], pts[3][1], 3)], skin, { ...o, length: 13, width: 5, edge: false }); };
const lock = (B, pts, w, color, op = 1) => p.tryStroke({ ...line, color, width: w, opacity: op, taper: [0, 0.8], points: pts.map((q) => B(...q)) });

// ---------------------------------------------------------------- Hasaki
{
  const B = uniform(HASAKI);
  // her rabbit doll: it hangs from her left hand by one of its arms. It is white, with long ears.
  solid(p, [B(-20, 80, 5.5), B(-20.5, 70, 6.5)], { shadow: '#a8acd0', half: '#dcdff0', lit: '#ffffff', rim: '#ffffff', bounce: '#b8cca0' }, { ...o, length: 14, width: 5 });
  solid(p, [B(-21, 62, 6), B(-21, 60, 6)], { shadow: '#a8acd0', half: '#dcdff0', lit: '#ffffff', rim: '#ffffff', bounce: '#b8cca0' }, { ...o, length: 13, width: 5 });
  for (const [dx, a] of [[-4, -0.3], [3, 0.25]]) { p.tryStroke({ ...line, color: '#f4f4fc', width: 6, points: [B(-21 + dx, 57), B(-21 + dx + a * 6, 44)] }); p.tryStroke({ color: '#f4a8b8', width: 4, opacity: 0.8, points: [B(-21 + dx, 55), B(-21 + dx + a * 5, 46.5)] }); }   // its ears hang down, for it is head down
  for (const s of [-1, 1]) p.tryStroke({ ...line, color: '#e4e6f4', width: 5, points: [B(-20 + s * 5, 75), B(-20 + s * 11, 68)] });               // its other arm, and a leg
  arm(B, [[-13.5, 131, 4.8], [-16, 112, 4.3], [-17.5, 95, 3.8], [-18.5, 88]]);                                                                    // her left arm, down, to the doll
  arm(B, [[13.5, 131, 4.8], [18, 113, 4.3], [24, 96, 3.8], [28, 92]]);                                                                            // her right arm, out to Yuki
  // her head and her hair: brown, tied up high at the back, and the tail of it goes out on the wind
  const hair = { shadow: '#4a2a16', half: '#7c4c2a', lit: '#bc8450', rim: '#f4cc94', bounce: '#5c4428' };
  solid(p, [B(0, 138, 3.8), B(0, 142, 3.8)], skin, { ...o, length: 13, width: 5, edge: false });
  solid(p, [B(0, 149, 9.6), B(0, 151, 9.2)], hair, { ...o, length: 14, width: 5 });
  for (const [x0, y0, x1, y1, x2, y2, w] of [[1, 159, 22, 166, 44, 156, 9], [2, 158, 20, 161, 38, 150, 8], [2, 157, 24, 157, 48, 143, 9], [2, 156, 20, 150, 36, 137, 8], [2, 155, 22, 146, 40, 128, 8], [1, 153, 14, 142, 26, 126, 7]]) lock(B, [[x0, y0], [x1, y1], [x2, y2]], w, mix('#6c4022', '#a06c3c', r()));
  for (const [x0, y0, x1, y1, x2, y2] of [[3, 161, 22, 166, 42, 160], [4, 158, 24, 158, 44, 149]]) lock(B, [[x0, y0], [x1, y1], [x2, y2]], 4.2, '#f0c890', 0.7);   // the sun on it
  p.tryStroke({ ...line, color: '#f8f8ff', width: 6, points: [B(-2, 158.5), B(4, 159.5)].map(([x, y], i) => [x + (i ? 3 : -3), y]) });             // the tie
  for (const s of [-1, 1]) lock(B, [[s * 8, 148], [s * 9.5, 140], [s * 8.5, 133]], 5.5, '#7c4c2a');                                               // the hair at the sides of her face
}

// ---------------------------------------------------------------- Yuki
{
  const B = uniform(YUKI);
  arm(B, [[13.5, 131, 4.8], [16, 112, 4.3], [17.5, 95, 3.8], [18, 88]]);                                                                           // her right arm, down
  arm(B, [[-13.5, 131, 4.8], [-18, 113, 4.3], [-24, 96, 3.8], [-28, 92]]);                                                                         // her left arm, out to Hasaki
  // her head and her hair: dark, straight, to her hips. Some of it is down her back, and the wind takes the rest out to the right.
  const hair = { shadow: '#0a0e1c', half: '#182240', lit: '#3a4c80', rim: '#9cb4f0', bounce: '#14241c' };
  solid(p, [B(0, 138, 3.8), B(0, 142, 3.8)], skin, { ...o, length: 13, width: 5, edge: false });
  solid(p, [B(0, 149, 9.6), B(0, 151, 9.2)], hair, { ...o, length: 14, width: 5 });
  for (const [x0, y0, x1, y1, x2, y2] of [[-5, 144, -4, 120, -1, 96], [1, 144, 3, 118, 6, 92], [6, 145, 9, 122, 12, 98]]) lock(B, [[x0, y0], [x1, y1], [x2, y2]], 8.5, mix('#0e1424', '#1c2848', r()));
  for (let k = 0; k < 20; k++) {                                         // each lock goes out, rises a little, and falls at its end
    const t = r(), x0 = 7 - 9 * t, y0 = 156 - 13 * t, reach = (78 - 30 * t) * r.range(0.6, 1.05), y2 = 160 - 62 * t + r.range(-5, 5), wave = r.range(2, 9);
    lock(B, [[x0, y0], [x0 + reach * 0.35, y0 + (y2 - y0) * 0.25 + wave], [x0 + reach * 0.7, y0 + (y2 - y0) * 0.65 + wave * 0.4], [x0 + reach, y2 - wave * 1.2]], r.range(5.5, 10), mix('#0e1424', '#22305a', r()));
  }
  for (const [x0, y0, x1, y1, x2, y2] of [[4, 158, 30, 160, 62, 162], [2, 152, 28, 146, 56, 142], [-2, 146, 16, 130, 36, 114]]) lock(B, [[x0, y0 + 1], [x1, y1 + 2], [x2, y2 + 1]], 4.2, '#8ca8ec', 0.65);   // the sun on the tops of the locks
  glint(p, arc(...B(0, 150), 9.2 * YUKI.s, -2.6, -1.0, 8), () => '#9cb4f0', { width: 4.2, dash: 14, gap: 6, opacity: 0.8, rng: r });
}
// Their two hands, together.
p.stroke({ ...line, color: '#f6d4b8', width: 7, points: [[HASAKI.x + 27 * HASAKI.s, FEET - 92 * HASAKI.s], [YUKI.x - 27 * YUKI.s, FEET - 92 * YUKI.s]].map(([x, y], i) => [x + (i ? 3 : -3), y]) });

p.save();
