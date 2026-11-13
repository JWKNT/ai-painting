// What is close to us: undergrowth along the far edge of the glade, the two great trunks that
// stand at either side of the picture, creepers, big leaves in the corners, the pale flowers
// called Silent Princess round the platform, and the Koroks, who live here: small people of
// wood, each with a leaf for a face.
'use strict';
const { studio, open, W, SUNWARD, GROUND, shaft, far, sun, nA, nB } = require('./scene');
const { mix, solid, glint } = studio;

const p = open('near');
const r = p.rng;
const leaf = (x, y, a, len, w, color, o = 0.95) => p.tryStroke({ brush: 'bristle', color, width: w, opacity: o, taper: [0.15, 0.6], mix: 0.08, dry: 0, rag: 0.15, cap: 'round', points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });

// Undergrowth where the floor of the glade meets the forest: ferns and low bushes, leaf by leaf.
for (let k = 0; k < 900; k++) {
  const x = r.range(-20, W + 20);
  if (Math.abs(x - 800) < 330) continue;                                 // the foot of the tree is clear
  const y = GROUND + r.range(-46, 26) + 16 * Math.pow(Math.abs(x - 800) / 800, 2);
  if (nB(x / 60, y / 40) < 0.38) continue;
  const up = r.range(-2.6, -0.5), lit = shaft(x, y) > 0.25 && r() < 0.6;
  leaf(x, y, up, r.range(16, 34), r.range(6, 11), far(lit ? mix('#6c9a3c', '#b4d060', r()) : mix('#12301e', '#2c5a30', r()), x, y, 0.2));
}

// A great trunk at either side, close to us: dark, mossed, with the light down one edge.
for (const [x, w, lean] of [[86, 190, 0.03], [1512, 200, -0.03]]) {
  const tones = { shadow: '#0a1810', half: '#1c3222', lit: '#4a6a3e', rim: '#d8e098', bounce: '#10261e' }, inward = x < 800 ? 1 : -1;   // the light of the glade is on the side of each that is turned to it
  solid(p, [[x - lean * 500, -80, w / 2], [x, 420, w / 2 + 6], [x + lean * 400, 820, w / 2 + 30], [x + lean * 500, 1080, w / 2 + 60]], tones, { light: [inward * 0.72, -0.69], turn: 0.25, width: 11, length: 90, vary: 0.06, dash: 44, gap: 20, edgeOpacity: 0.6 });
  for (let k = 0; k < 70; k++) {                                         // its bark: long furrows, dark, and between them ridges that take a little of the light on the side of the glade
    const u = r.range(-0.48, 0.48), bx = x + u * w, y = r.range(-20, 900), len = r.range(60, 180), toward = u * inward;
    const ridge = toward > -0.1 && r() < 0.55;
    p.tryStroke({ brush: 'bristle', color: ridge ? mix('#2c4630', '#5c7c48', (toward + 0.1) * 1.4 * r()) : '#050d09', width: r.range(6, 11), opacity: ridge ? r.range(0.45, 0.7) : r.range(0.4, 0.7), mix: 0.2, dry: 0.1, rag: 0.3, taper: [0.2, 0.4], points: [[bx, y], [bx + r.range(-8, 8), y + len * 0.5], [bx + r.range(-6, 6), y + len]] });
  }
  p.stroke({ brush: 'soft', color: '#a8c878', width: 40, opacity: 0.12, points: [[x + inward * w * 0.46, -20], [x + inward * (w * 0.46 + 8), 440], [x + inward * (w * 0.5 + 30), 900]] });   // the light of the glade down that edge
  for (let k = 0; k < 60; k++) {                                         // moss on it
    const bx = x + r.range(-0.35, 0.5) * inward * w, y = r.range(100, 940), a = r.range(1.2, 1.9);
    if (nA(bx / 50, y / 70) < 0.5) continue;
    leaf(bx, y, a, r.range(16, 36), r.range(8, 13), sun(mix('#16321c', '#2c5228', r()), bx, y, 0.3), 0.8);
  }
  for (let k = 0; k < 7; k++) {                                          // creepers hanging from it
    const bx = x + r.range(-0.6, 0.6) * w, y = r.range(-10, 240), len = r.range(140, 380), sway = r.range(-30, 30);
    p.tryStroke({ brush: 'bristle', color: '#0a1a10', width: r.range(4.6, 6), opacity: 0.9, taper: [0, 0.6], mix: 0, dry: 0, rag: 0.1, points: [[bx, y], [bx + sway * 0.6, y + len * 0.5], [bx + sway, y + len]] });
    for (let q = 0; q < Math.round(len / 46); q++) { const t = (q + r()) / Math.round(len / 46); leaf(bx + sway * t * (0.6 + 0.4 * t), y + len * t, r.range(0.2, 2.9), r.range(14, 22), r.range(6, 9), mix('#12301e', '#2c5a30', r())); }
  }
}

// Big leaves in the bottom corners, dark, a few with the light on their edges.
for (const [cx, cy, n, dir] of [[40, 1010, 16, -0.9], [240, 1030, 10, -1.3], [1560, 1014, 16, -2.2], [1370, 1034, 10, -1.8]]) {
  for (let k = 0; k < n; k++) {
    const a = dir + r.range(-0.8, 0.8), len = r.range(90, 200), x = cx + r.range(-40, 40), y = cy + r.range(-10, 20), w = r.range(22, 40);
    const tip = [x + Math.cos(a) * len, y + Math.sin(a) * len], bend = [x + Math.cos(a) * len * 0.55 + Math.sin(a) * len * 0.12, y + Math.sin(a) * len * 0.55 - Math.cos(a) * len * 0.12];
    p.tryStroke({ brush: 'bristle', color: mix('#07140d', '#122a18', r()), width: w, taper: [0.2, 0.75], mix: 0, dry: 0, rag: 0.12, cap: 'round', points: [[x, y], bend, tip] });
    p.tryStroke({ brush: 'bristle', color: '#040c08', width: 4.6, opacity: 0.6, taper: [0, 0.6], mix: 0, dry: 0, rag: 0, points: [[x, y], bend, tip] });   // its rib
    if (r() < 0.4) glint(p, [bend, tip], () => mix('#5c8a3c', '#b4d060', r()), { width: 4.4, dash: 26, gap: 10, opacity: 0.6, rng: r });
  }
}

// Silent Princess: a pale flower, blue at its heart, that gives a little light of its own.
function princess(x, y, s) {
  p.stroke({ brush: 'soft', color: '#a8e0ff', width: 26 * s, opacity: 0.22, points: [[x - 28 * s, y - 16 * s], [x + 28 * s, y - 16 * s]] });
  p.tryStroke({ color: '#1c3a2c', width: 4, opacity: 0.9, points: [[x, y], [x + r.range(-3, 3), y - 16 * s]] });                       // its stem
  for (let k = 0; k < 5; k++) {
    const a = -Math.PI / 2 + (k - 2) * 0.62 + r.range(-0.1, 0.1), len = 13 * s + 2;
    p.tryStroke({ brush: 'bristle', color: k % 2 ? mix('#9cccf6', '#c4e2ff', r()) : mix('#eef6ff', '#ffffff', r()), width: Math.max(4.6, 5.5 * s), taper: [0.2, 0.4], mix: 0, dry: 0, rag: 0, cap: 'round', points: [[x, y - 15 * s], [x + Math.cos(a) * len, y - 15 * s + Math.sin(a) * len]] });   // white petals, and blue ones between them
  }
}
for (const [x, y, s] of [[548, 800, 1], [600, 822, 1.1], [1010, 812, 1], [1062, 796, 1.1], [660, 836, 1.2], [960, 840, 1.2], [520, 780, 0.9], [1088, 776, 0.9], [420, 890, 1.5], [1150, 930, 1.6], [330, 800, 1], [620, 940, 1.7]]) princess(x, y, s);

// A Korok: a small body of pale wood, stub arms and legs, and over its face a leaf with two
// holes cut in it for eyes.
function korok(x, y, s, leafColor, o = {}) {
  const wood = mix('#b8a470', '#d8c890', r()), dark = '#5c4c30';
  if (!o.fly) p.stroke({ brush: 'soft', color: '#07140d', width: 22 * s, opacity: 0.35, points: [[x - 22 * s, y + 2], [x + 22 * s, y + 2]] });   // its shadow
  for (const sgn of [-1, 1]) {
    p.tryStroke({ brush: 'bristle', color: dark, width: 6 * s, mix: 0, dry: 0, rag: 0, cap: 'round', points: [[x + sgn * 5 * s, y - 14 * s], [x + sgn * 6 * s, y - 1]] });                                              // legs
    const raise = o.wave && sgn > 0 ? -18 : 6;
    p.tryStroke({ brush: 'bristle', color: wood, width: 5.5 * s, mix: 0, dry: 0, rag: 0, cap: 'round', points: [[x + sgn * 8 * s, y - 30 * s], [x + sgn * 19 * s, y - (30 - raise) * s]] });                             // arms
  }
  p.stroke({ brush: 'bristle', color: wood, width: 19 * s, mix: 0, dry: 0, rag: 0, cap: 'round', points: [[x, y - 10 * s], [x, y - 50 * s]] });                                                                           // the body
  p.tryStroke({ brush: 'bristle', color: dark, width: 6 * s, opacity: 0.4, mix: 0.2, dry: 0, rag: 0, cap: 'round', points: [[x + 5 * s, y - 12 * s], [x + 5 * s, y - 46 * s]] });                                        // its shaded side
  for (const dx of [-6.5, 6.5]) p.stroke({ brush: 'bristle', color: mix(leafColor, dx < 0 ? '#ffffff' : '#000000', 0.14), width: 15 * s, taper: [0.1, 0.5], mix: 0, dry: 0, rag: 0, cap: 'round', points: [[x + dx * s, y - 30 * s], [x + dx * 0.4 * s, y - 66 * s]] });   // the leaf
  p.tryStroke({ color: mix(leafColor, '#000000', 0.4), width: 4, opacity: 0.6, points: [[x, y - 32 * s], [x, y - 66 * s]] });                                                                                              // its rib
  p.tryStroke({ color: mix(leafColor, '#000000', 0.5), width: 4, opacity: 0.9, points: [[x, y - 64 * s], [x + 3 * s, y - 78 * s]] });                                                                                      // and stalk
  for (const dx of [-5.5, 5.5]) p.tryStroke({ color: '#0a0c08', width: 4.2, points: [[x + dx * s, y - 52 * s], [x + dx * s, y - 52 * s + 12.4]] });                                                                      // the two eyes
  if (o.fly) {                                                           // one that flies holds a twig of two leaves over its head, and spins it
    p.tryStroke({ color: '#3c2c1c', width: 4, points: [[x, y - 78 * s], [x, y - 96 * s]] });
    for (const sgn of [-1, 1]) p.tryStroke({ brush: 'bristle', color: mix('#7cb848', '#c4e070', r()), width: 9 * s, taper: [0.1, 0.5], mix: 0, dry: 0, rag: 0, cap: 'round', points: [[x, y - 96 * s], [x + sgn * 30 * s, y - 100 * s]] });
    p.stroke({ brush: 'soft', color: '#d8f0b0', width: 16 * s, opacity: 0.3, points: [[x - 34 * s, y - 98 * s], [x + 34 * s, y - 98 * s]] });
  }
}
korok(432, 668, 0.9, '#6cb040', { wave: true });                         // on the great root, waving
korok(1094, 806, 1.05, '#d8943c');                                       // beside the platform
korok(236, 824, 1.15, '#8cc850');                                        // by the near trunk
korok(1330, 760, 0.85, '#d8c444');                                       // on the far bank of the pool
korok(1150, 560, 0.9, '#7cc048', { fly: true });                         // in the air

p.save();
