// Shared layout, palette and brush habits for the Fate/stay night painting.
//
// The scene: Unlimited Blade Works. It is not a place in the world. It is the inside of one
// man, made real round him: a dry red plain with no end to it, and in the plain, like the
// markers of graves, every sword that he has ever seen, more than can be counted. The sky is
// the color of a forge, and great wheels with teeth turn in it. Far off there is a hill, and
// the swords stand thickest on it. No one stands on the hill now. A boy walks toward it
// across the plain, small, with his back to us: Shirou, with a short sword in each hand.
//
// The light is the glow along the edge of the plain, beyond the boy and the hill. So he, the
// hill and all the swords are against it: dark, with fire along the edges that are turned to
// it, and their shadows come over the ground toward us.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth, shape, glint, disc, arc } = studio;

const W = 1600, H = 1000;
const HORIZON = 560;
const GLOW = { x: 800, y: 548 };           // the brightest of the light at the edge of the plain
const EYE = 0.57;                          // how high our eye is over the ground, in metres: a thing on the ground at the height y of the picture is (y - HORIZON) / EYE to the metre
const SHIROU = { x: 800, y: 596 };         // between his feet. He is about 19 metres from us: (596 - 560) / 0.57 units of the picture to the metre

const nA = noise2(503), nB = noise2(521), nC = noise2(547);

// How strongly the glow reaches a place.
const glow = (x, y, reach = 420) => Math.exp(-Math.pow(Math.hypot(x - GLOW.x, (y - GLOW.y) * 1.3) / reach, 2));

// The sky: nearly black at the top, then the dull red of iron in a fire, then orange, then gold at the edge of the plain.
const skyRamp = grad([[0, '#22100e'], [0.26, '#4a1c12'], [0.5, '#883214'], [0.72, '#c85c1c'], [0.88, '#f09438'], [1, '#ffd070']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / HORIZON + (nA(x / 380, y / 200) - 0.5) * 0.1, 0, 1));
  c = mix(c, '#ff9c3c', 0.5 * glow(x, y, 560));
  return mix(c, '#fff0b0', 0.9 * glow(x, y, 190));
}
// What the smoke and the glare do to a thing at a distance: d is 0 close to us and 1 very far off.
const far = (color, x, y, d) => mix(color, skyColor(x, Math.min(y, HORIZON - 8)), clamp(d, 0, 1) * 0.8);

// The hill, far off: the line of its top against the sky, and the line of its foot, where the plain in front of it begins.
// On the hill a thing is smaller than on the plain at the same height of the picture, because the hill is far: `onHill` gives
// the units of the picture to the metre at a place between its foot (t = 1) and its top (t = 0).
const hillTop = (x) => HORIZON + 6 - 140 * Math.exp(-Math.pow((x - 520) / 280, 2)) + 5 * (nB(x / 70, 3) - 0.5);
const hillFoot = (x) => 580 + 5 * (nB(x / 160, 7) - 0.5) + 6 * Math.exp(-Math.pow((x - 520) / 420, 2));
const onHill = (t) => 18 + 17 * t;

// The ground: bright with the glare at the far edge, then red earth, then dark near us.
function ground(x, y) {
  const d = clamp((y - HORIZON) / (H - HORIZON), 0, 1);
  let c = mix('#f0a044', '#8c3c1a', smooth(0, 0.22, d));
  c = mix(c, '#3a1810', smooth(0.2, 1, d) * 0.85);
  return mix(c, '#ffc060', Math.exp(-Math.pow((x - GLOW.x) / (140 + d * 560), 2)) * (0.5 - 0.34 * d));   // the road of the glare on it
}

// A sword that stands in the ground, point down, a little out of true. Its base is at (bx, by) and it stands h high.
//   kind: 'long', 'broad', 'katana' or 'spear'; tilt in radians; d: how far off it is, for the smoke
// It is dark against the glare, with fire along the edge of it that is turned to the glare, and its shadow comes toward us.
function sword(p, bx, by, h, o = {}) {
  const r = p.rng, tilt = o.tilt != null ? o.tilt : r.range(-0.24, 0.24), kind = o.kind || r.pick(['long', 'long', 'long', 'broad', 'katana', 'spear']), d = o.d || 0;
  const ux = Math.sin(tilt), uy = -Math.cos(tilt), nx = -uy, ny = ux;
  const P = (t, off = 0) => [bx + ux * h * t + nx * off, by + uy * h * t + ny * off];
  const side = bx < GLOW.x ? 1 : -1;                                     // the side of it that the glare is on
  const steel = far(mix('#21171a', '#4c3a34', r()), bx, by, d), lit = far(mix('#ff8c30', '#ffc468', r()), bx, by, d * 0.3), hilt = far(mix('#160e10', '#3a2218', r()), bx, by, d);
  const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.08, cap: 'flat' };
  // its shadow: on the ground, straight away from the glare
  if (h >= 16) {
    const sx = bx - GLOW.x, sy = by - HORIZON, sl = Math.hypot(sx, sy) || 1, len = Math.max(13, h * 0.9 * (0.6 + sy / 400));
    p.tryStroke({ brush: 'bristle', color: far('#1c0a0c', bx, by, d), width: Math.max(4.8, h * 0.045), opacity: 0.5, mix: 0.2, dry: 0.05, rag: 0.3, taper: [0, 0.8], points: [[bx, by], [bx + sx / sl * len, by + sy / sl * len]] });
  }
  if (h < 30) { p.tryStroke({ ...line, color: steel, width: 4.8, points: [P(0), P(Math.max(1, 12.4 / h))] }); return; }   // far off it is only a mark
  if (kind === 'spear') {
    const w = Math.max(4.8, h * 0.03);
    p.tryStroke({ ...line, color: hilt, width: w, points: [P(0), P(0.5), P(1)] });
    if (h >= 110) p.tryStroke({ color: lit, width: 4, opacity: 0.55, points: [P(0.05, side * w * 0.3), P(0.95, side * w * 0.3)] });
    p.tryStroke({ ...line, color: far('#b8862c', bx, by, d), width: Math.max(4.8, w * 1.5), points: [P(1 - Math.max(0.04, 12.4 / h)), P(1)] });   // the cap on the end of its shaft
    return;
  }
  const top = kind === 'katana' ? 0.74 : 0.72, bw = Math.max(4.8, h * (kind === 'broad' ? 0.11 : kind === 'katana' ? 0.045 : 0.065)), curve = kind === 'katana' ? h * 0.05 * (r() < 0.5 ? 1 : -1) : 0;
  const detail = h >= 150;
  // the blade
  p.tryStroke({ ...line, color: steel, width: bw, points: [P(0), P(top / 2, curve), P(top)] });
  if (detail) p.tryStroke({ ...line, color: mix(steel, '#0c0608', 0.5), width: Math.max(4.8, bw * 0.45), points: [P(0, -side * bw * 0.26), P(top / 2, curve - side * bw * 0.26), P(top, -side * bw * 0.26)] });   // the half of it that is turned from the glare
  if (detail && kind !== 'katana') p.tryStroke({ color: mix(steel, '#7c5a48', 0.5), width: 4, opacity: 0.7, points: [P(0.04), P(top * 0.9)] });                                                         // the groove down the middle of it
  if (h >= 90) p.tryStroke({ color: lit, width: detail ? 4.6 : 4, opacity: detail ? 0.85 : 0.6, points: [P(0.02, side * bw * 0.4), P(top / 2, curve + side * bw * 0.4), P(top - 0.02, side * bw * 0.4)] });   // the fire along its edge
  // the guard, the grip, the pommel
  const gw = Math.max(12.6, h * (kind === 'katana' ? 0.075 : kind === 'broad' ? 0.3 : 0.24)), gt = Math.max(4.8, h * (kind === 'katana' ? 0.03 : 0.035));
  p.tryStroke({ ...line, color: kind === 'katana' ? hilt : far(mix('#3a2618', '#6c4a24', r()), bx, by, d), width: Math.min(gt, gw / 2.05), points: [P(top, -gw / 2), P(top, gw / 2)] });
  if (detail) p.tryStroke({ color: far('#e0a848', bx, by, d), width: 4, opacity: 0.8, points: [P(top + gt / h * 0.5, side > 0 ? 0 : -gw / 2), P(top + gt / h * 0.5, side > 0 ? gw / 2 : 0)] });           // the light on the guard
  const gripW = Math.max(4.8, h * 0.032), gripEnd = Math.max(0.97, top + 12.6 / h);
  p.tryStroke({ ...line, color: hilt, width: gripW, points: [P(top), P(gripEnd)] });
  if (detail) for (let k = 0; k < 4; k++) { const t = top + (0.97 - top) * (k + 0.5) / 4; p.tryStroke({ color: far('#6c4630', bx, by, d), width: 4, opacity: 0.8, points: [P(t - 0.012, -gripW * 0.9), P(t + 0.012, gripW * 0.9)].map(([x, y], i) => [x + (i ? 1 : -1) * Math.max(0, 6.3 - gripW * 0.9) * nx, y + (i ? 1 : -1) * Math.max(0, 6.3 - gripW * 0.9) * ny]) }); }   // the binding on the grip
  if (h >= 70) { const pw = Math.max(13, h * 0.07); p.tryStroke({ ...line, cap: 'round', color: far(mix('#4c3018', '#9c6c2c', r()), bx, by, d), width: Math.min(pw / 2.05, Math.max(4.8, h * 0.05)), points: [P(gripEnd, -pw / 2), P(gripEnd, pw / 2)] }); }
}

// A sword that stands close to us, big enough for the make of it to be seen: the two faces
// of its blade, one turned to the glare and one turned from it; the fire along its edge and
// the glare in its steel; its guard, the binding of its grip, its pommel; the earth that it
// has thrown up where it went in; and its long shadow.
//   kind: 'long', 'broad', 'great', 'katana', 'saber' or 'spear'; tilt in radians
function bigSword(p, bx, by, h, o = {}) {
  const r = p.rng, tilt = o.tilt != null ? o.tilt : r.range(-0.2, 0.2), kind = o.kind || 'long';
  const ux = Math.sin(tilt), uy = -Math.cos(tilt), side = bx < GLOW.x ? 1 : -1, nx = -uy * side, ny = ux * side;
  const P = (t, off = 0) => [bx + ux * h * t + nx * off, by + uy * h * t + ny * off];          // t: up it from the ground; off: across it, more than 0 toward the glare
  const poly = (pts) => pts.map(([t, off]) => P(t, off)), along = Math.atan2(uy, ux);
  const light = { at: [GLOW.x, GLOW.y - 40] }, line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round' };
  const steelLit = { shadow: '#2c2022', half: '#5e4638', lit: '#a67a52', rim: '#ffdc98', bounce: '#3c2c38' };
  const steelDark = { shadow: '#0c090b', half: '#1a1416', lit: '#2e2428', bounce: '#201a2c' };
  const bronze = { shadow: '#24160e', half: '#5a3a1a', lit: '#a8742c', rim: '#ffd880', bounce: '#3c2420' };
  const leather = { shadow: '#100b0d', half: '#281a18', lit: '#56382a', rim: '#e0a060', bounce: '#1c1420' };
  const face = (pts, tones, extra = {}) => shape(p, poly(pts), tones, { light, turn: 0.15, width: 5.5, length: 24, vary: 0.08, flow: () => along + r.range(-0.03, 0.03), dash: 34, gap: 8, edgeOpacity: 0.9, ...extra });
  const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: poly(pts) });

  // its shadow, on the ground, straight away from the glare; and the earth round the foot of it
  { const sx = bx - GLOW.x, sy = by - HORIZON, sl = Math.hypot(sx, sy) || 1, len = h * 0.9 * (0.6 + sy / 400);
    p.tryStroke({ brush: 'soft', color: '#160808', width: Math.max(8.2, h * 0.07), opacity: 0.5, taper: [0, 0.6], points: [[bx, by], [bx + sx / sl * len * 0.5, by + sy / sl * len * 0.5], [bx + sx / sl * len, by + sy / sl * len]] });
    for (let k = 0; k < 7; k++) { const a = r.range(0, 6.283), d = r.range(0.02, 0.07) * h, len2 = Math.max(13, h * r.range(0.04, 0.09)); p.tryStroke({ ...line, color: mix('#1c0a08', '#5c2814', r()), width: Math.max(4.8, h * r.range(0.014, 0.03)), opacity: 0.85, rag: 0.4, points: [[bx + Math.cos(a) * d - len2 / 2, by + Math.sin(a) * d * 0.3 + 2], [bx + Math.cos(a) * d + len2 / 2, by + Math.sin(a) * d * 0.3 + r.range(0, 5)]] }); }
    for (let k = 0; k < 3; k++) { const a = r.range(0.2, 2.9), len2 = h * r.range(0.1, 0.2); p.tryStroke({ ...line, color: '#170808', width: 4.8, opacity: 0.55, rag: 0.3, taper: [0.1, 0.7], points: [[bx, by + 3], [bx + Math.cos(a) * len2 * 0.5 + r.range(-6, 6), by + 3 + Math.sin(a) * len2 * 0.2], [bx + Math.cos(a) * len2, by + 3 + Math.sin(a) * len2 * 0.4]] }); }
  }

  if (kind === 'spear') {
    const hw = h * 0.016;
    face([[0, -hw], [1, -hw], [1, 0], [0, 0]], steelDark, { edge: false });
    face([[0, 0], [1, 0], [1, hw], [0, hw]], leather);
    for (const t of [0.22, 0.5, 0.78]) mark([[t, -hw * 1.6], [t + 0.004, hw * 1.6]].map(([tt, off]) => [tt, off * Math.max(1, 6.4 / (hw * 1.6))]), '#a8742c', Math.max(4.8, h * 0.012), { cap: 'flat' });   // rings of bronze on its shaft
    face([[1, -hw * 1.5], [1.035, 0], [1, hw * 1.5]], bronze, { length: 13 });                                                                 // the cap on its end
    // a strip of cloth is tied to it near the top, and the wind takes it out
    const t0 = 0.84, [cx, cy] = P(t0), L = h * 0.3, W2 = h * 0.07, flag = [[cx, cy - W2], [cx + L * 0.3, cy - W2 * 1.3], [cx + L * 0.62, cy - W2 * 0.5], [cx + L, cy - W2 * 0.9], [cx + L * 0.92, cy + W2 * 0.5], [cx + L * 0.6, cy + W2 * 0.9], [cx + L * 0.3, cy + W2 * 0.3], [cx, cy + W2]];
    shape(p, flag, { shadow: '#3c0c10', half: '#7a181a', lit: '#c0301e', rim: '#ffb060', bounce: '#5c1830' }, { light, turn: 0.2, width: 5.5, length: 20, flow: (x) => 0.25 * Math.sin((x - cx) / L * 6.5), dash: 22, gap: 8 });
    for (const f of [0.28, 0.6]) p.tryStroke({ ...line, color: '#2c080c', width: 5, opacity: 0.6, taper: [0.2, 0.4], points: [[cx + L * f, cy - W2 * 0.9], [cx + L * (f + 0.04), cy], [cx + L * f, cy + W2 * 0.6]] });   // its folds
    mark([[t0, -hw * 2], [t0, hw * 2]].map(([tt, off]) => [tt, off * Math.max(1, 6.4 / (hw * 2))]), '#d8c8b0', 5, { cap: 'flat' });               // the cord that ties it
    return;
  }

  const curved = kind === 'katana' || kind === 'saber', top = kind === 'great' ? 0.74 : curved ? 0.72 : 0.7;
  const bw = h * (kind === 'broad' ? 0.062 : kind === 'great' ? 0.05 : kind === 'katana' ? 0.024 : kind === 'saber' ? 0.03 : 0.036);   // half the width of the blade at the guard
  const bend = curved ? h * 0.05 * (o.bend || 1) : 0, c = (t) => bend * Math.sin(Math.PI * clamp(t / top, 0, 1)), hw = (t) => bw * (0.8 + 0.2 * clamp(t / top, 0, 1));
  const edgeLine = (k, n = 9) => { const pts = []; for (let i = 0; i <= n; i++) { const t = top * i / n; pts.push([t, c(t) + hw(t) * k]); } return pts; };
  const ridge = curved ? 0.35 : 0;                                                              // where the two faces of the blade meet
  // the blade: the face that is turned from the glare, then the face that is turned to it
  face([...edgeLine(-1), ...edgeLine(ridge).reverse()], steelDark, { edge: false });
  face([...edgeLine(ridge), ...edgeLine(1).reverse()], steelLit);
  if (kind === 'broad' || kind === 'great') mark([[0.03, 0], [top * 0.5, 0], [top * 0.9, 0]], '#141012', Math.max(4.8, bw * 0.5), { opacity: 0.8, cap: 'flat' });   // the wide groove down the middle of it
  else if (!curved) mark([[0.03, 0], [top * 0.5, 0], [top * 0.92, 0]], '#0e0a0c', 4.6, { opacity: 0.7 });                                         // the line where its two faces meet
  if (kind === 'katana') { const pts = []; for (let i = 0; i <= 14; i++) { const t = top * (0.03 + 0.94 * i / 14); pts.push(P(t, c(t) + hw(t) * (0.62 + 0.12 * Math.sin(i * 2.1)))); } glint(p, pts, () => mix('#c8a078', '#ffe4b0', r()), { width: 4.6, dash: 40, gap: 4, opacity: 0.75, rng: r }); }   // the pale wavy line of its temper, along the edge
  // the glare in the steel: one or two long pale streaks down the lit face
  for (let k = 0; k < 2; k++) { const t0 = top * r.range(0.08, 0.5), t1 = t0 + top * r.range(0.2, 0.4), k0 = ridge + (1 - ridge) * r.range(0.35, 0.65); mark([[t0, c(t0) + hw(t0) * k0], [(t0 + t1) / 2, c((t0 + t1) / 2) + hw((t0 + t1) / 2) * k0], [t1, c(t1) + hw(t1) * k0]], mix('#d89858', '#ffe8b8', r()), 4.6, { opacity: r.range(0.25, 0.5), taper: [0.4, 0.4] }); }
  glint(p, poly(edgeLine(1).map(([t, off]) => [t, off - 1.5]).slice(0)), () => mix('#ff9c40', '#ffe090', r()), { width: 4.6, dash: 46, gap: 9, opacity: 0.9, rng: r });

  // the guard
  const a = Math.max(0.012, 7 / h);                                                             // half its thickness, as a part of the length of the sword
  if (kind === 'katana') { const [gx, gy] = P(top + a); disc(p, gx, gy, Math.max(7, h * 0.034), '#1c1416', 6.2, { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.1, cap: 'round' }); p.tryStroke({ color: '#e0a860', width: 4, opacity: 0.85, points: arc(gx, gy, Math.max(7, h * 0.034) - 1, side > 0 ? -1.2 : 1.9, side > 0 ? 1.2 : 4.3, 8) }); }
  else if (kind === 'saber') {
    face([[top - a, -bw * 1.6], [top + a, -bw * 1.6], [top + a, bw * 2.4], [top - a, bw * 2.4]], bronze, { length: 14 });
    p.tryStroke({ ...line, color: '#7c5420', width: Math.max(5, h * 0.016), points: [P(top + a, bw * 2.2), P(top + 0.1, bw * 3.4), P(0.93, bw * 2.6), P(0.965, bw * 0.4)] });   // the bow that guards the hand
    p.tryStroke({ color: '#ffd880', width: 4, opacity: 0.8, points: [P(top + 0.03, bw * 3.1 + 2), P(top + 0.1, bw * 3.4 + 2), P(0.92, bw * 2.8 + 2)] });
  } else {
    const gl = h * (kind === 'broad' ? 0.12 : kind === 'great' ? 0.17 : 0.14), droop = kind === 'broad' ? 0.035 : 0;   // the arms of a broad sword's guard slope down toward the blade
    face([[top - a - droop, -gl], [top + a - droop, -gl], [top + a * 1.5, 0], [top + a - droop, gl], [top - a - droop, gl], [top - a * 1.2, 0]], bronze, { length: 16, flow: () => along + Math.PI / 2 });
    if (kind === 'great') for (const k of [-1, 1]) { const [rx, ry] = P(top, k * gl); p.tryStroke({ ...line, color: k > 0 ? '#c89038' : '#5a3a1a', width: 5, points: arc(rx, ry, Math.max(6.6, h * 0.022), 0, 6.283, 10) }); }   // rings at the ends of it
    if (kind === 'great') { face([[top - 0.12, -bw * 0.62], [top - a, -bw * 0.62], [top - a, bw * 0.62], [top - 0.12, bw * 0.62]], leather, { length: 14 }); for (const k of [-1, 1]) face([[top - 0.135, k * bw * 0.5], [top - 0.115, k * bw * 1.9], [top - 0.1, k * bw * 0.5]], k > 0 ? steelLit : steelDark, { length: 13, edge: k > 0 }); }   // the part above the guard that a hand can hold, bound in leather, and the two small points below it
  }
  // the grip, its binding, and the pommel
  const g0 = top + a, g1 = kind === 'katana' ? 0.975 : kind === 'great' ? 0.955 : 0.94, gw = h * (kind === 'katana' ? 0.016 : 0.017);
  face([[g0, -gw], [g1, -gw * 0.9], [g1, gw * 0.9], [g0, gw]], leather, { length: 16 });
  const turns = Math.max(3, Math.round((g1 - g0) * h / 13));
  for (let k = 0; k < turns; k++) {
    const t = g0 + (g1 - g0) * (k + 0.5) / turns, dt = Math.max(0.012, 4 / h), wide = Math.max(gw * 0.95, 6.3);
    if (kind === 'katana') { mark([[t - dt, -wide], [t + dt, wide]], '#d8c4a0', 4.4, { opacity: 0.85 }); mark([[t + dt, -wide], [t - dt, wide]], '#a89070', 4.4, { opacity: 0.7 }); }   // the crossed binding of silk
    else mark([[t - dt * 0.6, -wide], [t + dt * 0.6, wide]], k % 2 ? '#6c4630' : '#8c6038', 4.6, { opacity: 0.85 });
  }
  if (kind === 'katana') mark([[g1, -gw * 1.1], [g1 + 0.012, gw * 1.1]].map(([t, off]) => [t, off * Math.max(1, 6.4 / (gw * 1.1))]), '#a8742c', 5.5, { cap: 'flat' });
  else { const [px, py] = P(g1 + Math.max(0.02, 8 / h)), pr = Math.max(7, h * (kind === 'broad' ? 0.034 : 0.026)); disc(p, px, py, pr, '#6c4418', 6.2, { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.1, cap: 'round' }); p.tryStroke({ color: '#ffd880', width: 4, opacity: 0.85, points: arc(px, py, pr - 1.5, side > 0 ? -1.4 : 1.7, side > 0 ? 1.0 : 4.1, 8) }); }
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, GLOW, EYE, SHIROU, nA, nB, nC, glow, skyColor, far, hillTop, hillFoot, onHill, ground, sword, bigSword };
