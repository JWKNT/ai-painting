// Hannies: clay creatures shaped like haniwa, with two dark eyes and an open mouth, arms up
// and cheering. Two stand close to us in the corner, one waves a little gold banner on the
// right, one small one watches from beside Sill.
'use strict';
const { studio, open, SILL } = require('./scene');
const { mix, clamp } = studio;

const p = open('hannies');
const r = p.rng;

function hanny(bx, by, h, o = {}) {
  const w = h * 0.6, half = w / 2;
  const P = (x, y) => [bx + x, by + y];
  const clay = (l) => (l < 0.5 ? mix('#9a5630', '#d0854e', l * 2) : mix('#d0854e', '#f4bd88', l * 2 - 1));

  // its shadow on the grass
  p.stroke({ brush: 'soft', color: '#1f4f24', width: Math.max(28, h * 0.26), opacity: 0.4, taper: [0, 0.6], points: [P(half * 0.5, -4), P(-half * 1.2, h * 0.06), P(-half * 2.6, h * 0.16)] });

  // arms first, so the body overlaps their roots
  for (const s of [-1, 1]) {
    const up = o.arms === 'down' ? 0.36 : 0.74;
    p.stroke({ brush: 'bristle', color: clay(s < 0 ? 0.3 : 0.62), width: h * 0.115, mix: 0, dry: 0, rag: 0, cap: 'round', jitter: 0.3, points: [P(s * half * 0.8, -h * 0.5), P(s * half * 1.3, -h * 0.6), P(s * half * 1.62, -h * up)] });
    p.tryStroke({ color: clay(s < 0 ? 0.55 : 0.9), width: Math.max(4, h * 0.03), opacity: 0.8, points: [P(s * half * 1.05, -h * 0.57 - h * 0.035), P(s * half * 1.58, -h * up - h * 0.035)] });
  }

  // the body: level bands of clay, one above the next like the coils of a pot, narrowing
  // into the dome. Each band is shaded on the left and lit on the right.
  const dome = h * 0.38, band = h * 0.112;
  const halfAt = (y) => (y > -h + dome ? half : half * Math.sqrt(Math.max(0, 1 - Math.pow((-h + dome - y) / dome, 2))));
  const fit = (stroke, widths) => widths.some((width) => p.tryStroke({ ...stroke, width }));
  for (let y = -h * 0.065; y > -h + band * 0.4; y -= band * 0.62) {
    const hw = halfAt(y) - band * 0.42, bow = h * 0.012;
    if (hw < 6.5) continue;
    const row = (x0, x1, l, widths, o = 1) => fit({ brush: 'bristle', color: clay(clamp(l + r.range(-0.04, 0.04), 0, 1)), opacity: o, mix: 0.05, dry: 0, rag: 0, cap: 'round', jitter: 0.3, streak: 0.1, points: [P(x0, y), P((x0 + x1) / 2, y + bow), P(x1, y)] }, widths);
    row(-hw, hw, 0.5, [band, band * 0.75, band * 0.5, 6, 4.2]);
    row(hw * 0.05, hw, 0.74, [band, band * 0.75, band * 0.5, 6, 4.2]);
    row(hw * 0.5, hw, 0.9, [band * 0.75, band * 0.5, 6, 4.2], 0.85);
    row(-hw, -hw * 0.35, 0.24, [band * 0.75, band * 0.5, 6, 4.2]);
  }
  p.tryStroke({ color: '#7d4a28', width: Math.max(4, h * 0.028), opacity: 0.55, points: [P(-half + h * 0.02, -h * 0.72), P(-half + h * 0.012, -h * 0.4), P(-half + h * 0.03, -h * 0.07)] });
  p.tryStroke({ color: '#ffe0b4', width: Math.max(4, h * 0.03), opacity: 0.75, points: [P(half - h * 0.04, -h * 0.72), P(half - h * 0.025, -h * 0.42), P(half - h * 0.045, -h * 0.1)] });

  // the face: two round eyes and a round open mouth, holes into the dark inside
  const dark = '#33200f';
  const hole = (x, y, w) => {                                   // a ring, then a stroke across its middle
    const pts = [];
    for (let k = 0; k <= 10; k++) pts.push(P(x + Math.cos(k / 10 * 6.283) * (w + 0.2), y + Math.sin(k / 10 * 6.283) * (w + 0.2)));
    p.stroke({ color: dark, width: w, points: pts });
    const c = w, reach = Math.max(6.2, c + 0.2);
    p.line(...P(x - reach, y), ...P(x + reach, y), { color: dark, width: c });
    p.tryStroke({ color: '#ffd9ac', width: 4, opacity: 0.65, points: [P(x + w * 0.4, y + w * 1.75), P(x + w * 0.4 + 12.4, y + w * 1.2)] });   // light on the lower lip of the hole
  };
  const eye = Math.max(6.2, h * 0.043);
  for (const s of [-1, 1]) hole(s * w * 0.2, -h * 0.68, eye);
  hole(0, -h * 0.43, Math.max(6.2, h * 0.056));

  // what it holds
  if (o.banner) {
    const hx = half * 1.62, hy = -h * 0.74;
    p.line(...P(hx, hy + h * 0.1), ...P(hx + h * 0.04, hy - h * 0.62), { color: '#4a3528', width: Math.max(4, h * 0.035) });
    p.stroke({ brush: 'flat', color: o.banner, width: h * 0.17, rag: 0.05, cap: 'flat', jitter: 0.3, points: [P(hx + h * 0.05, hy - h * 0.52), P(hx + h * 0.2, hy - h * 0.5), P(hx + h * 0.41, hy - h * 0.53)] });
    p.tryStroke({ color: mix(o.banner, '#ffffff', 0.5), width: 4, opacity: 0.8, points: [P(hx + h * 0.08, hy - h * 0.575), P(hx + h * 0.38, hy - h * 0.585)] });
  }

  // grass in front of its foot
  for (let x = -half * 1.05; x < half * 1.05; x += r.range(5, 11)) {
    const g = r.range(12.5, 12 + h * 0.14), lean = r.range(-0.1, 0.4) * g;
    p.tryStroke({ color: r.pick(['#3f8a34', '#5aa43e', '#8fca56', '#2f7030']), width: r.range(4, 4 + h * 0.012), taper: [0, 0.75], points: [P(x, r.range(-2, 8)), P(x + lean * 0.35, -g * 0.6), P(x + lean, -g)] });
  }
}

hanny(SILL.x - 150, 870, 96, { arms: 'down' });          // the small one, beside Sill
hanny(1392, 946, 150, { banner: '#f2c230' });            // the one with the banner
hanny(214, 968, 214);                                    // the two in the near corner
hanny(410, 992, 164);

p.save();
