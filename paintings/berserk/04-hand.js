// The hand. We look over its palm from the wrist. The four fingers stand up at the far
// edge of the palm, between us and the sun, so the side of each that we see is dark, with
// the fire on its top and on the edge that is toward the sun. The palm lies in the light:
// its hollow, the two pads at its sides, the lines of it, and across it the long shade of
// each finger. The thumb stands at our right, with the light on the side of it that is
// toward the sun.
'use strict';
const { studio, open, H, SUN, glare, flesh, fire, FINGERS, fingerOutline, THUMB, PALM, inPalm, fingerShade, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth, lerp, inPoly, solid, shape, shift, curve } = studio;

const p = open('hand');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.18, dry: 0.02, rag: 0.05, cap: 'round' };
// how far a place of the palm is in from its edge (the edge at the bottom of the picture does not count)
const palmEdge = (x, y) => { let d = 1e9; for (let i = 0; i < PALM.length; i++) { const a = PALM[i], b = PALM[(i + 1) % PALM.length]; if (a[1] > 1000 && b[1] > 1000) continue; const dx = b[0] - a[0], dy = b[1] - a[1], t = clamp(((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy), 0, 1); d = Math.min(d, Math.hypot(x - a[0] - dx * t, y - a[1] - dy * t)); } return d; };

// ---- the thumb: first, so that the palm lies over its root and the two are one

solid(p, THUMB, { shadow: flesh(0.1), half: flesh(0.36), lit: flesh(0.66), rim: flesh(0.92), bounce: flesh(0.24) }, { light: { at: [SUN.x, SUN.y] }, turn: 0.0, width: 9, length: 46, mix: 0.18, rag: 0.05, edgeWidth: 5, edgeOpacity: 0.85, dash: 44, gap: 16 });

// ---- the palm

// The light on a place of the palm, from 0 to 1.
function palmLight(x, y) {
  let l = 0.7;
  l -= 0.15 * Math.exp(-(Math.pow((x - 800) / 190, 2) + Math.pow((y - 706) / 104, 2)));       // the hollow: its far side is turned toward us, from the light
  l += 0.15 * Math.exp(-(Math.pow((x - 1000) / 90, 2) + Math.pow((y - 790) / 110, 2)));      // the pad under the thumb
  l += 0.1 * Math.exp(-(Math.pow((x - 596) / 80, 2) + Math.pow((y - 800) / 120, 2)));         // the pad at the other side
  l += 0.13 * smooth(770, 870, y) * (1 - smooth(890, 965, y));                                // the near side of the hollow goes up toward us, into the light
  l -= 0.55 * smooth(895, 1000, y);                                                           // then the heel of the hand turns down, away from it
  l -= 0.42 * fingerShade(x, y);
  l -= 0.1 * smooth(680, 586, y);
  const e = palmEdge(x, y);
  l -= 0.3 * smooth(34, 0, e) * (y > 600 ? 1 : 0.3);                                          // its sides turn away
  l += (nA(x / 46, y / 46) - 0.5) * 0.1 + (nB(x / 13, y / 13) - 0.5) * 0.05;
  return clamp(l * (0.74 + 0.36 * glare(x, y)), 0.03, 1);
}
const palmFlow = (x, y) => Math.PI / 2 + (x - 800) / 620 + (nC(x / 120, y / 120) - 0.5) * 0.3;
const still = { shadow: '#000000', lit: '#000000' };                                          // the tones come from `tint`
shape(p, PALM, still, { tint: (c, x, y) => flesh(palmLight(x, y)), flow: palmFlow, width: 18, length: 64, mix: 0.2, rag: 0.04, edge: false, lights: false, vary: 0 });
shape(p, PALM, still, { tint: (c, x, y) => shift(flesh(palmLight(x + r.range(-4, 4), y + r.range(-4, 4))), r.range(-3, 3), r.range(-0.02, 0.03), r.range(-0.014, 0.016)), flow: palmFlow, width: 9, length: 46, mix: 0.2, rag: 0.03, edge: false, lights: false, vary: 0, opacity: 0.85 });
p.fill({ inside: (x, y) => inPalm(x, y) && palmEdge(x, y) > 5 && y < 990, bounds: [510, 570, 1110, H], width: 5.5, length: 30, spacing: 1.2, overlap: 0.7, angle: (x, y) => palmFlow(x, y) + r.range(-0.22, 0.22), color: (x, y) => flesh(clamp(palmLight(x, y) + r.range(-0.05, 0.07), 0, 1)), stroke: { ...line, mix: 0.25, opacity: 0.55 } });   // the grain of the skin
// its edge at our left and where the heel turns: one clean line of strokes, in the shade of the side that turns away
{
  const edge = PALM.slice(0, 7), c = curve(edge, 8);
  let i = 0;
  while (i < c.length - 5) { const j = Math.min(c.length - 1, i + 5 + Math.floor(r() * 5)), m = c[(i + j) >> 1]; p.tryStroke({ ...line, rag: 0, color: flesh(clamp(palmLight(m[0] + 14, m[1]) * 0.88, 0.03, 1)), width: 11, points: c.slice(i, j + 1).map(([x, y]) => [x + 6, y]) }); i = j - 1; }
}

// The lines of the palm: each is a dark fold, with a little light on the side of it that is toward us (that side faces the sun).
function fold(pts, w, o = {}) {
  const c = curve(pts, 6), m = c[Math.floor(c.length / 2)], l = palmLight(m[0], m[1]);
  p.tryStroke({ brush: 'round', color: flesh(clamp(l + 0.16, 0, 1)), width: 4.2, opacity: 0.32, taper: [0.5, 0.5], points: c.map(([x, y]) => [x, y + w * 0.7 + 1]) });
  p.stroke({ brush: 'bristle', mix: 0.1, dry: 0, rag: 0, cap: 'round', color: flesh(clamp(l * 0.34, 0, 1)), width: w, opacity: (o.opacity || 0.85) * 0.72, taper: [0.5, 0.5], points: c });
}
fold([[566, 690], [640, 664], [730, 650], [820, 644], [884, 632]], 8);                                   // under the fingers
fold([[1002, 672], [930, 700], [840, 724], [732, 748], [636, 788]], 9);                                  // across the middle
fold([[998, 664], [948, 730], [922, 810], [918, 884], [932, 960]], 9);                                  // round the pad of the thumb
fold([[690, 962], [800, 950], [900, 955], [972, 968]], 7, { opacity: 0.7 });                            // at the wrist
fold([[706, 992], [820, 982], [950, 990]], 6, { opacity: 0.6 });
for (let k = 0; k < 14; k++) { const x = r.range(580, 1000), y = r.range(680, 910), a = r.range(-0.6, 0.6), l = r.range(26, 60); if (inPalm(x, y) && inPalm(x + Math.cos(a) * l, y + Math.sin(a) * l)) p.tryStroke({ brush: 'round', color: flesh(clamp(palmLight(x, y) * 0.5, 0, 1)), width: 4.2, opacity: 0.22, taper: [0.5, 0.5], points: [[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l]] }); }   // small folds

// ---- the fingers

for (const f of FINGERS) {
  const outline = fingerOutline(f), len = f.base - f.tip, k = glare(f.x, f.tip + len / 2);
  const sunSide = f.x < SUN.x - 20 ? 1 : f.x > SUN.x + 40 ? -1 : 0;                           // the edge of it that is more toward the sun
  const joints = [f.base - len * 0.36, f.base - len * 0.68];
  // Its side toward us is in shade. It is lighter low down, where the light comes up from the palm; each of its three parts is
  // round, so it is lighter in its middle; and a little of the fire comes over its end.
  const tone = (x, y) => {
    const t = clamp((y - f.tip) / len, 0, 1), across = (x - f.x - f.lean * (1 - t)) / f.w;
    let l = 0.13 + 0.22 * t * t + 0.07 * (1 - across * across);
    for (const j of joints) l -= 0.08 * Math.exp(-Math.pow((y - j) / 10, 2));
    const part = y > joints[0] ? (y - joints[0]) / (f.base - joints[0]) : y > joints[1] ? (y - joints[1]) / (joints[0] - joints[1]) : (y - f.tip) / (joints[1] - f.tip);
    l += 0.05 * Math.sin(Math.PI * clamp(part, 0, 1));
    l += 0.22 * smooth(f.tip + 34, f.tip + 2, y) * (0.6 + 0.4 * k);                           // the light that comes over its end
    l += (nB(x / 12, y / 12) - 0.5) * 0.05;
    l -= 0.09 * smooth(0.4, 1, Math.abs(across)) * (1 - t);
    return mix(flesh(clamp(l, 0.02, 1)), flesh(palmLight(x, y)), smooth(f.base - 8, f.base + 26, y));   // at its foot it goes into the palm
  };
  shape(p, outline, still, { tint: (c, x, y) => tone(x, y), flow: () => Math.PI / 2, width: 12, length: 56, mix: 0.2, rag: 0.03, edge: false, lights: false, vary: 0 });
  shape(p, outline, still, { tint: (c, x, y) => shift(tone(x, y), r.range(-3, 3), 0, r.range(-0.012, 0.014)), flow: () => Math.PI / 2 + r.range(-0.15, 0.15), width: 6.5, length: 34, mix: 0.2, rag: 0.03, edge: false, lights: false, vary: 0, opacity: 0.8 });
  // the folds at its joints, and where it joins the palm
  for (const j of joints) { const t = (j - f.tip) / len, cx = f.x + f.lean * (1 - t); p.tryStroke({ brush: 'round', color: flesh(0.3), width: 4.2, opacity: 0.3, taper: [0.4, 0.4], points: [[cx - f.w * 0.6, j + 5], [cx, j + 11], [cx + f.w * 0.6, j + 5]] }); p.stroke({ brush: 'bristle', mix: 0.1, dry: 0, rag: 0, cap: 'round', color: flesh(0.05), width: 5.5, opacity: 0.75, taper: [0.4, 0.4], points: [[cx - f.w * 0.72, j - 3], [cx, j + 4], [cx + f.w * 0.72, j - 3]] }); }
  p.stroke({ brush: 'soft', color: flesh(0.05), width: 14, opacity: 0.45, points: [[f.x - f.w * 0.8, f.base + 10], [f.x, f.base + 18], [f.x + f.w * 0.8, f.base + 10]] });
  // the fire on the edge that is toward the sun: pieces of light, strong high up and gone before the palm. The other edge has only a little, at the top.
  for (const e of [-1, 1]) {
    const strong = sunSide === 0 ? 0.75 : e === sunSide ? 1 : 0.25, reach = strong > 0.5 ? 0.72 : 0.3;
    let y = f.tip + f.w * 0.75;
    while (y < f.tip + len * reach) {
      const y1 = y + r.range(24, 58), t0 = (y - f.tip) / len, t1 = (y1 - f.tip) / len, fade = clamp((1 - t0 / reach) * strong, 0.04, 1);
      const x0 = f.x + f.lean * (1 - t0) + e * (lerp(f.w * 0.84, f.w, t0) - 2.6), x1 = f.x + f.lean * (1 - t1) + e * (lerp(f.w * 0.84, f.w, t1) - 2.6);
      p.tryStroke({ brush: 'soft', color: '#ff7c34', width: 10, opacity: 0.2 * fade, points: [[x0 - e * 4, y], [x1 - e * 4, y1]] });
      p.tryStroke({ brush: 'round', color: fire(clamp(0.6 + 0.36 * fade * (0.6 + 0.4 * k), 0, 1)), width: 4.4, opacity: clamp(0.25 + 0.7 * fade, 0, 1), taper: [0.3, 0.4], points: [[x0, y], [x1, y1]] });
      y = y1 + r.range(6, 26);
    }
  }
  // and on its end: a bright edge, brightest toward the sun
  { const wt = f.w * 0.84, cx = f.x + f.lean, cy = f.tip + wt, pts = [];
    for (let i = 0; i <= 10; i++) { const a = Math.PI * (1.14 - 0.04 * sunSide) + i * Math.PI * 0.72 / 10; pts.push([cx + Math.cos(a) * (wt - 2.6), cy + Math.sin(a) * (wt - 2.6)]); }
    p.stroke({ brush: 'soft', color: '#ff9a48', width: 12, opacity: 0.3, points: pts.map(([x, y]) => [x, y + 4]) });
    p.stroke({ brush: 'round', color: fire(0.97), width: 5, opacity: clamp(0.18 + 0.9 * Math.pow(glare(f.x, f.tip), 2), 0, 0.95), taper: [0.45, 0.45], points: pts });
  }
}

// ---- the folds of the thumb, and the fold where it leaves the palm

for (const [a, b, c] of [[[1034, 664], [1078, 680], [1126, 668]], [[1078, 548], [1120, 566], [1164, 556]]]) p.stroke({ brush: 'bristle', mix: 0.1, dry: 0, rag: 0, cap: 'round', color: flesh(0.07), width: 5.5, opacity: 0.7, taper: [0.4, 0.4], points: [a, b, c] });
p.stroke({ brush: 'bristle', mix: 0.2, dry: 0, rag: 0, cap: 'round', color: flesh(0.1), width: 8, opacity: 0.6, taper: [0.5, 0.5], points: [[992, 678], [1006, 742], [998, 820], [974, 896]] });

p.save();
