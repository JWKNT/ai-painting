// Shared layout, palette and brush habits for the Final Fantasy X painting.
//
// The scene: the ruins of Zanarkand, at the end of the journey. "Listen to my story. This
// may be our last chance." The party has made its last camp on a hill above the dead city,
// a thousand years after Sin broke it. The sun goes down behind the ruins: round ribbed
// towers that lean, great curved ribs that stand out of the water, the shell of the stadium
// far off. The dead city is full of pyreflies. Six of them sit round the fire and do not
// speak. Tidus has gone up to the edge of the hill by himself to look at it. Their weapons
// stand together in the ground near us: his sword, her staff, the ball, the lance, the great
// blade with its jug, the doll.
//
// The sun is at the edge of the world behind the city, so everything is against its light:
// dark, with fire along the edges that face it. The camp fire is the only other light.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, through, clamp, shape } = studio;

const W = 1600, H = 1000;
const HORIZON = 432;
const GLOW = { x: 930, y: 428 };           // where the sun goes down
const FIRE = { x: 1050, y: 800 };          // the camp fire
const TIDUS = { x: 1322, y: 500 };         // where he stands, at the edge of the hill

const nA = noise2(1201), nB = noise2(1213), nC = noise2(1229);

// How strongly the last light of the sun reaches a place.
const glow = (x, y, reach = 420) => Math.exp(-Math.pow(Math.hypot(x - GLOW.x, (y - GLOW.y) * 1.4) / reach, 2));
// How strongly the camp fire lights a place on the ground near it.
const fireOn = (x, y, reach = 260) => Math.exp(-Math.pow(Math.hypot(x - FIRE.x, (y - FIRE.y) * 1.8) / reach, 2));

// The sky: heavy cloud overhead, dark as slate, and under it a band of fire along the edge of the world.
const skyRamp = grad([[0, '#1b1a2a'], [0.3, '#2c2638'], [0.55, '#5a3238'], [0.74, '#b04c2a'], [0.88, '#f08a30'], [1, '#ffcc66']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / HORIZON + (nA(x / 380, y / 200) - 0.5) * 0.08, 0, 1));
  c = mix(c, '#ff9a40', 0.5 * glow(x, y, 600));
  return mix(c, '#fff2b8', 0.9 * glow(x, y, 200));
}
// What the evening air does to a thing at a distance: d is 0 close to us and 1 very far off.
const far = (color, x, y, d) => mix(color, skyColor(x, Math.min(y, HORIZON - 6)), clamp(d, 0, 1) * 0.82);

// The edge of our hill: beyond it and below it is the water of the dead city. At the right the hill goes up, above the edge of the world.
const ridgeLine = through([[0, 664], [300, 640], [620, 612], [900, 600], [1080, 574], [1240, 520], [1400, 448], [1600, 392]]);
const ridge = (x) => ridgeLine(x) + 7 * (nB(x / 60, 3) - 0.5) + 3 * (nC(x / 17, 5) - 0.5);
const SHORE = 452;                         // the far edge of the water, under the far city

// The water: it holds the sky. It is brightest under the place where the sun goes down.
function waterColor(x, y) {
  const d = clamp((y - SHORE) / 200, 0, 1), streak = nC(x / (40 + 140 * d), y / 4);
  let c = mix(skyColor(x, HORIZON - 16 - d * 300), '#3a1c2c', 0.3 + 0.3 * d);
  c = mix(c, streak > 0.5 ? '#ffc060' : '#1c0e1c', Math.abs(streak - 0.5) * (0.7 - 0.3 * d));
  return mix(c, '#fff0b0', Math.exp(-Math.pow((x - GLOW.x) / (60 + d * 330), 2)) * (0.75 - 0.4 * d));
}

// A tower of the dead city. It is round about the line from its foot a to its top b, and prof
// gives its radius along that line: [[t, r], ...]. It has ribs round it, like the hoops of a
// barrel, dark openings, and a broken top. The sun is behind it, so it is dark, with fire
// down the side of it that is turned to the place where the sun goes down.
//   d: how far off it is; ribs: how many; windows: rows of openings, as places along it; cap: the length of a spire on its top
function tower(p, a, b, prof, d, o = {}) {
  const r = p.rng, dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const R = (t) => { t = clamp(t, 0, 1); let i = 0; while (i < prof.length - 2 && prof[i + 1][0] < t) i++; const [t0, r0] = prof[i], [t1, r1] = prof[i + 1]; return r0 + (r1 - r0) * (0.5 - 0.5 * Math.cos(Math.PI * clamp((t - t0) / (t1 - t0 || 1), 0, 1))); };
  const at = (t, off) => [a[0] + dx * t + nx * off, a[1] + dy * t + ny * off], mid = at(0.5, 0), side = (GLOW.x - mid[0]) * nx + (GLOW.y - mid[1]) * ny > 0 ? 1 : -1;   // which side of it the sun is on
  const left = [], right = [], N = 16;
  for (let i = 0; i <= N; i++) { const t = i / N, jag = o.broken && i === N ? 0 : 1; left.push(at(t, -R(t) * jag)); right.push(at(t, R(t) * jag)); }
  const tint = (c, k = 1) => far(c, mid[0], mid[1], d * k);
  const tones = { shadow: tint('#140c14'), half: tint('#2a1a20'), lit: tint('#70402c'), rim: tint('#ffb464', 0.5), bounce: tint('#2a2038') };
  const w = clamp(Math.max(...prof.map((q) => q[1])) * 0.16, 5, 11);
  shape(p, [...left, ...right.reverse()], tones, { light: { at: [GLOW.x, GLOW.y] }, turn: 0.35, width: w, length: w * 4, vary: 0.08, flow: () => Math.atan2(uy, ux) + r.range(-0.05, 0.05), dash: 30, gap: 9, edgeOpacity: 0.85 });
  const line = { brush: 'bristle', mix: 0.1, dry: 0.03, rag: 0.15, cap: 'round' };
  // its ribs
  const ribs = o.ribs != null ? o.ribs : Math.max(2, Math.round(len / 34));
  for (let k = 1; k <= ribs; k++) {
    const t = k / (ribs + 1), rr = R(t) * 1.04, bow = rr * 0.16 * (uy < 0 ? 1 : -1);
    if (rr * 2 < 12.4) continue;
    const pts = [-1, -0.5, 0, 0.5, 1].map((s) => at(t + bow * (1 - s * s) / len, rr * s));
    p.tryStroke({ ...line, color: tint('#0c0810'), width: Math.max(4.8, w * 0.7), opacity: 0.8, points: pts });
    const lit = [0.25, 0.6, 0.98].map((s) => at(t + (bow * (1 - s * s) - 3) / len, rr * s * side));
    if (d < 0.5 && Math.hypot(lit[2][0] - lit[0][0], lit[2][1] - lit[0][1]) >= 12.4) p.tryStroke({ color: tint('#f09a50', 0.5), width: 4, opacity: 0.7, points: lit });
  }
  // its openings
  for (const t of o.windows || []) {
    const rr = R(t), n = Math.max(2, Math.round(rr * 2 / 22)), tall = Math.max(12.6, rr * 0.5);
    for (let k = 0; k < n; k++) { const s = -0.7 + 1.4 * (k + 0.5) / n; if (r() < 0.25) continue; p.tryStroke({ ...line, color: tint('#07050a'), width: Math.max(4.8, Math.min(9, rr * 0.3)), opacity: 0.85, points: [at(t - tall / 2 / len, rr * s), at(t + tall / 2 / len, rr * s)] }); }
  }
  // a spire on its top, or the jags of its broken top
  if (o.cap) p.tryStroke({ ...line, color: tint('#140c14'), width: Math.max(4.8, R(1) * 0.9), taper: [0, 0.9], points: [at(1 - 4 / len, 0), at(1 + o.cap / len * 0.5, 0), at(1 + o.cap / len, 0)] });
  if (o.broken) for (let k = 0; k < 5; k++) { const s = r.range(-0.9, 0.9), l = Math.max(13, R(0.95) * r.range(0.3, 0.9)); p.tryStroke({ ...line, cap: 'flat', color: tint('#1c1218'), width: Math.max(4.8, R(0.95) * 0.26), points: [at(0.96, R(0.95) * s), at(0.96 + l / len, R(0.95) * s * 0.9)] }); }
  // what the water shows of it
  if (o.water != null) for (let k = 0; k < 7; k++) { const y = o.water + 4 + k * (6 + R(0) * 0.12), half = Math.max(6.4, R(0) * (1.1 - k * 0.1) * r.range(0.6, 1)); p.tryStroke({ ...line, color: tint('#180e16'), width: Math.max(4.8, 4 + R(0) * 0.06), opacity: 0.65 - k * 0.07, rag: 0.3, points: [[a[0] - half + r.range(-4, 4), y], [a[0] + half + r.range(-4, 4), y + r.range(-1, 1)]] }); }
}
// One of the great ribs that stand out of the ruins: long, curved, like the blade of a scythe. pts is its middle line and wid its half width at each of those places.
function rib(p, pts, wid, d) {
  const r = p.rng, edge = (k) => pts.map(([x, y], i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [x - (b[1] - a[1]) / l * wid[i] * k, y + (b[0] - a[0]) / l * wid[i] * k]; });
  const mid = pts[Math.floor(pts.length / 2)], tint = (c, k = 1) => far(c, mid[0], mid[1], d * k);
  const seg = (x, y) => { let best = 0, dd = 1e9; pts.forEach(([px, py], i) => { const q = Math.hypot(x - px, y - py); if (q < dd && i < pts.length - 1) { dd = q; best = i; } }); return Math.atan2(pts[best + 1][1] - pts[best][1], pts[best + 1][0] - pts[best][0]); };
  shape(p, [...edge(1), ...edge(-1).reverse()], { shadow: tint('#120a12'), half: tint('#26181e'), lit: tint('#6c3c2a'), rim: tint('#ffb464', 0.5), bounce: tint('#2a2038') }, { light: { at: [GLOW.x, GLOW.y] }, turn: 0.35, width: 6.5, length: 30, vary: 0.08, flow: seg, dash: 40, gap: 10, edgeOpacity: 0.9 });
  for (let i = 1; i < pts.length - 1; i += 1) { const [x, y] = pts[i], a = seg(x, y) + Math.PI / 2, w = wid[i]; if (w * 2 >= 12.6) p.tryStroke({ brush: 'bristle', color: tint('#0a060c'), width: 5, opacity: 0.6, mix: 0.1, dry: 0.03, rag: 0.2, points: [[x - Math.cos(a) * w, y - Math.sin(a) * w], [x + Math.cos(a) * w, y + Math.sin(a) * w]] }); }   // the joints of it
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, GLOW, FIRE, TIDUS, SHORE, nA, nB, nC, glow, fireOn, skyColor, far, ridge, waterColor, tower, rib };
