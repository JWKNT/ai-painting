// Homura, on the roof. We are behind her. Her hair is black and straight and comes to her
// hips, and the storm takes it out to the left. She has a pale jacket with a wide dark
// collar, a short violet skirt, and black on her legs. On her left arm is her shield, round,
// of grey iron; in her right hand, at her side, is a pistol. She looks up at the witch.
// The cold light of the witch is on her right side, and the fires are behind her legs.
'use strict';
const { studio, open, H, WITCH, HOMURA, roofEdge, nA, nC } = require('./scene');
const { mix, clamp, smooth, solid, glint, arc, noise2 } = studio;

const p = open('homura');
const r = p.rng;
const S = HOMURA.s;
const A = (fx, fy, rad) => (rad == null ? [HOMURA.x + fx * S, HOMURA.y - fy * S] : [HOMURA.x + fx * S, HOMURA.y - fy * S, rad * S]);
const back = (x, y) => [(x - HOMURA.x) / S, (HOMURA.y - y) / S];
const nF = noise2(907);
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round' };
const o = { light: { at: [WITCH.x, WITCH.y] }, turn: 0.35, width: 5.5, length: 20, vary: 0.05, dash: 16, gap: 7, edgeOpacity: 0.85 };

// The fires on the water beyond the roof, behind where she stands: she is seen against them.
for (const [x, y, w, op] of [[300, 838, 150, 0.4], [420, 870, 110, 0.36], [200, 826, 100, 0.3]]) p.stroke({ brush: 'soft', color: '#f08434', width: w, opacity: op, points: [[x - w * 1.02, y + 6], [x, y - 6], [x + w * 1.02, y + 6]] });
for (let k = 0; k < 60; k++) { const x = r.range(40, 600), y = r.range(800, 930), len = r.range(40, 110); if (y < roofEdge(x) - 4) p.tryStroke({ brush: 'bristle', color: mix('#e8641c', '#ffc860', r()), width: r.range(5, 8), opacity: r.range(0.4, 0.85), mix: 0.2, dry: 0.05, rag: 0.3, taper: [0.3, 0.3], points: [[x, y], [x + len, y + r.range(-2, 2)]] }); }

// The roof: flat, of dark stone, cracked. Its far edge has her cold light along it. Part of its rail still stands.
{
  const stone = (x, y) => { const k = clamp((y - roofEdge(x)) / 160, 0, 1); return mix(mix('#2c363e', '#1a2026', nA(x / 120, y / 40)), '#0a0d10', k * 0.7 + (nC(x / 80, y / 8) - 0.5) * 0.3); };
  const slant = Math.atan2(155, 760);
  p.fill({ inside: (x, y) => y > roofEdge(x) && x < 900, bounds: [0, 840, 900, H], width: 12, length: 110, spacing: 0.5, angle: () => slant + r.range(-0.03, 0.03), color: stone, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.2, dry: 0.04, rag: 0.25 } });
  const lip = []; for (let x = -10; x <= 800; x += 30) lip.push([x, roofEdge(x) + 3]);
  p.stroke({ ...line, cap: 'flat', color: '#3c4a54', width: 9, points: lip });
  glint(p, lip.map(([x, y]) => [x, y - 3]), () => mix('#8cacb0', '#d0e4e0', r()), { width: 4.4, dash: 90, gap: 26, opacity: 0.8, rng: r });
  for (const [x, lean, h, rail] of [[40, 0.05, 78, 0], [150, -0.3, 70, 96], [596, 0.12, 74, 88], [700, 0.5, 60, 0]]) {   // the posts of the rail, some of them bent, and what is left of the rail
    const foot = [x, roofEdge(x) + 4], top = [x + lean * h, roofEdge(x) + 4 - h];
    p.stroke({ ...line, cap: 'flat', color: '#0c1014', width: 6, points: [foot, top] });
    p.tryStroke({ color: '#a8c4c4', width: 4, opacity: 0.6, points: [[foot[0] + 3, foot[1] - 4], [top[0] + 3, top[1] + 2]] });
    if (rail) p.stroke({ ...line, color: '#0c1014', width: 5, points: [top, [top[0] + rail * 0.5, top[1] + 22], [top[0] + rail, top[1] + 60]] });
  }
  for (let k = 0; k < 16; k++) {                                         // cracks, and pieces of stone on it
    const x = r.range(0, 760), y = r.range(roofEdge(x) + 14, H), len = r.range(40, 110);
    p.tryStroke({ ...line, color: '#06080a', width: r.range(4.8, 6), opacity: 0.6, rag: 0.3, taper: [0.2, 0.5], points: [[x, y], [x + len * 0.5, y + len * 0.1 + r.range(-5, 5)], [x + len, y + len * 0.2 + r.range(-6, 6)]] });
  }
  for (const [x, y, w] of [[520, 968, 30], [120, 958, 24], [640, 992, 36], [440, 990, 20]]) { p.stroke({ ...line, cap: 'flat', color: '#14181c', width: w * 0.5, points: [[x - w / 2, y], [x + w / 2, y + 3]] }); p.tryStroke({ color: '#8ca8ac', width: 4, opacity: 0.6, points: [[x - w / 2 + 2, y - w * 0.22], [x + w / 2, y - w * 0.22 + 3]].map(([px, py], i) => [px + (i ? Math.max(0, 6.3 - w / 2) : -Math.max(0, 6.3 - w / 2)), py]) }); }
}

// Her shadow on the roof, away from the witch.
p.stroke({ brush: 'soft', color: '#04060a', width: 34, opacity: 0.5, taper: [0, 0.5], points: [A(0, 0), A(-50, -14), A(-120, -34)] });

const tights = { shadow: '#07070c', half: '#14131c', lit: '#30304a', rim: '#a8c4cc', bounce: '#3c1c14' };
const jacket = { shadow: '#56567a', half: '#9698b4', lit: '#e2e6f0', rim: '#ffffff', bounce: '#8c6a68' };
const skin = { shadow: '#8c6c78', half: '#c4a09c', lit: '#f2dccc', rim: '#ffffff', bounce: '#a47870' };
const iron = { shadow: '#2a303c', half: '#5c6676', lit: '#a8b4c0', rim: '#e8f4f4', bounce: '#5c4038' };

// Her legs and her shoes.
for (const s of [-1, 1]) {
  solid(p, [A(s * 8, 3.5, 3.6), A(s * 5, 2.5, 3.2)], tights, { ...o, length: 13, width: 5, edge: false });
  solid(p, [A(s * 6.4, 77, 7), A(s * 6.8, 45, 5.4), A(s * 7, 8, 3.8)], tights, { ...o, length: 28 });
}
glint(p, [A(12.6, 70), A(12, 45), A(10.6, 12)], () => '#a8c4cc', { width: 4, dash: 22, gap: 12, opacity: 0.45, rng: r });   // the cold light down her right leg
glint(p, [A(-12.6, 64), A(-12, 42), A(-10.4, 14)], () => '#ff8c44', { width: 4, dash: 20, gap: 14, opacity: 0.4, rng: r });  // the fires down her left leg

// Her skirt: short, in folds, violet. The wind lifts it to the left.
{
  const down = (fy) => clamp((99 - fy) / 26, 0, 1), halfW = (fy) => 10 + 11 * Math.pow(down(fy), 0.8), axis = (fy) => -3.5 * down(fy);
  const hemAt = (fx) => 73 + 1.6 * Math.sin(fx * 1.3) - 0.14 * fx;
  const inside = (x, y) => { const [fx, fy] = back(x, y); return fy < 100 && fy > hemAt(fx) && Math.abs(fx - axis(fy)) < halfW(fy); };
  const cloth = (x, y) => {
    const [fx, fy] = back(x, y), u = clamp((fx - axis(fy)) / halfW(fy), -1, 1), fold = Math.sin(fx * 1.5 + 0.4) * 0.5 + (nF(fx / 6, fy / 12) - 0.5) * 0.5;
    let c = fold > 0 ? mix('#4c3e78', '#7c6cb0', clamp(fold * 1.5, 0, 1)) : mix('#4c3e78', '#221a3c', clamp(-fold * 1.6, 0, 1));
    return mix(mix(c, '#a8b8d8', smooth(0.5, 1, u) * 0.4), '#ff8c44', smooth(-0.8, -1, u) * 0.4);
  };
  p.fill({ inside, bounds: [...A(-28, 102), ...A(24, 70)], width: 5.5, length: 20, spacing: 0.5, angle: (x, y) => { const [fx, fy] = back(x, y); return Math.atan2(104 - fy, fx - axis(fy) * 2); }, color: cloth, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.12, dry: 0.03, rag: 0.12, cap: 'round' } });
  glint(p, [A(-23, 77.5), A(-10, 74), A(4, 73), A(17, 71.5)], () => mix('#c8c8e8', '#ffffff', r()), { width: 4, dash: 14, gap: 4, opacity: 0.85, rng: r });   // the white under its hem
}

// Her body: the pale jacket, and its wide dark collar across her shoulders.
solid(p, [A(0, 100, 10.5), A(0, 116, 11), A(0, 129, 12.5)], jacket, { ...o, length: 24 });
solid(p, [A(-12, 133, 5), A(0, 136, 5), A(12, 133, 5)], jacket, { ...o, length: 16 });
p.stroke({ ...line, cap: 'flat', color: '#3c3060', width: 15 * S * 0.62, points: [A(-10, 129), A(0, 128), A(10, 129)] });
p.stroke({ ...line, cap: 'flat', color: '#4e4078', width: 15 * S * 0.5, points: [A(-10, 135), A(0, 136), A(10, 135)] });
p.tryStroke({ color: '#c8c8e8', width: 4, opacity: 0.8, points: [A(-10, 123.5), A(0, 122.5), A(10, 123.5)] });                                  // the white line along its edge
p.stroke({ ...line, cap: 'flat', color: '#3c3060', width: 7, points: [A(-10, 100), A(0, 99), A(10.5, 100)] });                                   // the band at her waist

// Her right arm, at her side, and the pistol in her hand.
solid(p, [A(14, 131, 4.8), A(16.5, 112, 4.3), A(17.5, 94, 3.8)], jacket, { ...o, length: 22 });
solid(p, [A(18, 90, 3.2), A(18.5, 86, 3)], skin, { ...o, length: 13, width: 5, edge: false });
p.stroke({ ...line, cap: 'flat', color: '#0a0c10', width: 6.5, points: [A(18.5, 88), A(19.5, 80), A(21, 71)] });                                 // its barrel, which points down
p.stroke({ ...line, cap: 'flat', color: '#0a0c10', width: 6, points: [A(18, 87), A(13.5, 83)].map(([x, y], i) => [x + (i ? -3 : 3), y + (i ? 2 : -2)]) });   // its grip
p.tryStroke({ color: '#a8c0c8', width: 4, opacity: 0.7, points: [A(20.5, 88), A(23, 72)] });

// Her neck and her head, and her hair. Some of it falls straight down her back; most of it the storm takes out to the left, in long locks.
solid(p, [A(0, 138, 3.8), A(0, 142, 3.8)], skin, { ...o, length: 13, width: 5, edge: false });
solid(p, [A(0, 149, 9.4), A(0, 151, 9)], { shadow: '#06060a', half: '#12111a', lit: '#34344c', rim: '#a8c4d0', bounce: '#201418' }, { ...o, length: 14, width: 5 });
p.stroke({ ...line, color: '#4a3c78', width: 5, points: arc(...A(0, 150), 9.6 * S, Math.PI + 0.5, 2 * Math.PI - 0.5, 8) });                      // the band on her hair
const lock = (pts, w, color, op = 1) => p.tryStroke({ ...line, color, width: w, opacity: op, taper: [0, 0.8], points: pts.map((q) => A(...q)) });
for (const [x0, y0, x1, y1, x2, y2] of [[-4, 144, -6, 122, -3, 98], [2, 144, 1, 120, 3, 96], [6, 145, 7, 124, 8, 104]]) lock([[x0, y0], [x1, y1], [x2, y2]], 9, mix('#06060a', '#14141e', r()));
for (let k = 0; k < 11; k++) {
  const t = k / 10, x0 = -7 + 8 * t, y0 = 155 - 13 * t, x2 = -72 + 26 * t + r.range(-4, 4), y2 = 162 - 44 * t + r.range(-4, 4), wave = r.range(-5, 5);
  lock([[x0, y0], [x0 + (x2 - x0) * 0.4, y0 + (y2 - y0) * 0.3 + 3 + wave * 0.4], [x0 + (x2 - x0) * 0.75, y0 + (y2 - y0) * 0.7 - wave], [x2, y2]], r.range(7, 10), mix('#06060a', '#16161f', r()));
}
for (const [x0, y0, x1, y1, x2, y2] of [[-6, 157, -32, 158, -62, 160], [-4, 151, -28, 144, -54, 142], [0, 145, -20, 132, -42, 122]]) lock([[x0, y0 + 1], [x1, y1 + 2], [x2, y2 + 1]], 4.2, '#7c94b8', 0.6);   // her cold light on the tops of the locks
glint(p, arc(...A(0, 150), 9 * S, -1.3, 0.3, 8), () => '#a8c4d0', { width: 4.2, dash: 14, gap: 6, opacity: 0.8, rng: r });                        // and on the side of her head

// Her left arm, bent, and the shield on it, in front of her hair: a round plate of iron with a ring round it and a red stone in the middle.
solid(p, [A(-14, 131, 4.8), A(-18, 113, 4.3), A(-26, 100, 3.9)], jacket, { ...o, length: 20 });
{
  const [cx, cy] = A(-31, 97), R = 16 * S;
  studio.orb(p, [[cx, cy, R]], (x, y) => { const k = clamp(((x - cx) * 0.75 + (cy - y) * 0.65) / R, -1, 1), ring = Math.abs(Math.hypot(x - cx, y - cy) / R - 0.72) < 0.1; return mix(k > 0 ? mix('#5c6676', '#b4c0cc', k) : mix('#5c6676', '#1e242e', -k), '#141a24', ring ? 0.6 : 0); }, { width: 6, reach: 22 });
  studio.disc(p, cx, cy, 9, '#a02038', 6, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round' });
  p.tryStroke({ color: '#ff8c9c', width: 4, opacity: 0.9, points: [[cx - 2, cy - 4.5], [cx + 4.5, cy + 2]].map(([x, y], i) => [x + (i ? 3 : -3), y + (i ? 3 : -3)]) });
  glint(p, arc(cx, cy, R - 2.4, -1.5, 0.4, 10), () => '#e8f4f4', { width: 4.2, dash: 20, gap: 6, opacity: 0.85, rng: r });                       // her cold light on its edge
  glint(p, arc(cx, cy, R - 2.4, 1.9, 3.4, 8), () => '#ff8c44', { width: 4.2, dash: 16, gap: 8, opacity: 0.6, rng: r });                          // and the fires
}

p.save();
