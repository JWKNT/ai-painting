// Hannies: clay creatures shaped like haniwa, with two round holes for eyes and a third for
// a mouth. They stand in the grass with their arms up, half turned toward Rance, dark clay
// with the low sun along one side. One holds up a little gold banner.
'use strict';
const { studio, open, SILL, SUN, SUNLIGHT } = require('./scene');
const { mix, solid, glint, clamp } = studio;

const p = open('hannies');
const r = p.rng;
const clay = { shadow: '#22100f', half: '#3c1c14', lit: '#8c4a26', rim: '#ffbc74', bounce: '#30202e' };

function hanny(bx, by, h, o = {}) {
  const rad = h * 0.3, P = (x, y, q) => (q == null ? [bx + x, by + y] : [bx + x, by + y, q]);
  const light = { light: SUNLIGHT, turn: 0.45, vary: 0.05, mix: 0.3, width: Math.max(5, Math.min(8, h * 0.05)), length: Math.max(20, h * 0.22) };

  // its shadow on the grass, toward us
  const dx = bx - SUN.x, dy = by - 600, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, w = Math.max(30, rad * 1.5);
  p.stroke({ brush: 'soft', color: '#07120f', width: w, opacity: 0.5, taper: [0, 0.5], points: [P(-ux * 6, -uy * 6), P(ux * w * 1.2, uy * w * 1.2), P(ux * w * 2.4, uy * w * 2.4)] });

  // arms first, so the body overlaps their roots
  const up = o.arms === 'low' ? 0.5 : 0.8;
  for (const s of [-1, 1]) solid(p, [P(s * rad * 0.75, -h * 0.48, h * 0.085), P(s * rad * 1.3, -h * 0.6, h * 0.078), P(s * rad * 1.55, -h * up, h * 0.066)], clay, light);
  // the body: a tall pot of clay, a little wider at the foot, with a round head
  solid(p, [P(0, -rad * 0.6, rad * 1.04), P(0, -h * 0.45, rad * 0.98), P(0, -h * 0.68, rad * 0.9), P(0, -h + rad * 0.8, rad * 0.8)], clay, light);
  for (const v of [0.3, 0.5]) {                                      // the faint lines between the coils it was built from
    const half = rad * 0.86;
    p.tryStroke({ brush: 'bristle', color: '#1c0c0c', width: Math.max(4.2, h * 0.02), opacity: 0.3, mix: 0.3, dry: 0, rag: 0, cap: 'round', taper: [0.4, 0.4], points: [P(-half, -h * v), P(0, -h * v + h * 0.02), P(half, -h * v)] });
  }

  // the face, on the side turned toward the others: three holes into the dark inside
  if (o.face) {
    const f = o.face, eye = Math.max(4.4, h * 0.05), hole = (x, y, w, tall) => {
      p.line(...P(x, y - tall / 2), ...P(x, y + tall / 2), { brush: 'bristle', color: '#150909', width: w, mix: 0.1, dry: 0, rag: 0, cap: 'round' });
      p.tryStroke({ color: '#c8783c', width: 4, opacity: 0.45, points: [P(x - f * w * 0.2, y + tall / 2 + 2.5), P(x + f * 12.4 - f * w * 0.2, y + tall / 2 + 1)] });   // light on the lower lip of the hole
    };
    hole(f * rad * 0.1, -h * 0.68, eye, Math.max(12.4, eye * 2.1));
    hole(f * rad * 0.58, -h * 0.675, eye * 0.85, Math.max(12.4, eye * 2));
    hole(f * rad * 0.36, -h * 0.47, eye * 1.2, Math.max(12.6, eye * 2.5));
  }

  // what it holds
  if (o.banner) {
    const hx = rad * 1.62, hy = -h * 0.8;
    p.line(...P(hx, hy + h * 0.1), ...P(hx + h * 0.04, hy - h * 0.66), { color: '#1c1412', width: Math.max(4, h * 0.035) });
    p.stroke({ brush: 'bristle', color: mix(o.banner, '#3a2820', 0.35), width: h * 0.17, mix: 0.05, dry: 0, rag: 0.1, cap: 'flat', jitter: 0.3, points: [P(hx + h * 0.05, hy - h * 0.56), P(hx + h * 0.22, hy - h * 0.54), P(hx + h * 0.44, hy - h * 0.57)] });
    p.tryStroke({ brush: 'bristle', color: mix(o.banner, '#fff0c0', 0.5), width: Math.max(4.4, h * 0.06), opacity: 0.85, mix: 0.15, dry: 0, rag: 0.1, cap: 'flat', points: [P(hx + h * 0.07, hy - h * 0.6), P(hx + h * 0.24, hy - h * 0.585), P(hx + h * 0.42, hy - h * 0.61)] });   // the sun through the cloth
  }

  // grass in front of its foot
  for (let x = -rad * 1.1; x < rad * 1.1; x += r.range(5, 11)) {
    const g = r.range(12.5, 12 + h * 0.14), lean = r.range(-0.1, 0.4) * g;
    p.tryStroke({ color: r() < 0.12 ? mix('#7fa244', '#e2d86a', r()) : r.pick(['#14281f', '#1f3a28', '#2c4c32', '#0f201c']), width: r.range(4, 4 + h * 0.012), taper: [0, 0.75], points: [P(x, r.range(-2, 8)), P(x + lean * 0.35, -g * 0.6), P(x + lean, -g)] });
  }
}

hanny(SILL.x - 104, 778, 80, { arms: 'low' });           // a small one, beside Sill
hanny(1386, 912, 120, { banner: '#f2c230', face: -1 });  // the one with the banner
hanny(232, 960, 156, { face: 1 });                       // two close to us in the corner
hanny(404, 984, 118, { face: 1 });

p.save();
