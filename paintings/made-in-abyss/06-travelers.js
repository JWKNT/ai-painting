// The three of them, seen from behind at the edge of the terrace, small against the hollow.
// Nanachi on the left: long ears, a horned hat, wide trousers, a thick tail. Riko in the
// middle under her helmet and her great pack, one arm out, pointing. Reg on the right in his
// cape, his helmet with its two horns. The light is beyond them and above, so they are dark
// with gold along their heads and shoulders.
'use strict';
const { studio, open, LIGHT, NANACHI, RIKO, REG } = require('./scene');
const { solid } = studio;

const p = open('travelers');
const o = { light: LIGHT, turn: 0.5, width: 5, length: 18, vary: 0.06, lights: false, dash: 14, gap: 7, edgeOpacity: 0.85 };
const place = (f) => { const s = f.h / 100; return (x, y, rad) => (rad == null ? [f.x + x * s, f.y + y * s] : [f.x + x * s, f.y + y * s, rad * s]); };
const mark = (P, a, b, w, color, extra = {}) => p.tryStroke({ brush: 'bristle', color, width: w, mix: 0, dry: 0, rag: 0.05, cap: 'round', ...extra, points: [P(...a), P(...b)] });

// Their shadows, toward us on the stone.
for (const f of [NANACHI, RIKO, REG]) p.stroke({ brush: 'soft', color: '#030a0c', width: 40, opacity: 0.5, taper: [0, 0.5], points: [[f.x, f.y - 4], [f.x - 24, f.y + 40], [f.x - 60, f.y + 96]] });

// ---------------------------------------------------------------- Nanachi
{
  const N = place(NANACHI);
  const fur = { shadow: '#2c2620', half: '#5c4e3c', lit: '#c8ac80', rim: '#fff0c0' }, cloth = { shadow: '#1c0c14', half: '#3c1826', lit: '#8a3c4c', rim: '#f6d48c' }, dark = { shadow: '#0a0c0e', half: '#181c1e', lit: '#44484a', rim: '#f0dc98' };
  mark(N, [-6, -3], [-6, -14], 6.5, '#2c2620');                          // feet
  mark(N, [7, -3], [7, -14], 6.5, '#2c2620');
  solid(p, [[N(13, -34, 6), N(24, -30, 7.5), N(32, -40, 6.5)]], fur, o);                                    // the tail
  solid(p, [[N(-7, -40, 10), N(-8, -22, 9)], [N(7, -40, 10), N(8, -22, 9)]], cloth, o);                     // the wide trousers
  solid(p, [N(0, -60, 10.5), N(0, -46, 11)], fur, o);                                                       // the body
  mark(N, [-11, -62], [-14, -44], 6, '#4c4032');                                                            // arms
  mark(N, [11, -62], [14, -44], 6, '#4c4032');
  for (const [x0, x1] of [[-6, -13], [6, 13]]) {                                                            // the ears: long, standing up and out
    p.tryStroke({ brush: 'bristle', color: '#5c4e3c', width: 7, taper: [0, 0.6], mix: 0, dry: 0, rag: 0, cap: 'round', points: [N(x0, -78), N((x0 + x1) / 2 - Math.sign(x0), -92), N(x1, -104)] });
    p.tryStroke({ color: '#e8d8b0', width: 4, opacity: 0.85, taper: [0.2, 0.5], points: [N(x1 - Math.sign(x0) * 2, -93), N(x1, -105)] });   // their pale tips
  }
  solid(p, [N(0, -74, 9), N(0, -70, 9)], fur, { ...o, length: 14 });                                         // the head
  solid(p, [N(-7, -80, 5), N(0, -84, 6), N(7, -80, 5)], dark, { ...o, length: 14 });                         // the hat
  mark(N, [-8, -82], [-15, -90], 4.6, '#181c1e');                                                           // and its horns
  mark(N, [8, -82], [15, -90], 4.6, '#181c1e');
}

// ---------------------------------------------------------------- Riko
{
  const R = place(RIKO);
  const pack = { shadow: '#1c120c', half: '#3c2816', lit: '#8a6238', rim: '#f6dc98' }, khaki = { shadow: '#22241c', half: '#4a4c38', lit: '#b0a878', rim: '#fff0c0' };
  mark(R, [-5, -2], [-4, -30], 6.5, '#22241c');                          // legs
  mark(R, [5, -2], [4, -30], 6.5, '#22241c');
  mark(R, [-9, -1.5], [-1, -1.5], 5.5, '#120c08');                       // boots
  mark(R, [1, -1.5], [9, -1.5], 5.5, '#120c08');
  mark(R, [11, -62], [30, -76], 6, '#4a4c38');                           // the arm that points
  mark(R, [27, -74], [37, -81], 4.6, '#d8b48c');
  mark(R, [-12, -62], [-15, -40], 6, '#4a4c38');                         // the other arm
  solid(p, [R(0, -66, 15), R(0, -40, 16)], pack, { ...o, length: 22 });                                     // the pack, nearly as big as she is
  solid(p, [R(-13, -84, 5.5), R(13, -84, 5.5)], khaki, { ...o, length: 16 });                               // the bedroll tied across the top of it
  for (const y of [-58, -46]) mark(R, [-14, y], [14, y], 4.6, '#120c08', { opacity: 0.6 });                 // its straps
  mark(R, [-9, -94], [-17, -86], 5, '#d8b860');                          // her hair, in two tails
  mark(R, [9, -94], [17, -86], 5, '#d8b860');
  solid(p, [R(-3, -97, 9), R(3, -97, 9)], khaki, { ...o, length: 14 });                                     // the helmet
  mark(R, [-12, -93], [12, -93], 4.8, '#3a3c2c');                        // its brim
}

// ---------------------------------------------------------------- Reg
{
  const G = place(REG);
  const cape = { shadow: '#1a0c0c', half: '#3a1816', lit: '#8a3c2c', rim: '#f6d48c' }, metal = { shadow: '#0c1014', half: '#20282c', lit: '#6c7878', rim: '#fff0c0' };
  mark(G, [-5, -2], [-4, -30], 7, '#14181a');                            // legs
  mark(G, [5, -2], [4, -30], 7, '#14181a');
  mark(G, [-9, -1.5], [-1, -1.5], 5.5, '#0a0c0e');
  mark(G, [1, -1.5], [9, -1.5], 5.5, '#0a0c0e');
  mark(G, [13, -66], [17, -36], 6.5, '#20282c');                         // the arm of metal, at his side
  mark(G, [16, -40], [17, -30], 6.5, '#55605f');                         // its hand
  solid(p, [G(0, -74, 11), G(0, -54, 13.5), G(0, -34, 15)], cape, { ...o, length: 24 });                    // the cape
  solid(p, [G(0, -90, 9.5), G(0, -86, 9.5)], metal, { ...o, length: 14 });                                  // the helmet
  for (const s of [-1, 1]) p.tryStroke({ brush: 'bristle', color: '#20282c', width: 5, taper: [0, 0.5], mix: 0, dry: 0, rag: 0, cap: 'round', points: [G(s * 7, -94), G(s * 12, -100), G(s * 12, -108)] });   // and its two horns
  mark(G, [-8, -80], [8, -80], 5, '#3c2418');                            // his hair under it
}

p.save();
