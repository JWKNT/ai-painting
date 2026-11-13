// The ruins of the golden city, and the village. Farthest off, thin towers almost lost in
// the haze. Then the village of the hollows: a great pale mound with a tall trunk, holes in
// its sides, a ring of small lights round it. In front of it a bridge of high arches crosses
// the water, one span fallen. Nearest, at either side, more towers, dark, with the light
// gold along one edge.
'use strict';
const { studio, open, WATER, LIGHT, MOUND, shaft, haze, far, gild, lightSide, nA } = require('./scene');
const { mix, wave, clamp, solid, glint, arc } = studio;

const p = open('city');
const r = p.rng;
const stroke = { brush: 'bristle', mix: 0.08, dry: 0.04, rag: 0.18, cap: 'flat', streak: 0.3, jitter: 0.5 };

// A tower: a shaded side and a lit side, ledges round it, dark openings, and a top.
//   d: how far off; top: 'bulb', 'spire' or 'broken'
function tower(x, base, h, w, d, top) {
  const side = lightSide(x), y1 = base - h, slim = 0.62;
  const dark = (y) => far(mix('#10303a', '#1e464a', nA(x / 20, y / 60)), x, y, d), lit = (y) => far(gild('#4c6a5e', x, y, 0.95), x, y, d);
  for (let i = 0; i < 3; i++) {                                         // the body, in three lengths that grow narrower
    const ya = base - h * i / 3, yb = base - h * (i + 1) / 3 - 2, k = 1 - (1 - slim) * i / 3, k2 = 1 - (1 - slim) * (i + 1) / 3;
    p.tryStroke({ ...stroke, color: dark((ya + yb) / 2), width: Math.max(4.6, w * k), points: [[x, ya, 1], [x, yb, k2 / k]] });
    p.tryStroke({ ...stroke, color: lit((ya + yb) / 2), width: Math.max(4.6, w * k * 0.36), opacity: 0.9, points: [[x + side * w * k * 0.3, ya, 1], [x + side * w * k2 * 0.3, yb, k2 / k]] });
  }
  for (const f of [0.34, 0.62, 0.86]) {                                 // ledges
    const y = base - h * f, half = w * (1 - (1 - slim) * f) * 0.66;
    if (half * 2 >= 12.4) p.tryStroke({ ...stroke, color: dark(y), width: Math.max(4.6, w * 0.13), points: [[x - half, y], [x + half, y]] });
    if (half * 2 >= 12.4 && d < 0.5) p.tryStroke({ color: far('#f2dc94', x, y, d), width: 4, opacity: 0.6, points: [[x - half, y - 3.5], [x + half, y - 3.5]] });
  }
  for (const f of [0.2, 0.48, 0.74]) {                                  // openings
    const y = base - h * f, len = Math.max(12.4, w * 0.5);
    p.tryStroke({ ...stroke, cap: 'round', color: far('#061a1e', x, y, d), width: Math.max(4.6, w * 0.16), opacity: 0.8, points: [[x - side * w * 0.1, y], [x - side * w * 0.1, y - len]] });
  }
  if (top === 'bulb') {
    solid(p, [[x, y1 + w * 0.2, w * slim * 0.72], [x, y1 - w * 0.5, w * slim * 0.5], [x, y1 - w * 1.2, 2.4]], { shadow: dark(y1), half: far('#2c5a58', x, y1, d), lit: lit(y1), rim: far('#fff0b8', x, y1, d * 0.6) }, { light: LIGHT, turn: 0.1, width: 5, length: 18, vary: 0.05, edge: d < 0.5 });
  } else if (top === 'spire') {
    p.tryStroke({ ...stroke, cap: 'round', color: dark(y1), width: Math.max(4.6, w * slim), taper: [0, 1], points: [[x, y1 + 6], [x, y1 - w * 0.9], [x, y1 - w * 2]] });
  } else {
    for (const [dx, up] of [[-0.24, 0.3], [0.05, 0.75], [0.26, 0.15]]) p.tryStroke({ ...stroke, color: dark(y1), width: Math.max(4.6, w * 0.2), points: [[x + dx * w, y1 + 8], [x + dx * w, y1 - Math.max(6, w * up)]] });
  }
}
// Mist lying on the water.
function mist(x0, x1, y0, y1, n) {
  for (let k = 0; k < n; k++) {
    const x = r.range(x0, x1), y = r.range(y0, y1), len = r.range(200, 420), s = clamp(shaft(x + len / 2, y) * 1.4, 0, 1);
    p.stroke({ brush: 'soft', color: mix(mix('#6ea098', '#9cc0a8', r()), '#f2e2a4', s), width: r.range(26, 50), opacity: r.range(0.12, 0.24), points: wave(x, y, x + len, y + r.range(-5, 5), 4, 1, 7) });
  }
}

// Far towers.
for (const [x, h, w, top] of [[726, 190, 20, 'spire'], [792, 250, 24, 'bulb'], [868, 300, 24, 'broken'], [1352, 280, 26, 'bulb'], [1420, 210, 22, 'spire'], [640, 150, 18, 'broken']]) tower(x, WATER + 4, h, w, 0.68, top);
mist(500, 1300, WATER - 60, WATER - 10, 8);

// The village: a mound of pale lumps, and a trunk standing up out of it, open at the top.
{
  const v = (c) => far(c, MOUND.x, MOUND.y, 0.5);
  const tones = { shadow: v('#22443f'), half: v('#55745f'), lit: v('#e6d79a'), rim: '#fff2c0', bounce: v('#2c5a5c') };
  const o = { light: LIGHT, turn: 0.05, width: 8, length: 46, vary: 0.08, dash: 34, gap: 14, edgeOpacity: 0.7 };
  solid(p, [[1046, 470, 84], [1036, 360, 58], [1030, 260, 44], [1028, 196, 38]], tones, o);                        // the trunk
  solid(p, [[1000, 190, 20], [1060, 186, 20]], tones, { ...o, length: 24, width: 6 });                              // its lip
  p.stroke({ ...stroke, cap: 'round', color: v('#0c2428'), width: 13, opacity: 0.8, points: [[1008, 182], [1030, 178], [1052, 180]] });   // and the dark inside it
  solid(p, [[[946, 664, 108], [1066, 612, 162], [1204, 644, 130], [1296, 686, 78]], [[880, 700, 60], [960, 690, 70]]], tones, { ...o, length: 60, width: 9, flow: (x, y) => Math.atan2(y - 400, x - 1050) + (nA(x / 40, y / 40) - 0.5) * 0.5 });   // the mound: its strokes run down it from the foot of the trunk
  for (let k = 0; k < 9; k++) {                                         // the ribs that run round it
    const y = 500 + k * 22 + r.range(-5, 5), half = 60 + (y - 440) * 0.82;
    p.tryStroke({ ...stroke, cap: 'round', color: v('#1c3c3c'), width: r.range(5, 8), opacity: 0.35, mix: 0.25, rag: 0.3, taper: [0.3, 0.3], points: arc(MOUND.x - 10, y - half * 0.42, half, Math.PI * 0.62, Math.PI * 0.38, 9).map(([x, yy]) => [x, y + (yy - (y - half * 0.42)) * 0.2]) });
  }
  for (const [x, y, w, len, a] of [[1000, 560, 15, 34, 1.5], [1118, 520, 13, 30, 1.6], [1196, 600, 16, 36, 1.4], [1070, 640, 14, 30, 1.6], [940, 632, 12, 26, 1.5], [1262, 660, 11, 24, 1.6], [1040, 420, 11, 26, 1.57], [1030, 310, 9, 22, 1.57]]) {   // holes in its sides
    p.tryStroke({ ...stroke, cap: 'round', color: v('#08201f'), width: w, opacity: 0.85, points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
  }
  for (let k = 0; k < 15; k++) {                                        // a ring of small lights
    const t = k / 14, x = 880 + 410 * t, y = 590 + 46 * Math.sin(t * Math.PI) + r.range(-4, 4);
    p.tryStroke({ brush: 'soft', color: '#ffb450', width: 12, opacity: 0.3, points: [[x - 13, y], [x + 13, y]] });
    p.line(x - 6.2, y, x + 6.2, y, { color: mix('#ffcf7a', '#fff0b0', r()), width: 4, opacity: 0.9 });
  }
  glint(p, [[976, 440], [990, 330], [994, 230]], () => mix('#f6e2a0', '#fff6d0', r()), { width: 5, dash: 40, gap: 16, opacity: 0.6, rng: r });   // the light down the side of the trunk
}
mist(760, 1400, WATER - 46, WATER, 10);

// The bridge: a road carried high over the water on round arches, from the left shore to the
// mound. First the whole wall of it is laid in; then each arch is opened by painting what is
// seen through it. One span has fallen.
{
  const d = 0.36, deck = 524, spring = 600, piers = [420, 560, 700, 840, 980], fallen = 2, rad = 56;
  const stone = (x, y) => far(mix('#122e36', '#22494c', nA(x / 30, y / 30)), x, y, d);
  const through = (x, y) => mix(mix(haze(x, y), '#f2e2a4', clamp(shaft(x, y) * 0.9, 0, 1) * 0.5), '#9cc0a8', 0.25);   // the haze beyond it
  for (let i = 0; i + 1 < piers.length; i++) {
    if (i === fallen) continue;
    const x0 = piers[i], x1 = piers[i + 1], mid = (x0 + x1) / 2;
    for (let y = deck + 6; y < spring + 4; y += 13) p.tryStroke({ ...stroke, color: stone(mid, y), width: 16, points: [[x0 - 12, y], [mid, y + r.range(-1, 1)], [x1 + 12, y]] });   // the wall over the arch
    for (let x = mid - rad + 5; x <= mid + rad - 5; x += 9) {           // the opening
      const top = spring - Math.sqrt(Math.max(0, rad * rad - (x - mid) * (x - mid)));
      p.tryStroke({ ...stroke, cap: 'round', rag: 0.1, color: through(x, (top + WATER) / 2), width: 11, mix: 0.2, points: [[x, top + 5], [x, (top + WATER) / 2], [x, WATER + 6]] });
    }
    p.tryStroke({ ...stroke, color: stone(mid, deck), width: 20, points: [[x0 - 16, deck], [mid, deck], [x1 + 16, deck]] });                                        // the road
    glint(p, [[x0 - 14, deck - 11], [mid, deck - 11], [x1 + 14, deck - 11]], () => far(mix('#e8d28c', '#fff0b8', r()), mid, deck, d * 0.5), { width: 4.6, dash: 40, gap: 12, opacity: 0.8, rng: r });
    glint(p, arc(mid, spring, rad + 4, Math.PI * 1.05, Math.PI * 1.95, 12), () => far('#0a2228', mid, spring, d), { width: 4.6, dash: 30, gap: 6, opacity: 0.6, rng: r });   // the ring of the arch
  }
  for (const x of piers) {                                              // the piers, down into the water
    const side = lightSide(x);
    p.tryStroke({ ...stroke, color: stone(x, 650), width: 30, points: [[x, spring - 10], [x, WATER + 8]] });
    p.tryStroke({ ...stroke, color: far(gild('#4c6a5e', x, 650, 0.9), x, 650, d), width: 9, opacity: 0.85, points: [[x + side * 10, spring - 6], [x + side * 10, WATER + 6]] });
  }
  const [xa, xb] = [piers[fallen], piers[fallen + 1]];                  // the broken ends, and what fell
  for (const [x0, x1, y0, y1] of [[xa - 16, xa + 30, deck, deck + 4], [xb - 34, xb + 16, deck + 6, deck], [xa - 12, xa + 18, deck + 22, deck + 30], [xb - 20, xb + 12, deck + 30, deck + 22], [xa - 12, xa + 12, deck + 44, deck + 50], [xb - 12, xb + 12, deck + 50, deck + 44]]) {
    p.tryStroke({ ...stroke, rag: 0.4, color: stone((x0 + x1) / 2, y0), width: 18, points: [[x0, y0], [x1, y1]] });
  }
  for (const x of [xa, xb]) p.tryStroke({ ...stroke, color: stone(x, 570), width: 30, points: [[x, deck + 40], [x, spring]] });
  for (const [x, y, len, a] of [[746, 700, 34, 0.3], [786, 708, 28, -0.4], [730, 712, 24, 0.1]]) p.tryStroke({ ...stroke, color: stone(x, y), width: 13, points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
}

// The nearer towers.
for (const [x, h, w, top] of [[330, 250, 40, 'bulb'], [1404, 318, 46, 'bulb'], [1474, 400, 40, 'spire'], [1330, 190, 34, 'broken']]) tower(x, WATER + 10, h, w, 0.3, top);
mist(300, 1500, WATER - 24, WATER + 8, 8);

p.save();
