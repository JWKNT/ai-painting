// The capital of Lugunica, spread out below the terrace: mountains at the edge of the sky,
// the white castle on its hill with its blue spires, and then roofs, row behind row, out to
// the walls. The air is full of light, so the far part of the city is pale and the near part
// has more color. The sun is at the right, so every wall and roof is lit on that side.
'use strict';
const { studio, open, W, HORIZON, far, wallTop, nA, nB } = require('./scene');
const { mix, through, wave } = studio;

const p = open('city');
const r = p.rng;
const flat = { brush: 'bristle', mix: 0.12, dry: 0.03, rag: 0.15, cap: 'flat' };

// The mountains.
for (const [line, d, c] of [[through([[0, 392], [140, 366], [300, 388], [470, 410], [620, 428], [760, 440]]), 0.9, '#7c96c4'], [through([[1180, 440], [1300, 414], [1420, 384], [1520, 396], [1600, 372]]), 0.88, '#8098c4'], [through([[0, 420], [200, 404], [380, 424], [520, 440]]), 0.82, '#7a94b4']]) {
  const top = (x) => line(x) + 6 * (nA(x / 40, d * 30) - 0.5);
  p.fill({ inside: (x, y) => y > top(x) && y < HORIZON + 6, bounds: [0, 350, W, HORIZON + 6], width: 9, length: 46, spacing: 0.5, angle: (x, y) => 0.5 + (nB(x / 60, y / 40) - 0.5) * 1.6, color: (x, y) => far(mix(c, '#c8d4e8', nB(x / 50, y / 20) * 0.5), x, y, d), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.2, rag: 0.3 } });
}

// The castle, on its hill. Its towers are white, each with a blue roof that comes to a point.
{
  const D = 0.68, hillTop = (x) => 440 - 34 * Math.exp(-Math.pow((x - 1070) / 150, 2));
  p.fill({ inside: (x, y) => y > hillTop(x) && y < HORIZON + 8, bounds: [860, 400, 1290, HORIZON + 8], width: 8, length: 40, spacing: 0.5, angle: () => r.range(-0.2, 0.2), color: (x, y) => far(mix('#8ca87c', '#b8c49c', nB(x / 30, y / 12)), x, y, D), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.2, rag: 0.3 } });
  const tower = (x, base, h, w) => {
    p.tryStroke({ ...flat, color: far('#b9b6cc', x, base, D), width: w, points: [[x, base], [x, base - h]] });
    p.tryStroke({ ...flat, color: far('#fff8ea', x, base, D), width: Math.max(4.8, w * 0.5), points: [[x + w * 0.25, base], [x + w * 0.25, base - h]] });
    p.tryStroke({ ...flat, cap: 'round', color: far('#5c7cc0', x, base - h, D), width: w + 3, taper: [0, 0.9], points: [[x, base - h + 3], [x, base - h - w * 1.1], [x, base - h - w * 2.4]] });
    p.tryStroke({ color: far('#a8c0f0', x, base - h, D * 0.8), width: 4, opacity: 0.8, taper: [0, 0.8], points: [[x + w * 0.3, base - h + 2], [x + 1.5, base - h - w * 2.2]] });
  };
  p.tryStroke({ ...flat, color: far('#c4c0d4', 1070, 412, D), width: 26, points: [[980, 414], [1070, 408], [1160, 414]] });                 // the wall of it, round the top of the hill
  p.tryStroke({ ...flat, color: far('#fff6e4', 1070, 404, D), width: 9, points: [[1040, 400], [1100, 398], [1162, 404]] });
  for (const [x, base, h, w] of [[984, 420, 34, 12], [1016, 414, 58, 13], [1140, 416, 46, 13], [1166, 422, 30, 12], [1046, 408, 80, 16], [1108, 410, 70, 15], [1078, 404, 112, 19]]) tower(x, base, h, w);
  p.tryStroke({ ...flat, color: far('#c8c4d8', 1078, 380, D), width: 40, points: [[1038, 392], [1078, 388], [1120, 392]] });                 // the great hall between the towers
  p.tryStroke({ ...flat, color: far('#fffaf0', 1090, 378, D), width: 16, points: [[1070, 386], [1098, 384], [1122, 388]] });
  p.tryStroke({ ...flat, color: far('#5c7cc0', 1078, 366, D), width: 9, points: [[1034, 370], [1078, 364], [1124, 370]] });
}

// The roofs of the city. Each house is a wall and a roof. They are in rows, small and pale far off, larger and warmer near us.
const roofs = ['#cc7450', '#d8905c', '#c4623f', '#e0a068', '#6a82a8', '#b85a44', '#d07c54'];
const rows = [[452, 9], [462, 10], [474, 12], [488, 14], [504, 17], [522, 20], [544, 24], [570, 28], [598, 32]];
rows.forEach(([base, h], i) => {
  const d = 0.78 - 0.5 * i / (rows.length - 1);
  for (let x = -20 + r.range(0, 20); x < W + 20;) {
    const w = h * r.range(2.1, 3.6), tall = h * r.range(0.8, 1.3), y = base + r.range(-3, 3);
    if (y - tall < wallTop(x + w / 2) + 6 && !(Math.abs(x - 1070) < 190 && y < 456)) {
      if (r() < 0.07) {                                                    // a tree in a yard, or a row of them
        p.tryStroke({ brush: 'bristle', color: far(mix('#4c7448', '#86a85c', r()), x, y, d), width: Math.max(5, tall * 0.9), mix: 0.15, dry: 0.04, rag: 0.4, cap: 'round', points: [[x, y - tall * 0.3], [x + w, y - tall * 0.3 + r.range(-2, 2)]] });
      } else {
        const wallH = Math.max(4.8, tall * 0.55), roofH = Math.max(4.8, tall * 0.5), roof = roofs[Math.floor(r() * roofs.length)];
        p.tryStroke({ ...flat, color: far(mix('#cbbfca', '#e6d8c4', r()), x, y, d), width: wallH, points: [[x, y - wallH / 2], [x + w, y - wallH / 2]] });                             // its wall, in the shade of its own eaves
        p.tryStroke({ ...flat, color: far('#fff4dc', x, y, d), width: wallH, points: [[x + w * 0.62, y - wallH / 2], [x + w + Math.max(0, 2.1 * wallH - w * 0.38), y - wallH / 2]] });      // and the end of it that is toward the sun
        p.tryStroke({ ...flat, rag: 0.3, color: far(mix(roof, '#7c4c44', 0.25), x, y, d), width: roofH, points: [[x - 2, y - wallH - roofH / 2 + 1], [x + w + 2, y - wallH - roofH / 2 + 1]] });   // its roof
        p.tryStroke({ ...flat, rag: 0.3, color: far(mix(roof, '#ffe2b0', 0.4), x, y, d), width: Math.max(4.8, roofH * 0.5), points: [[x + 1, y - wallH - roofH * 0.75], [x + w + 1, y - wallH - roofH * 0.75]] });
        if (h >= 20 && r() < 0.5) p.tryStroke({ ...flat, color: far('#8c6058', x, y, d), width: 5, points: [[x + w * r.range(0.2, 0.7), y - wallH - roofH + 2], [x + w * 0.5, y - wallH - roofH - 11]].map(([px, py], k, a) => [a[0][0], py]) });   // a chimney
      }
    }
    x += w + r.range(1, h * 0.8);
  }
  // towers and spires that stand up out of the row
  for (let k = 0; k < (i % 2 ? 2 : 1); k++) {
    const x = r.range(40, W - 40), th = h * r.range(2, 3.6), tw = Math.max(5, h * r.range(0.45, 0.8));
    if (base - th < 446 && Math.abs(x - 1070) < 200) continue;
    if (base > wallTop(x) + 4) continue;
    p.tryStroke({ ...flat, color: far('#c2bccd', x, base, d), width: tw, points: [[x, base - h * 0.5], [x, base - th]] });
    p.tryStroke({ ...flat, color: far('#fff6e2', x, base, d), width: Math.max(4.8, tw * 0.5), points: [[x + tw * 0.25, base - h * 0.5], [x + tw * 0.25, base - th]] });
    p.tryStroke({ ...flat, cap: 'round', color: far(r() < 0.5 ? '#5c7cc0' : '#c86c4c', x, base - th, d), width: tw + 3, taper: [0, 0.9], points: [[x, base - th + 2], [x, base - th - Math.max(13, tw * 2.2)]] });
  }
  // the bright air between this row and the next
  if (i < 6) for (let k = 0; k < 5; k++) { const x = r.range(-100, W - 300), len = r.range(300, 600); p.stroke({ brush: 'soft', color: far('#ffffff', x + len / 2, base, 0.5), width: r.range(14, 24), opacity: 0.2 - i * 0.02, points: wave(x, base + 4, x + len, base + 4 + r.range(-3, 3), 2, 1, 6) }); }
});

p.save();
