// The ruins of the city. Far off they are only pale shapes in the haze: spires that hang
// point down from overhead, and spires that lean on the plain. Nearer there are four that we
// can see well: one that hangs, a great column that leans into the light, a tower that lies
// on its side in the sand, and a ribbed dome, green with age.
'use strict';
const { studio, open, GROUND, far, turned, MOSS } = require('./scene');
const { mix, wave } = studio;

const p = open('ruins');
const r = p.rng;
// The shape of a spire from its thick end to its point: a shaft with two swellings.
const spire = (r0) => [[0, r0], [0.22, r0 * 0.92], [0.3, r0 * 1.16], [0.37, r0 * 0.8], [0.62, r0 * 0.62], [0.69, r0 * 0.8], [0.76, r0 * 0.5], [0.9, r0 * 0.24], [1, 2]];
const haze = (n, x0, x1, y0, y1, lo, hi) => { for (let k = 0; k < n; k++) { const x = r.range(x0, x1), y = r.range(y0, y1), len = r.range(220, 460); p.stroke({ brush: 'soft', color: mix('#fff8e2', '#f6e4c8', r()), width: r.range(40, 76), opacity: r.range(lo, hi), points: wave(x, y, x + len, y + r.range(-8, 8), 5, 1, 7) }); } };

// Far off: the ones that hang.
let seed = 0;
for (const [x, len, r0, lean, d] of [[48, 300, 34, 0.12, 0.84], [330, 250, 30, 0.08, 0.86], [505, 330, 26, -0.05, 0.9], [640, 210, 22, 0.1, 0.9], [770, 150, 18, -0.08, 0.92]]) {
  turned(p, [x, -30], [x + len * lean, -30 + len], spire(r0), d, { seed: ++seed, lanes: 4, detail: 0.2, crust: 0.5, threads: 0, rings: [[0.3, 1.05], [0.69, 1.05]], tip: r0 * 0.9 });
}
// Far off: the ones that stand and lean on the plain.
for (const [x, y, h, lean, r0, d] of [[150, 716, 150, -0.35, 20, 0.82], [262, 706, 110, 0.2, 16, 0.86], [372, 712, 76, -0.9, 13, 0.86], [520, 708, 96, -0.6, 15, 0.84], [668, 712, 176, 0.12, 22, 0.84], [760, 704, 120, 0.5, 16, 0.88], [905, 712, 150, -0.2, 20, 0.82], [1010, 706, 104, 0.3, 14, 0.86]]) {
  turned(p, [x, y], [x + Math.sin(lean) * h, y - Math.cos(lean) * h], spire(r0), d, { seed: ++seed, lanes: 4, detail: 0.22, crust: 0.5, threads: 0, rings: [[0.3, 1.05]], tip: r0 * 0.8 });
}
haze(9, -100, 900, GROUND - 120, GROUND + 10, 0.12, 0.22);

// The one that hangs, nearer.
turned(p, [410, -60], [452, 330], spire(58), 0.62, { seed: 31, rings: [[0.3, 1.08], [0.69, 1.08]], windows: [[0.13, 6], [0.47, 5], [0.54, 5]], horns: 2, tip: 46 });

// The great column that leans into the light. Its top is broken off.
turned(p, [470, 780], [628, 404], [[0, 44], [0.08, 40], [0.12, 50], [0.17, 38], [0.55, 34], [0.6, 44], [0.66, 32], [0.94, 30], [1, 34]], 0.58, { seed: 37, broken: true, rings: [[0.12, 1.1], [0.6, 1.1], [0.9, 1.12]], windows: [[0.3, 5], [0.38, 5], [0.46, 5], [0.76, 4], [0.83, 4]], horns: 2, crust: 1.2 });

// The tower that lies on its side. The sand has come up round it and moss has grown on it.
{
  const a = [20, 742], b = [338, 784];
  p.stroke({ brush: 'soft', color: far('#a88690', 180, 790, 0.5), width: 40, opacity: 0.4, points: [[a[0] + 10, a[1] + 40], [(a[0] + b[0]) / 2 + 30, 796], [b[0] + 60, b[1] + 32]] });   // its shadow
  turned(p, a, b, [[0, 36], [0.1, 33], [0.14, 40], [0.2, 31], [0.5, 29], [0.55, 36], [0.6, 27], [0.9, 24], [1, 26]], 0.5, { seed: 41, broken: true, rings: [[0.14, 1.1], [0.55, 1.1]], windows: [[0.3, 4], [0.38, 4], [0.72, 4], [0.8, 4]], crust: 1.7, moss: 0.3, threads: 0, horns: 2 });
  for (let k = 0; k < 16; k++) {                                         // the sand and the moss along its foot
    const t = (k + r()) / 16, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t + 30 + r.range(-3, 6), len = r.range(26, 60);
    p.tryStroke({ brush: 'bristle', color: far(r() < 0.4 ? r.pick(MOSS) : mix('#f0d8c2', '#e2bea8', r()), x, y, 0.42), width: r.range(7, 11), opacity: 0.9, mix: 0.2, dry: 0.05, rag: 0.4, points: [[x - len / 2, y + r.range(-2, 2)], [x + len / 2, y + r.range(-2, 2)]] });
  }
}

// The dome: ribbed, pale green, with a point on top. It stands a little out of true.
{
  const green = { lit: '#eaf2d0', half: '#bcd09c', shade: '#889e80', deep: '#5e6e68', bounce: '#c8caa4' };
  p.stroke({ brush: 'soft', color: far('#a88690', 600, 796, 0.55), width: 34, opacity: 0.4, points: [[540, 794], [610, 800], [690, 796]] });
  turned(p, [588, 794], [596, 688], [[0, 60], [0.3, 70], [0.62, 56], [0.86, 22], [1, 4]], 0.56, { seed: 43, tones: green, lanes: 13, lap: 1.5, piece: 40, tint: (t, th, lane) => (lane % 2 ? '#7f9874' : '#f2f6dc'), tintBy: 0.22, rings: [[0.03, 1.07]], crust: 0.8, moss: 0.35, threads: 0, tip: 34 });
}
haze(7, 0, 800, GROUND + 40, GROUND + 110, 0.1, 0.18);

p.save();
