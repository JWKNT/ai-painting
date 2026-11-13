// The two partners, on the wet sand, their backs to us. Each has turned its head a little
// toward the other, so we see the side of each face.
// On the left is a Piplup: a small penguin with a big round head. Its head and the cape of
// feathers down its back are dark blue, its body is pale blue, its face is white, its beak
// and its feet are yellow. On the right is a Chimchar: a small ape with orange fur, a pale
// face, big round ears, a curl of fur on its head, and a flame where its tail would be.
// The sun is in front of them, so they are in shade with its light along their edges, and
// the flame lights the backs of both.
'use strict';
const { studio, open, SUN, SUNLIGHT, PIPLUP, CHIMCHAR } = require('./scene');
const { mix, clamp, smooth, solid, shape, orb, glint, arc } = studio;

const p = open('friends');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round' };
const o = { light: SUNLIGHT, turn: 0.35, width: 5.5, length: 18, vary: 0.07, dash: 16, gap: 6, edgeOpacity: 0.9 };
const FLAME = [CHIMCHAR.x + 2, CHIMCHAR.y - 36];                        // where the flame burns
const at = (F) => (dx, dy) => [F.x + dx, F.y - dy], P = at(PIPLUP), C = at(CHIMCHAR);
// How strongly the flame lights a place, and the sun's edge light on a round thing.
const flameOn = (x, y, reach = 150) => clamp(1 - Math.hypot(x - FLAME[0], y - FLAME[1]) / reach, 0, 1);
// A round part: its own color, darker low down, lit by the flame from one side and by the sun along its upper edge. Its strokes go round it.
function ball(circles, base, deep, o2 = {}) {
  const top = Math.min(...circles.map((c) => c[1] - c[2])), bot = Math.max(...circles.map((c) => c[1] + c[2]));
  const depth = (x, y) => { let best = -1e9; for (const [ax, ay, ar] of circles) best = Math.max(best, ar - Math.hypot(x - ax, y - ay)); return best; };
  const colorAt = (x, y) => {
    const up = 1 - (y - top) / (bot - top), d = depth(x, y), toSun = clamp(((SUN.x - x) * 0.6 + (y - SUN.y) * 0) / 300, -1, 1);
    let c = mix(deep, base, clamp(0.2 + 0.85 * up + r.range(-0.1, 0.1), 0, 1));
    c = mix(c, o2.sky || '#7c6cb0', smooth(0.5, 1, up) * 0.18);                                // the sky, on what is turned up
    c = mix(c, o2.warm || '#ffb050', flameOn(x, y, o2.reach || 150) * (o2.flame != null ? o2.flame : 0.55));   // the flame
    return mix(c, o2.edge || '#fff0c8', smooth(8, 1.5, d) * smooth(0.3, 0.8, up + toSun * 0.2) * 0.95);   // the sun along its upper edge
  };
  orb(p, circles, colorAt, { width: o2.width || 6, reach: o2.grain || 26 });
}

// What the wet sand shows of them: each upside down under its feet, broken by the ripples, and the flame with them.
for (const [F, w, len] of [[PIPLUP, 96, 150], [CHIMCHAR, 84, 170]]) {
  p.stroke({ brush: 'soft', color: '#4a3858', width: w * 0.62, opacity: 0.4, taper: [0, 0.5], points: [[F.x, F.y - 2], [F.x + 2, F.y + len * 0.5], [F.x + 3, F.y + len]] });
  for (let k = 0; k < 13; k++) {
    const y = F.y + 8 + k * 11 + r.range(-3, 3), half = w * 0.5 * (1 - k / 16) * r.range(0.5, 1.1), x = F.x + r.range(-8, 8);
    p.tryStroke({ ...line, color: F === PIPLUP ? mix('#2a2c5c', '#5c6ca0', r()) : mix('#6c3424', '#b05c2c', r()), width: r.range(5, 8), opacity: 0.55 - k * 0.03, mix: 0.2, rag: 0.3, points: [[x - Math.max(6.4, half), y], [x + Math.max(6.4, half), y + r.range(-1, 1)]] });
  }
}
for (let k = 0; k < 9; k++) { const y = CHIMCHAR.y + 14 + k * 12, half = (20 - k * 1.4) * r.range(0.6, 1.2); p.tryStroke({ ...line, color: mix('#ff8a34', '#ffe080', r()), width: r.range(5, 7.5), opacity: 0.8 - k * 0.07, mix: 0.2, rag: 0.3, points: [[FLAME[0] - Math.max(6.4, half) + r.range(-3, 3), y], [FLAME[0] + Math.max(6.4, half) + r.range(-3, 3), y]] }); }

// ---------------------------------------------------------------- the Piplup
{
  const navy = { shadow: '#141e44', half: '#263a78', lit: '#5068b4', rim: '#ffe6b8', bounce: '#5c3a5c' };
  const yellow = { shadow: '#a0702c', half: '#e0a83c', lit: '#ffdc70', rim: '#fff6c8', bounce: '#b08050' };
  const poly = (pts) => pts.map(([x, y]) => P(x, y));
  // its feet: yellow, each with three toes
  for (const s of [-1, 1]) {
    shape(p, poly([[s * 8, 12], [s * 34, 14], [s * 44, 4], [s * 30, -3], [s * 10, 0]]), yellow, { ...o, round: 7, length: 14 });
    for (const dx of [18, 28, 38]) p.tryStroke({ color: '#8c5c20', width: 4, opacity: 0.7, points: [P(s * dx, 9), P(s * (dx + 3), -3.5)] });
  }
  // its body: round, pale blue, with the short dark tail under the cape
  ball([[PIPLUP.x, PIPLUP.y - 60, 52], [PIPLUP.x, PIPLUP.y - 84, 46]], '#86acd4', '#3f5f96', { grain: 30 });
  for (let k = 0; k < 40; k++) {                                         // the down on it: short pale strokes that lie the way the feathers do
    const a = r.range(0, 6.283), q = Math.sqrt(r()) * 0.85, x = PIPLUP.x + Math.cos(a) * 48 * q, y = PIPLUP.y - 62 + Math.sin(a) * 46 * q, len = r.range(12.4, 18);
    if (Math.abs(x - PIPLUP.x) < 30 && y < PIPLUP.y - 40) continue;                              // the cape will cover the middle of its back
    p.tryStroke({ ...line, color: mix('#a8c8e8', '#5c7cb0', r()), width: 4.8, opacity: 0.55, rag: 0.3, taper: [0.2, 0.6], points: [[x, y], [x + (x - PIPLUP.x) * 0.06, y + len]] });
  }
  // its two flippers: dark blue, flat, a little out from its sides; the one on the side of its friend is lifted, as if to point
  shape(p, poly([[-40, 112], [-56, 96], [-70, 64], [-70, 44], [-58, 42], [-48, 62], [-36, 92]]), navy, { ...o, round: 9, length: 20 });
  shape(p, poly([[38, 112], [58, 104], [82, 86], [96, 72], [92, 62], [72, 68], [48, 82], [34, 96]]), navy, { ...o, round: 9, length: 20 });
  // the cape of dark feathers down its back: wide at its shoulders, and it ends low down in two short tails
  shape(p, poly([[-36, 116], [-34, 84], [-24, 52], [-18, 28], [-6, 34], [0, 44], [6, 34], [18, 28], [24, 52], [34, 84], [36, 116], [0, 124]]), navy, { ...o, round: 16, length: 24, flow: () => Math.PI / 2 });
  for (let k = 0; k < 26; k++) { const x = r.range(-28, 28), y = r.range(40, 112), len = r.range(13, 20); if (Math.abs(x) < 34 - (112 - y) * 0.16) p.tryStroke({ ...line, color: mix('#101838', '#3c5494', r()), width: 4.8, opacity: 0.6, rag: 0.3, taper: [0.2, 0.6], points: [P(x, y), P(x * 0.96, y - len)] }); }   // its feathers
  // its head: big and round, dark blue
  ball([[PIPLUP.x, PIPLUP.y - 146, 52]], '#2c4284', '#141f4c', { grain: 30, flame: 0.4 });
  // its face, turned to its friend: the white of its cheek, which goes round its eye; the pale blue above its beak; its eye; its beak
  shape(p, poly([[14, 178], [34, 186], [47, 168], [52, 150], [48, 128], [36, 112], [20, 116], [24, 140], [16, 160]]), { shadow: '#a4a4cc', half: '#dadcee', lit: '#ffffff', rim: '#fffae0', bounce: '#e8b890' }, { ...o, round: 12, length: 15, turn: -0.1 });
  shape(p, poly([[30, 190], [44, 180], [42, 162], [32, 168]]), { shadow: '#5c80b0', half: '#86acd4', lit: '#c8e0f4', rim: '#fffae0' }, { ...o, round: 6, length: 13, edge: false });
  p.tryStroke({ ...line, color: '#12162c', width: 9, points: [P(38, 158), P(39, 139)] });                                                    // its eye: dark, tall
  p.tryStroke({ ...line, color: '#3c4c8c', width: 4.6, opacity: 0.8, points: [P(36.5, 156), P(37, 143)] });                                  // the blue in it
  shape(p, poly([[47, 148], [74, 139], [49, 127]]), yellow, { ...o, round: 7, length: 13, turn: 0 });                                        // its beak
  p.tryStroke({ color: '#8c5c20', width: 4, opacity: 0.7, points: [P(50, 137), P(68, 138.5)] });
  glint(p, arc(PIPLUP.x, PIPLUP.y - 146, 50, -2.2, -0.2, 14), () => mix('#ffdca0', '#fff8e0', r()), { width: 4.6, dash: 22, gap: 7, opacity: 0.9, rng: r });   // the sun along the top of its head
  glint(p, [P(88, 76), P(70, 90), P(52, 106)], () => '#ffe2b0', { width: 4.2, dash: 16, gap: 6, opacity: 0.8, rng: r });                      // and along its lifted flipper
}

// ---------------------------------------------------------------- the Chimchar
{
  const fur = { shadow: '#8c3614', half: '#cc6422', lit: '#f8a040', rim: '#fff0c4', bounce: '#a0443c' };
  const cream = { shadow: '#a8845c', half: '#dcc08c', lit: '#fff2c8', rim: '#fffbe4', bounce: '#b89478' };
  const poly = (pts) => pts.map(([x, y]) => C(x, y));
  const X = CHIMCHAR.x, Y = CHIMCHAR.y;
  // its feet: pale, long, with toes
  for (const s of [-1, 1]) {
    shape(p, poly([[s * 12, 12], [s * 36, 14], [s * 48, 5], [s * 34, -3], [s * 12, 0]]), cream, { ...o, round: 7, length: 14 });
    for (const dx of [24, 33, 41]) p.tryStroke({ color: '#8c6844', width: 4, opacity: 0.7, points: [C(s * dx, 9), C(s * (dx + 3), -3.5)] });
    solid(p, [[X + s * 17, Y - 46, 12], [X + s * 22, Y - 14, 10]], fur, { ...o, length: 16, edge: false });                                   // its legs: short
  }
  // its body
  ball([[X, Y - 70, 40], [X, Y - 94, 36]], '#cf6a26', '#8a3814', { grain: 28, flame: 0.75, reach: 110, warm: '#ffc860' });
  for (let k = 0; k < 44; k++) { const a = r.range(0, 6.283), q = Math.sqrt(r()) * 0.9, x = X + Math.cos(a) * 36 * q, y = Y - 80 + Math.sin(a) * 44 * q, len = r.range(12.4, 18); p.tryStroke({ ...line, color: mix(mix('#a84c1c', '#f09438', r()), '#ffd070', flameOn(x, y, 100) * 0.6), width: 4.8, opacity: 0.6, rag: 0.3, taper: [0.2, 0.6], points: [[x, y], [x + (x - X) * 0.08, y + len]] }); }   // its fur
  // its arms: long, and they hang; its hands are pale, with fingers
  for (const s of [-1, 1]) {
    solid(p, [[X + s * 34, Y - 112, 12], [X + s * 50, Y - 84, 11], [X + s * 54, Y - 54, 10]], fur, { ...o, length: 20, turn: 0.15 });
    shape(p, poly([[s * 46, 54], [s * 60, 52], [s * 62, 34], [s * 54, 28], [s * 44, 36]]), cream, { ...o, round: 6, length: 13 });
    for (const dx of [49, 54, 59]) p.tryStroke({ color: '#8c6844', width: 4, opacity: 0.6, points: [C(s * dx, 41), C(s * (dx + 1), 28.5)] });
  }
  // its ears: big and round. The one on the side of its friend is seen a little more from the side
  ball([[X - 50, Y - 158, 22]], '#c45c26', '#8a3814', { grain: 18, flame: 0.2 });
  ball([[X + 52, Y - 162, 24]], '#c45c26', '#8a3814', { grain: 18, flame: 0.3 });
  shape(p, poly([[-58, 172], [-46, 174], [-40, 158], [-48, 146], [-60, 152]]), { shadow: '#b05c5c', half: '#e08c7c', lit: '#ffc0a0', rim: '#fff0d0' }, { ...o, round: 5, length: 13, edge: false });   // the inside of the nearer one
  // its head
  ball([[X, Y - 152, 48]], '#d06c28', '#8e3c18', { grain: 28, flame: 0.45 });
  // its face, turned to its friend: the pale mask round its eye and its mouth, the red line of its brow, its eye
  shape(p, poly([[-10, 180], [-34, 178], [-49, 160], [-54, 138], [-46, 120], [-28, 114], [-16, 124], [-22, 146], [-14, 166]]), cream, { ...o, round: 12, length: 15, turn: -0.1 });
  shape(p, poly([[-52, 142], [-70, 136], [-68, 122], [-50, 120]]), cream, { ...o, round: 7, length: 13, turn: 0 });                           // its mouth and nose stand out
  p.tryStroke({ ...line, color: '#c4421c', width: 6, points: [C(-14, 182), C(-34, 180), C(-50, 164)] });                                      // the red line of its brow
  p.tryStroke({ ...line, color: '#1c1410', width: 9, points: [C(-38, 158), C(-39, 139)] });                                                  // its eye
  p.tryStroke({ ...line, color: '#6c3c1c', width: 4.6, opacity: 0.8, points: [C(-36.5, 156), C(-37, 143)] });
  p.tryStroke({ color: '#6c4428', width: 4, opacity: 0.8, points: [C(-66, 128), C(-52, 126)] });                                              // its mouth
  // the curl of fur on its head: it stands up and turns over, like a small flame
  shape(p, poly([[-16, 194], [-10, 216], [0, 234], [14, 246], [30, 244], [22, 232], [18, 214], [16, 194]]), fur, { ...o, round: 10, length: 16, turn: 0.1 });
  glint(p, arc(X, Y - 152, 46, -2.5, -0.6, 14), () => mix('#ffdca0', '#fff8e0', r()), { width: 4.6, dash: 22, gap: 7, opacity: 0.9, rng: r });   // the sun along the top of its head
  for (const [ex, er] of [[-50, 22], [52, 24]]) glint(p, arc(X + ex, Y - 160, er - 2, -2.6, -0.5, 10), () => '#ffe2b0', { width: 4.2, dash: 14, gap: 6, opacity: 0.8, rng: r });
  // The flame: where its tail would be. A wide glow; then tongues of fire, dark red outside, orange, yellow, and nearly white at the heart. The air off the sea bends them.
  for (const [w, op] of [[150, 0.12], [90, 0.2], [50, 0.3]]) p.stroke({ brush: 'soft', color: '#ff9a3c', width: w, opacity: op, points: [[FLAME[0] - w * 1.02, FLAME[1] - 16], [FLAME[0], FLAME[1] - 24], [FLAME[0] + w * 1.02, FLAME[1] - 16]] });
  const tongue = (dx, h, w, c, lean) => p.tryStroke({ ...line, color: c, width: w, mix: 0.15, rag: 0.2, taper: [0.05, 0.9], points: [[FLAME[0] + dx, FLAME[1] + 8], [FLAME[0] + dx + lean * 0.3 + r.range(-3, 3), FLAME[1] - h * 0.5], [FLAME[0] + dx + lean + r.range(-4, 4), FLAME[1] - h]] });
  for (const [dx, h, w, lean] of [[-16, 44, 15, -10], [16, 40, 14, 14], [-6, 70, 18, 4], [8, 60, 16, 12], [0, 84, 15, 8]]) tongue(dx, h, w, mix('#d83c14', '#f0601c', r()), lean);
  for (const [dx, h, w, lean] of [[-10, 36, 12, -6], [10, 34, 11, 9], [-2, 58, 13, 4], [5, 50, 12, 9]]) tongue(dx, h, w, mix('#ff8a24', '#ffa838', r()), lean);
  for (const [dx, h, w, lean] of [[-5, 28, 9, -3], [6, 26, 8, 5], [0, 44, 10, 4]]) tongue(dx, h, w, mix('#ffd24c', '#ffe880', r()), lean);
  tongue(0, 26, 7, '#fff8d8', 2);
  for (let k = 0; k < 5; k++) { const x = FLAME[0] + r.range(20, 70), y = FLAME[1] - r.range(70, 120), a = -1.2 + r.range(-0.4, 0.4); p.tryStroke({ color: mix('#ff9a2c', '#ffe890', r()), width: 4, opacity: r.range(0.5, 0.9), taper: [0.5, 0], points: [[x, y], [x + Math.cos(a) * 13, y + Math.sin(a) * 13]] }); }   // sparks from it
}

p.save();
