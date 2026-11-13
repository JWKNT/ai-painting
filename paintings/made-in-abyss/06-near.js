// Close to us: a tower of the city that hangs point down over the left of the picture, and
// the ledge that the travelers stand on. The ledge is rock with moss on it. Where the shaft
// of light comes down on it, it is warm and pale; at the two sides it is dark, and there the
// rocks stand up against the bright plain.
'use strict';
const { studio, open, W, H, shaft, lightAt, turned, nA, nB, nC, MOSS } = require('./scene');
const { mix, clamp, smooth, through, glint } = studio;

const p = open('near');
const r = p.rng;
const bristle = { brush: 'bristle', mix: 0.18, dry: 0.04, rag: 0.25 };

// The tower that hangs. We see it from below, with the light of the shaft on its right side.
turned(p, [116, -150], [204, 436], [[0, 150], [0.2, 140], [0.27, 172], [0.33, 128], [0.5, 108], [0.58, 136], [0.65, 90], [0.8, 52], [0.86, 66], [0.92, 30], [1, 3]], 0.1, {
  seed: 61, tones: { lit: '#eedbb6', half: '#bd9f86', shade: '#85677c', deep: '#503a58', bounce: '#c9a999' }, light: [0.62, -0.78], front: 0.3, lanes: 30, piece: 70, grain: 0.22,
  rings: [[0.27, 1.06, 16], [0.58, 1.06, 14], [0.86, 1.08, 9]], windows: [[0.4, 9, 18], [0.46, 9, 18], [0.71, 6, 16], [0.75, 6, 16]], crust: 1.2, moss: 0.25, threads: 1.4, hang: 1.5, horns: 3, tip: 80,
});

// The ledge. Its far edge is broken; the ground of it comes toward us from there: rock, pale
// and warm where the shaft is on it, with moss in the hollows.
const lip = through([[0, 862], [140, 846], [260, 872], [420, 900], [640, 916], [900, 914], [1080, 902], [1240, 880], [1400, 868], [1600, 850]]);
const top = (x) => lip(x) + 20 * (Math.abs(nA(x / 46, 2) - 0.5) * 2 - 0.5) + 8 * (nB(x / 13, 3) - 0.5);
const litAt = (x, y) => clamp(shaft(x, y) * 1.25 + 0.2 + (nB(x / 120, y / 40) - 0.5) * 0.3, 0, 1);
const ground = (x, y) => {
  const lit = litAt(x, y), moss = smooth(0.5, 0.68, nA(x / 170 + 9, y / 40) + 0.2 * (nC(x / 34, y / 12) - 0.5));
  let c = mix(mix('#503d4d', '#6f5a63', nC(x / 60, y / 30)), mix('#bfa189', '#e2ccaa', nC(x / 50, y / 24)), lit * 0.9);
  c = mix(c, mix('#42583a', '#93ad66', lit), moss * 0.78);
  return mix(c, '#37283a', smooth(930, 1012, y) * 0.5);                                     // darker toward us
};
const run = (x) => Math.atan2(lip(x + 30) - lip(x - 30), 60) + r.range(-0.07, 0.07);
for (let x = -60; x < W; x += 170) p.stroke({ brush: 'soft', color: '#f8ead4', width: 46, opacity: 0.3, points: [[x, lip(x) - 22], [x + 100, lip(x + 100) - 24], [x + 200, lip(x + 200) - 22]] });   // the haze beyond its edge
p.fill({ inside: (x, y) => y > top(x), bounds: [0, 820, W, H], width: 16, length: 110, spacing: 0.5, angle: run, color: ground, stroke: { ...bristle, opacity: 0.96 } });
p.fill({ inside: (x, y) => y > top(x) + 4, bounds: [0, 820, W, H], width: 8.5, length: 56, spacing: 0.85, overlap: 0.7, angle: run, color: (x, y) => ground(x + r.range(-16, 16), y + r.range(-5, 5)), stroke: { ...bristle, opacity: 0.88 } });
for (let k = 0; k < 12; k++) {                                           // cracks in the rock
  const x = r.range(20, W - 80), y = r.range(top(x) + 14, H - 10), len = r.range(40, 110);
  p.tryStroke({ ...bristle, color: mix('#33243a', '#4f3a4c', r()), width: r.range(4.8, 6.5), opacity: 0.4, rag: 0.3, taper: [0.2, 0.5], points: [[x, y], [x + len / 2, y + r.range(-5, 5)], [x + len, y + r.range(-8, 8)]] });
}
{                                                                        // the light along its edge, where the shaft comes down on it
  const edge = []; for (let x = 470; x <= 1190; x += 12) edge.push([x, top(x) + 2.5]);
  glint(p, edge, () => mix('#fbf0d6', '#d9c4a6', r()), { width: 5, dash: 64, gap: 44, opacity: 0.6, rng: r });
}

// The rocks at its two sides: broken slabs of dark stone that lean in toward the light. The
// top of each is a slant, and there is only a thread of light down one edge of it.
function slab(x, base, w, h, lean, slant) {
  const n = Math.max(2, Math.round(w / 9)), side = lightAt(x, base - h)[0] > 0 ? 1 : -1, tops = [];
  for (let k = 0; k < n; k++) {
    const f = (k + 0.5) / n, bx = x - w / 2 + w * f, toLight = side > 0 ? f : 1 - f, hk = h * (1 - slant * (slant > 0 ? f : f - 1)) * r.range(0.95, 1.03);
    const tx = bx + lean * hk, ty = base - hk;
    tops.push([tx, ty]);
    p.tryStroke({ ...bristle, color: mix(mix('#2e2135', '#4c3a4e', nC(bx / 20, ty / 40)), '#85707a', smooth(0.55, 1, toLight) * 0.65), width: Math.max(6, w / n * 1.8), cap: 'flat', points: [[bx, base], [(bx + tx) / 2 + r.range(-2, 2), (base + ty) / 2], [tx, ty]] });
  }
  const e = side > 0 ? tops[n - 1] : tops[0], ex = x + side * w * 0.46;
  glint(p, [[e[0] + side * 2, e[1] + 4], [(e[0] + ex) / 2 + side * 2, (e[1] + base) / 2], [ex + side * 2, base - h * 0.2]], () => mix('#f6e6c8', '#cdb698', r()), { width: 4.6, dash: 26, gap: 16, opacity: 0.6, rng: r });
  glint(p, tops.map(([tx, ty]) => [tx, ty + 2]), () => mix('#d8c4a6', '#a8949a', r()), { width: 4.6, dash: 16, gap: 10, opacity: 0.5, rng: r });   // a little light on its top
  for (let k = 0; k < Math.round(w / 30); k++) {                         // moss on it
    const y = base - h * r.range(0.15, 0.6), bx = x + lean * (base - y) + r.range(-0.3, 0.3) * w * 0.6, len = r.range(16, 30);
    p.tryStroke({ ...bristle, color: mix(r.pick(MOSS), '#33482e', 0.5), width: r.range(6, 9), opacity: 0.8, rag: 0.4, taper: [0.1, 0.5], points: [[bx, y], [bx + r.range(-4, 4), y + len]] });
  }
}
for (const [x, w, h, lean, slant] of [[30, 120, 190, 0.1, 0.3], [226, 84, 142, 0.2, -0.25], [118, 80, 150, 0.16, 0.2], [1572, 116, 170, -0.14, -0.3], [1446, 80, 138, -0.1, 0.25], [174, 62, 96, 0.1, -0.2], [300, 66, 70, 0.16, 0.3], [1508, 70, 104, -0.2, -0.2], [1364, 60, 60, -0.18, 0.25]]) slab(x, 1014, w, h, lean, slant);

// Plants on the ledge: a few clumps of thin blades, bent a little all one way.
for (const [x, y, n, s] of [[372, 950, 11, 1], [548, 974, 8, 0.8], [1018, 954, 9, 0.9], [1140, 940, 12, 1.1], [948, 992, 7, 0.9]]) {
  for (let k = 0; k < n; k++) {
    const bx = x + r.gauss() * 10 * s, ang = -Math.PI / 2 + r.gauss() * 0.4, len = r.range(16, 52) * s, lit = litAt(bx, y);
    const mid = [bx + Math.cos(ang) * len * 0.5, y + Math.sin(ang) * len * 0.55], tip = [bx + Math.cos(ang) * len + len * 0.22, y + Math.sin(ang) * len * 0.96];
    p.tryStroke({ color: mix(mix('#3c5236', '#6f8c52', r()), '#dfe6c0', lit * r.range(0, 0.6)), width: 4, opacity: 0.9, taper: [0, 0.8], points: [[bx, y + r.range(-3, 3)], mid, tip] });
  }
}

p.save();
