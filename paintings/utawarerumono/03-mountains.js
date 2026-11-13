// The mountains beyond the valley, in two ranges, and the mist at their feet. Each range is
// painted peak by peak. A peak has a ridge that comes down from its top, a face toward the
// sun, which is at the right, and a face away from it.
'use strict';
const { studio, open, W, FOOT, far, nB, nC } = require('./scene');
const { mix, smooth, wave } = studio;

const p = open('mountains');
const r = p.rng;
const stroke = { brush: 'bristle', opacity: 0.95, mix: 0.2, dry: 0.04, rag: 0.25 };

// One peak: its top, how far it reaches to each side at its foot, and where its ridge comes down to.
function peak(x, top, half, base, d, lit, shade) {
  const ridge = x + half * r.range(-0.3, 0.05), left = x - half * r.range(0.75, 1.3), right = x + half * r.range(0.75, 1.3);
  const side = (ax, ay, bx, by, px, py) => (bx - ax) * (py - ay) - (by - ay) * (px - ax);
  const within = (x0, x1) => (px, py) => { const a = side(x, top, x0, base, px, py), b = side(x0, base, x1, base, px, py), c = side(x1, base, x, top, px, py); return (a >= 0 && b >= 0 && c >= 0) || (a <= 0 && b <= 0 && c <= 0); };
  const haze = (py) => d + 0.2 * smooth(top, base, py);                    // the foot of it is in the mist
  const face = (x0, x1, color, slant) => {
    const tone = (px, py) => far(mix(color, slant > 0 ? '#ffe0b0' : '#4a4a80', (nC(px / 70 + x, py / 50) - 0.5) * 0.5 + (nB(px / 14, py / 30) - 0.5) * 0.14), px, py, haze(py));
    p.fill({ inside: within(x0, x1), bounds: [Math.min(x0, x1, x) - 4, top - 4, Math.max(x0, x1, x) + 4, base + 2], width: 12, length: 54, spacing: 0.5, angle: () => Math.atan2(base - top, (x0 + x1) / 2 - x) + r.range(-0.12, 0.12), color: tone, stroke });
  };
  face(left, ridge, shade, -1);
  face(ridge, right, lit, 1);
  for (let k = 0; k < 2; k++) {                                            // a spur or two on the face toward the sun, each with its own shade
    const t = r.range(0.25, 0.6), sx = x + (right - x) * t * 0.5, sy = top + (base - top) * t, len = (base - sy) * r.range(0.5, 0.8);
    p.tryStroke({ ...stroke, color: far(mix(shade, lit, 0.35), sx, sy, haze(sy)), width: r.range(7, 11), opacity: 0.6, taper: [0.1, 0.6], points: [[sx, sy], [sx + len * 0.2, sy + len * 0.55], [sx + len * 0.5, sy + len]] });
  }
  p.tryStroke({ ...stroke, color: far('#fff0cc', x, top, d), width: 5, opacity: 0.7, taper: [0.1, 0.7], points: [[x + 2, top + 3], [x + (right - x) * 0.14 + 3, top + (base - top) * 0.2], [x + (right - x) * 0.3 + 3, top + (base - top) * 0.42]] });   // the sun along the top of that face
}
// A range: its peaks, and on most of them a shoulder, which is a smaller peak that stands against the first one. No two are the same shape.
function range(peaks, base, d, lit, shade) {
  for (const [x, top, half] of peaks) {
    peak(x, top, half, base, d, lit, shade);
    for (const s of [-1, 1]) if (r() < 0.6) peak(x + s * half * r.range(0.4, 0.75), top + (base - top) * r.range(0.25, 0.5), half * r.range(0.35, 0.6), base, d, lit, shade);
  }
}
range([[-30, 262, 190], [170, 234, 170], [330, 266, 150], [520, 228, 190], [700, 258, 160], [880, 236, 180], [1060, 270, 150], [1240, 246, 180], [1420, 276, 160], [1600, 258, 180]], FOOT + 10, 0.76, '#f0b68e', '#6a6496');
for (let k = 0; k < 6; k++) { const x = r.range(-100, W - 300), y = r.range(296, 330), len = r.range(300, 600); p.stroke({ brush: 'soft', color: far('#f8d8b8', x + len / 2, y, 0.6), width: r.range(24, 40), opacity: r.range(0.14, 0.24), points: wave(x, y, x + len, y + r.range(-4, 4), 3, 1, 6) }); }   // the air between the two ranges
range([[60, 304, 130], [250, 286, 140], [440, 318, 110], [600, 300, 130], [790, 322, 120], [950, 304, 130], [1130, 328, 110], [1290, 308, 130], [1470, 330, 120], [1640, 314, 130]], FOOT + 14, 0.56, '#d39a60', '#4b4b72');
for (let k = 0; k < 9; k++) {                                            // mist at their feet
  const x = r.range(-100, W - 300), y = FOOT + r.range(-14, 12), len = r.range(300, 600);
  p.stroke({ brush: 'soft', color: far('#fff0c8', x + len / 2, y, 0.5), width: r.range(22, 40), opacity: r.range(0.16, 0.3), points: wave(x, y, x + len, y + r.range(-4, 4), 3, 1, 6) });
}

p.save();
