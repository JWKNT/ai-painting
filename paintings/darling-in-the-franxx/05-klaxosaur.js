// The great klaxosaur. It has come up out of the ground beside the Plantation: a black
// wedge like the bow of a ship, as high as a mountain. The sun is behind it. So its side
// is dark, and the far air makes that dark a blue-violet; the rock on its back has a line
// of gold along it; and past its top the light goes up into the dusty air in rays. Thin
// lines of blue light run along its side, and near its point is its blue light. Earth
// falls from it. Round its foot is the dust that it threw up, rose and gold where it is
// high enough to be in the sun.
'use strict';
const { studio, open, W, SUN, TIP, CORE, FOOT, deck0, deckTop, stemX, inWedge, hullAt, glare, nA, hash, heap } = require('./scene');
const { mix, clamp, smooth, glow, mass, noise2, ramp, glint } = studio;

const p = open('klaxosaur');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.02, rag: 0.1, cap: 'round' };
const SLOPE = Math.atan(0.15);

// ---------------------------------------------------------------- the rays
// The light that comes past its top. Each ray goes out from the place of the sun; it starts where it comes clear of the
// klaxosaur, and it is lost in the air a little way on. Between two rays is the shade of a rock.
for (let k = 0; k < 22; k++) {
  const a = -Math.PI + 0.74 + (k + r.range(-0.3, 0.3)) / 22 * 2.0, c = Math.cos(a), s = Math.sin(a);
  if (r() < 0.25) continue;
  let t = 40; while (t < 900 && inWedge(SUN.x + c * t, SUN.y + s * t)) t += 6;
  const len = r.range(260, 460), w = r.range(40, 96), x0 = SUN.x + c * (t + w * 0.4), y0 = SUN.y + s * (t + w * 0.4);
  if (y0 < 30) continue;
  p.tryStroke({ brush: 'soft', color: mix('#ffb878', '#fff0c8', r()), width: w, opacity: r.range(0.035, 0.075), taper: [0.1, 0.9], points: [[x0, y0], [x0 + c * len * 0.5, y0 + s * len * 0.5], [x0 + c * len, y0 + s * len]] });
}
// Low at the left of it the light goes through the dust toward the Plantation.
for (let k = 0; k < 7; k++) {
  const a = -Math.PI + r.range(0.03, 0.6), c = Math.cos(a), s = Math.sin(a), t = r.range(200, 300), len = r.range(260, 420), w = r.range(30, 64), x0 = SUN.x + c * t, y0 = SUN.y + s * t;
  if (inWedge(x0, y0)) continue;
  p.tryStroke({ brush: 'soft', color: mix('#ffb070', '#ffe4b0', r()), width: w, opacity: r.range(0.05, 0.1), taper: [0.2, 0.9], points: [[x0, y0], [x0 + c * len * 0.5, y0 + s * len * 0.5], [x0 + c * len, y0 + s * len]] });
}

// ---------------------------------------------------------------- its side
// The dark of it at a place. It is made of long plates that lie along it; under its top line is a narrow face that is
// turned up a little and takes the sky; low down the dust is in front of it.
function hull(x, y) {
  const up = clamp((FOOT - y) / (FOOT - TIP[1]), 0, 1), dd = y - deck0(x);
  let c = mix('#2c2542', '#1a172e', smooth(0.1, 0.9, up));
  const plate = nA((x - y * 0.4) / 300, dd / 30);
  c = mix(c, plate > 0.5 ? '#322e54' : '#141222', Math.abs(plate - 0.5) * 0.34);
  c = mix(c, '#4c5078', smooth(24, 3, dd) * 0.5);                                   // the narrow face under its top line
  c = mix(c, '#141224', smooth(24, 30, dd) * smooth(44, 30, dd) * 0.5);             // and the dark line under that face
  c = mix(c, '#8a5a66', smooth(0.5, 0, up) * 0.62);                                  // the dust in front of its low part
  c = mix(c, '#5a3c5c', glare(x, y, 300) * 0.3);                                     // the air is bright near the place of the sun
  return c;
}
const body = (x, y) => inWedge(x, y) && y > deck0(x) - 1;
p.fill({ inside: body, bounds: [TIP[0], TIP[1] - 4, W, FOOT + 34], width: 14, length: 200, spacing: 0.5, overlap: 0.6, angle: () => SLOPE + r.range(-0.012, 0.012), color: hull, stroke: { ...line, opacity: 0.98 } });
p.fill({ inside: body, bounds: [TIP[0], TIP[1] - 4, W, FOOT + 34], width: 7, length: 120, spacing: 1.0, overlap: 0.7, angle: () => SLOPE + r.range(-0.012, 0.012), color: (x, y) => hull(x + r.range(-10, 10), y + r.range(-2, 2)), stroke: { ...line, opacity: 0.8 } });
// Its front line and the first part of its top line are clean edges.
for (let y = TIP[1] + 4; y < FOOT - 30; y += 34) { const y1 = Math.min(FOOT - 10, y + 44); p.tryStroke({ ...line, cap: 'flat', rag: 0.03, color: hull(stemX((y + y1) / 2) + 8, (y + y1) / 2), width: 6, points: [[stemX(y) + 3.4, y], [stemX((y + y1) / 2) + 3.4, (y + y1) / 2], [stemX(y1) + 3.4, y1]] }); }
p.tryStroke({ ...line, cap: 'flat', rag: 0.03, color: '#3c3e62', width: 5, points: [[TIP[0] + 6, deck0(TIP[0] + 6) + 2.6], [TIP[0] + 40, deck0(TIP[0] + 40) + 2.6], [TIP[0] + 78, deck0(TIP[0] + 78) + 2.6]] });
// Lines where its plates meet: long, along it, and faint.
for (const [s0, s1, d] of [[70, 420, 46], [300, 716, 92], [150, 520, 150], [420, 716, 208], [520, 716, 132]]) { const a = hullAt(s0, d), b = hullAt((s0 + s1) / 2, d), c = hullAt(s1, d); if (inWedge(a[0] + 4, a[1])) p.tryStroke({ brush: 'round', color: '#0e0c1a', width: 4, opacity: 0.4, taper: [0.2, 0.3], points: [a, b, c] }); }

// ---------------------------------------------------------------- the rock on its back
const rock = (x, y) => { const lump = hash(Math.floor(x / 26), Math.floor((y - deck0(x)) / 16)); return mix(mix('#221a2c', '#42303c', lump), '#5c3c44', glare(x, y, 420) * 0.3 * lump); };
p.fill({ inside: (x, y) => x > 944 && y > deckTop(x) + 1 && y < deck0(x) + 4, bounds: [944, 150, W, 380], width: 6.5, length: 24, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.9, 0.9), color: rock, stroke: { ...line, rag: 0.3, opacity: 0.97 } });
// The gold of the sun along the top of the rock, brightest over the place of the sun; and thinly along the clean part of its top line.
{ const pts = []; for (let x = 956; x <= W + 10; x += 5) pts.push([x, deckTop(x) + 2]);
  glint(p, pts, () => mix('#ff9450', '#fff0c0', r()), { width: 4.6, dash: 24, gap: 12, opacity: 0.9, rng: r });
  for (let x = 1060; x < W; x += r.range(18, 50)) { const k = glare(x, deckTop(x), 380); if (r() < 0.3 + k) p.tryStroke({ brush: 'soft', color: '#ffd08c', width: 12, opacity: 0.1 + 0.25 * k, points: [[x - 14, deckTop(x - 14) + 1], [x, deckTop(x)], [x + 14, deckTop(x + 14) + 1]] }); }
  const edge = []; for (let x = TIP[0] + 4; x <= 952; x += 6) edge.push([x, deck0(x) - 1]);
  glint(p, edge, () => mix('#c88c84', '#ffd8b0', r()), { width: 4, dash: 30, gap: 14, opacity: 0.6, rng: r }); }

// ---------------------------------------------------------------- the dust in front of its low part, and the earth that falls from it
for (let k = 0; k < 46; k++) {
  const y = FOOT - Math.pow(r(), 1.7) * 210, x = r.range(stemX(y) + 20, W + 60), len = r.range(160, 420), w = r.range(26, 60);
  p.stroke({ brush: 'soft', color: mix('#5c4660', '#a87470', clamp((y - 380) / 200, 0, 1) * r.range(0.5, 1)), width: w, opacity: r.range(0.05, 0.13), points: [[x, y], [x + len / 2, y + r.range(-6, 6) + len * 0.04], [x + len, y + len * 0.08]] });
}
for (let k = 0; k < 6; k++) {
  const x = r.range(1040, 1580), y0 = deck0(x) + r.range(4, 16), len = r.range(140, 250), drift = -r.range(30, 80), w = r.range(40, 76);
  for (let i = 0; i < 3; i++) p.tryStroke({ brush: 'soft', color: mix('#5c4a6c', '#8c6c7c', r()), width: w * r.range(0.6, 1), opacity: r.range(0.035, 0.07), taper: [0.6, 0.9], points: [[x + r.range(-12, 12), y0], [x + drift * 0.3 + r.range(-12, 12), y0 + len * 0.5], [x + drift + r.range(-16, 16), y0 + len * r.range(0.8, 1)]] });
}
// Pieces of earth that fall from under its point: each is small, dark and of no fixed shape, with the dust that it leaves above it.
for (let k = 0; k < 11; k++) {
  const y = r.range(300, 520), x = stemX(y) - r.range(6, 56) - (y - 300) * 0.06, a = r.range(0.9, 2.2), l = r.range(12.4, 16), w = r.range(4.8, 8.5);
  p.tryStroke({ brush: 'soft', color: '#a88890', width: 9, opacity: 0.1, taper: [0.9, 0.2], points: [[x + 3, y - r.range(30, 70)], [x + 1, y - 14], [x, y]] });
  p.tryStroke({ ...line, rag: 0.5, color: mix('#201828', '#3e2c38', r()), width: w, opacity: 0.9, taper: [0.5, 0.2], points: [[x - Math.cos(a) * l / 2, y - Math.sin(a) * l / 2], [x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2]] });
  if (w > 6.4) p.tryStroke({ ...line, rag: 0.5, color: '#2a2030', width: 4.8, opacity: 0.85, points: [[x - 3, y - 4], [x + 6, y + 9]] });
}

// ---------------------------------------------------------------- its lines of blue light
// Each runs back from near its point, along its side, with a step here and there; it is bright near the point and faint far
// back and low down, where the dust is.
const bright = (s, d) => clamp(1.08 - s / 800, 0.2, 1) * smooth(250, 70, d);
function vein(path) {
  const pts = path.map(([s, d]) => hullAt(s, d));
  for (let i = 0; i + 1 < path.length; i++) {
    const a = pts[i], b = pts[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]), k = bright((path[i][0] + path[i + 1][0]) / 2, (path[i][1] + path[i + 1][1]) / 2);
    if (len >= 28) p.tryStroke({ brush: 'soft', color: '#2a80ee', width: 13, opacity: 0.2 * k, points: [a, b] });
    const n = Math.max(1, Math.round(len / r.range(60, 110)));
    for (let j = 0; j < n; j++) { const t0 = j / n, t1 = (j + 1) / n, at = (t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; p.tryStroke({ brush: 'round', color: mix('#3a94dc', '#a4ecff', k * r.range(0.7, 1)), width: 4.4, opacity: clamp(k * r.range(0.75, 1.1), 0.15, 0.96), points: [at(t0), at((t0 + t1) / 2), at(t1)] }); }
  }
}
vein([[70, 34], [210, 34], [232, 56], [470, 56], [490, 38], [716, 38]]);
vein([[84, 78], [300, 78], [326, 108], [590, 108], [716, 108]]);
vein([[150, 138], [380, 138], [404, 164], [716, 164]]);
vein([[262, 200], [500, 200], [522, 180], [716, 180]]);
vein([[326, 108], [326, 138]]); vein([[590, 108], [590, 164]]); vein([[470, 56], [470, 78]]);
// Its blue light, and small pieces of the same light round it.
for (let k = 0; k < 18; k++) { const s = 30 + Math.pow(r(), 1.5) * 150, d = r.range(10, Math.min(70, 16 + s * 0.5)), [x, y] = hullAt(s, d), l = r.range(12.4, 17); if (inWedge(x - 8, y) && inWedge(x + 8, y)) p.tryStroke({ brush: 'round', color: mix('#3a98e4', '#8cdcff', r()), width: r.range(4, 5.4), opacity: r.range(0.4, 0.9) * clamp(1.2 - s / 190, 0.3, 1), points: [[x - l / 2, y - l * 0.07], [x + l / 2, y + l * 0.07]] }); }
for (const [w, op, n] of [[64, 0.07, 4], [34, 0.14, 5], [16, 0.3, 6]]) glow(p, CORE[0], CORE[1], w, mix('#2a8cf0', '#d8f6ff', 1 - w / 70), op, n);
p.tryStroke({ brush: 'round', color: '#f0fcff', width: 5.5, points: [[CORE[0] - 7, CORE[1] - 1], [CORE[0] + 7, CORE[1] + 1]] });

// ---------------------------------------------------------------- the dust at its foot
// It stands high where the klaxosaur came out of the ground. What is high is in the sun, rose and gold; what is low is in
// the shade, and what is in front of the klaxosaur is in its shade too.
const DUST = ['#54405e', '#70546c', '#966a7a', '#cc8678', '#f6ae86', '#ffdaaa'];
const dustTone = (t, x, y) => { const high = smooth(FOOT - 16, FOOT - 104, y), open = smooth(1200, 1060, x); return mix(ramp(DUST, clamp(t * (0.34 + 0.66 * high * open) + 0.2 * high * open - 0.04, 0, 1)), '#4a4672', (1 - open) * 0.3); };
// first the thin dust round the heaps, which has no edge
for (let k = 0; k < 40; k++) { const x = r.range(680, W + 40), y = FOOT + 10 - Math.pow(r(), 1.5) * (x < 1100 ? 150 : 90), w = r.range(30, 70); p.stroke({ brush: 'soft', color: dustTone(0.5, x, y), width: w, opacity: r.range(0.06, 0.14), points: [[x - w * 1.2, y + 6], [x, y - r.range(0, 12)], [x + w * 1.2, y + 4]] }); }
[[51, 716, 1140, 600, 58, 2.3, 0.5], [52, 1040, 1700, 606, 56, 1.2, 0.44], [53, 800, 1330, 614, 44, 0.9, 0.48]].forEach(([seed, x0, x1, floor, big, tall, bias], i) => {
  mass(p, heap(seed, x0, x1, floor, big, tall), { light: [0.86, -0.36], tones: dustTone, base: floor, bias, contrast: 0.62, fall: 0.06, grain: 0.14, mix: 0.38, noise: noise2(1500 + i), stroke: { rag: 0.4, hardness: 0.35 }, layers: [[Math.max(12, big * 0.3), big * 0.8, 0.9, big * 0.09, 0.45], [Math.max(8, big * 0.16), big * 0.5, 0.75, big * 0.05, 0.75], [Math.max(6, big * 0.09), big * 0.3, 0.5, big * 0.04, 1.3]] });
});
// the thin dust over the heaps, where they go up into the air
for (let k = 0; k < 26; k++) { const x = r.range(720, 1140), y = FOOT - r.range(60, 170), w = r.range(24, 56); p.stroke({ brush: 'soft', color: mix('#e89c80', '#ffd8a8', r()), width: w, opacity: r.range(0.04, 0.09), points: [[x - w * 1.1, y + 8], [x - 6, y - r.range(0, 14)], [x + w * 1.1, y - 4]] }); }

p.save();
