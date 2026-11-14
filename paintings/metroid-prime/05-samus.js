// Samus Aran. She stands on the ledge with her feet wide apart and her right side to us,
// and aims up at the Metroids. We see the red helmet with its green visor, the great round
// shoulder of the Varia Suit, the arm cannon, which she holds up with her left hand under
// it, and her legs. She is nearly all dark: the light of the mushroom behind her is a thin
// blue-green line down her back, and the green of the Metroids and the pale blue of her
// own shot are on her front. Her shot is the Ice Beam: a line of pale light from the
// cannon to the Metroid that it has frozen.
'use strict';
const { studio, open, SAMUS, MUZZLE, ICED, BIG } = require('./scene');
const { mix, clamp, solid, orb, glow, glint } = studio;

const p = open('samus');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.05, cap: 'round' };
const U = SAMUS.U, P = (X, Y) => [SAMUS.x + X * U, SAMUS.feet - Y * U];
const L = { at: [BIG.x - 200, BIG.y + 60] };                               // the light on her front comes from where the Metroids and her shot are
const o = { light: L, turn: 0.35, width: 5.5, length: 18, vary: 0.05, mix: 0.05, edge: false };
const chain = (pts) => pts.map(([X, Y, R]) => [...P(X, Y), R * U]);
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts.map(([X, Y]) => P(X, Y)) });
const orange = { shadow: '#150c08', half: '#4a2a12', lit: '#b47430', bounce: '#0e2a34' };
const gold = { shadow: '#181008', half: '#5a3c14', lit: '#c8963c', bounce: '#0e2a34' };
const red = { shadow: '#120606', half: '#48140e', lit: '#a83c28', bounce: '#0e2430' };
const joint = { shadow: '#050506', half: '#0e0e12', lit: '#2a2e34', bounce: '#0a1a24' };
const teal = { shadow: '#06100f', half: '#143a34', lit: '#4c9c8c', bounce: '#0c2030' };

// ---------------------------------------------------------------- the shot: the Ice Beam, from the cannon to the Metroid in ice
{ const [x0, y0] = MUZZLE, x1 = ICED.x - ICED.R * 0.8, y1 = ICED.y + ICED.R * 0.5, dx = x1 - x0, dy = y1 - y0, at = (t) => [x0 + dx * t, y0 + dy * t];
  for (const [w, op] of [[40, 0.07], [20, 0.14]]) p.stroke({ brush: 'soft', color: '#8cd0ff', width: w, opacity: op, points: [at(0), at(0.5), at(1)] });
  p.stroke({ ...line, mix: 0, color: '#d8f0ff', width: 8, taper: [0.2, 0.3], points: [at(0), at(0.5), at(1)] });
  p.stroke({ brush: 'round', color: '#ffffff', width: 4.4, points: [at(0.02), at(0.5), at(0.98)] });
  for (let k = 0; k < 12; k++) { const t = r.range(0.1, 0.95), [x, y] = at(t), a = Math.atan2(dy, dx) + r.range(-1.2, 1.2), l = r.range(12.4, 20); p.tryStroke({ brush: 'round', color: '#e4f6ff', width: 4, opacity: r.range(0.4, 0.8), taper: [0, 0.8], points: [[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l]] }); }   // small pieces of ice that leave it
  for (const [w, op] of [[70, 0.08], [36, 0.16]]) glow(p, x1, y1, w, '#cfeaff', op, 6); }

// ---------------------------------------------------------------- her shade on the ledge
p.stroke({ brush: 'soft', color: '#010206', width: 30, opacity: 0.6, points: [P(-0.7, -0.03), P(0, -0.08), P(0.8, -0.03)] });

// ---------------------------------------------------------------- her far leg (the left one), forward
solid(p, chain([[0.0, 0.98, 0.13], [0.26, 0.64, 0.115]]), orange, o);
solid(p, chain([[0.27, 0.6, 0.1], [0.28, 0.58, 0.1]]), joint, o);
solid(p, chain([[0.3, 0.52, 0.125], [0.4, 0.2, 0.105]]), gold, o);
solid(p, chain([[0.4, 0.1, 0.105], [0.5, 0.06, 0.09]]), red, o);
// ---------------------------------------------------------------- her left arm, under the cannon: we see the hand and a little of the fore arm
solid(p, chain([[0.34, 1.3, 0.075], [0.62, 1.42, 0.07]]), gold, o);
solid(p, chain([[0.66, 1.45, 0.07], [0.7, 1.47, 0.066]]), red, o);
// ---------------------------------------------------------------- her near leg (the right one), back
solid(p, chain([[-0.06, 0.98, 0.14], [-0.22, 0.62, 0.125]]), orange, o);
solid(p, chain([[-0.23, 0.58, 0.105], [-0.24, 0.56, 0.105]]), joint, o);
solid(p, chain([[-0.26, 0.5, 0.135], [-0.38, 0.2, 0.11]]), gold, o);
solid(p, chain([[-0.4, 0.1, 0.11], [-0.3, 0.06, 0.1]]), red, o);
// ---------------------------------------------------------------- her hips, her waist and her body, which leans back a little
solid(p, chain([[-0.08, 1.02, 0.15], [0.04, 1.03, 0.14]]), red, o);
solid(p, chain([[-0.04, 1.17, 0.125], [0.0, 1.2, 0.125]]), joint, o);
solid(p, chain([[-0.02, 1.32, 0.2], [0.02, 1.48, 0.21]]), orange, { ...o, width: 6, length: 22 });
solid(p, chain([[0.1, 1.38, 0.15], [0.16, 1.5, 0.14]]), gold, o);                                                                       // the plate of her chest
mark([[0.2, 1.36], [0.27, 1.44]], '#5cf0a0', 4.4, { opacity: 0.8 });                                                                    // a line of green light on it
// ---------------------------------------------------------------- the pack on her back
solid(p, chain([[-0.2, 1.36, 0.12], [-0.22, 1.56, 0.12]]), orange, o);
// ---------------------------------------------------------------- her helmet: red, with the visor at the right, which gives a green light
{ const [hx, hy] = P(0.13, 1.8), R = 0.155 * U;
  orb(p, [[hx, hy, R]], (x, y) => { const k = clamp(((x - hx) * 0.8 + (y - hy) * -0.6) / R, -1, 1); return k > 0 ? mix('#5a160e', '#c04a30', Math.pow(k, 1.2)) : mix('#5a160e', '#10060a', Math.pow(-k, 0.7)); }, { width: 5.5, reach: R * 0.7 });
  mark([[0.2, 1.9], [0.27, 1.8], [0.24, 1.7]], '#0a1a14', 9);                                                                          // the dark of the visor
  glow(p, ...P(0.27, 1.8), 16, '#58ffa8', 0.14, 6);
  mark([[0.235, 1.87], [0.285, 1.8], [0.25, 1.725]], '#8cf8bc', 4.6);                                                                    // its edge of light
  mark([[0.06, 1.66], [0.16, 1.645], [0.24, 1.66]], '#08080a', 6, { opacity: 0.9 }); }                                                 // the lower edge of the helmet
// ---------------------------------------------------------------- her near shoulder: a great ball
{ const [sx, sy] = P(0.0, 1.55), R = 0.235 * U;
  orb(p, [[sx, sy, R]], (x, y) => { const k = clamp(((x - sx) * 0.75 + (y - sy) * -0.66) / R, -1, 1); const c = k > 0 ? mix('#553214', '#d49a44', Math.pow(k, 1.3)) : mix('#553214', '#0e0806', Math.pow(-k, 0.7)); return mix(c, '#1a5c6c', clamp(-(x - sx) / R - 0.5, 0, 0.5) * 0.9); }, { width: 6, reach: R * 0.7 });
  for (const v of [-0.3, 0.3]) { const pts = []; for (let i = 0; i <= 8; i++) { const u = -0.9 + 1.8 * i / 8, hw = Math.sqrt(Math.max(0, 1 - v * v)); pts.push([sx + u * hw * R, sy + v * R - (1 - u * u) * R * 0.08]); } p.tryStroke({ brush: 'round', color: '#1c0e06', width: 4, opacity: 0.4, points: pts }); } }
// ---------------------------------------------------------------- her right arm and the cannon: up, toward the Metroids
solid(p, chain([[0.1, 1.5, 0.1], [0.38, 1.4, 0.09]]), orange, o);
solid(p, chain([[0.42, 1.4, 0.125], [0.98, 1.68, 0.14]]), teal, { ...o, width: 6, length: 22, flow: () => Math.atan2(-0.28, 0.56) });
for (const [t, c, op] of [[0.2, '#06100f', 0.85], [0.5, '#06100f', 0.85], [0.78, '#7cc8b4', 0.6]]) { const X = 0.42 + 0.56 * t, Y = 1.4 + 0.28 * t, nx = -0.447 * 0.15, ny = 0.894 * 0.15; mark([[X - nx, Y - ny], [X + nx, Y + ny]], c, 5, { opacity: op }); }   // the bands round the cannon
mark([[0.94, 1.83], [1.01, 1.69], [1.08, 1.55]], '#040a0a', 9);                                                                         // its mouth
// the light at its mouth
for (const [w, op, n] of [[70, 0.1, 6], [36, 0.2, 6], [17, 0.4, 8]]) glow(p, MUZZLE[0] + 6, MUZZLE[1] - 2, w, mix('#8cd0ff', '#ffffff', 1 - w / 80), op, n);

// ---------------------------------------------------------------- the lights on her
// the mushroom behind her: a thin blue-green line down her back, her back leg and the top of her shoulder
const cyan = () => mix('#2fc4d8', '#a8f4fc', r());
glint(p, [P(-0.33, 1.62), P(-0.345, 1.46), P(-0.32, 1.3)], cyan, { width: 4.4, dash: 24, gap: 8, opacity: 0.85, rng: r });
glint(p, [P(-0.21, 1.72), P(-0.1, 1.775), P(0.02, 1.785)], cyan, { width: 4.4, dash: 24, gap: 8, opacity: 0.8, rng: r });
glint(p, [P(-0.2, 1.0), P(-0.34, 0.66), P(-0.4, 0.5), P(-0.5, 0.2)], cyan, { width: 4.4, dash: 26, gap: 10, opacity: 0.75, rng: r });
glint(p, [P(0.02, 1.94), P(0.1, 1.96), P(0.18, 1.94)], cyan, { width: 4, dash: 20, gap: 6, opacity: 0.6, rng: r });
// the pale light of her shot along the top of the cannon
glint(p, [P(0.46, 1.53), P(0.7, 1.66), P(0.94, 1.78)], () => mix('#a8dcff', '#ffffff', r()), { width: 4.4, dash: 30, gap: 8, opacity: 0.8, rng: r });

p.save();
