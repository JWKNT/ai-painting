// Mario, as a paper plane. In this world a person is a sheet of paper with a picture on
// it, and Mario has the power to fold. Here he is folded into a dart and glides over the
// wood toward the Great Tree. The paper is white on its back, so the two wings are white.
// The side of the dart is the picture, folded: the blue of his overalls at the nose, his
// red shirt, his face and brown hair, and at the tail his red cap with its white round
// and its M. The gold sky is on the tops of the wings; the side is in a soft blue shade.
// Its shade goes over the white path below, and Punio, the small Puni who came to ask
// for help, runs after it down there.
'use strict';
const { studio, open, cam, SHADOW } = require('./scene');
const { mix, solid, glint, disc, inPoly } = studio;

const p = open('plane');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.03, cap: 'round' };
const flat = { ...line, cap: 'flat' };

const N = [800, 344], F = [1190, 168], FAR = [1158, 30], NEAR = [1274, 200], KEEL = [1206, 320];
const axis = Math.atan2(F[1] - N[1], F[0] - N[0]);
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
// a place on one panel of the dart: s is how far it is from the nose to the tail, q how far from the fold out to the edge
const on = (edge, s, q) => lerp(N, lerp(F, edge, q), s);
// where a place of the picture is on a panel: its s and q
const where = (edge, x, y) => { const ax = F[0] - N[0], ay = F[1] - N[1], bx = edge[0] - N[0], by = edge[1] - N[1], det = ax * by - ay * bx, a = ((x - N[0]) * by - (y - N[1]) * bx) / det, b = (ax * (y - N[1]) - ay * (x - N[0])) / det, s = a + b; return [s, s > 1e-6 ? b / s : 0]; };
function panel(edge, colorAt, w = 7) {
  const tri = [N, F, edge];
  p.fill({ inside: inPoly(tri), bounds: [Math.min(N[0], F[0], edge[0]) - 4, Math.min(N[1], F[1], edge[1]) - 4, Math.max(N[0], F[0], edge[0]) + 4, Math.max(N[1], F[1], edge[1]) + 4], width: w, length: 60, spacing: 0.42, overlap: 0.6, angle: () => axis + r.range(-0.02, 0.02), color: (x, y) => colorAt(...where(edge, x, y), x, y), stroke: { ...flat, rag: 0.02, opacity: 0.98 } });
}
const edgeLine = (a, b, color, w = 4.4, op = 0.9) => p.tryStroke({ brush: 'round', color, width: w, opacity: op, points: [a, lerp(a, b, 0.5), b] });

// ---------------------------------------------------------------- its shade, on the path far below
p.stroke({ brush: 'soft', color: '#6c78a8', width: 44, opacity: 0.5, taper: [0.95, 0.15], points: [[944, 812], [1040, 790], [1136, 766]] });

// ---------------------------------------------------------------- the far wing: the white back of the paper, in the gold light. A little of the picture has come round the fold onto it.
panel(FAR, (s, q, x, y) => {
  let c = mix('#fff9ea', '#ffeec4', q * 0.6 + (1 - s) * 0.2);
  if (q < 0.3 - Math.abs(s - 0.47) * 1.6 && s > 0.36 && s < 0.6) c = '#e23018';                          // a fold of his red cap
  if (q < 0.2 - Math.abs(s - 0.66) * 2 && s > 0.58 && s < 0.74) c = '#ffc68c';                           // and of his face
  return mix(c, '#e8dcc8', (Math.sin(x / 13 + y / 7) * 0.5 + 0.5) * 0.06);
});
// ---------------------------------------------------------------- the side of the dart: the picture of Mario, folded
const M = on(KEEL, 0.83, 0.64);
panel(KEEL, (s, q, x, y) => {
  let c;
  if (s < 0.17) c = '#2a4ccc';                                                                          // his overalls
  else if (s < 0.3) c = q > 0.6 && s > 0.2 ? '#fbf8f2' : '#e23018';                                     // his shirt, and a white glove
  else if (s < 0.5) c = q > 0.62 ? '#5a3016' : '#ffc68c';                                               // his face, and his brown moustache under it
  else if (s < 0.64) c = q < 0.5 ? '#ffc68c' : '#5a3016';                                               // his ear, and his hair
  else c = '#e23018';                                                                                   // his cap
  if (s > 0.32 && s < 0.44 && q > 0.36 && q < 0.6) c = '#f0a070';                                       // his round nose
  c = mix(c, '#4c5488', 0.16 + 0.14 * q);                                                               // the side is turned from the sky
  return mix(c, '#ffffff', (Math.sin(x / 11 - y / 9) * 0.5 + 0.5) * 0.05);
});
// the dark lines of the drawing, between its colors
for (const [s, lean] of [[0.17, 0.02], [0.3, -0.03], [0.5, 0.04], [0.64, -0.02]]) p.tryStroke({ brush: 'round', color: '#241820', width: 4.4, opacity: 0.9, points: [on(KEEL, s - lean, 0), on(KEEL, s + lean * 0.4, 0.5), on(KEEL, s + lean, 1)] });
// the white round on the cap, and its M
disc(p, M[0], M[1], 25, '#fbf8f2', 6, { ...line, mix: 0 });
p.tryStroke({ brush: 'round', color: '#241820', width: 4, opacity: 0.85, points: studio.arc(M[0], M[1], 27, 0, Math.PI * 2, 24) });
{ const rot = ([dx, dy]) => [M[0] + dx * Math.cos(axis) - dy * Math.sin(axis), M[1] + dx * Math.sin(axis) + dy * Math.cos(axis)];
  p.stroke({ ...line, mix: 0, color: '#e02414', width: 5.4, points: [[-13, 12], [-13, -12], [0, 3], [13, -12], [13, 12]].map(rot) }); }

// ---------------------------------------------------------------- the near wing: white, a tone cooler, because it is turned a little from the light
panel(NEAR, (s, q, x, y) => mix(mix('#fbf7f0', '#dfe3f0', q * 0.7), '#ffffff', (Math.sin(x / 9 + y / 11) * 0.5 + 0.5) * 0.06));

// ---------------------------------------------------------------- the edges of the paper, and the fold along its middle
edgeLine(N, FAR, '#ffffff', 5); edgeLine(FAR, F, '#c8c4d0', 4.4, 0.8);
edgeLine(N, KEEL, '#3c3858', 4.4, 0.8); edgeLine(KEEL, F, '#3c3858', 4.4, 0.8);
edgeLine(N, NEAR, '#ffffff', 5); edgeLine(NEAR, F, '#b4b8cc', 4.4, 0.8);
edgeLine(N, F, '#a8a4b8', 4.4, 0.7);
// the gold of the sky along the top edge of the far wing
glint(p, [N, lerp(N, FAR, 0.5), FAR], '#fff0b8', { width: 4.2, dash: 60, gap: 8, opacity: 0.9, rng: r });

// ---------------------------------------------------------------- the air that it leaves behind it: thin broken lines, as in the sky
for (const [a, b, c] of [[[1206, 196], [1380, 150], [1620, 170]], [[1236, 252], [1400, 236], [1620, 280]]]) glint(p, [a, b, c], '#fff6dc', { width: 4.6, dash: 22, gap: 16, opacity: 0.8, rng: r });

// ---------------------------------------------------------------- Punio, who runs after it on the path: a Puni is a small round creature the color of a dove, with one feeler that ends in a ball
{ const X0 = 1.5, Z0 = 9.6, U = cam.unit(Z0), P = (X, Y) => cam.at(X0 + X, Y, Z0), o = { light: [-0.5, -0.86], turn: 0.35, width: 5, length: 14, vary: 0.05, mix: 0.05, edge: false, flow: () => 0 };
  const a = P(0, 0), b = cam.at(X0 + SHADOW[0] * 0.45, 0, Z0 + SHADOW[1] * 0.45), c = cam.at(X0 + SHADOW[0] * 0.95, 0, Z0 + SHADOW[1] * 0.95);
  p.stroke({ brush: 'soft', color: '#7480ac', width: Math.min(0.36 * U, Math.hypot(c[0] - a[0], c[1] - a[1]) / 2.1), opacity: 0.5, taper: [0, 0.5], points: [a, b, c] });
  for (const sx of [-1, 1]) p.tryStroke({ ...line, color: '#4a4668', width: 6, points: [P(sx * 0.1 - 0.075, 0.025 + (sx > 0 ? 0.04 : 0)), P(sx * 0.1 + 0.075, 0.025 + (sx > 0 ? 0.04 : 0))] });      // its two small feet: one is up, because it runs
  solid(p, [[...P(-0.02, 0.235), 0.2 * U], [...P(0.02, 0.235), 0.2 * U]], { shadow: '#5a5878', half: '#8a86a8', lit: '#c4c0d8', bounce: '#b0aec8' }, o);
  p.tryStroke({ brush: 'round', color: '#5a5878', width: 4.4, points: [P(0, 0.42), P(0.03, 0.52), P(0.07, 0.6)] });                                              // its feeler leans, because it looks up
  disc(p, ...P(0.08, 0.65), 6.7, '#8a86a8', 6.2, { ...line, mix: 0 });
  glint(p, [P(-0.19, 0.26), P(-0.16, 0.36), P(-0.07, 0.425), P(0.04, 0.435)], () => mix('#ffd070', '#fff4c8', r()), { width: 4, dash: 16, gap: 7, opacity: 0.75, rng: r });
}

p.save();
