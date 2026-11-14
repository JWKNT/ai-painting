// Strelizia, and the fight. Strelizia is a machine in the shape of a girl in armour: white,
// with red on its chest, its hips and its legs, two long points on its head like horns,
// and a long lance with a pale blade and an orange shaft. It flies at the head of the
// klaxosaur, lance first, and its fire is a long red line behind it, which bends up from
// the Plantation. The klaxosaur has thrown a line of blue light at it, which goes by under
// it. It is far off and small: there is no face to see.
'use strict';
const { studio, open, W, H, STREL, DOME } = require('./scene');
const { mix, glow, shape } = studio;

const p = open('strelizia');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.06, dry: 0, rag: 0.06, cap: 'round' };
const K = 1.25, ca = Math.cos(STREL.a) * K, sa = Math.sin(STREL.a) * K, S = (u, v) => [STREL.x + u * ca - v * sa, STREL.y + u * sa + v * ca];   // u: the way that it goes; v: down across it
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts.map(([u, v]) => S(u, v)) });

// ---------------------------------------------------------------- the blue light that the klaxosaur throws: it goes by under Strelizia, up and to the left, out of the picture
{ const a = [556, 418], b = [300, 250], c = [-40, 30];
  for (const [w, col, op] of [[60, '#2c9cf0', 0.12], [30, '#58c8ff', 0.24]]) p.stroke({ brush: 'soft', color: col, width: w, opacity: op, points: [a, b, c] });
  p.stroke({ ...line, color: '#a8ecff', width: 11, points: [a, b, c] }); p.stroke({ brush: 'round', color: '#ffffff', width: 5, points: [a, b, c] }); }

// ---------------------------------------------------------------- its fire: a long line from the Plantation, low, that bends up to it
{
  const pts = [[DOME.x + 70, DOME.y - 80], [330, 500], [290, 400], [270, 300], [300, 236], S(-70, 6)], n = 26;
  const at = (t) => { const f = t * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), u = f - i, a = pts[Math.max(0, i - 1)], b = pts[i], c = pts[i + 1], d = pts[Math.min(pts.length - 1, i + 2)]; const cr = (k) => 0.5 * (2 * b[k] + (-a[k] + c[k]) * u + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * u * u + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * u * u * u); return [cr(0), cr(1)]; };
  for (const [w0, w1, c0, c1, op0, op1, brush, m] of [[50, 26, '#c88c84', '#e04c5c', 0.06, 0.24, 'soft', 9], [22, 14, '#e09088', '#ff5c6c', 0.1, 0.5, 'soft', 14], [8, 6, '#f4c4bc', '#fff0f0', 0.2, 0.95, 'bristle', n]]) for (let i = 0; i < m; i++) {
    const t0 = i / m, t1 = Math.min(1, (i + 1.3) / m), t = (t0 + t1) / 2, seg = []; for (let k = 0; k <= 5; k++) seg.push(at(t0 + (t1 - t0) * k / 5));
    p.tryStroke({ brush, color: mix(c0, c1, t), width: w0 + (w1 - w0) * t, opacity: op0 + (op1 - op0) * t * t, mix: 0.2, rag: 0.2, cap: 'round', points: seg });
  }
}

// ---------------------------------------------------------------- Strelizia
glow(p, ...S(-66, 6), 44, '#ff4c6c', 0.16, 5);
mark([[-48, 2], [-84, 10], [-124, 14]], '#f4f4f8', 12, { taper: [0, 0.3] });                          // its legs, which trail: white
mark([[-52, 14], [-88, 24], [-120, 32]], '#d8d8e4', 10, { taper: [0, 0.4] });
mark([[-96, 12], [-126, 15]], '#d0303c', 10); mark([[-96, 27], [-122, 33]], '#b02834', 8.5);           // the red on its shins
mark([[-126, 15], [-150, 18]], '#ff9c8c', 7, { taper: [0, 0.9] }); mark([[-122, 33], [-144, 38]], '#ff9c8c', 6.5, { taper: [0, 0.9] });   // the fire at its heels
mark([[-52, 4], [-22, 2], [8, 0]], '#f8f8fc', 19);                                                    // its body: white
mark([[-36, 12], [-14, 11]], '#d0303c', 9);                                                           // the red at its hips
mark([[-6, -4], [16, -5]], '#d0303c', 10);                                                            // and on its chest
mark([[-30, -12], [-56, -26], [-86, -30]], '#e8e8f0', 7, { taper: [0, 0.6] });                        // a long fin from its back
mark([[14, -9], [34, -12]], '#f8f8fc', 13);                                                           // its head
mark([[30, -18], [8, -34], [-18, -40]], '#e03c44', 5.5, { taper: [0, 0.7] });                         // the two points on its head, swept back: red
mark([[34, -15], [16, -26], [-4, -28]], '#f8f8fc', 5, { taper: [0, 0.7] });
mark([[2, 6], [26, 16], [50, 18]], '#ececf4', 7.5);                                                   // its arm, forward, to the lance
// the lance: a long shaft of orange, and a long pale blade with a point
mark([[-30, 26], [60, 19], [130, 13]], '#f08a2c', 5.5);
shape(p, [S(118, 3), S(190, 6), S(246, 12), S(190, 18), S(118, 23)], { shadow: '#a8b0c4', half: '#e4e8f4', lit: '#ffffff', rim: '#ffffff' }, { light: [-0.3, -0.95], turn: -0.2, width: 5, length: 22, round: 8, flow: () => STREL.a, dash: 30, gap: 4 });
mark([[124, 13], [240, 12]], '#f0a040', 4, { opacity: 0.8 });
mark([[112, 2], [114, 24]], '#f0a040', 6);
// the red of its fire in the dust under it, and sparks from the point of its lance
for (let k = 0; k < 9; k++) { const a = STREL.a + r.range(-0.6, 0.6), [x, y] = S(250, 12), l = r.range(14, 34); p.tryStroke({ brush: 'round', color: mix('#ffc468', '#ffffff', r()), width: 4, opacity: 0.9, taper: [0, 0.6], points: [[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l]] }); }

// ---------------------------------------------------------------- pieces of other klaxosaurs on the ground near us: black blocks, with blue on their edges
function block(x, y, s, tilt) {
  const c = Math.cos(tilt), sn = Math.sin(tilt), q = (a, b) => [x + (a * c - b * sn) * s, y + (a * sn + b * c) * s];
  p.tryStroke({ brush: 'soft', color: '#2c1c12', width: Math.max(8.4, 16 * s), opacity: 0.4, points: [q(-10, 22), q(30, 26), q(70, 24)] });
  shape(p, [q(-30, -20), q(8, -34), q(40, -18), q(2, -4)], { shadow: '#16264c', half: '#243a6c', lit: '#3c5a98', bounce: '#16264c' }, { light: [-0.7, -0.7], turn: 0, width: 5.5, length: 18 * s, round: 8, flow: () => tilt + 0.4, edge: false });
  shape(p, [q(-30, -20), q(2, -4), q(2, 24), q(-30, 8)], { shadow: '#0c1630', half: '#16264c', lit: '#24386c', bounce: '#0c1630' }, { light: [-0.9, -0.2], turn: 0, width: 5.5, length: 18 * s, round: 8, flow: () => tilt + Math.PI / 2, edge: false });
  shape(p, [q(2, -4), q(40, -18), q(40, 10), q(2, 24)], { shadow: '#03050c', half: '#080c1a', lit: '#101830', bounce: '#03050c' }, { light: [-0.9, -0.2], turn: 0.3, width: 5.5, length: 18 * s, round: 8, flow: () => tilt + Math.PI / 2, edge: false });
  for (const [a, b] of [[q(-30, -20), q(2, -4)], [q(2, -4), q(40, -18)], [q(2, -4), q(2, 24)]]) { p.tryStroke({ brush: 'soft', color: '#38b8ff', width: 10, opacity: 0.2, points: [a, b] }); p.tryStroke({ brush: 'round', color: '#a8f0ff', width: 4.2, opacity: 0.9, points: [a, b] }); }
}
block(250, 850, 1.5, -0.2); block(470, 930, 2.1, 0.25); block(1380, 900, 1.8, 0.1); block(1120, 800, 1.1, -0.3); block(120, 760, 0.9, 0.2);

// ---------------------------------------------------------------- the corners
for (const [x0, y0, x1, y1, w, op] of [[-60, H + 50, 560, H + 60, 150, 0.3], [W + 60, H + 50, 1040, H + 60, 150, 0.3], [W + 60, -40, 1160, -70, 180, 0.2]]) p.stroke({ brush: 'soft', color: '#2c2018', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
