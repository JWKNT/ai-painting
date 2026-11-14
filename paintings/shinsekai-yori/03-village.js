// Kamisu 66. At the far left is a farmhouse with a thick roof of thatch, and its water
// wheel. At the right is the hall of the school: a long wooden building with paper
// screens, which are lit from inside, under a great roof of tiles. The sun went down
// behind it, so its roof is a dark shape with a thin gold edge. A path of beaten earth
// goes along the canal in front of them, with paper lanterns on posts. The canal is
// still, and it holds the sky; a boat is tied up in it. Across the left of the picture,
// high on two poles, hangs the holy rope of the village, with its folded papers: nothing
// bad may pass it. One pole has the horns from which the going-home song comes.
'use strict';
const { studio, open, W, H, HORIZON, BANK, HALL, glare, skyColor, far, roofTop, nA, nB, nC, hash } = require('./scene');
const { mix, clamp, smooth, glow, inPoly, arc } = studio;

const p = open('village');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.02, rag: 0.1, cap: 'round' };
const flat = { ...line, cap: 'flat', mix: 0.04 };
const lamp = (x, y, s = 1) => { for (const [w, op] of [[60 * s, 0.08], [30 * s, 0.16]]) glow(p, x, y, w, '#ffb050', op, 6); };
const EARTH = 724;                                       // the far edge of the path

// ---------------------------------------------------------------- far houses, at the foot of the hills: each is a small dark roof and one light
for (const [x, y, s] of [[250, 574, 1], [316, 578, 1.2], [470, 573, 0.9], [1668, 574, 1]]) {
  p.tryStroke({ ...line, color: far('#1c1c3c', x, y, 0.2), width: 9 * s, points: [[x - 16 * s, y], [x, y - 6 * s], [x + 16 * s, y]] });
  glow(p, x - 3 * s, y + 3 * s, 16, '#ffb858', 0.3, 6); p.tryStroke({ brush: 'round', color: '#ffd890', width: 4, points: [[x - 9 * s, y + 4 * s], [x + 4 * s, y + 4 * s]] });
}

// ---------------------------------------------------------------- the ground: the path, and the bank of the canal
const earth = (x, y) => { const t = clamp((y - EARTH) / (BANK - EARTH), 0, 1); let c = mix('#4a3c60', '#272240', t); c = mix(c, '#c07c54', glare(x, y, 380) * 0.34); return mix(c, '#141428', (nA(x / 80, y / 10) - 0.5) * 0.3); };
p.fill({ bounds: [0, EARTH, W, BANK + 6], width: 8, length: 90, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.02, 0.02), color: earth, stroke: { ...line, opacity: 0.97 } });
// the grass at the far edge of the path: a ragged dark line against the bright fields
for (let x = -6; x < W + 6; x += r.range(5, 9)) { const h = r.range(13, 22); p.tryStroke({ ...line, color: mix('#1c2238', '#2c3848', r()), width: 5, taper: [0, 0.7], points: [[x, EARTH + 5], [x + r.range(-4, 4), EARTH + 5 - h]] }); }
// the stones that hold the bank: a row of dark blocks, with a line of the sky's light on their top edge
p.fill({ bounds: [0, BANK, W, BANK + 34], width: 9, length: 46, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.03, 0.03), color: (x, y) => mix('#12122a', '#26264a', hash(Math.floor(x / 44), Math.floor(y / 14))), stroke: { ...flat, opacity: 0.97 } });
p.tryStroke({ ...line, color: '#9c7490', width: 5, opacity: 0.7, points: [[-10, BANK + 1], [W / 2, BANK + 2], [W + 10, BANK + 1]] });

// ---------------------------------------------------------------- the canal
const canal = (x, y) => { const t = (y - BANK - 30) / (H - BANK - 30), up = HORIZON - 30 - t * 520; const c = mix(skyColor(x + (nB(x / 70, y / 6) - 0.5) * 50, Math.max(20, up)), '#1c1c44', 0.26 + 0.3 * t); return mix(c, '#0c0c24', smooth(BANK + 70, BANK + 28, y) * 0.6); };   // it holds the sky; under the bank it is dark
p.fill({ bounds: [0, BANK + 28, W, H + 4], width: 10, length: 130, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.012, 0.012), color: canal, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, BANK + 30, W, H], width: 5.5, length: 60, spacing: 1.1, overlap: 0.7, angle: () => r.range(-0.012, 0.012), color: (x, y) => canal(x + r.range(-12, 12), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.78 } });
// The school, upside down in the water: its dark wall, the gold of its screens, and under them its roof. The water makes it shorter.
{ const back = (y) => HALL.ground - (y - 838) / 0.62, edge = (x, y) => (nB(x / 30, y / 4) - 0.5) * 16;   // back: the height on the school that a place on the water shows
  const dark = (x, y) => { const h = back(y); return h < HALL.ground && (h > HALL.eaves ? x + edge(x, y) > HALL.x0 : h > roofTop(x + edge(x, y))); };
  p.fill({ inside: dark, bounds: [HALL.x0 - 80, 838, W, H], width: 7, length: 90, spacing: 0.6, overlap: 0.6, angle: () => r.range(-0.012, 0.012), color: (x, y) => { const h = back(y); return h > HALL.eaves ? mix('#141230', '#201c3c', nA(x / 60, y / 5)) : mix('#24244c', '#30305e', nA(x / 60, y / 5)); }, stroke: { ...line, opacity: 0.72 } });
  // the gold of each screen is a soft upright light in the water, and the small waves cut it into short pieces
  for (let i = 0; i < 16; i++) { if ([3, 11].includes(i)) continue; const x = HALL.x0 + 26 + i * 51.25;
    p.stroke({ brush: 'soft', color: '#f0a050', width: 20, opacity: 0.2, taper: [0.3, 0.8], points: [[x, 856], [x + edge(x, 890) * 0.3, 892], [x, 934]] });
    for (let y = 860 + r.range(0, 6); y < 930; y += r.range(6, 13)) { const l = r.range(7, 20) * (1 - (y - 860) / 160); p.tryStroke({ brush: 'round', color: mix('#f0a050', '#ffe09c', r()), width: 4.4, opacity: r.range(0.3, 0.75) * (1 - (y - 858) / 120), taper: [0.4, 0.4], points: [[x - l + edge(x, y) + r.range(-5, 5), y], [x + l + edge(x, y) + r.range(-5, 5), y + r.range(-0.6, 0.6)]] }); } }
}
for (let k = 0; k < 90; k++) { const x = r.range(0, W), y = r.range(BANK + 44, H - 6), len = r.range(30, 140); p.tryStroke({ brush: 'round', color: mix('#c87c84', '#ffd490', glare(x, y - 300, 600)), width: 4, opacity: r.range(0.12, 0.36), taper: [0.5, 0.5], points: [[x, y], [x + len, y + r.range(-1, 1)]] }); }

// ---------------------------------------------------------------- the trees behind the farmhouse: dark round heads against the sky
for (const [x, y, s] of [[30, 470, 92], [158, 440, 78], [262, 520, 58], [-20, 570, 70], [340, 580, 36]]) {
  p.tryStroke({ ...line, color: '#141430', width: Math.max(6, s * 0.14), points: [[x, y + s * 0.5], [x + 3, 740]] });
  // a crown is many short dabs, each a few leaves: the dabs near its edge are small, so its edge is ragged
  const dab = (px, py, w, c, op = 1) => { const a = r.range(-0.9, 0.9); p.tryStroke({ ...line, rag: 0.5, color: c, width: w, opacity: op, points: [[px - Math.cos(a) * w * 1.1, py - Math.sin(a) * w * 1.1], [px + Math.cos(a) * w * 1.1, py + Math.sin(a) * w * 1.1]] }); };
  for (let k = 0; k < 150; k++) { const a = r.range(0, Math.PI * 2), d = Math.sqrt(r()), px = x + Math.cos(a) * d * s, py = y + Math.sin(a) * d * s * 0.86; dab(px, py, 7 + 13 * (1 - d), mix('#17193c', '#272b52', r())); }
  // the side of the crown that is toward the light takes a little red at its edge
  for (let k = 0; k < 40; k++) { const a = r.range(-1.5, 0.7), d = r.range(0.72, 1.02), px = x + Math.cos(a) * d * s, py = y + Math.sin(a) * d * s * 0.86; dab(px, py, r.range(5, 8), mix('#8c4868', '#e08860', r() * glare(px, py, 600) * 1.6), 0.7); }
}

// ---------------------------------------------------------------- the farmhouse at the left, and its water wheel
{ const wallTop = 628, base = 756, x0 = -30, x1 = 232;
  p.fill({ inside: (x, y) => x > x0 && x < x1 && y > wallTop && y < base, bounds: [0, wallTop, x1, base], width: 9, length: 60, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2, color: (x, y) => mix(mix('#1e1a34', '#2e2644', hash(Math.floor(x / 16), 2)), '#6c4450', smooth(x1 - 40, x1, x) * 0.5), stroke: { ...flat, opacity: 0.97 } });
  for (const x of [20, 126, x1 - 4]) p.tryStroke({ ...flat, color: '#100e22', width: 9, points: [[x, wallTop], [x, base]] });
  // its paper window, lit
  lamp(76, 694, 1.2); p.fill({ inside: (x, y) => x > 44 && x < 106 && y > 660 && y < 728, bounds: [44, 660, 106, 728], width: 7, length: 40, spacing: 0.5, angle: () => Math.PI / 2, color: (x, y) => mix(mix('#f8c070', '#ffe6a8', nB(x / 9, y / 40)), '#c87838', smooth(700, 728, y) * 0.5), stroke: { ...flat, rag: 0.03, opacity: 0.97 } });
  for (const yy of [683, 706]) p.tryStroke({ brush: 'round', color: '#5c3c2c', width: 4, opacity: 0.7, points: [[45, yy], [105, yy]] });
  for (const xx of [65, 86]) p.tryStroke({ brush: 'round', color: '#5c3c2c', width: 4, opacity: 0.7, points: [[xx, 661], [xx, 727]] });
  // its roof of thatch: thick, and round at its edges. The light is behind it at the right, so its right slope has a red edge.
  const roof = [[-60, 640], [-20, 534], [20, 512], [150, 512], [196, 534], [270, 640]], inRoof = inPoly(roof);
  p.fill({ inside: inRoof, bounds: [0, 505, 272, 644], width: 8, length: 46, spacing: 0.5, overlap: 0.6, angle: (x) => Math.PI / 2 + clamp((x - 85) / 300, -0.6, 0.6), color: (x, y) => { let c = mix('#2e2a48', '#3a3454', nC(x / 9, y / 34)); c = mix(c, '#55507c', smooth(560, 512, y) * 0.4); return mix(c, '#c8684c', smooth(60, 0, 270 - (y - 512) * 0.0 - x - (640 - y) * 0.58) * 0.75); }, stroke: { ...line, rag: 0.3, opacity: 0.97 } });
  p.tryStroke({ ...line, rag: 0.3, color: '#14122a', width: 13, points: [[-20, 644], [120, 646], [272, 643]] });                     // the thick dark edge of the thatch
  p.tryStroke({ ...line, rag: 0.2, color: '#3c3458', width: 9, points: [[16, 510], [85, 507], [154, 510]] });                         // its cap
  for (let k = 0; k < 5; k++) p.tryStroke({ ...flat, color: '#1a1830', width: 6, points: [[30 + k * 28, 500], [30 + k * 28, 516]] });    // the bars across its cap
  p.tryStroke({ brush: 'round', color: '#ffac64', width: 4.4, opacity: 0.85, points: [[156, 512], [198, 533], [268, 636]] });
  // the wheel: dark wood, with spokes and blades; the gold of the sky is on the side of its rim that is toward the light
  const cx = 296, cy = 712, R = 50;
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.2; p.tryStroke({ ...line, mix: 0, color: '#100e22', width: 6, points: [[cx, cy], [cx + Math.cos(a) * R, cy + Math.sin(a) * R]] }); }
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * Math.PI * 2; p.tryStroke({ ...line, mix: 0, color: '#100e22', width: 9, points: arc(cx, cy, R, a0, a0 + 0.5, 4) }); }
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + 0.1; p.tryStroke({ ...flat, color: '#17142c', width: 6, points: [[cx + Math.cos(a) * (R - 3), cy + Math.sin(a) * (R - 3)], [cx + Math.cos(a) * (R + 11), cy + Math.sin(a) * (R + 11)]] }); }
  p.tryStroke({ brush: 'round', color: '#f09c5c', width: 4.4, opacity: 0.85, points: arc(cx, cy, R + 4, -1.2, 0.5, 9) });
  disc5(cx, cy);
  p.tryStroke({ ...flat, color: '#17142c', width: 9, points: [[228, 742], [360, 742]] });                                             // the trough under it
}
function disc5(x, y) { p.tryStroke({ ...line, mix: 0, color: '#2c2440', width: 12, points: [[x - 3, y], [x + 3.2, y]] }); }

// ---------------------------------------------------------------- the hall of the school
{ const { x0, x1, eaves, ridge, ground, hip, over } = HALL, L = x0 - over, R = x1 + over, mid = (x0 + x1) / 2;
  // its wall of dark wood, and its paper screens, lit from inside
  p.fill({ inside: (x, y) => x > x0 && x < x1 && y > eaves && y < ground, bounds: [x0, eaves, W, ground], width: 9, length: 70, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2, color: (x, y) => mix(mix('#1c1830', '#2a2240', hash(Math.floor(x / 18), 5)), '#0e0c1e', smooth(600, eaves, y) * 0.6), stroke: { ...flat, opacity: 0.97 } });
  for (const [w, op] of [[320, 0.05], [200, 0.07]]) glow(p, mid, 690, w, '#ffb050', op, 5, 0.4);
  const S0 = 630, S1 = 738, PITCH = 51.25;
  for (let i = 0; i < 16; i++) { const x = x0 + 6 + i * PITCH, lit = ![3, 11].includes(i), bright = 0.7 + 0.3 * hash(i, 8);
    p.fill({ inside: (px, py) => px > x && px < x + 40 && py > S0 && py < S1, bounds: [x, S0, x + 40, S1], width: 7, length: 50, spacing: 0.5, angle: () => Math.PI / 2, color: (px, py) => (lit ? mix(mix(mix('#f0b060', '#ffe6a8', nB(px / 9, py / 40)), '#c87838', smooth(700, S1, py) * 0.5), '#a86030', 1 - bright) : mix('#221c34', '#2e2844', nB(px / 9, py / 30))), stroke: { ...flat, rag: 0.03, opacity: 0.97 } });
    for (const yy of [665, 701]) p.tryStroke({ brush: 'round', color: lit ? '#6c4430' : '#17142a', width: 4, opacity: 0.7, points: [[x + 1, yy], [x + 39, yy]] });
    p.tryStroke({ brush: 'round', color: lit ? '#6c4430' : '#17142a', width: 4, opacity: 0.7, points: [[x + 20, S0 + 2], [x + 20, S1 - 2]] }); }
  for (let i = 0; i <= 8; i++) p.tryStroke({ ...flat, mix: 0, color: '#100c20', width: 11, points: [[x0 + i * 102.5, eaves + 4], [x0 + i * 102.5, ground + 2]] });    // posts
  p.tryStroke({ ...flat, mix: 0, color: '#100c20', width: 9, points: [[x0, 614], [mid, 614], [W + 10, 614]] });                                                    // the beam over the screens
  p.tryStroke({ ...flat, color: '#3c2c3c', width: 12, points: [[x0 - 18, 746], [mid, 746], [W + 10, 746]] });                                                      // the veranda
  p.tryStroke({ brush: 'round', color: '#f0a864', width: 4.4, opacity: 0.6, points: [[x0 - 18, 740], [mid, 740], [W + 10, 740]] });
  p.tryStroke({ ...flat, color: '#161426', width: 18, points: [[x0 - 12, ground - 6], [mid, ground - 6], [W + 10, ground - 6]] });                                 // the stones under it
  // the light of the screens, on the path in front of them
  for (let i = 0; i < 16; i++) { if ([3, 11].includes(i)) continue; const x = x0 + 26 + i * PITCH; p.stroke({ brush: 'soft', color: '#e8904c', width: 12.5, opacity: 0.2, taper: [0.2, 0.8], points: [[x, ground + 2], [x - (x - mid) * 0.02, BANK - 1]] }); }

  // its roof. First one dark coat; then the rows of tiles, which go down the slope.
  const inRoof = (x, y) => x > L && x < R && y > roofTop(x) && y < eaves + 4;
  const tile = (x, y) => { const t = (y - ridge) / (eaves - ridge); let c = mix('#474380', '#2a2850', clamp(t * 0.9, 0, 1)); c = mix(c, '#6c5894', smooth(0.3, 0, t) * 0.5); return mix(c, '#d87c50', smooth(L + 150, L, x - (y - ridge) * 0.62) * 0.65); };
  p.fill({ inside: inRoof, bounds: [L, ridge - 4, W, eaves + 4], width: 16, length: 110, spacing: 0.45, overlap: 0.6, angle: () => r.range(-0.02, 0.02), color: tile, stroke: { ...line, opacity: 0.98 } });
  p.fill({ inside: inRoof, bounds: [L, ridge - 4, W, eaves + 4], width: 8, length: 60, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2, color: (x, y) => mix(tile(x, y), hash(Math.floor(x / 13), 3) < 0.5 ? '#1e1c40' : '#5a548c', 0.22), stroke: { ...flat, rag: 0.04, opacity: 0.9 } });
  for (let x = L + 8; x < W + 10; x += 13) { const yt = roofTop(x) + 9; if (eaves - yt > 30) { p.tryStroke({ brush: 'round', color: '#17152e', width: 4, opacity: 0.5, points: [[x, yt], [x, eaves - 3]] }); p.tryStroke({ brush: 'round', color: '#8c80bc', width: 4, opacity: 0.22, points: [[x + 6, yt + 2], [x + 6, yt + Math.min(60, (eaves - yt) * 0.5)]] }); } }
  // the edge of the eaves, which goes up a little at the corner; the round ends of the tiles along it; and the dark under it
  const eave = [[L - 26, eaves - 13], [L + 40, eaves - 1], [mid, eaves + 2], [W + 20, eaves + 1]];
  p.tryStroke({ ...flat, mix: 0, color: '#0c0a1c', width: 16, points: eave.map(([a, b]) => [a, b + 11]) });
  p.tryStroke({ ...flat, color: '#5c5088', width: 7, points: eave });
  for (let x = L + 12; x < W; x += 13) p.tryStroke({ brush: 'round', color: '#9c8cc0', width: 4.4, opacity: 0.6, points: [[x - 3, eaves + 1], [x + 3.2, eaves + 1]] });
  // the ridge: a thick bar, with a tall end tile at each end; and the two hips
  p.tryStroke({ ...flat, color: '#1c1a34', width: 16, points: [[x0 + hip - 6, ridge - 3], [x1 - hip + 6, ridge - 3]] });
  p.tryStroke({ brush: 'round', color: '#b89cc8', width: 4.4, opacity: 0.75, points: [[x0 + hip, ridge - 11], [x1 - hip, ridge - 11]] });
  for (const [x, s] of [[x0 + hip - 6, -1], [x1 - hip + 6, 1]]) { p.tryStroke({ ...line, mix: 0, color: '#16142c', width: 14, taper: [0, 0.6], points: [[x - s * 4, ridge + 2], [x + s * 4, ridge - 16], [x + s * 12, ridge - 30]] }); }
  for (const [a, b] of [[[L, eaves - 2], [x0 + hip, ridge]], [[R, eaves - 2], [x1 - hip, ridge]]]) p.tryStroke({ ...line, color: '#1a1832', width: 11, points: [a, b] });
  p.tryStroke({ brush: 'round', color: '#ffb468', width: 4.8, opacity: 0.9, points: [[L - 24, eaves - 17], [L + 2, eaves - 9], [(L + x0 + hip) / 2 - 4, (eaves + ridge) / 2 - 4], [x0 + hip - 6, ridge - 6]] });   // the gold of the sky down its left hip
}

// ---------------------------------------------------------------- the paper lanterns on posts, along the path
for (const [x, y] of [[646, 790], [1034, 790], [1388, 790]]) {
  p.stroke({ brush: 'soft', color: '#e8904c', width: 44, opacity: 0.22, points: [[x - 64, y + 2], [x, y + 6], [x + 64, y + 2]] });
  p.tryStroke({ ...flat, mix: 0, color: '#120e20', width: 6, points: [[x, y + 4], [x, y - 96]] });
  lamp(x, y - 110, 1); p.tryStroke({ ...line, mix: 0, color: '#ffe0a0', width: 16, points: [[x, y - 124], [x, y - 96]] }); p.tryStroke({ ...flat, mix: 0, color: '#120e20', width: 5, points: [[x - 11, y - 129], [x + 11, y - 129]] });
  for (let k = 0; k < 3; k++) p.tryStroke({ brush: 'soft', color: '#ffb050', width: 9, opacity: 0.34, taper: [0.1, 0.7], points: [[x + r.range(-3, 3), BANK + 40 + k * 44], [x + r.range(-3, 3), BANK + 76 + k * 44]] });   // its light, down the water
}

// ---------------------------------------------------------------- the boat that is tied up in the canal
{ const y = 868, a = 1010, b = 1420;
  p.tryStroke({ brush: 'soft', color: '#0a0a20', width: 20, opacity: 0.5, points: [[a + 10, y + 16], [(a + b) / 2, y + 20], [b - 10, y + 16]] });
  p.tryStroke({ ...line, mix: 0, color: '#12101f', width: 20, taper: [0.3, 0.2], points: [[a - 26, y - 20], [a + 30, y + 2], [(a + b) / 2, y + 6], [b - 40, y + 2], [b + 12, y - 12]] });
  p.tryStroke({ brush: 'round', color: '#c88c7c', width: 4.4, opacity: 0.8, points: [[a - 24, y - 27], [a + 30, y - 7], [(a + b) / 2, y - 3], [b - 40, y - 7], [b + 10, y - 20]] });
  p.tryStroke({ ...flat, mix: 0, color: '#12101f', width: 5, points: [[b - 70, y - 4], [b - 96, y - 124]] });                         // its pole, which leans
  for (const x of [a + 110, a + 230]) p.tryStroke({ ...flat, color: '#241e34', width: 6, points: [[x, y - 4], [x + 3, y + 6]] });
}

// ---------------------------------------------------------------- the holy rope, on its two poles; one pole has the horns
{ const A = [60, 398], B = [592, 366];
  for (const [x, y] of [A, B]) { p.tryStroke({ ...flat, mix: 0, color: '#120e22', width: 12, points: [[x, 786], [x, y - 24]] }); p.tryStroke({ brush: 'round', color: '#f0985c', width: 4.4, opacity: 0.75, points: [[x + 6, 776], [x + 6, y - 14]] }); }
  const at = (t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t + 66 * 4 * t * (1 - t)], pts = []; for (let i = 0; i <= 20; i++) pts.push(at(i / 20));
  p.tryStroke({ ...line, rag: 0.3, color: '#3c2c28', width: 13, points: pts }); p.tryStroke({ brush: 'round', color: '#e0a868', width: 4.4, opacity: 0.6, points: pts.map(([x, y]) => [x, y - 4]) });
  for (let i = 1; i < 20; i += 1) { const [x, y] = at((i + 0.5) / 20); p.tryStroke({ brush: 'round', color: '#201820', width: 4, opacity: 0.5, points: [[x - 3, y - 6], [x + 3, y + 6.4]] }); }   // the twist of the straw
  for (let i = 2; i < 20; i += 3) { let [px, py] = at(i / 20); py += 8; for (let k = 0; k < 3; k++) { const nx = px + (k % 2 ? -9 : 9); p.tryStroke({ ...flat, rag: 0.03, color: mix('#d8ccd4', '#fff4e8', r()), width: 11, points: [[px, py], [nx, py + 24]] }); px = nx; py += 22; } }
  for (let i = 3.5; i < 20; i += 3) { const [px, py] = at(i / 20); for (let k = -1; k <= 1; k++) p.tryStroke({ ...line, color: '#4c3828', width: 5, taper: [0, 0.6], points: [[px + k * 4, py + 4], [px + k * 7, py + 34]] }); }   // tufts of straw that hang between the papers
  // the horns: two dark cones on the head of the pole, one each way; the mouth of each is wide, and its rim takes the light
  for (const s of [-1, 1]) {
    const hy = B[1] - 34, cone = [[B[0] + s * 4, hy - 7], [B[0] + s * 52, hy - 24], [B[0] + s * 52, hy + 24], [B[0] + s * 4, hy + 7]];
    p.fill({ inside: inPoly(cone), bounds: [B[0] - 56, hy - 26, B[0] + 56, hy + 26], width: 6, length: 20, spacing: 0.45, overlap: 0.6, angle: () => 0, color: (x) => mix('#221c36', '#14102a', Math.abs(x - B[0]) / 52), stroke: { ...flat, opacity: 0.98 } });
    p.tryStroke({ ...line, mix: 0, color: '#0e0a1c', width: 7, points: [[B[0] + s * 52, hy - 25], [B[0] + s * 55, hy], [B[0] + s * 52, hy + 25]] });
    p.tryStroke({ brush: 'round', color: '#f09c6c', width: 4.2, opacity: 0.85, points: [[B[0] + s * 6, hy - 10], [B[0] + s * 50, hy - 27]] });
  }
  p.tryStroke({ ...flat, mix: 0, color: '#120e22', width: 14, points: [[B[0] - 9, B[1] - 34], [B[0] + 9, B[1] - 34]] }); }

p.save();
