// The White Whale. It swims in the air, out of the mist, toward the tree and the army. It is
// white, and all of it is covered with fine hair. Its head is a third of it, blunt, with a
// horn on the brow that bends forward, a small yellow eye, and a mouth that goes far back,
// open, red inside, with rows of small teeth. Long thin fins go out from behind its head
// and stream back along it; their ends are red. Its tail has two long flukes. Over its back
// there is a wheel of rose light with a line of light through it: that is what holds it
// in the air. The mist comes from it and goes out behind it.
// The moon is above it and behind it, so its back is bright and its belly is blue shade.
'use strict';
const { studio, open, WHALE, MOONWARD, far, onWhale, nC } = require('./scene');
const { mix, clamp, smooth, through, shape, glint, wave } = studio;

const p = open('whale');
const r = p.rng;
const P = onWhale, poly = (pts) => pts.map(([u, v]) => P(u, v)), L = WHALE.len, D = 0.12;
const line = { brush: 'bristle', mix: 0.1, dry: 0.03, rag: 0.15, cap: 'round' };
const tint = (c, k = 1) => far(c, WHALE.x + L / 2, WHALE.y, D * k);
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color: tint(color), width, ...extra, points: poly(pts) });
// Its back and its belly: how far each is from the middle line of it, along its length.
const dorsal = through([[0, 0.03], [0.035, 0.11], [0.13, 0.155], [0.3, 0.165], [0.5, 0.135], [0.7, 0.085], [0.85, 0.045], [0.97, 0.02], [1, 0.012]]);
const ventral = through([[0, 0.04], [0.045, 0.115], [0.15, 0.155], [0.3, 0.165], [0.45, 0.145], [0.62, 0.095], [0.8, 0.048], [0.95, 0.022], [1, 0.012]]);
const inv = (x, y) => { const c = Math.cos(WHALE.turn), s = Math.sin(WHALE.turn), dx = x - WHALE.x, dy = y - WHALE.y; return [(dx * c + dy * s) / L, (dx * s - dy * c) / L]; };
const white = { shadow: tint('#4a5890'), half: tint('#9cacdc'), lit: tint('#f4f7ff'), rim: tint('#ffffff', 0.5), bounce: tint('#6c7cb4') };
const redT = { shadow: tint('#5c1830'), half: tint('#b02c40'), lit: tint('#f0586c'), rim: tint('#ffc0c8', 0.5), bounce: tint('#7c2850') };
// A long thin fin: its middle line, in places on the whale, and its half width in units of the picture. It bends as one curve,
// and the last part of it is red.
function fin(pts, wid, o = {}) {
  const n0 = pts.length, fu = through(pts.map((q, i) => [i / (n0 - 1), q[0]])), fv = through(pts.map((q, i) => [i / (n0 - 1), q[1]])), fw = through(wid.map((w, i) => [i / (n0 - 1), w]));
  // `through` eases at each point, which would make a line of joints; a mean of near places makes one curve of it
  const at = (t) => { let u = 0, v = 0, w = 0, k = 0; for (let e = -3; e <= 3; e++) { const tt = clamp(t + e * 0.045, 0, 1), g = 4 - Math.abs(e); u += fu(tt) * g; v += fv(tt) * g; w += fw(tt) * g; k += g; } return [u / k, v / k, w / k]; };
  const N = 16, q = [], w = [];
  for (let i = 0; i <= N; i++) { const [u, v, ww] = at(i / N); q.push(P(u, v)); w.push(i === N ? 2.6 : Math.max(2.6, ww)); }
  const side = (a, b, k) => { const out = []; for (let i = a; i <= b; i++) { const A = q[Math.max(0, i - 1)], B = q[Math.min(N, i + 1)], l = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1; out.push([q[i][0] - (B[1] - A[1]) / l * w[i] * k, q[i][1] + (B[0] - A[0]) / l * w[i] * k]); } return out; };
  const seg = (x, y) => { let best = 0, dd = 1e9; for (let i = 0; i < N; i++) { const d2 = Math.hypot(x - q[i][0], y - q[i][1]); if (d2 < dd) { dd = d2; best = i; } } return Math.atan2(q[best + 1][1] - q[best][1], q[best + 1][0] - q[best][0]); };
  const dim = o.dim || 0, tones = dim ? { shadow: tint(mix('#4a5890', '#222c5c', dim)), half: tint(mix('#9cacdc', '#4c5c98', dim)), lit: tint(mix('#f4f7ff', '#8c9cd0', dim)), bounce: tint(mix('#6c7cb4', '#34427c', dim)) } : white;
  shape(p, [...side(0, N, 1), ...side(0, N, -1).reverse()], tones, { light: MOONWARD, turn: 0.1, width: 6, length: 30, vary: 0.06, flow: seg, dash: 34, gap: 10, edgeOpacity: 0.8 * (1 - dim * 0.6) });
  // its end: red, and the red comes on by degrees
  const k0 = Math.round(N * (o.red || 0.7)), reds = dim ? { shadow: tint(mix('#5c1830', '#3c1838', dim)), half: tint(mix('#b02c40', '#70284c', dim)), lit: tint(mix('#f0586c', '#a43c5c', dim)), bounce: tint('#5c2048') } : redT;
  shape(p, [...side(k0, N, 1), ...side(k0, N, -1).reverse()], reds, { light: MOONWARD, turn: 0.1, width: 5.5, length: 26, vary: 0.08, flow: seg, edge: !dim, dash: 30, gap: 9, edgeOpacity: 0.7 });
  for (const s of [-0.45, 0.1, 0.5]) { const a = q[k0 - 2], b = q[k0 - 1], c = q[k0], nx = -(c[1] - a[1]), ny = c[0] - a[0], l = Math.hypot(nx, ny) || 1, off = s * w[k0 - 1]; p.tryStroke({ ...line, color: reds.half, width: 5, opacity: 0.45, taper: [0.9, 0], points: [[a[0] + nx / l * off, a[1] + ny / l * off], [b[0] + nx / l * off, b[1] + ny / l * off], [c[0] + nx / l * off, c[1] + ny / l * off]] }); }
}

// The mist behind it, out of which it comes.
for (let k = 0; k < 14; k++) { const [x, y] = P(r.range(0.6, 1.25), r.range(-0.2, 0.2)), len = r.range(200, 420); p.stroke({ brush: 'soft', color: mix('#5c74b0', '#b8ccf8', r()), width: r.range(50, 100), opacity: r.range(0.12, 0.22), points: wave(x - len / 2, y, x + len / 2, y + r.range(-20, 20), 8, 1, 6) }); }

// The fins of its far side, behind its body, dim.
fin([[0.34, -0.1], [0.46, -0.185], [0.62, -0.235], [0.8, -0.255], [0.98, -0.25]], [16, 34, 27, 15, 5], { dim: 0.8 });

// Its body.
{
  const inside = (x, y) => { const [u, v] = inv(x, y); return u > 0 && u < 1 && v < dorsal(u) && v > -ventral(u); };
  const hide = (x, y) => {
    const [u, v] = inv(x, y), s = clamp(v >= 0 ? v / dorsal(u) : v / ventral(u), -1, 1), hair = nC(u * 70, s * 6) - 0.5;
    let c = s > 0.2 ? mix('#b4c2ec', '#f6f8ff', smooth(0.2, 0.92, s)) : s > -0.4 ? mix('#7888c0', '#b4c2ec', smooth(-0.4, 0.2, s)) : mix('#364480', '#7888c0', smooth(-1, -0.4, s));
    c = mix(c, hair > 0 ? '#ffffff' : '#56669c', Math.abs(hair) * 0.34);                         // the hair on it
    c = mix(c, '#ffb0e4', Math.exp(-Math.pow((u - 0.45) / 0.13, 2)) * smooth(0.2, 1, s) * 0.4);   // the rose light of the wheel, on its back
    return tint(mix(c, '#d8b890', smooth(-0.6, -1, s) * 0.14));                                  // and a little of the lamps of the army, far under it
  };
  const flowAt = (x, y) => { const [u, v] = inv(x, y), e = 0.01, s = clamp(v >= 0 ? v / dorsal(u) : v / ventral(u), -1, 1), slope = v >= 0 ? (dorsal(u + e) - dorsal(u - e)) / (2 * e) : -(ventral(u + e) - ventral(u - e)) / (2 * e); return WHALE.turn - Math.atan(slope * Math.abs(s)) + r.range(-0.04, 0.04); };
  const c0 = P(0, 0.3), c1 = P(1, -0.3), box = [Math.min(c0[0], c1[0]) - 20, WHALE.y - 0.3 * L, Math.max(c0[0], c1[0]) + 20, WHALE.y + 0.3 * L];
  p.fill({ inside, bounds: box, width: 13, length: 70, spacing: 0.5, angle: flowAt, color: hide, stroke: { ...line, opacity: 0.97, mix: 0.15 } });
  p.fill({ inside, bounds: box, width: 7, length: 40, spacing: 0.75, overlap: 0.7, angle: flowAt, color: (x, y) => hide(x + r.range(-3, 3), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.9, mix: 0.15 } });
  { const top = []; for (let u = 0.03; u <= 0.98; u += 0.03) top.push(P(u, dorsal(u) - 0.004)); glint(p, top, () => tint(mix('#e8f0ff', '#ffffff', r()), 0.5), { width: 5, dash: 70, gap: 9, opacity: 0.9, rng: r }); }   // the moon along its back
  for (const k of [0.45, 0.62, 0.78]) { const pts = []; for (let u = 0.33; u <= 0.62; u += 0.04) pts.push(P(u, -ventral(u) * k)); p.tryStroke({ ...line, color: tint('#2c386c'), width: 5, opacity: 0.5, taper: [0.2, 0.5], points: pts }); }   // the long folds of its belly
  p.fill({ inside, bounds: box, width: 5, length: 26, spacing: 1.2, overlap: 0.7, angle: flowAt, color: (x, y) => mix(hide(x, y), r() < 0.5 ? '#ffffff' : '#46568c', r() * 0.3), stroke: { ...line, opacity: 0.6, mix: 0.1, taper: [0.3, 0.6] } });   // the fine hair on it
  for (const [u, v, n] of [[0.5, 0.06, 3], [0.68, -0.02, 2], [0.4, -0.06, 2], [0.82, 0.01, 2], [0.3, 0.1, 2]]) for (let k = 0; k < n; k++) {                                                              // old wounds in its hide: slashes, each with a pale lip
    const a = u + k * 0.014, len = r.range(0.035, 0.06); mark([[a, v + 0.02], [a + len * 0.5, v], [a + len, v - 0.022]], '#4a5890', 4.6, { opacity: 0.6, taper: [0.5, 0.5] }); mark([[a + 0.004, v + 0.024], [a + len * 0.5 + 0.004, v + 0.004]], '#ffffff', 4, { opacity: 0.35 });
  }
  for (const [u, k] of [[0.36, 1], [0.39, 0.8], [0.415, 0.6]]) mark([[u - 0.012, -0.1 * k], [u, -0.03 * k], [u + 0.004, 0.05 * k]], '#46568c', 5, { opacity: 0.45, taper: [0.4, 0.6] });                   // the creases behind its jaw
}

// Its mouth: open. The inside of it is red, and its tongue is paler; small teeth stand in rows along both of its jaws.
shape(p, poly([[0.012, -0.016], [0.1, -0.044], [0.21, -0.06], [0.33, -0.054], [0.27, -0.108], [0.17, -0.13], [0.07, -0.126], [0.02, -0.086]]), { shadow: tint('#2c0814'), half: tint('#701428'), lit: tint('#c83848'), bounce: tint('#4c1030') }, { light: [0, 1], turn: 0, width: 6.5, length: 26, vary: 0.06, flow: () => WHALE.turn, edge: false });
shape(p, poly([[0.07, -0.094], [0.15, -0.086], [0.26, -0.09], [0.21, -0.118], [0.1, -0.12]]), { shadow: tint('#8c2038'), half: tint('#d04c5c'), lit: tint('#f08c90'), bounce: tint('#701428') }, { light: MOONWARD, turn: 0, width: 5.5, length: 22, flow: () => WHALE.turn, edge: false });
for (let u = 0.03; u < 0.32; u += 0.021) { const top = -0.018 - 0.041 * smooth(0, 0.21, u) - 0.002; mark([[u, top], [u + 0.002, top - 0.02]], '#f8f8ff', 5.5); }                                         // the teeth of its upper jaw
for (let u = 0.05; u < 0.27; u += 0.023) { const bot = -0.127 + 0.02 * smooth(0.17, 0.28, u) + 0.006 * (u < 0.07 ? 1 : 0); mark([[u, bot], [u + 0.002, bot + 0.019]], '#dce0f4', 5, { opacity: 0.9 }); }   // and of its lower jaw
mark([[0.012, -0.013], [0.1, -0.04], [0.21, -0.056], [0.33, -0.05]], '#2c386c', 5.5, { opacity: 0.7 });                                                                                             // the shade under its lip
for (const k of [0.82, 0.9, 0.97]) { const pts = []; for (let u = 0.06; u <= 0.36; u += 0.04) pts.push(P(u, -ventral(u) * k)); p.tryStroke({ ...line, color: tint('#2c386c'), width: 5, opacity: 0.45, taper: [0.2, 0.4], points: pts }); }   // the folds of its throat
// Its eye: small, yellow, in a dark hollow, behind the corner of its mouth and above it.
p.tryStroke({ brush: 'soft', color: tint('#2c386c'), width: 26, opacity: 0.5, points: poly([[0.225, 0.02], [0.29, 0.02]]) });
mark([[0.246, 0.02], [0.268, 0.02]], '#ffd84c', 7);
mark([[0.238, 0.034], [0.276, 0.032]], '#1c2450', 5, { opacity: 0.85 });

// Its horn: on its brow, thick, bent forward and up, with rings round it.
shape(p, poly([[0.03, 0.098], [0.01, 0.16], [-0.018, 0.224], [-0.05, 0.28], [-0.008, 0.238], [0.034, 0.186], [0.084, 0.128]]), white, { light: MOONWARD, turn: 0.1, width: 6, length: 24, vary: 0.06, dash: 26, gap: 8, edgeOpacity: 0.9 });
for (const [u0, v0, u1, v1] of [[0.018, 0.146, 0.06, 0.16], [-0.002, 0.186, 0.034, 0.198], [-0.022, 0.224, 0.006, 0.234]]) mark([[u0, v0], [u1, v1]], '#6c7cb4', 4.6, { opacity: 0.7 });

// The fins of its near side: long, wide where they leave it and thin at their ends, streaming back along it.
fin([[0.28, -0.135], [0.37, -0.25], [0.5, -0.33], [0.66, -0.375], [0.84, -0.395]], [18, 40, 33, 19, 5]);
fin([[0.63, -0.08], [0.69, -0.145], [0.77, -0.185], [0.86, -0.205], [0.95, -0.21]], [10, 20, 16, 9, 4], { red: 0.62 });
// Points along its back, toward its tail.
for (const [u, h, wd] of [[0.55, 0.062, 20], [0.655, 0.05, 16], [0.75, 0.036, 13], [0.84, 0.026, 10]]) {
  const v = dorsal(u) - 0.012;
  mark([[u - 0.02, v], [u + 0.012, v + h * 0.5], [u + 0.05, v + h]], '#7484bc', wd, { taper: [0, 0.97], opacity: 0.97 });
  mark([[u - 0.008, v + 0.006], [u + 0.02, v + h * 0.56], [u + 0.05, v + h]], '#f4f7ff', wd * 0.45 < 4.8 ? 4.8 : wd * 0.45, { taper: [0, 0.9] });
}
// Its tail: two flukes, wide in the middle and pointed, with red at their ends.
fin([[0.965, 0.0], [1.035, 0.03], [1.095, 0.085], [1.135, 0.16], [1.145, 0.25]], [14, 32, 36, 22, 5], { red: 0.78 });
fin([[0.965, 0.0], [1.04, -0.03], [1.105, -0.08], [1.155, -0.145], [1.18, -0.225]], [14, 32, 36, 22, 5], { red: 0.78 });

// The wheel of rose light over its back, and the line of light through it.
{
  const [cx, cy] = P(0.43, 0.31), rx = 80, ry = 24, t = WHALE.turn, E = (a, k = 1) => [cx + (Math.cos(a) * rx * Math.cos(t) - Math.sin(a) * ry * Math.sin(t)) * k, cy + (Math.cos(a) * rx * Math.sin(t) + Math.sin(a) * ry * Math.cos(t)) * k];
  for (const [w, op, k] of [[120, 0.14, 1.8], [70, 0.2, 1.3]]) p.stroke({ brush: 'soft', color: '#ff8cd8', width: w, opacity: op, points: [E(Math.PI, k), [cx, cy], E(0, k)] });
  for (const k of [1, 0.62]) for (let a = 0; a < 6.283; a += 0.7) p.tryStroke({ ...line, color: mix('#ff9ce0', '#ffe4f8', (Math.sin(a) + 1) / 2), width: k === 1 ? 7 : 5, points: [E(a, k), E(a + 0.4, k), E(a + 0.78, k)] });
  for (let a = 0.3; a < 6.283; a += 1.047) p.tryStroke({ ...line, color: '#ffd0f4', width: 5, taper: [0, 0.7], points: [E(a, 1), E(a, 1.36)] });                         // the points of it
  const up = [Math.sin(t), -Math.cos(t)];
  p.tryStroke({ brush: 'soft', color: '#ff9ce0', width: 20, opacity: 0.4, points: [[cx + up[0] * 90, cy + up[1] * 90], [cx, cy], [cx - up[0] * 66, cy - up[1] * 66]] });
  p.tryStroke({ ...line, color: '#fff0fc', width: 5, taper: [0.6, 0.6], points: [[cx + up[0] * 96, cy + up[1] * 96], [cx, cy], [cx - up[0] * 70, cy - up[1] * 70]] });      // the line of light through it
}

// The mist: it comes out of its mouth and off its body, and goes down and back.
for (let k = 0; k < 9; k++) { const [x, y] = P(r.range(-0.02, 0.2), r.range(-0.2, -0.08)), len = r.range(120, 260); p.stroke({ brush: 'soft', color: mix('#8ca4d8', '#dce8ff', r()), width: r.range(30, 60), opacity: r.range(0.14, 0.26), points: wave(x - len * 0.3, y, x + len * 0.7, y + r.range(10, 60), 8, 1, 6) }); }
for (let k = 0; k < 10; k++) { const [x, y] = P(r.range(0.7, 1.3), r.range(-0.16, 0.16)), len = r.range(200, 400); p.stroke({ brush: 'soft', color: mix('#5c74b0', '#b8ccf8', r()), width: r.range(40, 80), opacity: r.range(0.1, 0.2), points: wave(x - len / 2, y, x + len / 2, y + r.range(-20, 20), 8, 1, 6) }); }

p.save();
