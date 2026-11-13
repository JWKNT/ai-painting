// Shared layout, palette and brush habits for the Fate/stay night painting.
//
// The scene: Unlimited Blade Works. It is not a place in the world. It is the inside of one
// man, made real round him: a dry red plain with no end to it, and in the plain, like the
// markers of graves, every sword that he has ever seen, more than can be counted. The sky is
// the color of a forge, and great wheels with teeth turn in it. He stands on a low hill with
// his back to us: Archer, in his red coat, his hair white, the two short swords that he
// always makes in his hands, one white and one black.
//
// The light is the glow along the edge of the plain, in front of him. So he and all the
// swords are against it: dark, with fire along the edges that are turned to it, and their
// shadows come over the ground toward us.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const HORIZON = 560;
const GLOW = { x: 800, y: 548 };           // the brightest of the light at the edge of the plain
const EYE = 0.57;                          // how high our eye is over the ground, in metres: a thing on the ground at the height y of the picture is (y - HORIZON) / EYE to the metre
const ARCHER = { x: 620, y: 680, s: 2.1 };     // between his feet, and how many units of the picture a centimetre of him is

const nA = noise2(503), nB = noise2(521), nC = noise2(547);

// How strongly the glow reaches a place.
const glow = (x, y, reach = 420) => Math.exp(-Math.pow(Math.hypot(x - GLOW.x, (y - GLOW.y) * 1.3) / reach, 2));

// The sky: nearly black at the top, then the dull red of iron in a fire, then orange, then gold at the edge of the plain.
const skyRamp = grad([[0, '#22100e'], [0.26, '#4a1c12'], [0.5, '#883214'], [0.72, '#c85c1c'], [0.88, '#f09438'], [1, '#ffd070']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / HORIZON + (nA(x / 380, y / 200) - 0.5) * 0.1, 0, 1));
  c = mix(c, '#ff9c3c', 0.5 * glow(x, y, 560));
  return mix(c, '#fff0b0', 0.9 * glow(x, y, 190));
}
// What the smoke and the glare do to a thing at a distance: d is 0 close to us and 1 very far off.
const far = (color, x, y, d) => mix(color, skyColor(x, Math.min(y, HORIZON - 8)), clamp(d, 0, 1) * 0.8);

// The top of the hill that he stands on. The plain is beyond it.
const hillTop = (x) => 668 - 40 * Math.exp(-Math.pow((x - 620) / 380, 2)) + 8 * (nB(x / 120, 3) - 0.5);

// The ground: bright with the glare at the far edge, then red earth, then dark near us.
function ground(x, y) {
  const d = clamp((y - HORIZON) / (H - HORIZON), 0, 1);
  let c = mix('#f0a044', '#8c3c1a', smooth(0, 0.22, d));
  c = mix(c, '#3a1810', smooth(0.2, 1, d) * 0.85);
  return mix(c, '#ffc060', Math.exp(-Math.pow((x - GLOW.x) / (140 + d * 560), 2)) * (0.5 - 0.34 * d));   // the road of the glare on it
}

// A sword that stands in the ground, point down, a little out of true. Its base is at (bx, by) and it stands h high.
//   kind: 'long', 'broad', 'katana' or 'spear'; tilt in radians; d: how far off it is, for the smoke
// It is dark against the glare, with fire along the edge of it that is turned to the glare, and its shadow comes toward us.
function sword(p, bx, by, h, o = {}) {
  const r = p.rng, tilt = o.tilt != null ? o.tilt : r.range(-0.24, 0.24), kind = o.kind || r.pick(['long', 'long', 'long', 'broad', 'katana', 'spear']), d = o.d || 0;
  const ux = Math.sin(tilt), uy = -Math.cos(tilt), nx = -uy, ny = ux;
  const P = (t, off = 0) => [bx + ux * h * t + nx * off, by + uy * h * t + ny * off];
  const side = bx < GLOW.x ? 1 : -1;                                     // the side of it that the glare is on
  const steel = far(mix('#21171a', '#4c3a34', r()), bx, by, d), lit = far(mix('#ff8c30', '#ffc468', r()), bx, by, d * 0.3), hilt = far(mix('#160e10', '#3a2218', r()), bx, by, d);
  const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.08, cap: 'flat' };
  // its shadow: on the ground, straight away from the glare
  if (h >= 16) {
    const sx = bx - GLOW.x, sy = by - HORIZON, sl = Math.hypot(sx, sy) || 1, len = Math.max(13, h * 0.9 * (0.6 + sy / 400));
    p.tryStroke({ brush: 'bristle', color: far('#1c0a0c', bx, by, d), width: Math.max(4.8, h * 0.045), opacity: 0.5, mix: 0.2, dry: 0.05, rag: 0.3, taper: [0, 0.8], points: [[bx, by], [bx + sx / sl * len, by + sy / sl * len]] });
  }
  if (h < 30) { p.tryStroke({ ...line, color: steel, width: 4.8, points: [P(0), P(Math.max(1, 12.4 / h))] }); return; }   // far off it is only a mark
  if (kind === 'spear') {
    const w = Math.max(4.8, h * 0.03);
    p.tryStroke({ ...line, color: hilt, width: w, points: [P(0), P(0.5), P(1)] });
    if (h >= 110) p.tryStroke({ color: lit, width: 4, opacity: 0.55, points: [P(0.05, side * w * 0.3), P(0.95, side * w * 0.3)] });
    p.tryStroke({ ...line, color: far('#b8862c', bx, by, d), width: Math.max(4.8, w * 1.5), points: [P(1 - Math.max(0.04, 12.4 / h)), P(1)] });   // the cap on the end of its shaft
    return;
  }
  const top = kind === 'katana' ? 0.74 : 0.72, bw = Math.max(4.8, h * (kind === 'broad' ? 0.11 : kind === 'katana' ? 0.045 : 0.065)), curve = kind === 'katana' ? h * 0.05 * (r() < 0.5 ? 1 : -1) : 0;
  const detail = h >= 150;
  // the blade
  p.tryStroke({ ...line, color: steel, width: bw, points: [P(0), P(top / 2, curve), P(top)] });
  if (detail) p.tryStroke({ ...line, color: mix(steel, '#0c0608', 0.5), width: Math.max(4.8, bw * 0.45), points: [P(0, -side * bw * 0.26), P(top / 2, curve - side * bw * 0.26), P(top, -side * bw * 0.26)] });   // the half of it that is turned from the glare
  if (detail && kind !== 'katana') p.tryStroke({ color: mix(steel, '#7c5a48', 0.5), width: 4, opacity: 0.7, points: [P(0.04), P(top * 0.9)] });                                                         // the groove down the middle of it
  if (h >= 90) p.tryStroke({ color: lit, width: detail ? 4.6 : 4, opacity: detail ? 0.85 : 0.6, points: [P(0.02, side * bw * 0.4), P(top / 2, curve + side * bw * 0.4), P(top - 0.02, side * bw * 0.4)] });   // the fire along its edge
  // the guard, the grip, the pommel
  const gw = Math.max(12.6, h * (kind === 'katana' ? 0.075 : kind === 'broad' ? 0.3 : 0.24)), gt = Math.max(4.8, h * (kind === 'katana' ? 0.03 : 0.035));
  p.tryStroke({ ...line, color: kind === 'katana' ? hilt : far(mix('#3a2618', '#6c4a24', r()), bx, by, d), width: Math.min(gt, gw / 2.05), points: [P(top, -gw / 2), P(top, gw / 2)] });
  if (detail) p.tryStroke({ color: far('#e0a848', bx, by, d), width: 4, opacity: 0.8, points: [P(top + gt / h * 0.5, side > 0 ? 0 : -gw / 2), P(top + gt / h * 0.5, side > 0 ? gw / 2 : 0)] });           // the light on the guard
  const gripW = Math.max(4.8, h * 0.032), gripEnd = Math.max(0.97, top + 12.6 / h);
  p.tryStroke({ ...line, color: hilt, width: gripW, points: [P(top), P(gripEnd)] });
  if (detail) for (let k = 0; k < 4; k++) { const t = top + (0.97 - top) * (k + 0.5) / 4; p.tryStroke({ color: far('#6c4630', bx, by, d), width: 4, opacity: 0.8, points: [P(t - 0.012, -gripW * 0.9), P(t + 0.012, gripW * 0.9)].map(([x, y], i) => [x + (i ? 1 : -1) * Math.max(0, 6.3 - gripW * 0.9) * nx, y + (i ? 1 : -1) * Math.max(0, 6.3 - gripW * 0.9) * ny]) }); }   // the binding on the grip
  if (h >= 70) { const pw = Math.max(13, h * 0.07); p.tryStroke({ ...line, cap: 'round', color: far(mix('#4c3018', '#9c6c2c', r()), bx, by, d), width: Math.min(pw / 2.05, Math.max(4.8, h * 0.05)), points: [P(gripEnd, -pw / 2), P(gripEnd, pw / 2)] }); }
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, GLOW, EYE, ARCHER, nA, nB, nC, glow, skyColor, far, hillTop, ground, sword };
