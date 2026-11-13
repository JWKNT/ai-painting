// The village of the hollows, and the cliff behind it. The village is one living thing: a
// trunk of twisted cords as thick as a tower, and on it a cap so wide that it goes out of the
// picture. We are below it, so we see the under side of the cap as a great oval, dark near
// the trunk, with the trunk going up into the middle of it. The light is on the left of the
// dome and on the left of the trunk. Lamps hang in the shade under the cap.
'use strict';
const { studio, open, W, VILLAGE, shaft, far, turned, nA, nB, nC, MOSS, CRUST } = require('./scene');
const { mix, wave, clamp, smooth, glint } = studio;

const p = open('village');
const r = p.rng;
const V = VILLAGE, D = 0.26, ry = V.reach * V.flat, L = [-0.7, -0.714];      // the light on the village: from the shaft, at its left, and from above
const u = (x) => (x - V.x) / V.reach;
const rim = (x, side) => V.under + side * ry * Math.sqrt(Math.max(0, 1 - u(x) * u(x)));   // side -1: the near edge of the cap, which is the upper one; 1: the far edge
const trunkProf = [[0, 196], [0.1, 150], [0.36, 110], [0.62, 118], [0.84, 160], [1, 236]];
const bristle = { brush: 'bristle', mix: 0.2, dry: 0.04, rag: 0.25 };

// ---------------------------------------------------------------- the cliff
{
  const d = 0.56, foot = (x) => 752 + 10 * (nA(x / 90, 4) - 0.5);
  const edge = (y) => 1016 + 80 * Math.pow(clamp((790 - y) / 400, 0, 1), 0.8) + 34 * (nA(y / 80, 3) - 0.5) + 16 * (nB(y / 26, 5) - 0.5);
  const on = (x, y, m = 0) => x > edge(y) + m && y < foot(x) - m && y > 330;
  const rock = (x, y) => {
    const band = nA(x / 260 + y / 500, y / 30 + 4), c = band > 0.6 ? mix('#f6ecd8', '#ffffff', (band - 0.6) * 2) : mix('#dca4a6', '#f0cabc', band * 1.6);
    return far(mix(mix(c, '#a67c92', smooth(0.5, 0.3, nC(x / 44, y / 100)) * 0.5), '#9c7c94', smooth(560, 400, y) * 0.5), x, y, d);   // darker up under the cap
  };
  const crag = (x, y) => Math.PI / 2 + 0.12 + (nB(x / 110, y / 200) - 0.5) * 0.6;
  p.fill({ inside: (x, y) => on(x, y), bounds: [1000, 330, W + 20, 770], width: 15, length: 76, spacing: 0.5, angle: crag, color: rock, stroke: { ...bristle, opacity: 0.94 } });
  p.fill({ inside: (x, y) => on(x, y, 6), bounds: [1000, 330, W + 20, 770], width: 8, length: 44, spacing: 0.95, overlap: 0.7, angle: crag, color: (x, y) => rock(x + r.range(-8, 8), y + r.range(-8, 8)), stroke: { ...bristle, opacity: 0.85 } });
  for (let k = 0; k < 16; k++) {                                         // clefts down it
    const y = r.range(420, 640), x = r.range(edge(y) + 14, W), len = r.range(50, 130);
    if (on(x, y, 8)) p.tryStroke({ ...bristle, color: far('#8c5c78', x, y, d), width: r.range(5, 8), opacity: 0.4, taper: [0.2, 0.6], points: [[x, y], [x + r.range(2, 12), y + len / 2], [x + r.range(6, 22), y + len]] });
  }
  // The holes in it, where the hollows live: small dark mouths in rows, a pale sill under each, a lamp in some, a walk of timber from one to the next.
  for (const [y0, n] of [[478, 9], [548, 10], [618, 11], [690, 11]]) {
    for (let k = 0; k < n; k++) {
      const x = 1040 + (k + r.range(0.15, 0.85)) * 580 / n, y = y0 + r.range(-18, 18), tall = r.range(13, 19);
      if (!on(x, y, 16) || Math.abs(x - V.x) < 150) continue;
      p.tryStroke({ ...bristle, color: far(mix('#4c3050', '#6a4862', r()), x, y, d * 0.8), width: r.range(5, 7.5), opacity: 0.8, rag: 0.15, cap: 'round', points: [[x, y - tall / 2], [x + r.range(-1, 1), y + tall / 2]] });
      p.tryStroke({ color: far('#fff4dc', x, y, d), width: 4, opacity: 0.6, points: [[x - 8, y + tall / 2 + 4], [x + 8, y + tall / 2 + 3.5]] });
      if (r() < 0.18) p.tryStroke({ color: '#ffcf8a', width: 4, opacity: 0.85, points: [[x, y - 4], [x, y + 8.5]] });
      if (k < n - 1 && r() < 0.45) { const len = r.range(34, 58), yy = y + tall / 2 + 7; p.tryStroke({ color: far('#7a5648', x, yy, d * 0.8), width: 4, opacity: 0.65, points: [[x + 6, yy], [x + len / 2, yy + r.range(-2, 2)], [x + len, yy + r.range(-4, 4)]] }); }
    }
  }
  for (let k = 0; k < 26; k++) {                                         // moss on it
    const y = r.range(440, 740), x = r.range(edge(y) + 8, W), l = r.range(14, 34);
    if (on(x, y, 5)) p.tryStroke({ ...bristle, color: far(r.pick(MOSS), x, y, d), width: r.range(5.5, 9), opacity: 0.55, rag: 0.4, taper: [0.1, 0.6], points: [[x, y], [x + r.range(-4, 4), y + l]] });
  }
  for (let y = 380; y < 700; y += 70) p.stroke({ brush: 'soft', color: far('#f6e2cc', edge(y), y, 0.8), width: 50, opacity: 0.4, points: [[edge(y) - 8, y], [edge(y + 60) - 4, y + 60], [edge(y + 120) - 8, y + 120]] });   // its edge goes into the haze
  for (let k = 0; k < 6; k++) { const x = r.range(980, 1400), y = r.range(700, 760), len = r.range(200, 320); p.stroke({ brush: 'soft', color: '#f8e6d0', width: r.range(30, 46), opacity: r.range(0.16, 0.26), points: wave(x, y, x + len, y + r.range(-4, 4), 3, 1, 6) }); }   // haze at its foot
}

// ---------------------------------------------------------------- the dome of the cap
{
  const sway = (x, y) => 1 + 0.07 * (nA(Math.atan2(V.under - y, x - V.x) * 2.6, 7) - 0.5);
  const inDome = (x, y, m = 0) => { const k = sway(x, y); return Math.pow((x - V.x) / (V.reach * k - m), 2) + Math.pow((y - V.under) / (V.dome * k - m), 2) < 1 && y < rim(x, -1) + 3; };
  const place = (x, y) => { const c = clamp((V.under - y) / V.dome, 0, 0.999), s = Math.sqrt(1 - c * c); return { c, s, m: clamp(u(x) / s, -1, 1) }; };
  const flow = (x, y) => { const { c, s, m } = place(x, y); return Math.atan2(V.dome * s, V.reach * c * m) + (nB(x / 70, y / 70) - 0.5) * 0.3; };
  const dome = (x, y) => {
    const { c, s, m } = place(x, y), lam = (s * m * L[0] + c * -L[1] + s * Math.sqrt(1 - m * m) * 0.45) / 1.097;
    const cord = nA(m * 17 + 5, c * 3) - 0.5, v = 0.5 + 0.5 * lam + cord * 0.2 - 0.2 * smooth(50, 0, rim(x, -1) - y);
    let col = v < 0.4 ? mix('#84627e', '#b68ea0', clamp(v / 0.4, 0, 1)) : v < 0.68 ? mix('#b68ea0', '#e4bcb0', (v - 0.4) / 0.28) : mix('#e4bcb0', '#f9e9d6', clamp((v - 0.68) / 0.28, 0, 1));
    col = mix(col, mix(r.pick(MOSS), '#c6d2a0', 0.4), smooth(0.56, 0.72, nC(m * 6 + 2, c * 5)) * (0.45 + 0.4 * c));   // moss, in streaks down it
    return far(mix(col, '#fffbe8', shaft(x, y) * 0.3), x, y, D + 0.1 * c);
  };
  p.fill({ inside: (x, y) => inDome(x, y), bounds: [730, -10, W + 10, 330], width: 16, length: 96, spacing: 0.5, angle: flow, color: dome, stroke: { ...bristle, opacity: 0.95 } });
  p.fill({ inside: (x, y) => inDome(x, y, 5), bounds: [730, -10, W + 10, 330], width: 8.5, length: 54, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => dome(x + r.range(-6, 6), y + r.range(-6, 6)), stroke: { ...bristle, opacity: 0.85 } });
  for (let k = 0; k < 9; k++) {                                          // the crust on it, in patches
    const cx = r.range(800, W - 20), cy = r.range(10, 270);
    if (!inDome(cx, cy, 30) || rim(cx, -1) - cy < 50) continue;
    for (let j = 0; j < 9; j++) {
      const x = cx + r.gauss() * 26, y = cy + r.gauss() * 16, ang = flow(x, y) + r.range(-0.5, 0.5), l = r.range(13, 22);
      if (inDome(x, y, 12) && rim(x, -1) - y > 24) p.tryStroke({ ...bristle, color: far(mix(r.pick(CRUST), r.pick(MOSS), r() < 0.2 ? 0.7 : 0), x, y, D), width: r.range(5.5, 9.5), opacity: 0.8, mix: 0.15, rag: 0.4, cap: 'round', points: [[x - Math.cos(ang) * l / 2, y - Math.sin(ang) * l / 2], [x + Math.cos(ang) * l / 2, y + Math.sin(ang) * l / 2]] });
    }
  }
  for (const [x, y] of [[884, 232], [968, 150], [1046, 196], [1190, 132], [1282, 172], [1418, 116], [1506, 168]]) {   // a few openings in it, and a lamp in most
    const tall = r.range(13, 17);
    if (!inDome(x, y, 20)) continue;
    p.tryStroke({ ...bristle, color: far('#5a3e5c', x, y, D), width: r.range(5, 6.5), opacity: 0.85, rag: 0.15, cap: 'round', points: [[x, y - tall / 2], [x + 1, y + tall / 2]] });
    if (r() < 0.7) p.tryStroke({ color: '#ffd08c', width: 4, opacity: 0.9, points: [[x, y - 3], [x, y + 9.5]] });
  }
  // the light along the edge of it that is turned to the shaft
  const edge = []; for (let k = 0; k <= 14; k++) { const a = 0.04 + 0.6 * k / 14; edge.push([V.x - V.reach * Math.cos(a) + 3, V.under - V.dome * Math.sin(a)]); }
  glint(p, edge, () => far('#fffdf0', 800, 200, D * 0.5), { width: 5, dash: 44, gap: 18, opacity: 0.6, rng: r });
}

// ---------------------------------------------------------------- the under side of the cap
const cordColors = ['#e8c0b8', '#c898a4', '#f0dcc8', '#a9b98f', '#b890a8', '#dcb0a0', '#d0a0a8'];
{
  const q = (x, y) => Math.hypot(u(x), (y - V.under) / ry);
  const under = (x, y) => {
    const k = q(x, y), cord = nA(Math.atan2((y - V.under) / V.flat, x - V.x) * 9 + 2, k * 2.2) - 0.5;
    let c = k < 0.5 ? mix('#5c3e62', '#8c6888', smooth(0.14, 0.5, k)) : mix('#8c6888', '#c69ea6', smooth(0.5, 1, k));
    c = mix(c, cord > 0 ? '#e2bab4' : '#493056', Math.abs(cord) * 0.5);
    return far(mix(c, '#f2cfba', clamp(-u(x), 0, 1) * 0.3 * k), x, y, D * 0.9);                // lighter toward the shaft
  };
  const out = (x, y) => Math.atan2(y - V.under, x - V.x);
  p.fill({ inside: (x, y) => q(x, y) < 1, bounds: [V.x - V.reach, V.under - ry, W + 10, V.under + ry], width: 13, length: 72, spacing: 0.5, angle: out, color: under, stroke: { ...bristle, opacity: 0.95 } });
  p.fill({ inside: (x, y) => q(x, y) < 0.97, bounds: [V.x - V.reach, V.under - ry, W + 10, V.under + ry], width: 7.5, length: 46, spacing: 0.9, overlap: 0.7, angle: out, color: (x, y) => under(x + r.range(-5, 5), y + r.range(-3, 3)), stroke: { ...bristle, opacity: 0.85 } });
  // What hangs from its edge: from the far edge first, small and pale; then from the near edge, in front of the under side.
  for (const side of [1, -1]) for (let k = 0; k < (side > 0 ? 60 : 84); k++) {
    const x = V.x + r.range(-0.985, 0.62) * V.reach, y = rim(x, side) + r.range(-3, 5), l = r.range(16, 100) * (side > 0 ? 0.55 : 1) * (0.5 + 0.5 * Math.abs(u(x)));
    if (x > W + 6 || (side > 0 && Math.abs(x - V.x) < 150)) continue;
    const lit = clamp(-u(x), 0, 1);
    p.tryStroke({ ...bristle, color: far(mix(mix('#77557a', '#b78c9e', r()), '#f2d6c4', lit * r.range(0.2, 0.7)), x, y, side > 0 ? 0.5 : D * 0.8), width: r.range(4.8, side > 0 ? 6.5 : 9), opacity: 0.9, taper: [0, 0.85], mix: 0.1, points: [[x, y - 5], [x + r.range(-3, 3), y + l * 0.5], [x + r.range(-7, 7), y + l]] });
  }
}

// ---------------------------------------------------------------- the trunk
{
  const a = [V.x, V.under + 8], b = [V.x + 8, V.foot];
  const tones = { lit: '#f6dcc8', half: '#d49e9e', shade: '#8c6686', deep: '#51365a', bounce: '#c69aa4' };
  // its cords go up and out over the under side of the cap
  for (let k = 0; k < 30; k++) {
    const s = -0.98 + 1.96 * (k + r.range(0.2, 0.8)) / 30, x0 = V.x + s * 186, len = r.range(0.35, 0.75);
    const x1 = V.x + s * V.reach * len, y1 = V.under - Math.sqrt(1 - s * s) * ry * len;
    p.tryStroke({ ...bristle, color: far(mix(mix('#5e4066', '#96708e', r()), cordColors[k % 7], 0.3), x0, 300, D), width: r.range(9, 15), opacity: 0.9, taper: [0, 0.75], points: [[x0, V.under + 16], [(x0 + x1) / 2, (V.under + y1) / 2 + 6], [x1, y1]] });
  }
  const T = turned(p, a, b, trunkProf, D, { light: L, front: 0.3, seed: 5, tones, twist: 1.7, lanes: 30, lap: 1.7, piece: 66, lump: 0.05, grain: 0.24, tint: (t, th, lane, v) => mix(cordColors[(lane * 5 + 2) % 7], '#5a3c5e', clamp(0.62 - v, 0, 0.5)), tintBy: 0.36, crust: 0, threads: 0.5 });
  // it turns from the light: shade down the right of it, light down the left
  p.stroke({ brush: 'soft', color: far('#6a4a6e', V.x + 100, 560, D), width: 96, opacity: 0.3, points: [[V.x + 112, 372], [V.x + 68, 560], [V.x + 136, 792]] });
  p.stroke({ brush: 'soft', color: '#fff2dc', width: 46, opacity: 0.24, points: [[V.x - 142, 396], [V.x - 100, 560], [V.x - 176, 786]] });
  // the shade of the cap on the top of it
  p.stroke({ brush: 'soft', color: far('#56385c', V.x, 350, D), width: 66, opacity: 0.5, points: [[V.x - 196, 336], [V.x, 350], [V.x + 196, 336]] });
  p.stroke({ brush: 'soft', color: far('#56385c', V.x, 396, D), width: 56, opacity: 0.26, points: [[V.x - 160, 384], [V.x, 398], [V.x + 160, 384]] });
  // a walk of timber that winds up round it, with lamps along it
  for (const [t0, t1, th0, th1] of [[0.9, 0.62, -1.25, 0.2], [0.6, 0.44, 0.35, 1.3], [0.34, 0.2, -1.3, -0.2]]) {
    const pts = []; for (let k = 0; k <= 10; k++) pts.push(T.P(t0 + (t1 - t0) * k / 10, th0 + (th1 - th0) * k / 10));
    glint(p, pts.map(([x, y]) => [x, y + 3]), () => far('#5c3e50', pts[5][0], pts[5][1], D * 0.7), { width: 4.6, dash: 40, gap: 4, opacity: 0.7, rng: r });
    glint(p, pts, () => far('#f6e2c8', pts[5][0], pts[5][1], D * 0.7), { width: 4, dash: 26, gap: 14, opacity: 0.6, rng: r });
    for (const k of [2, 5, 8]) { const [x, y] = pts[k]; p.tryStroke({ brush: 'soft', color: '#ffb866', width: 8.4, opacity: 0.35, points: [[x, y - 20], [x, y - 2]] }); p.tryStroke({ color: '#ffe2a4', width: 4.2, points: [[x, y - 17], [x, y - 5]] }); }
  }
  // its roots, out over the ground: each comes down off the foot of the trunk, runs out along the plain and goes under the sand
  for (const [dx0, dx1, dy1, w] of [[-196, -470, 14, 30], [-150, -360, 50, 36], [-70, -190, 84, 34], [160, 330, 34, 32], [96, 236, 74, 36], [214, 400, 12, 26]]) {
    const x0 = V.x + dx0, x1 = V.x + dx1, y0 = V.foot - 40, y1 = V.foot + dy1, mx = x0 + (x1 - x0) * 0.42 + r.range(-14, 14), my = y1 - r.range(8, 20), body = mix('#9a7690', ['#e8c0b8', '#c898a4', '#b890a8', '#dcb0a0', '#d0a0a8'][Math.abs(dx0) % 5], 0.4);
    p.stroke({ brush: 'soft', color: far('#a68494', mx, my, D), width: w * 1.2, opacity: 0.36, points: [[x0, y0 + 30], [mx + 14, my + 18], [x1, y1 + 10]] });        // its shadow
    p.stroke({ ...bristle, color: far(body, mx, my, D), width: w, taper: [0, 0.7], cap: 'round', points: [[x0, y0], [x0 + (mx - x0) * 0.5, my - 16], [mx, my], [x1, y1]] });
    p.tryStroke({ ...bristle, color: far(mix('#f0d6c6', body, 0.3), mx, my, D), width: Math.max(4.8, w * 0.4), opacity: 0.9, taper: [0, 0.8], cap: 'round', points: [[x0 - 0.7 * w * 0.2, y0 - w * 0.2], [x0 + (mx - x0) * 0.5 - 2, my - 16 - w * 0.26], [mx, my - w * 0.28], [x1, y1 - 3]] });
    for (let k = 0; k < 5; k++) {                                        // the sand over the end of it, and moss by it
      const x = x1 + (mx - x1) * r.range(-0.1, 0.45), y = y1 + r.range(-2, 9), len = r.range(30, 70);
      p.tryStroke({ ...bristle, color: far(r() < 0.35 ? r.pick(MOSS) : mix('#f2dcc8', '#e6c2ae', r()), x, y, D), width: r.range(7, 12), opacity: 0.9, rag: 0.4, points: [[x - len / 2, y], [x + len / 2, y + r.range(-2, 2)]] });
    }
  }
  // the way in, at its foot, with a light in it
  const door = [V.x - 64, V.foot - 28];
  p.stroke({ ...bristle, color: far('#3a2240', door[0], door[1], D * 0.6), width: 8, rag: 0.1, cap: 'round', points: [[door[0], door[1] - 9], [door[0], door[1] + 10]] });
  p.stroke({ brush: 'soft', color: '#ffb866', width: 8.4, opacity: 0.4, points: [[door[0], door[1] - 8], [door[0], door[1] + 12]] });
  p.stroke({ color: '#ffd896', width: 4, points: [[door[0], door[1] - 3], [door[0], door[1] + 9.5]] });
}

// ---------------------------------------------------------------- lamps under the cap, and the air
for (let k = 0; k < 26; k++) {
  const x = V.x + r.range(-0.9, 0.6) * V.reach, y = V.under + r.range(-0.75, 0.6) * ry * Math.sqrt(Math.max(0, 1 - u(x) * u(x))), l = r.range(16, 54);
  if (x > W - 8 || Math.abs(x - V.x) < 120) continue;
  p.tryStroke({ color: far('#6a4a62', x, y, D), width: 4, opacity: 0.7, points: [[x, y], [x + r.range(-1, 1), y + l]] });
  p.tryStroke({ brush: 'soft', color: '#ffb866', width: 8.4, opacity: 0.4, points: [[x, y + l - 4], [x, y + l + 14]] });
  p.tryStroke({ color: '#ffe2a4', width: 4.4, points: [[x, y + l - 1], [x, y + l + 11.5]] });
}
for (let k = 0; k < 7; k++) { const x = r.range(1000, 1560), y = r.range(790, 830), len = r.range(180, 300); p.stroke({ brush: 'soft', color: '#f8e8d2', width: r.range(26, 40), opacity: r.range(0.14, 0.24), points: wave(x, y, x + len, y + r.range(-4, 4), 3, 1, 6) }); }   // haze about its foot
for (let k = 0; k < 5; k++) { const y0 = r.range(-20, 60), x0 = r.range(770, 960); p.stroke({ brush: 'soft', color: '#fffcec', width: r.range(40, 70), opacity: 0.1, taper: [0.1, 0.4], points: [[x0, y0], [x0 + 40, y0 + 250], [x0 + 84, y0 + 520]] }); }   // the light of the shaft, across the edge of the cap

p.save();
