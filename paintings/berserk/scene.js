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
const { mix, noise2, grad, clamp, smooth, lerp, shape, inPoly } = studio;

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
  { name: 'little', x: 592, base: 608, tip: 420, w: 44, lean: -7 },
  { name: 'ring', x: 696, base: 592, tip: 348, w: 49, lean: -3 },
  { name: 'middle', x: 803, base: 584, tip: 300, w: 52, lean: 0 },
  { name: 'index', x: 911, base: 592, tip: 340, w: 49, lean: 5 },
];
// The outline of a finger: straight sides that come in a little, and a round end.
function fingerOutline(f, grow = 0) {
  const pts = [], w = f.w + grow, top = f.tip - grow, wt = w * 0.9;
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

// One face of the dead: a mask with hollow eyes and an open mouth. Its top is turned toward the sun, so the light is on its
// brow, and its eyes, the under side of its nose and its mouth are dark.
//   x, y   its middle        s   its height        rot   the way that its top points (radians)
//   turn   -1 to 1: how far it is turned to one side        gape   0 to 1: how wide the mouth is open
//   k      0 to 1: how much of the light of the sun reaches it        dim   0 to 1: takes it down, for one that is far in the dark
function face(p, x, y, s, rot, o = {}) {
  const r = p.rng, turn = o.turn != null ? o.turn : r.range(-0.7, 0.7), gape = o.gape != null ? o.gape : r.range(0.25, 1), k = o.k != null ? o.k : glare(x, y), dim = o.dim || 0;
  const ux = Math.cos(rot), uy = Math.sin(rot), vx = -uy, vy = ux;                                   // up it, and across it
  const P = (a, b) => [x + vx * a * s + ux * b * s, y + vy * a * s + uy * b * s];
  const cast = o.cast || r.pick(['#a02c48', '#c8883c', '#5c2438', '#b84a28', '#8c2a20']), castK = 0.1 + 0.14 * r();                 // each has its own cast of color
  const tone = (t) => mix(mix(fire(clamp(t, 0, 1)), cast, castK * clamp(t * 2, 0, 1)), '#0c0308', dim);
  const tones = { shadow: tone(0.07 + 0.17 * k), half: tone(0.22 + 0.34 * k), lit: tone(0.4 + 0.5 * k), rim: tone(0.58 + 0.42 * k) };
  const sun = { at: [SUN.x, SUN.y] };
  const mark = (a, b, color, w, extra = {}) => p.tryStroke({ brush: 'round', color, width: w, ...extra, points: [P(...a), ...(extra.via ? extra.via.map((q) => P(...q)) : []), P(...b)] });
  if (s < 22) {                                                                                      // far off: one pale mark in the fire
    const l = Math.max(6.3, s * 0.5), w = clamp(s * 0.5, 4.8, 9);
    p.tryStroke({ brush: 'bristle', mix: 0.1, dry: 0, rag: 0.1, cap: 'round', color: tones.lit, width: w, opacity: 0.9, points: [P(0, -l / s), P(0, l / s)] });
    return;
  }
  const chin = -0.52 - 0.12 * gape;
  const outline = [[0, 0.5], [0.2, 0.47], [0.33, 0.34], [0.385, 0.13], [0.36, -0.08], [0.29, -0.27 - 0.04 * gape], [0.15, chin + 0.05], [0, chin], [-0.15, chin + 0.05], [-0.29, -0.27 - 0.04 * gape], [-0.36, -0.08], [-0.385, 0.13], [-0.33, 0.34], [-0.2, 0.47]].map(([a, b]) => P(a, b));
  // the dark behind it, so that it stands clear of the one behind
  p.tryStroke({ brush: 'soft', color: '#08020a', width: Math.max(8.4, s * 0.62), opacity: 0.5, points: [P(0, 0.3), P(0, chin + 0.1)] });
  shape(p, outline, tones, { light: sun, round: s * 0.42, turn: -0.25, gain: 1.4, flow: () => rot + Math.PI / 2 + (r() - 0.5) * 0.7, width: clamp(s * 0.115, 5.4, 13), length: clamp(s * 0.4, 15, 44), mix: 0.16, rag: 0.06, vary: 0.1, edgeWidth: s > 70 ? 5 : 4.2, edgeOpacity: 0.5 + 0.45 * k, dash: clamp(s * 0.3, 14, 36), gap: 8, lights: s > 46 });
  const off = turn * 0.06, dark = tone(0.012 + 0.03 * k), least = 12.6 / s;                          // `least`: the least length of a mark, as a part of the face
  if (s < 30) return;                                                                                // far off: only the lit shape of it
  const soft = { brush: 'bristle', mix: 0.3, dry: 0, rag: 0, cap: 'round', streak: 0, jitter: 0.1 };   // a mark of light that goes into the paint under it
  if (s < 44) {                                                                                      // small: one dark place, the eyes or the mouth (both together make the letter T)
    if (r() < 0.2) mark([off - Math.max(least, 0.34) / 2, 0.06], [off + Math.max(least, 0.34) / 2, 0.06], dark, clamp(s * 0.13, 4.2, 5.4), { opacity: 0.75 });
    else mark([off, 0.02], [off, 0.02 - Math.max(least, 0.3)], dark, clamp(s * 0.15, 4.2, 6), { opacity: 0.8 });
    return;
  }
  // the hollows of the eyes: deep under the brow, each lower at its outer end, as in a face that cries out
  for (const e of [-1, 1]) {
    const near = e * turn < 0 ? 1 : 1 - 0.25 * Math.abs(turn), len = Math.max(least, 0.2 * near), a0 = off + e * 0.055, w = clamp(s * 0.08, 4.2, 11);
    mark([a0, 0.15], [a0 + e * len, 0.09], dark, w, { opacity: 0.95 });
    if (s > 54) mark([a0 + e * 0.015, 0.15 - w / s * 0.85], [a0 + e * Math.max(least, len * 0.85), 0.1 - w / s * 0.8], dark, Math.max(4.2, w * 0.9), { opacity: 0.9 });        // its lower part, so that it is round
    if (s > 56) p.tryStroke({ ...soft, color: tone(0.46 + 0.5 * k), width: clamp(s * 0.06, 4.8, 7), opacity: 0.6, taper: [0.3, 0.4], points: [P(a0 - e * 0.02, 0.235), P(a0 + e * len * 0.55, 0.235), P(a0 + e * (len + 0.05), 0.185)] });   // the brow over it, in the light
  }
  // the nose: the dark under it, and on a big face its ridge in the light
  if (s > 50) mark([off - Math.max(least, 0.12) / 2, -0.075], [off + Math.max(least, 0.12) / 2, -0.075], dark, clamp(s * 0.045, 4, 5.6), { opacity: 0.8 });
  if (s > 84) p.tryStroke({ ...soft, color: tone(0.42 + 0.5 * k), width: clamp(s * 0.055, 4.8, 7), opacity: 0.5, taper: [0.5, 0.2], points: [P(off, 0.1), P(off, 0.1 - Math.max(least, 0.14))] });
  // the mouth: open and round
  { const n = s > 96 ? 3 : s > 46 ? 2 : 1, w = clamp(s * (n === 1 ? 0.12 : 0.1), 4.6, 13), len = Math.max(least, 2.05 * w / s, 0.16 + 0.1 * gape), top = -0.16;
    for (let i = 0; i < n; i++) { const a = off * 1.3 + (i - (n - 1) / 2) * w / s * 0.95, short = n === 3 && i !== 1 ? 0.025 : 0; mark([a, top - short], [a, top - len + short], dark, w, { opacity: 0.95 }); }
    if (s > 70) p.tryStroke({ ...soft, color: tone(0.36 + 0.46 * k), width: 4.8, opacity: 0.5, taper: [0.3, 0.3], points: [P(off * 1.3 - 0.11, top + 0.04), P(off * 1.3, top + 0.06), P(off * 1.3 + 0.11, top + 0.04)] }); }
  // the cheekbones, in the light, and the hollows of the cheeks under them
  if (s > 80) for (const e of [-1, 1]) {
    p.tryStroke({ ...soft, color: tone(0.44 + 0.5 * k), width: clamp(s * 0.05, 4.8, 6), opacity: 0.45, taper: [0.3, 0.3], points: [P(off + e * 0.31, 0.03), P(off + e * 0.2, -0.04)] });
    p.tryStroke({ brush: 'soft', color: dark, width: Math.max(8.4, s * 0.11), opacity: 0.3, points: [P(off + e * 0.24, -0.1), P(off + e * 0.17, -0.3)] });
  }
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, SUN, nA, nB, nC, nD, hash, polar, glare, swirlAngle, fire, flesh, airColor, FINGERS, fingerOutline, THUMB, PALM, inPalm, inFinger, thumbDist, inThumb, inHand, fingerShade, GRIFFITH, face };
