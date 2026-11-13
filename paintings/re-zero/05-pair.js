// Subaru and Rem, on their feet, face to face. She is at the left, in the dress of a maid
// of the Roswaal house: black, with a white apron and a white bow at the back, white cuffs
// and white stockings, a white band with frills on her short blue hair, and a ribbon at the
// side of it. She holds his hand in both of hers and looks up at him. He is in the black
// jacket with the orange collar that he came to this world in, and he looks down at her.
// The sun is on her face. It is behind him, along his back and in his hair.
'use strict';
const { studio, open, SUNWARD, rem, subaru } = require('./scene');
const { mix, solid, glint } = studio;

const p = open('pair');
const r = p.rng;
const o = { light: SUNWARD, turn: 0.05, width: 6.5, length: 26, vary: 0.05, dash: 22, gap: 9, edgeOpacity: 0.85 };
const line = { brush: 'bristle', mix: 0.1, dry: 0, rag: 0.1, cap: 'round' };
const jacket = { shadow: '#191a26', half: '#2c3042', lit: '#5a6278', rim: '#f0f2f8', bounce: '#34344e' };
const pants = { shadow: '#1e1f2c', half: '#343848', lit: '#626a7c', rim: '#e8ecf2', bounce: '#38384e' };
const skin = { shadow: '#b8806c', half: '#e0ac90', lit: '#fbdcc0', rim: '#fff4e0', bounce: '#c89484' };
const black = { shadow: '#0e0e16', half: '#1e1e2c', lit: '#4a4c60', rim: '#e4eaf6', bounce: '#22223a' };
const blue = { shadow: '#4c78b8', half: '#74a8e0', lit: '#b4dcfa', rim: '#ffffff', bounce: '#6c8cd0' };
const dress = { shadow: '#191930', half: '#2e2e4a', lit: '#5c6084', rim: '#e8ecfa', bounce: '#383860' };
const white = { shadow: '#8f98c4', half: '#c4cce6', lit: '#ffffff', rim: '#ffffff', bounce: '#b4a8c0' };
const shoe = { shadow: '#9a9cb4', half: '#cfd2e0', lit: '#ffffff', rim: '#ffffff', bounce: '#b0a8b8' };
// A part of one of them: `who` puts it in its place.
const part = (who, pts, tones, extra = {}) => solid(p, typeof pts[0][0] === 'number' ? pts.map((q) => who(...q)) : pts.map((c) => c.map((q) => who(...q))), tones, { ...o, ...extra });
const mark = (who, pts, color, width, extra = {}) => p.tryStroke({ ...line, color, width, ...extra, points: pts.map((q) => who(...q)) });

// Their shade on the stones: it goes away from the sun, to the left and toward us; and the dark close under their feet.
for (const who of [rem, subaru]) {
  const [x, y] = who(2, 0);
  p.stroke({ brush: 'soft', color: '#8480a4', width: 64, opacity: 0.42, points: [[x + 20, y + 4], [x - 150, y + 26], [x - 330, y + 54]] });
  p.stroke({ brush: 'soft', color: '#5c587c', width: 20, opacity: 0.5, points: [[x - 50, y + 4], [x, y + 6], [x + 50, y + 4]] });
}

// ---------------------------------------------------------------- Subaru
{
  const B = subaru;
  // his far leg, a little behind, and his near leg, a step toward her
  part(B, [[-8, 3.5, 4], [2, 3, 3.8], [11, 2.5, 3.2]], shoe, { length: 16, width: 5.5 });
  part(B, [[-2, 92, 9], [-3, 50, 7], [-6, 9, 5.5]], pants, { length: 38 });
  part(B, [[2, 3.5, 4], [12, 3, 3.8], [21, 2.5, 3.2]], shoe, { length: 16, width: 5.5 });
  part(B, [[2, 92, 9], [8, 50, 7], [4, 9, 5.5]], pants, { length: 38 });
  mark(B, [[3, 88], [8, 50], [5, 12]], '#dfe4ec', 5, { opacity: 0.55 });                                         // the stripe down the side of it
  for (const pts of [[[4, 60], [9, 52], [5, 44]], [[1, 22], [6, 16], [8, 10]]]) mark(B, pts, '#12131c', 6, { opacity: 0.45, rag: 0.25, taper: [0.3, 0.3] });   // folds at the knee and the ankle
  // the arm that hangs at his far side
  part(B, [[-1, 139, 5.5], [-4, 118, 5], [-2, 99, 4.5]], jacket, { length: 28 });
  part(B, [[-2, 96, 3.8], [-1, 90, 3.6]], skin, { length: 14, edge: false, width: 5.5 });
  // his body: the jacket hangs loose from his shoulders
  part(B, [[0, 95, 11.5], [-1, 110, 11], [2, 128, 12.5], [1, 140, 11.5]], jacket, { length: 38, width: 7.5 });
  for (const pts of [[[-7, 134], [-6, 116], [-7, 100]], [[5, 126], [2, 112], [5, 99]]]) mark(B, pts, '#10111a', 7, { opacity: 0.45, rag: 0.25, taper: [0.3, 0.3] });   // folds in the jacket
  mark(B, [[-10, 93], [0, 91], [11, 93]], '#3c4054', 9, { cap: 'flat' });                                        // the band at the foot of it
  mark(B, [[12, 136], [12, 116], [11, 96]], '#f08a2c', 6, { opacity: 0.95 });                                    // the orange down the front of it
  part(B, [[3, 146, 4.6], [4, 152, 4.6]], skin, { length: 14, edge: false, width: 5.5 });                        // his neck
  mark(B, [[-3, 148], [5, 145], [12, 139]], '#f08a2c', 8.5);                                                     // the orange of his collar
  // his head: he looks down at her
  part(B, [[5, 162, 12], [4, 160, 11.5]], black, { length: 20, width: 6 });                                      // his hair
  part(B, [[11, 158, 8.5], [12, 153, 6.5]], skin, { length: 16, width: 5.5 });                                   // his face, and his jaw
  mark(B, [[16, 160], [19.5, 156.5]], '#e0ac90', 6);                                                             // his nose
  mark(B, [[11, 160.5], [15, 160]], '#2a2a36', 5);                                                               // his eye
  mark(B, [[10.5, 163], [15.5, 163.5]], '#1a1a24', 4.6, { opacity: 0.8 });                                       // his brow
  mark(B, [[12.5, 151.5], [16, 152]], '#a0605c', 4.6, { opacity: 0.8 });                                         // his mouth
  mark(B, [[4.5, 159], [5, 154.5]], '#e8b89c', 5.5);                                                             // his ear
  for (const [x0, y0, x1, y1] of [[10, 167, 15, 171.5], [4, 169, 6, 175], [-3, 168, -6, 174], [13, 163, 18, 164.5]]) mark(B, [[x0, y0], [x1, y1]], mix('#0e0e16', '#2a2a3c', r()), 12, { taper: [0, 0.7] });   // the ends of it: short, and they stand up a little
  glint(p, [B(-8, 166), B(-9, 158), B(-7, 150)], () => '#e4eaf6', { width: 4.4, dash: 16, gap: 8, opacity: 0.8, rng: r });   // the sun on the back of his head
  // the arm that he gives her
  part(B, [[2, 140, 6], [11, 121, 5.2], [23, 113, 4.6]], jacket, { length: 26 });
  mark(B, [[3, 137], [12, 119], [21, 115]], '#eef0f6', 5, { opacity: 0.7 });                                     // the stripe down the sleeve
  part(B, [[24, 113, 3.9], [29, 113, 3.6]], skin, { length: 14, edge: false, width: 5.5 });                      // his hand
}

// ---------------------------------------------------------------- Rem
{
  const R = rem;
  // her far leg, and her near leg: the shoe, the white stocking, the top of the leg
  for (const [dx, far] of [[-5, true], [0, false]]) {
    part(R, [[-2 + dx, 3.5, 3.6], [5 + dx, 3, 3.4], [11 + dx, 2.5, 2.8]], black, { length: 14, width: 5.5 });
    part(R, [[3 + dx, 58, 6.4], [3 + dx, 42, 5], [2 + dx, 27, 5.5], [2 + dx, 9, 3.9]], white, { length: 28 });
    part(R, [[3 + dx, 65, 6.8], [3 + dx, 59, 6.5]], skin, { length: 14, edge: false, width: 5.5 });
    if (!far) mark(R, [[0, 44], [3, 41], [6, 44]], '#aab2d6', 5, { opacity: 0.5 });                              // the knee
  }
  mark(R, [[-5, 58], [2, 57], [9, 58]], '#e4e8f8', 5, { opacity: 0.9 });                                         // the frill at the top of the stockings
  part(R, [[-16, 64, 4], [0, 63, 4.5], [15, 64, 4]], white, { length: 18, width: 5.5, turn: -0.3 });             // the white under the skirt, at its hem
  part(R, [[[0, 97, 8], [-9, 81, 9], [-17, 68, 8]], [[0, 97, 8], [0, 81, 11], [-2, 68, 12]], [[1, 97, 8], [9, 81, 9], [15, 68, 8]]], dress, { length: 30 });   // her skirt
  for (const pts of [[[-3, 94], [-9, 80], [-14, 67]], [[1, 93], [3, 80], [5, 67]]]) mark(R, pts, '#0c0c18', 6.5, { opacity: 0.5, rag: 0.25, taper: [0.3, 0.3] });   // its folds
  part(R, [[5, 96, 5], [9, 82, 6.5], [11, 70, 6.5]], white, { length: 24, width: 5.5 });                         // the apron, down the front of it
  part(R, [[-9, 99, 5], [-17, 105, 4]], white, { length: 14, width: 5.5 });                                      // the bow of the apron at her back: its two loops
  part(R, [[-9, 96, 4.5], [-18, 92, 4]], white, { length: 14, width: 5.5 });
  mark(R, [[-9, 96], [-13, 86], [-15, 76]], '#c4cce6', 7, { taper: [0, 0.5] });                                  // and its two ends, which hang
  mark(R, [[-8, 95], [-9, 85], [-8, 75]], '#e4e8f6', 6.5, { taper: [0, 0.5] });
  part(R, [[0, 98, 8.5], [0, 110, 9], [2, 121, 9.5]], dress, { length: 28 });                                    // her body: she leans to him a little
  part(R, [[8, 111, 4.6], [9, 119, 4.6]], white, { length: 14, width: 5.5 });                                    // the white at the front of it
  part(R, [[3, 126, 3.6], [4, 132, 3.6]], skin, { length: 14, edge: false, width: 5.5 });                        // her neck
  mark(R, [[-4, 123], [2, 125.5], [9, 122.5]], '#e4e8f8', 6.5);                                                  // the frill at the top of the dress
  part(R, [[1, 124, 4.8], [4, 118, 4.4]], skin, { length: 14, edge: false, width: 5.5 });                        // her bare shoulder
  // her two arms, which go out to his hand: the far one, then the near one
  for (const [dx, dy] of [[1.5, 2.5], [0, 0]]) {
    part(R, [[4 + dx, 117 + dy, 4.6], [11 + dx, 106 + dy, 4.4], [21 + dx, 110 + dy, 4]], dress, { length: 22, width: 5.5 });
    part(R, [[21 + dx, 110 + dy, 5], [25 + dx, 112 + dy, 5.2]], white, { length: 14, width: 5.5 });              // the white cuff
    part(R, [[26 + dx, 112 + dy, 3.6], [31 + dx, 113 + dy, 3.4]], skin, { length: 14, edge: false, width: 5.5 });   // her hand, on his
  }
  // her head: she looks up at him
  part(R, [[3, 142, 12.5], [2, 140, 12]], blue, { length: 20, width: 6 });                                       // her hair: the back and the top of it
  part(R, [[9.5, 142, 8.5], [11, 136.5, 6.2]], skin, { length: 16, width: 5.5 });                                // her face, and her chin
  mark(R, [[13.5, 142.5], [17.5, 144]], '#fbdcc0', 6);                                                           // her nose
  mark(R, [[9.5, 145], [13.5, 146]], '#34508c', 5);                                                              // her eye
  mark(R, [[11, 137.5], [14.5, 139]], '#d4788c', 4.6, { opacity: 0.85 });                                        // her mouth: she smiles
  p.tryStroke({ brush: 'soft', color: '#f4a0a8', width: 8.2, opacity: 0.35, points: [R(7.5, 141), R(12.5, 141.5)] });   // the color in her cheek
  part(R, [[6, 153, 5.5], [12, 151, 4.8]], blue, { length: 16, width: 5.5 });                                    // the hair over her brow
  part(R, [[4, 141, 5], [5, 132, 4.8], [6, 127, 4.4]], blue, { length: 16, width: 5.5 });                        // the lock in front of her ear
  part(R, [[-6, 138, 6], [-7, 131, 5], [-5, 127, 4.4]], blue, { length: 14, width: 5.5 });                       // and the ends of it at the back of her neck
  part(R, [[-2, 153.5, 4.4], [5, 155.5, 4.4], [11, 153, 4.4]], white, { length: 14, width: 5.5, turn: -0.2 });   // the white band on it
  for (const [x, y] of [[-1, 156.5], [5, 158.5], [11, 156]]) mark(R, [[x, y], [x + 0.5, y + 4]], '#ffffff', 6.5);   // and its frills
  mark(R, [[0, 147], [-2, 139]], '#e87cb0', 7.5);                                                                // the ribbon at the side of her hair
  mark(R, [[-1, 140], [-4, 130]], '#d4609c', 6, { taper: [0, 0.5] });
  glint(p, [R(-7, 150), R(0, 154.5), R(8, 153)], () => '#ffffff', { width: 4.2, dash: 16, gap: 8, opacity: 0.7, rng: r });   // the sun on the top of her hair
}

p.save();
