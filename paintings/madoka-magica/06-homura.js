// Homura, on the roof. We are behind her and a little to her left, and she looks up at the
// witch, so we see the line of her brow, her nose and her chin. Her hair is black and straight
// and comes to her hips; she has a dark band on it, and the storm takes it out to the left.
// She has a pale jacket with a wide collar of grey violet, edged with white, and long sleeves
// with dark cuffs; a short skirt of the same violet, in folds, with white under its hem;
// black on her legs, with a line of violet marks down the side of each; and black shoes
// with heels. On her left arm is her shield: a round plate of grey iron with a dark ring, two
// windows of violet glass, and a red stone in the middle. In her right hand, at her side, is
// a pistol. The cold light of the witch is on her right side, and the fires are behind her.
'use strict';
const { studio, open, H, WITCH, HOMURA, roofEdge, nA, nC } = require('./scene');
const { mix, clamp, smooth, solid, shape, glint, arc, noise2 } = studio;

const p = open('homura');
const r = p.rng;
const S = HOMURA.s;
const A = (fx, fy, rad) => (rad == null ? [HOMURA.x + fx * S, HOMURA.y - fy * S] : [HOMURA.x + fx * S, HOMURA.y - fy * S, rad * S]);
const poly = (pts) => pts.map(([x, y]) => A(x, y));
const back = (x, y) => [(x - HOMURA.x) / S, (HOMURA.y - y) / S];
const nF = noise2(907);
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round' };
const o = { light: { at: [WITCH.x, WITCH.y] }, turn: 0.3, width: 5.5, length: 18, vary: 0.05, dash: 18, gap: 7, edgeOpacity: 0.85 };
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: poly(pts) });
const warm = () => mix('#ff7c34', '#ffb860', r());

// The fires on the water beyond the roof, behind where she stands: she is seen against them.
for (const [x, y, w, op] of [[330, 800, 190, 0.4], [470, 860, 120, 0.36], [190, 790, 130, 0.3]]) p.stroke({ brush: 'soft', color: '#f08434', width: w, opacity: op, points: [[x - w * 1.02, y + 6], [x, y - 6], [x + w * 1.02, y + 6]] });
for (let k = 0; k < 90; k++) { const x = r.range(20, 640), y = r.range(770, 940), len = r.range(40, 110); if (y < roofEdge(x) - 4) p.tryStroke({ brush: 'bristle', color: mix('#e8641c', '#ffc860', r()), width: r.range(5, 8), opacity: r.range(0.4, 0.85), mix: 0.2, dry: 0.05, rag: 0.3, taper: [0.3, 0.3], points: [[x, y], [x + len, y + r.range(-2, 2)]] }); }

// The roof: flat, of dark stone, cracked. Its far edge has her cold light along it. Part of its rail still stands.
{
  const stone = (x, y) => { const k = clamp((y - roofEdge(x)) / 160, 0, 1); return mix(mix('#2c363e', '#1a2026', nA(x / 120, y / 40)), '#0a0d10', k * 0.7 + (nC(x / 80, y / 8) - 0.5) * 0.3); };
  const slant = Math.atan2(155, 760);
  p.fill({ inside: (x, y) => y > roofEdge(x) && x < 900, bounds: [0, 840, 900, H], width: 12, length: 110, spacing: 0.5, angle: () => slant + r.range(-0.03, 0.03), color: stone, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.2, dry: 0.04, rag: 0.25 } });
  const lip = []; for (let x = -10; x <= 800; x += 30) lip.push([x, roofEdge(x) + 3]);
  p.stroke({ ...line, cap: 'flat', color: '#3c4a54', width: 9, points: lip });
  glint(p, lip.map(([x, y]) => [x, y - 3]), () => mix('#8cacb0', '#d0e4e0', r()), { width: 4.4, dash: 90, gap: 26, opacity: 0.8, rng: r });
  for (const [x, lean, h, rail] of [[40, 0.05, 78, 0], [150, -0.3, 70, 96], [596, 0.12, 74, 88], [700, 0.5, 60, 0]]) {   // the posts of the rail, some of them bent, and what is left of the rail
    const foot = [x, roofEdge(x) + 4], top = [x + lean * h, roofEdge(x) + 4 - h];
    p.stroke({ ...line, cap: 'flat', color: '#0c1014', width: 6, points: [foot, top] });
    p.tryStroke({ color: '#a8c4c4', width: 4, opacity: 0.6, points: [[foot[0] + 3, foot[1] - 4], [top[0] + 3, top[1] + 2]] });
    if (rail) p.stroke({ ...line, color: '#0c1014', width: 5, points: [top, [top[0] + rail * 0.5, top[1] + 22], [top[0] + rail, top[1] + 60]] });
  }
  for (let k = 0; k < 16; k++) {                                         // cracks, and pieces of stone on it
    const x = r.range(0, 760), y = r.range(roofEdge(x) + 14, H), len = r.range(40, 110);
    p.tryStroke({ ...line, color: '#06080a', width: r.range(4.8, 6), opacity: 0.6, rag: 0.3, taper: [0.2, 0.5], points: [[x, y], [x + len * 0.5, y + len * 0.1 + r.range(-5, 5)], [x + len, y + len * 0.2 + r.range(-6, 6)]] });
  }
  for (const [x, y, w] of [[520, 968, 30], [120, 958, 24], [640, 992, 36], [440, 990, 20]]) { p.stroke({ ...line, cap: 'flat', color: '#14181c', width: w * 0.5, points: [[x - w / 2, y], [x + w / 2, y + 3]] }); p.tryStroke({ color: '#8ca8ac', width: 4, opacity: 0.6, points: [[x - w / 2 + 2, y - w * 0.22], [x + w / 2, y - w * 0.22 + 3]].map(([px, py], i) => [px + (i ? Math.max(0, 6.3 - w / 2) : -Math.max(0, 6.3 - w / 2)), py]) }); }
}

// Her shadow on the roof, away from the witch.
p.stroke({ brush: 'soft', color: '#04060a', width: 44, opacity: 0.5, taper: [0, 0.5], points: [A(0, 0), A(-40, -6), A(-100, -14)] });

const tights = { shadow: '#07070c', half: '#14131c', lit: '#32324c', rim: '#a8c4cc', bounce: '#3c1c14' };
const jacket = { shadow: '#54547c', half: '#9698b6', lit: '#e4e8f2', rim: '#ffffff', bounce: '#9c7068' };
const violet = { shadow: '#221a3c', half: '#4a3e74', lit: '#7c6eae', rim: '#c8d0f0', bounce: '#5c3038' };
const skin = { shadow: '#8c6c78', half: '#c8a49c', lit: '#f6e0d0', rim: '#ffffff', bounce: '#b07c70' };
const ink = { shadow: '#050509', half: '#100f18', lit: '#30304a', rim: '#a8c4d0', bounce: '#2c1614' };

// ---------------------------------------------------------------- her legs and her shoes
shape(p, poly([[-12, 7], [-3.4, 7], [-2, 3], [1.4, 0], [-12.6, 0]]), ink, { ...o, round: 4, length: 13 });
shape(p, poly([[5.4, 7], [14, 7], [15.4, 3], [19, 0], [5, 0]]), ink, { ...o, round: 4, length: 13 });
for (const x of [-11.6, 6]) mark([[x, 6], [x + 0.4, 0.4]], '#05050a', 4.6);                                                                  // their heels
solid(p, [A(-6.6, 80, 6.6), A(-7.2, 44, 5), A(-7.6, 8, 3.6)], tights, { ...o, length: 28 });
solid(p, [A(6.6, 80, 6.6), A(8.6, 44, 5), A(9.8, 8, 3.6)], tights, { ...o, length: 28 });
for (const [x0, x1] of [[-12.4, -11.6], [13.4, 13.4]]) for (const fy of [66, 56, 46, 36, 26, 16]) mark([[x0 + (x1 - x0) * (66 - fy) / 50 * 0.5 + (x0 < 0 ? 1.4 : -1.2) * (66 - fy) / 50, fy + 2.8], [x0 + (x1 - x0) * (66 - fy) / 50 * 0.5 + (x0 < 0 ? 1.4 : -1.2) * (66 - fy) / 50, fy - 2.8]], '#7c5cc0', 4.6, { opacity: 0.9 });   // the violet marks down the side of each
glint(p, poly([[13.4, 76], [13.6, 46], [13, 12]]), () => '#8ca4b4', { width: 4.2, dash: 22, gap: 20, opacity: 0.4, rng: r });                 // the cold light down her right leg
glint(p, poly([[-13.4, 70], [-12.6, 44], [-11.4, 14]]), warm, { width: 4.2, dash: 24, gap: 14, opacity: 0.6, rng: r });                       // the fires down her left leg

// ---------------------------------------------------------------- her skirt
// It is short, in folds. The wind lifts it to the left. There is a frill of white under its hem.
{
  const down = (fy) => clamp((99 - fy) / 27, 0, 1), halfW = (fy) => 10.5 + 12 * Math.pow(down(fy), 0.8), axis = (fy) => -3.6 * down(fy);
  const hemAt = (fx) => 72 + 1.6 * Math.sin(fx * 1.3) - 0.14 * fx;
  const inside = (x, y) => { const [fx, fy] = back(x, y); return fy < 100 && fy > hemAt(fx) && Math.abs(fx - axis(fy)) < halfW(fy); };
  const cloth = (x, y) => {
    const [fx, fy] = back(x, y), u = clamp((fx - axis(fy)) / halfW(fy), -1, 1), fold = Math.sin(fx * 1.5 + 0.4) * 0.5 + (nF(fx / 6, fy / 12) - 0.5) * 0.5;
    const c = fold > 0 ? mix('#4c3e78', '#7c6cb0', clamp(fold * 1.5, 0, 1)) : mix('#4c3e78', '#221a3c', clamp(-fold * 1.6, 0, 1));
    return mix(mix(c, '#a8b8d8', smooth(0.5, 1, u) * 0.4), '#ff8c44', smooth(-0.8, -1, u) * 0.4);
  };
  p.fill({ inside, bounds: [...A(-30, 103), ...A(26, 68)], width: 5.5, length: 22, spacing: 0.5, angle: (x, y) => { const [fx, fy] = back(x, y); return Math.atan2(105 - fy, fx - axis(fy) * 2); }, color: cloth, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.12, dry: 0.03, rag: 0.12, cap: 'round' } });
  for (let fx = -24; fx <= 18; fx += 5.4) { const fy = hemAt(fx) + 0.6; mark([[fx - 2.4, fy + 1.2], [fx, fy - 1.2], [fx + 2.4, fy + 1.2]], mix('#c8c8e8', '#ffffff', r()), 5.5); }   // the frill of white under its hem
  for (const fx of [-16, -8, 1, 9]) mark([[fx * 0.5, 97], [fx * 0.8, 86], [fx, 76]], '#1a1430', 4.6, { opacity: 0.5, taper: [0.2, 0.3] });                                      // the dark between its folds
}

// ---------------------------------------------------------------- her body
// The pale jacket; its hem has a line of violet. The wide collar lies over her shoulders and comes to a point at the middle of her back.
shape(p, poly([[-10.4, 99], [10.4, 99], [11.4, 114], [13.6, 130], [-13.6, 130], [-11.4, 114]]), jacket, { ...o, round: 11, length: 20, flow: () => Math.PI / 2 });
for (const [x0, y0, x1, y1] of [[-6, 126, -5, 104], [5, 126, 4.6, 104]]) mark([[x0, y0], [x1, y1]], '#6c6c94', 4.6, { opacity: 0.5, taper: [0.3, 0.3] });   // the seams of it
mark([[-10.6, 100], [0, 99], [10.8, 100]], '#4a3e74', 6, { cap: 'flat' });
mark([[-10.4, 102.6], [0, 101.6], [10.6, 102.6]], '#d8d8f0', 4, { opacity: 0.8 });
shape(p, poly([[-14.6, 133], [-6, 137], [6, 137], [14.6, 133], [15, 124], [8, 121], [0, 115], [-8, 121], [-15, 124]]), violet, { ...o, round: 9, length: 16, flow: () => Math.PI / 2 });
glint(p, poly([[-15, 124], [-8, 121], [0, 115], [8, 121], [15, 124]].map(([x, y]) => [x, y + 1.2])), () => '#e4e4f8', { width: 4.2, dash: 30, gap: 3, opacity: 0.9, rng: r });   // the white line along its edge

// ---------------------------------------------------------------- her right arm, and the pistol
solid(p, [A(14.4, 131, 5), A(17, 113, 4.4), A(18.4, 96, 3.9)], jacket, { ...o, length: 22 });
mark([[14.6, 97.6], [22.4, 96]], '#4a3e74', 6, { cap: 'flat' });                                                                             // the dark cuff
shape(p, poly([[15.6, 95], [21.6, 94], [22, 88], [19, 85], [15.6, 88]]), skin, { ...o, round: 4, length: 13, turn: 0 });                      // her hand
shape(p, poly([[17, 90], [22, 90], [24.6, 72], [20, 71]]), { shadow: '#06080c', half: '#14181e', lit: '#3c4650', rim: '#a8c0c8', bounce: '#3c1c14' }, { ...o, round: 4, length: 14, flow: () => 1.45 });   // the pistol: its barrel, which points down
mark([[16.8, 89], [12.6, 84]], '#0a0c10', 6.5, { cap: 'flat' });                                                                             // its grip
mark([[19, 80], [15.6, 78]].map(([x, y], i) => [x + (i ? -1 : 1), y]), '#0a0c10', 4.6);                                                       // its guard

// ---------------------------------------------------------------- her hair, which the storm takes out to the left
const lock = (pts, w, color, op = 1) => p.tryStroke({ ...line, color, width: w, opacity: op, taper: [0, 0.8], points: poly(pts) });
for (let k = 0; k < 26; k++) {
  const t = r(), x0 = -7 + 9 * t, y0 = 156 - 16 * t, reach = (70 - 26 * t) * r.range(0.65, 1.05), y2 = 166 - 52 * t + r.range(-6, 6), wave = r.range(2, 8);
  lock([[x0, y0], [x0 - reach * 0.35, y0 + (y2 - y0) * 0.25 + wave], [x0 - reach * 0.7, y0 + (y2 - y0) * 0.65 + wave * 0.4], [x0 - reach, y2 - wave]], r.range(6, 11), mix('#06060a', '#18182a', r()));
}
for (const [x0, y0, x1, y1, x2, y2] of [[-4, 145, -6, 122, -3, 100], [2, 145, 1, 120, 3, 98], [6, 146, 7, 124, 8, 106]]) lock([[x0, y0], [x1, y1], [x2, y2]], 10, mix('#06060a', '#14141e', r()));   // and the part of it that still falls down her back
for (const [x0, y0, x1, y1, x2, y2] of [[-6, 158, -34, 162, -64, 164], [-4, 152, -30, 148, -58, 146], [0, 146, -22, 134, -44, 124], [-2, 154, -24, 156, -46, 156]]) lock([[x0, y0 + 1], [x1, y1 + 2], [x2, y2 + 1]], 4.4, '#7c94b8', 0.6);   // the cold light on the tops of the locks

// ---------------------------------------------------------------- her left arm, and the shield
solid(p, [A(-14.4, 131, 5), A(-19, 114, 4.4), A(-27, 102, 4)], jacket, { ...o, length: 20 });
{
  const [cx, cy] = A(-32, 99), R = 17 * S;
  studio.orb(p, [[cx, cy, R]], (x, y) => { const k = clamp(((x - cx) * 0.75 + (cy - y) * 0.65) / R, -1, 1), q = Math.hypot(x - cx, y - cy) / R; let c = k > 0 ? mix('#5c6676', '#b8c4d0', k) : mix('#5c6676', '#1e242e', -k); if (q > 0.6 && q < 0.8) c = mix(c, '#12161e', 0.7); return c; }, { width: 6, reach: 24 });
  for (const s of [-1, 1]) p.tryStroke({ ...line, color: s < 0 ? '#6c50b0' : '#8c70d0', width: 8, points: arc(cx, cy, R * 0.36, s < 0 ? 2.0 : -1.14, s < 0 ? 4.28 : 1.14, 8) });   // the two windows of violet glass
  for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283 + 0.2; p.tryStroke({ color: '#c8d4dc', width: 4, opacity: 0.7, points: [[cx + Math.cos(a) * R * 0.62, cy + Math.sin(a) * R * 0.62], [cx + Math.cos(a) * R * 0.94, cy + Math.sin(a) * R * 0.94]] }); }   // the teeth of the wheel that turns in it
  studio.disc(p, cx, cy, 8.4, '#a02038', 6.2, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round' });
  p.tryStroke({ color: '#ff9cac', width: 4, opacity: 0.9, points: arc(cx, cy, 5, 3.6, 5.4, 5).map(([x, y]) => [x - 1, y - 1]).concat([[cx + 7, cy - 6]]) });
  glint(p, arc(cx, cy, R - 2.4, -1.5, 0.4, 12), () => '#e8f4f4', { width: 4.4, dash: 24, gap: 6, opacity: 0.9, rng: r });                    // the cold light on its edge
  glint(p, arc(cx, cy, R - 2.4, 1.9, 3.4, 10), warm, { width: 4.4, dash: 18, gap: 8, opacity: 0.7, rng: r });                                // and the fires
}

// ---------------------------------------------------------------- her head
// Her neck; her head, tilted back, with the line of her face at the right of it; the dark band on her hair.
solid(p, [A(0, 136, 3.6), A(0.6, 142, 3.6)], skin, { ...o, length: 13, edge: false });
shape(p, poly([[4, 158], [9.4, 158], [11, 154.6], [11.4, 151.6], [13.6, 149.4], [11.6, 148], [12, 146], [10.6, 145], [10.4, 142.4], [7.6, 140.6], [3.4, 141.4], [2.6, 150]]), skin, { ...o, round: 6, length: 13, turn: -0.1 });   // her face: brow, nose, lips, chin
mark([[7.4, 153.6], [10.6, 153]].map(([x, y], i) => [x + (i ? 0.6 : -0.6), y]), '#3c2c5c', 4.6);                                             // her eye
mark([[6.6, 156], [10.6, 155.6]].map(([x, y], i) => [x + (i ? 0.4 : -0.4), y]), '#0a0a12', 4, { opacity: 0.8 });                              // her brow
mark([[8.6, 144.6], [11.4, 145.4]].map(([x, y], i) => [x + (i ? 1 : -1), y]), '#b0606c', 4, { opacity: 0.8 });                                // her lips
shape(p, poly([[-10, 148], [-10.6, 156], [-6, 162.6], [1, 164.6], [7.6, 162], [10, 158], [5.4, 157.4], [3.4, 152], [3, 143], [-2, 140], [-8, 142]]), ink, { ...o, round: 9, length: 15, turn: 0.2 });   // her hair: the back and the top of her head
for (const [x0, y0, x1, y1] of [[6, 162, 10.6, 156], [3, 163.6, 8, 157.6]]) mark([[x0, y0], [x1, y1]], '#0a0a12', 5, { taper: [0, 0.5] });     // the hair over her brow
mark([[3.6, 152], [4.4, 142], [3, 134]], '#0a0a12', 5.5, { taper: [0, 0.5] });                                                               // and the lock in front of her ear
p.tryStroke({ ...line, color: '#4a3c78', width: 5.4, points: poly([[-9.6, 153], [-6, 160.6], [1, 163.4], [7.6, 161]]) });                    // the band on her hair
glint(p, poly([[-4, 163.6], [2, 165], [8, 162.4]]), () => '#a8c4d0', { width: 4.2, dash: 14, gap: 6, opacity: 0.85, rng: r });                // the cold light on the top of her head

p.save();
