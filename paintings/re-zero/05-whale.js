// The White Whale. It swims in the air, out of the mist, toward the tree and the army. It is
// white, and all of it is covered with fine hair. Its head is a third of it, blunt, with a
// horn on the brow that bends forward, a small yellow eye, and a mouth that goes far back,
// open, with rows of blunt teeth; we see the sky between its jaws. Long thin fins go out from behind its head
// and stream back along it; their ends are red. Its tail has two long flukes. Over its back
// there is a wheel of rose light with a line of light through it: that is what holds it
// in the air. The mist comes from it and goes out behind it.
// The moon is above it and behind it, so its back is bright and its belly is blue shade.
'use strict';
const { studio, open, WHALE, MOONWARD, far, onWhale, skyColor, nC } = require('./scene');
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
// Its mouth is open, and we see it from the side: so between its two jaws there is only the air, and the sky beyond it.
const lip = through([[0, -0.028], [0.08, -0.04], [0.2, -0.054], [0.34, -0.066]]);                                                  // the edge of its upper jaw
const jaw = through([[0.035, -0.188], [0.07, -0.176], [0.16, -0.142], [0.26, -0.1], [0.34, -0.07]]);                               // the top edge of its lower jaw
const chin = through([[0.02, -0.2], [0.03, -0.226], [0.1, -0.238], [0.2, -0.226], [0.3, -0.2], [0.4, -0.166], [0.47, -0.148]]);    // the under side of that jaw and of its throat
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
fin([[0.45, -0.12], [0.55, -0.2], [0.69, -0.245], [0.85, -0.262], [1.01, -0.252]], [16, 34, 27, 15, 5], { dim: 0.8 });

// Its body.
{
  const inside = (x, y) => { const [u, v] = inv(x, y); return u > 0 && u < 1 && v < dorsal(u) && v > (u < 0.34 ? lip(u) : -ventral(u)); };
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
}

// ---------------------------------------------------------------- its head
// Its mouth is open. The lower jaw hangs down from a hinge far back: a deep, heavy jaw with the long grooves of a whale's
// throat under it. We see it from the side, so the sky shows between the jaws. The teeth are blunt blocks, close together, of
// different sizes. We see up into it from below.
const jawTop = (u) => (u < 0.34 ? jaw(Math.max(0.035, u)) : -ventral(u) + 0.012);
const headBox = (() => { const a = P(-0.01, 0.01), b = P(0.5, -0.26), c = P(-0.01, -0.26), d = P(0.5, 0.01); return [Math.min(a[0], c[0]) - 8, Math.min(a[1], d[1]) - 8, Math.max(b[0], d[0]) + 8, Math.max(b[1], c[1]) + 8]; })();
{ // the lower jaw and the throat: dark under, lighter up to the lip, in long grooves
  const inside = (x, y) => { const [u, v] = inv(x, y); return u > 0.02 && u < 0.47 && v > chin(u) && v < jawTop(u); };
  const hide = (x, y) => {
    const [u, v] = inv(x, y), s = clamp((v - chin(u)) / Math.max(0.01, jawTop(u) - chin(u)), 0, 1), groove = Math.sin((s * 6.5 + u * 2) * Math.PI), hair = nC(u * 70, s * 5 + 9) - 0.5;
    let c = mix('#2a3670', '#8c9cd0', smooth(0, 1, s));
    c = mix(c, groove > 0 ? '#a8b6e4' : '#1c2656', Math.abs(groove) * 0.3 * smooth(1, 0.5, s));
    c = mix(c, hair > 0 ? '#ffffff' : '#46568c', Math.abs(hair) * 0.25);
    return tint(mix(c, '#d8b890', smooth(0.45, 0, s) * 0.16));
  };
  const flow = (x, y) => { const [u] = inv(x, y), e = 0.01; return WHALE.turn - Math.atan((chin(u + e) - chin(u - e)) / (2 * e)) + r.range(-0.04, 0.04); };
  p.fill({ inside, bounds: headBox, width: 8, length: 46, spacing: 0.5, angle: flow, color: hide, stroke: { ...line, opacity: 0.97, mix: 0.12 } });
  p.fill({ inside, bounds: headBox, width: 5, length: 26, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => hide(x + r.range(-3, 3), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.85, mix: 0.1, taper: [0.3, 0.5] } });
  for (const k of [0.22, 0.42, 0.62, 0.8]) { const pts = []; for (let u = 0.05; u <= 0.45; u += 0.04) pts.push(P(u, chin(u) + (jawTop(u) - chin(u)) * k)); p.tryStroke({ ...line, color: tint('#1c2656'), width: 5, opacity: 0.42, taper: [0.2, 0.5], points: pts }); }   // the grooves
}
// Between the jaws we see the sky. All that shows of the inside of the mouth is the under side of the upper jaw, a thin band in
// shade, because we look up at it; and a little of the mist that it breathes.
{ const pts = []; for (let u = 0.004; u <= 0.335; u += 0.03) pts.push(P(u, lip(u) - 0.008 * (1 - u * 1.4))); p.tryStroke({ ...line, color: tint('#241a30', 0.5), width: 11, opacity: 0.95, taper: [0.15, 0.6], points: pts }); }
{ // the sky in the gap: the same deep blue as the sky round the whale, so that the open jaws stand clear against it
  const front = (v) => 0.035 * clamp((-0.028 - v) / 0.16, 0, 1);
  const inside = (x, y) => { const [u, v] = inv(x, y); return u < 0.335 && u > front(v) - 0.004 && v < lip(Math.max(0, u)) - 0.012 && v > (u < 0.035 ? -0.19 : jaw(u)) + 0.002; };
  p.fill({ inside, bounds: headBox, width: 8, length: 44, spacing: 0.5, angle: () => r.range(-0.06, 0.02), color: (x, y) => mix(skyColor(x, y), '#16224c', 0.45), stroke: { ...line, opacity: 0.9, mix: 0.2 } });
  for (const [v, w, op] of [[-0.075, 50, 0.3], [-0.105, 64, 0.3], [-0.135, 56, 0.28], [-0.09, 80, 0.2], [-0.12, 90, 0.18]]) p.stroke({ brush: 'soft', color: '#1a2854', width: w, opacity: op, taper: [0.2, 0.7], points: [P(0.1, v + 0.01), P(-0.02, v), P(-0.26 - (w - 50) * 0.002, v - 0.012)] });   // and the same clear air in front of its mouth, so that the gap has no edge
  for (let k = 0; k < 2; k++) { const u0 = r.range(0.1, 0.16), t = r.range(0.35, 0.6), at = (u) => { const lo = jaw(Math.max(0.035, u)), hi = lip(u); return P(u, lo + (hi - lo) * t); }; p.tryStroke({ brush: 'soft', color: '#a8bce8', width: r.range(16, 24), opacity: 0.12, points: [at(u0 - 0.08), at(u0 + 0.04), at(u0 + 0.14)] }); }   // a breath of mist in it
}

// Its teeth: the upper ones hang from the upper jaw, the lower ones stand on the lower jaw. They are wide and blunt, like the teeth of a man.
mark([[0.006, lip(0.006) - 0.004], [0.1, lip(0.1) - 0.005], [0.2, lip(0.2) - 0.005], [0.33, lip(0.33) - 0.003]], '#5c1626', 6, { opacity: 0.9 });                 // the gums
mark([[0.05, jaw(0.05) + 0.004], [0.16, jaw(0.16) + 0.004], [0.26, jaw(0.26) + 0.004], [0.33, jaw(0.33) + 0.002]], '#5c1626', 6, { opacity: 0.9 });
for (let u = 0.014; u < 0.326;) {
  const far = smooth(0.14, 0.34, u), h = Math.max(0.0165, 0.031 * (1 - 0.5 * far) * r.range(0.82, 1.1)), w = Math.min(10.5, h * L / 2.06), top = lip(u) + 0.002, lean = r.range(-0.002, 0.003);
  mark([[u, top], [u + lean, top - h]], mix(mix('#b8bcd4', '#d4d6e6', r()), '#5a6088', far * 0.55), w, { cap: 'flat', rag: 0.05 });
  if (h * L > 17) mark([[u + lean * 0.6 - 0.002, top - h + 0.0165], [u + lean - 0.002, top - h + 0.001]], '#f6f6ff', 4, { opacity: 0.55 * (1 - far) });   // the light on the end of it
  u += (w + r.range(2.5, 4.5)) / L;
}
for (let u = 0.05; u < 0.318;) {
  const far = smooth(0.14, 0.34, u), h = Math.max(0.0165, 0.028 * (1 - 0.5 * far) * r.range(0.82, 1.1)), w = Math.min(10, h * L / 2.06), base = jaw(u) - 0.002;
  mark([[u, base], [u - 0.34 * h + r.range(-0.002, 0.002), base + 0.94 * h]], mix(mix('#a8acc8', '#c8cade', r()), '#4c5280', far * 0.55), w, { cap: 'flat', rag: 0.05 });
  if (h * L > 17) mark([[u - 0.34 * h - 0.002, base + 0.94 * h - 0.0005], [u - 0.2 * h - 0.002, base + 0.94 * h - 0.0165]], '#f0f0fc', 4, { opacity: 0.45 * (1 - far) });
  u += (w + r.range(2.5, 4.5)) / L;
}
// Its lips: the hide turns under at the edge of the upper jaw, so there is shade over that edge; the top of the lower jaw takes a little light.
{ const pts = []; for (let u = 0.0; u <= 0.345; u += 0.03) pts.push(P(u, lip(u) + 0.016)); p.tryStroke({ brush: 'soft', color: tint('#46568e'), width: 22, opacity: 0.5, points: pts }); p.tryStroke({ ...line, color: tint('#4a5890'), width: 6, opacity: 0.6, points: pts.map(([x, y], i) => [x, y + 9]) }); }
{ const pts = []; for (let u = 0.04; u <= 0.34; u += 0.03) pts.push(P(u, jaw(u) - 0.007)); glint(p, pts, () => tint(mix('#b8c6ee', '#e8eeff', r())), { width: 5, dash: 44, gap: 8, opacity: 0.75, rng: r }); }
for (const [du, dv, k] of [[0.012, 0.012, 1], [0.03, -0.006, 0.9], [0.04, -0.03, 0.8]]) mark([[0.335 + du * 0.2, -0.066 + dv * 0.2], [0.34 + du, -0.07 + dv], [0.345 + du * 1.5, -0.085 + dv * 1.6 - 0.02]], '#3c4a84', 5, { opacity: 0.5 * k, taper: [0.2, 0.7] });   // the folds at the hinge of its jaw
// Its eye: small for such a head, yellow, with a dark slit, deep under a heavy brow, in wrinkled hide.
{
  const eu = 0.288, ev = 0.004;
  p.tryStroke({ brush: 'soft', color: tint('#2a366c'), width: 34, opacity: 0.55, points: poly([[eu - 0.05, ev - 0.004], [eu, ev - 0.002], [eu + 0.05, ev - 0.006]]) });   // the hollow that it lies in
  mark([[eu - 0.015, ev], [eu + 0.015, ev - 0.001]], '#deb42c', 10.5, { cap: 'round', rag: 0 });                                         // the eye
  mark([[eu - 0.013, ev + 0.004], [eu + 0.004, ev + 0.004]], '#fff0a0', 4, { opacity: 0.8 });                                            // the moon in it
  mark([[eu + 0.001, ev + 0.009], [eu + 0.001, ev - 0.0075]], '#07070f', 5.2, { cap: 'round' });                                          // its dark slit
  mark([[eu - 0.03, ev + 0.003], [eu - 0.012, ev + 0.0125], [eu + 0.012, ev + 0.0125], [eu + 0.03, ev + 0.004]], '#5a6aa6', 8, { cap: 'round' });   // the upper lid: heavy, low over it
  mark([[eu - 0.034, ev + 0.014], [eu - 0.012, ev + 0.024], [eu + 0.014, ev + 0.024], [eu + 0.036, ev + 0.014]], '#dfe6fb', 6, { cap: 'round', opacity: 0.7 });   // the brow over it, in the moon
  mark([[eu - 0.026, ev - 0.006], [eu - 0.008, ev - 0.012], [eu + 0.012, ev - 0.0115], [eu + 0.028, ev - 0.005]], '#44538c', 5.5, { cap: 'round' });   // the lower lid
  mark([[eu - 0.032, ev - 0.016], [eu - 0.006, ev - 0.024], [eu + 0.022, ev - 0.02]], '#5868a2', 4.6, { opacity: 0.6, taper: [0.3, 0.5] });          // wrinkles under it
  mark([[eu + 0.034, ev + 0.012], [eu + 0.05, ev - 0.002], [eu + 0.054, ev - 0.02]], '#5868a2', 4.6, { opacity: 0.55, taper: [0.3, 0.5] });          // and behind it
}
// Its horn: on its brow, thick, bent forward and up, with rings round it.
shape(p, poly([[0.03, 0.098], [0.01, 0.16], [-0.018, 0.224], [-0.05, 0.28], [-0.008, 0.238], [0.034, 0.186], [0.084, 0.128]]), white, { light: MOONWARD, turn: 0.1, width: 6, length: 24, vary: 0.06, dash: 26, gap: 8, edgeOpacity: 0.9 });
for (const [u0, v0, u1, v1] of [[0.018, 0.146, 0.06, 0.16], [-0.002, 0.186, 0.034, 0.198], [-0.022, 0.224, 0.006, 0.234]]) mark([[u0, v0], [u1, v1]], '#6c7cb4', 4.6, { opacity: 0.7 });

// The fins of its near side: long, wide where they leave it and thin at their ends, streaming back along it.
fin([[0.41, -0.13], [0.48, -0.245], [0.59, -0.33], [0.73, -0.378], [0.9, -0.398]], [18, 40, 33, 19, 5]);
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
for (let k = 0; k < 6; k++) { const [x, y] = P(r.range(-0.04, 0.2), r.range(-0.32, -0.24)), len = r.range(120, 260); p.stroke({ brush: 'soft', color: mix('#8ca4d8', '#dce8ff', r()), width: r.range(30, 60), opacity: r.range(0.14, 0.26), points: wave(x - len * 0.3, y, x + len * 0.7, y + r.range(10, 60), 8, 1, 6) }); }
for (let k = 0; k < 10; k++) { const [x, y] = P(r.range(0.7, 1.3), r.range(-0.16, 0.16)), len = r.range(200, 400); p.stroke({ brush: 'soft', color: mix('#5c74b0', '#b8ccf8', r()), width: r.range(40, 80), opacity: r.range(0.1, 0.2), points: wave(x - len / 2, y, x + len / 2, y + r.range(-20, 20), 8, 1, 6) }); }

p.save();
