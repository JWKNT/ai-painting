// The mountains, peak behind peak. Each has a ridge that comes down toward us from its top:
// the face to the left of that ridge is in the sun, rose low down and peach and cream at the
// top; the face to the right is blue. A spur or two breaks each face. The far peaks are
// paler. Strokes run down the fall of the slopes.
'use strict';
const { studio, open, W, BASE, nA, nB, nC } = require('./scene');
const { mix, wave, clamp, smooth, glint } = studio;

const p = open('mountains');
const r = p.rng;
const hump = (x, c, w) => Math.exp(-Math.pow((x - c) / w, 2));

// One peak: its top at (ax, ay), the steepness of its left and right skylines, how its
// middle ridge leans, and how far off it is (0 near, 1 far).
function peak(ax, ay, ls, rs, lean, depth, seed) {
  const sil = (x) => {
    const dx = Math.abs(x - ax), s = x < ax ? ls : rs;
    return ay + s * dx * (1 - 0.25 * dx / (dx + 300)) + clamp(dx / 30, 0, 1) * (16 * (nB(x / 44, seed) - 0.5) + 6 * (nC(x / 13, seed) - 0.5)) - 24 * hump(dx, 110 + 46 * (seed % 3), 30);
  };
  const div = (y) => ax + lean * (y - ay) + 34 * (nA(y / 70, seed + 9) - 0.5) * clamp((y - ay) / 80, 0, 1);
  // Spurs break each face, and no two peaks have them in the same places.
  const frac = (v) => v - Math.floor(v), aL = 46 + 80 * frac(seed * 0.37), sL = 0.65 + 0.6 * frac(seed * 0.61), wL = 0.12 + 0.16 * frac(seed * 0.83), aR = 80 + 70 * frac(seed * 0.29), sR = 0.6 + 0.5 * frac(seed * 0.47);
  const spurL = (y) => div(y) - sL * (y - ay - aL) - 22 + 18 * (nA(y / 50, seed + 3) - 0.5);          // a spur down to the left: its right flank is in shadow
  const spurR = (y) => div(y) + sR * (y - ay - aR) + 28 + 18 * (nA(y / 50, seed + 5) - 0.5);          // a spur down to the right: its left flank takes the sun
  const lit = (x, y) => {
    const e = 10 * (nC(x / 16, y / 16 + seed) - 0.5);
    if (x + e < div(y)) {
      const d = x + e - spurL(y);
      if (seed % 4 !== 2 && y > ay + aL && d > 0 && d < 12 + (y - ay - aL) * wL) return 0;
      return nB(x / 34 + seed, y / 120) > 0.8 ? 0.35 : 1;                                             // and small hollows that the sun has not reached
    }
    const d = spurR(y) - (x + e);
    return y > ay + aR && d > 0 && d < 10 + (y - ay - aR) * 0.2 ? 0.8 : 0;
  };
  const face = (x, y) => {
    const high = clamp(1 - (y - ay) / 300, 0, 1), l = lit(x, y);
    const sun = mix(mix('#eeb0b8', '#ffcdb0', high), '#fff0dc', nB(x / 20, y / 20) * 0.7 * high);
    const shade = mix(mix('#8a98d0', '#5866ac', high), '#98a6da', nB(x / 26, y / 26) * 0.5);
    const c = mix(mix(shade, sun, l), l > 0.5 ? '#dcc6dc' : '#a6b2de', smooth(BASE - 170, BASE + 20, y) * 0.75);        // haze toward its foot
    return mix(c, l > 0.5 ? '#e4c0d0' : '#a4aedc', depth * 0.6);
  };
  const fall = (x, y) => Math.PI / 2 + (x < div(y) ? 0.5 : -0.5) + (nB(x / 60, y / 40 + seed) - 0.5) * 0.4;
  const foot = BASE + 30 - 70 * depth;                            // the feet of the far peaks are behind the nearer ones
  const inside = (m) => (x, y) => y > sil(x) + m && y < foot;
  const box = [ax - (BASE - ay) / ls * 1.5, ay - 30, ax + (BASE - ay) / rs * 1.5, BASE + 30], w = 20 - 6 * depth;
  p.fill({ inside: inside(w * 0.45), bounds: box, width: w, length: w * 5, spacing: 0.5, angle: fall, color: face, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.1, dry: 0.05 } });
  if (depth < 0.4) p.fill({ inside: inside(5), bounds: box, width: w * 0.5, length: w * 2.8, spacing: 0.9, overlap: 0.8, angle: fall, color: (x, y) => face(x + r.range(-4, 4), y + r.range(-4, 4)), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.1 } });
  for (const sgn of [-1, 1]) {                                     // the two skylines
    for (let d = 0; d < (BASE - ay) / (sgn < 0 ? ls : rs) * 1.3; d += 60) {
      const pts = [];
      for (let k = 0; k <= 6; k++) { const x = ax + sgn * (d + k * 12); pts.push([x, sil(x) + w * 0.3]); }
      if (pts[6][1] < BASE + 20) p.stroke({ brush: 'bristle', color: face(pts[3][0], pts[3][1] + 8), width: w * 0.6, mix: 0.1, dry: 0, rag: 0.05, points: pts });
    }
  }
  // rock, where it is too steep for snow to lie
  for (let k = 0; k < 46 - 26 * depth; k++) {
    const x = ax + r.range(-1, 1) * (BASE - ay) * 0.6, y = sil(x) + r.range(12, 150);
    if (y > BASE - 60 || nC(x / 30, y / 30 + seed) < 0.42) continue;
    const a = fall(x, y) + r.range(-0.25, 0.25), len = r.range(14, 30);
    p.tryStroke({ brush: 'bristle', color: mix(lit(x, y) > 0.5 ? mix('#a47a86', '#c49a96', r()) : mix('#3c4276', '#565c94', r()), '#a4aedc', depth * 0.6), width: r.range(5, 8), opacity: r.range(0.35, 0.7), mix: 0.15, dry: 0.15, rag: 0.4, taper: [0.2, 0.4], points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
  }
  // the bright edge of the sunward skyline, near the top
  if (depth < 0.8) {
    const pts = [];
    for (let d = 0; d <= 130; d += 10) pts.push([ax - d, sil(ax - d) + 3]);
    glint(p, pts, () => mix('#ffe2cc', '#fffaf0', r()), { width: 4.4, dash: 30, gap: 14, opacity: 0.8 - 0.3 * depth, rng: r });
  }
}
const mist = (y0, y1, n, pink) => {
  for (let k = 0; k < n; k++) {
    const x = r.range(-100, W - 200), y = r.range(y0, y1), len = r.range(260, 560);
    p.stroke({ brush: 'soft', color: mix(mix('#a8b2e0', '#c0c4ea', r()), '#ecc8d4', pink * clamp(1.1 - (x + len / 2) / 1100, 0, 1)), width: r.range(30, 56), opacity: r.range(0.13, 0.25), points: wave(x, y, x + len, y + r.range(-6, 6), 4, 1, 7) });
  }
};

// Far off.
for (const [ax, ay, ls, rs, lean, seed] of [[210, 336, 0.5, 0.62, 0.25, 1], [540, 352, 0.56, 0.5, -0.15, 2], [900, 326, 0.56, 0.6, 0.2, 3], [1262, 348, 0.5, 0.56, 0.1, 4], [1490, 322, 0.56, 0.56, 0.2, 5]]) peak(ax, ay, ls, rs, lean, 1, seed);
mist(BASE - 130, BASE - 40, 12, 0.7);
// Nearer.
for (const [ax, ay, ls, rs, lean, seed] of [[40, 300, 0.66, 0.72, 0.2, 6], [716, 296, 0.72, 0.8, 0.25, 7], [1410, 274, 0.76, 0.68, 0.15, 8]]) peak(ax, ay, ls, rs, lean, 0.5, seed);
mist(BASE - 90, BASE - 10, 10, 0.6);
// The great peaks.
peak(356, 232, 0.82, 0.92, 0.3, 0, 9);
peak(1600, 246, 0.8, 0.9, 0.2, 0, 10);
peak(1064, 168, 0.92, 0.8, 0.22, 0, 11);

// A little snow blowing from the highest top.
p.stroke({ brush: 'soft', color: '#ffe6d8', width: 18, opacity: 0.2, taper: [0, 0.8], points: [[1060, 172], [1112, 162], [1184, 170]] });

mist(BASE - 36, BASE + 26, 18, 0.7);

p.save();
