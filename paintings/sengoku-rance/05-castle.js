// The castle: its hill, dark against the mist, cherry trees round it with the light coming
// through their blossom, and the keep standing over them, three storeys under heavy roofs.
// We see its shaded side. The sun is behind it to the right and gilds every edge it reaches.
'use strict';
const { studio, open, CASTLE, SUN, castleHill, glow, nA, nB } = require('./scene');
const { mix, clamp, smooth, mass, glint, ramp } = studio;

const p = open('castle');
const r = p.rng;
const toSun = (x, y) => { const dx = SUN.x - x, dy = SUN.y - y, l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };

// The hill.
{
  const slope = (x) => Math.atan2(castleHill(x + 12) - castleHill(x - 12), 24);
  const foot = (x) => castleHill(x) + 34 + 40 * smooth(60, 420, x) * smooth(760, 420, x);
  const hill = (x, y) => mix(mix('#2c3c3a', '#3a4a40', nA(x / 50, y / 24)), '#5a5c52', clamp((x - 300) / 500, 0, 0.7));
  // toward its foot the hill goes into the mist of the plain
  const green = (x, y) => mix(hill(x, y), mix('#7a7c80', '#a89c98', nA(x / 90, y / 20)), smooth(0.4, 1, (y - castleHill(x)) / (foot(x) - castleHill(x))) * 0.8);
  p.fill({ inside: (x, y) => x > 60 && x < 760 && y > castleHill(x) + 9 && y < foot(x), bounds: [60, 490, 760, 640], width: 18, length: 110, spacing: 0.5, angle: (x, y) => slope(x) * 0.8 + (nB(x / 60, y / 30) - 0.5) * 0.3, color: green, stroke: { brush: 'bristle', opacity: 0.95, mix: 0.2, dry: 0.05 } });
  for (let x = 70; x < 740; x += 110) {
    const pts = [];
    for (let k = 0; k <= 6; k++) pts.push([x + k * 20, castleHill(x + k * 20) + 6]);
    p.stroke({ brush: 'bristle', color: green(x + 60, castleHill(x + 60)), width: 12, mix: 0.1, dry: 0, points: pts });
  }
  for (let x = 40; x < 760; x += 170) {                             // a clean brush along the foot
    p.stroke({ brush: 'blend', width: 30, opacity: 0.6, points: [[x, foot(x) - 4], [x + 95, foot(x + 95) + 2], [x + 190, foot(x + 190) - 4]] });
  }
}

// Cherry trees in bloom, in drifts: each drift a heap of crowns. The sun is behind them, so
// the blossom is dusky rose in its depths and pale and bright along every edge toward the light.
const blossom = (t) => ramp(['#5e3c62', '#8e527c', '#c87c9e', '#f2aec4', '#ffe0e0'], t);
function drift(x0, x1, lift, size) {
  // crowns side by side along the hill from x0 to x1, standing `lift` above its line, so that they run together
  const crowns = [];
  for (let x = x0; x <= x1; x += size * r.range(0.75, 1.15)) {
    const rad = size * r.range(0.75, 1.2), y = H(x) - lift;
    crowns.push([x + r.range(-4, 4), y - rad * r.range(0.6, 1), rad]);
    if (r() < 0.55) crowns.push([x + r.range(-10, 10), y - rad * r.range(1.3, 1.8), rad * r.range(0.55, 0.8)]);
    if (r() < 0.6) p.tryStroke({ brush: 'bristle', color: '#241c2a', width: Math.max(4.5, rad * 0.2), taper: [0, 0.4], mix: 0, dry: 0, rag: 0.1, points: [[x + r.range(-3, 3), y + r.range(10, 18)], [x + r.range(-3, 3), y - rad * 0.3], [x + r.range(-5, 5), y - rad * 0.9]] });
  }
  mass(p, crowns, { light: toSun, tones: blossom, bias: 0.36, contrast: 0.7, fall: 0.3, grain: 0.34, mix: 0.2,
    layers: [[10, 24, 0.95, 4, 0.45], [6, 15, 0.85, 3, 0.75]], crown: '#fff0e6', crownOpacity: 0.75, crownSpan: 0.45, seed: Math.round(x0) });
}
function pine(x, y, h) {
  p.tryStroke({ brush: 'bristle', color: mix('#1c2a30', '#283a3a', r()), width: Math.max(6, h * 0.3), taper: [0, 1], mix: 0, dry: 0, rag: 0.2, points: [[x, y], [x + r.range(-2, 2), y - h * 0.5], [x + r.range(-2, 2), y - h]] });
}
const H = (x) => castleHill(x);

// Trees behind the keep.
drift(168, 344, 16, 19);
drift(508, 676, 14, 18);
for (const [x, h] of [[258, 34], [306, 40], [548, 40], [592, 34]]) pine(x, H(x) + 6, h);

// The keep.
{
  const { x: cx, base, s } = CASTLE;
  const X = (u) => cx + u * s, Y = (v) => base + v * s;         // castle units: u to the right, v up is negative
  const warm = (u) => smooth(-20, 80, u);                       // how far round toward the sun
  const wallTone = (u) => mix(mix('#77749c', '#8e88aa', r()), '#e2b4a4', warm(u) * 0.55);
  const stroke = { brush: 'bristle', mix: 0.12, dry: 0, rag: 0.08, cap: 'flat', jitter: 0.4, streak: 0.25 };

  // stone base, wider at the foot
  for (const [v, half] of [[-5, 73], [-16, 68], [-27, 63]]) {
    for (const [u0, u1] of [[-half, -8], [-12, half]]) {
      p.stroke({ ...stroke, color: mix(mix('#3c3a52', '#4c4860', r()), '#a88a84', warm((u0 + u1) / 2) * 0.5), width: 12 * s * 0.72, points: [[X(u0), Y(v)], [X((u0 + u1) / 2), Y(v) + r.range(-1, 1)], [X(u1), Y(v)]] });
    }
  }
  // a storey: plaster wall in shade, warmer toward the sun, with window slits, some lit
  const wall = (v0, v1, half) => {
    const rows = Math.max(2, Math.round((v0 - v1) / 9)), h = (v0 - v1) / rows;
    for (let k = 0; k < rows; k++) {
      const v = v0 - h * (k + 0.5);
      p.stroke({ ...stroke, color: wallTone(-half * 0.5), width: h * s + 3, points: [[X(-half), Y(v)], [X(-half * 0.3), Y(v)], [X(half * 0.3), Y(v)]] });
      p.stroke({ ...stroke, color: wallTone(half * 0.6), width: h * s + 3, mix: 0.3, points: [[X(-half * 0.1), Y(v)], [X(half * 0.5), Y(v)], [X(half), Y(v)]] });
    }
    p.line(X(-half), Y(v1 + 2.4), X(half), Y(v1 + 2.4), { brush: 'bristle', color: '#3c3a5a', width: 5, opacity: 0.8, mix: 0.1, dry: 0, rag: 0 });   // shadow of the eave
    const n = Math.max(2, Math.round(half / 11));
    for (let k = 0; k < n; k++) {
      const u = -half + (k + 0.5) * (2 * half / n), lamp = r() < 0.3;
      p.line(X(u), Y(v0 - 2.5), X(u), Y(v0 - 2.5) - 12.5, { color: lamp ? '#ffc070' : '#2a2a44', width: 4.5, opacity: lamp ? 0.9 : 0.85 });
    }
  };
  // a roof: tiles sloping from the wall above down to a wide eave whose corners flick up
  const roof = (vEave, vTop, halfEave, halfTop) => {
    for (const k of [0.82, 0.5, 0.18]) {
      const v = vEave + (vTop - vEave) * k, half = halfEave + (halfTop - halfEave) * k;
      p.stroke({ ...stroke, color: mix(mix('#1e2038', '#2e3050', 0.3 + 0.5 * k + r() * 0.2), '#6a5468', 0.25 * k), width: Math.abs(vTop - vEave) * s * 0.45 + 3, points: [[X(-half), Y(v)], [X(0), Y(v)], [X(half), Y(v)]] });
    }
    const eave = [[X(-halfEave - 7), Y(vEave - 6)], [X(-halfEave + 4), Y(vEave)], [X(0), Y(vEave + 1)], [X(halfEave - 4), Y(vEave)], [X(halfEave + 7), Y(vEave - 6)]];
    p.stroke({ brush: 'bristle', color: '#191a30', width: 6.5, mix: 0, dry: 0, rag: 0, cap: 'round', points: eave });
    glint(p, [[X(halfEave * 0.1), Y(vEave - 3.6)], [X(halfEave * 0.6), Y(vEave - 3.2)], [X(halfEave - 4), Y(vEave - 3.6)], [X(halfEave + 6), Y(vEave - 9)]], () => mix('#ffb880', '#ffe6b0', r()), { width: 4.2, dash: 26, gap: 8, opacity: 0.9 });   // the sun along the far end of the eave
  };

  wall(-33, -59, 56);
  roof(-59, -75, 76, 46);
  wall(-75, -99, 42);
  roof(-99, -113, 60, 32);
  wall(-113, -135, 28);
  // the top roof: a tall hipped gable with a ridge and two gold fish at its ends
  roof(-135, -150, 47, 30);
  for (const k of [0.25, 0.75]) {
    const v = -150 - 16 * k, half = 30 - 10 * k;
    p.stroke({ ...stroke, color: mix('#1e2038', '#34345a', k), width: 12 * s * 0.75, points: [[X(-half), Y(v)], [X(0), Y(v)], [X(half), Y(v)]] });
  }
  p.line(X(-22), Y(-167), X(22), Y(-167), { brush: 'bristle', color: '#17182c', width: 7, mix: 0, dry: 0, rag: 0, cap: 'round' });
  p.line(X(-9), Y(-152), X(9), Y(-152), { brush: 'bristle', color: '#9a92b0', width: 9, mix: 0.1, dry: 0, rag: 0, cap: 'flat' });   // the pale gable end
  glint(p, [[X(2), Y(-170)], [X(12), Y(-170.4)], [X(22), Y(-170)]], () => '#ffd9a0', { width: 4, dash: 30, gap: 4, opacity: 0.9 });
  for (const side of [-1, 1]) p.line(X(side * 21), Y(-169), X(side * 24), Y(-176.8), { color: side > 0 ? '#f0c060' : '#8a6a3c', width: 4.2, opacity: 0.9 });
  // light wrapping round the sunward corner of the walls
  for (const [v0, v1, half] of [[-33, -59, 56], [-75, -99, 42], [-113, -135, 28]]) glint(p, [[X(half - 1), Y(v0 - 1)], [X(half - 1), Y((v0 + v1) / 2)], [X(half - 1), Y(v1 + 4)]], () => mix('#ffc490', '#ffe9c0', r()), { width: 4.4, dash: 22, gap: 6, opacity: 0.85 });
}

// Trees in front of the keep, larger, and down the slope.
drift(96, 366, -6, 24);
drift(404, 734, -8, 25);
drift(250, 560, -34, 22);
for (const [x, dy, h] of [[266, 34, 44], [565, 40, 46], [640, 44, 40], [196, 38, 40]]) pine(x, H(x) + dy, h);

// Mist at the foot of the hill.
for (let k = 0; k < 7; k++) {
  const x = r.range(20, 240), y = r.range(590, 626), len = r.range(160, 260);
  p.stroke({ brush: 'soft', color: mix('#b8a8c0', '#f0c8a8', clamp(glow(x + len / 2, y, 500) * 1.6, 0, 1)), width: r.range(26, 40), opacity: r.range(0.14, 0.24), points: [[x, y], [x + len / 2, y + r.range(-4, 4)], [x + len, y]] });
}

p.save();
