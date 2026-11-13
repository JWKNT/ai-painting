// Walpurgisnacht. She hangs head down. Highest is the great wheel that she has in place of
// legs, with smaller wheels beside it. Under the wheel is her wide skirt, which opens upward:
// dark blue, in three rows of white frills, with the white of her underskirt past its hem.
// Under that is her body, with a white front and a great bow at her neck, and her two arms
// out at each side: a puff at each shoulder, a long white sleeve, a wide frilled cuff, and
// a thin hand with long fingers. Then her head, which is white and has no eyes, only a wide
// red mouth full of teeth that laughs; and lowest of all her cap, with a blue band and two
// long striped horns that turn up at their ends, each with a ball of gold. A ring of colors
// is behind her, and the shadows that serve her dance in the air round her.
'use strict';
const { studio, open, WITCH, far } = require('./scene');
const { mix, clamp, smooth, solid, shape, glint, arc, noise2 } = studio;

const p = open('witch');
const r = p.rng;
const X = WITCH.x, WAIST = WITCH.waist, HEM = 168, D = 0.2;
const nF = noise2(811);
const line = { brush: 'bristle', mix: 0.1, dry: 0.02, rag: 0.12, cap: 'round' };
const tint = (c, x, y) => far(c, x, y, D);
const tones = (t) => { const out = {}; for (const k of Object.keys(t)) out[k] = tint(t[k], X, 380); return out; };
const blue = tones({ shadow: '#131f5c', half: '#2a46a0', lit: '#648ee0', rim: '#e0ecff', bounce: '#6c3c5c' });
const white = tones({ shadow: '#7480b8', half: '#b8c4e6', lit: '#fbfcff', rim: '#ffffff', bounce: '#d0a090' });
const o = { light: [-0.5, -0.6], turn: 0, width: 7, length: 28, vary: 0.05, dash: 26, gap: 9, edgeOpacity: 0.7 };
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color: tint(color, pts[0][0], pts[0][1]), width, ...extra, points: pts });
// A frill: a short curved dab of white, with its shade under it. `up` is -1 when the frill opens toward the top of the picture.
const frill = (x, y, w, up = 1) => {
  mark([[x - w * 1.05, y + up * w * 0.62], [x + w * 1.05, y + up * w * 0.62]], '#6c7cc0', 5.5, { opacity: 0.6 });
  mark([[x - w * 1.08, y + up * 4], [x, y - up * 4], [x + w * 1.08, y + up * 4]], mix('#cfd9f4', '#ffffff', r()), w);
};

// The ring of colors behind her: six rings, one inside the other.
['#ff7a6c', '#ffb45c', '#fff08c', '#8ceca0', '#7cc4ff', '#c498ff'].forEach((c, i) => {
  const rr = 400 - i * 12;
  glint(p, arc(X, 250, rr, 0, 6.283, 90), () => tint(c, X, 250 + rr), { width: 7, dash: 220, gap: 26, opacity: 0.5, rng: r, brush: 'bristle' });
});
for (const [w, op] of [[90, 0.1], [50, 0.12]]) p.stroke({ brush: 'soft', color: '#f0f8e8', width: w, opacity: op, points: arc(X, 250, 370, 3.4, 6.0, 30) });   // its light on the cloud

// A wheel: a ring with teeth on the outside of it, spokes, and a hub. It is of dark iron, a little lighter on the part of it that is toward her light.
function wheel(cx, cy, R, teeth, turn) {
  const iron = (a) => tint(mix(mix('#141c26', '#2a3846', r()), '#8ca4a8', clamp(Math.sin(a) * 0.45 + 0.05, 0, 0.5)), cx + Math.cos(a) * R, cy + Math.sin(a) * R);
  const stroke = { brush: 'bristle', mix: 0.1, dry: 0.03, rag: 0.15, cap: 'flat' }, w = Math.max(8, R * 0.06);
  for (let rr = R * 0.8; rr <= R * 0.965; rr += w * 0.75) { const piece = Math.max(0.3, 2.4 * w / rr); for (let a = turn; a < turn + 6.283; a += piece * 0.92) p.tryStroke({ ...stroke, color: iron(a + piece / 2), width: w, points: arc(cx, cy, rr, a, a + piece, 6) }); }
  const tw = 6.283 * R / teeth * 0.5, th = Math.max(6, tw / 2.15);
  for (let k = 0; k < teeth; k++) { const a = turn + k / teeth * 6.283; for (const rr of [R * 0.97 + th * 0.5, R * 0.97 + th * 1.4]) p.tryStroke({ ...stroke, color: iron(a), width: th, points: [[cx + Math.cos(a) * rr + Math.sin(a) * tw / 2, cy + Math.sin(a) * rr - Math.cos(a) * tw / 2], [cx + Math.cos(a) * rr - Math.sin(a) * tw / 2, cy + Math.sin(a) * rr + Math.cos(a) * tw / 2]] }); }
  for (let k = 0; k < 6; k++) { const a = turn + 0.3 + k / 6 * 6.283; p.tryStroke({ ...stroke, color: iron(a), width: Math.max(8, R * 0.085), points: [[cx + Math.cos(a) * R * 0.14, cy + Math.sin(a) * R * 0.14], [cx + Math.cos(a) * R * 0.5, cy + Math.sin(a) * R * 0.5], [cx + Math.cos(a) * R * 0.82, cy + Math.sin(a) * R * 0.82]] }); }
  studio.disc(p, cx, cy, R * 0.2, iron(1.5), Math.max(8, R * 0.07), { brush: 'bristle', mix: 0.1, dry: 0, rag: 0.1, cap: 'round' });
  p.tryStroke({ ...stroke, cap: 'round', color: tint('#0a0e14', cx, cy), width: Math.max(6, R * 0.05), points: arc(cx, cy, Math.max(R * 0.07, 7), 0, 6.283, 10) });
  for (let a = 0.5; a < 2.6; a += 0.34) p.tryStroke({ color: tint('#c8e0d8', cx, cy + R), width: 4.4, opacity: 0.6, points: arc(cx, cy, R * 0.79, a, a + 0.24, 5) });
}
wheel(X - 262, 28, 84, 14, 0.5);
wheel(X + 270, 40, 96, 16, 1.2);
wheel(X, 96, 196, 24, 0.2);


// The white of her underskirt, which shows past the hem of the skirt, against the wheel: two rows of frills that open upward.
for (const [dy, half, w] of [[-34, 226, 17], [-16, 250, 19]]) for (let x = X - half; x <= X + half; x += w * 1.7) frill(x + r.range(-3, 3), HEM + dy - 22 * Math.pow((x - X) / 262, 2), w, -1);

// Her skirt. It is a bell that opens upward: narrow at her waist, wide at its hem, which is under the wheel. Its folds go out from her waist.
{
  const up = (y) => clamp((WAIST - y) / (WAIST - HEM), 0, 1), halfW = (y) => 30 + 232 * Math.pow(up(y), 0.78);
  const hemAt = (x) => HEM + 9 * Math.sin((x - X) / 13) - 26 * Math.pow((x - X) / 262, 2);
  const inside = (x, y) => y < WAIST + 4 && y > hemAt(x) && Math.abs(x - X) < halfW(y);
  const fan = (x, y) => Math.atan2(y - (WAIST + 16), x - X);
  const cloth = (x, y) => {
    const u = clamp((x - X) / halfW(y), -1, 1), fold = Math.sin(Math.atan2(x - X, WAIST + 40 - y) * 30 + 0.5) * 0.5 + (nF(x / 40, y / 60) - 0.5) * 0.6;
    let c = fold > 0 ? mix('#263f96', '#5c86dc', clamp(fold * 1.5, 0, 1)) : mix('#263f96', '#111c54', clamp(-fold * 1.6, 0, 1));
    c = mix(c, '#0e1746', smooth(0.5, 1, Math.abs(u)) * 0.45);
    c = mix(c, '#c88470', smooth(0.5, 0, up(y)) * 0.16);
    return tint(mix(c, '#dcecff', smooth(0.93, 1, Math.abs(u)) * 0.6), x, y);
  };
  const box = [X - 270, HEM - 40, X + 270, WAIST + 6];
  p.fill({ inside, bounds: box, width: 12, length: 64, spacing: 0.5, angle: (x, y) => fan(x, y) + r.range(-0.04, 0.04), color: cloth, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.15, dry: 0.03, rag: 0.15, cap: 'round' } });
  p.fill({ inside, bounds: box, width: 7, length: 40, spacing: 0.9, overlap: 0.7, angle: (x, y) => fan(x, y) + r.range(-0.07, 0.07), color: (x, y) => cloth(x + r.range(-3, 3), y), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.15, dry: 0.03, rag: 0.2, cap: 'round' } });
  // its three rows of frills, and a ribbon of gold between the rows
  const rowY = (k, x) => WAIST - (WAIST - HEM) * k - (k > 0.9 ? 0 : 14) * Math.pow((x - X) / (232 * k + 30), 2) + (k > 0.9 ? hemAt(x) - HEM + 8 : 0);
  for (const [k, w] of [[1, 18], [0.66, 14], [0.36, 11]]) { const half = halfW(WAIST - (WAIST - HEM) * k) - w; for (let x = X - half; x <= X + half; x += w * 1.75) frill(x, rowY(k, x), w); }
  for (const k of [0.82, 0.5]) { const half = halfW(WAIST - (WAIST - HEM) * k) * 0.9, pts = []; for (let x = X - half; x <= X + half; x += 20) pts.push([x, rowY(k, x) + 2]); glint(p, pts, () => tint(mix('#d8a83c', '#fff0a0', r()), X, 250), { width: 4.6, dash: 60, gap: 12, opacity: 0.85, rng: r }); }   // a ribbon of gold between the rows
}

// Her arms. Each has a round puff at the shoulder, in blue and white; then a long white sleeve, which is wider toward the wrist; then a wide cuff with a band of blue and a frill; then her hand.
for (const s of [-1, 1]) {
  const P = (ux, y) => [X + s * ux, y];
  solid(p, [[...P(52, 388), 20], [...P(132, 400), 24], [...P(214, 420), 36]], white, { ...o, length: 40 });
  for (const [ux, y] of [[110, 392], [160, 404], [196, 412]]) mark([P(ux, y - 14), P(ux + 6, y), P(ux, y + 16)], '#8c98cc', 5.5, { opacity: 0.5, taper: [0.2, 0.3] });   // the folds of it
  shape(p, [P(40, 368), P(66, 360), P(88, 374), P(92, 400), P(74, 420), P(46, 416)], blue, { ...o, round: 20, length: 20 });                // the puff
  for (const [ux, y] of [[56, 366], [72, 366], [84, 380]]) mark([P(ux, y), P(ux + 4, y + 24), P(ux, y + 46)], '#e8eefc', 6, { opacity: 0.9, taper: [0.2, 0.2] });   // its white stripes
  shape(p, [P(226, 384), P(248, 380), P(254, 426), P(246, 466), P(224, 460)], blue, { ...o, round: 10, length: 18, flow: () => Math.PI / 2 });   // the band of blue at the wrist
  for (let k = 0; k < 6; k++) { const y = 384 + k * 15; mark([P(250, y - 7), P(262, y), P(250, y + 7)], mix('#c4d0f0', '#ffffff', r()), 11); mark([P(252, y + 8), P(262, y + 6)].map(([x, yy], i) => [x + (i ? s * 2 : -s * 2), yy]), '#6c7cc0', 5, { opacity: 0.6 }); }   // the frill of the cuff
  // her hand: pale and thin, open, the fingers together and a little bent, the thumb apart
  shape(p, [P(262, 408), P(286, 404), P(318, 410), P(332, 420), P(318, 432), P(286, 442), P(262, 438)], white, { ...o, round: 10, length: 16 });
  for (const dy of [-6, 2, 10]) mark([P(290, 424 + dy), P(308, 423 + dy * 1.2), P(324, 422 + dy * 1.1)], '#8c98cc', 4.6, { opacity: 0.6 });   // the lines between her fingers
  mark([P(270, 406), P(282, 392), P(296, 388)], '#f0f2fc', 7, { taper: [0, 0.6] });
}

// Her body: blue, narrow at the waist; a white front with frills at each side of it and three buttons of gold; a wide collar; and a great bow at her neck.
shape(p, [[X - 30, WAIST - 2], [X + 30, WAIST - 2], [X + 42, 372], [X + 50, 408], [X - 50, 408], [X - 42, 372]], blue, { ...o, round: 30, length: 30, flow: () => Math.PI / 2 });
shape(p, [[X - 13, WAIST + 4], [X + 13, WAIST + 4], [X + 17, 404], [X - 17, 404]], white, { ...o, round: 12, length: 24, flow: () => Math.PI / 2, edge: false });
for (const s of [-1, 1]) for (let y = WAIST + 12; y < 400; y += 15) mark([[X + s * 16, y - 7], [X + s * 24, y], [X + s * 16, y + 7]], mix('#c4d0f0', '#ffffff', r()), 8);   // the frills at each side of the white
for (const y of [350, 368, 386]) { mark([[X - 5, y - 4], [X + 5, y + 4]], '#e8b83c', 6.5); mark([[X - 4, y - 5], [X + 2, y - 1]].map(([x, yy], i) => [x + (i ? 3 : -3), yy]), '#fff4b0', 4, { opacity: 0.9 }); }
mark([[X - 34, WAIST], [X, WAIST + 6], [X + 34, WAIST]], '#e8eefc', 9, { cap: 'flat' });                                                   // the white band at her waist
shape(p, [[X - 56, 400], [X - 20, 408], [X, 404], [X + 20, 408], [X + 56, 400], [X + 50, 424], [X + 16, 428], [X, 420], [X - 16, 428], [X - 50, 424]], white, { ...o, round: 10, length: 18, flow: () => 0 });   // her collar
for (const s of [-1, 1]) {                                                                                                                  // the bow: two loops and two ends, in blue, with a jewel of red where they meet
  shape(p, [[X, 414], [X + s * 30, 400], [X + s * 46, 412], [X + s * 44, 432], [X + s * 26, 436]], blue, { ...o, round: 9, length: 16 });
  shape(p, [[X + s * 2, 422], [X + s * 16, 430], [X + s * 30, 462], [X + s * 20, 470], [X + s * 6, 446]], blue, { ...o, round: 7, length: 16, flow: () => Math.PI / 2 - s * 0.4 });
  mark([[X + s * 14, 420], [X + s * 32, 418]], '#101a50', 5, { opacity: 0.7 });
}
for (const a of [0.5, 2.1]) mark([[X - Math.cos(a) * 8, 420 - Math.sin(a) * 8], [X + Math.cos(a) * 8, 420 + Math.sin(a) * 8]], '#c8203c', 9);
mark([[X - 4, 416], [X + 3, 414]].map(([x, y], i) => [x + (i ? 3 : -3), y]), '#ff9cac', 4, { opacity: 0.9 });

// Her head. It is white and round, like the head of a doll. She has no eyes. Her mouth is all of her face: wide, red, open, with two rows of teeth, and she laughs. She is head down, so her chin is uppermost.
{
  const cy = 492, R = 58;
  const doll = tones({ shadow: '#8088c0', half: '#c8d0ec', lit: '#fbf8f2', rim: '#ffffff', bounce: '#f0a888' });
  studio.orb(p, [[X, cy, R]], (x, y) => { const k = clamp(((X - x) * 0.5 + (cy - y) * 0.6) / R, -1, 1), low = smooth(cy + 10, cy + R, y); return tint(mix(mix(k > 0 ? mix('#d4daf0', '#fdfaf4', k) : mix('#d4daf0', '#8c94c8', -k), '#f4b090', low * 0.4), '#aab4e0', smooth(R * 0.8, R, Math.hypot(x - X, y - cy)) * 0.5), x, y); }, { width: 8, reach: 34 });
  // the mouth: the red of her lips, the dark inside, and her teeth
  shape(p, [[X - 40, cy - 6], [X - 28, cy - 26], [X, cy - 34], [X + 28, cy - 26], [X + 40, cy - 6], [X + 24, cy - 4], [X, cy - 8], [X - 24, cy - 4]], tones({ shadow: '#7c1020', half: '#c01c30', lit: '#f04c58', rim: '#ffb0b0' }), { ...o, round: 8, length: 16, flow: () => 0 });
  shape(p, [[X - 31, cy - 9], [X - 22, cy - 22], [X, cy - 27], [X + 22, cy - 22], [X + 31, cy - 9], [X, cy - 13]], tones({ shadow: '#1c0410', half: '#3a0a18', lit: '#5c1424' }), { ...o, round: 6, length: 14, flow: () => 0, edge: false });
  for (let k = -3; k <= 3; k++) { const x = X + k * 8, top = cy - 25 + Math.abs(k) * 1.6; mark([[x, top], [x, top + 12.4]], '#fffaf0', 6.4, { cap: 'flat' }); }                 // the teeth of her upper jaw, which is the lower one in the picture
  for (let k = -2; k <= 2; k++) { const x = X + k * 9 + 4; mark([[x, cy - 21 + Math.abs(k)], [x, cy - 8.6 + Math.abs(k)]], '#e8e0e8', 5.4, { cap: 'flat', opacity: 0.8 }); }
  for (const s of [-1, 1]) { mark([[X + s * 40, cy - 6], [X + s * 48, cy - 14], [X + s * 50, cy - 26]], '#c01c30', 5, { taper: [0, 0.6] }); p.tryStroke({ brush: 'soft', color: '#f09cb0', width: 20, opacity: 0.35, points: [[X + s * 34, cy + 16], [X + s * 44, cy + 2]].map(([x, y], i) => [x, y + (i ? -8 : 8)]) }); }   // the corners of it turn up; and the color in her cheeks
  // the band of her cap across her brow, with a row of points of gold on it
  shape(p, [[X - 56, cy + 18], [X - 30, cy + 30], [X, cy + 34], [X + 30, cy + 30], [X + 56, cy + 18], [X + 50, cy + 44], [X + 24, cy + 58], [X - 24, cy + 58], [X - 50, cy + 44]], blue, { ...o, round: 14, length: 20, flow: () => 0 });
  for (let k = -3; k <= 3; k++) mark([[X + k * 15 - 5, cy + 26 + Math.abs(k) * -1.6 + 6], [X + k * 15, cy + 20 - Math.abs(k) * 1.6 + 6], [X + k * 15 + 5, cy + 32 - Math.abs(k) * 1.6]], '#e8b83c', 5);
}

// Her cap: two long horns that hang from her head and turn up at their ends. They are in bands of blue and white, and each has a ball of gold at its end.
for (const s of [-1, 1]) {
  const pts = [[X + s * 20, 536], [X + s * 50, 566], [X + s * 86, 606], [X + s * 126, 626], [X + s * 160, 612], [X + s * 172, 584]], wid = [26, 23, 19, 14, 10, 7];
  const edge = (k) => pts.map(([x, y], i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [x - (b[1] - a[1]) / l * wid[i] * k, y + (b[0] - a[0]) / l * wid[i] * k]; });
  shape(p, [...edge(1), ...edge(-1).reverse()], white, { ...o, round: 16, length: 22, flow: (x, y) => { let best = 0, d = 1e9; pts.forEach(([px, py], i) => { const dd = Math.hypot(x - px, y - py); if (dd < d && i < pts.length - 1) { d = dd; best = i; } }); return Math.atan2(pts[best + 1][1] - pts[best][1], pts[best + 1][0] - pts[best][0]); } });
  for (let i = 0; i < pts.length - 1; i++) { const [ax, ay] = pts[i], [bx, by] = pts[i + 1], mx = (ax + bx) / 2, my = (ay + by) / 2, l = Math.hypot(bx - ax, by - ay), w = (wid[i] + wid[i + 1]) / 2; mark([[mx - (by - ay) / l * w, my + (bx - ax) / l * w], [mx + (by - ay) / l * w, my - (bx - ax) / l * w]], '#2a46a0', Math.max(6, w * 0.5), { cap: 'flat' }); }   // its bands of blue
  studio.disc(p, X + s * 176, 572, 13, tint('#ffd24c', X + s * 176, 572), 6.5, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round' });
  p.tryStroke({ color: '#fff8c8', width: 4, opacity: 0.9, points: arc(X + s * 176, 572, 9, 3.4, 4.9, 6) });
}

// Streamers: long thin strips of color that hang from the two ends of the hem and go with the storm.
for (const s of [-1, 1]) {
  ['#ff8c7c', '#fff08c', '#8ceca0', '#7cc4ff'].forEach((c, i) => {
    const x0 = X + s * (250 - i * 8), y0 = 150 + i * 6, sway = 40 + i * 26;
    p.tryStroke({ ...line, color: tint(c, x0, y0 + 140), width: 6, opacity: 0.7, taper: [0, 0.7], points: [[x0, y0], [x0 + s * sway * 0.6, y0 + 90], [x0 + s * sway * 0.2 - 30, y0 + 190], [x0 + s * sway - 30, y0 + 280 + i * 20]] });
  });
}

// The shadows that serve her: black shapes of girls who were once like Homura. Each has a thin light of one color round it. They dance in the air about her.
function shadowGirl(x, y, s, tilt, c, hair, pose) {
  const ca = Math.cos(tilt), sa = Math.sin(tilt), Q = (ux, uy) => [x + (ux * ca - uy * sa) * s, y + (ux * sa + uy * ca) * s];
  const dark = { shadow: tint('#05070c', x, y), half: tint('#0c1018', x, y), lit: tint('#1c2434', x, y), rim: tint(c, x, y) }, so = { light: [-0.5, -0.6], turn: 0.5, width: 5, length: 14, vary: 0.04, dash: 18, gap: 6, edgeOpacity: 0.9 };
  const ink = (pts, w, extra = {}) => p.tryStroke({ ...line, color: tint('#080a12', x, y), width: Math.max(4.8, w * s), ...extra, points: pts.map(([a, b]) => Q(a, b)) });
  for (const [w, op] of [[110, 0.14], [60, 0.2]]) p.stroke({ brush: 'soft', color: tint(c, x, y), width: w * s, opacity: op, points: [Q(0, -70 - w * 0.6), Q(0, 0), Q(0, 70 + w * 0.6)] });   // its light
  // hair, behind the body
  if (hair === 'tails') for (const sx of [-1, 1]) shape(p, [Q(sx * 8, -62), Q(sx * 22, -60), Q(sx * 34, -40), Q(sx * 38, -14), Q(sx * 28, -16), Q(sx * 22, -40)], dark, { ...so, round: 6 });
  if (hair === 'long') shape(p, [Q(-12, -62), Q(12, -62), Q(18, -30), Q(22, 4), Q(8, 0), Q(0, 8), Q(-8, 0), Q(-22, 4), Q(-18, -30)], dark, { ...so, round: 9 });
  if (hair === 'pony') shape(p, [Q(6, -66), Q(22, -70), Q(40, -56), Q(50, -30), Q(40, -34), Q(28, -52), Q(10, -56)], dark, { ...so, round: 6 });
  // legs: one straight and one bent, as in a dance
  ink([[-6, 14], [-8, 42], [-6, 68]], 7, { taper: [0, 0.4] }); ink([[-6, 68], [-13, 73]].map(([a, b], i) => [a + (i ? -3 : 3), b]), 6);
  ink([[6, 14], [18, 36], [8, 56]], 7, { taper: [0, 0.4] }); ink([[8, 56], [2, 64]].map(([a, b], i) => [a + (i ? -3 : 3), b + (i ? 3 : -3)]), 6);
  // the dress: close at the body, a wide short skirt with a hem in points
  shape(p, [Q(-8, -42), Q(8, -42), Q(9, -18), Q(32, 12), Q(22, 20), Q(11, 13), Q(0, 21), Q(-11, 13), Q(-22, 20), Q(-32, 12), Q(-9, -18)], dark, { ...so, round: 10 });
  // arms
  if (pose === 'up') for (const sx of [-1, 1]) ink([[sx * 8, -38], [sx * 24, -50], [sx * 34, -72]], 6, { taper: [0, 0.5] });
  else { ink([[-8, -38], [-28, -34], [-46, -44]], 6, { taper: [0, 0.5] }); ink([[8, -38], [24, -22], [38, -4]], 6, { taper: [0, 0.5] }); }
  studio.disc(p, ...Q(0, -54), 12.5 * s, tint('#080a12', x, y), 6.5, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round' });   // its head
  glint(p, arc(...Q(0, -54), 11.5 * s, tilt + 3.3, tilt + 5.3, 8), () => tint(c, x, y), { width: 4.2, dash: 14, gap: 5, opacity: 0.9, rng: r });
}
shadowGirl(566, 170, 1.15, -0.35, '#ff9cc4', 'tails', 'up');
shadowGirl(640, 480, 1.05, 0.3, '#ffe08c', 'long', 'out');
shadowGirl(1404, 560, 1.0, -0.25, '#9cd8ff', 'pony', 'up');
shadowGirl(1486, 250, 1.15, 0.4, '#b8f0a0', 'long', 'out');

p.save();
