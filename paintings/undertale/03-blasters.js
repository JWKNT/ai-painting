// The skulls that Sans calls. Each is the skull of no beast that lives: it is wide like a
// shield, with a point at its top, two horns, fins at its cheeks, a dark split down its
// brow to a round hole for a nose, and two great eye holes in which a light burns. Its
// lower jaw is in two halves, which open to the sides. The one at the left has opened
// its jaws and fires: a bar of white light as wide as its mouth goes down across the
// hall. The one at the right has opened, and the light comes together in its mouth.
// They are the white of old bone. The windows are behind them, so their faces are in a
// soft violet shade, with white on their top edges, and the cold light of their own fire
// is on their jaws.
'use strict';
const { studio, open, W, H, BLASTERS, nA } = require('./scene');
const { mix, smooth, glow, shape, glint } = studio;

const p = open('blasters');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.06, dry: 0, rag: 0.06, cap: 'round' };
const BONE = { shadow: '#8074a8', half: '#c6bcda', lit: '#fffbf2', rim: '#ffffff', bounce: '#b4e2ff' };
const EDGE = '#74689e', DARK = '#1a1430';                 // EDGE is the shade under a tooth or a horn

const half = [[0, -1.12], [0.09, -0.86], [0.40, -0.88], [0.76, -0.80], [0.93, -0.56], [0.98, -0.28], [0.92, -0.04], [1.18, 0.10], [0.88, 0.16], [0.80, 0.30], [0.98, 0.44], [0.72, 0.40], [0.58, 0.46], [0.34, 0.50], [0.12, 0.53]];
const CRANIUM = half.concat([[0, 0.53]], half.slice(1).reverse().map(([u, v]) => [-u, v]));
const JAW = [[0.62, 0.44], [0.82, 0.40], [0.76, 0.66], [0.56, 0.92], [0.34, 1.08], [0.10, 1.12], [0.08, 0.94], [0.26, 0.84], [0.42, 0.66], [0.50, 0.50]];
const HINGE = [0.76, 0.38];

function blaster(b) {
  const len = Math.hypot(b.aim[0] - b.x, b.aim[1] - b.y), d = [(b.aim[0] - b.x) / len, (b.aim[1] - b.y) / len], s = b.s;
  const T = ([u, v]) => [b.x + s * (u * d[1] + v * d[0]), b.y + s * (-u * d[0] + v * d[1])];
  const local = (x, y) => { const du = (x - b.x) / s, dv = (y - b.y) / s; return [du * d[1] - dv * d[0], du * d[0] + dv * d[1]]; };
  const flow = Math.atan2(d[1], d[0]);
  const box = (pts) => { const q = pts.map(T); return [Math.min(...q.map((a) => a[0])) - 8, Math.min(...q.map((a) => a[1])) - 8, Math.max(...q.map((a) => a[0])) + 8, Math.max(...q.map((a) => a[1])) + 8]; };
  const dark = (inside, pts, w = 6) => p.fill({ inside: (x, y) => inside(...local(x, y)), bounds: box(pts), width: w, length: 20, spacing: 0.45, overlap: 0.6, angle: () => flow + r.range(-0.2, 0.2), color: () => mix(DARK, '#2a2244', r() * 0.5), stroke: { ...line, opacity: 0.98 } });
  // a jaw half, turned out on its hinge
  const jaw = (side) => JAW.map(([u, v]) => { const a = -b.open, du = u - HINGE[0], dv = v - HINGE[1]; return [side * (HINGE[0] + du * Math.cos(a) - dv * Math.sin(a)), HINGE[1] + du * Math.sin(a) + dv * Math.cos(a)]; });
  const mouth = T([0, 0.6]);

  // ------------------------------------------------ the dark of its open mouth
  dark((u, w) => Math.abs(u) < 0.62 - (w - 0.4) * 0.25 && w > 0.38 && w < 0.7, [[-0.7, 0.3], [0.7, 0.3], [0.7, 0.76], [-0.7, 0.76]], 8);

  // ------------------------------------------------ the beam
  if (b.fire) {
    const hw = 0.4 * s, far = 1300, n = [d[1], -d[0]], at = (t, o) => [mouth[0] + d[0] * t + n[0] * o, mouth[1] + d[1] * t + n[1] * o];
    for (const o of [-1, 1]) for (const [w, op, k] of [[100, 0.1, 1.3], [54, 0.16, 1.06]]) p.stroke({ brush: 'soft', color: '#c4f0ff', width: w, opacity: op, points: [at(-10, o * hw * k), at(far / 2, o * hw * k), at(far, o * hw * k)] });
    const inBeam = (x, y) => { const dx = x - mouth[0], dy = y - mouth[1], t = dx * d[0] + dy * d[1], o = Math.abs(dx * n[0] + dy * n[1]); return t > s * 0.06 && o < hw * (1 + 0.04 * Math.sin(t / 37)) * smooth(s * 0.02, s * 0.3, t) ; };
    p.fill({ inside: inBeam, bounds: [0, 0, W, H], width: 14, length: 220, spacing: 0.45, overlap: 0.6, angle: () => flow + r.range(-0.006, 0.006), color: (x, y) => { const o = Math.abs((x - mouth[0]) * n[0] + (y - mouth[1]) * n[1]) / hw; return mix(mix('#ffffff', '#cdf4ff', smooth(0.5, 1, o)), '#f4fdff', (nA(x / 40, y / 40) - 0.5) * 0.3); }, stroke: { ...line, rag: 0.04, opacity: 0.97 } });
    for (let k = 0; k < 30; k++) { const o = r.range(-0.94, 0.94) * hw, t0 = r.range(0, far - 300), l = r.range(120, 320); p.tryStroke({ brush: 'round', color: Math.abs(o) > hw * 0.6 ? '#98e2ff' : '#ffffff', width: r.range(4, 6), opacity: r.range(0.4, 0.8), taper: [0.5, 0.5], points: [at(t0, o), at(t0 + l, o)] }); }
  } else {
    // the light that comes together in the mouth of one that has not fired yet
    for (const [w, op] of [[s * 1.0, 0.1], [s * 0.6, 0.2], [s * 0.34, 0.4]]) glow(p, mouth[0], mouth[1], w, '#d8f8ff', op, 8);
    glow(p, mouth[0], mouth[1], s * 0.16, '#ffffff', 0.9, 8);
    for (let k = 0; k < 16; k++) { const a = r.range(0, Math.PI * 2), r0 = s * r.range(0.55, 0.9), r1 = s * r.range(0.18, 0.3); p.tryStroke({ brush: 'round', color: '#e8fbff', width: 4, opacity: r.range(0.4, 0.8), taper: [0.8, 0], points: [[mouth[0] + Math.cos(a) * r0, mouth[1] + Math.sin(a) * r0], [mouth[0] + Math.cos(a) * r1, mouth[1] + Math.sin(a) * r1]] }); }
  }

  // ------------------------------------------------ its horns
  for (const side of [-1, 1]) {
    const h = [[side * 0.54, -0.8], [side * 0.76, -0.95], [side * 0.86, -1.12], [side * 0.76, -1.26]].map(T);
    p.tryStroke({ ...line, mix: 0, color: EDGE, width: Math.max(12, s * 0.13), taper: [0, 0.85], points: h });
    p.tryStroke({ ...line, mix: 0, color: BONE.half, width: Math.max(8, s * 0.09), taper: [0, 0.85], points: h });
    glint(p, h.map(([x, y]) => [x + 1, y - 3]), BONE.rim, { width: 4.2, dash: 40, gap: 4, opacity: 0.9, rng: r });
  }
  // ------------------------------------------------ the top of the skull
  const opts = { light: [0.2, -1], width: 8, length: 34, flow: () => flow + Math.PI / 2 + r.range(-0.5, 0.5), gain: 1.2, rim: 0.9, bounce: 0.55, edgeWidth: 5, edgeOpacity: 0.95, dash: 46, gap: 5, vary: 0.03, margin: 2, turn: -0.1, mix: 0.45, round: s * 0.5 };
  p.tryStroke({ ...line, mix: 0, color: BONE.half, width: 10, points: CRANIUM.concat([CRANIUM[0]]).map(T) });                       // bone right out to the edge
  shape(p, CRANIUM.map(T), BONE, opts);
  // ------------------------------------------------ its features: the split down the brow, the nose, the eye holes, the cracks under them
  p.tryStroke({ ...line, mix: 0, color: DARK, width: Math.max(8, s * 0.075), taper: [0.75, 0], points: [T([0, -0.82]), T([0, -0.4]), T([0, 0.04])] });
  dark((u, v) => Math.pow(u / 0.095, 2) + Math.pow((v - 0.16) / 0.12, 2) < 1, [[-0.1, 0.02], [0.1, 0.02], [0.1, 0.3], [-0.1, 0.3]]);
  const TILT = 0.35;
  dark((u, v) => { const a = Math.abs(u) - 0.43, c = v + 0.17, ru = a * Math.cos(TILT) + c * Math.sin(TILT), rv = -a * Math.sin(TILT) + c * Math.cos(TILT); return Math.pow(ru / 0.21, 2) + Math.pow(rv / 0.2, 2) < 1 && rv > -0.13; }, [[-0.7, -0.44], [0.7, -0.44], [0.7, 0.12], [-0.7, 0.12]], 7);
  for (const side of [-1, 1]) {
    p.tryStroke({ ...line, mix: 0, color: DARK, width: Math.max(5, s * 0.035), taper: [0, 0.6], points: [T([side * 0.36, 0.06]), T([side * 0.34, 0.26]), T([side * 0.3, 0.44])] });
    p.tryStroke({ ...line, mix: 0, color: DARK, width: Math.max(5, s * 0.035), taper: [0, 0.6], points: [T([side * 0.55, 0.04]), T([side * 0.58, 0.2]), T([side * 0.57, 0.34])] });
    // the light in the eye hole: small, in the dark of the hole
    const e = T([side * 0.42, -0.15]);
    glow(p, e[0], e[1], s * 0.2, '#6cdcff', 0.22, 8);
    glow(p, e[0], e[1], Math.max(9, s * 0.07), '#ffffff', 0.95, 8);
    // the ridge of bone over the eye, which comes down toward the nose
    p.tryStroke({ ...line, mix: 0, color: '#8a7eb0', width: Math.max(6, s * 0.045), opacity: 0.8, taper: [0.6, 0.2], points: [T([side * 0.72, -0.5]), T([side * 0.44, -0.44]), T([side * 0.2, -0.3])] });
  }
  // a few cracks in the old bone
  for (const [a0, a1, a2] of [[[0.3, -0.84], [0.36, -0.68], [0.3, -0.58]], [[-0.62, -0.76], [-0.56, -0.62], [-0.66, -0.52]], [[0.78, -0.2], [0.7, -0.08], [0.76, 0.02]]]) p.tryStroke({ brush: 'round', color: '#7a6ea4', width: 4, opacity: 0.6, taper: [0.2, 0.7], points: [T(a0), T(a1), T(a2)] });
  // ------------------------------------------------ the two halves of its jaw
  for (const side of [-1, 1]) { const J = jaw(side).map(T); p.tryStroke({ ...line, mix: 0, color: BONE.half, width: 9, points: J.concat([J[0]]) }); shape(p, J, BONE, { ...opts, flow: undefined, round: s * 0.14 });
    glint(p, [J[5], J[6], J[7], J[8], J[9]], '#c4ecff', { width: 4.6, dash: 50, gap: 3, opacity: 0.9, rng: r }); }       // the cold light on the inner edge of the jaw
  // ------------------------------------------------ its teeth: long ones down from the top jaw, short ones on each half of the lower jaw. They are dark against the light.
  const tooth = (a, c, w) => { p.tryStroke({ ...line, mix: 0, color: EDGE, width: w + 3, taper: [0, 0.85], points: [T(a), T(c)] }); p.tryStroke({ ...line, mix: 0, color: BONE.lit, width: w, taper: [0, 0.85], points: [T(a), T(c)] }); };
  for (const u of [-0.52, -0.32, -0.12, 0.12, 0.32, 0.52]) tooth([u, 0.49 - Math.abs(u) * 0.1], [u * 1.04, 0.72 - Math.abs(u) * 0.14], Math.max(10, s * 0.085));
  for (const side of [-1, 1]) { const J = jaw(side); for (const [i, k] of [[9, 0.5], [8, 0.4], [7, 0.5]]) { const a0 = J[i], a1 = J[(i + 9) % 10], m = [a0[0] + (a1[0] - a0[0]) * k, a0[1] + (a1[1] - a0[1]) * k]; tooth(m, [m[0] - side * 0.12, m[1] - 0.14], Math.max(8, s * 0.06)); } }
}
BLASTERS.slice().sort((a, b) => (a.fire ? 1 : 0) - (b.fire ? 1 : 0)).forEach(blaster);

p.save();
