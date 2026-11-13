// Their weapons, which they have put down together, close to us: his sword, with its blade
// like blue water, its hook of gold and its red cord; her staff, with its ring; the lance of
// the Ronso, with its red tuft; the great dark blade, and the jug that goes with it; the
// ball; and the doll with the red ball on its head. They stand in the rock or lean on one
// another. The sun is behind them, so they are dark, with fire on their edges; but the blue
// sword lets the light through, and it shines.
'use strict';
const { studio, open } = require('./scene');
const { mix, clamp, shape, glint, disc, arc, orb } = studio;

const p = open('relics');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round' };
const LIGHT = [0.8, -0.6];                                              // toward the sun, from here
const o = { light: LIGHT, turn: 0.35, width: 5.5, length: 20, vary: 0.06, dash: 26, gap: 8, edgeOpacity: 0.9 };
const sunEdge = () => mix('#ff9c40', '#ffe490', r());
// A thing that stands in the ground at (bx, by) and leans by `tilt`: P puts a place on it, so far up it and so far across it, into the picture.
const stand = (bx, by, tilt) => { const ux = Math.sin(tilt), uy = -Math.cos(tilt), nx = -uy, ny = ux; const P = (up, off = 0) => [bx + ux * up + nx * off, by + uy * up + ny * off]; return { P, poly: (pts) => pts.map(([a, b]) => P(a, b)), along: Math.atan2(uy, ux) }; };
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts });
const dark = { shadow: '#0e0a0e', half: '#201820', lit: '#5c3a30', rim: '#ffb060', bounce: '#201a2c' };
const goldT = { shadow: '#3c2810', half: '#8c6420', lit: '#e0b040', rim: '#fff0a0', bounce: '#4c3424' };

// Their shadows: long, on the rock, toward us and away from the sun.
for (const [x, y, len, w] of [[300, 950, 150, 40], [400, 960, 170, 34], [210, 962, 180, 30], [480, 964, 160, 44]]) p.tryStroke({ brush: 'soft', color: '#080508', width: w, opacity: 0.5, taper: [0, 0.5], points: [[x, y], [x - len * 0.5, y + 22], [x - len, y + 40]] });

// ---------------------------------------------------------------- the lance of the Ronso
{
  const { P, poly, along } = stand(206, 968, -0.2);
  shape(p, poly([[0, -5], [400, -5], [400, 5], [0, 5]]), { shadow: '#120c0e', half: '#2c1c18', lit: '#6c4428', rim: '#ffb060' }, { ...o, round: 5, flow: () => along });
  for (const up of [90, 200, 310]) mark(poly([[up, -7], [up + 3, 7]]), '#b8862c', 6, { cap: 'flat' });                                           // bands of gold on its shaft
  shape(p, poly([[404, -9], [440, -24], [500, -12], [540, 0], [500, 12], [440, 24], [404, 9]]), { shadow: '#14121a', half: '#34303c', lit: '#8c8088', rim: '#ffd8a0', bounce: '#2c2840' }, { ...o, round: 12, flow: () => along });   // its head: a wide blade of iron
  mark(poly([[410, 0], [470, 0], [532, 0]]), '#0c0a10', 5, { opacity: 0.7 });                                                                    // the ridge down the middle of it
  for (const [off, len] of [[-12, 70], [-4, 84], [5, 78], [13, 62]]) mark([P(398, off), [P(398, off)[0] + off * 0.6 - 10, P(398, off)[1] + len * 0.5], [P(398, off)[0] + off - 26, P(398, off)[1] + len]], mix('#b81c20', '#f04830', r()), 6.5, { taper: [0, 0.6] });   // the red tuft under it, which the wind takes
}

// ---------------------------------------------------------------- the great blade, and the jug
{
  const { P, poly, along } = stand(486, 972, 0.3);
  // the blade is as wide as a hand is long, with one edge; its back is thick. It is of dark iron.
  shape(p, poly([[0, -22], [80, -24], [200, -22], [262, -14], [276, 0], [262, 18], [200, 22], [80, 22], [0, 20]]), { shadow: '#0e0c12', half: '#262430', lit: '#6c6470', rim: '#ffcf90', bounce: '#242038' }, { ...o, round: 18, length: 26, flow: () => along });
  mark(poly([[6, -14], [130, -15], [256, -9]]), '#08060a', 6, { opacity: 0.75 });                                                                // the thick back of it
  glint(p, poly([[6, 19], [120, 20.5], [240, 19]]), sunEdge, { width: 4.6, dash: 50, gap: 10, opacity: 0.9, rng: r });                           // the sun along its edge
  for (const up of [60, 120, 180]) mark(poly([[up, -2], [up + 16, 8]]), '#8c8490', 4.6, { opacity: 0.5 });                                         // the marks that are cut in it
  shape(p, poly([[276, -30], [290, -30], [290, 30], [276, 30]]), goldT, { ...o, round: 6, length: 14, flow: () => along + Math.PI / 2 });        // its guard
  shape(p, poly([[290, -9], [372, -8], [372, 8], [290, 9]]), { shadow: '#2a080c', half: '#70141a', lit: '#c8301e', rim: '#ffb060' }, { ...o, round: 8, flow: () => along });   // its grip, bound in red
  for (let up = 300; up < 370; up += 14) mark(poly([[up, -9], [up + 5, 9]]), '#3c0a0e', 4.6, { opacity: 0.8 });
  mark(poly([[372, -11], [380, 11]]), '#b8862c', 8, { cap: 'flat' });
  // the jug: it hangs from the grip by a cord. It is round, of brown clay, with a narrow neck and a stopper
  const [jx, jy] = [P(330, 0)[0] + 34, P(330, 0)[1] + 92];
  mark([P(330, 6), [jx - 6, jy - 60], [jx, jy - 40]], '#c8b890', 4.4);                                                                           // the cord
  orb(p, [[jx, jy, 34], [jx, jy - 30, 15]], (x, y) => { const k = clamp(((x - jx) * 0.8 - (y - jy) * 0.6) / 40, -1, 1); return k > 0 ? mix('#6c3c20', '#d08a48', k) : mix('#6c3c20', '#1c1010', -k); }, { width: 6.5, reach: 30 });
  mark([[jx - 8, jy - 46], [jx + 8, jy - 46]], '#2c1c14', 8); mark([[jx - 6, jy - 54], [jx + 7, jy - 54]], '#b8a480', 6.5);                       // its neck and its stopper
  mark([[jx - 30, jy - 2], [jx, jy + 4], [jx + 30, jy - 2]], '#2c1810', 5, { opacity: 0.7 });                                                    // the band round it
  glint(p, arc(jx, jy, 32, -1.0, 0.5, 10), sunEdge, { width: 4.4, dash: 20, gap: 7, opacity: 0.9, rng: r });
}

// ---------------------------------------------------------------- her staff
{
  const { P, poly, along } = stand(398, 966, 0.13);
  shape(p, poly([[0, -5.5], [330, -5.5], [330, 5.5], [0, 5.5]]), { shadow: '#100c1c', half: '#28204c', lit: '#6c5ca8', rim: '#ffc890', bounce: '#201838' }, { ...o, round: 5.5, flow: () => along });
  for (const up of [60, 150, 240, 322]) mark(poly([[up, -8], [up + 3, 8]]), '#c8982c', 7, { cap: 'flat' });                                       // bands of gold
  const [hx, hy] = P(372, 0), R = 44;
  // its head: a ring of gold, with a smaller ring inside it and four points that stand out from it
  for (let a = 0; a < 6.283; a += 0.5) mark(arc(hx, hy, R, a, a + 0.56, 6), mix('#8c6420', '#d8a838', (Math.cos(a + 0.6) + 1) / 2), 9);
  for (let a = 0.3; a < 6.283; a += 0.7) mark(arc(hx, hy, R * 0.52, a, a + 0.76, 6), '#b08428', 6.5);
  glint(p, arc(hx, hy, R + 3, -1.4, 0.7, 14), sunEdge, { width: 4.4, dash: 26, gap: 7, opacity: 0.95, rng: r });
  for (const a of [-1.57 + 0.13, 0.13, 1.57 + 0.13, 3.14 + 0.13]) mark([[hx + Math.cos(a) * (R + 2), hy + Math.sin(a) * (R + 2)], [hx + Math.cos(a) * (R + 28), hy + Math.sin(a) * (R + 28)]], '#d8a838', 8, { taper: [0, 0.7] });
  mark(poly([[330, -2], [352, 0], [372, 0]]), '#c8982c', 7);                                                                                    // where the rod meets the ring
  for (const [a, len, c] of [[2.5, 70, '#e8a0b8'], [2.9, 90, '#f8f0f0'], [0.5, 60, '#e8a0b8']]) { const x0 = hx + Math.cos(a) * R, y0 = hy + Math.sin(a) * R; mark([[x0, y0], [x0 - 8, y0 + len * 0.5], [x0 - 22, y0 + len]], c, 5.5, { taper: [0, 0.6], opacity: 0.9 }); }   // the ribbons that hang from it
}

// ---------------------------------------------------------------- his sword
{
  const { P, poly, along } = stand(300, 958, -0.1);
  // The blade: wide, with a hook cut in it near the guard. It is like water: we see the light through it, and the light runs in it.
  const outline = [[0, -6], [40, -22], [150, -27], [230, -24], [262, -30], [286, -18], [288, 20], [230, 25], [150, 26], [60, 22], [16, 10]];
  const water = { shadow: '#143a70', half: '#2c78c4', lit: '#8cd8f8', rim: '#f4fdff', bounce: '#3c5cc0' };
  shape(p, poly(outline), water, { ...o, turn: -0.3, round: 26, length: 26, flow: () => along, tint: (c, x, y) => mix(c, '#d8f8ff', clamp(1 - Math.hypot(x - P(170, 6)[0], y - P(170, 6)[1]) / 150, 0, 1) * 0.35) });
  for (const [u0, off, len] of [[40, -8, 90], [70, 8, 120], [150, -4, 100], [120, 16, 110], [200, 6, 70]]) mark(poly([[u0, off], [u0 + len * 0.5, off + 5], [u0 + len, off - 2]]), mix('#c8f4ff', '#ffffff', r()), 5, { opacity: 0.55, taper: [0.3, 0.3] });   // the light that runs in it
  mark(poly([[250, -30], [262, -40], [276, -34]]), '#1c4c8c', 7);                                                                               // the hook
  glint(p, poly([[20, 12], [60, 23.5], [150, 27.5], [230, 26.5], [286, 21.5]]), () => '#f4fdff', { width: 4.6, dash: 46, gap: 8, opacity: 0.95, rng: r });
  // the guard: a long hook of gold; the grip, bound in red; and the cord with its charm
  shape(p, poly([[288, -34], [300, -34], [302, 20], [318, 34], [310, 42], [290, 28]]), goldT, { ...o, round: 7, length: 16, flow: () => along + Math.PI / 2 });
  shape(p, poly([[300, -9], [366, -8], [366, 8], [300, 9]]), { shadow: '#2a080c', half: '#70141a', lit: '#c8301e', rim: '#ffb060' }, { ...o, round: 8, flow: () => along });
  for (let up = 308; up < 362; up += 13) mark(poly([[up, -9], [up + 5, 9]]), '#3c0a0e', 4.6, { opacity: 0.8 });
  mark(poly([[366, -10], [376, 10]]), '#c8982c', 8, { cap: 'flat' });
  const [cx, cy] = P(372, 4);
  mark([[cx, cy], [cx + 26, cy + 30], [cx + 30, cy + 76]], '#c82c24', 5, { taper: [0, 0.2] }); mark([[cx, cy], [cx + 14, cy + 40], [cx + 12, cy + 96]], '#e04c34', 5, { taper: [0, 0.2] });
  mark([[cx + 24, cy + 74], [cx + 36, cy + 80]].map(([x, y], i) => [x + (i ? 2 : -2), y]), '#e8c050', 8);                                          // the charm
}

// ---------------------------------------------------------------- the ball, and the doll
{
  const [bx, by, R] = [346, 962, 34];
  p.tryStroke({ brush: 'soft', color: '#080508', width: 26, opacity: 0.5, points: [[bx - 44, by + 28], [bx, by + 32], [bx + 44, by + 28]] });
  orb(p, [[bx, by, R]], (x, y) => { const k = clamp(((x - bx) * 0.8 - (y - by) * 0.6) / R, -1, 1), band = Math.abs(((x - bx) * 0.4 + (y - by)) / R) < 0.2, panel = Math.sin((x - bx) / 7 + (y - by) / 11) > 0.3; let c = band ? '#d8dce8' : panel ? '#3c6cc8' : '#2848a0'; return k > 0 ? mix(c, '#fff4d8', k * 0.5) : mix(c, '#0a0a1c', -k * 0.75); }, { width: 6, reach: 26 });
  glint(p, arc(bx, by, R - 2, -1.1, 0.4, 10), sunEdge, { width: 4.4, dash: 18, gap: 6, opacity: 0.9, rng: r });
  // the doll: a small white beast of cloth, with a red ball on a thread over its head and two small dark wings. It sits against the staff.
  const [mx, my] = [440, 968];
  orb(p, [[mx, my - 16, 18], [mx, my - 44, 14]], (x, y) => { const k = clamp(((x - mx) * 0.8 - (y - my + 30) * 0.6) / 30, -1, 1); return k > 0 ? mix('#b8b0c0', '#fff6ea', k) : mix('#b8b0c0', '#3c3448', -k); }, { width: 6, reach: 18 });
  for (const s of [-1, 1]) mark([[mx + s * 12, my - 30], [mx + s * 26, my - 42], [mx + s * 30, my - 30]], '#4c2c6c', 6.5, { taper: [0, 0.4] });   // its wings
  mark([[mx, my - 56], [mx + 3, my - 70], [mx + 1, my - 80]], '#c8b890', 4.2);
  disc(p, mx + 1, my - 86, 8, '#e83c34', 6.2, { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.1, cap: 'round' });
  mark(arc(mx + 1, my - 86, 6.5, -1.3, 0.3, 6), '#ffc0a0', 4, { opacity: 0.9 });
}

// The light of the camp fire, a little, on the sides of them that are toward it.
for (const pts of [[[516, 950], [548, 880], [574, 800]], [[318, 930], [320, 820], [330, 720]], [[412, 940], [426, 800], [440, 660]]]) glint(p, pts, () => '#ff9a48', { width: 4.2, dash: 30, gap: 30, opacity: 0.35, rng: r });

p.save();
