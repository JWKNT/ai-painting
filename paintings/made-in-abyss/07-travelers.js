// The travelers, on the ledge, their backs to us. Riko is at the left: a pale helmet, fair
// hair in two tails, a pack, one arm up to point at the village. Reg is in the middle, under
// a pack bigger than himself with a roll of bedding on top of it; his helmet with its two
// horns shows over it, and his arms and legs are metal. Nanachi is at the right: pale fur,
// two long ears, wide red trousers and a thick tail. The light is above them and a little to
// the left, so it is on their heads, their shoulders and the tops of their packs, and the
// air of the place is in their shadows.
'use strict';
const { studio, open, RIKO, REG, NANACHI } = require('./scene');
const { mix, solid } = studio;

const p = open('travelers');
const r = p.rng;
const o = { light: [-0.45, -0.89], turn: 0.05, width: 5, length: 15, vary: 0.05, dash: 12, gap: 6, edgeOpacity: 0.8 };
const skin = { shadow: '#96685a', half: '#c89478', lit: '#f2ccaa', rim: '#fff2dc', bounce: '#b08070' };
const boot = { shadow: '#4a3630', half: '#6e5040', lit: '#a08060', rim: '#ecd8b4', bounce: '#5a4844' };
const line = { brush: 'bristle', mix: 0.1, dry: 0, rag: 0.1, cap: 'round' };

// their shadows on the ledge: short, and away from the light
for (const f of [RIKO, REG, NANACHI]) p.stroke({ brush: 'soft', color: '#34263a', width: 16, opacity: 0.45, points: [[f.x - 18, f.y + 2], [f.x + 12, f.y + 7], [f.x + 46, f.y + 9]] });

// ---------------------------------------------------------------- Riko
{
  const { x, y } = RIKO;
  const hair = { shadow: '#a88438', half: '#d8b04c', lit: '#f8e28c', rim: '#fffad4', bounce: '#c09850' };
  const jacket = { shadow: '#a0908c', half: '#d2c4b4', lit: '#f6eedc', rim: '#ffffff', bounce: '#b4a4a0' };
  const shorts = { shadow: '#66563c', half: '#8e784e', lit: '#c0a470', rim: '#ecdcb4', bounce: '#766650' };
  const pack = { shadow: '#5a4030', half: '#84603e', lit: '#b88c5c', rim: '#f0d8a8', bounce: '#6a5040' };
  const helm = { shadow: '#948870', half: '#c2b494', lit: '#f0e4c6', rim: '#fffdf0', bounce: '#a49888' };
  for (const s of [-1, 1]) {
    solid(p, [[x + s * 9, y - 54, 6.6], [x + s * 10, y - 28, 5.8]], skin, { ...o, edge: false });                    // legs
    solid(p, [[x + s * 10, y - 28, 6.4], [x + s * 10.5, y - 5, 7]], boot, { ...o, edge: false });                    // boots
    solid(p, [[x + s * 8, y - 70, 10.5], [x + s * 9, y - 54, 9]], shorts, o);
  }
  solid(p, [[x, y - 104, 15.5], [x, y - 76, 14.5]], jacket, o);                                                     // her back
  solid(p, [[x - 17, y - 106, 6.3], [x - 21, y - 86, 5.8]], jacket, o);                                              // the arm that hangs
  solid(p, [[x - 21, y - 86, 5], [x - 20, y - 66, 4.8]], skin, { ...o, edge: false });
  solid(p, [[x, y - 103, 14], [x, y - 77, 15]], pack, o);                                                           // her pack
  p.stroke({ ...line, color: '#46301f', width: 4.8, opacity: 0.8, points: [[x - 13, y - 91], [x, y - 89], [x + 13, y - 91]] });   // its flap
  solid(p, [[x + 16, y - 106, 6.3], [x + 27, y - 119, 5.8]], jacket, o);                                             // the arm that points to the village
  solid(p, [[x + 27, y - 119, 5], [x + 41, y - 135, 4.7]], skin, { ...o, edge: false });
  solid(p, [[x, y - 119, 6], [x, y - 113, 6]], skin, { ...o, edge: false });                                         // neck
  for (const s of [-1, 1]) solid(p, [[x + s * 11, y - 125, 5.6], [x + s * 21, y - 120, 5.2], [x + s * 25, y - 107, 4.7]], hair, o);   // the two tails
  solid(p, [[x, y - 129, 13.5], [x, y - 124, 12.5]], hair, { ...o, length: 13 });                                    // the back of her head
  solid(p, [[x - 3, y - 140, 13.5], [x + 3, y - 140, 13.5]], helm, { ...o, length: 13 });                            // her helmet
  p.stroke({ ...line, color: '#ece2c8', width: 6, points: [[x - 19, y - 133], [x, y - 131.5], [x + 19, y - 133]] });  // its brim
  p.stroke({ color: '#968668', width: 4, opacity: 0.6, points: [[x - 16, y - 129.5], [x + 16, y - 129.5]] });
}

// ---------------------------------------------------------------- Reg
{
  const { x, y } = REG;
  const metal = { shadow: '#443e50', half: '#686272', lit: '#aca4a8', rim: '#f0e8e0', bounce: '#585264' };
  const cloth = { shadow: '#3a323c', half: '#564c54', lit: '#84787a', rim: '#d4c8c4', bounce: '#48404c' };
  const olive = { shadow: '#55573a', half: '#7f824c', lit: '#bcbc80', rim: '#f4f2c4', bounce: '#66684c' };
  const roll = { shadow: '#86704c', half: '#b89c70', lit: '#e6d09e', rim: '#fff6d8', bounce: '#967e60' };
  const helmet = { shadow: '#463c3e', half: '#6c5e5c', lit: '#a89a90', rim: '#f4e8d8', bounce: '#584c50' };
  const brown = { shadow: '#563a2c', half: '#7c543a', lit: '#ac8058', rim: '#e4c8a0', bounce: '#64483a' };
  for (const s of [-1, 1]) {
    solid(p, [[x + s * 10, y - 44, 6.8], [x + s * 11, y - 6, 7.4]], metal, o);                                       // legs
    solid(p, [[x + s * 9, y - 62, 10.5], [x + s * 10, y - 44, 9.5]], cloth, o);                                      // shorts
    solid(p, [[x + s * 30, y - 104, 6.2], [x + s * 37, y - 78, 5.8], [x + s * 37, y - 52, 6.4]], metal, o);          // arms, a little out from him
    p.stroke({ color: '#dcb868', width: 4, opacity: 0.8, points: [[x + s * 30.5, y - 66], [x + s * 43.5, y - 67]] }); // a band on each
  }
  solid(p, [[x, y - 106, 25], [x, y - 66, 27]], olive, { ...o, width: 5.5, length: 22 });                            // the pack
  for (const s of [-1, 1]) solid(p, [[x + s * 28, y - 84, 9], [x + s * 28, y - 64, 9]], olive, o);                   // its side pockets
  for (const s of [-1, 1]) p.stroke({ ...line, color: '#3f4128', width: 4.8, opacity: 0.7, points: [[x + s * 11, y - 124], [x + s * 12, y - 90], [x + s * 11, y - 42]] });   // straps
  p.stroke({ ...line, color: '#3f4128', width: 4.8, opacity: 0.55, points: [[x - 22, y - 78], [x, y - 75], [x + 22, y - 78]] });       // the flap
  p.stroke({ ...line, color: '#d8d8a0', width: 4.8, opacity: 0.5, points: [[x - 18, y - 122], [x, y - 126], [x + 16, y - 123]] });      // the light on the top of it
  solid(p, [[x, y - 132, 9.5], [x, y - 126, 9]], brown, { ...o, edge: false });                                      // his hair, under the helmet
  solid(p, [[x - 29, y - 131, 10.5], [x + 29, y - 131, 10.5]], roll, { ...o, length: 18 });                          // the roll of bedding
  for (const s of [-1, 1]) p.stroke({ ...line, color: '#64503a', width: 4.8, opacity: 0.8, points: [[x + s * 17, y - 141.5], [x + s * 17.5, y - 120]] });
  solid(p, [[x, y - 150, 14.5], [x, y - 146, 14.5]], helmet, { ...o, length: 14 });                                  // the helmet
  for (const s of [-1, 1]) solid(p, [[x + s * 9, y - 157, 6.2], [x + s * 13, y - 167, 5.4], [x + s * 15, y - 175, 4.2]], helmet, { ...o, width: 4.8, length: 12.5 });   // its horns: short and thick
}

// ---------------------------------------------------------------- Nanachi
{
  const { x, y } = NANACHI;
  const fur = { shadow: '#a4928a', half: '#d0c0b0', lit: '#f8eede', rim: '#ffffff', bounce: '#b8a49c' };
  const red = { shadow: '#6c3234', half: '#9a463e', lit: '#cc6c54', rim: '#f6bc9c', bounce: '#7c3e40' };
  for (const s of [-1, 1]) {
    solid(p, [[x + s * 12, y - 12, 7], [x + s * 14, y - 4, 7.4]], fur, { ...o, edge: false });                       // feet
    solid(p, [[x + s * 11, y - 54, 15], [x + s * 13, y - 20, 13.5]], red, { ...o, length: 20 });                     // the wide trousers
  }
  solid(p, [[x + 6, y - 52, 9], [x + 30, y - 44, 12.5], [x + 46, y - 26, 11.5], [x + 50, y - 10, 8]], fur, { ...o, length: 18 });   // the tail
  solid(p, [[x, y - 92, 19], [x, y - 64, 19]], fur, { ...o, length: 18 });                                           // the body
  for (const s of [-1, 1]) solid(p, [[x + s * 21, y - 92, 8], [x + s * 27, y - 66, 7.5]], fur, o);                   // arms
  for (const s of [-1, 1]) solid(p, [[x + s * 10, y - 138, 8], [x + s * 15, y - 164, 7.5], [x + s * 22, y - 186, 6.2], [x + s * 32, y - 197, 4.8]], fur, o);   // the ears: long, and bent out at the tips
  solid(p, [[x - 8, y - 118, 16], [x + 8, y - 118, 16]], fur, { ...o, length: 16 });                                 // the head: wide, with the fur out at the cheeks
  solid(p, [[x, y - 129, 17], [x, y - 125, 17]], fur, { ...o, length: 14 });
  const tufts = [];
  for (let k = 0; k < 5; k++) tufts.push([x + r.range(-20, 20), y - 104 + r.range(-3, 3), r.range(-0.3, 0.3)]);                       // the fur at the neck
  for (let k = 0; k < 4; k++) tufts.push([x + 30 + r.range(-10, 18), y - 40 + r.range(-12, 14), r.range(-0.3, 0.3)]);                 // on the tail
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) tufts.push([x + s * (20 + k * 2), y - 122 + k * 6, s * (1.0 + 0.2 * k)]);      // out from the cheeks
  for (const [tx, ty, a] of tufts) p.tryStroke({ brush: 'bristle', color: mix('#c2b0a2', '#fff8ea', r()), width: 4.8, opacity: 0.8, mix: 0.15, dry: 0.05, rag: 0.3, taper: [0.1, 0.7], points: [[tx, ty], [tx + Math.sin(a) * 14, ty + Math.cos(a) * 14]] });
}

p.save();
