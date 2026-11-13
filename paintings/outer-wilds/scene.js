// Shared layout, palette and brush habits for the Outer Wilds painting.
//
// The scene: evening on Timber Hearth. A traveler sits at a campfire on a cliff beside the
// ship, under a sun that has swollen into a red giant. The Hourglass Twins cross its face,
// Giant's Deep, the Attlerock, Brittle Hollow and the Interloper hang in the sky.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, arc } = studio;

const W = 1600, H = 1000;
const SUN = { x: 1010, y: 640, r: 250 };
const HORIZON = 735;
const GIANTS_DEEP = { x: 430, y: 240, r: 115 };
const ATTLEROCK = { x: 825, y: 150, r: 46 };
const BRITTLE = { x: 1300, y: 210, r: 52 };
const LANTERN = { x: 1392, y: 152, r: 13 };
const BRAMBLE = { x: 632, y: 84, r: 17 };

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// A color ramp with stops at chosen positions: grad([[0, '#000'], [0.3, '#f00'], [1, '#fff']])(t).
function grad(stops) {
  return (t) => {
    if (t <= stops[0][0]) return stops[0][1];
    for (let i = 1; i < stops.length; i++) {
      if (t <= stops[i][0]) return mix(stops[i - 1][1], stops[i][1], (t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]));
    }
    return stops[stops.length - 1][1];
  };
}

const nA = noise2(11), nB = noise2(23), nC = noise2(37);

// Sky: the red giant's glow falls off through orange, crimson and violet into deep blue.
const skyRamp = grad([
  [0.00, '#ffbf66'], [0.05, '#fa9440'], [0.12, '#e2622f'], [0.20, '#b03a45'], [0.29, '#752c5e'],
  [0.40, '#432562'], [0.52, '#221f52'], [0.66, '#131a40'], [0.82, '#0b112b'], [1.00, '#060a1c'],
]);

function glowDistance(x, y) {
  return Math.hypot((x - SUN.x) * 0.8, (y - SUN.y) * 1.25);   // the glow hugs the horizon
}

function skyColor(x, y) {
  const t = (glowDistance(x, y) - SUN.r) / 1000 + (nA(x / 300, y / 300) - 0.5) * 0.09;
  let c = skyRamp(clamp(t, 0, 1));
  const low = Math.exp(-Math.max(0, HORIZON - y) / 110);
  const away = smooth(380, 950, Math.hypot(x - SUN.x, y - SUN.y));
  c = mix(c, '#2b4a78', 0.42 * low * away);   // a band of cool twilight along the far horizon
  return c;
}

// Direction of a circle around the sun: the whole sky is brushed as if it turned about it.
function aroundSun(x, y) {
  return Math.atan2(y - SUN.y, x - SUN.x) + Math.PI / 2;
}

// Fill a small disc with one color using circular strokes (a loop of radius r spans 2r,
// so each loop needs r >= brush width), and a short cross for the middle.
function loopDisc(p, cx, cy, R, color, w, opts = {}) {
  const rnd = p.rng;
  let r = R - w / 2;
  for (; r >= w + 0.3; r -= w * 0.62) {
    const a0 = rnd() * 6.283;
    p.stroke({ brush: 'round', ...opts, color, width: w, points: arc(cx, cy, r, a0, a0 + 6.283, Math.max(9, Math.ceil(r * 0.7))) });
  }
  const left = r + w * 0.62 - w / 2;   // radius still bare in the middle
  if (left > 0.5) {
    const h = Math.max(w + 0.3, left);
    const a0 = rnd() * 3.14;
    for (let k = 0; k < 4; k++) {   // four strokes through the middle, like spokes
      const a = a0 + k * Math.PI / 4;
      p.line(cx - Math.cos(a) * h, cy - Math.sin(a) * h, cx + Math.cos(a) * h, cy + Math.sin(a) * h, { brush: 'round', ...opts, color, width: w });
    }
  }
}

// Short arcs laid end to end around a circle, each colored by its angle: a clean painted rim.
function rimArcs(p, cx, cy, R, w, colorAt, opts = {}) {
  const r = R - w / 2;
  const minSeg = 2 * Math.asin(Math.min(1, (2 * w + 1.5) / (2 * r)));
  const n = Math.max(3, Math.floor(6.283 / Math.max(minSeg, opts.seg || 0.5)));
  const seg = 6.283 / n;
  const from = opts.from != null ? opts.from : 0, to = opts.to != null ? opts.to : 6.283;
  for (let i = 0; i < n; i++) {
    const a = from + i * seg;
    if (a + seg * 0.5 > to + 1e-6) break;
    const color = colorAt(a + seg / 2);
    if (!color) continue;
    p.stroke({ brush: 'round', ...(opts.stroke || {}), color, width: w, points: arc(cx, cy, r, a - seg * 0.12, a + seg * 1.12, 7) });
  }
}

// ---- the land

// How strongly a place sits under the sun's glow, by its x: 1 beneath the sun, 0 far to the side.
const warmth = (x) => Math.exp(-Math.pow((x - SUN.x) / 430, 2));

// Three ridges of forest stepping back to the horizon, farthest first.
const ridge1 = (x) => HORIZON + 13 * Math.sin(x / 210 + 1) + 18 * (nA(x / 90, 7) - 0.5) + 6 * (nB(x / 25, 3) - 0.5);
const ridge2 = (x) => 778 + 22 * Math.sin(x / 260 + 2.2) + 28 * (nA(x / 120, 19) - 0.5) + 8 * (nB(x / 30, 9) - 0.5);
const ridge3 = (x) => 846 + 30 * Math.sin(x / 330 + 0.7) + 32 * (nA(x / 150, 31) - 0.5) + 10 * (nB(x / 35, 15) - 0.5);

// A line through points, eased between them.
function through(pts) {
  return (x) => {
    if (x <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      if (x <= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], smooth(pts[i - 1][0], pts[i][0], x));
    }
    return pts[pts.length - 1][1];
  };
}

// The near ground: a cliff top running from the left to its edge above the valley, and a
// slope rising out of the bottom right corner.
const cliffLine = through([[0, 840], [200, 850], [400, 864], [560, 873], [720, 876], [880, 880], [965, 886], [1004, 899], [1044, 940], [1090, 1014], [1128, 1100]]);
const cliffTop = (x) => (x > 1128 ? H + 50 : cliffLine(x) + 5 * (nB(x / 22, 50) - 0.5) * (x < 1004 ? 1 : 0));
const slopeLine = through([[1150, 1110], [1250, 1046], [1350, 992], [1450, 952], [1600, 922]]);
const slopeTop = (x) => (x < 1150 ? H + 50 : slopeLine(x) + 6 * (nB(x / 26, 70) - 0.5));
const FIRE = { x: 612, y: 900 };

// A tall Timber Hearth pine: a bare trunk with its boughs gathered toward the top.
//   rim / rimSide: color and side (+1 right, -1 left) of the light catching its edge
function pine(p, x, base, h, o = {}) {
  const r = p.rng, lean = o.lean || 0, crown = o.crown || 0.58, spread = o.spread || 0.15;
  const darks = o.darks || ['#0b101d', '#0f1a24', '#0d1520'];
  const top = base - h, tw = Math.max(5, h * 0.034);
  const xAt = (y) => x + lean * (base - y);
  p.stroke({ brush: 'bristle', color: o.trunk || '#0c0d1a', width: tw, taper: [0, 0.9], rag: 0, cap: 'round', mix: 0, dry: 0, points: [[x, base + 4], [xAt(base - h * 0.5), base - h * 0.5], [xAt(top + 6), top + 6]] });
  if (o.rim && o.rimSide) {
    p.tryStroke({ color: o.rim, width: 4, opacity: 0.45, taper: [0.2, 0.4], points: [[x + o.rimSide * tw * 0.42, base - 8], [xAt(top + h * crown * 0.9) + o.rimSide * tw * 0.3, top + h * crown * 0.9]] });
  }
  const tiers = Math.max(3, Math.round(h * crown / Math.max(15, h * 0.05)));
  for (let i = 0; i < tiers; i++) {
    const f = (i + 0.6) / tiers, y = top + h * crown * f, x0 = xAt(y);
    const reach = h * spread * (0.16 + 0.84 * Math.pow(f, 0.75));
    const bw = Math.max(4.5, tw * (0.45 + 0.5 * f));
    for (const s of [-1, 1]) {
      const rr = reach * r.range(0.78, 1.15), droop = rr * r.range(0.28, 0.52);
      p.tryStroke({ brush: 'bristle', color: r.pick(darks), width: bw, taper: [0, 0.75], rag: 0.2, mix: 0, dry: 0, streak: 0.1, jitter: 0.25, points: [[x0, y], [x0 + s * rr * 0.5, y + droop * 0.25], [x0 + s * rr, y + droop]] });
      const n = Math.max(1, Math.round(rr / 12));
      for (let k = 0; k < n; k++) {   // needles hanging from the bough
        const g = (k + r()) / n, nx = x0 + s * rr * g, ny = y + droop * g * g;
        const len = Math.max(13.5, bw * 2.7) * r.range(1, 1.5), nw = Math.max(4.5, bw * 0.85);
        p.tryStroke({ brush: 'bristle', color: r.pick(darks), width: nw, taper: [0, 0.8], rag: 0.3, mix: 0, dry: 0, streak: 0.1, jitter: 0.25, points: [[nx, ny - 2], [nx + s * len * 0.2, ny + len * 0.6], [nx + s * len * 0.34, ny + len]] });
      }
      if (o.rim && s === o.rimSide && rr > 14 && r() < 0.55) {   // light catching the outer part of some boughs
        const a = r.range(0.35, 0.6);
        p.tryStroke({ color: o.rim, width: 4, opacity: r.range(0.3, 0.7), taper: [0.3, 0.4], points: [[x0 + s * rr * a, y + droop * a * a * 0.6 - bw * 0.5], [x0 + s * rr * (a + 1) / 2, y + droop * 0.55 - bw * 0.45], [x0 + s * rr, y + droop - 1]] });
      }
    }
  }
}

// A far-off conifer: one stroke, wide at the foot and thinning to the tip.
function spire(p, x, base, h, w, color, opacity = 1) {
  const tilt = p.rng.range(-0.09, 0.09) * h;
  return p.tryStroke({ brush: 'bristle', color, width: Math.max(4.4, w), opacity, taper: [0, 1], rag: 0.25, mix: 0, dry: 0, streak: 0.1, jitter: 0.3, cap: 'round', points: [[x, base], [x + tilt * 0.4, base - h * 0.5], [x + tilt, base - h]] });
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = {
  studio, open, W, H, SUN, HORIZON, GIANTS_DEEP, ATTLEROCK, BRITTLE, LANTERN, BRAMBLE,
  clamp, lerp, smooth, grad, nA, nB, nC, skyRamp, skyColor, glowDistance, aroundSun, loopDisc, rimArcs,
  warmth, ridge1, ridge2, ridge3, through, cliffTop, slopeTop, FIRE, pine, spire,
};
