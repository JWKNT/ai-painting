// Shared layout, palette and brush habits for the Made in Abyss painting.
//
// The scene: the sixth layer of the Abyss, the Capital of the Unreturned. Riko, Reg and
// Nanachi stand on a ledge above the plain and look at it. The ruins of the golden city are
// all round them, and nothing in it stands straight: towers lean, lie on their sides and hang
// point down out of the haze overhead, all of them grown over with a pale crust like coral.
// At the right is the village of the hollows: a living thing as big as a hill, a twisted
// trunk that holds up a great cap. It is so big that the cap goes out of the picture, and we
// look up at the under side of it. The light of the Abyss comes down the middle through the
// haze, so everything is pale: cream and gold, rose where the rock is bare, green where there
// is moss, and violet only in the shadows close to us.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, clamp, smooth, glint } = studio;

const W = 1600, H = 1000;
const EYE = 640;                           // the eye line: we look up at what is above it and down on what is below it
const SHAFT = { x: 720, lean: 0.16, half: 150 };   // the brightest of the light: where it would meet the top edge, how it slants, how wide it is
const GROUND = 690;                        // the far edge of the plain
// The village: its axis, the foot of its trunk, the middle of the under side of its cap, how
// far the cap reaches, how flat the circle of its rim looks from here, how high its dome goes.
const VILLAGE = { x: 1284, foot: 806, under: 318, reach: 530, flat: 0.24, dome: 520 };
const RIKO = { x: 704, y: 936 }, REG = { x: 786, y: 942 }, NANACHI = { x: 878, y: 938 };

const nA = noise2(711), nB = noise2(727), nC = noise2(743);

// How much of the shaft of light lies on a place.
const shaft = (x, y) => Math.exp(-Math.pow((x - (SHAFT.x + y * SHAFT.lean)) / (SHAFT.half + y * 0.12), 2));
// Toward the light from a place: up, and in toward the shaft.
const lightAt = (x, y) => { const lx = (SHAFT.x - x) * 0.9, ly = -(y + 760), k = Math.hypot(lx, ly); return [lx / k, ly / k]; };
// The air: a bright haze, cream overhead and in the shaft, warmer and a little darker toward the sides and the ground.
function air(x, y) {
  const side = Math.pow(Math.abs(x - 800) / 800, 2), low = smooth(300, 900, y);
  let c = mix(mix('#fbf4dc', '#eedcba', side * 0.9), '#e2c8a8', low * 0.55);
  c = mix(c, '#fffbe8', shaft(x, y) * 0.75);
  return mix(c, '#d9b8a4', (nA(x / 420, y / 260) - 0.5) * 0.24 + 0.06);
}
// What the haze does to a thing at a distance: d is 0 close to us and 1 very far off.
const far = (color, x, y, d) => mix(color, air(x, y), clamp(d, 0, 1) * 0.9);

// The stone of the city, under its crust: pale gold where the light is on it, mauve in shadow.
const STONE = { lit: '#f0e0bc', half: '#cdb090', shade: '#9a7c80', deep: '#66506a', bounce: '#d2b4a0' };
const CRUST = ['#fff8e4', '#f4e8cc', '#ead8bc', '#f8e0d4'];
const MOSS = ['#6f9a58', '#8cb46a', '#a8c47c', '#577c50'];

// A turned thing: a tower of the city, a column, a dome, the trunk of the village. It is
// round about the line from a to b, and prof gives its radius along that line: [[t, r], ...]
// with t from 0 at a to 1 at b. It is painted in lanes that run along it and follow its
// swell, closer together toward its edges as on any round thing. Each piece of a lane takes
// its tone from how that place faces the light. Then come its rings, its windows, the crust
// on the places that face up, the threads that hang from the places that face down, its
// horns, and its point or its broken end.
//   d        how far off it is, 0 to 1
//   light    [lx, ly] toward the light; front: how much of the light comes from our side
//   tones    { lit, half, shade, deep, bounce }
//   twist    how far its lanes wind round it between a and b, in radians
//   lump     how far its outline wanders from true
//   rings    [[t, out, wide], ...] bands round it, out times as wide as it is there
//   bow      how far a ring bows along the line, in radii (found from the eye line if not given)
//   windows  [[t, n, tall], ...] rows of small openings
//   crust, threads, horns, moss, hang: how much of each
//   tint     (t, angle, lane, tone) => a color mixed into the lane by tintBy
//   tip      the length of a horn that goes on from b; broken: b is a broken end
function turned(p, a, b, prof, d, o = {}) {
  const r = p.rng, dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const seed = o.seed || 0, T = o.tones || STONE, L = o.light || lightAt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2), lz = o.front != null ? o.front : 0.45;
  const k3 = Math.hypot(1, lz), Lu = (L[0] * ux + L[1] * uy) / k3, Ln = (L[0] * nx + L[1] * ny) / k3, Lf = lz / k3;
  const detail = o.detail != null ? o.detail : clamp(1.1 - d, 0.1, 1), lump = o.lump || 0, twist = o.twist || 0;
  const R0 = (t) => {
    t = clamp(t, 0, 1);
    let i = 0;
    while (i < prof.length - 2 && prof[i + 1][0] < t) i++;
    const [t0, r0] = prof[i], [t1, r1] = prof[i + 1];
    return r0 + (r1 - r0) * (0.5 - 0.5 * Math.cos(Math.PI * clamp((t - t0) / (t1 - t0 || 1), 0, 1)));
  };
  const R = (t, th) => R0(t) * (1 + lump * 2 * (nC(Math.sin(th) * 2.3 + seed, t * len / 150 + seed) - 0.5));
  const at = (t, off) => [a[0] + dx * t + nx * off, a[1] + dy * t + ny * off];
  const P = (t, th) => at(t, R(t, th) * Math.sin(th));
  // How a place on it faces the light (lam, from -1 to 1) and how much it faces up.
  const facing = (t, th) => {
    const e = 3 / len, dr = (R0(t + e) - R0(t - e)) / (2 * e * len), k = Math.hypot(1, dr);
    return { lam: (Math.sin(th) * Ln + Math.cos(th) * Lf - dr * Lu) / k, up: -(ny * Math.sin(th) - uy * dr) / k };
  };
  const tone = (t, th, lane) => {
    const v = 0.5 + 0.5 * facing(t, th).lam + (nB(t * len / 64 + seed, th * 1.7 + seed) - 0.5) * (o.grain != null ? o.grain : 0.18) + (o.lift || 0);
    let c = v < 0.36 ? mix(T.deep, T.shade, clamp(v / 0.36, 0, 1)) : v < 0.64 ? mix(T.shade, T.half, (v - 0.36) / 0.28) : mix(T.half, T.lit, clamp((v - 0.64) / 0.3, 0, 1));
    if (T.bounce && v < 0.5) c = mix(c, T.bounce, smooth(0.75, 1, Math.abs(Math.sin(th))) * 0.55);
    if (o.tint) c = mix(c, o.tint(t, th, lane, v), o.tintBy != null ? o.tintBy : 0.5);
    return c;
  };
  // its lanes
  const big = Math.max(...prof.map((q) => q[1])), lanes = o.lanes || clamp(Math.round(big * 2 / (o.lane || 10)), 3, 34), all = twist ? lanes * 2 : lanes;
  const step = clamp((o.piece || 56) / len, 0.015, 0.5), e = 2 / len, between = twist ? Math.PI * 2 / all : 2.76 / lanes;
  const stroke = { brush: 'bristle', opacity: o.opacity != null ? o.opacity : 0.95, mix: o.mix != null ? o.mix : 0.2, dry: 0.04, rag: 0.16, cap: 'flat', streak: 0.3, jitter: 0.4 };
  for (let i = 0; i < all; i++) {
    const th0 = twist ? -Math.PI + (i + 0.5) / all * Math.PI * 2 : -1.38 + 2.76 * (i + 0.5) / lanes;
    for (let t0 = -r() * step * 0.5; t0 < 1; t0 += step) {
      let ta = Math.max(0, t0), tb = Math.min(1, t0 + step);
      const tm = (ta + tb) / 2, thM = th0 + twist * tm;
      if (tb - ta < 0.15 * step || (twist && Math.cos(thM) < 0.1)) continue;                 // a scrap, or round the far side
      const rm = R0(tm), gap = rm * Math.cos(thM) * between, thin = rm * 2 < 9;
      if (thin ? Math.abs(Math.sin(thM)) > between * 0.6 : gap < 1.6 && i % 2) continue;      // where it is too thin for lanes, one stroke down its middle
      const width = thin ? Math.max(4.8, rm * 2) : Math.max(4.8, gap * (o.lap || 1.8)), need = 2.15 * width / len;
      if (tb - ta < need) { if (ta <= 0) tb = Math.min(1, ta + need); else ta = Math.max(0, tb - need); }
      const [x, y] = P(tm, thM);
      p.tryStroke({ ...stroke, color: far(tone(tm, thM, i), x, y, d), width, points: [P(ta - e, th0 + twist * ta), [x, y], P(tb + e, th0 + twist * tb)] });
    }
  }
  // its rings: each has its shadow on the side away from the light, its band, and light on its edge
  // A ring that is above the eye line bows up in its middle, and one below it bows down.
  const bowAt = (t) => (o.bow != null ? o.bow : (EYE - (a[1] + dy * t)) / 1385 * -uy * 1.5), sgn = Lu >= 0 ? 1 : -1;
  for (const [t, out = 1.1, wide] of o.rings || []) {
    const rr = R0(t) * out, w = Math.max(4.8, wide || Math.min(18, rr * 0.16)), [cx, cy] = at(t, 0), bow = bowAt(t);
    const ring = (along, s0, s1) => { const pts = []; for (let k = 0; k <= 8; k++) { const s = s0 + (s1 - s0) * k / 8; pts.push(at(t + (along + bow * rr * Math.sqrt(Math.max(0, 1 - s * s))) / len, rr * s)); } return pts; };
    p.tryStroke({ ...stroke, rag: 0.1, color: far(T.deep, cx, cy, d), width: w, opacity: 0.35 + 0.3 * detail, points: ring(-sgn * w * 0.8, -0.95, 0.95) });
    const parts = clamp(Math.floor(rr * 2 / (2.3 * w)), 1, 5);
    for (let k = 0; k < parts; k++) {
      const s0 = -1 + 2 * k / parts, s1 = s0 + 2 / parts, th = Math.asin(clamp((s0 + s1) / 2, -1, 1));
      p.tryStroke({ ...stroke, color: far(mix(tone(t, th, -1), T.lit, 0.28), ...at(t, rr * (s0 + s1) / 2), d), width: w, points: ring(0, Math.max(-1, s0 - 0.04), Math.min(1, s1 + 0.04)) });
    }
    if (detail > 0.3) glint(p, ring(sgn * w * 0.5, -0.88, 0.88), () => far('#fff8e0', cx, cy, d), { width: 4, dash: 22, gap: 12, opacity: 0.25 + 0.45 * detail, rng: r });
  }
  // its windows
  for (const [t, n, tall] of o.windows || []) {
    const l = Math.max(12.6, tall || 15);
    for (let j = 0; j < n; j++) {
      const th = -1.15 + 2.3 * (j + r.range(0.25, 0.75)) / n;
      if (r() < 0.22) continue;
      const A = P(t - l / 2 / len, th), B = P(t + l / 2 / len, th);
      p.tryStroke({ brush: 'bristle', color: far(mix(T.deep, '#3a2a40', 0.5 * detail), A[0], A[1], d), width: Math.max(4.6, Math.min(8, R0(t) * 2.3 / n * 0.42) * Math.cos(th)), opacity: (0.3 + 0.5 * detail) * (facing(t, th).lam > 0 ? 1 : 0.7), mix: 0.15, dry: 0.03, rag: 0.1, cap: 'round', points: [A, B] });
    }
  }
  // the crust, on the places that face up; at the edge it is heaped, so that the outline is broken
  for (let k = 0; k < Math.round((o.crust != null ? o.crust : 1) * len * big / 420 * detail); k++) {
    const t = r(), th = r.range(-1.5, 1.5), f = facing(t, th);
    if (f.up < 0.25 + r() * 0.45) continue;
    const out = Math.abs(Math.sin(th)) > 0.9 ? r.range(1, 1.07) : 1, [x, y] = at(t, R(t, th) * Math.sin(th) * out), ang = r.range(0, Math.PI), l = r.range(12.4, 20) * (0.7 + 0.5 * detail);
    p.tryStroke({ brush: 'bristle', color: far(r() < (o.moss != null ? o.moss : 0.14) ? r.pick(MOSS) : mix(r.pick(CRUST), T.half, f.lam < 0 ? 0.35 : 0), x, y, d * 0.92), width: Math.max(4.8, r.range(5, 9.5) * (0.6 + 0.5 * detail)), opacity: 0.92, mix: 0.1, dry: 0.05, rag: 0.4, cap: 'round', points: [[x - Math.cos(ang) * l / 2, y - Math.sin(ang) * l / 2], [x + Math.cos(ang) * l / 2, y + Math.sin(ang) * l / 2]] });
  }
  // the threads, straight down from the places that face down
  for (let k = 0; k < Math.round((o.threads != null ? o.threads : 1) * len / 50 * detail); k++) {
    const t = r(), th = r.pick([-1, 1]) * r.range(0.8, 1.45), f = facing(t, th);
    if (f.up > -0.2) continue;
    const [x, y] = P(t, th), l = r.range(16, 70) * (0.5 + detail) * (o.hang || 1);
    p.tryStroke({ brush: 'bristle', color: far(mix(T.deep, T.half, r() * 0.7), x, y, d), width: r.range(4.6, 6.2), opacity: 0.5 + 0.35 * detail, taper: [0, 0.8], mix: 0.1, dry: 0.05, rag: 0.2, points: [[x, y - 2], [x + r.range(-4, 4), y + l * 0.5], [x + r.range(-7, 7), y + l]] });
  }
  // its horns: thin, bent, out from its sides
  const horn = (x, y, ang, l, w) => {
    const bend = r.pick([-1, 1]) * r.range(0.35, 0.9), pts = [[x, y], [x + Math.cos(ang) * l * 0.5, y + Math.sin(ang) * l * 0.5], [x + Math.cos(ang + bend) * l, y + Math.sin(ang + bend) * l]];
    p.tryStroke({ brush: 'bristle', color: far(mix(T.half, T.shade, r()), x, y, d), width: Math.max(4.8, w), taper: [0, 0.92], mix: 0.1, dry: 0.04, rag: 0.12, cap: 'round', points: pts });
    if (detail > 0.5) glint(p, pts.map(([px, py]) => [px + L[0] * 2, py + L[1] * 2]), () => far('#fff6dc', x, y, d), { width: 4, dash: 18, gap: 14, opacity: 0.55, rng: r });
  };
  for (let k = 0; k < (o.horns || 0); k++) {
    const t = r.range(0.08, 0.9), side = r() < 0.5 ? -1 : 1, [x, y] = P(t, side * 1.5);
    horn(x, y, Math.atan2(ny * side, nx * side) + r.range(-0.6, 0.6), clamp(R0(t) * r.range(1, 2.4), 30, 110), Math.min(9, R0(t) * 0.12));
  }
  if (o.tip) horn(b[0] - ux * 4, b[1] - uy * 4, Math.atan2(uy, ux) + r.range(-0.15, 0.15), o.tip, Math.max(5, R0(0.97) * 1.6));
  // a broken end: jags of different lengths
  if (o.broken) {
    const rb = R0(1);
    for (let k = 0; k < Math.max(3, Math.round(rb / 6)); k++) {
      const s = r.range(-0.95, 0.95), l = Math.max(13, rb * r.range(0.2, 0.8)), w = Math.max(4.8, Math.min(l / 2.2, rb * 0.24));
      p.tryStroke({ ...stroke, color: far(tone(1, Math.asin(s), -1), ...at(1, rb * s), d), width: w, points: [at(1 - 4 / len, rb * s), at(1 + l / len, rb * s)] });
    }
  }
  return { at, P, R: R0, tone, facing };
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, EYE, SHAFT, GROUND, VILLAGE, RIKO, REG, NANACHI, nA, nB, nC, shaft, lightAt, air, far, STONE, CRUST, MOSS, turned };
