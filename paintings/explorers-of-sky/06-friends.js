// The two partners, on the wet sand, their backs to us, looking at the sunset. On the left
// is a Piplup: a small round penguin, dark blue on its head and down its back like a cape,
// pale blue below, with yellow feet. On the right is a Chimchar: a small ape with orange
// fur, big ears, a tuft on its head, and a flame where its tail would be. The sun is in
// front of them and the flame is behind them, so they are dark against the bright water,
// with the light of the sun round their edges and the light of the flame on their backs.
'use strict';
const { studio, open, SUNLIGHT, PIPLUP, CHIMCHAR } = require('./scene');
const { mix, clamp, smooth, solid, orb, glint, arc } = studio;

const p = open('friends');
const r = p.rng;
const o = { light: SUNLIGHT, turn: 0.3, width: 5.5, length: 20, vary: 0.06, dash: 16, gap: 7, edgeOpacity: 0.9 };

// What the wet sand shows of them: each one upside down under its feet, dark and broken, and the flame with them.
for (const [F, w, len] of [[PIPLUP, 50, 112], [CHIMCHAR, 50, 116]]) {
  p.stroke({ brush: 'soft', color: '#4a3858', width: w, opacity: 0.42, taper: [0, 0.5], points: [[F.x, F.y - 2], [F.x + 2, F.y + len * 0.5], [F.x + 3, F.y + len]] });
  for (let k = 0; k < 7; k++) { const y = F.y + 8 + k * 13 + r.range(-3, 3), half = w * 0.5 * (1 - k / 9) * r.range(0.6, 1.1); p.tryStroke({ brush: 'bristle', color: mix('#3c2c50', '#6c5068', r()), width: r.range(5, 7.5), opacity: 0.5 - k * 0.04, mix: 0.2, dry: 0.05, rag: 0.3, points: [[F.x - Math.max(6.4, half), y], [F.x + Math.max(6.4, half), y + r.range(-1, 1)]] }); }
}
p.stroke({ brush: 'soft', color: '#ffb060', width: 20, opacity: 0.3, taper: [0, 0.6], points: [[CHIMCHAR.x - 2, CHIMCHAR.y + 16], [CHIMCHAR.x - 1, CHIMCHAR.y + 50], [CHIMCHAR.x, CHIMCHAR.y + 84]] });

// A round part of one of them: a few circles that run together. It is its own color in the
// shade; toward its top, which is turned to the sun, there is a bright edge; low down it is
// darker, and the light of the flame can lie on it from one place.
function round(circles, base, deep, edge, warm) {
  const top = Math.min(...circles.map((c) => c[1] - c[2])), bot = Math.max(...circles.map((c) => c[1] + c[2]));
  const depth = (x, y) => { let best = -1e9; for (const [ax, ay, ar] of circles) best = Math.max(best, ar - Math.hypot(x - ax, y - ay)); return best; };
  const colorAt = (x, y) => {
    const up = 1 - (y - top) / (bot - top), d = depth(x, y);
    let c = mix(deep, base, clamp(0.25 + 0.9 * up + r.range(-0.08, 0.08), 0, 1));
    if (warm) c = mix(c, warm[3] || '#ffb050', clamp(1 - Math.hypot(x - warm[0], y - warm[1]) / warm[2], 0, 1) * 0.6);
    return mix(c, edge, smooth(7, 1.5, d) * smooth(0.35, 0.85, up) * 0.95);                     // the edge that the sun finds
  };
  orb(p, circles, colorAt, { width: 6, reach: 30 });
}
const limb = (pts, tones, extra = {}) => solid(p, pts, tones, { ...o, ...extra });

// ---------------------------------------------------------------- the Piplup
{
  const { x, y } = PIPLUP, glowAt = [x + 44, y - 40, 60];
  const navy = { shadow: '#172248', half: '#293d7a', lit: '#5a72bc', rim: '#ffe4b4', bounce: '#3c3c7c' };
  const foot = { shadow: '#9a6c2c', half: '#d8a03c', lit: '#ffd870', rim: '#fff4c0', bounce: '#a87c50' };
  for (const s of [-1, 1]) limb([[x + s * 13, y - 7, 8], [x + s * 19, y - 3, 7]], foot, { length: 13 });           // its feet
  round([[x, y - 31, 31], [x, y - 52, 27]], '#7ea6ce', '#44669a', '#fff0cc', glowAt);                              // its body, pale blue
  for (const s of [-1, 1]) limb([[x + s * 27, y - 60, 9], [x + s * 37, y - 42, 7.5], [x + s * 40, y - 27, 5.5]], navy);   // its flippers, held out a little
  round([[x, y - 62, 23], [x, y - 42, 14], [x, y - 26, 7.5]], '#2c417e', '#16214a', '#ffe0b0');                    // the cape of dark feathers down its back
  round([[x, y - 90, 29]], '#2e4486', '#172350', '#ffe6b8');                                                       // its head
  glint(p, arc(x, y - 90, 27.5, -2.5, -0.64, 10), () => mix('#ffe9b8', '#fffbe6', r()), { width: 4.4, dash: 18, gap: 7, opacity: 0.85, rng: r });   // the sun along the top of it
  for (const s of [-1, 1]) p.tryStroke({ brush: 'bristle', color: '#8cb4dc', width: 6, opacity: 0.85, mix: 0.1, dry: 0, rag: 0.1, cap: 'round', taper: [0.2, 0.4], points: [[x + s * 26, y - 86], [x + s * 27, y - 72]] });   // the pale of its cheeks, which shows at the sides
}

// ---------------------------------------------------------------- the Chimchar
{
  const { x, y } = CHIMCHAR, fx = x, fy = y - 22, glowAt = [fx, fy - 12, 62, '#ffc060'];
  const fur = { shadow: '#983e16', half: '#d06824', lit: '#f8a242', rim: '#fff0c2', bounce: '#a84838' };
  const cream = { shadow: '#a8865c', half: '#dcc08c', lit: '#fff0c4', rim: '#fffbe4', bounce: '#b89478' };
  for (const s of [-1, 1]) {
    limb([[x + s * 13, y - 22, 9.5], [x + s * 16, y - 8, 8.5]], fur, { edge: false, length: 14 });                 // its legs
    limb([[x + s * 17, y - 5, 8], [x + s * 24, y - 3, 6.5]], cream, { length: 13 });                               // its feet
  }
  round([[x, y - 38, 24], [x, y - 60, 22]], '#cf6a26', '#8e3a16', '#fff0c2', glowAt);                              // its body
  for (const s of [-1, 1]) {
    limb([[x + s * 22, y - 64, 8.5], [x + s * 33, y - 46, 7.5], [x + s * 36, y - 32, 7]], fur);                    // its arms
    limb([[x + s * 36, y - 30, 7.5], [x + s * 37, y - 23, 7]], cream, { edge: false, length: 13 });                // its hands
  }
  for (const s of [-1, 1]) round([[x + s * 31, y - 98, 14]], '#c9602a', '#8e3a16', '#fff0c2');                     // its ears: big and round
  round([[x, y - 95, 27]], '#d06c28', '#93401a', '#fff2c8');                                                       // its head
  glint(p, arc(x, y - 95, 25.5, -2.6, -0.54, 10), () => mix('#ffe9b8', '#fffbe6', r()), { width: 4.4, dash: 18, gap: 7, opacity: 0.85, rng: r });   // the sun along the top of it
  for (const s of [-1, 1]) glint(p, arc(x + s * 31, y - 98, 12.5, -2.7, -0.44, 8), () => '#ffe9b8', { width: 4.2, dash: 14, gap: 6, opacity: 0.75, rng: r });
  limb([[x, y - 120, 9], [x + 5, y - 133, 6.5], [x + 1, y - 144, 4.6]], fur, { length: 14 });                      // the tuft on top of it
  // The flame: small, where its tail would be. A glow, then tongues of fire: red outside, yellow inside, nearly white at the heart.
  for (const [w, op] of [[90, 0.12], [50, 0.2], [26, 0.3]]) p.stroke({ brush: 'soft', color: '#ff9a3c', width: w, opacity: op, points: [[fx - w * 1.02, fy - 10], [fx, fy - 14], [fx + w * 1.02, fy - 10]] });
  for (const [dx, h, w, c, lean] of [[-6, 22, 9, '#f25a1e', -5], [6, 20, 8.5, '#f25a1e', 5], [0, 34, 11, '#ff7a24', -2], [0, 26, 7.5, '#ffd24c', -1], [0, 16, 5.5, '#fff8d0', 0]]) {
    p.stroke({ brush: 'bristle', color: c, width: w, mix: 0.1, dry: 0, rag: 0.15, cap: 'round', taper: [0.1, 0.85], points: [[fx + dx, fy + 5], [fx + dx + lean * 0.5 + r.range(-1.5, 1.5), fy - h * 0.5], [fx + dx + lean + r.range(-2, 2), fy - h]] });
  }
}

p.save();
