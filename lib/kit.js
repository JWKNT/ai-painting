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

// ---- forms painted by light and shadow, with no outline

// Points about `step` apart along the smooth curve through pts.
function curve(pts, step = 5) {
  const P = pts.map((q) => [q[0], q[1]]);
  if (P.length < 2) return P;
  const dense = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 2));
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const at = (c) => 0.5 * (2 * p1[c] + (p2[c] - p0[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (3 * p1[c] - p0[c] - 3 * p2[c] + p3[c]) * t3);
      dense.push([at(0), at(1)]);
    }
  }
  dense.push(P[P.length - 1]);
  const out = [dense[0]];
  let acc = 0;
  for (let i = 1; i < dense.length; i++) {
    acc += Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]);
    if (acc >= step) { out.push(dense[i]); acc = 0; }
  }
  if (acc > 0) out.push(dense[dense.length - 1]);
  return out;
}

// Move a path sideways toward a light, by up to k. The light is a direction [lx, ly], or
// { at: [x, y] } for a light in a place. Where the path runs straight at the light it barely moves.
function toward(pts, k, light) {
  return pts.map((q, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const tl = Math.hypot(tx, ty) || 1;
    tx /= tl; ty /= tl;
    let lx = Array.isArray(light) ? light[0] : light.at[0] - q[0], ly = Array.isArray(light) ? light[1] : light.at[1] - q[1];
    const ll = Math.hypot(lx, ly) || 1;
    const across = (lx * -ty + ly * tx) / ll;
    const amount = Math.sign(across) * Math.min(1, Math.abs(across) * 1.25 + 0.15) * k;
    const out = [q[0] - ty * amount, q[1] + tx * amount];
    if (q.length > 2) out.push(q[2]);
    return out;
  });
}

// A broken line of light along a path: short strokes with gaps between them.
//   width, dash (typical length), gap, opacity, brush
function glint(p, pts, color, o = {}) {
  const r = o.rng || p.rng, w = o.width || 4.2, c = curve(pts, 4);
  const least = Math.ceil((Math.max(12, 2 * w) + 1.5) / 4);
  let i = Math.floor(r() * 3), made = 0;
  while (i + least < c.length) {
    const j = Math.min(c.length - 1, i + Math.max(least, Math.round((o.dash || 28) * (0.5 + r()) / 4)));
    if (p.tryStroke({ brush: o.brush || 'round', color: typeof color === 'function' ? color() : color, width: w, opacity: (o.opacity || 0.85) * (0.6 + 0.4 * r()), taper: [0.3, 0.3], points: [c[i], c[(i + j) >> 1], c[j]] })) made++;
    i = j + Math.round((o.gap != null ? o.gap : 12) * r() / 4);
  }
  return made;
}

// A long form (a limb, a trunk, a fold of cloth) in three tones: a dark stroke, a half-tone
// laid toward the light, and broken light along the lit edge.
//   dark, mid, light, bounce (a faint tone on the far edge), toward (the light), taper, rag, mix
function form(p, pts, w, o) {
  const light = o.toward || [0.8, -0.6];
  const base = { brush: 'bristle', dry: 0, rag: o.rag != null ? o.rag : 0.06, cap: o.cap || 'round', jitter: 0.45, streak: 0.2, taper: o.taper };
  p.stroke({ ...base, color: o.dark, width: w, mix: o.mix != null ? o.mix : 0.03, points: pts });
  if (o.mid) p.tryStroke({ ...base, color: o.mid, width: Math.max(4.5, w * (o.midWidth || 0.5)), opacity: o.midOpacity || 0.85, mix: 0.15, points: toward(pts, w * 0.22, light) });
  if (o.bounce) p.tryStroke({ ...base, color: o.bounce, width: Math.max(4.5, w * 0.3), opacity: o.bounceOpacity || 0.5, mix: 0.2, points: toward(pts, -w * 0.3, light) });
  if (o.light) glint(p, toward(pts, w * 0.42, light), o.light, { width: Math.max(4, Math.min(7, w * 0.16)), dash: o.dash, gap: o.gap, opacity: o.lightOpacity });
}

// A solid form (a body, a limb, a rock) built from rounded parts and painted by its light,
// with no outline: short strokes that follow the form, dark where it turns from the light
// and bright along the edge that faces it.
//   chains  one chain or several; a chain is a list of [x, y, r] joined by tapered capsules
//   tones   { shadow, half, lit, bounce, rim }: bounce is reflected light on the far edge,
//           rim the brightest light on the near one
//   light   [lx, ly] toward the light, or { at: [x, y] }
//   turn    where the light begins across the form, from -1 (shadow edge) to 1 (lit edge)
//   width, length (of the strokes), flow ((x, y) => angle), mix, rag, opacity, vary,
//   base (false: no underlay), lights (false: no second pass on the lit side)
// Returns { at(x, y) }: at gives { d } the distance to the surface, negative inside.
function solid(p, chains, tones, o = {}) {
  if (typeof chains[0][0] === 'number') chains = [chains];
  const r = o.rng || p.rng, light = o.light || [0.8, -0.6];
  const segs = [];
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const c of chains) {
    for (let i = 0; i < c.length - 1; i++) {
      const a = c[i], b = c[i + 1], dx = b[0] - a[0], dy = b[1] - a[1];
      segs.push([a[0], a[1], a[2], dx, dy, b[2] - a[2], dx * dx + dy * dy || 1]);
    }
    for (const q of c) { x0 = Math.min(x0, q[0] - q[2]); y0 = Math.min(y0, q[1] - q[2]); x1 = Math.max(x1, q[0] + q[2]); y1 = Math.max(y1, q[1] + q[2]); }
  }
  const at = (x, y) => {
    let d = 1e9, s = null, R = 1;
    for (const g of segs) {
      const t = clamp(((x - g[0]) * g[3] + (y - g[1]) * g[4]) / g[6], 0, 1);
      const e = Math.hypot(x - g[0] - g[3] * t, y - g[1] - g[4] * t) - (g[2] + g[5] * t);
      if (e < d) { d = e; s = g; R = g[2] + g[5] * t; }
    }
    return { d, s, R };
  };
  const w = o.width || 5.5, margin = o.margin != null ? o.margin : w * 0.42;
  const turn = o.turn != null ? o.turn : 0.05, half = tones.half || mix(tones.shadow, tones.lit, 0.4);
  // Across the form: -1 at the edge turned from the light, 0 in the middle, 1 at the edge that faces it.
  const across = (x, y) => {
    const f = at(x, y);
    const gx = at(x + 1.5, y).d - at(x - 1.5, y).d, gy = at(x, y + 1.5).d - at(x, y - 1.5).d;
    const lx = Array.isArray(light) ? light[0] : light.at[0] - x, ly = Array.isArray(light) ? light[1] : light.at[1] - y;
    const facing = (gx * lx + gy * ly) / ((Math.hypot(gx, gy) || 1) * (Math.hypot(lx, ly) || 1));
    return clamp((f.R + f.d) / Math.max(1, f.R - margin), 0, 1) * clamp(facing * (o.gain || 1.6), -1, 1);
  };
  const colorOf = (b) => {
    const l = smooth(turn - 0.3, 0.95, b);
    let c = l < 0.5 ? mix(tones.shadow, half, l * 2) : mix(half, tones.lit, l * 2 - 1);
    if (tones.bounce) c = mix(c, tones.bounce, smooth(0.45, 1, -b) * (o.bounce != null ? o.bounce : 0.6));
    if (tones.rim) c = mix(c, tones.rim, smooth(0.7, 0.97, b) * (o.rim != null ? o.rim : 0.85));
    return mix(c, r() < 0.5 ? tones.shadow : tones.lit, r() * (o.vary != null ? o.vary : 0.1));
  };
  const stroke = { brush: 'bristle', dry: 0, rag: o.rag != null ? o.rag : 0.08, cap: 'round', jitter: 0.5, streak: 0.3, opacity: o.opacity };
  if (o.base !== false) for (const c of chains) {
    let big = 0;
    for (const q of c) big = Math.max(big, q[2]);
    p.tryStroke({ ...stroke, rag: 0, color: tones.shadow, width: Math.max(4.4, 2 * big - 1), mix: 0.04, streak: 0.15, points: c.map((q) => [q[0], q[1], clamp(q[2] / big, 0.05, 1)]) });
  }
  const flow = o.flow || ((x, y) => { const g = at(x, y).s; return Math.atan2(g[4], g[3]); });
  const fill = (inside, extra) => p.fill({ bounds: [x0, y0, x1, y1], inside, angle: flow, width: w, length: o.length || 26, spacing: 0.5, overlap: 0.5, order: 'random',
    color: (x, y) => colorOf(across(x, y)), stroke: { ...stroke, mix: o.mix != null ? o.mix : 0.2 }, ...extra });
  fill((x, y) => at(x, y).d < -margin);
  if (o.lights !== false) fill((x, y) => at(x, y).d < -margin && across(x, y) > turn + 0.25, { spacing: 0.7 });
  // The brightest light: broken strokes along the outer edges that face the light.
  if (tones.rim && o.edge !== false) for (const c of chains) {
    let run = [];
    const end = () => { if (run.length > 3) glint(p, run, () => mix(tones.rim, tones.lit, r() * 0.35), { width: o.edgeWidth || 4.2, dash: o.dash || 20, gap: o.gap != null ? o.gap : 10, opacity: o.edgeOpacity || 0.85, rng: r }); run = []; };
    for (let i = 0; i < c.length - 1; i++) {
      const a0 = c[i], b0 = c[i + 1], dx = b0[0] - a0[0], dy = b0[1] - a0[1], len = Math.hypot(dx, dy) || 1, n = Math.max(1, Math.round(len / 4));
      for (let k = 0; k <= n; k++) {
        const t = k / n, x = a0[0] + dx * t, y = a0[1] + dy * t, rad = a0[2] + (b0[2] - a0[2]) * t;
        const lx = Array.isArray(light) ? light[0] : light.at[0] - x, ly = Array.isArray(light) ? light[1] : light.at[1] - y;
        const f = (lx * -dy + ly * dx) / (len * (Math.hypot(lx, ly) || 1)), sgn = f >= 0 ? 1 : -1;
        const ex = x - dy / len * sgn * (rad - 1.8), ey = y + dx / len * sgn * (rad - 1.8);
        if (Math.abs(f) > 0.3 && at(x - dy / len * sgn * (rad + 2.5), y + dx / len * sgn * (rad + 2.5)).d > 0) run.push([ex, ey]); else end();
      }
    }
    end();
  }
  return { at };
}

// A soft heap of rounded puffs (cloud, blossom, foliage, smoke), filled with short strokes.
// Each stroke takes its tone from how the puff it lies in faces the light.
//   light     [lx, ly] toward the light, or (x, y) => [lx, ly]
//   tones     (t, x, y) => color, with t from 0 (shadow) to 1 (light)
//   base      y of a flat floor, if the heap has one
//   bias, contrast, fall (darker low down), grain: how the tone is found
//   layers    [[width, length, opacity, margin, spacing], ...]
//   crown     color of a bright edge on the rims that face the light
function mass(p, puffs, o) {
  const r = p.rng, n = o.noise || noise2(o.seed || 7);
  const x0 = Math.min(...puffs.map((q) => q[0] - q[2])), x1 = Math.max(...puffs.map((q) => q[0] + q[2]));
  const top = Math.min(...puffs.map((q) => q[1] - q[2]));
  const bot = Math.min(o.base != null ? o.base : Infinity, Math.max(...puffs.map((q) => q[1] + q[2])));
  const deepest = (x, y) => {
    let best = 0, depth = -Infinity;
    for (let i = 0; i < puffs.length; i++) { const d = puffs[i][2] - Math.hypot(x - puffs[i][0], y - puffs[i][1]); if (d > depth) { depth = d; best = i; } }
    return [puffs[best], depth, best];
  };
  const inside = (m) => (x, y) => y < bot - m * 0.4 && deepest(x, y)[1] > m;
  const L = typeof o.light === 'function' ? o.light : () => o.light;
  const value = (x, y) => {
    const [[cx, cy, rad]] = deepest(x, y), [lx, ly] = L(x, y);
    const facing = ((x - cx) * lx + (y - cy) * ly) / rad, low = (y - top) / Math.max(1, bot - top);
    return clamp((o.bias != null ? o.bias : 0.5) + (o.contrast != null ? o.contrast : 0.5) * facing - (o.fall || 0) * low * low + (n(x / 40, y / 40) - 0.5) * (o.grain != null ? o.grain : 0.25), 0, 1);
  };
  const cxm = (x0 + x1) / 2, cym = bot + (bot - top) * 1.3;
  const flow = o.flow || ((x, y) => Math.atan2(y - cym, x - cxm) + Math.PI / 2 + (n(x / 50 + 9, y / 50) - 0.5) * 0.9);
  for (const [w, len, op, m, sp] of o.layers || [[28, 84, 0.96, 13, 0.42], [15, 52, 0.85, 8, 0.7]]) {
    p.fill({
      inside: inside(m), bounds: [x0, top, x1, bot], width: w, length: len, spacing: sp, overlap: 0.55, angle: flow,
      color: (x, y) => o.tones(value(x + r.range(-4, 4), y + r.range(-4, 4)), x, y),
      stroke: { brush: 'bristle', opacity: op, mix: o.mix != null ? o.mix : 0.25, rag: 0.2, dry: 0.04, ...(o.stroke || {}) },
    });
  }
  if (o.crown) {
    for (let i = 0; i < puffs.length; i++) {
      const [cx, cy, rad] = puffs[i];
      let run = [];
      const flush = () => {
        if (run.length >= 3) p.tryStroke({ brush: 'bristle', color: o.crown, width: Math.max(8, Math.min(18, rad * 0.24)), opacity: o.crownOpacity || 0.7, mix: 0.3, rag: 0.25, dry: 0.1, points: run });
        run = [];
      };
      for (let a = 0; a <= 6.4; a += 0.12) {
        const x = cx + Math.cos(a) * (rad - 6), y = cy + Math.sin(a) * (rad - 6), [lx, ly] = L(x, y);
        const outer = !puffs.some((q, j) => j !== i && Math.hypot(x - q[0], y - q[1]) < q[2] - 9);
        if (outer && y < bot - 8 && Math.cos(a) * lx + Math.sin(a) * ly > (o.crownSpan != null ? o.crownSpan : 0.2)) run.push([x, y]); else flush();
      }
      flush();
    }
  }
  return { x0, x1, top, bot, inside, value };
}

module.exports = { rgb, hex, mix, ramp, hsl, toHsl, shift, rng, noise2, arc, bezier, wave, clamp, lerp, smooth, grad, through, disc, rim, curve, toward, glint, form, solid, mass };
