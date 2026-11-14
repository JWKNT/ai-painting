// Their weapons, which they have put down together, close to us: his sword, with its blade
// like blue water, its hook of gold and its red cord; her staff, with its ring; the lance of
// the Ronso, with its red tuft; the great dark blade, and the jug that goes with it; the
// ball; and the doll with the red ball on its head. They stand in the rock or lean on one
// another. The sun is behind them and to the right, and the camp fire is at the right too:
// so each is dark on its left and has fire down its right edge. The blue sword lets the
// light through, and it shines.
'use strict';
const { studio, open, nA, nB } = require('./scene');
const { mix, clamp, smooth, shape, glint, disc, arc, orb } = studio;

const p = open('relics');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round' };
const LIGHT = [0.8, -0.6];                                              // toward the sun, from here
const o = { light: LIGHT, turn: 0.35, width: 5.5, length: 20, vary: 0.06, dash: 26, gap: 8, edgeOpacity: 0.9 };
const sunEdge = () => mix('#ff9c40', '#ffe490', r());
// A thing that stands in the ground at (bx, by) and leans by `tilt`: P puts a place on it, so far up it and so far across it, into
// the picture, and `back` finds how far up and across a place of the picture is.
const stand = (bx, by, tilt) => {
  const ux = Math.sin(tilt), uy = -Math.cos(tilt), nx = -uy, ny = ux, P = (up, off = 0) => [bx + ux * up + nx * off, by + uy * up + ny * off];
  return { P, poly: (pts) => pts.map(([a, b]) => P(a, b)), back: (x, y) => [(x - bx) * ux + (y - by) * uy, (x - bx) * nx + (y - by) * ny], along: Math.atan2(uy, ux) };
};
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts });
const goldT = { shadow: '#3c2810', half: '#8c6420', lit: '#e0b040', rim: '#fff0a0', bounce: '#4c3424' };
const redT = { shadow: '#2a080c', half: '#70141a', lit: '#c8301e', rim: '#ffb060', bounce: '#3c1420' };
// Where a thing goes into the rock: the dark of the hole, and the broken stone round it.
const foot = (x, y, w) => {
  p.tryStroke({ brush: 'soft', color: '#050305', width: Math.max(8.4, w * 0.9), opacity: 0.6, points: [[x - w * 1.3, y + 3], [x, y + 5], [x + w * 1.3, y + 3]] });
  for (let k = 0; k < 6; k++) { const a = r.range(0, Math.PI), l = r.range(w * 0.9, w * 2.4); mark([[x + r.range(-w, w) * 0.4, y + 2], [x + Math.cos(a) * l * 0.5 + r.range(-3, 3), y + 3 + Math.sin(a) * l * 0.16], [x + Math.cos(a) * l, y + 4 + Math.sin(a) * l * 0.3]], '#080508', 4.6, { opacity: 0.6, taper: [0, 0.7] }); }   // cracks
  for (let k = 0; k < 2; k++) { const sx = x + r.range(-2.2, 2.2) * w, sy = y + r.range(4, 12), l = r.range(12.5, 18); mark([[sx - l / 2, sy], [sx + l / 2, sy - 1]], '#3c2820', r.range(5, 7)); mark([[sx - l / 2 + 2, sy - 3], [sx + l / 2, sy - 4]], '#a86c34', 4, { opacity: 0.4 }); }   // chips of stone, with a little sun on them
};

// Their shadows: long, on the rock, toward us and away from the sun.
for (const [x, y, len, w] of [[300, 954, 170, 40], [400, 962, 180, 30], [206, 966, 190, 26], [484, 968, 170, 44], [350, 986, 110, 34], [436, 990, 100, 30]]) p.tryStroke({ brush: 'soft', color: '#070406', width: w, opacity: 0.5, taper: [0, 0.5], points: [[x, y], [x - len * 0.5, y + 16], [x - len, y + 30]] });

// ---------------------------------------------------------------- the lance of the Ronso
{
  const { P, poly, along } = stand(206, 968, -0.2);
  foot(206, 966, 10);
  shape(p, poly([[0, -5.5], [404, -5], [404, 5], [0, 5.5]]), { shadow: '#120c0e', half: '#2c1c18', lit: '#7c4c2a', rim: '#ffb060' }, { ...o, round: 5, flow: () => along });
  for (const up of [70, 80, 196, 206, 318, 328]) mark(poly([[up, -7], [up + 2, 7]]), '#b8862c', 5.5, { cap: 'flat' });                            // bands of gold on its shaft, two and two
  // its head: a long leaf of iron with a ridge down the middle; the side toward the sun is light, the other dark
  shape(p, poly([[404, -8], [430, -25], [470, -22], [520, -9], [548, 0], [404, 0]]), { shadow: '#0c0a12', half: '#1c1a26', lit: '#3c3848', bounce: '#201c30' }, { ...o, round: 9, flow: () => along, edge: false });
  shape(p, poly([[404, 0], [548, 0], [520, 9], [470, 22], [430, 25], [404, 8]]), { shadow: '#2c2832', half: '#6c6470', lit: '#c8b8b0', rim: '#ffe0a8', bounce: '#3c3448' }, { ...o, turn: 0, round: 9, flow: () => along });
  mark(poly([[408, 0], [476, 0], [544, 0]]), '#08060c', 4.6, { opacity: 0.8 });
  glint(p, poly([[432, 25], [470, 22], [520, 9], [546, 1]]), sunEdge, { width: 4.4, dash: 40, gap: 6, opacity: 0.95, rng: r });
  shape(p, poly([[392, -11], [406, -12], [406, 12], [392, 11]]), goldT, { ...o, round: 5, length: 14, flow: () => along + Math.PI / 2 });         // the collar under it
  for (const [off, len, sway] of [[-13, 76, -30], [-7, 96, -22], [-1, 88, -26], [6, 100, -16], [12, 70, -10]]) { const [x, y] = P(392, off); mark([[x, y], [x + sway * 0.3, y + len * 0.5], [x + sway, y + len]], mix('#a8181c', '#f04830', r()), 6.5, { taper: [0, 0.7] }); }   // the red tuft under it, which the wind takes
  for (const [off, len, sway] of [[-4, 60, -16], [9, 64, -8]]) { const [x, y] = P(392, off); mark([[x, y], [x + sway * 0.3, y + len * 0.5], [x + sway, y + len]], '#ff8c5c', 4.2, { opacity: 0.7, taper: [0, 0.6] }); }
}

// ---------------------------------------------------------------- the great blade, and the jug
{
  const { P, poly, back, along } = stand(486, 972, 0.3);
  foot(486, 970, 22);
  // The blade is as wide as a hand is long, with one edge, toward the sun. Its back is thick and dark; a groove runs along it; the flat
  // of it holds the dark of the sky; and the slope down to its edge takes the light.
  const steel = (c, x, y) => {
    const [up, off] = back(x, y), n = nA(up / 60, off / 5);
    let s = off < -13 ? mix('#0a090e', '#1c1a24', n) : off < -8 ? '#060508' : off < 9 ? mix(mix('#222030', '#3e3a4c', n), '#5c5668', smooth(120, 270, up) * 0.4) : mix('#6c6068', '#b8a498', (off - 9) / 13);
    if (off >= 9) s = mix(s, '#ff9a48', 0.3 * smooth(40, 260, up));                              // the camp fire, on the slope of the edge
    return mix(mix(s, c, 0.15), '#0a0608', smooth(60, 0, up) * 0.6);                             // dull and dark near the ground
  };
  shape(p, poly([[0, -19], [80, -22], [200, -22], [258, -17], [276, -6], [276, 22], [200, 22], [80, 21], [0, 17]]), { shadow: '#0e0c12', half: '#262430', lit: '#6c6470', bounce: '#242038' }, { ...o, round: 18, length: 30, flow: () => along, tint: steel, edge: false });
  for (const [u0, len, off] of [[30, 90, -2], [110, 120, 3], [70, 60, 6], [190, 70, -3]]) mark(poly([[u0, off], [u0 + len, off + 0.6]]), '#7c7688', 4.4, { opacity: 0.35, taper: [0.4, 0.4] });   // long pale streaks in the flat of it
  glint(p, poly([[4, 19], [80, 22.5], [200, 23.5], [274, 23]]), sunEdge, { width: 4.8, dash: 70, gap: 6, opacity: 0.98, rng: r });               // the sun along its edge
  for (const up of [84, 150, 216]) mark(poly([[up, -4], [up + 15, 4]]), '#0a080c', 4.6, { opacity: 0.6 });                                        // old cuts in it
  // the guard: a thick oval of gold; the grip, long, for two hands, bound in dark red cord; and the cap of gold at its end
  shape(p, poly([[276, -34], [282, -38], [292, -34], [292, 34], [282, 38], [276, 34]]), goldT, { ...o, round: 7, length: 14, flow: () => along + Math.PI / 2 });
  shape(p, poly([[292, -10], [392, -9], [392, 9], [292, 10]]), redT, { ...o, round: 8, flow: () => along });
  for (let up = 300; up < 388; up += 13) { mark(poly([[up, -10], [up + 7, 10]]), '#2a060a', 4.6, { opacity: 0.85 }); mark(poly([[up + 7, -10], [up, 10]]), '#2a060a', 4.2, { opacity: 0.5 }); }   // the cord crosses over itself
  shape(p, poly([[392, -12], [404, -11], [408, 0], [404, 11], [392, 12]]), goldT, { ...o, round: 6, length: 13, flow: () => along + Math.PI / 2 });
  // the jug: it hangs from the guard by a cord. It is round, of brown clay, with a narrow neck, a stopper, and a net of cord round it
  const [jx, jy] = [P(288, 30)[0] + 30, P(288, 30)[1] + 86];
  mark([P(288, 30), [jx - 4, jy - 62], [jx, jy - 50]], '#c8b890', 4.4);
  orb(p, [[jx, jy, 36], [jx, jy - 32, 15]], (x, y) => { const k = clamp(((x - jx) * 0.8 - (y - jy) * 0.6) / 42, -1, 1), n = nB(x / 14, y / 14) * 0.2; return k > 0 ? mix(mix('#6c3c20', '#844c28', n * 3), '#e09a50', k) : mix('#6c3c20', '#180c0c', -k); }, { width: 6.5, reach: 30 });
  mark([[jx - 9, jy - 48], [jx + 9, jy - 48]], '#2c1c14', 8); mark([[jx - 7, jy - 57], [jx + 7.5, jy - 57]], '#b8a480', 7);                       // its neck and its stopper
  for (const dy of [-10, 12]) mark(arc(jx, jy + dy - 30, 46, 0.86, 2.28, 8), '#2c1810', 4.6, { opacity: 0.7 });                                   // the cords round it
  for (const dx of [-16, 4, 22]) mark([[jx + dx, jy - 24], [jx + dx * 1.3, jy], [jx + dx, jy + 26]], '#2c1810', 4.4, { opacity: 0.55 });
  glint(p, arc(jx, jy, 34, -1.1, 0.6, 12), sunEdge, { width: 4.6, dash: 26, gap: 6, opacity: 0.95, rng: r });
}

// ---------------------------------------------------------------- her staff
{
  const { P, poly, along } = stand(398, 966, 0.13);
  foot(398, 964, 10);
  shape(p, poly([[0, -5.5], [330, -5.5], [330, 5.5], [0, 5.5]]), { shadow: '#100c1c', half: '#28204c', lit: '#6c5ca8', rim: '#ffc890', bounce: '#201838' }, { ...o, round: 5.5, flow: () => along });
  for (const up of [56, 66, 150, 240, 250, 322]) mark(poly([[up, -8], [up + 2, 8]]), '#c8982c', 6, { cap: 'flat' });                              // bands of gold
  const [hx, hy] = P(376, 0), R = 46, toSun = Math.atan2(LIGHT[1], LIGHT[0]);
  // its head: a wide ring of gold with a smaller ring inside it, and four points that stand out from it. Each ring is round like a rope:
  // dark on the side away from the sun, bright on the side toward it.
  const ring = (rad, w) => { for (let a = 0; a < 6.283; a += 0.42) { const lit = (Math.cos(a + 0.21 - toSun) + 1) / 2; mark(arc(hx, hy, rad, a, a + 0.5, 6), mix('#8c6018', '#f0c248', lit), w); } for (let a = toSun - 1.1; a < toSun + 1.1; a += 0.5) mark(arc(hx, hy, rad + w * 0.28, a, a + 0.44, 5), '#fff0a8', 4, { opacity: 0.8 }); for (let a = toSun + Math.PI - 1; a < toSun + Math.PI + 1; a += 0.5) mark(arc(hx, hy, rad - w * 0.28, a, a + 0.44, 5), '#2c1c0c', 4, { opacity: 0.6 }); };
  for (const a of [-1.57 + 0.13, 0.13, 1.57 + 0.13, 3.14 + 0.13]) { const c = Math.cos(a), s = Math.sin(a); shape(p, [[hx + c * (R + 1) - s * 11, hy + s * (R + 1) + c * 11], [hx + c * (R + 42), hy + s * (R + 42)], [hx + c * (R + 1) + s * 11, hy + s * (R + 1) - c * 11]], goldT, { ...o, round: 6, length: 15, flow: () => a }); }   // the four points
  ring(R, 11); ring(R * 0.46, 7.5);
  mark(poly([[330, -3], [352, 0], [376 - R, 0]]), '#c8982c', 8);                                                                                 // where the rod meets the ring
  for (const [a, len, c, w] of [[2.5, 84, '#e8a0b8', 6], [2.82, 108, '#f8f0f0', 6.5], [3.2, 70, '#e8a0b8', 5.5], [0.5, 66, '#f8f0f0', 5.5]]) { const x0 = hx + Math.cos(a) * R, y0 = hy + Math.sin(a) * R; mark([[x0, y0], [x0 - 10, y0 + len * 0.5], [x0 - 26, y0 + len]], c, w, { taper: [0, 0.6], opacity: 0.92 }); mark([[x0 - 22, y0 + len * 0.86], [x0 - 31, y0 + len + 6]].map(([x, y], i) => [x + (i ? -2 : 2), y + (i ? 3 : -3)]), '#e0b040', 6); }   // the ribbons that hang from it, each with a bead of gold
}

// ---------------------------------------------------------------- his sword
{
  const { P, poly, back, along } = stand(300, 958, -0.1);
  foot(300, 956, 20);
  // The blade: wide, a little bent, with one edge toward the sun and a hook cut in it near the guard. It is like water. We see the light
  // through it: dark blue at its back, a band of light inside it, and the gold of the sun where its edge is thin.
  const bend = (up) => 16 * Math.pow(up / 290, 2), half = (up) => 9 + 13 * smooth(0, 180, up);
  const outline = []; for (let up = 0; up <= 290; up += 29) outline.push([up, bend(up) - half(up)]);
  outline.push([290, bend(290) + 22], [266, bend(266) + 23], [258, bend(258) + 40], [238, bend(238) + 50], [242, bend(242) + 30], [222, bend(222) + 22.4]);
  for (let up = 203; up >= 0; up -= 29) outline.push([up, bend(up) + half(up)]);
  for (const [w, op, c] of [[70, 0.12, '#4cb4ff'], [34, 0.14, '#a8ecff']]) p.stroke({ brush: 'soft', color: c, width: w, opacity: op, points: [P(-10, 0), P(140, bend(140)), P(300, bend(300))] });   // it shines: a little blue light in the air round it
  const water = (c, x, y) => {
    const [up, off] = back(x, y), t = clamp((off - bend(up) + half(up)) / (2 * half(up)), 0, 1), wave = Math.sin(up / 26 + Math.sin(off / 8 + up / 50) * 2);
    let s = mix('#082c6c', '#2a8cd8', smooth(0, 0.72, t));
    s = mix(s, '#b8f2ff', Math.exp(-Math.pow((t - 0.58) / 0.12, 2)) * 0.8);                      // the band of light inside it
    s = mix(s, wave > 0 ? '#d8f8ff' : '#06245c', Math.abs(wave) > 0.8 ? 0.22 : 0);               // the light and the dark that run in it, like water
    s = mix(s, '#ffd89c', smooth(0.84, 1, t) * 0.75);                                            // the sun through its thin edge
    return mix(mix(s, c, 0.1), '#0a1c3c', smooth(46, 0, up) * 0.5);
  };
  shape(p, poly(outline), { shadow: '#143a70', half: '#2c78c4', lit: '#8cd8f8', bounce: '#3c5cc0' }, { ...o, turn: -0.3, round: 20, length: 30, width: 5.2, vary: 0.03, flow: (x, y) => { const [up] = back(x, y); return along + Math.atan(32 * up / (290 * 290)); }, tint: water, edge: false });
  for (const [u0, off, len] of [[40, -3, 150], [150, 6, 110]]) { const pts = []; for (let k = 0; k <= 4; k++) { const up = u0 + len * k / 4; pts.push(P(up, bend(up) + off)); } p.tryStroke({ ...line, color: '#f4feff', width: 4.6, opacity: 0.5, taper: [0.4, 0.4], points: pts }); }   // two long lights in it
  { const pts = []; for (let up = 8; up <= 216; up += 26) pts.push(P(up, bend(up) + half(up) + 0.5)); glint(p, pts, () => mix('#fff0c8', '#ffffff', r()), { width: 4.6, dash: 70, gap: 5, opacity: 0.98, rng: r }); }   // its edge
  { const pts = []; for (let up = 8; up <= 284; up += 34.5) pts.push(P(up, bend(up) - half(up) + 2)); p.tryStroke({ ...line, color: '#041a44', width: 5, opacity: 0.85, points: pts }); }                           // its back
  glint(p, poly([[224, bend(224) + 23], [239, bend(239) + 48], [257, bend(257) + 40], [264, bend(264) + 25]]), () => '#fff4d0', { width: 4.4, dash: 30, gap: 4, opacity: 0.95, rng: r });                           // the edge of the hook
  // the guard: a long bent bar of gold, with a hook at one end; the grip, bound in red; the cap of gold; and the cord with its charm
  shape(p, poly([[290, -40], [301, -42], [304, 22], [318, 40], [330, 44], [326, 54], [308, 50], [292, 30]]), goldT, { ...o, round: 7, length: 16, flow: () => along + Math.PI / 2 });
  shape(p, poly([[303, -9], [372, -8], [372, 8], [303, 9]]), redT, { ...o, round: 8, flow: () => along });
  for (let up = 310; up < 368; up += 12) mark(poly([[up, -9], [up + 6, 9]]), '#3c0a0e', 4.6, { opacity: 0.85 });
  shape(p, poly([[372, -11], [384, -10], [390, 0], [384, 10], [372, 11]]), goldT, { ...o, round: 6, length: 13, flow: () => along + Math.PI / 2 });
  const [cx, cy] = P(384, 6);
  mark([[cx, cy], [cx + 28, cy + 30], [cx + 34, cy + 82]], '#c82c24', 5, { taper: [0, 0.2] }); mark([[cx, cy], [cx + 15, cy + 42], [cx + 14, cy + 104]], '#e04c34', 5, { taper: [0, 0.2] });
  disc(p, cx + 36, cy + 92, 9, '#e8c050', 6.2, { ...line }); mark(arc(cx + 36, cy + 92, 7.5, -1.2, 0.4, 6), '#fff4b0', 4, { opacity: 0.9 });      // the charm: a small ball of gold
}

// ---------------------------------------------------------------- the ball
{
  const [bx, by, R] = [350, 958, 37];
  p.tryStroke({ brush: 'soft', color: '#060406', width: 28, opacity: 0.55, points: [[bx - 50, by + 30], [bx, by + 35], [bx + 46, by + 30]] });
  // It is blue, with a white band round it and rows of small knobs: each knob is a light with its shade.
  orb(p, [[bx, by, R]], (x, y) => { const k = clamp(((x - bx) * 0.8 - (y - by) * 0.6) / R, -1, 1), band = Math.abs(((x - bx) * 0.42 + (y - by)) / R) < 0.2; let c = band ? '#d0d6e6' : mix('#2848a0', '#3c6cc8', nA(x / 16, y / 16)); return k > 0 ? mix(c, '#fff0d0', k * 0.55) : mix(c, '#080818', -k * 0.8); }, { width: 6, reach: 26 });
  for (const [dx, dy] of [[-16, -16], [2, -22], [18, -10], [-20, 12], [0, 18], [16, 14]]) { mark([[bx + dx - 6.2, by + dy + 3], [bx + dx + 6.2, by + dy + 3]], '#101c50', 4.4, { opacity: 0.6 }); mark([[bx + dx - 6.2, by + dy], [bx + dx + 6.2, by + dy - 0.5]], dx > 0 ? '#a8c8ff' : '#5c84d8', 4.4, { opacity: 0.8 }); }
  glint(p, arc(bx, by, R - 2, -1.2, 0.5, 12), sunEdge, { width: 4.6, dash: 22, gap: 5, opacity: 0.95, rng: r });
}

// ---------------------------------------------------------------- the doll
// A small white beast of cloth, round, with two small ears, a red ball on a thread over its head and two wings like a bat's. It sits
// in the rock with its back to us, as if it looked at the fire too.
{
  const [mx, my] = [440, 950], fur = (cx, cy, R) => (x, y) => { const k = clamp(((x - cx) * 0.8 - (y - cy) * 0.6) / R, -1, 1); return k > 0 ? mix('#a89cb4', '#ffe9c8', k) : mix('#a89cb4', '#30283c', -k * 0.9); };
  p.tryStroke({ brush: 'soft', color: '#060406', width: 26, opacity: 0.55, points: [[mx - 46, my + 28], [mx, my + 32], [mx + 40, my + 28]] });
  for (const s of [-1, 1]) mark([[mx + s * 14, my + 22], [mx + s * 30, my + 27]], '#8c8098', 11);                                                 // its feet
  orb(p, [[mx, my, 27]], fur(mx, my, 27), { width: 6, reach: 22 });                                                                              // its body
  for (const s of [-1, 1]) {                                                                                                                    // its wings: dark purple, with three points along the lower edge
    const W1 = [[mx + s * 8, my - 16], [mx + s * 30, my - 44], [mx + s * 50, my - 34], [mx + s * 46, my - 14], [mx + s * 36, my - 20], [mx + s * 32, my - 4], [mx + s * 22, my - 12], [mx + s * 14, my + 2]];
    shape(p, W1, { shadow: '#1c0c30', half: '#3c2060', lit: '#7c50a8', rim: s > 0 ? '#ffb880' : '#a880d0', bounce: '#2c1848' }, { ...o, round: 7, length: 14, flow: () => (s > 0 ? -0.6 : -2.5) });
    for (const [ex, ey] of [[50, -34], [36, -20], [22, -12]]) mark([[mx + s * 9, my - 15], [mx + s * ex, my + ey]], '#12061e', 4, { opacity: 0.7 });   // the bones of the wing
  }
  for (const s of [-1, 1]) shape(p, [[mx + s * 8, my - 58], [mx + s * 19, my - 74], [mx + s * 22, my - 54]], { shadow: '#3c3448', half: '#a89cb4', lit: '#fff0d8', rim: '#ffe0b0' }, { ...o, round: 5, length: 13, flow: () => -1.57 });   // its ears
  orb(p, [[mx, my - 42, 22]], fur(mx, my - 42, 22), { width: 6, reach: 18 });                                                                    // its head
  mark([[mx - 15, my - 21], [mx, my - 18], [mx + 15, my - 21]], '#5c5068', 4.6, { opacity: 0.6 });                                                // the seam where they meet
  mark([[mx + 1, my + 22], [mx - 1, my - 8]], '#6c6078', 4, { opacity: 0.45 });                                                                   // the seam down its back
  glint(p, arc(mx, my - 42, 20.5, -1.3, 0.5, 10), sunEdge, { width: 4.4, dash: 16, gap: 5, opacity: 0.9, rng: r });
  glint(p, arc(mx, my, 25.5, -0.9, 0.7, 10), sunEdge, { width: 4.4, dash: 16, gap: 5, opacity: 0.85, rng: r });
  mark([[mx + 2, my - 62], [mx + 9, my - 78], [mx + 8, my - 92]], '#c8b890', 4.2);                                                                // the thread
  disc(p, mx + 8, my - 102, 11, '#d83430', 6.2, { ...line });                                                                                    // and the red ball on it
  mark(arc(mx + 8, my - 102, 9.5, -1.3, 0.4, 7), '#ffc0a0', 4.2, { opacity: 0.95 });
  mark(arc(mx + 8, my - 102, 8, 1.6, 3.2, 6), '#5c1014', 4.2, { opacity: 0.7 });
}

p.save();
