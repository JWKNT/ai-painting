// The crystals behind the hill of flowers: long six-sided rods of clear stone, as thick as a
// man is wide, that go out to both sides like the rays of a sun. We see through them: each
// takes the color of what is behind it. The sun is at the right, so the rods at our left have
// one bright side and one dark, and the ends of the rods at our right are white with light.
'use strict';
const { studio, open, W, at, unit, sunOn, RAYS, PRISMS, seeHeap, inBed, nB } = require('./scene');
const { mix, clamp, smooth, lerp, inPoly } = studio;

const p = open('crystals');
const r = p.rng;
const C = at(RAYS.X, RAYS.Y, RAYS.Z), K = unit(RAYS.Z);                    // the middle that they go out from, and units of the picture to the metre there
const hidden = (x, y) => (!!seeHeap(x, y) && !!seeHeap(x + (x < 800 ? -30 : 30), y)) || inBed(x, y, 0.94);

function prism(q) {
  const s = q.side, ca = Math.cos(q.a), sa = Math.sin(q.a);
  const dir = [s * ca, -sa], up = [s * -sa * -1 * s, -ca];                 // along it, and across it toward its upper side (in the picture)
  // across it: v from -1 (its lower edge) to 1 (its upper edge); along it: d in metres from the middle
  const P = (d, v) => [C[0] + dir[0] * d * K + (s > 0 ? -sa : sa) * v * q.T * K * 0.58, C[1] + dir[1] * d * K - ca * v * q.T * K * 0.58];
  // its three faces that we see, and how fully the sun is on each
  const U = [s > 0 ? -sa : sa, ca, 0], V = [0, 0, -1];
  const n = (psi) => [Math.cos(psi) * U[0] + Math.sin(psi) * V[0], Math.cos(psi) * U[1], Math.sin(psi) * V[2]];
  const faces = [{ v0: 0.5, v1: 1, sun: sunOn(n(Math.PI / 6)) }, { v0: -0.5, v1: 0.5, sun: sunOn(n(Math.PI / 2)) }, { v0: -1, v1: -0.5, sun: sunOn(n(5 * Math.PI / 6)) }];
  const endSun = sunOn([s * ca, sa, 0]);
  const slant = 0.35 * q.T * (s > 0 ? 1 : -1);                             // its end is cut at a slant
  const tone = (sun, x, y, k = 1) => {
    const behind = p.sample(clamp(x, 0, W - 1), clamp(y, 0, 999));
    return sun > 0 ? mix(mix(behind, '#9cc4ee', 0.35), '#fffaf0', smooth(0, 0.95, sun) * 0.92 * k) : mix(mix(behind, '#2c5aa6', 0.5), '#16346c', clamp(-sun, 0, 1) * 0.45);
  };
  const w = q.T * K * 0.58;                                                // half its width in the picture
  const stroke = { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.04, cap: 'flat', streak: 0.18, jitter: 0.3 };
  // each face: lengths of stroke laid end to end along it, each with the color of its own place
  for (const f of faces) {
    const lanes = Math.max(1, Math.round((f.v1 - f.v0) * w / 9)), lw = Math.max(4.8, (f.v1 - f.v0) * w / lanes * 1.12);
    for (let k = 0; k < lanes; k++) {
      const v = f.v0 + (k + 0.5) * (f.v1 - f.v0) / lanes;
      let d = 0.4;
      while (d < q.L + v * slant - 0.05) {
        const d1 = Math.min(q.L + v * slant, d + r.range(0.5, 1.3)), a = P(d, v), b = P(d1, v), m = P((d + d1) / 2, v);
        if (!hidden(m[0], m[1]) && m[0] > -60 && m[0] < W + 60 && m[1] > -60) {
          const k2 = 0.8 + 0.2 * nB(m[0] / 40, m[1] / 40);
          p.tryStroke({ ...stroke, color: tone(f.sun + r.range(-0.05, 0.05), m[0], m[1], k2), width: lw, opacity: 0.9, points: [a, b] });
        }
        d = d1 - 0.04;
      }
    }
  }
  // the light inside the stone: a few long pale threads along it
  for (let k = 0; k < Math.round(q.L * 1.2); k++) {
    const v = r.range(-0.8, 0.8), d = r.range(1.5, q.L - 1), len = r.range(0.4, 1.4), a = P(d, v), b = P(Math.min(q.L - 0.2, d + len), v);
    if (hidden(a[0], a[1]) || hidden(b[0], b[1])) continue;
    p.tryStroke({ brush: 'round', color: r() < 0.75 ? '#ffffff' : '#bfe0ff', width: r.range(4, 4.6), opacity: r.range(0.12, 0.4), taper: [0.5, 0.5], points: [a, b] });
  }
  // the edges between its faces: light on the upper ones, dark on the lowest
  for (const [v, c, o] of [[1, '#ffffff', 0.85], [0.5, '#f4fbff', 0.6], [-0.5, '#3c68a8', 0.4], [-1, '#1c3c78', 0.55]]) {
    let d = 0.4;
    while (d < q.L + v * slant - 0.1) {
      const d1 = Math.min(q.L + v * slant, d + r.range(0.6, 1.6)), a = P(d, v * 0.97), b = P(d1, v * 0.97), m = P((d + d1) / 2, v);
      if (!hidden(m[0], m[1]) && r() < 0.85) p.tryStroke({ brush: 'round', color: c, width: 4.2, opacity: o * r.range(0.6, 1), taper: [0.2, 0.2], points: [a, b] });
      d = d1 + r.range(0, 0.25);
    }
  }
  // its end: one flat face, cut at a slant
  {
    const e = [P(q.L + slant, 1), P(q.L + 0.5 * slant + q.T * 0.3, 0.5), P(q.L - 0.5 * slant + q.T * 0.3, -0.5), P(q.L - slant, -1)], mid = P(q.L + q.T * 0.12, 0);
    if (!hidden(mid[0], mid[1]) && mid[0] > -40 && mid[0] < W + 40 && mid[1] > -30) {
      const quad = [P(q.L + slant, 1), e[1], e[2], P(q.L - slant, -1)], xs = quad.map((v) => v[0]), ys = quad.map((v) => v[1]);
      const c = tone(endSun, mid[0], mid[1], 1.05), ang = Math.atan2(e[3][1] - e[0][1], e[3][0] - e[0][0]);
      p.fill({ inside: inPoly(quad), bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], width: 6, length: 30, spacing: 0.5, overlap: 0.5, angle: ang, color: () => mix(c, endSun > 0 ? '#ffffff' : '#1c3c78', r() * 0.25), stroke: { ...stroke, opacity: 0.95 } });
      for (let i = 0; i < 3; i++) p.tryStroke({ brush: 'round', color: endSun > 0 ? '#ffffff' : '#6c98d0', width: 4.2, opacity: endSun > 0 ? 0.9 : 0.5, points: [e[i], e[i + 1]] });
      if (endSun > 0.5) for (let i = 0; i < 6; i++) { const a = i * Math.PI / 6 + r() * 0.4, l = Math.max(10, w * 0.9); p.tryStroke({ brush: 'soft', color: '#fff6dc', width: Math.max(8.4, w * 0.8), opacity: 0.1, points: [[mid[0] - Math.cos(a) * l, mid[1] - Math.sin(a) * l], [mid[0] + Math.cos(a) * l, mid[1] + Math.sin(a) * l]] }); }
    }
  }
}
for (const q of PRISMS) prism(q);

p.save();
