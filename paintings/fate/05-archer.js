// Archer, on the hill, his back to us. He has turned his head a little to the right, toward
// the glare, so we see the line of his cheek. His hair is white and short and swept back.
// His skin is brown. The red shroud is in two parts: one covers his shoulders, the top of
// his back and his arms, with plates of silver at the elbows and the wrists; the other hangs
// from his waist to his calves, and the wind takes it. Between them his body is in black
// armor with lines of silver on it. His legs are in black, with belts round the thighs and
// plates on the boots. In his left hand is Kanshou, black with a red pattern; in his right
// is Bakuya, white: short, broad, curved blades, held low and out from his sides.
// The glare is in front of him and to his right, so he is dark, with fire along his right
// edges, and a little of the dull red of the sky on his left.
'use strict';
const { studio, open, ARCHER, GLOW, HORIZON } = require('./scene');
const { mix, clamp, smooth, solid, shape, glint, disc, arc, noise2 } = studio;

const p = open('archer');
const r = p.rng;
const S = ARCHER.s;
const A = (fx, fy, rad) => (rad == null ? [ARCHER.x + fx * S, ARCHER.y - fy * S] : [ARCHER.x + fx * S, ARCHER.y - fy * S, rad * S]);
const poly = (pts) => pts.map(([x, y]) => A(x, y));
const back = (x, y) => [(x - ARCHER.x) / S, (ARCHER.y - y) / S];
const nF = noise2(613);
const LIGHT = [0.92, -0.3];                                           // the glare is low and far off, so its light on him comes from the right, nearly level
const o = { light: LIGHT, turn: 0.45, width: 5.5, length: 20, vary: 0.06, dash: 22, gap: 8, edgeOpacity: 0.9 };
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round' };
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: poly(pts) });
const red = { shadow: '#3c0c10', half: '#74161a', lit: '#bc2c1e', rim: '#ffb060', bounce: '#5c1830' };
const black = { shadow: '#08070b', half: '#16131a', lit: '#3c3440', rim: '#ffa850', bounce: '#201626' };
const skin = { shadow: '#3c2218', half: '#6c4028', lit: '#a86c40', rim: '#ffc880', bounce: '#4c2c28' };
const white = { shadow: '#6c6480', half: '#a8a0b0', lit: '#ece6e0', rim: '#fff6dc', bounce: '#8478a0' };
const silver = () => mix('#8c8088', '#e8dccc', r());

// His shadow: it comes down the hill toward us, away from the glare.
{
  const [fx, fy] = A(0, 0), dx = fx - GLOW.x, dy = fy - HORIZON, l = Math.hypot(dx, dy);
  for (const [w, len, op] of [[70, 400, 0.5], [46, 560, 0.3]]) p.stroke({ brush: 'soft', color: '#140808', width: w, opacity: op, taper: [0, 0.5], points: [[fx, fy - 4], [fx + dx / l * len * 0.5, fy + dy / l * len * 0.5], [fx + dx / l * len, fy + dy / l * len]] });
}

// ---------------------------------------------------------------- his legs
// His weight is on his left leg; the right is a step out.
solid(p, [A(-9, 94, 10), A(-12, 52, 8), A(-13, 26, 7)], black, { ...o, length: 30 });
solid(p, [A(9, 94, 10), A(15, 52, 8), A(19, 26, 7)], black, { ...o, length: 30 });
for (const [x0, x1, fy] of [[-19, -3, 72], [-19.5, -4, 63], [1, 19, 72], [3, 21, 63]]) mark([[x0, fy], [(x0 + x1) / 2, fy - 1.5], [x1, fy]], silver(), 4.6, { opacity: 0.8 });   // the belts round his thighs
// his boots: black, to the middle of the shin, with plates of iron on them
shape(p, poly([[-20, 32], [-6, 32], [-6, 8], [-3, 0], [-23, 0], [-21, 8]]), black, { ...o, round: 8, length: 16 });
shape(p, poly([[12, 32], [26, 32], [28, 8], [34, 0], [13, 0], [13, 8]]), black, { ...o, round: 8, length: 16 });
for (const [x0, x1, fy] of [[-20, -6, 30], [-20.5, -6, 20], [-21, -6, 10], [12, 26, 30], [12.5, 26.6, 20], [13, 27.6, 10]]) mark([[x0, fy], [x1, fy]], silver(), 5, { opacity: 0.85, cap: 'flat' });
for (const [x0, x1] of [[-23, -3], [13, 34]]) mark([[x0, 1.2], [x1, 1.2]], '#2c2228', 5, { cap: 'flat' });                                 // their soles

// ---------------------------------------------------------------- the lower part of the shroud
// It hangs from his waist to his calves in long folds. The wind is from the left: it swings the cloth out to the right and lifts its hem there.
{
  const down = (fy) => clamp((104 - fy) / 80, 0, 1);
  const halfW = (fy) => 15 + 27 * Math.pow(down(fy), 0.85), axis = (fy) => 22 * Math.pow(down(fy), 1.5);
  const hemAt = (fx) => 20 + 4 * Math.sin(fx / 6 + 1) + 3 * Math.sin(fx / 2.3) + 0.26 * Math.max(0, fx);
  const split = (fx, fy) => fy < 60 && Math.abs(fx - axis(fy) * 0.7 + 1) < (60 - fy) * 0.09;      // it is open down the middle of the back, from the knee
  const inside = (x, y) => { const [fx, fy] = back(x, y); return fy < 105 && fy > hemAt(fx) && Math.abs(fx - axis(fy)) < halfW(fy) && !split(fx, fy); };
  const fan = (x, y) => { const [fx, fy] = back(x, y); return Math.atan2(110 - fy, fx - axis(fy) * 1.6); };
  const cloth = (x, y) => {
    const [fx, fy] = back(x, y), u = clamp((fx - axis(fy)) / halfW(fy), -1, 1), fold = Math.sin(Math.atan2(fx - 4, 156 - fy) * 30 + 0.4) * 0.5 + (nF(fx / 26, fy / 44) - 0.5) * 0.6;
    let c = fold > 0 ? mix('#70161a', '#b02a1c', clamp(fold * 1.5, 0, 1)) : mix('#70161a', '#2e0a10', clamp(-fold * 1.6, 0, 1));
    c = mix(c, '#e04a24', smooth(0.3, 1, u) * 0.4);                                             // the side of it that is toward the glare
    c = mix(c, '#2a0810', smooth(-0.4, -1, u) * 0.4);                                           // the side that is away from it
    return mix(c, '#ffb060', smooth(0.9, 1, u) * 0.75 + smooth(6, 0, fy - hemAt(fx)) * 0.2);    // fire at its edge and a little along its hem
  };
  const box = [...A(-46, 108), ...A(76, 6)];
  p.fill({ inside, bounds: box, width: 9, length: 46, spacing: 0.5, angle: (x, y) => fan(x, y) + r.range(-0.05, 0.05), color: cloth, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.15, dry: 0.03, rag: 0.15, cap: 'round' } });
  p.fill({ inside, bounds: box, width: 5.5, length: 30, spacing: 0.9, overlap: 0.7, angle: (x, y) => fan(x, y) + r.range(-0.08, 0.08), color: (x, y) => cloth(x + r.range(-2, 2), y), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.15, dry: 0.03, rag: 0.2, cap: 'round' } });
  // the corner of it that the wind has got: it flies out to the right, and it has its own folds
  shape(p, poly([[32, 70], [50, 68], [68, 62], [88, 60], [100, 52], [82, 48], [66, 42], [50, 38], [38, 30]]), red, { ...o, round: 9, length: 22, turn: 0.2, flow: (x) => -0.12 + 0.2 * Math.sin((x - ARCHER.x) / 22) });
  for (const [x0, y0, x1, y1, x2, y2] of [[40, 62, 60, 56, 84, 55], [40, 50, 58, 47, 74, 48], [40, 40, 52, 41, 62, 44]]) mark([[x0, y0], [x1, y1], [x2, y2]], '#2e0a10', 5, { opacity: 0.6, taper: [0.2, 0.5] });
  glint(p, poly([[34, 71], [52, 69], [70, 63], [90, 61], [99, 53]]), () => mix('#ff9c50', '#ffd088', r()), { width: 4.4, dash: 30, gap: 9, opacity: 0.85, rng: r });
  for (let fx = -30; fx < 60; fx += 7) { const fy = hemAt(fx) + 2.5; if (Math.abs(fx - axis(fy)) < halfW(fy) - 2 && !split(fx, fy + 3)) mark([[fx - 3, fy], [fx + 3, fy + 0.6]].map(([x, y], i) => [x + (i ? 0.4 : -0.4), y]), '#2a0810', 4.6, { opacity: 0.7 }); }   // the dark of its hem, where it is turned up
}

// ---------------------------------------------------------------- his body
// The black armor: it is close to his body, narrow at the waist. Lines of silver go across it and down his spine.
shape(p, poly([[-15, 104], [15, 104], [17, 118], [20, 132], [-20, 132], [-17, 118]]), black, { ...o, round: 14, length: 22, flow: () => Math.PI / 2 });
for (const [fy, half] of [[110, 15.4], [119, 16.6]]) mark([[-half, fy], [0, fy - 1], [half, fy]], silver(), 4.6, { opacity: 0.5 });
mark([[0, 104], [0, 116], [0, 128]], '#8c8088', 4.6, { opacity: 0.45 });
mark([[-16, 103], [0, 102], [16, 103]], '#c8bcb0', 6, { cap: 'flat' });                                                                    // the band of silver at his waist, over the top of the shroud
mark([[-5, 104], [5, 104]].map(([x, y], i) => [x + (i ? 0.2 : -0.2), y]), '#7c1c1c', 9, { cap: 'flat' });                                   // and the red plate in the middle of it
// The upper part of the shroud: it lies over his shoulders and the top of his back, and its lower edge comes down to a point over his spine.
shape(p, poly([[-23, 153], [-10, 158], [10, 158], [23, 153], [25, 140], [19, 130], [8, 126], [0, 121], [-8, 126], [-19, 130], [-25, 140]]), red, { ...o, round: 16, length: 24, flow: () => Math.PI / 2 });
for (const [x0, y0, x1, y1, x2, y2] of [[-9, 152, -7, 140, -10, 128], [9, 152, 7, 140, 10, 128], [0, 156, 0, 142, 0, 124], [-18, 148, -17, 140, -20, 132], [18, 148, 17, 140, 20, 132]]) mark([[x0, y0], [x1, y1], [x2, y2]], '#2e0a10', 5.5, { opacity: 0.5, rag: 0.25, taper: [0.3, 0.3] });   // its folds
glint(p, poly([[-19, 130], [-8, 126], [0, 121], [8, 126], [19, 130]]), () => '#2a0810', { width: 4.6, dash: 30, gap: 4, opacity: 0.8, rng: r });   // the shade under its lower edge
shape(p, poly([[-10, 157], [10, 157], [11, 166], [5, 168], [-5, 168], [-11, 166]]), red, { ...o, round: 6, length: 14, turn: 0.3 });        // its collar, which stands up

// ---------------------------------------------------------------- his arms
// They are a little out from his sides, bent. The sleeves are of the shroud; there is a plate of silver at each elbow and a wide band at each wrist.
for (const [s, sh, el, wr] of [[-1, [-22, 148], [-31, 123], [-40, 99]], [1, [22, 148], [32, 125], [44, 103]]]) {
  solid(p, [A(sh[0], sh[1], 9), A(el[0], el[1], 7.6), A(wr[0], wr[1], 6.2)], red, { ...o, length: 26 });
  for (const t of [0.25, 0.5]) { const x = sh[0] + (el[0] - sh[0]) * t, y = sh[1] + (el[1] - sh[1]) * t; mark([[x - 7, y + 2], [x, y - 1], [x + 7, y - 3]], '#2e0a10', 5, { opacity: 0.5, taper: [0.2, 0.4] }); }   // folds in the sleeve
  mark([[el[0] - 7, el[1] + 3], [el[0], el[1]], [el[0] + 7, el[1] - 3]], silver(), 6, { cap: 'flat' });                                      // the plate at his elbow
  for (const d of [0, 5]) mark([[wr[0] - 6.4 + d * 0.3 * s, wr[1] + 3 + d], [wr[0] + 6.4 + d * 0.3 * s, wr[1] - 1 + d]], d ? '#8c8088' : '#e0d4c4', 5.5, { cap: 'flat' });   // the band at his wrist
  shape(p, poly([[wr[0] - 5 - s * 0.6, wr[1] - 1], [wr[0] + 5 - s * 0.6, wr[1] - 3], [wr[0] + 5.6 + s * 1.6, wr[1] - 11], [wr[0] + s * 2.4, wr[1] - 14], [wr[0] - 5 + s * 1.6, wr[1] - 10]]), skin, { ...o, round: 5, length: 13, turn: 0.3 });   // his hand, shut on the grip
  for (const d of [-2, 1.4]) mark([[wr[0] + d + s * 1.2, wr[1] - 4], [wr[0] + d + s * 2.2, wr[1] - 12.6]], '#2a1610', 4, { opacity: 0.6 });   // the lines between his fingers
}

// ---------------------------------------------------------------- the two swords
// Each is a short broad blade with a curve to it. Its back is nearly straight; its edge swells and then comes in to the point.
// At the foot of the blade is a round plate with the sign of the two forces on it, half dark and half light.
function blade(hand, dir, body, edgeTone, pattern) {
  const d = [Math.sin(dir), -Math.cos(dir)], sgn = hand[0] < 0 ? -1 : 1, n = [-d[1] * sgn * -1, d[0] * sgn * -1];   // d: from the hand to the point; n: across it, toward the outside of him, where the edge is
  const B = (u, v) => [hand[0] + d[0] * u + n[0] * v, hand[1] + d[1] * u + n[1] * v];
  const outline = [[5, -4.6], [22, -5], [40, -3.6], [54, -1.6], [63, 1.4], [54, 8.4], [40, 11], [22, 9.6], [5, 5.4]];
  mark([B(-13, 0), B(-6, 0), B(2, 0)], '#1c1418', 7.6);                                                                                     // the grip
  for (const u of [-10, -6, -2]) mark([B(u - 1, -2.6), B(u + 1, 2.6)], pattern ? '#7c2228' : '#c8beb4', 4, { opacity: 0.85 });                // its binding
  mark([B(-15.4, -2.6), B(-13.6, 2.6)], '#b8aca0', 5.5, { cap: 'flat' });                                                                   // the cap on the end of it
  shape(p, poly(outline.map(([u, v]) => B(u, v))), body, { ...o, round: 14, length: 22, turn: 0.2, flow: () => Math.atan2(-d[1], d[0]) });
  if (pattern) for (const [u, v] of [[16, 2], [26, 5.6], [26, -1], [36, 2.4], [46, 5], [46, -0.4], [54, 3]]) { mark([B(u - 3, v), B(u, v + 3), B(u + 3, v)], '#8c2028', 4, { opacity: 0.85 }); mark([B(u - 3, v), B(u, v - 3), B(u + 3, v)], '#8c2028', 4, { opacity: 0.85 }); }   // the red pattern on the black one, like the shell of a tortoise
  else for (const v of [0.5, 5]) mark([B(12, v), B(24, v + 1.6), B(36, v - 0.6), B(48, v + 1), B(56, v + 0.6)], '#a8b4d0', 4, { opacity: 0.6 });   // the pale lines on the white one, like water
  glint(p, poly([[22, 9.6], [40, 11], [54, 8.4], [63, 1.4]].map(([u, v]) => B(u, v - 0.8))), edgeTone, { width: 4.4, dash: 34, gap: 6, opacity: 0.9, rng: r });   // the light along its edge
  mark([B(8, -4.4), B(30, -4.4), B(52, -2)], pattern ? '#05040a' : '#8c8498', 4.6, { opacity: 0.8 });                                        // the shade along its back
  const [gx, gy] = A(...B(3.4, 0.4));
  disc(p, gx, gy, 5.4 * S, pattern ? '#16121a' : '#e4dcd2', 6.2, { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.1, cap: 'round' });           // the round plate
  p.tryStroke({ ...line, color: pattern ? '#e4dcd2' : '#16121a', width: 5.4, points: arc(gx, gy, 2.6 * S, 0.4, 3.4, 7) });                   // and the other half of the sign on it
}
blade([-39.6, 90], -0.5, { shadow: '#060508', half: '#141018', lit: '#34283a', rim: '#ffa850', bounce: '#1c1428' }, () => mix('#ff9c50', '#ffd088', r()), true);
blade([44.4, 94], 0.56, { shadow: '#8c8498', half: '#c4bcc4', lit: '#f6f0e8', rim: '#fff8e4', bounce: '#a898b4' }, () => mix('#fff0d0', '#ffffff', r()), false);

// ---------------------------------------------------------------- his head
// The back of his neck; his head, turned a little to the right, so that the line of his cheek and jaw shows there; his ear; his hair, white, swept back, with its ends up.
shape(p, poly([[-6, 158], [6, 158], [7, 168], [-6, 168]]), skin, { ...o, round: 6, length: 13, turn: 0.3 });
shape(p, poly([[8, 181], [14, 180], [16.6, 174], [16, 167], [12, 163], [7, 164]]), skin, { ...o, round: 5, length: 13, turn: 0.1 });         // his cheek and his jaw
mark([[12.6, 176.6], [13, 171]], '#a86c40', 5.4);                                                                                          // his ear
mark([[13.6, 175.6], [13.8, 172]].map(([x, y], i) => [x, y + (i ? -1 : 1)]), '#3c2218', 4, { opacity: 0.7 });
shape(p, poly([[-12, 167], [-14, 177], [-12, 186], [-6, 192], [2, 194], [9, 191], [13, 184], [12, 178], [9, 172], [8, 165], [0, 163], [-8, 164]]), white, { ...o, round: 14, length: 16, turn: 0.2, flow: (x, y) => Math.atan2(-(y - A(0, 150)[1]), x - A(0, 150)[0]) });
for (const [x0, y0, x1, y1] of [[-8, 187, -12, 194], [-3, 190, -4, 197.6], [3, 190.6, 4.6, 198], [8, 188, 12.6, 194], [-11, 180, -16.6, 184]]) mark([[x0, y0], [(x0 + x1) / 2 + 0.4, (y0 + y1) / 2], [x1, y1]], mix('#a8a0b0', '#f0eae4', r()), 13, { taper: [0, 0.7] });   // the ends of his hair: short, and they stand up
for (const [x0, y0, x1, y1] of [[-8, 168, -10, 186], [-3, 166, -4, 190], [2, 166, 2, 191], [7, 168, 8, 188]]) mark([[x0, y0], [x1, y1]], '#7c7490', 4.6, { opacity: 0.5, taper: [0.2, 0.4] });   // the fall of it

// ---------------------------------------------------------------- the fire along his right edges
for (const pts of [[[33.6, 148], [41, 126], [50.6, 104]], [[20, 131], [18.4, 118], [16, 106]], [[26.6, 31], [27.4, 20], [28.6, 8]], [[13.4, 190], [14, 180], [12, 170]]]) glint(p, poly(pts), () => mix('#ff9c50', '#ffd890', r()), { width: 4.4, dash: 30, gap: 12, opacity: 0.85, rng: r });
for (const pts of [[[-31, 148], [-39, 124], [-46.6, 100]], [[-27, 96], [-30, 60], [-28, 30]]]) glint(p, poly(pts), () => '#8c2c3c', { width: 4.4, dash: 26, gap: 18, opacity: 0.5, rng: r });   // and the dull red of the sky on his left

p.save();
