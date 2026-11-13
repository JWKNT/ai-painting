// Rance and Sill, seen from behind on the hill. Rance stands with his feet apart, one hand
// on his hip, the sword Chaos raised to the sun, his cape blowing to the right. Sill is at
// his side, small under her cloud of pink hair.
'use strict';
const { studio, open, RANCE, SILL } = require('./scene');
const { mix, arc, disc, clamp, lerp } = studio;

const p = open('figures');
const r = p.rng;

// Shadows on the grass, falling away from the sun.
for (const [x, y, len, w] of [[RANCE.x - 10, RANCE.y - 2, 250, 54], [SILL.x - 6, SILL.y - 4, 170, 46]]) {
  p.stroke({ brush: 'soft', color: '#1f4f24', width: w, opacity: 0.42, taper: [0, 0.6], points: [[x + 24, y], [x - len * 0.5, y + len * 0.2], [x - len, y + len * 0.36]] });
}

// ---------------------------------------------------------------- Rance
{
  const R = (x, y) => [RANCE.x + x, RANCE.y + y];
  const line = (a, b, o) => p.line(...R(...a), ...R(...b), o);
  const path = (pts, o) => p.stroke({ ...o, points: pts.map(([x, y, q]) => (q == null ? R(x, y) : [...R(x, y), q])) });
  const cloth = '#2a2935', clothLit = '#4a4a5e';
  const green = '#2c8c4e', greenLit = '#62cf80', greenDark = '#1c6236', gold = '#e6bb4a';

  // the sword: grip through the fist, a dark guard with one yellow eye, the long black blade
  const d = [0.469, -0.883], n = [0.883, 0.469], fist = [132, -456];
  const along = (t, s = 0) => [fist[0] + d[0] * t + n[0] * s, fist[1] + d[1] * t + n[1] * s];
  path([along(34, -2), along(140, -1), along(262, 0)], { brush: 'soft', color: '#6a3f9a', width: 64, opacity: 0.2 });                  // its dark glow
  path([along(30), along(140), along(258)], { brush: 'flat', color: '#1e1828', width: 30, taper: [0, 0.3], rag: 0, cap: 'round', jitter: 0.3, streak: 0.1 });
  path([along(36, 9), along(130, 9), along(214, 6)], { color: '#6d5e92', width: 7, opacity: 0.9, taper: [0, 0.5] });                    // the edge toward the sun
  path([along(52, 11.5), along(110, 11.5), along(168, 10)], { color: '#e6defc', width: 4, opacity: 0.85 });
  path([along(40, -8), along(120, -8), along(190, -6)], { color: '#3a2c4e', width: 6, opacity: 0.8 });
  line(along(-34), along(30), { color: '#3b2a22', width: 9 });                                                                          // grip
  line(along(24, -31), along(24, 31), { brush: 'flat', color: '#2a2030', width: 13, rag: 0, cap: 'round' });                           // guard
  line(along(24, -7.3), along(24, 7.3), { color: '#ffd53a', width: 7 });                                                                // the eye of Chaos
  line(along(17.8, 0), along(30.2, 0), { color: '#1a1420', width: 4.4 });                                                                // its slit pupil

  // legs: dark cloth to the knee, green greaves below, feet planted apart and turned out
  for (const s of [-1, 1]) {
    line([s * 20, -200], [s * 33, -106], { brush: 'flat', color: cloth, width: 41, rag: 0, cap: 'round', jitter: 0.2 });
    path([[s * 33, -110, 1], [s * 38, -64, 0.92], [s * 42, -18, 0.74]], { brush: 'flat', color: s < 0 ? greenDark : green, width: 37, rag: 0, cap: 'round', jitter: 0.3, streak: 0.1 });
    line([s * 34, -11], [s * 70, -5], { brush: 'flat', color: greenDark, width: 17, rag: 0, cap: 'round' });
    line([s * 33 + 11, -104], [s * 42 + 9, -24], { color: greenLit, width: 7, opacity: 0.85 });                                         // sun along the greave
    line([s * 33 - 15, -108], [s * 33 + 15, -111], { color: gold, width: 10 });                                                         // knee band
    line([s * 20 + 13, -192], [s * 33 + 14, -118], { color: clothLit, width: 6, opacity: 0.7 });
  }

  // the raised arm
  line([70, -316], [112, -382], { brush: 'flat', color: cloth, width: 30, rag: 0, cap: 'round' });
  line([83, -318], [121, -378], { color: clothLit, width: 6, opacity: 0.7 });
  line([113, -384], [132, -450], { brush: 'flat', color: green, width: 29, rag: 0, cap: 'round', jitter: 0.3 });
  line([124, -382], [142, -442], { color: greenLit, width: 7, opacity: 0.85 });
  line([103, -390], [127, -385], { color: gold, width: 8 });
  line([120, -448], [143, -471], { color: '#5a3a24', width: 16 });                                                                      // the gloved fist

  // the cape: strokes fall from the shoulders to a hem that lifts and swings out to the right
  const top = (t) => [-60 + 120 * t, -314 + 5 * Math.sin(Math.PI * t)];
  const hem = (t) => [-70 + 206 * t, -146 + 12 * Math.sin(t * 4.2) - 46 * t * t];
  const fold = (t) => clamp(0.38 + 0.5 * t + 0.26 * Math.sin(t * 15), 0, 1);
  const tone = (l) => (l < 0.5 ? mix('#7c85a4', '#b9bfd2', l * 2) : mix('#b9bfd2', '#fffdf6', l * 2 - 1));
  for (let k = 0; k <= 11; k++) {
    const t = k / 11, a = top(t), b = hem(t);
    path([a, [lerp(a[0], b[0], 0.5) + 18 * t, lerp(a[1], b[1], 0.5)], b], { brush: 'bristle', color: tone(fold(t)), width: 31, mix: 0.05, dry: 0, rag: 0.05, cap: 'round', jitter: 0.3, streak: 0.1 });
  }
  for (const t of [0.14, 0.4, 0.62, 0.86]) {                                                                                            // the deep folds
    const a = top(t), b = hem(t);
    path([[a[0], a[1] + 30], [lerp(a[0], b[0], 0.55) + 18 * t, lerp(a[1], b[1], 0.55)], [b[0], b[1] - 8]], { color: '#6f7898', width: 7, opacity: 0.75, taper: [0.5, 0.1] });
  }
  for (const t of [0.28, 0.52, 0.76, 0.96]) {                                                                                           // light on their crests
    const a = top(t), b = hem(t);
    path([[a[0], a[1] + 40], [lerp(a[0], b[0], 0.55) + 18 * t, lerp(a[1], b[1], 0.55)], [b[0], b[1] - 14]], { color: '#ffffff', width: 8, opacity: 0.8, taper: [0.5, 0.2] });
  }
  path([hem(0), hem(0.2), hem(0.4), hem(0.6), hem(0.8), hem(1)].map(([x, y]) => [x, y - 3]), { color: '#8c94b0', width: 6, opacity: 0.85 });   // the hem

  // the arm set on the hip, in front of the cape
  line([-70, -310], [-124, -250], { brush: 'flat', color: cloth, width: 30, rag: 0, cap: 'round' });
  line([-62, -300], [-112, -244], { color: clothLit, width: 6, opacity: 0.6 });
  line([-124, -249], [-70, -213], { brush: 'flat', color: greenDark, width: 29, rag: 0, cap: 'round', jitter: 0.3 });
  line([-118, -260], [-68, -227], { color: green, width: 9, opacity: 0.9 });
  line([-131, -262], [-115, -238], { color: gold, width: 8 });
  line([-72, -208], [-43, -202], { color: '#5a3a24', width: 14 });

  // the armor across the shoulders, and a plate over each shoulder with a gold edge
  path([[-62, -320], [0, -329], [62, -320]], { brush: 'flat', color: green, width: 25, rag: 0, cap: 'round', jitter: 0.3 });
  for (const s of [-1, 1]) {
    const body = s < 0 ? greenDark : green, light = s < 0 ? green : greenLit;
    path([[s * 36, -314], [s * 62, -338], [s * 92, -324], [s * 102, -296]], { brush: 'flat', color: body, width: 23, rag: 0, cap: 'round', jitter: 0.3 });
    path([[s * 48, -300], [s * 74, -313], [s * 100, -288]], { brush: 'flat', color: body, width: 19, rag: 0, cap: 'round', jitter: 0.3 });
    path([[s * 46, -326], [s * 64, -343], [s * 88, -334]], { color: light, width: 7, opacity: 0.9 });
    path([[s * 44, -287], [s * 76, -298], [s * 108, -281]], { color: gold, width: 5.5 });
  }
  path([[-20, -338], [0, -342], [20, -338]], { color: gold, width: 6 });

  // the head: thick brown hair in spikes, an ear and the edge of a cheek where he looks to the left
  const hx = -2, hy = -370;
  line([hx - 31.5, hy - 5], [hx - 27, hy + 18.5], { color: '#f0c8a0', width: 11.5 });
  disc(p, ...R(hx + 3, hy), 31, '#66401f', 11);
  for (const [deg, len, w] of [[-150, 24, 11.5], [-120, 26, 12.5], [-92, 27, 13], [-64, 28, 13.5], [-36, 30, 14.5], [-6, 34, 16], [26, 34, 16], [56, 30, 14.5], [168, 24, 11.5], [128, 28, 13.5], [92, 30, 14.5]]) {
    const a = deg * Math.PI / 180, bend = r.range(0.05, 0.3);            // the wind takes them to the right
    const at = (k) => [hx + 3 + Math.cos(a + bend * k) * (15 + len * k), hy + Math.sin(a + bend * k) * (15 + len * k)];
    path([at(0), at(0.55), at(1)], { color: mix('#583619', '#74491f', r()), width: w, taper: [0, 1] });
  }
  for (const [deg, len] of [[-96, 24], [-62, 24], [-30, 26], [2, 28], [34, 26]]) {                                                    // sun in the hair
    const a = deg * Math.PI / 180;
    path([[hx + 8 + Math.cos(a) * 14, hy + Math.sin(a) * 14], [hx + 8 + Math.cos(a + 0.12) * (14 + len), hy + Math.sin(a + 0.12) * (14 + len)]], { color: '#a8743e', width: 6, opacity: 0.85, taper: [0, 0.8] });
  }
  line([hx - 22, hy - 2], [hx - 20, hy + 12], { color: '#e2b38a', width: 7 });                                                           // ear
}

// ---------------------------------------------------------------- Sill
{
  const S = (x, y) => [SILL.x + x, SILL.y + y];
  const line = (a, b, o) => p.line(...S(...a), ...S(...b), o);
  const path = (pts, o) => p.stroke({ ...o, points: pts.map(([x, y]) => S(x, y)) });

  for (const s of [-1, 1]) line([s * 18, -28], [s * 19, -4], { color: '#6b4630', width: 11.5 });                                         // boots
  line([-28, -212], [-66, -262], { brush: 'flat', color: '#dfe3ee', width: 19, rag: 0, cap: 'round' });                                 // an arm lifted to cheer
  line([-21, -214], [-57, -262], { color: '#ffffff', width: 6, opacity: 0.8 });
  line([-64, -260], [-76, -276], { color: '#f3cfae', width: 9.5 });
  // the cloak: white, shaded blue on the side away from the sun, a green band at the hem
  for (let k = 0; k <= 5; k++) {
    const t = k / 5, l = clamp(0.3 + 0.6 * t + 0.18 * Math.sin(t * 11), 0, 1);
    path([[-30 + 60 * t, -222], [-44 + 88 * t, -128], [-58 + 116 * t, -36]], { brush: 'bristle', color: l < 0.5 ? mix('#8d97b6', '#c6ccdd', l * 2) : mix('#c6ccdd', '#fffefa', l * 2 - 1), width: 29, mix: 0.05, dry: 0, rag: 0.05, cap: 'round', jitter: 0.25 });
  }
  path([[-58, -40], [0, -34], [58, -40]], { brush: 'flat', color: '#3f9f5c', width: 11, rag: 0, cap: 'round' });
  path([[10, -40], [36, -37], [58, -42]], { color: '#7fd794', width: 5, opacity: 0.85 });
  path([[-16, -210], [-24, -130], [-30, -54]], { color: '#7f8aac', width: 6, opacity: 0.7 });
  path([[22, -208], [32, -130], [42, -56]], { color: '#ffffff', width: 7, opacity: 0.85 });

  // the hair: a big soft mass of pink, curl on curl, lighter toward the sun
  const cx = 0, cy = -264;
  disc(p, ...S(cx, cy), 50, '#ee86ad', 17, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round', jitter: 0.4 });
  const curls = [];
  for (let k = 0; k < 15; k++) { const a = k / 15 * 6.283 + r.range(-0.1, 0.1); curls.push([cx + Math.cos(a) * 44, cy + Math.sin(a) * 40, r.range(14.2, 18)]); }
  for (let k = 0; k < 9; k++) { const a = k / 9 * 6.283 + 0.3; curls.push([cx + Math.cos(a) * 22, cy + Math.sin(a) * 20, r.range(14.2, 16)]); }
  curls.push([cx, cy, 14.5]);
  curls.sort((a, b) => (a[0] - a[1]) - (b[0] - b[1]));
  for (const [x, y, rad] of curls) {
    const l = clamp(0.5 + ((x - cx) - (y - cy)) / 150 + r.range(-0.12, 0.12), 0, 1), a0 = r() * 6.283;
    const color = l < 0.5 ? mix('#d45f8b', '#ee86ad', l * 2) : mix('#ee86ad', '#ffc9dc', l * 2 - 1);
    path(arc(x, y, rad - 4.5, a0, a0 + 6.283, 10), { brush: 'bristle', color, width: 9.5, mix: 0, dry: 0, rag: 0, cap: 'round', jitter: 0.3 });
    path(arc(x, y, rad - 3, -2.3, -0.5, 6), { color: mix(color, '#ffe3ec', 0.6), width: 4.4, opacity: 0.8 });
  }
}

// Grass in front of their feet.
for (const [x0, x1, y] of [[RANCE.x - 84, RANCE.x + 84, RANCE.y + 6], [SILL.x - 34, SILL.x + 34, SILL.y + 4]]) {
  for (let x = x0; x < x1; x += r.range(5, 10)) {
    const h = r.range(14, 28), lean = r.range(-0.1, 0.4) * h;
    p.tryStroke({ color: r.pick(['#3f8a34', '#5aa43e', '#8fca56', '#2f7030']), width: r.range(4, 5.5), taper: [0, 0.75], points: [[x, y + r.range(-3, 6)], [x + lean * 0.35, y - h * 0.6], [x + lean, y - h]] });
  }
}

p.save();
