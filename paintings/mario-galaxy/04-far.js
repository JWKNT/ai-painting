// The far worlds: small, and a little lost in the blue. A grass world with one tree, a bare
// one of pale rock, and another speck of green.
'use strict';
const { studio, open, SUNWARD, far, ball } = require('./scene');
const { mix, mass } = studio;

const p = open('far');
const grass = { shadow: '#12502c', half: '#2f9034', lit: '#84d448', shine: '#d2f27c', bounce: '#1f6068' };
const rock = { shadow: '#5c4a44', half: '#a88c70', lit: '#e6d0a0', shine: '#fff2d0', bounce: '#5a6a8c' };

// A grass world with one tree on it.
{
  const c = [232, 236, 58], d = 0.4;
  ball(p, [c], grass, { far: d, grain: 0.3 });
  p.tryStroke({ brush: 'bristle', color: far('#4a3020', 222, 170, d), width: 7, mix: 0, dry: 0, rag: 0, cap: 'round', points: [[224, 186], [221, 168], [219, 150]] });   // the trunk
  mass(p, [[218, 136, 22], [204, 146, 15], [234, 144, 16], [220, 122, 14]], { light: SUNWARD, tones: (t, x, y) => far(mix('#145a2c', '#a4dc54', t), x, y, d), bias: 0.42, contrast: 0.7, grain: 0.3, mix: 0.2, layers: [[8, 18, 0.95, 3, 0.45], [6, 14, 0.85, 2.5, 0.75]], seed: 3 });
}
// A world of pale rock.
ball(p, [[716, 172, 36]], rock, { far: 0.5, grain: 0.5 });
for (const [dx, dy, len] of [[-8, 4, 14], [10, -6, 13], [2, 16, 13]]) p.tryStroke({ brush: 'bristle', color: far('#7c6858', 716, 172, 0.5), width: 5, opacity: 0.5, mix: 0.2, dry: 0, rag: 0.1, cap: 'round', points: [[716 + dx - len / 2, 172 + dy], [716 + dx + len / 2, 172 + dy + 2]] });   // hollows in it
// A speck of green, farther still.
ball(p, [[1152, 118, 26]], grass, { far: 0.58, grain: 0.3 });

p.save();
