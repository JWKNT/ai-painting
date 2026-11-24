// The hill of flowers: white chrysanthemums, the flowers of a funeral in Japan, heaped as
// high as a house. Each flower is a small round head. The sun is on the right side of each
// one and of the whole hill, warm, and the left of each and of the hill is blue-violet. In
// the gaps between them is the dark of stalks and leaves. A few of the flowers are pale
// yellow, a few are lilies, and here and there is a little violet.
// At the top of the hill is a bed of close white flowers that leans back, and on it, in
// flowers of a red so deep that it is nearly black, is the sign of Friend.
'use strict';
const { studio, open, at, unit, LIGHT, seeHeap, heapShade, friendShade, BED, inBed, SIGN, white, GAP, flowers, nA, nB, nC, nD } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('flowers');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.02, rag: 0.12, cap: 'round' };

// The light at a place of the hill: { t } is the tone for `white` (0 deep shade, 1 full sun), `lit` whether the sun is on it.
// The hill is lumpy: the side of each lump that is toward the sun is lighter.
const memo = new Map();
function lightAt(x, y) {
  const key = (Math.round(x / 3) << 12) | Math.round(y / 3);
  if (memo.has(key)) return memo.get(key);
  const hp = seeHeap(x, y);
  let out = null;
  if (hp) {
    const lump = (nB((x + LIGHT[0] * 8) / 24, (y + LIGHT[1] * 8) / 24) - nB((x - LIGHT[0] * 8) / 24, (y - LIGHT[1] * 8) / 24)) * 0.45 + (nD((x + LIGHT[0] * 24) / 84, (y + LIGHT[1] * 24) / 84) - nD((x - LIGHT[0] * 24) / 84, (y - LIGHT[1] * 24) / 84)) * 1.0;
    const sun = hp.sun + lump, P = hp.P, n = hp.n;
    const cast = friendShade(...P) || heapShade(P[0] + n[0] * 0.22, P[1] + n[1] * 0.22, P[2] + n[2] * 0.22);
    const lit = !cast && sun > 0.02;
    out = { P, lit, sun, t: lit ? clamp(0.56 + 0.46 * sun, 0.58, 1) : clamp(0.3 + 0.16 * sun + 0.1 * n[1] + (cast ? -0.02 : 0), 0.08, 0.44) };
  }
  memo.set(key, out);
  return out;
}
const onHill = (x, y) => !!lightAt(x, y);

// ---- the air round the hill is full of its light: a pale veil over what is behind it, close to its outline

for (let k = 0; k < 60; k++) {
  const y = r.range(120, 500), side = r() < 0.5 ? -1 : 1;
  let x = 800;
  while (lightAt(x, y) && Math.abs(x - 800) < 520) x += side * 12;        // out to the edge of the hill at this height
  if (Math.abs(x - 800) >= 520 || Math.abs(x - 800) < 30) continue;
  const w = r.range(60, 110), l = w * r.range(1.05, 1.4), a = Math.PI / 2 + side * 0.5 + r.range(-0.3, 0.3);
  x += side * r.range(-10, 50);
  p.stroke({ brush: 'soft', color: side > 0 ? '#fff4dc' : '#e6e8f6', width: w, opacity: r.range(0.04, 0.075), points: [[x - Math.cos(a) * l, y - Math.sin(a) * l], [x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l]] });
}

// ---- under the flowers: the dark of the stalks, lighter where the sun gets in

p.fill({ inside: onHill, bounds: [300, 40, 1320, 830], width: 18, length: 54, spacing: 0.5, overlap: 0.5, angle: (x, y) => Math.PI / 2 + (nC(x / 60, y / 60) - 0.5) * 2.4, color: (x, y) => { const l = lightAt(x, y); return mix(GAP, white(l.t * 0.85), l.lit ? 0.5 : 0.42); }, stroke: { ...line, opacity: 0.97 } });
p.fill({ inside: onHill, bounds: [300, 40, 1320, 830], width: 9, length: 34, spacing: 0.7, overlap: 0.6, angle: () => r.range(0, Math.PI), color: (x, y) => { const l = lightAt(x, y); return mix(GAP, white(l.t * 0.9), (l.lit ? 0.62 : 0.5) + r.range(-0.2, 0.15)); }, stroke: { ...line, opacity: 0.9 } });

// ---- flowers deep in the heap: small marks that lie every way

p.fill({ inside: onHill, bounds: [300, 40, 1320, 830], width: 7, length: 15, spacing: 0.62, overlap: 0.7, angle: () => r.range(0, Math.PI), color: (x, y) => { const l = lightAt(x, y); return white(clamp(l.t + r.range(-0.2, 0.06), 0, 1)); }, stroke: { ...line, mix: 0.06, rag: 0.05, opacity: 0.9 } });

const { round, mum, daisy, lily, leaf } = flowers(p);

// ---- the bed at the top, and the sign on it

{
  const bedTone = (x, y) => clamp(0.72 + 0.17 * (x - BED.x) / BED.a - 0.05 * (y - BED.y) / BED.b + (nB(x / 16, y / 16) - 0.5) * 0.1, 0.5, 0.97);
  p.fill({ inside: (x, y) => inBed(x, y, 1.02), bounds: [BED.x - BED.a - 6, BED.y - BED.b - 6, BED.x + BED.a + 6, BED.y + BED.b + 6], width: 12, length: 36, spacing: 0.5, overlap: 0.5, angle: () => r.range(0, Math.PI), color: (x, y) => mix(white(bedTone(x, y) - 0.12), GAP, 0.12), stroke: { ...line, opacity: 0.98 } });
  p.fill({ inside: (x, y) => inBed(x, y, 1.0), bounds: [BED.x - BED.a, BED.y - BED.b, BED.x + BED.a, BED.y + BED.b], width: 6.2, length: 14, spacing: 0.55, overlap: 0.75, angle: () => r.range(0, Math.PI), color: (x, y) => white(clamp(bedTone(x, y) + r.range(-0.1, 0.08), 0, 1)), stroke: { ...line, mix: 0.05, rag: 0.04, opacity: 0.94 } });
  p.fill({ inside: (x, y) => inBed(x, y, 0.98), bounds: [BED.x - BED.a, BED.y - BED.b, BED.x + BED.a, BED.y + BED.b], width: 4.6, length: 13, spacing: 1.2, overlap: 0.9, angle: () => LIGHT[0] > 0 ? -0.6 + r.range(-0.5, 0.5) : 0, color: (x, y) => white(clamp(bedTone(x, y) + r.range(0.04, 0.16), 0, 1)), stroke: { brush: 'round', opacity: 0.6 } });

  // the sign: lines of flowers of a red that is nearly black
  const DEEP = ['#2a0c18', '#1c0810', '#3a1222', '#30101c'];
  const along = (pts, w, o = {}) => {
    p.stroke({ brush: 'bristle', mix: 0.02, dry: 0, rag: 0.03, cap: 'round', streak: 0.1, jitter: 0.2, color: DEEP[0], width: w, points: pts });
    // the single flowers of the line: short marks that lie along it, a little to this side and that
    let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], seg = Math.hypot(bx - ax, by - ay), a0 = Math.atan2(by - ay, bx - ax);
      for (let d = (o.step || 13) - acc; d < seg; d += o.step || 13) {
        const x = ax + (bx - ax) * d / seg + r.range(-1.2, 1.2), y = ay + (by - ay) * d / seg + r.range(-1.2, 1.2), a = a0 + r.range(-0.5, 0.5);
        p.tryStroke({ brush: 'round', color: r.pick(DEEP), width: Math.min(5.2, Math.max(4.2, w * 0.55)), opacity: 0.85, points: [[x - Math.cos(a) * 6.3, y - Math.sin(a) * 6.3], [x + Math.cos(a) * 6.3, y + Math.sin(a) * 6.3]] });
      }
      acc = (acc + seg) % (o.step || 13);
    }
  };
  // the outline of the eye, in three parts (the finger that points goes up through its top)
  along(SIGN.lines[0], 10.5);
  along(SIGN.lines[1], 10.5);
  along(SIGN.lines[2], 10.5);
  for (const l of SIGN.lashes) for (let k = 0; k < 2; k++) p.stroke({ brush: 'bristle', mix: 0.02, dry: 0, rag: 0.04, cap: 'round', streak: 0.1, jitter: 0.2, color: DEEP[k * 2], width: k ? 5.2 : 7.6, opacity: k ? 0.7 : 1, points: [[l[0][0] + k * r.range(-1.5, 1.5), l[0][1]], [l[1][0] + k * r.range(-1.5, 1.5), l[1][1]]] });
  // the hand and its cuff
  for (const l of SIGN.lines.slice(3)) { const span = Math.hypot(l[l.length - 1][0] - l[0][0], l[l.length - 1][1] - l[0][1]); if (span < 19) p.stroke({ brush: 'bristle', mix: 0.02, dry: 0, rag: 0.03, cap: 'round', streak: 0.1, jitter: 0.2, color: DEEP[0], width: 7, points: l }); else along(l, 8, { step: 14 }); }
  // the eye in the hand
  for (const l of SIGN.eye) p.stroke({ brush: 'bristle', mix: 0.02, dry: 0, rag: 0, cap: 'round', color: DEEP[1], width: 5.4, points: l });
  round(SIGN.pupil[0], SIGN.pupil[1], 8.8, DEEP[1], 4.6);

  // round the bed: a rim of bigger flowers
  const n = 78;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i + r.range(-0.2, 0.2)) * 6.283 / n * (i % 2 ? 1 : 1), x = BED.x + Math.cos(a) * (BED.a + 1), y = BED.y + Math.sin(a) * (BED.b + 1);
    const toSun = Math.cos(a) * LIGHT[0] + Math.sin(a) * LIGHT[1];
    mum(x + r.range(-2, 2), y + r.range(-2, 2), r.range(9, 11.5), clamp(0.74 + 0.16 * toSun + r.range(-0.05, 0.05), 0.4, 1), { lit: toSun > -0.5 });
  }
}

// ---- the flowers of the hill, from the top of it down, so that each lies over those behind it

{
  const list = [];
  for (let y = 60; y < 826; y += 13) for (let x = 300; x < 1320; x += 13) {
    const fx = x + r.range(-6.5, 6.5), fy = y + r.range(-6.5, 6.5);
    if (inBed(fx, fy, 1.03)) continue;
    const l = lightAt(fx, fy);
    if (!l) continue;
    if (r() > 0.62 + 0.5 * smooth(0.3, 0.7, nA(fx / 46 + 7, fy / 46))) continue;                        // they stand close, with a gap here and there
    list.push([fx, fy, l]);
  }
  // sprays that stand out past the edge of the hill
  for (let k = 0; k < 2600; k++) {
    const x = r.range(300, 1320), y = r.range(50, 826);
    if (lightAt(x, y) || inBed(x, y, 1.1)) continue;
    const near = [[14, 0], [-14, 0], [0, 14], [10, 10], [-10, 10]].map(([dx, dy]) => lightAt(x + dx, y + dy)).find(Boolean);
    if (near && r() < 0.5) list.push([x, y, near, true]);
  }
  list.sort((a, b) => a[1] - b[1]);
  for (const [x, y, l, spray] of list) {
    const u = unit(l.P[2]), q = r(), t = clamp(l.t + r.range(-0.06, 0.06), 0, 1);
    if (spray && r() < 0.5) leaf(x, y, r.range(14, 22), l.lit);
    if (q < 0.045 && u > 118 && !spray) lily(x, y, u * r.range(0.13, 0.17), t, l.lit);
    else if (q < 0.3 && u > 104) daisy(x, y, u * r.range(0.085, 0.125), t, l.lit);
    else if (q < 0.34) leaf(x, y, r.range(14, 24), l.lit);
    else mum(x, y, clamp(u * r.range(0.062, 0.088), 8.5, 14), t, { lit: l.lit, yellow: q > 0.972 });
  }
}

// ---- the form of the whole hill: a thin cool veil down its left side, where it turns from the sun

for (let k = 0; k < 26; k++) {
  const y = r.range(300, 800), x0 = 800 - (y - 60) * 0.56 - r.range(-20, 60), w = r.range(50, 90), len = w * r.range(2.1, 2.6), a = 1.9 + r.range(-0.2, 0.2);
  const m = [x0 + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2];
  if (!lightAt(m[0], m[1])) continue;
  p.stroke({ brush: 'soft', color: '#6c74b0', width: w, opacity: r.range(0.05, 0.1), points: [[x0, y], m, [x0 + Math.cos(a) * len, y + Math.sin(a) * len]] });
}

// ---- the light of the sun in the air over the bright side of the hill

for (let k = 0; k < 9; k++) {
  const x = r.range(900, 1180), y = r.range(300, 700), a = r.range(0, Math.PI), w = r.range(80, 140), l = w * r.range(1.06, 1.4);
  p.stroke({ brush: 'soft', color: '#fff2d0', width: w, opacity: 0.035, points: [[x - Math.cos(a) * l, y - Math.sin(a) * l], [x + Math.cos(a) * l, y + Math.sin(a) * l]] });
}

p.save();
