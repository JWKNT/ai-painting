// The last touches: grass in front of their feet, so that they stand in it; tall plume grass
// at the two near corners, its heads full of the low sun; and a little more of the gold air
// on the side of the sun.
'use strict';
const { studio, open, W, HAKUOWLO, ERURUU, MUKKURU, body } = require('./scene');
const { mix } = studio;

const p = open('accents');
const r = p.rng;
const blade = { brush: 'bristle', mix: 0.15, dry: 0.04, rag: 0.25 };

// Grass in front of their feet.
const tuft = (x0, x1, y, h, n) => {
  for (let k = 0; k < n; k++) {
    const x = r.range(x0, x1), len = h * r.range(0.6, 1.2), lit = r();
    p.tryStroke({ ...blade, color: mix(mix('#4a5630', '#8c8a42', lit), '#e2ca70', lit > 0.75 ? 0.6 : 0), width: r.range(4.8, 7), taper: [0, 0.8], points: [[x, y + r.range(0, 8)], [x - len * 0.15, y - len * 0.55], [x - len * 0.4 + r.range(-4, 4), y - len]] });
  }
};
const K = body(HAKUOWLO), E = body(ERURUU), M = body(MUKKURU);
tuft(K(-66, 0)[0], K(60, 0)[0], HAKUOWLO.y + 6, 34, 26);
tuft(E(-56, 0)[0], E(54, 0)[0], ERURUU.y + 5, 30, 22);
for (const fx of [-250, -130, 128, 200]) tuft(M(fx - 44, 0)[0], M(fx + 50, 0)[0], MUKKURU.y + 4, 20, 9);

// Plume grass. Each clump is a sheaf of long stalks that bend away from the sun; most of
// them carry a head, which is three or four soft strokes that hang from the tip.
function clump(cx, base, n, tall) {
  for (let k = 0; k < n; k++) {
    const x = cx + r.gauss() * 34, h = tall * r.range(0.6, 1.1), lean = r.range(0.25, 0.7), lit = r();
    const tip = [x - h * lean, base - h], mid = [x - h * lean * 0.3, base - h * 0.6];
    p.tryStroke({ ...blade, color: mix(mix('#5a5c34', '#a09248', lit), '#ecd98c', lit > 0.6 ? 0.7 : 0.1), width: r.range(4.8, 6), taper: [0, 0.6], points: [[x, base + 10], mid, tip] });
    if (r() < 0.72) {
      const droop = r.range(40, 76), fall = r.range(0.2, 0.6);
      for (let j = 0; j < 4; j++) {
        const a = [tip[0] + r.range(-3, 3), tip[1] + r.range(-3, 3)], b = [tip[0] - droop * (0.6 + 0.16 * j), tip[1] + droop * (fall + 0.14 * j) - 10];
        p.tryStroke({ ...blade, rag: 0.5, color: mix(mix('#cdb68a', '#f2e4c0', r()), '#fff4d8', lit * 0.5), width: r.range(7, 11), opacity: 0.72, taper: [0.2, 0.8], points: [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 8], b] });
      }
    }
  }
}
for (const [cx, base, n, tall] of [[70, 1010, 26, 300], [214, 1016, 16, 230], [1530, 1014, 22, 200], [1600, 1010, 14, 250], [1420, 1024, 9, 140]]) clump(cx, base, n, tall);

// The gold air on the side of the sun.
for (const [w, op] of [[300, 0.08], [180, 0.08]]) p.stroke({ brush: 'soft', color: '#ffe9a8', width: w, opacity: op, points: [[W + 40, 60], [W - 40, 420], [W + 40, 800]] });

p.save();
