// The camp. The fire burns in a ring of stones, and six of them sit round it. They are small
// and far enough off that each is only a shape, but each shape is one of them: Yuna on her
// knees in her long skirt, with her white sleeves; Rikku with her arms round her knees and a
// long scarf; Lulu in her black dress; Kimahri, blue and big, with his white mane; Wakka with
// his red hair; and Auron a little apart, in his red coat. Tidus stands by himself at the
// edge of the hill and looks at the city. He is against the last of the sun.
'use strict';
const { studio, open, FIRE, TIDUS, ridge } = require('./scene');
const { mix, shape, glint, disc } = studio;

const p = open('camp');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0, rag: 0.12, cap: 'round' };
// A small figure: F puts a place on it, in centimetres from where it sits or stands, into the picture; M makes a mark on it.
function figure(x, y, s) {
  const F = (ux, uy) => [x + ux * s, y - uy * s];
  const M = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts.map(([a, b]) => F(a, b)) });
  // the head: a small round, with the light of the fire on the side of it that is toward the fire
  const head = (ux, uy, rad, color) => { const [hx, hy] = F(ux, uy), R = Math.max(7, rad * s), toFire = Math.atan2(FIRE.y - 30 - hy, FIRE.x - hx); disc(p, hx, hy, R, color, 6.2, { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.1, cap: 'round' }); p.tryStroke({ color: mix('#ffb060', '#ffe0a0', r()), width: 4, opacity: 0.85, points: studio.arc(hx, hy, R - 1, toFire - 0.9, toFire + 0.9, 7) }); };
  const shade = (w = 40) => p.tryStroke({ brush: 'soft', color: '#080508', width: Math.max(8.2, 14 * s), opacity: 0.5, points: [[x - w * s, y + 3], [x + w * s, y + 5]] });
  return { F, M, head, shade };
}
const fireSide = (x) => (x < FIRE.x ? 1 : -1);                         // the side of a figure that is toward the fire
const warm = () => mix('#ff9a40', '#ffd884', r());

// ---------------------------------------------------------------- the fire
// Its light on the ground, the stones round it, the wood, the flames, the sparks and the smoke.
for (const [w, op] of [[240, 0.16], [150, 0.2], [80, 0.3]]) p.stroke({ brush: 'soft', color: '#ff9a3c', width: w, opacity: op, points: [[FIRE.x - w * 1.02, FIRE.y + 6], [FIRE.x, FIRE.y - 10], [FIRE.x + w * 1.02, FIRE.y + 6]] });
for (let k = 0; k < 9; k++) { const a = k / 9 * 6.283, x = FIRE.x + Math.cos(a) * 34, y = FIRE.y + 6 + Math.sin(a) * 12, front = Math.sin(a) > 0; p.tryStroke({ ...line, color: front ? '#1a1014' : '#5c3424', width: r.range(8, 11), points: [[x - 7, y], [x + 7, y + r.range(-2, 2)]] }); if (!front) p.tryStroke({ color: '#ffb860', width: 4, opacity: 0.7, points: [[x - 6, y + 4], [x + 6.4, y + 4]] }); }
for (const [x0, y0, x1, y1] of [[-24, 6, 20, -8], [22, 6, -18, -10], [-6, 8, 4, -18]]) p.tryStroke({ ...line, cap: 'flat', color: '#241410', width: 7, points: [[FIRE.x + x0, FIRE.y + y0], [FIRE.x + x1, FIRE.y + y1]] });
const tongue = (dx, h, w, c, lean) => p.tryStroke({ ...line, color: c, width: w, mix: 0.2, rag: 0.25, taper: [0.05, 0.9], points: [[FIRE.x + dx, FIRE.y + 2], [FIRE.x + dx + lean * 0.3 + r.range(-3, 3), FIRE.y - h * 0.5], [FIRE.x + dx + lean + r.range(-4, 4), FIRE.y - h]] });
for (const [dx, h, w, lean] of [[-18, 40, 14, -6], [16, 44, 14, 12], [-6, 70, 17, 6], [8, 60, 15, 14], [0, 86, 14, 10]]) tongue(dx, h, w, mix('#d83c14', '#f0601c', r()), lean);
for (const [dx, h, w, lean] of [[-10, 36, 11, -3], [10, 36, 11, 9], [-2, 58, 12, 6], [5, 48, 11, 10]]) tongue(dx, h, w, mix('#ff8a24', '#ffa838', r()), lean);
for (const [dx, h, w, lean] of [[-5, 26, 8, -2], [6, 26, 8, 5], [0, 42, 9, 5]]) tongue(dx, h, w, mix('#ffd24c', '#ffec90', r()), lean);
tongue(0, 24, 6.5, '#fffadc', 2);
for (let k = 0; k < 22; k++) { const t = Math.pow(r(), 0.7), x = FIRE.x + 10 + t * 90 + r.range(-24, 24), y = FIRE.y - 60 - t * 260, a = -1.2 + r.range(-0.5, 0.5); p.tryStroke({ color: mix('#ff8a2c', '#ffe490', r()), width: r.range(4, 4.6), opacity: r.range(0.4, 0.9) * (1 - t * 0.6), taper: [0.5, 0], points: [[x, y], [x + Math.cos(a) * 13, y + Math.sin(a) * 13]] }); }
p.stroke({ brush: 'soft', color: '#3a2a30', width: 26, opacity: 0.22, taper: [0.2, 0], points: [[FIRE.x + 6, FIRE.y - 90], [FIRE.x + 30, FIRE.y - 190], [FIRE.x + 100, FIRE.y - 290], [FIRE.x + 220, FIRE.y - 360]] });

// ---------------------------------------------------------------- those across the fire from us: they face us, in its light
{ // Lulu: a black dress that lies wide on the ground, bare shoulders with grey fur round them, black hair up, with pins in it
  const { F, M, head, shade } = figure(972, 778, 1); shade(34);
  shape(p, [F(-30, 0), F(30, 0), F(14, 30), F(8, 44), F(-8, 44), F(-12, 30)], { shadow: '#0a070c', half: '#1c1218', lit: '#6c3a2c', rim: '#ffb060' }, { light: { at: [FIRE.x, FIRE.y - 20] }, turn: 0.2, width: 5.5, length: 16, round: 12, dash: 16, gap: 6 });
  for (const ux of [-16, -2, 12]) M([[ux * 0.5, 30], [ux, 2]], '#3a2028', 4.6, { opacity: 0.8 });                 // the belts that hang on the front of it
  M([[-10, 46], [0, 48], [10, 46]], '#a89ca0', 6);                                                              // the fur
  M([[-9, 52], [9, 52]], '#e8b48c', 5.5);                                                                       // her shoulders
  M([[0, 54], [0, 68]], '#f0bc90', 6);                                                                          // her face, in the light of the fire
  head(0, 68, 8, '#120c14'); M([[-9, 76], [9, 70]], '#e8d8c0', 4); M([[-9, 70], [9, 76]], '#e8d8c0', 4);         // her hair, and the pins in it
}
{ // Kimahri: big, blue, with a white mane and a broken horn; he sits with his arms on his knees
  const { F, M, head, shade } = figure(1124, 776, 1.12); shade(40);
  shape(p, [F(-26, 0), F(26, 0), F(22, 40), F(12, 56), F(-12, 56), F(-22, 40)], { shadow: '#101830', half: '#243c7c', lit: '#6c8cc8', rim: '#ffc080' }, { light: { at: [FIRE.x, FIRE.y - 20] }, turn: 0.1, width: 5.5, length: 16, round: 14, dash: 16, gap: 6 });
  for (const sx of [-1, 1]) M([[sx * 20, 44], [sx * 30, 24], [sx * 18, 12]], sx < 0 ? '#5c7cc0' : '#2c4484', 8);    // his arms
  M([[-22, 10], [0, 4], [22, 10]], '#a8642c', 7);                                                                // the cloth at his waist
  head(0, 64, 10, '#3a58a8');
  M([[-10, 70], [-14, 54], [-10, 40]], '#eef0f8', 7, { taper: [0, 0.6] }); M([[9, 70], [14, 56], [11, 44]], '#c8d0e8', 6, { taper: [0, 0.6] });   // his mane
  M([[3, 72], [8, 84]].map(([a, b], i) => [a + (i ? 1 : -1), b]), '#e8dcc0', 4.6);                                // the stump of his horn
}
{ // Auron: apart from the others, on a rock; a long red coat with a high collar, grey in his dark hair, one arm inside the coat
  const { F, M, head, shade } = figure(1240, 786, 1.1); shade(36);
  M([[-22, 2], [0, -2], [24, 4]], '#2a1c1c', 15, { cap: 'flat' });                                              // the rock that he sits on
  shape(p, [F(-20, 4), F(22, 4), F(26, 30), F(16, 58), F(-8, 60), F(-20, 36)], { shadow: '#2c0a0e', half: '#6c1418', lit: '#c8341c', rim: '#ffb060' }, { light: { at: [FIRE.x, FIRE.y - 20] }, turn: 0.25, width: 5.5, length: 16, round: 13, dash: 16, gap: 6 });
  M([[-16, 30], [-24, 14], [-18, 2]], '#1c1418', 8);                                                            // his legs, toward the fire
  M([[-10, 58], [2, 64], [14, 58]], '#b8aca8', 8);                                                              // the collar
  head(2, 70, 8.5, '#241c1c'); M([[-6, 74], [6, 77]], '#8c8480', 4.6);                                           // the grey in his hair
  M([[14, 44], [20, 30], [12, 20]], '#4c0e12', 6, { opacity: 0.8 });                                            // the arm that he keeps in his coat
}
// ---------------------------------------------------------------- those at the sides and on our side of the fire
{ // Wakka: seen from the side; red hair that stands up in front, a blue band round his head, a yellow coat, bare brown arms
  const { F, M, head, shade } = figure(1158, 826, 1.1); shade(36);
  M([[-30, 2], [-10, 8], [12, 4]], '#2c3a58', 10); M([[-28, 4], [-14, 16], [0, 10]], '#3c4c70', 9);              // his legs, crossed
  shape(p, [F(-4, 6), F(16, 6), F(14, 34), F(4, 48), F(-8, 44), F(-10, 20)], { shadow: '#5c3c14', half: '#b8862c', lit: '#f0c850', rim: '#fff0b0' }, { light: { at: [FIRE.x, FIRE.y - 20] }, turn: 0.1, width: 5.5, length: 14, round: 10, dash: 14, gap: 6 });
  M([[-6, 40], [-20, 30], [-26, 18]], '#b8744c', 7);                                                            // his arm, out to his knee
  head(-2, 56, 8, '#a8643c'); M([[-9, 60], [5, 60]], '#4c6cc0', 5); M([[-4, 62], [-10, 72], [-16, 76]], '#e0601c', 7, { taper: [0, 0.6] });
}
{ // Yuna: on her knees, her back to us; the long dark skirt lies round her, the sash and its bow are at her back, and her white sleeves hang
  const { F, M, head, shade } = figure(964, 846, 1.12); shade(40);
  shape(p, [F(-30, 0), F(32, 0), F(20, 22), F(10, 34), F(-10, 34), F(-22, 20)], { shadow: '#0e1030', half: '#222a62', lit: '#5868b0', rim: '#ffc080' }, { light: { at: [FIRE.x, FIRE.y - 20] }, turn: 0.3, width: 5.5, length: 16, round: 12, dash: 16, gap: 6 });
  for (const [ux, uy] of [[14, 10], [22, 6], [8, 16]]) M([[ux - 4, uy], [ux + 4, uy + 2]].map(([a, b], i) => [a + (i ? 1.6 : -1.6), b]), '#e8d0e4', 4.6, { opacity: 0.8 });   // the flowers on it
  M([[-11, 36], [0, 37], [11, 36]], '#c89c3c', 9, { cap: 'flat' }); M([[-4, 40], [-16, 46]], '#e0b44c', 6); M([[4, 40], [16, 46]], '#e0b44c', 6);   // the sash, and the bow of it
  M([[0, 42], [0, 58]], '#d8cce0', 12, { cap: 'flat' });                                                        // her back, in white
  for (const sx of [-1, 1]) { M([[sx * 8, 56], [sx * 20, 38], [sx * 24, 20]], sx > 0 ? '#fff0e8' : '#c8b8d8', 9); M([[sx * 23, 24], [sx * 26, 8]], sx > 0 ? '#f098b0' : '#b0607c', 9); }   // her sleeves: white, then rose at their ends
  head(0, 66, 8.5, '#4a2c20');
  glint(p, [F(12, 60), F(24, 36), F(30, 6)], warm, { width: 4, dash: 14, gap: 6, opacity: 0.8, rng: r });
}
{ // Rikku: her arms round her knees, her back to us; fair hair tied up, with braids; a long scarf that lies on the rock behind her
  const { F, M, head, shade } = figure(1080, 866, 1.08); shade(30);
  M([[-10, 2], [4, 0], [18, 4]], '#4c6c34', 10);                                                                // she sits
  M([[0, 6], [-2, 22], [0, 38]], '#c87a34', 13, { cap: 'flat' });                                               // her back
  M([[8, 34], [16, 22], [14, 10]], '#e8b890', 6);                                                               // her arm, round her knees
  M([[-6, 40], [-24, 34], [-44, 22], [-62, 20]], '#f0c040', 6, { taper: [0, 0.4] }); M([[-6, 38], [-22, 28], [-36, 14]], '#e88c2c', 5.5, { taper: [0, 0.4] });   // the scarf
  head(0, 48, 8, '#ecc858'); M([[2, 54], [8, 66], [16, 70]], '#f4d868', 6, { taper: [0, 0.6] }); M([[-6, 46], [-10, 32]], '#e0b848', 4.6);   // her hair, tied up, and a braid
  glint(p, [F(-8, 44), F(-10, 24), F(-12, 4)], warm, { width: 4, dash: 14, gap: 6, opacity: 0.7, rng: r });
}

// ---------------------------------------------------------------- Tidus, at the edge of the hill
{
  const y = ridge(TIDUS.x) + 4, { F, M, head } = figure(TIDUS.x, y, 0.72);
  p.stroke({ brush: 'soft', color: '#080508', width: 16, opacity: 0.5, taper: [0, 0.5], points: [[TIDUS.x, y], [TIDUS.x + 60, y + 36], [TIDUS.x + 130, y + 80]] });   // his shadow, long, toward us
  M([[-8, 0], [-7, 44], [-5, 86]], '#14121a', 8); M([[9, 0], [8, 40], [6, 86]], '#14121a', 8);                    // his legs
  M([[-8, 2], [-8, 22]], '#b8962c', 8.4); M([[9, 2], [9, 22]], '#b8962c', 8.4);                                  // his boots, yellow
  M([[0, 84], [0, 112], [0, 136]], '#1a1820', 15, { cap: 'flat' });                                             // his body, in black
  M([[-9, 136], [0, 139], [9, 136]], '#c8a030', 9); M([[8, 132], [10, 112]], '#c8a030', 6);                      // the short yellow coat on his shoulders
  M([[-13, 132], [-17, 108], [-15, 86]], '#2a2630', 6.5); M([[13, 132], [18, 110], [17, 88]], '#b88c68', 6);     // his arms: one with the long dark glove
  head(0, 150, 9.5, '#c89c3c');
  for (const [a, b, c, d] of [[-6, 156, -13, 166], [0, 158, 2, 170], [6, 156, 14, 164]]) M([[a, b], [c, d]], '#e0b848', 5, { taper: [0, 0.6] });   // his fair hair, which stands up
  glint(p, [F(-12, 150), F(-17, 110), F(-11, 40), F(-12, 4)], () => mix('#ff9c40', '#ffe490', r()), { width: 4, dash: 22, gap: 8, opacity: 0.9, rng: r });   // the fire of the sun down the side of him that faces it
}

p.save();
