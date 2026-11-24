// Shared layout, palette and brush habits for the Berserk painting.
//
// The scene: the Eclipse. Griffith, who led the Band of the Hawk and lost everything, has
// called on the thing that he has carried for years, and the sun has gone black. He and all
// his people are now in a place that is not in the world: a storm with no ground and no
// sky, whose walls are the faces of the dead, without number, and they turn about the black
// sun. A hand as great as a hill has come up under him and lifted him toward it. On the
// ends of its four fingers stand the four who rule this place, the God Hand, and they wait
// for him to say the words that give his friends to them. He kneels in the middle of the
// palm, very small.
//
// The only light is the ring of fire round the black sun. So each thing is lit on the side
// that is toward the sun and dark on the other: the fingers are dark pillars with fire on
// their edges, the palm lies in the light with the long shade of each finger across it, and
// each face in the storm is lit on one cheek.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth, lerp, inPoly, curve, glint } = studio;

const W = 1600, H = 1000;
const SUN = { x: 800, y: 172, r: 62 };                     // the black sun
const nA = noise2(4301), nB = noise2(4307), nC = noise2(4313), nD = noise2(4327);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };

// A place seen from the sun: how far off it is, and at what angle.
const polar = (x, y) => ({ r: Math.hypot(x - SUN.x, y - SUN.y), th: Math.atan2(y - SUN.y, x - SUN.x) });
// How strong the light of the sun is at a place: 1 beside it, and less with the distance.
const glare = (x, y) => clamp(1.18 * Math.exp(-Math.hypot(x - SUN.x, y - SUN.y) / 500), 0, 1);
// The way that the storm goes at a place: round the sun, and a little in toward it.
const swirlAngle = (x, y) => { const { th } = polar(x, y), k = 0.42; return Math.atan2(Math.cos(th) + k * Math.sin(th), -Math.sin(th) + k * Math.cos(th)); };

// Fire: from the black-red of a thing turned from the light, through red and orange, to the pale gold of the ring itself.
const fire = grad([[0, '#10040a'], [0.18, '#350a12'], [0.4, '#7c1616'], [0.6, '#bc3c1c'], [0.78, '#ec7a2c'], [0.92, '#ffbc60'], [1, '#ffecb8']]);
// The flesh of the hand, in that light: paler and cooler than the faces, so that it stands out from them.
const flesh = grad([[0, '#180912'], [0.22, '#42202e'], [0.46, '#84474a'], [0.68, '#c88264'], [0.86, '#f4b884'], [1, '#ffe4b8']]);
// The air of the place, between the faces: nearly black far from the sun, and fire near it.
function airColor(x, y) {
  const g = glare(x, y), { r } = polar(x, y);
  let c = fire(clamp(0.06 + 0.5 * g * g + (nA(x / 260, y / 200) - 0.5) * 0.08, 0, 1));
  c = mix(c, '#ff9a40', Math.exp(-r / 210) * 0.7);
  return mix(c, '#ffe2a0', Math.exp(-Math.pow(r / 120, 2)) * 0.85);
}

// ---- the hand. We stand at its wrist and look over the palm to the four fingers, which stand up at its far edge. The thumb is at our right.

const FINGERS = [
  { name: 'little', x: 592, base: 608, tip: 420, w: 44, lean: -15 },
  { name: 'ring', x: 696, base: 592, tip: 348, w: 49, lean: -6 },
  { name: 'middle', x: 803, base: 584, tip: 300, w: 52, lean: 0 },
  { name: 'index', x: 911, base: 592, tip: 340, w: 49, lean: 9 },
];
// The outline of a finger: straight sides that come in a little, and a round end.
function fingerOutline(f, grow = 0) {
  const pts = [], w = f.w + grow, top = f.tip - grow, wt = w * 0.84;
  pts.push([f.x - w, f.base + 30], [f.x - w, f.base]);
  const n = 12;
  for (let i = 0; i <= n; i++) { const a = Math.PI + i * Math.PI / n; pts.push([f.x + f.lean + Math.cos(a) * wt, top + wt + Math.sin(a) * wt]); }
  pts.push([f.x + w, f.base], [f.x + w, f.base + 30]);
  return pts;
}
const THUMB = [[1012, 868, 80], [1050, 740, 66], [1100, 618, 54], [1136, 508, 45]];   // the thumb, as rounds that go up from the side of the palm
const PALM = [[540, 612], [528, 680], [524, 760], [542, 846], [590, 920], [648, 968], [660, 1004], [990, 1004], [1002, 960], [1048, 892], [1082, 800], [1090, 726], [1066, 660], [1010, 620], [966, 600], [911, 587], [803, 580], [696, 587], [592, 603]];
const inPalm = inPoly(PALM);
const inFinger = FINGERS.map((f) => inPoly(fingerOutline(f)));
const thumbDist = (x, y) => { let d = 1e9; for (let i = 0; i < THUMB.length - 1; i++) { const a = THUMB[i], b = THUMB[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], t = clamp(((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy), 0, 1); d = Math.min(d, Math.hypot(x - a[0] - dx * t, y - a[1] - dy * t) - lerp(a[2], b[2], t)); } return d; };
const inThumb = (x, y) => thumbDist(x, y) < 0;
const inHand = (x, y) => inPalm(x, y) || inThumb(x, y) || inFinger.some((f) => f(x, y));
// The shade that a finger puts on the palm: it goes from the foot of the finger toward us, away from the sun. 1 in the middle of it, 0 out of it.
const SHADE_FROM = [800, 280], SHADE_LEN = 150;
function fingerShade(x, y) {
  let s = 0;
  for (const f of FINGERS) {
    const ux = f.x - SHADE_FROM[0], uy = f.base - SHADE_FROM[1], ul = Math.hypot(ux, uy), dx = ux / ul, dy = uy / ul;
    const along = (x - f.x) * dx + (y - f.base) * dy, across = Math.abs((x - f.x) * -dy + (y - f.base) * dx);
    if (along < -20) continue;
    const w = f.w * (1 + along / 900);
    s = Math.max(s, smooth(w + 8, w - 10, across) * smooth(SHADE_LEN * (f.name === 'middle' ? 1.02 : f.name === 'little' ? 0.72 : 0.9) + 26, SHADE_LEN * 0.6, along));
  }
  return s;
}
const GRIFFITH = { x: 800, y: 796 };                        // where he kneels, in the middle of the palm

// ---- the faces of the storm

// The trail of one of the dead. Each comes to the sun head first, and behind it goes a long tail, like the tail of a flame,
// that bends back along the way of the storm. Paint the trails of a ring of faces before the faces of that ring.
//   x, y, s, rot   as for `face`        k, dim, cast   its light, as for `face`        len   its length, in heights of the face
function trail(p, x, y, s, rot, o = {}) {
  const r = p.rng, k = o.k != null ? o.k : glare(x, y), dim = o.dim || 0, cast = o.cast || '#a02c48';
  const tone = (t) => mix(mix(fire(clamp(t, 0, 1)), cast, 0.16 * clamp(t * 2, 0, 1)), '#0c0308', dim);
  const L = s * (o.len || 2), n = 7, w = Math.max(4.8, s * 0.6);
  if (L < 2.1 * w) return;
  let th = rot + Math.PI, cx = x - Math.cos(rot) * s * 0.18, cy = y - Math.sin(rot) * s * 0.18;
  const back = swirlAngle(x, y) + Math.PI, d = ((((back - th) % 6.2832) + 9.4248) % 6.2832) - 3.1416;      // the turn from the way of the chin to the way back along the storm
  const pts = [[cx, cy, 1]];
  for (let i = 1; i <= n; i++) { const t = i / n, a = th + d * Math.min(1, t * 1.25); cx += Math.cos(a) * L / n; cy += Math.sin(a) * L / n; pts.push([cx, cy, clamp(1 - t * 0.96, 0.07, 1)]); }
  const line = { brush: 'bristle', mix: 0.3, dry: 0, rag: 0, cap: 'round', streak: 0.3, jitter: 0.3 };
  p.tryStroke({ ...line, color: tone(0.17 + 0.28 * k), width: w, opacity: 0.92, points: pts });
  if (s > 24) {                                                                                      // the light along the side of it that is toward the sun
    const lx = SUN.x - x, ly = SUN.y - y, ll = Math.hypot(lx, ly) || 1, sh = w * 0.24;
    p.tryStroke({ ...line, color: tone(0.3 + 0.4 * k), width: Math.max(4.8, w * 0.5), opacity: 0.45, points: pts.slice(0, 6).map(([px, py, pr]) => [px + lx / ll * sh * pr, py + ly / ll * sh * pr, pr]) });
    if (s > 60) p.tryStroke({ ...line, color: tone(0.04 + 0.08 * k), width: Math.max(4.8, w * 0.3), opacity: 0.5, points: pts.slice(0, 7).map(([px, py, pr]) => [px - lx / ll * sh * pr, py - ly / ll * sh * pr, pr]) });   // and the dark along its other side
  }
}

// One face of the dead: a mask with hollow eyes and an open mouth. Its top is turned toward the sun, so the light is on its
// brow and its cheekbones, and the hollows of its eyes, the under side of its nose and its mouth are dark. It is round: each
// place of it takes its tone from how it is turned to the sun.
//   x, y   its middle        s   its height        rot   the way that its top points (radians)
//   turn   -1 to 1: how far it is turned to one side        gape   0 to 1: how wide the mouth is open
//   k      0 to 1: how much of the light of the sun reaches it        dim   0 to 1: takes it down, for one that is far in the dark
function face(p, x, y, s, rot, o = {}) {
  const r = p.rng, turn = o.turn != null ? o.turn : r.range(-0.7, 0.7), gape = o.gape != null ? o.gape : r.range(0.25, 1), k = o.k != null ? o.k : glare(x, y), dim = o.dim || 0;
  const ux = Math.cos(rot), uy = Math.sin(rot), vx = -uy, vy = ux;                                   // up it, and across it
  const P = (a, b) => [x + vx * a * s + ux * b * s, y + vy * a * s + uy * b * s];
  const local = (px, py) => [((px - x) * vx + (py - y) * vy) / s, ((px - x) * ux + (py - y) * uy) / s];
  const cast = o.cast || r.pick(['#a02c48', '#e8c49c', '#5c2438', '#c8704c', '#8c2a20']), castK = 0.14 + 0.24 * r();                 // each has its own cast of color
  const tone = (t) => mix(mix(fire(clamp(t, 0, 1)), cast, castK * clamp(t * 2, 0, 1)), '#0c0308', dim);
  if (s < 22) {                                                                                      // far off: one pale mark in the fire
    const l = Math.max(6.3, s * 0.5), w = clamp(s * 0.5, 4.8, 9);
    p.tryStroke({ brush: 'bristle', mix: 0.1, dry: 0, rag: 0.1, cap: 'round', color: tone(0.4 + 0.5 * k), width: w, opacity: 0.9, points: [P(0, -l / s), P(0, l / s)] });
    return;
  }
  const off = turn * 0.06, chin = -0.56 - 0.12 * gape;
  // the light, in the frame of the face: across it, up it, and toward us
  let La = (SUN.x - x) * vx + (SUN.y - y) * vy, Lb = (SUN.x - x) * ux + (SUN.y - y) * uy;
  { const ll = Math.hypot(La, Lb) || 1; La /= ll; Lb /= ll; }
  const Lz = 0.3, ln = Math.hypot(1, Lz), side = La >= 0 ? 1 : -1;
  const facing = (a, b) => {
    const u = a / 0.38, v = (b + 0.05) / 0.64, z = Math.sqrt(Math.max(0.03, 1 - u * u - v * v));
    let t = (u * La + v * Lb + z * Lz) / ln;
    t += 0.12 * Math.exp(-Math.pow((b - 0.23) / 0.06, 2)) * (1 - Math.pow(Math.min(1, Math.abs(a) / 0.36), 3));                                  // the brow
    t += 0.1 * Math.exp(-(Math.pow((Math.abs(a - off) - 0.22) / 0.07, 2) + Math.pow((b + 0.0) / 0.07, 2)));                                    // the cheekbones
    t -= 0.16 * Math.exp(-(Math.pow((Math.abs(a - off) - 0.17) / 0.08, 2) + Math.pow((b + 0.21) / 0.1, 2)));                                    // the hollows of the cheeks
    return t;
  };
  const T = (a, b) => clamp(0.05 + 0.1 * k + (0.22 + 0.64 * k) * smooth(-0.2, 0.95, facing(a, b)), 0, 1);
  const N = [[0, 0.5], [0.18, 0.47], [0.3, 0.35], [0.35, 0.14], [0.33, -0.08], [0.27, -0.28 - 0.04 * gape], [0.14, chin + 0.05], [0, chin], [-0.14, chin + 0.05], [-0.27, -0.28 - 0.04 * gape], [-0.33, -0.08], [-0.35, 0.14], [-0.3, 0.35], [-0.18, 0.47]];
  const w = clamp(s * 0.11, 5, 12), inset = 1 - w * 0.42 / (s * 0.4), poly = N.map(([a, b]) => P(a * inset, (b + 0.03) * inset - 0.03));
  const xs = poly.map((q) => q[0]), ys = poly.map((q) => q[1]), bounds = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], inside = inPoly(poly);
  // the dark behind it, so that it stands clear of the one behind
  p.tryStroke({ brush: 'soft', color: '#08020a', width: Math.max(8.4, s * 0.62), opacity: 0.5, points: [P(0, 0.3), P(0, chin + 0.1)] });
  // the mask itself: strokes across it, wet, each with the tone of its place
  const wet = { brush: 'bristle', mix: 0.34, dry: 0, rag: 0.03, cap: 'round', jitter: 0.18, streak: 0.12 };
  const colorAt = (px, py) => { const [a, b] = local(px, py); return tone(T(a, b) + r.range(-0.02, 0.02)); };
  p.fill({ inside, bounds, width: w, length: clamp(s * 0.36, 14, 40), spacing: 0.5, overlap: 0.5, order: 'random', angle: () => rot + Math.PI / 2 + (r() - 0.5) * 0.5, color: colorAt, stroke: wet });
  if (s > 46) p.fill({ inside, bounds, width: Math.max(4.8, w * 0.6), length: clamp(s * 0.26, 13, 30), spacing: 0.8, overlap: 0.6, order: 'random', angle: () => rot + Math.PI / 2 + (r() - 0.5) * 0.7, color: colorAt, stroke: { ...wet, opacity: 0.85 } });
  // its edge: lengths of stroke along the outline, each with the tone of the place just inside it; then the fire on the part of the edge that is toward the sun
  if (s > 52) {
    const ew = clamp(s * 0.055, 4.8, 7), ring = curve([...N, N[0]].map(([a, b]) => P(a * 0.965, (b + 0.03) * 0.965 - 0.03)), 4), per = Math.max(4, Math.ceil(Math.max(13, 2.3 * ew) / 4));
    for (let i = 0; i + per < ring.length; i += per - 1) { const m = ring[i + (per >> 1)], [a, b] = local(m[0], m[1]); p.tryStroke({ ...wet, mix: 0.2, color: tone(T(a * 0.93, b * 0.93)), width: ew, points: ring.slice(i, i + per + 1) }); }
    const toSun = (q) => { const [a, b] = local(q[0], q[1]); return a * La + (b + 0.03) * Lb; };
    let low = 0; ring.forEach((q, i) => { if (toSun(q) < toSun(ring[low])) low = i; });                  // begin at the place of the edge that is most turned from the sun, so that the lit part is one length
    const lit = [...ring.slice(low), ...ring.slice(0, low)].filter((q) => toSun(q) > 0.34);
    if (lit.length > 5) p.tryStroke({ brush: 'bristle', mix: 0.25, dry: 0, rag: 0, cap: 'round', streak: 0, jitter: 0.1, color: tone(0.62 + 0.38 * k), width: s > 80 ? 5.4 : 4.8, opacity: 0.3 + 0.5 * k, taper: [0.45, 0.45], points: lit });
  }
  if (s < 30) return;                                                                                // far off: only the lit shape of it
  const dark = tone(0.012 + 0.03 * k), least = 12.6 / s;                                             // `least`: the least length of a mark, as a part of the face
  const mark = (pts, color, width, extra = {}) => p.tryStroke({ brush: 'round', color, width, ...extra, points: pts.map(([a, b, pr]) => [...P(a, b), pr == null ? 1 : pr]) });
  const soft = { brush: 'bristle', mix: 0.3, dry: 0, rag: 0, cap: 'round', streak: 0, jitter: 0.1 };   // a mark of light that goes into the paint under it
  // the mouth: a long round opening, narrow at its two ends
  const mouth = () => {
    const top = -0.125, len = Math.max(least, 0.21 + 0.19 * gape), mw = Math.min(clamp(s * (0.13 + 0.05 * gape), 4.8, 18), len * s / 2.06), m = off * 1.3, n = s > 56 ? 2 : 1;
    for (let i = 0; i < n; i++) { const a = m + (n > 1 ? (i - 0.5) * mw / s * 0.5 : 0); mark([[a, top, 0.7], [a, top - len * 0.45, 1], [a, top - len, 0.72]], dark, mw, { opacity: 0.97 }); }
    if (s > 70) p.tryStroke({ ...soft, color: tone(T(m, top + 0.05) + 0.1), width: 4.8, opacity: 0.5, taper: [0.3, 0.3], points: [P(m - 0.1, top + 0.03), P(m, top + 0.055), P(m + 0.1, top + 0.03)] });   // the lip over it, in the light
  };
  if (s < 44) { mouth(); return; }                                                                   // small: only the open mouth (an eye bar over a mouth bar is the letter T)
  // the hollows of the eyes: deep under the brow, round toward the nose, and each goes down to a point at its outer end, as in a face that cries out
  for (const e of [-1, 1]) {
    const near = e * turn < 0 ? 1 : 1 - 0.25 * Math.abs(turn), len = Math.max(least, 0.21 * near), a0 = off + e * 0.055, ew = Math.min(clamp(s * 0.09, 4.4, 12), len * s / 2.06);
    mark([[a0, 0.15, 0.85], [a0 + e * len * 0.5, 0.142, 1], [a0 + e * len, 0.07, 0.4]], dark, ew, { opacity: 0.96 });
    if (s > 54) mark([[a0 + e * 0.012, 0.15 - ew / s * 0.8, 0.8], [a0 + e * len * 0.5, 0.135 - ew / s * 0.85, 1], [a0 + e * len * 0.94, 0.07 - ew / s * 0.55, 0.4]], dark, Math.max(4.2, ew * 0.9), { opacity: 0.92 });   // its lower part
    if (s > 56) p.tryStroke({ ...soft, color: tone(T(a0 + e * len * 0.5, 0.25) + 0.1), width: clamp(s * 0.055, 4.8, 7), opacity: 0.6, taper: [0.3, 0.4], points: [P(a0 - e * 0.03, 0.228), P(a0 + e * len * 0.55, 0.238), P(a0 + e * (len + 0.05), 0.17)] });   // the brow over it, in the light
  }
  // the nose: its ridge in the light, the shade down the side of it that is turned from the sun, and the dark under it
  if (s > 70) {
    p.tryStroke({ ...soft, color: tone(T(off, 0.04) + 0.12), width: clamp(s * 0.05, 4.8, 7), opacity: 0.55, taper: [0.5, 0.2], points: [P(off, 0.11), P(off, 0.11 - Math.max(least, 0.16))] });
    mark([[off - side * 0.045, 0.08], [off - side * 0.055, 0.08 - Math.max(least, 0.14)]], dark, 4.2, { opacity: 0.3, taper: [0.4, 0.2] });
  }
  if (s > 50) mark([[off - Math.max(least, 0.12) / 2, -0.07], [off + Math.max(least, 0.12) / 2, -0.07]], dark, clamp(s * 0.045, 4, 5.6), { opacity: 0.8 });
  mouth();
  // the hollows of the cheeks: a soft dark from each cheekbone toward the mouth
  if (s > 80) for (const e of [-1, 1]) p.tryStroke({ brush: 'soft', color: dark, width: Math.max(8.4, s * 0.1), opacity: 0.26, points: [P(off + e * 0.25, -0.08), P(off + e * 0.17, -0.3)] });
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, SUN, nA, nB, nC, nD, hash, polar, glare, swirlAngle, fire, flesh, airColor, FINGERS, fingerOutline, THUMB, PALM, inPalm, inFinger, thumbDist, inThumb, inHand, fingerShade, GRIFFITH, face, trail };
