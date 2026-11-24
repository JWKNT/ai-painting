// Shared layout, palette and brush habits for the 20th Century Boys painting.
//
// The scene: the resurrection of Friend. It is 2015, the first day of the Expo in Tokyo.
// Friend, the man in the mask who made himself the savior of the world, is dead, and his
// funeral is the opening ceremony: his coffin stands upright in a hill of white flowers in
// the middle of the stadium, long crystals go out from behind it like the rays of a sun,
// and over it is his sign, a hand that points up with an eye in it, inside the outline of
// an eye. A hundred thousand people are in the stands. The Pope has come to pray for him.
// Then the dead man gets up. He stands on the carpet in front of his own coffin, in his
// grey suit and red tie, with the white cloth over his head and the sign on it. We see him
// as the Pope does, from a few steps down the carpet.
//
// The light is the low sun of the late afternoon. It is at our right and a little behind us,
// out of the picture. So every white thing is warm on its right side and blue-violet on its
// left, and the shade of the man lies long to the left, up the steps and over the flowers.
//
// All of it is drawn from one eye, 1.3 m over the ground. `at` puts a place of the stadium
// (metres to the right, metres up, metres away) into the picture.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth, lerp, camera } = studio;

const W = 1600, H = 1000;
const CAM = camera({ hz: 620, vx: 800, f: 1100, eye: 1.3 });
const { at, unit, groundAt } = CAM;
const SUN = [0.7725, 0.454, -0.4455];                     // the way to the sun: to the right, up, and toward us (27 degrees over the ground)
const LIGHT = [0.862, -0.507];                            // the same way in the picture
const sunOn = (n) => n[0] * SUN[0] + n[1] * SUN[1] + n[2] * SUN[2];   // how fully a face with the normal n is turned to the sun

const nA = noise2(2015), nB = noise2(2017), nC = noise2(2027), nD = noise2(2029);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// A line through points, straight between them: lin([[0, 3], [2, 1]])(v).
const lin = (pts) => (v) => { if (v <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) if (v <= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], (v - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0])); return pts[pts.length - 1][1]; };

// ---- the stadium

// The edge of the field is an oval: half its width, half its length, and how far off its middle is.
const BOWL = { a: 62, b: 100, Z: 70 };
// A place of the stands: at the angle phi round the field (0 is the far end), d metres out from the edge of the field, at the height Y.
function stand(phi, d, Y) {
  const s = Math.sin(phi), c = Math.cos(phi), nx = s / BOWL.a, nz = c / BOWL.b, nl = Math.hypot(nx, nz);
  return [BOWL.a * s + d * nx / nl, Y, BOWL.Z + BOWL.b * c + d * nz / nl];
}
const standAt = (phi, d, Y) => at(...stand(phi, d, Y));
const TIERS = [{ d0: 0.5, y0: 1.7, d1: 13, y1: 8.6 }, { d0: 15, y0: 10, d1: 31, y1: 24 }];   // the two tiers of seats
const ROOF = { d0: 10, y0: 28, d1: 33, y1: 25.5 };                                           // the roof over them: its front edge and its back
const MASTS = [{ phi: -0.9, d: 42, top: 55 }, { phi: 0.9, d: 42, top: 55 }];                 // the towers of lamps
// The top line of the stadium (the front edge of its roof) at an x of the picture.
const rimLine = (() => {
  const pts = [];
  for (let i = -150; i <= 150; i++) { const [x, y] = standAt(i * 0.01, ROOF.d0, ROOF.y0); pts.push([x, y]); }
  return (x) => { if (x <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], (x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0] || 1)); return pts[pts.length - 1][1]; };
})();
const FIELD_EDGE = 630;                                   // about where the far edge of the field shows
// How fully the sun is on the people at a place of the stands. They face the field. The right side is turned from the sun,
// and the roof puts the highest rows in shade. Below 0 the place is in shade.
function standSun(phi, d, Y) {
  const sn = Math.sin(phi), c = Math.cos(phi), nx = sn / BOWL.a, nz = c / BOWL.b, nl = Math.hypot(nx, nz);
  const face = -(nx / nl) * SUN[0] - (nz / nl) * SUN[2];
  if (face < 0.04) return face - 0.04;
  return d - (27 - Y) / SUN[1] * face > ROOF.d0 ? -0.2 : face;
}
// Is a place of the field in the shade of the stands? The stadium is open at the end behind us, so the sun comes in over that end.
function standShade(X, Z, Y = 0) {
  const hx = SUN[0] / Math.hypot(SUN[0], SUN[2]), hz = SUN[2] / Math.hypot(SUN[0], SUN[2]), rise = SUN[1] / Math.hypot(SUN[0], SUN[2]);
  for (let q = 1; q < 62; q += 1) {
    const x = X + hx * q, z = Z + hz * q, g = Math.sqrt((x / BOWL.a) * (x / BOWL.a) + ((z - BOWL.Z) / BOWL.b) * ((z - BOWL.Z) / BOWL.b));
    if (g < 1) continue;
    if (Math.atan2(Math.abs(x) / BOWL.a, (z - BOWL.Z) / BOWL.b) > 2.36) return false;                 // the open end
    const d = (g - 1) * Math.hypot(x, z - BOWL.Z), high = Y + rise * q;
    if (d > 34) return false;
    if (high < (d < ROOF.d0 ? 1.7 + 0.55 * d : 27.5)) return true;
  }
  return false;
}

// ---- the sky

// Late afternoon, and the sun is behind us: so the sky that we see is deep blue high up and pale near the ground, a little warmer at the right.
const skyRamp = grad([[0, '#2550a2'], [0.3, '#3f74c2'], [0.58, '#74a4dc'], [0.8, '#b4d0ec'], [1, '#e6dcc8']]);
function skyColor(x, y) {
  const t = clamp(y / 540 + (x - 800) / 6400 + (nA(x / 600, y / 300) - 0.5) * 0.05, 0, 1);
  return mix(skyRamp(t), '#f4e4c0', smooth(900, 2000, x) * smooth(200, 540, y) * 0.3);
}
// What the air of the stadium does to a thing far off: d is 0 close to us and 1 very far.
const HAZE = '#b4c4dc';
const far = (color, d) => mix(color, HAZE, clamp(d, 0, 1));

// ---- the hill of flowers

// It is round. `profile` is how wide it is at each height; LOBES are the low heaps where the flowers come out over the ground at its foot.
const MOUND = { Z: 11.6, top: 6.8, profile: lin([[0, 4.25], [1, 4.05], [2, 3.7], [2.8, 3.2], [3.4, 2.6], [4, 2.3], [5, 2.0], [6, 1.65], [6.5, 1.1], [6.8, 0.05]]) };
const LOBES = [[-2.75, 0, 8.0, 1.2, 1.0, 0.9], [-4.0, 0, 8.6, 1.1, 0.7, 1.0], [-4.9, 0, 9.6, 0.9, 0.5, 0.9], [2.65, 0, 7.9, 1.0, 0.85, 0.8], [3.75, 0, 8.7, 1.1, 0.8, 1.0], [-1.95, 0.45, 8.4, 0.62, 0.62, 0.55], [1.98, 0.45, 8.4, 0.62, 0.62, 0.55]];
const NICHE = { half: 2.12, back: 8.3 };                  // the steps go into the hill: no flowers in front of this line, between these sides
// How far a place is from the surface of the hill, more or less: less than 0 inside it.
function heap(X, Y, Z) {
  const th = Math.atan2(X, MOUND.Z - Z), swell = 1 + 0.1 * (nC(th * 1.6 + 9, Y * 0.55) - 0.5) + 0.05 * (nD(th * 4 + 3, Y * 1.4) - 0.5);   // it is not even: it swells here and there
  let g = Y < 0 ? 1 : Y > MOUND.top ? Y - MOUND.top + 0.05 : Math.hypot(X, Z - MOUND.Z) - MOUND.profile(Y) * swell;
  for (const [cx, cy, cz, rx, ry, rz] of LOBES) {
    const u = (X - cx) / rx, v = (Y - cy) / ry, w = (Z - cz) / rz;
    g = Math.min(g, (Math.sqrt(u * u + v * v + w * w) - 1) * Math.min(rx, ry, rz));
  }
  g = Math.max(g, Math.min(NICHE.half - Math.abs(X), NICHE.back - Z));         // the place of the steps is cut out of it
  return Y < 0 ? Math.max(g, -Y) : g;
}
// The place of the hill that shows at a place of the picture, or null: { P, n, sun }.
// n is the way that its surface faces there, and sun how fully the sun is on it (below 0 it is turned away).
function seeHeap(x, y) {
  const dx = (x - CAM.vx) / CAM.f, dy = -(y - CAM.hz) / CAM.f;
  for (let t = 6.4; t < 16; t += 0.07) {
    if (heap(dx * t, CAM.eye + dy * t, t) < 0) {
      let a = t - 0.07, b = t;
      for (let i = 0; i < 6; i++) { const m = (a + b) / 2; if (heap(dx * m, CAM.eye + dy * m, m) < 0) b = m; else a = m; }
      const P = [dx * b, CAM.eye + dy * b, b], e = 0.06;
      let n = [heap(P[0] + e, P[1], P[2]) - heap(P[0] - e, P[1], P[2]), heap(P[0], P[1] + e, P[2]) - heap(P[0], P[1] - e, P[2]), heap(P[0], P[1], P[2] + e) - heap(P[0], P[1], P[2] - e)];
      const l = Math.hypot(...n) || 1;
      n = n.map((v) => v / l);
      if (Math.abs(P[0]) < NICHE.half + 0.03 && P[2] < NICHE.back + 0.03 && P[1] < (Math.abs(P[0]) < STEPS.half ? STEPS.rise * 2 : 0.78)) return null;   // the steps are in front of it there
      return { P, n, sun: sunOn(n) };
    }
  }
  return null;
}
// Is a place in the shade of the hill? (We go from it toward the sun and see if the hill is in the way.)
function heapShade(X, Y, Z) {
  for (let t = 0.25; t < 24; t += 0.2) if (heap(X + SUN[0] * t, Y + SUN[1] * t, Z + SUN[2] * t) < 0) return true;
  return false;
}

// The bed at the top of the hill, with his sign on it: an oval of close white flowers that leans back. In the picture it is this oval.
const BED = { x: 800, y: 182, a: 178, b: 108 };
const inBed = (x, y, k = 1) => { const u = (x - BED.x) / (BED.a * k), v = (y - BED.y) / (BED.b * k); return u * u + v * v < 1; };
// His sign, in the picture, as lines (each a list of points) about its middle. `SIGN.lines` are the outline of the eye, the hand and its cuff;
// `SIGN.lashes` the short lines round the eye; `SIGN.pupil` the eye in the hand.
const SIGN = (() => {
  const cx = 800, cy = 190, A = 136, T = 58, B = 62;
  const top = [], bottom = [];
  for (let i = 0; i <= 24; i++) { const u = -1 + 2 * i / 24; top.push([cx + u * A, cy - T * (1 - u * u)]); bottom.push([cx + u * A, cy + B * (1 - u * u)]); }
  const P = (x, y) => [cx + x, cy + y];
  // the finger goes up through the top of the eye; so the top line is in two parts, one at each side of it
  const fingerL = 6, fingerR = 24, tip = -98;
  const topLeft = top.filter((q) => q[0] < cx + fingerL - 5), topRight = top.filter((q) => q[0] > cx + fingerR + 5);
  const hand = [
    [P(-27, 42), P(-31, 22), P(-33, 4), P(-32, -12), P(-27, -23), P(-21, -22), P(-17, -15), P(-13, -27), P(-7, -31), P(-3, -22), P(-1, -30), P(3, -34), P(fingerL, -33)],   // its left side, and the tops of three fingers that are shut
    [P(-17, -17), P(-17, -1)], [P(-3, -22), P(-2, -6)],                                              // the lines between those fingers
    [P(fingerL, -34), P(fingerL + 1, -70), P(fingerL + 3, tip + 8), P((fingerL + fingerR) / 2, tip), P(fingerR - 2, tip + 8), P(fingerR, -70), P(fingerR + 1, -22)],   // the finger that points
    [P(fingerR + 1, -22), P(31, -4), P(33, 16), P(28, 42)],                                          // its right side, with the thumb
  ];
  const cuff = [[P(-30, 42), P(30, 42)], [P(-31, 42), P(-33, 58)], [P(31, 42), P(33, 58)], [P(-33, 59), P(33, 59)]];
  const eye = [[P(-24, 14), P(-12, 4), P(0, 1), P(12, 4), P(24, 14)], [P(-24, 14), P(-12, 23), P(0, 26), P(12, 23), P(24, 14)]];
  const lashes = [];
  for (let i = 0; i < 9; i++) { const u = -0.86 + 1.72 * i / 8; if (Math.abs(cx + u * A - (cx + 15)) < 22) continue; const x = cx + u * A, y = cy - T * (1 - u * u), nx = u * 0.9, ny = -1; const l = Math.hypot(nx, ny); lashes.push([[x + nx / l * 11, y + ny / l * 11], [x + nx / l * 31, y + ny / l * 31]]); }
  for (let i = 0; i < 9; i++) { const u = -0.86 + 1.72 * i / 8; const x = cx + u * A, y = cy + B * (1 - u * u), nx = u * 0.9, ny = 1; const l = Math.hypot(nx, ny); lashes.push([[x + nx / l * 11, y + ny / l * 11], [x + nx / l * 29, y + ny / l * 29]]); }
  return { cx, cy, A, T, B, lines: [topLeft, topRight, bottom, ...hand, ...cuff], eye, pupil: P(0, 14), lashes };
})();

// The crystals: long six-sided rods of clear stone that go out from behind the hill like the rays of a sun.
// Each has a side (-1 at our left, 1 at our right), an angle over the level, a length and a thickness in metres.
const RAYS = { X: 0, Y: 3.8, Z: 13 };
const PRISMS = [
  { side: -1, a: 0.31, L: 5.2, T: 0.38 }, { side: -1, a: 0.65, L: 6.0, T: 0.42 }, { side: -1, a: 1.05, L: 5.6, T: 0.5 },
  { side: 1, a: 0.38, L: 5.6, T: 0.4 }, { side: 1, a: 0.75, L: 5.4, T: 0.36 }, { side: 1, a: 1.12, L: 5.2, T: 0.45 },
  { side: -1, a: 0.157, L: 6.9, T: 0.8 }, { side: -1, a: 0.47, L: 8.6, T: 0.9 }, { side: -1, a: 0.82, L: 7.0, T: 0.75 },
  { side: 1, a: 0.21, L: 6.6, T: 0.85 }, { side: 1, a: 0.56, L: 8.2, T: 0.8 }, { side: 1, a: 0.91, L: 6.6, T: 0.8 },
];

// ---- the coffin, the steps and the man

// The coffin leans back on the flowers behind him. Its outline in the picture: the head end is at the top.
const COFFIN = (() => {
  const foot = [0, 0.4, 8.0], head = [0, 2.43, 8.85];
  const on = (s, half) => { const Y = lerp(foot[1], head[1], s), Z = lerp(foot[2], head[2], s); return [at(-half, Y, Z), at(half, Y, Z)]; };
  const [hl, hr] = on(1, 0.26), [sl, sr] = on(0.72, 0.43), [fl, fr] = on(0, 0.21);
  return { foot, head, outline: [hl, hr, sr, fr, fl, sl], top: hl[1], bottom: fl[1], shoulder: sl[1] };
})();
const STEPS = { half: 1.6, z: [7.2, 7.5, 7.8], rise: 0.2, back: 8.3 };          // two steps up to the floor that the coffin stands on
const CARPET = { half: 1.2 };
const BLOCK = { wide: 0.46, zf: 7.08, zb: 8.15, yf: 0.32, yb: 0.78 };        // the white block at each side of the steps: its width, its front and back, and the height of its top at each
// The flat faces of the steps and of the two blocks, from the back to the front. Each has its outline in the picture (`quad`),
// `place(x, y)` (the place of the stadium that shows at a place of it) and `n` (the way that it faces).
const FACES = (() => {
  const hf = STEPS.half, [z1, z2] = STEPS.z, rise = STEPS.rise, B = BLOCK;
  const riser = (Z) => (x, y) => [(x - CAM.vx) * Z / CAM.f, CAM.eye - (y - CAM.hz) * Z / CAM.f, Z];
  const level = (Y) => (x, y) => { const Z = CAM.f * (CAM.eye - Y) / Math.max(0.5, y - CAM.hz); return [(x - CAM.vx) * Z / CAM.f, Y, Z]; };
  const side = (X) => (x, y) => { const Z = CAM.f * X / (x - CAM.vx); return [X, CAM.eye - (y - CAM.hz) * Z / CAM.f, Z]; };
  const list = [
    { name: 'floor', quad: [at(-hf, 2 * rise, z2), at(hf, 2 * rise, z2), at(hf, 2 * rise, STEPS.back), at(-hf, 2 * rise, STEPS.back)], place: level(2 * rise), n: [0, 1, 0] },
    { name: 'riser2', quad: [at(-hf, rise, z2), at(hf, rise, z2), at(hf, 2 * rise, z2), at(-hf, 2 * rise, z2)], place: riser(z2), n: [0, 0, -1] },
    { name: 'tread1', quad: [at(-hf, rise, z1), at(hf, rise, z1), at(hf, rise, z2), at(-hf, rise, z2)], place: level(rise), n: [0, 1, 0] },
    { name: 'riser1', quad: [at(-hf, 0, z1), at(hf, 0, z1), at(hf, rise, z1), at(-hf, rise, z1)], place: riser(z1), n: [0, 0, -1] },
  ];
  for (const s of [-1, 1]) {
    const xi = s * hf, xo = s * (hf + B.wide), y0 = at(0, B.yf, B.zf)[1], y1 = at(0, B.yb, B.zb)[1];
    list.push({ name: 'blockSide', s, quad: [at(xi, 0, B.zf), at(xi, B.yf, B.zf), at(xi, B.yb, B.zb), at(xi, 2 * rise, B.zb), at(xi, 2 * rise, z2), at(xi, rise, z2), at(xi, rise, z1), at(xi, 0, z1)], place: side(xi), n: [-s, 0, 0] });
    list.push({ name: 'blockFront', s, quad: [at(xi, 0, B.zf), at(xo, 0, B.zf), at(xo, B.yf, B.zf), at(xi, B.yf, B.zf)], place: riser(B.zf), n: [0, 0, -1] });
    list.push({ name: 'blockTop', s, quad: [at(xi, B.yf, B.zf), at(xo, B.yf, B.zf), at(xo, B.yb, B.zb), at(xi, B.yb, B.zb)], place: (x, y) => { const k = clamp((y0 - y) / (y0 - y1), 0, 1), Z = lerp(B.zf, B.zb, k); return [(x - CAM.vx) * Z / CAM.f, lerp(B.yf, B.yb, k), Z]; }, n: [0, 0.92, -0.39] });
  }
  return list;
})();
// The man: where his feet are, and how many units of the picture a metre of him is. He is 1.78 m tall.
const FRIEND = { X: 0, Z: 6.5, x: 800, feet: at(0, 0, 6.5)[1], s: unit(6.5), tall: 1.78 };
// His outline, as he stands and faces us: is the place (metres to our right of his middle, metres over the ground) inside it?
// It is a plain shape: head, body with the arms a little out from it, and legs. The painting of him has its own, finer shapes.
function inFriend(u, v) {
  if (v < 0 || v > FRIEND.tall) return false;
  const a = Math.abs(u);
  if (v > 1.53) return a < 0.1 * Math.sqrt(Math.max(0, 1 - Math.pow((v - 1.655) / 0.128, 2))) + 0.004;   // the head
  if (v > 1.47) return a < 0.07;                                                                        // the neck and collar
  if (v > 0.74) return a < lerp(0.3, 0.235, smooth(0.74, 1.47, v)) - (v > 1.4 ? (v - 1.4) * 1.6 : 0);   // the body and the arms
  return a < lerp(0.075, 0.2, smooth(0.05, 0.74, v)) && (v > 0.6 || a > 0.012);                         // the legs
}
// Is a place in his shade? We go from it toward the sun until we are level with him, and see if he is there.
function friendShade(X, Y, Z) {
  if (Z <= FRIEND.Z + 0.02) return false;
  const t = (Z - FRIEND.Z) / -SUN[2];
  return inFriend(X + SUN[0] * t - FRIEND.X, Y + SUN[1] * t);
}
// The height of the floor at a place: the ground, the two steps, and the floor at their top.
const floorAt = (X, Z) => (Math.abs(X) > STEPS.half || Z < STEPS.z[0] ? 0 : Z < STEPS.z[1] ? STEPS.rise : STEPS.rise * 2);

// ---- colors

// White flowers: from the blue-violet of their shade to the warm white of the sun on them.
const white = grad([[0, '#5a5e8e'], [0.22, '#8a90b8'], [0.45, '#b6bbd8'], [0.6, '#dcd5d2'], [0.72, '#f2e6cc'], [0.86, '#fff3d4'], [1, '#fffcf0']]);
const GAP = '#39424e';                                    // the dark between the flowers: stalks and leaves in shade

// ---- the kinds of flower. flowers(p) gives the painters of each kind for a painting p.

function flowers(p) {
  const r = p.rng;

  // A small round of one color: rings from its edge in, then strokes that cross in its middle. (`disc` in the kit
  // cannot make its middle with a brush as narrow as these: a stroke must travel 12 units.)
  function round(x, y, R, color, w, opts = {}) {
    let rr = R - w / 2;
    for (; rr >= Math.max(6.05, w + 0.3); rr -= w * 0.62) {
      const a0 = r() * 6.283, pts = [];
      for (let i = 0; i <= 10; i++) pts.push([x + Math.cos(a0 + i * 0.6283) * rr, y + Math.sin(a0 + i * 0.6283) * rr]);
      p.stroke({ brush: 'round', ...opts, color, width: w, points: pts });
    }
    const h = Math.max(6.2, w + 0.2), a0 = r() * Math.PI;
    for (let k = 0; k < 3; k++) { const a = a0 + k * Math.PI / 3; p.stroke({ brush: 'round', ...opts, color, width: w, points: [[x - Math.cos(a) * h, y - Math.sin(a) * h], [x + Math.cos(a) * h, y + Math.sin(a) * h]] }); }
  }

  const YELLOW = grad([[0, '#84744c'], [0.3, '#b8a25c'], [0.6, '#f0dc84'], [0.85, '#fff4b4'], [1, '#fffce4']]);
  // A round head of a chrysanthemum, of the radius R: its body, the sun on its upper right, and the shade on its lower left.
  function mum(x, y, R, t, o = {}) {
    const tone = o.yellow ? YELLOW : white, w = R < 10 ? 4.8 : R < 13 ? 5.2 : 5.8, lit = o.lit !== false;
    round(x, y, R, tone(clamp(t + r.range(-0.05, 0.05), 0, 1)), w, { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.03, cap: 'round', streak: 0.1, jitter: 0.2 });
    const half = Math.max(6.3, R * 0.62), px = -LIGHT[1], py = LIGHT[0];             // across the light
    if (r() < 0.8) {                                                                   // the shade on its lower left: soft, and not the same on each
      const k = r.range(0.34, 0.56), sx = x - LIGHT[0] * R * k, sy = y - LIGHT[1] * R * k;
      p.tryStroke({ brush: 'bristle', mix: 0.45, dry: 0, rag: 0, cap: 'round', streak: 0, jitter: 0.1, color: tone(clamp(t - (lit ? r.range(0.16, 0.3) : r.range(0.1, 0.2)), 0, 1)), width: R < 11 ? 5 : 6, opacity: r.range(0.45, 0.8), taper: [0.3, 0.3], points: [[sx - px * half, sy - py * half], [sx - LIGHT[0] * R * 0.14, sy - LIGHT[1] * R * 0.14], [sx + px * half, sy + py * half]] });
    }
    if (r() < (lit ? 0.75 : 0.35)) {                                                   // the sun on its upper right
      const k = r.range(0.25, 0.45), hx = x + LIGHT[0] * R * k, hy = y + LIGHT[1] * R * k, h2 = half * r.range(0.9, 1.05);
      p.tryStroke({ brush: 'round', color: tone(clamp(t + (lit ? 0.2 : 0.1), 0, 1)), width: 4.2, opacity: r.range(0.45, 0.9), taper: [0.3, 0.3], points: [[hx - px * h2, hy - py * h2], [hx + LIGHT[0] * R * 0.2, hy + LIGHT[1] * R * 0.2], [hx + px * h2, hy + py * h2]] });
    }
    if (R >= 10 && r() < 0.5) for (let i = 0; i < 3; i++) {                            // a few petals that stand out of it
      const a = r.range(0, 6.283), toSun = Math.cos(a) * LIGHT[0] + Math.sin(a) * LIGHT[1];
      p.tryStroke({ brush: 'round', color: tone(clamp(t + 0.12 * toSun, 0, 1)), width: 4.2, opacity: 0.8, taper: [0, 0.5], points: [[x + Math.cos(a) * (R - 6), y + Math.sin(a) * (R - 6)], [x + Math.cos(a) * (R + 6.6), y + Math.sin(a) * (R + 6.6)]] });
    }
  }
  // A big open chrysanthemum that faces us: thin petals that go out from its heart. Those toward the sun are lighter.
  function daisy(x, y, R, t, lit) {
    const n = Math.round(clamp(R * 0.75, 9, 14)), turn = r() * 6.283;
    { const a = Math.atan2(-LIGHT[1], -LIGHT[0]); p.tryStroke({ brush: 'round', color: lit ? '#7c82a8' : '#4c5278', width: 4.6, opacity: 0.5, points: [[x + Math.cos(a - 0.7) * R * 0.9, y + Math.sin(a - 0.7) * R * 0.9], [x + Math.cos(a) * R * 1.02, y + Math.sin(a) * R * 1.02], [x + Math.cos(a + 0.7) * R * 0.9, y + Math.sin(a + 0.7) * R * 0.9]] }); }   // the dark under its edge, on the side away from the sun
    for (let i = 0; i < n; i++) {
      const a = turn + i * 6.283 / n + r.range(-0.12, 0.12), l = R * r.range(0.86, 1.08), toSun = Math.cos(a) * LIGHT[0] + Math.sin(a) * LIGHT[1];
      p.tryStroke({ brush: 'bristle', mix: 0.04, dry: 0, rag: 0.05, cap: 'round', color: white(clamp(t + (lit ? 0.14 : 0.07) * toSun + r.range(-0.05, 0.05), 0, 1)), width: clamp(R * 0.32, 4.8, 6.4), taper: [0.1, 0.35], points: [[x + Math.cos(a) * 1.5, y + Math.sin(a) * 1.5], [x + Math.cos(a) * l, y + Math.sin(a) * l]] });
    }
    if (R >= 13.5) { const a = r.range(-0.5, 0.5); p.tryStroke({ brush: 'round', color: lit ? '#efdc9c' : '#a8a48c', width: 4.2, opacity: 0.65, points: [[x - Math.cos(a) * 6.2, y - Math.sin(a) * 6.2], [x + Math.cos(a) * 6.2, y + Math.sin(a) * 6.2]] }); }
  }
  // A lily: six long petals that come to a point, and a green throat.
  function lily(x, y, R, t, lit) {
    const turn = r() * 6.283;
    for (let i = 0; i < 6; i++) {
      const a = turn + i * 6.283 / 6 + r.range(-0.15, 0.15), l = R * r.range(0.9, 1.1), toSun = Math.cos(a) * LIGHT[0] + Math.sin(a) * LIGHT[1], bend = r.range(-0.3, 0.3);
      p.tryStroke({ brush: 'bristle', mix: 0.04, dry: 0, rag: 0, cap: 'round', color: white(clamp(t + (lit ? 0.12 : 0.06) * toSun, 0, 1)), width: clamp(R * 0.36, 5, 8), taper: [0.25, 0.75], points: [[x, y], [x + Math.cos(a + bend * 0.5) * l * 0.55, y + Math.sin(a + bend * 0.5) * l * 0.55], [x + Math.cos(a + bend) * l, y + Math.sin(a + bend) * l]] });
    }
    { const a = r.range(0, 3.14); p.tryStroke({ brush: 'round', color: lit ? '#d4d8a0' : '#8c9884', width: 4.2, opacity: 0.6, points: [[x - Math.cos(a) * 6.2, y - Math.sin(a) * 6.2], [x + Math.cos(a) * 6.2, y + Math.sin(a) * 6.2]] }); }
  }
  // A leaf between the flowers.
  function leaf(x, y, l, lit) {
    const a = r.range(0, 6.283);
    p.tryStroke({ brush: 'bristle', mix: 0.05, dry: 0, rag: 0, cap: 'round', color: lit ? mix('#3c6238', '#86a850', r() * 0.6) : mix('#27403c', '#3c5a5c', r()), width: r.range(5, 7), opacity: 0.9, taper: [0.3, 0.7], points: [[x, y], [x + Math.cos(a) * l * 0.5 + Math.sin(a) * 3, y + Math.sin(a) * l * 0.5 - Math.cos(a) * 3], [x + Math.cos(a) * l, y + Math.sin(a) * l]] });
  }
  return { round, mum, daisy, lily, leaf };
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = {
  studio, open, W, H, CAM, at, unit, groundAt, SUN, LIGHT, sunOn, nA, nB, nC, nD, hash, lin,
  BOWL, stand, standAt, standSun, standShade, TIERS, ROOF, MASTS, rimLine, FIELD_EDGE, skyColor, HAZE, far,
  MOUND, LOBES, NICHE, heap, seeHeap, heapShade, BED, inBed, SIGN, RAYS, PRISMS, COFFIN, STEPS, CARPET, BLOCK, FACES, FRIEND, inFriend, friendShade, floorAt, white, GAP, flowers,
};
