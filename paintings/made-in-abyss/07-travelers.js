// The travelers, on the ledge, their backs to us. Riko is at the left: fair hair in two
// tails, a pale jacket, a pack. Reg is in the middle, under a pack bigger than himself with a
// roll of bedding on top of it; his helmet with its two horns shows over it, and his arms and
// legs are dark metal. Nanachi is at the right: pale fur, two long ears, wide red trousers and
// a thick tail. The light is above them, so it is on their heads and their shoulders.
'use strict';
const { studio, open, RIKO, REG, NANACHI } = require('./scene');
const { mix, solid } = studio;

const p = open('travelers');
const r = p.rng;
const o = { light: [-0.62, -0.78], turn: 0.1, width: 5, length: 15, vary: 0.05, dash: 12, gap: 6, edgeOpacity: 0.7 };   // the light: from above, and from the left of them
const skin = { shadow: '#8a5c4c', half: '#c08c74', lit: '#ecc4a4', rim: '#fff0dc', bounce: '#a87868' };
const boot = { shadow: '#3c2a28', half: '#5c4034', lit: '#8c6a50', rim: '#d8c0a0', bounce: '#4c3838' };

// their shadows on the ledge
for (const f of [RIKO, REG, NANACHI]) p.stroke({ brush: 'soft', color: '#3a2a3c', width: 16, opacity: 0.42, points: [[f.x - 26, f.y + 2], [f.x + 4, f.y + 6], [f.x + 34, f.y + 3]] });

// ---------------------------------------------------------------- Riko
{
  const { x, y } = RIKO;
  const hair = { shadow: '#9c7a34', half: '#d2a848', lit: '#f6de84', rim: '#fff8cc', bounce: '#b89048' };
  const jacket = { shadow: '#94887c', half: '#c8beac', lit: '#f2ecdc', rim: '#ffffff', bounce: '#a89c94' };
  const shorts = { shadow: '#5c4c38', half: '#86704c', lit: '#b89c6c', rim: '#e8d8b0', bounce: '#6c5c4c' };
  const pack = { shadow: '#50382a', half: '#7a5638', lit: '#b08458', rim: '#ecd0a4', bounce: '#604838' };
  const helm = { shadow: '#8c8068', half: '#bcae90', lit: '#eee2c4', rim: '#fffdf0', bounce: '#9c9080' };
  for (const s of [-1, 1]) {
    solid(p, [[x + s * 9, y - 52, 7], [x + s * 10, y - 26, 6]], skin, { ...o, edge: false });                        // legs
    solid(p, [[x + s * 10, y - 26, 6.5], [x + s * 10.5, y - 5, 7]], boot, { ...o, edge: false });                    // boots
    solid(p, [[x + s * 8, y - 68, 11], [x + s * 9, y - 52, 9.5]], shorts, o);
  }
  solid(p, [[x, y - 104, 16], [x, y - 74, 15]], jacket, o);                                                         // her back
  for (const s of [-1, 1]) {
    solid(p, [[x + s * 17, y - 106, 6.5], [x + s * 22, y - 84, 6]], jacket, o);                                      // sleeves
    solid(p, [[x + s * 22, y - 84, 5.2], [x + s * 21, y - 63, 5]], skin, { ...o, edge: false });
  }
  solid(p, [[x, y - 103, 14.5], [x, y - 76, 15.5]], pack, o);                                                       // her pack
  p.stroke({ brush: 'bristle', color: '#3c2a22', width: 4.8, opacity: 0.8, mix: 0.1, dry: 0, rag: 0.1, points: [[x - 13, y - 91], [x, y - 89], [x + 13, y - 91]] });   // its flap
  solid(p, [[x, y - 119, 6], [x, y - 113, 6]], skin, { ...o, edge: false });                                         // neck
  for (const s of [-1, 1]) solid(p, [[x + s * 11, y - 125, 5.6], [x + s * 21, y - 120, 5.2], [x + s * 25, y - 107, 4.7]], hair, o);   // the two tails
  solid(p, [[x, y - 129, 14], [x, y - 123, 13]], hair, { ...o, length: 13 });                                        // the back of her head
  solid(p, [[x - 3, y - 140, 14], [x + 3, y - 140, 14]], helm, { ...o, length: 13 });                                // her helmet
  p.stroke({ brush: 'bristle', color: '#e9dfc4', width: 6, mix: 0.1, dry: 0, rag: 0.1, cap: 'round', points: [[x - 19, y - 133], [x, y - 131.5], [x + 19, y - 133]] });   // its brim
  p.stroke({ color: '#8c7c64', width: 4, opacity: 0.6, points: [[x - 16, y - 129.5], [x + 16, y - 129.5]] });
}

// ---------------------------------------------------------------- Reg
{
  const { x, y } = REG;
  const metal = { shadow: '#34303a', half: '#58545e', lit: '#928e98', rim: '#e4e0e4', bounce: '#48444c' };
  const cloth = { shadow: '#2c2630', half: '#463e48', lit: '#746a70', rim: '#c8bcc0', bounce: '#3a3440' };
  const olive = { shadow: '#474c30', half: '#6c7446', lit: '#a6ae74', rim: '#e6eabc', bounce: '#5a5c44' };
  const roll = { shadow: '#7c6444', half: '#b0946a', lit: '#e0c898', rim: '#fff4d4', bounce: '#8c7458' };
  const helmet = { shadow: '#382e30', half: '#5e5050', lit: '#9c8e88', rim: '#f0e4d4', bounce: '#4a4044' };
  const brown = { shadow: '#4a3024', half: '#704a34', lit: '#a47850', rim: '#e0c098', bounce: '#5a4034' };
  for (const s of [-1, 1]) {
    solid(p, [[x + s * 10, y - 44, 7], [x + s * 11, y - 6, 7.6]], metal, o);                                         // legs
    solid(p, [[x + s * 9, y - 62, 11], [x + s * 10, y - 44, 10]], cloth, o);                                         // shorts
    solid(p, [[x + s * 30, y - 104, 6.5], [x + s * 36, y - 76, 6], [x + s * 35, y - 50, 6.8]], metal, o);            // arms
    p.stroke({ color: '#d8b060', width: 4, opacity: 0.8, points: [[x + s * 29, y - 62], [x + s * 42.5, y - 64]] }); // a band on each
  }
  solid(p, [[x, y - 106, 26], [x, y - 64, 28]], olive, { ...o, width: 5.5, length: 22 });                            // the pack
  for (const s of [-1, 1]) solid(p, [[x + s * 29, y - 84, 9.5], [x + s * 29, y - 64, 9.5]], olive, o);               // its side pockets
  for (const s of [-1, 1]) p.stroke({ brush: 'bristle', color: '#33361f', width: 4.8, opacity: 0.75, mix: 0.1, dry: 0, rag: 0.1, points: [[x + s * 11, y - 124], [x + s * 12, y - 90], [x + s * 11, y - 42]] });   // straps
  p.stroke({ brush: 'bristle', color: '#33361f', width: 4.8, opacity: 0.6, mix: 0.1, dry: 0, rag: 0.1, points: [[x - 22, y - 78], [x, y - 75], [x + 22, y - 78]] });       // the flap
  solid(p, [[x, y - 132, 9.5], [x, y - 126, 9]], brown, { ...o, edge: false });                                      // his hair, under the helmet
  solid(p, [[x - 30, y - 130, 11], [x + 30, y - 130, 11]], roll, { ...o, length: 18 });                              // the roll of bedding
  for (const s of [-1, 1]) p.stroke({ brush: 'bristle', color: '#5a4630', width: 4.8, opacity: 0.8, mix: 0.1, dry: 0, rag: 0.1, points: [[x + s * 17, y - 141], [x + s * 17.5, y - 119]] });
  solid(p, [[x, y - 149, 15], [x, y - 145, 15]], helmet, { ...o, length: 14 });                                                        // the helmet
  for (const s of [-1, 1]) solid(p, [[x + s * 9, y - 156, 6.4], [x + s * 13, y - 166, 5.6], [x + s * 15, y - 174, 4.2]], helmet, { ...o, width: 4.8, length: 12.5 });   // its horns: short and thick
}

// ---------------------------------------------------------------- Nanachi
{
  const { x, y } = NANACHI;
  const fur = { shadow: '#9a887e', half: '#cab9a8', lit: '#f4eada', rim: '#ffffff', bounce: '#b09c94' };
  const red = { shadow: '#5c282c', half: '#8e3c38', lit: '#c6624c', rim: '#f4b494', bounce: '#6c3438' };
  for (const s of [-1, 1]) {
    solid(p, [[x + s * 12, y - 12, 7], [x + s * 14, y - 4, 7.4]], fur, { ...o, edge: false });                       // feet
    solid(p, [[x + s * 11, y - 54, 15], [x + s * 13, y - 20, 13.5]], red, { ...o, length: 20 });                     // the wide trousers
  }
  solid(p, [[x + 6, y - 52, 9], [x + 30, y - 44, 12.5], [x + 46, y - 26, 11.5], [x + 50, y - 10, 8]], fur, { ...o, length: 18 });   // the tail
  solid(p, [[x, y - 92, 19], [x, y - 64, 19]], fur, { ...o, length: 18 });                                           // the body
  for (const s of [-1, 1]) solid(p, [[x + s * 21, y - 92, 8], [x + s * 27, y - 66, 7.5]], fur, o);                   // arms
  for (const s of [-1, 1]) solid(p, [[x + s * 10, y - 138, 8], [x + s * 16, y - 166, 7.5], [x + s * 25, y - 190, 5.5]], fur, o);    // the ears
  solid(p, [[x - 8, y - 118, 16], [x + 8, y - 118, 16]], fur, { ...o, length: 16 });                                 // the head: wide, with the fur out at the cheeks
  solid(p, [[x, y - 129, 17], [x, y - 125, 17]], fur, { ...o, length: 14 });
  for (let k = 0; k < 9; k++) {                                          // tufts of the fur at the neck and the tail
    const a0 = [x + r.range(-20, 20), y - 104 + r.range(-3, 3)], a1 = [x + 30 + r.range(-10, 18), y - 40 + r.range(-12, 14)], q = k < 5 ? a0 : a1;
    p.tryStroke({ brush: 'bristle', color: mix('#b8a698', '#fff8ea', r()), width: 4.8, opacity: 0.8, mix: 0.15, dry: 0.05, rag: 0.3, taper: [0.1, 0.7], points: [q, [q[0] + r.range(-3, 3), q[1] + r.range(12.5, 16)]] });
  }
}

p.save();
