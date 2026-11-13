// Shared layout, palette and brush habits for the Super Mario Galaxy painting.
//
// The place: Gusty Garden Galaxy. Small round worlds hang in a windy blue sky, far above the
// clouds. Close to us is a world of grass and flowers with one tree on it. Out in the middle
// are the apple worlds, a red one, a green one and a yellow one, and a great caterpillar has
// come out of the red apple and gone into the green one, so that its body is a bridge
// between them. A vine has grown up from the grass world toward the apples. White seeds,
// the Floaty Fluffs, ride the wind, and Mario hangs from one of them, crossing the gap.
//
// It is full day. The light comes from the upper left, and every world is a ball in it:
// bright where it faces the light, dark on the far side, with a little of the sky's blue
// in its shadow.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth, orb } = studio;

const W = 1600, H = 1000;
const SUNWARD = [-0.62, -0.78];            // toward the light, in the picture
const LIGHT3 = (() => { const v = [-0.52, -0.62, 0.59], l = Math.hypot(...v); return v.map((c) => c / l); })();   // and in depth: a little toward us
const HOME = { x: 300, y: 930, r: 340 };   // the grass world close to us
const RED = { x: 1010, y: 440, r: 128 }, GREEN = { x: 1330, y: 285, r: 92 }, GOLD = { x: 1486, y: 566, r: 62 };   // the apples
const MARIO = { x: 694, y: 376 };          // his hand, on the stem of the seed

const nA = noise2(501), nB = noise2(521), nC = noise2(547);

// Sky: the dark blue of great height overhead, then azure, then pale down toward the clouds,
// and brighter toward the upper left, where the sun is.
const skyRamp = grad([[0, '#182f8c'], [0.12, '#2159c2'], [0.38, '#4494e6'], [0.7, '#86c8f5'], [1, '#d2eefc']]);
function skyColor(x, y) {
  const c = skyRamp(clamp(y / H + (nA(x / 420, y / 240) - 0.5) * 0.08, 0, 1));
  return mix(c, '#fff4d2', 0.6 * Math.exp(-Math.pow(Math.hypot(x + 80, y + 60) / 440, 2)));
}
// The wind: the way the air moves at a place, as an angle.
const wind = (x, y) => -0.14 + 0.32 * Math.sin(x / 380 + y / 260) + (nB(x / 300, y / 200) - 0.5) * 0.4;
// What the air does to a thing at a distance: d is 0 close to us and 1 very far off.
const far = (color, x, y, d) => mix(color, skyColor(x, y), clamp(d, 0, 1) * 0.8);

// How a place on a ball faces the light: 1 straight at it, 0 edge on, below 0 turned away.
function lambert(x, y, cx, cy, R) {
  const nx = (x - cx) / R, ny = (y - cy) / R, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
  return nx * LIGHT3[0] + ny * LIGHT3[1] + nz * LIGHT3[2];
}
// The tone for that: `bounce` is the sky's light in the deepest shadow, `shine` the brightest place.
function shade(t, l) {
  if (l < -0.35) return mix(t.shadow, t.bounce, smooth(-0.35, -0.95, l) * 0.8);
  if (l < 0.2) return mix(t.shadow, t.half, smooth(-0.35, 0.2, l));
  if (l < 0.75) return mix(t.half, t.lit, smooth(0.2, 0.75, l));
  return mix(t.lit, t.shine, smooth(0.86, 1, l));
}
// A round world, or a thing made of round parts, painted by its light: strokes that run round
// the place the light strikes, each the tone of the place it covers, and a firm edge.
//   circles  [x, y, r] parts; their union is the shape
//   center   [x, y, r] of the ball whose light is used (default: the first part)
//   far, grain, width, flow, tint: (color, x, y) => color
function ball(p, circles, tones, o = {}) {
  const [cx, cy, R] = o.center || circles[0], d = o.far || 0, n = noise2(Math.round(cx * 3 + cy));
  const tone = (x, y) => { const c = shade(tones, lambert(x, y, cx, cy, R * 1.03) + (o.grain || 0) * (n(x / 14, y / 14) - 0.5)); return far(o.tint ? o.tint(c, x, y) : c, x, y, d); };
  const { depth } = orb(p, circles, tone, { width: o.width || clamp(R / 7, 6, 22), reach: R, flow: o.flow, turnAt: [cx + LIGHT3[0] * R * 0.62, cy + LIGHT3[1] * R * 0.62] });
  return { tone, depth };
}

// A Floaty Fluff: a white seed head, all fine hairs, with a thin stem hanging under it.
function fluff(p, x, y, s, o = {}) {
  const r = p.rng, d = o.far || 0, n = Math.round(10 + 8 * Math.min(1.5, s)), R = 26 * s;
  p.tryStroke({ brush: 'soft', color: '#ffffff', width: Math.max(8.2, R * 0.9), opacity: 0.35 * (1 - d * 0.5), points: [[x - R * 0.9, y], [x + R * 0.9, y]] });
  if (o.stem !== false) p.tryStroke({ color: far('#b8a878', x, y, d), width: 4, opacity: 0.9, points: [[x, y + 2], [x + (o.lean || 0) * R * 1.6, y + Math.max(13, R * 1.6)]] });
  for (let k = 0; k < n; k++) {
    const a = -Math.PI / 2 + (k / n - 0.5) * 5.4 + r.range(-0.12, 0.12), len = Math.max(12.4, R * r.range(0.8, 1.1)), lit = Math.cos(a) * SUNWARD[0] + Math.sin(a) * SUNWARD[1];
    p.tryStroke({ color: far(mix('#b4c6ec', '#ffffff', clamp(0.6 + 0.5 * lit, 0, 1)), x, y, d), width: 4, opacity: 0.9, taper: [0, 0.4], points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
  }
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, SUNWARD, LIGHT3, HOME, RED, GREEN, GOLD, MARIO, nA, nB, nC, skyColor, wind, far, lambert, shade, ball, fluff };
