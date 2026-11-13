// Rance and Sill, seen from behind on the top of the hill, against the light. Rance stands
// with his feet apart, one hand on his hip, the sword Chaos raised, his cape blowing to the
// right. Sill is at his side under her cloud of pink hair. The sun is beyond them: they are
// dark, edged with light, and where the cape and the hair are thin the light comes through.
'use strict';
const { studio, open, RANCE, SILL, SUN, SUNLIGHT } = require('./scene');
const { mix, solid, glint, mass, ramp, lerp, clamp, smooth } = studio;

const p = open('figures');
const r = p.rng;
const o = { light: SUNLIGHT, turn: 0.4, width: 5 };
const toSun = (x, y) => { const dx = SUN.x - x, dy = SUN.y - y, l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
// A straight mark from a to b, lengthened about its middle if it is too short for its brush.
function mark(a, b, w, color, extra = {}) {
  const need = Math.max(12, 2 * w) + 0.5, len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  if (len < need) { const k = need / len / 2, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1]; a = [mx - dx * k, my - dy * k]; b = [mx + dx * k, my + dy * k]; }
  return p.stroke({ brush: 'bristle', mix: 0.05, dry: 0, rag: 0, cap: 'round', color, width: w, ...extra, points: [a, b] });
}

// Their shadows, long on the grass, falling toward us away from the sun.
for (const [x, y, w, len] of [[RANCE.x, RANCE.y - 4, 66, 250], [SILL.x, SILL.y - 4, 48, 200]]) {
  const dx = x - SUN.x, dy = y - 600, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l;
  p.stroke({ brush: 'soft', color: '#07120f', width: w, opacity: 0.42, points: [[x - ux * 10, y - uy * 10, 0.7], [x + ux * len * 0.5, y + uy * len * 0.5, 0.9], [x + ux * len, y + uy * len, 1]] });
}

const hide = { shadow: '#120b08', half: '#22140c', lit: '#6a3c1c', rim: '#ffb868' };

// ---------------------------------------------------------------- Rance
{
  const k = RANCE.h / 400;                                              // he is drawn 400 units tall
  const R = (x, y, rad) => (rad == null ? [RANCE.x + x * k, RANCE.y + y * k] : [RANCE.x + x * k, RANCE.y + y * k, rad * k]);
  const cloth = { shadow: '#0c0b15', half: '#171624', lit: '#3a3248', rim: '#ffc48c', bounce: '#161a28' };
  const armor = { shadow: '#06120e', half: '#0c251a', lit: '#235a3c', rim: '#eee89c', bounce: '#0e2228' };
  const blade = { shadow: '#0e0a18', half: '#1e1630', lit: '#54448a', rim: '#ffe2b4' };
  const gold = () => mix('#b88a34', '#ffd878', r());

  // the sword: grip through the fist, a dark guard with one yellow eye, the long black blade
  const d = [0.469, -0.883], n = [0.883, 0.469], fist = [134, -456];
  const A = (t, s = 0, rad) => R(fist[0] + d[0] * t + n[0] * s, fist[1] + d[1] * t + n[1] * s, rad);
  p.stroke({ brush: 'soft', color: '#4c3088', width: 52, opacity: 0.22, points: [A(30), A(150), A(280)] });                     // its dark glow
  solid(p, [A(32, 0, 16), A(130, 0, 15.5), A(214, 0, 12), A(262, 0, 5.5)], blade, { ...o, turn: 0.3, length: 40 });
  mark(A(-36), A(30), 10 * k, '#2a1c18');                                                                                       // grip
  mark(A(24, -34), A(24, 34), 13 * k, '#181224');                                                                               // guard
  mark(A(24, -8), A(24, 8), 6, '#ffd03a', { brush: 'round' });                                                                  // the eye of Chaos

  // legs: dark cloth to the knee, green greaves below, feet planted apart and turned out
  for (const s of [-1, 1]) {
    solid(p, [R(s * 21, -206, 27), R(s * 28, -152, 24), R(s * 34, -112, 21)], cloth, o);
    solid(p, [R(s * 34, -114, 24), R(s * 39, -66, 22), R(s * 43, -22, 17)], armor, o);
    solid(p, [R(s * 40, -10, 14), R(s * 56, -8, 13), R(s * 74, -6, 10)], armor, o);
    glint(p, [R(s * 34 - 20, -113), R(s * 34, -116), R(s * 34 + 20, -114)], gold, { width: 4.2, dash: 22, gap: 8, opacity: 0.45 });   // knee band
  }

  // the raised arm
  solid(p, [R(66, -318, 20), R(92, -354, 18), R(114, -386, 16.5)], cloth, o);
  solid(p, [R(114, -386, 19), R(126, -420, 17.5), R(134, -450, 15)], armor, o);
  solid(p, [R(130, -452, 13), R(142, -468, 12.5)], hide, o);                                                                    // the gloved fist

  // the cape: strokes falling from the shoulders to a hem that lifts and swings out to the
  // right. Over his back it is in shadow; where it flies free the sun comes through the cloth.
  const top = (t) => [-62 + 124 * t, -318 + 5 * Math.sin(Math.PI * t)];
  const hem = (t) => [-76 + 216 * t, -138 + 12 * Math.sin(t * 4.2) - 52 * t * t];
  const via = (t, q, dx = 0) => { const a = top(t), b = hem(t); return R(lerp(a[0], b[0], q) + 20 * t * Math.sin(Math.PI * q) + dx, lerp(a[1], b[1], q)); };
  const ridge = (t) => 0.5 + 0.5 * Math.sin(t * 17 + 0.9);            // 0 in the valley of a fold, 1 on its crest
  const free = (t) => smooth(0.5, 0.9, t);                            // where the cape flies clear of his back
  for (let i = 0; i <= 18; i++) {
    const t = i / 18, f = ridge(t), g = free(t);
    const tone = mix(mix('#262a58', '#5c6094', f), mix('#8a5a7c', '#fbc49c', f), g);
    p.stroke({ brush: 'bristle', color: mix(tone, '#ffffff', r() * 0.04), width: 24 * k, mix: 0.2, dry: 0, rag: 0.05, cap: 'round', jitter: 0.4, streak: 0.3, points: [via(t, 0.05), via(t, 0.5), via(t, 0.97)] });
  }
  for (let i = 0; i <= 36; i++) {                                     // the turn of each fold: dark in its valley, light where it faces the sun
    const t = i / 36, f = ridge(t), g = free(t);
    if (f < 0.12) p.tryStroke({ brush: 'bristle', color: mix('#1a1e44', '#6a4068', g), width: 5, opacity: 0.75, mix: 0.2, dry: 0, rag: 0, cap: 'round', taper: [0.5, 0.2], points: [via(t, 0.14), via(t, 0.55), via(t, 0.95)] });
    else if (f > 0.9) p.tryStroke({ brush: 'bristle', color: mix('#8084b4', '#ffe2bc', g), width: 5, opacity: 0.7, mix: 0.2, dry: 0, rag: 0, cap: 'round', taper: [0.5, 0.2], points: [via(t, 0.2, -4 * k), via(t, 0.6, -4 * k), via(t, 0.93, -4 * k)] });
  }
  glint(p, [via(0, 0.08, -8 * k), via(0, 0.5, -8 * k), via(0, 0.95, -8 * k)], () => mix('#ffd8a8', '#fff4de', r()), { width: 4.6, dash: 34, gap: 8, opacity: 0.9 });   // the sun down its near edge
  glint(p, [0.55, 0.7, 0.85, 1].map((t) => via(t, 0.985)), () => mix('#ffd0a0', '#fff0d0', r()), { width: 4.4, dash: 24, gap: 10, opacity: 0.8 });                  // and along the lifted hem

  // the arm set on the hip, outside the cape
  solid(p, [R(-64, -316, 20), R(-98, -284, 18), R(-126, -250, 16.5)], cloth, o);
  solid(p, [R(-126, -250, 19), R(-102, -230, 17.5), R(-76, -214, 15)], armor, o);
  solid(p, [R(-74, -212, 13), R(-56, -206, 12)], hide, o);

  // the armor across the shoulders, and a plate over each shoulder with a gold edge
  solid(p, [R(-50, -320, 17), R(0, -330, 19), R(50, -320, 17)], armor, o);
  for (const s of [-1, 1]) {
    solid(p, [R(s * 44, -314, 23), R(s * 76, -330, 25), R(s * 104, -306, 20)], armor, o);
    glint(p, [R(s * 44, -292), R(s * 78, -300), R(s * 116, -286)], gold, { width: 4.2, dash: 22, gap: 12, opacity: 0.45 });
  }

  // the head: thick brown hair in spikes, the light catching the ones that point at the sun
  const hx = 0, hy = -372;
  solid(p, [R(hx, hy + 26, 13), R(hx, hy + 38, 14)], { shadow: '#3c2420', half: '#7c4c3c', lit: '#f0a878', rim: '#ffd8a8' }, o);  // the neck
  solid(p, [R(hx, hy - 5, 28), R(hx, hy + 8, 27)], hide, { ...o, length: 20 });
  const [lx, ly] = toSun(...R(hx, hy));
  for (const [deg, len] of [[-158, 26], [-136, 30], [-114, 33], [-92, 35], [-70, 36], [-48, 36], [-26, 36], [-4, 35], [18, 33], [40, 30], [170, 24], [146, 26], [120, 27], [92, 27], [64, 28], [-178, 24]]) {
    const a = deg * Math.PI / 180, bend = r.range(0.06, 0.3);            // the wind takes them to the right
    const at = (q) => R(hx + Math.cos(a + bend * q) * (14 + len * q), hy + Math.sin(a + bend * q) * (14 + len * q));
    const facing = Math.cos(a) * lx + Math.sin(a) * ly;
    p.tryStroke({ brush: 'bristle', color: mix(mix('#140c08', '#24150c', r()), '#6a3c1c', clamp(facing, 0, 1) * 0.45), width: 8.5, taper: [0, 1], mix: 0.05, dry: 0, rag: 0, cap: 'round', points: [at(0), at(0.55), at(1)] });
    if (facing > 0.62) p.tryStroke({ color: mix('#f08c40', '#ffd890', r()), width: 4, opacity: 0.75, taper: [0.2, 0.8], points: [at(0.35), at(0.7), at(1.05)].map(([x, y]) => [x + lx * 2.5, y + ly * 2.5]) });
  }
  mark(R(hx - 26, hy + 4), R(hx - 24, hy + 18), 5.5, '#f2ac7c');                                                                // an ear and the edge of his cheek, in the sun
}

// ---------------------------------------------------------------- Sill
{
  const k = SILL.h / 300;                                               // she is drawn 300 units tall
  const S = (x, y, rad) => (rad == null ? [SILL.x + x * k, SILL.y + y * k] : [SILL.x + x * k, SILL.y + y * k, rad * k]);
  const robe = { shadow: '#262a58', half: '#44487c', lit: '#9c94b8', rim: '#fff0d6', bounce: '#34386a' };

  for (const s of [-1, 1]) mark(S(s * 17, -30), S(s * 18, -2), 12 * k, '#1c1410');                                              // boots
  solid(p, [S(-22, -212, 13), S(-44, -238, 14), S(-64, -262, 15)], robe, o);                                                // an arm lifted to cheer
  solid(p, [S(-70, -270, 8.5), S(-79, -283, 8)], { shadow: '#4a2c2c', half: '#8a5648', lit: '#f0ac84', rim: '#ffe2bc' }, o);
  // the cloak: white, in shade on this side, its folds edged with light toward the sun
  solid(p, [-0.8, -0.28, 0.28, 0.8].map((u) => [S(u * 22, -224, 13), S(u * 28, -168, 15), S(u * 44, -104, 19), S(u * 58, -54, 22)]), robe, { ...o, turn: 0.25, length: 36, width: 6 });
  for (const u of [-0.54, 0, 0.54]) p.tryStroke({ brush: 'bristle', color: '#262852', width: 5, opacity: 0.6, mix: 0.2, dry: 0, rag: 0, cap: 'round', taper: [0.5, 0.2], points: [S(u * 26, -196), S(u * 38, -124), S(u * 58, -52)] });
  solid(p, [S(-60, -42, 8), S(0, -35, 8), S(60, -42, 8)], { shadow: '#0e281a', half: '#1a4c30', lit: '#56a86c', rim: '#e6f2a0' }, o);   // the green band at the hem

  // the hair: a big soft mass of pink, curl on curl. Its depths are dusky; the sun burns in its edge.
  const [cx, cy] = S(0, -262), curls = [[cx, cy, 36 * k]];
  for (let i = 0; i < 11; i++) { const a = i / 11 * 6.283 + r.range(-0.12, 0.12); curls.push([cx + Math.cos(a) * 31 * k, cy + Math.sin(a) * 28 * k, r.range(15, 20) * k]); }
  for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + 0.4; curls.push([cx + Math.cos(a) * 15 * k, cy + Math.sin(a) * 13 * k, r.range(14, 17) * k]); }
  mass(p, curls, { light: toSun, tones: (t) => ramp(['#3c1c3c', '#642e58', '#9c4a78', '#de82a8', '#ffcad8'], t), bias: 0.26, contrast: 0.85, grain: 0.3, mix: 0.2,
    layers: [[9, 20, 0.96, 3.5, 0.42], [5.5, 14, 0.9, 2.5, 0.7]], crown: '#fff0e4', crownOpacity: 0.85, crownSpan: 0.3, seed: 31 });
}

// Grass in front of their feet: dark, a few blades lit.
for (const [x0, x1, y] of [[RANCE.x - 66, RANCE.x + 66, RANCE.y + 5], [SILL.x - 30, SILL.x + 30, SILL.y + 3]]) {
  for (let x = x0; x < x1; x += r.range(5, 10)) {
    const h = r.range(13, 22), lean = r.range(-0.1, 0.4) * h;
    p.tryStroke({ color: r() < 0.16 ? mix('#7fa244', '#e2d86a', r()) : r.pick(['#14281f', '#1f3a28', '#2c4c32', '#0f201c']), width: r.range(4, 5), taper: [0, 0.75], points: [[x, y + r.range(-3, 5)], [x + lean * 0.35, y - h * 0.6], [x + lean, y - h]] });
  }
}

p.save();
