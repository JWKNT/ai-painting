// Minato Kageaki, and the fires. He stands under the spider with his back to us: black
// hair, a long dark coat with a belt, boots. His left hand is on the mouth of his
// scabbard; in his right hand is the sword, drawn, with its point low. The fires are
// behind him at each side, so he is dark, with a line of their light down each side of
// him, and the moon is a pale line on his shoulders and his hair. Then the fires
// themselves, the sparks that go up from them, and the corners of the picture.
'use strict';
const { studio, open, W, H, MAN, FIRES, MOON } = require('./scene');
const { mix, solid, shape, glint, glow } = studio;

const p = open('man');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.05, cap: 'round' };
const U = MAN.U, P = (X, Y) => [MAN.x + X * U, MAN.feet - Y * U];
const o = { light: [0, -1], turn: 0.6, width: 5.5, length: 20, vary: 0.05, mix: 0.05, edge: false };
const chain = (pts) => pts.map(([X, Y, R]) => [...P(X, Y), R * U]);
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts.map(([X, Y]) => P(X, Y)) });
const coat = { shadow: '#04060c', half: '#0c1220', lit: '#222c44', bounce: '#3c1c14' };
const warm = () => mix('#e0742c', '#ffc070', r()), cold = () => mix('#93a8e0', '#e8eeff', r());

// ---------------------------------------------------------------- the fires: tongues of flame of all sizes that lean a little, and their sparks
for (const [fx, fy] of FIRES) {
  for (const [w, op, n] of [[150, 0.08, 5], [90, 0.14, 6], [50, 0.24, 6]]) glow(p, fx, fy - 40, w, mix('#ff7a24', '#ffd890', 1 - w / 160), op, n);
  for (const [n, h0, h1, c0, c1, w0] of [[9, 40, 90, '#d8381c', '#ff7a24', 13], [8, 30, 70, '#ff8a24', '#ffc040', 10], [6, 20, 44, '#ffd45c', '#fffbe0', 7]]) for (let k = 0; k < n; k++) { const x = fx + r.range(-26, 26), h = r.range(h0, h1) * (1 - Math.abs(x - fx) / 60), lean = r.range(-0.1, 0.36); p.tryStroke({ ...line, mix: 0.2, rag: 0.3, color: mix(c0, c1, r()), width: w0 * r.range(0.7, 1.1), taper: [0.1, 0.85], points: [[x, fy - 12], [x + lean * h * 0.3 + r.range(-4, 4), fy - 12 - h * 0.55], [x + lean * h, fy - 12 - h]] }); }
  for (let k = 0; k < 14; k++) { const up = Math.pow(r(), 1.3) * 230, x = fx + r.range(-20, 20) + up * 0.2 + 16 * Math.sin(up / 40 + k), y = fy - 90 - up; glow(p, x, y, 9, '#ff8a3c', 0.2 * (1 - up / 300), 6); p.tryStroke({ brush: 'round', color: mix('#ff9a3c', '#ffe490', r()), width: 4, opacity: 0.9 * (1 - up / 320), taper: [0.4, 0.6], points: [[x, y + 7], [x + 2, y - 7]] }); }
}

// ---------------------------------------------------------------- his shade on the stones: two, one from each fire, which go toward us and apart
for (const s of [-1, 1]) p.stroke({ brush: 'soft', color: '#04050a', width: 44, opacity: 0.4, taper: [0, 0.5], points: [P(0, 0.02), P(s * 0.3, -0.12), P(s * 0.66, -0.24)] });

// ---------------------------------------------------------------- his legs and his boots
for (const s of [-1, 1]) { mark([[s * 0.13 - 0.1, 0.045], [s * 0.13 + 0.1, 0.045]], '#030408', 17); solid(p, chain([[s * 0.1, 0.84, 0.1], [s * 0.115, 0.46, 0.086], [s * 0.125, 0.12, 0.078]]), coat, { ...o, flow: () => Math.PI / 2 }); }
// the skirt of his coat, to the knee; the wind moves it a little to the right
shape(p, [[-0.2, 1.04], [0.2, 1.04], [0.31, 0.6], [0.2, 0.5], [0.04, 0.52], [0.0, 0.88], [-0.04, 0.52], [-0.26, 0.56]].map(([X, Y]) => P(X, Y)), coat, { light: [0, -1], turn: 0.6, width: 6, length: 26, round: 0.07 * U, vary: 0.05, mix: 0.05, flow: () => Math.PI / 2, edge: false });
// his scabbard: at his left side, it goes back and down from his hip
mark([[-0.2, 1.0], [-0.44, 0.74], [-0.64, 0.56]], '#06080e', 9); mark([[-0.22, 1.03], [-0.44, 0.78]], '#93a8e0', 4, { opacity: 0.4 });
// his body, and his left arm, whose hand is at the mouth of the scabbard
solid(p, chain([[0, 1.04, 0.185], [0, 1.24, 0.195], [0, 1.44, 0.22]]), coat, { ...o, width: 6, length: 26, flow: () => Math.PI / 2 });
mark([[-0.19, 1.02], [0, 1.005], [0.19, 1.02]], '#020306', 9);                                                                          // his belt
mark([[0.0, 1.48], [0.0, 1.24], [0.0, 1.04]], '#020306', 4.4, { opacity: 0.6, taper: [0.2, 0.3] });                                      // the seam of his back
solid(p, chain([[-0.245, 1.42, 0.074], [-0.3, 1.2, 0.066], [-0.24, 1.04, 0.056]]), coat, o);
// his right arm, a little out from his side, and the hand with the sword
solid(p, chain([[0.245, 1.42, 0.074], [0.3, 1.18, 0.066], [0.33, 0.96, 0.056]]), coat, o);
solid(p, chain([[0.335, 0.9, 0.046], [0.34, 0.86, 0.044]]), { shadow: '#2c1c1a', half: '#5c4034', lit: '#b47c58', bounce: '#6c3c24' }, o);
// the sword: the hilt in his hand, a small round guard, and the long blade, down and out to the right; the moon is on its back and the fire on its flat
{ const g = P(0.36, 0.84), tip = P(0.98, 0.14), h = P(0.3, 0.92), midp = [(g[0] + tip[0]) / 2, (g[1] + tip[1]) / 2 + 3];
  p.tryStroke({ ...line, color: '#0a0a10', width: 8, points: [h, [g[0] + 4, g[1] + 4]] });
  p.tryStroke({ ...line, color: '#b08c3c', width: 9, points: [[g[0] - 4, g[1] - 9], [g[0] + 8, g[1] + 10]] });
  p.tryStroke({ ...line, mix: 0, color: '#8c98b8', width: 7.5, taper: [0, 0.6], points: [g, midp, tip] });
  p.tryStroke({ brush: 'round', color: '#f4f8ff', width: 4.2, taper: [0, 0.4], points: [[g[0] + 2, g[1] - 3], [midp[0] + 2, midp[1] - 3], [tip[0], tip[1] - 1]] });
  p.tryStroke({ brush: 'round', color: '#ff9a4c', width: 4, opacity: 0.7, taper: [0.3, 0.5], points: [[g[0] + 20, g[1] + 26], [midp[0] - 1, midp[1] + 3]] });
  for (const [w, op] of [[30, 0.1], [14, 0.24]]) glow(p, tip[0] - 60, tip[1] - 66, w, '#e8eeff', op, 6); }
// his collar, his neck and his head: black hair, a little long at the neck
mark([[-0.16, 1.52], [0, 1.495], [0.16, 1.52]], '#0c1424', 10);
solid(p, chain([[0, 1.56, 0.06], [0, 1.53, 0.062]]), { shadow: '#2c1c1a', half: '#5c4034', lit: '#a8745c', bounce: '#6c3c24' }, o);
solid(p, chain([[-0.014, 1.67, 0.118], [0.014, 1.67, 0.118]]), { shadow: '#030306', half: '#0a0a12', lit: '#1c2238', bounce: '#2c1810' }, { ...o, flow: () => Math.PI / 2 });
for (const [X, l] of [[-0.08, 0.14], [-0.02, 0.17], [0.05, 0.15], [0.1, 0.12]]) mark([[X, 1.6], [X * 1.1, 1.6 - l]], '#05050a', 6, { taper: [0, 0.8] });

// ---------------------------------------------------------------- the lights on him
// the fires: a line down each side of him, stronger low down
for (const s of [-1, 1]) {
  glint(p, [P(s * 0.3, 1.4), P(s * 0.365, 1.2), P(s * 0.38, 0.98)], warm, { width: 4.4, dash: 26, gap: 10, opacity: 0.75, rng: r });
  glint(p, [P(s * 0.22, 1.0), P(s * 0.3, 0.72), P(s * 0.32, 0.56)], warm, { width: 4.4, dash: 26, gap: 10, opacity: 0.8, rng: r });
  glint(p, [P(s * 0.2, 0.5), P(s * 0.2, 0.3), P(s * 0.2, 0.12)], warm, { width: 4.4, dash: 24, gap: 10, opacity: 0.8, rng: r });
}
// the moon: a pale line on his shoulders and the top of his head
glint(p, [P(-0.31, 1.48), P(-0.2, 1.63), P(-0.12, 1.66)], cold, { width: 4, dash: 22, gap: 8, opacity: 0.6, rng: r });
glint(p, [P(0.12, 1.66), P(0.2, 1.63), P(0.31, 1.48)], cold, { width: 4, dash: 22, gap: 8, opacity: 0.6, rng: r });
glint(p, [P(-0.1, 1.77), P(0, 1.795), P(0.1, 1.77)], cold, { width: 4.2, dash: 22, gap: 6, opacity: 0.8, rng: r });

// ---------------------------------------------------------------- the light of the moon on the stones under the spider, and the corners
p.stroke({ brush: 'soft', color: '#93a8e0', width: 60, opacity: 0.1, points: [[560, 830], [800, 824], [1040, 830]] });
for (const [x0, y0, x1, y1, w, op] of [[-60, -40, 460, -70, 200, 0.4], [W + 60, -40, 1140, -70, 200, 0.4], [-60, H + 50, 520, H + 60, 150, 0.4], [W + 60, H + 50, 1080, H + 60, 150, 0.4]]) p.stroke({ brush: 'soft', color: '#02030a', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
void MOON; void H;

p.save();
