// The Monolith, the number, and the Paintress. The Monolith is a tower of dark stone that
// comes up out of the sea and goes out of the top of the picture: broken at its sides,
// split by a long crack, with rock heaped about its foot. The number is 33, painted on it
// by hand in strokes of gold light, each stroke uneven, with wet light that runs down from
// it. The Paintress sits at its foot with her side to us and her face to the stone: a
// woman as big as a hill, pale as stone, in a long pale dress, under white hair that
// comes down over her head and all her back to the rock. Her right arm is raised to the
// last stroke of the number.
'use strict';
const { studio, open, HORIZON, NUM, gold, far, monoMid, monoHalf, inMono, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth, solid, shape, glow, glint } = studio;

const p = open('monolith');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0.02, rag: 0.15, cap: 'round' };

// ---------------------------------------------------------------- the Monolith
p.fill({ inside: inMono, bounds: [560, 0, 1240, HORIZON + 6], width: 11, length: 90, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2 + r.range(-0.05, 0.05),
  color: (x, y) => { const k = (x - monoMid(y)) / monoHalf(y), bed = nA(x / 14, y / 150); let c = mix('#0a1217', '#1a2a33', bed); c = mix(c, '#06090c', Math.abs(k) * 0.4); c = mix(c, '#5c4f34', gold(x, y, 210) * 0.55); return mix(c, '#06090c', smooth(HORIZON - 150, HORIZON, y) * 0.3); }, stroke: { ...line, mix: 0.04, opacity: 0.97 } });   // dark stone; the light of the number is on it near the number
for (let k = 0; k < 26; k++) { const y = r.range(10, HORIZON - 60), x = monoMid(y) + r.range(-0.8, 0.8) * monoHalf(y), l = r.range(40, 130); if (Math.hypot(x - NUM.x, y - NUM.y) < 110) continue; p.tryStroke({ brush: 'round', color: '#04070a', width: 4.4, opacity: 0.6, taper: [0.2, 0.6], points: [[x, y], [x + r.range(-6, 6), y + l * 0.5], [x + r.range(-10, 10), y + l]] }); }   // cracks down it
{ const pts = [[946, -4], [938, 40], [950, 86], [941, 120]]; p.tryStroke({ ...line, color: '#04070a', width: 9, taper: [0, 0.7], points: pts }); p.tryStroke({ brush: 'round', color: '#c8b078', width: 4, opacity: 0.6, taper: [0, 0.8], points: pts.map(([x, y]) => [x + 5, y]) }); }   // the long crack at its head
// the pale light comes round its two sides: a thin broken edge
for (const s of [-1, 1]) { const pts = []; for (let y = 8; y < HORIZON - 90; y += 12) pts.push([monoMid(y) + s * (monoHalf(y) - 2), y]); glint(p, pts, () => mix('#8c7c50', '#e8d6a0', r()), { width: 4.4, dash: 44, gap: 20, opacity: 0.55, rng: r }); }

// ---------------------------------------------------------------- the number
// Each 3 is two bows, one over the other. They are painted by hand: each stroke is thick where it begins and thin where it ends,
// and no two are the same. Light runs down from them.
for (const [w, op, n] of [[190, 0.07, 5], [110, 0.12, 6]]) glow(p, NUM.x, NUM.y, w, mix('#e09a30', '#ffe6a0', 1 - w / 200), op, n, 0.8);
const DIGITS = [];
for (const dx of [-0.37, 0.36]) {
  const gx = NUM.x + dx * NUM.h, q = NUM.h / 4 + (dx > 0 ? 2 : 0), tilt = dx > 0 ? 0.06 : -0.04;
  for (const [cy, a0, a1, wob] of [[NUM.y - q, -2.7, 1.5, 0.94], [NUM.y + q + 1, -1.5, 2.75, 1.08]]) {
    const pts = []; for (let i = 0; i <= 12; i++) { const a = a0 + (a1 - a0) * i / 12; pts.push([gx + Math.cos(a) * q * wob + (cy - NUM.y) * tilt, cy + Math.sin(a) * q * (2 - wob)]); }
    DIGITS.push(pts);
    p.tryStroke({ brush: 'soft', color: '#ffb040', width: 34, opacity: 0.3, points: pts });
    p.tryStroke({ brush: 'bristle', mix: 0, dry: 0.1, rag: 0.35, cap: 'round', color: '#ffd070', width: 19, taper: [0, 0.5], points: pts });
    p.tryStroke({ brush: 'bristle', mix: 0, rag: 0.2, cap: 'round', color: '#fff4c8', width: 10, taper: [0, 0.6], points: pts });
    p.tryStroke({ brush: 'round', color: '#ffffff', width: 4.6, opacity: 0.95, taper: [0, 0.4], points: pts.slice(0, 10) });
  }
}
for (const [x, y, l] of [[NUM.x - 86, NUM.y + 66, 54], [NUM.x - 30, NUM.y + 70, 30], [NUM.x + 30, NUM.y + 70, 76], [NUM.x + 78, NUM.y + 40, 40], [NUM.x - 60, NUM.y + 4, 24]]) { p.tryStroke({ brush: 'soft', color: '#ffb040', width: 9, opacity: 0.3, taper: [0, 0.8], points: [[x, y], [x + 1, y + l]] }); p.tryStroke({ brush: 'round', color: '#ffe6a0', width: 4, opacity: 0.8, taper: [0, 0.9], points: [[x, y], [x + r.range(-1.5, 1.5), y + l * 0.6], [x + r.range(-2, 2), y + l]] }); }   // the wet light that runs down

// ---------------------------------------------------------------- the rock about the foot of the Monolith
{ const rock = { shadow: '#060a0d', half: '#111c22', lit: '#3a4a44', bounce: '#0a1216' };
  for (const [x, w, h] of [[580, 170, 50], [1210, 200, 60], [760, 260, 44], [1050, 240, 50], [1330, 130, 34], [470, 120, 28], [900, 300, 36]]) solid(p, [[x - w * 0.3, HORIZON - h * 0.28, h * 0.5], [x, HORIZON - h * 0.54, h * 0.6], [x + w * 0.3, HORIZON - h * 0.24, h * 0.46]], rock, { light: { at: [NUM.x, NUM.y] }, turn: 0.3, width: 6.5, length: Math.max(14, h * 0.5), vary: 0.1, flow: () => r.range(-0.2, 0.2), edge: false }); }

// ---------------------------------------------------------------- the Paintress
{
  const L = { at: [NUM.x, NUM.y - 40] };                                   // her light is the number
  const tone = (a, b, c, d = '#1c282e') => ({ shadow: a, half: b, lit: c, bounce: d });
  const pale = tone('#2e3a40', '#7c8684', '#e0d6b0'), cloth = tone('#283238', '#6c7878', '#d0c8a8'), hair = tone('#465056', '#a0a8a4', '#fbf4d8');
  const o = { light: L, turn: 0.1, width: 6, length: 22, vary: 0.05, mix: 0.05, edge: false };
  // the dark behind her, so that she stands clear of the stone
  for (const [a, b, c, w] of [[[700, 380], [690, 520], [690, 660], 110], [[800, 470], [800, 560], [800, 650], 76]]) p.stroke({ brush: 'soft', color: '#04080b', width: w, opacity: 0.3, points: [a, b, c] });
  // her dress: from her waist over her knees, which are drawn up, down to the rock
  shape(p, [[690, 548], [742, 520], [800, 520], [832, 548], [838, 610], [826, 664], [664, 668], [668, 610]], cloth, { light: L, turn: 0.1, width: 6.5, length: 28, round: 20, vary: 0.05, mix: 0.05, flow: (x, y) => Math.PI / 2 + (x - 750) / 300, edge: false });
  for (const [a, b, c] of [[[760, 530], [770, 600], [764, 662]], [[800, 540], [806, 610], [800, 664]], [[722, 546], [716, 610], [706, 664]]]) p.tryStroke({ brush: 'round', color: '#141c22', width: 4.6, opacity: 0.6, taper: [0.2, 0.3], points: [a, b, c] });   // the folds of it
  // her body, bent forward
  solid(p, [[706, 566, 44], [716, 500, 44], [738, 446, 38]], pale, o);
  // her right arm: up from the shoulder to the number; the hand is at the foot of the first 3
  solid(p, [[748, 442, 24], [788, 388, 19], [818, 340, 15]], pale, { ...o, turn: -0.3 });
  solid(p, [[820, 336, 14], [830, 314, 11]], pale, { ...o, turn: -0.3 });
  p.tryStroke({ ...line, color: '#d8ccA4', width: 6, taper: [0, 0.7], points: [[828, 316], [834, 304], [838, 296]] });                   // her finger, on the stone
  for (const [w, op] of [[40, 0.14], [20, 0.3]]) glow(p, 838, 296, w, '#ffe090', op, 6);
  // her head, down: we see none of her face. It is in the dark under her hair, and locks of the hair hang in front of it.
  p.tryStroke({ brush: 'soft', color: '#0c1318', width: 30, opacity: 0.75, points: [[770, 404], [776, 436], [770, 470]] });
  solid(p, [[738, 406, 34], [750, 402, 33]], hair, { ...o, flow: () => Math.PI / 2 });
  for (const [a, b, c] of [[[768, 386], [782, 426], [778, 476]], [[776, 396], [792, 430], [790, 462]], [[760, 384], [770, 430], [764, 486]]]) p.tryStroke({ ...line, color: mix('#a0a8a4', '#f0e8cc', r()), width: r.range(5, 7), taper: [0, 0.7], points: [a, b, c] });
  // her hair: it comes from her head over her shoulders and all down her back to the rock, in one fall, and spreads on the rock
  shape(p, [[712, 388], [746, 372], [770, 384], [768, 430], [750, 474], [730, 524], [714, 592], [710, 660], [596, 674], [570, 652], [618, 588], [652, 506], [682, 436]], hair, { light: L, turn: 0, width: 6, length: 30, round: 22, vary: 0.07, mix: 0.06, flow: (x, y) => Math.PI / 2 + clamp((y - 420) / 300, 0, 1) * 0.55, edge: false });
  for (const pts of [[[742, 392], [714, 470], [688, 560], [656, 652]], [[726, 398], [694, 480], [664, 570], [628, 654]], [[758, 400], [738, 480], [716, 560], [700, 644]], [[706, 420], [672, 500], [640, 580], [600, 656]]]) p.tryStroke({ brush: 'round', color: r() < 0.5 ? '#5c686c' : '#fff8e0', width: 4.4, opacity: 0.5, taper: [0.1, 0.6], points: pts });   // locks of it
  for (const [x, l, a] of [[600, 60, 2.9], [628, 50, 2.7], [664, 40, 2.6], [580, 44, 3.2]]) p.tryStroke({ ...line, color: mix('#8c9698', '#e8e0c8', r()), width: r.range(6, 9), taper: [0, 0.85], points: [[x, 664], [x + Math.cos(a) * l * 0.5, 668 + Math.sin(a) * l * 0.2 - 3], [x + Math.cos(a) * l, 670 + Math.sin(a) * l * 0.3]] });   // its ends, on the rock
  // the gold of the number along her arm, her head and the top of her hair
  glint(p, [[754, 428], [790, 376], [820, 328]], () => mix('#ffd070', '#fff4c8', r()), { width: 4.4, dash: 30, gap: 8, opacity: 0.85, rng: r });
  glint(p, [[720, 380], [750, 368], [778, 384]], () => mix('#ffd070', '#fff4c8', r()), { width: 4.4, dash: 26, gap: 8, opacity: 0.85, rng: r });
  glint(p, [[682, 430], [660, 506], [636, 586]], () => mix('#a8a890', '#e8e0c0', r()), { width: 4, dash: 30, gap: 14, opacity: 0.5, rng: r });
}
// the far air lies along the sea, in front of the foot of it all
for (let k = 0; k < 16; k++) { const x = r.range(-200, 1500), len = r.range(300, 700), y = r.range(HORIZON - 22, HORIZON + 8); p.stroke({ brush: 'soft', color: mix('#2c5458', '#9c8c5c', gold(x + len / 2, y, 520)), width: r.range(14, 28), opacity: r.range(0.08, 0.16), points: [[x, y], [x + len / 2, y + r.range(-2, 2)], [x + len, y]] }); }
void far; void nB; void nC;

p.save();
