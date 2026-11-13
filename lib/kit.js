// Painter's kit: colors, randomness, noise and path shapes for painting scripts.
// Nothing here touches the canvas; it only helps decide where strokes go.
'use strict';
const { rng32 } = require('../engine/paint-engine.js');

// ---- color

function rgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function hex(r, g, b) {
  if (Array.isArray(r)) [r, g, b] = r;
  const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return '#' + c(r) + c(g) + c(b);
}

// Blend two hex colors; t = 0 gives a, t = 1 gives b.
function mix(a, b, t) {
  const p = rgb(a), q = rgb(b);
  return hex(p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t);
}

// Blend along a list of colors; t runs 0..1 across the whole list.
function ramp(colors, t) {
  const f = Math.max(0, Math.min(1, t)) * (colors.length - 1);
  const i = Math.min(colors.length - 2, Math.floor(f));
  return mix(colors[i], colors[i + 1], f - i);
}

// h in degrees, s and l in 0..1.
function hsl(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => {
    t = (t + 1) % 1;
    return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p;
  };
  return hex(f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255);
}

function toHsl(color) {
  const [r, g, b] = rgb(color).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

// Nudge a color: degrees of hue, and saturation / lightness offsets in 0..1 units.
function shift(color, dh = 0, ds = 0, dl = 0) {
  const [h, s, l] = toHsl(color);
  return hsl(h + dh, Math.max(0, Math.min(1, s + ds)), Math.max(0, Math.min(1, l + dl)));
}

// ---- randomness

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

// Seeded random source: r() in [0,1), plus r.range, r.int, r.pick, r.gauss, r.shuffle.
function rng(seed) {
  const r = rng32(typeof seed === 'string' ? hashString(seed) : seed >>> 0);
  r.range = (a, b) => a + (b - a) * r();
  r.int = (a, b) => Math.floor(a + (b - a + 1) * r());
  r.pick = (list) => list[Math.floor(r() * list.length)];
  r.gauss = () => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
  r.shuffle = (list) => {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };
  return r;
}

// Smooth 2D noise in 0..1; one unit of x or y is one bump.
function noise2(seed) {
  const s = (typeof seed === 'string' ? hashString(seed) : seed) | 0;
  const h = (ix, iy) => {
    let n = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + s) | 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  };
  return (x, y) => {
    const ix = Math.floor(x), iy = Math.floor(y);
    let fx = x - ix, fy = y - iy;
    fx = fx * fx * (3 - 2 * fx);
    fy = fy * fy * (3 - 2 * fy);
    const a = h(ix, iy), b = h(ix + 1, iy), c = h(ix, iy + 1), d = h(ix + 1, iy + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
}

// ---- path shapes (lists of [x, y] the brush is drawn through)

function arc(cx, cy, r, a0, a1, n) {
  n = n || Math.max(3, Math.ceil(Math.abs(a1 - a0) * r / 12) + 1);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = a0 + (a1 - a0) * i / (n - 1);
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}

function bezier(p0, p1, p2, p3, n = 12) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), u = 1 - t;
    const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    pts.push([a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]]);
  }
  return pts;
}

// A line from a to b with a sine wave across it.
function wave(x1, y1, x2, y2, amp, cycles, n = 24) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len, pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), w = Math.sin(t * cycles * Math.PI * 2) * amp;
    pts.push([x1 + dx * t + nx * w, y1 + dy * t + ny * w]);
  }
  return pts;
}

// ---- small math, and shapes that take several strokes

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

// A line through points, eased between them: through([[0, 10], [100, 40]])(x).
function through(pts) {
  return (x) => {
    if (x <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      if (x <= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], smooth(pts[i - 1][0], pts[i][0], x));
    }
    return pts[pts.length - 1][1];
  };
}

// Fill a small disc with one color: circular strokes from the rim inward (a loop of radius r
// spans 2r, so each loop needs r >= brush width), then four strokes through the middle.
function disc(p, cx, cy, R, color, w, opts = {}) {
  const rnd = p.rng;
  let r = R - w / 2;
  for (; r >= w + 0.3; r -= w * 0.62) {
    const a0 = rnd() * 6.283;
    p.stroke({ brush: 'round', ...opts, color, width: w, points: arc(cx, cy, r, a0, a0 + 6.283, Math.max(9, Math.ceil(r * 0.7))) });
  }
  const bare = r + w * 0.62 - w / 2;
  if (bare > 0.5) {
    const h = Math.max(w + 0.3, bare), a0 = rnd() * 3.14;
    for (let k = 0; k < 4; k++) {
      const a = a0 + k * Math.PI / 4;
      p.line(cx - Math.cos(a) * h, cy - Math.sin(a) * h, cx + Math.cos(a) * h, cy + Math.sin(a) * h, { brush: 'round', ...opts, color, width: w });
    }
  }
}

// Short arcs laid end to end around a circle, each colored by its angle: a painted rim.
// opts: seg (radians per arc), from, to, stroke (other stroke options).
function rim(p, cx, cy, R, w, colorAt, opts = {}) {
  const r = R - w / 2;
  const least = 2 * Math.asin(Math.min(1, (2 * w + 1.5) / (2 * r)));
  const from = opts.from != null ? opts.from : 0, to = opts.to != null ? opts.to : 6.283;
  const n = Math.max(1, Math.floor((to - from) / Math.max(least, opts.seg || 0.5)));
  const seg = (to - from) / n;
  for (let i = 0; i < n; i++) {
    const a = from + i * seg, color = colorAt(a + seg / 2);
    if (!color) continue;
    p.tryStroke({ brush: 'round', ...(opts.stroke || {}), color, width: w, points: arc(cx, cy, r, a - seg * 0.12, a + seg * 1.12, 7) });
  }
}

module.exports = { rgb, hex, mix, ramp, hsl, toHsl, shift, rng, noise2, arc, bezier, wave, clamp, lerp, smooth, grad, through, disc, rim };
