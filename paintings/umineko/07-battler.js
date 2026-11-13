// Battler, seen from behind, close to us on the chessboard floor: feet planted wide, his left
// fist clenched at his side, his right arm thrown up and out, pointing at her. White jacket,
// black trousers, red hair. The lightning is on his left side, and along his right side runs
// the gold of the witch he will not believe in.
'use strict';
const { studio, open, BOLT, BATTLER } = require('./scene');
const { mix, solid, glint } = studio;

const p = open('battler');
const r = p.rng;
const o = { light: { at: [BOLT.x, BOLT.y] }, turn: 0.1, width: 6, length: 30, vary: 0.06, bounce: 0.95, dash: 22, gap: 9, edgeOpacity: 0.85 };

// The far edge of everything he wears takes the witch's gold.
const black = { shadow: '#06050b', half: '#11101c', lit: '#383a54', rim: '#b8c8ff', bounce: '#8a5a1c' };
const white = { shadow: '#40425e', half: '#949cc0', lit: '#f2f4ff', rim: '#ffffff', bounce: '#e0a04c' };
const red = { shadow: '#32080c', half: '#7c1818', lit: '#cc5046', rim: '#ffd4cc', bounce: '#f08a30' };
const skin = { shadow: '#5a3a34', half: '#a8765e', lit: '#eac4a8', rim: '#fff0e0', bounce: '#e8a050' };
const { x: bx, y: by } = BATTLER;

// His two shadows on the floor: one thrown toward us by the witch's light, one thrown across
// the cold patch by the lightning.
p.stroke({ brush: 'soft', color: '#04030a', width: 64, opacity: 0.55, taper: [0, 0.4], points: [[bx - 4, by - 6], [bx - 130, by + 34], [bx - 300, by + 74]] });
p.stroke({ brush: 'soft', color: '#04030a', width: 54, opacity: 0.5, taper: [0, 0.4], points: [[bx + 10, by - 6], [bx + 130, by + 30], [bx + 290, by + 70]] });

// Legs, planted wide.
solid(p, [[548, 778, 24], [530, 864, 20], [515, 940, 16]], black, { ...o, length: 40 });
solid(p, [[586, 778, 24], [601, 860, 20], [612, 932, 16]], black, { ...o, length: 40 });
p.stroke({ brush: 'bristle', color: '#06050b', width: 12, mix: 0, dry: 0, rag: 0, cap: 'round', points: [[500, 953], [514, 951], [529, 950]] });   // shoes
p.stroke({ brush: 'bristle', color: '#06050b', width: 12, mix: 0, dry: 0, rag: 0, cap: 'round', points: [[600, 945], [616, 943], [631, 942]] });

// The jacket: his back, the skirts of it standing out a little, the shoulders.
solid(p, [[567, 762, 36], [568, 712, 36], [570, 668, 41]], white, { ...o, length: 40, width: 7 });
solid(p, [[531, 657, 21], [611, 651, 21]], white, o);
p.tryStroke({ brush: 'bristle', color: '#30324e', width: 5, opacity: 0.45, mix: 0.2, dry: 0.05, rag: 0.1, taper: [0.3, 0.3], points: [[569, 672], [568, 730], [567, 790]] });   // the seam down his back
for (const [x0, x1] of [[544, 538], [594, 600]]) p.tryStroke({ brush: 'bristle', color: '#34364e', width: 6, opacity: 0.4, mix: 0.2, dry: 0.05, rag: 0.1, taper: [0.4, 0.2], points: [[x0, 706], [(x0 + x1) / 2, 746], [x1, 790]] });   // folds

// The arm at his side, the fist shut.
solid(p, [[528, 660, 16], [508, 718, 13], [502, 774, 11.5]], white, o);
solid(p, [[500, 786, 9.5], [503, 798, 9]], skin, { ...o, length: 14 });

// The arm that points.
solid(p, [[610, 653, 16], [652, 620, 13.5], [692, 588, 11.5]], white, o);
solid(p, [[698, 583, 8.5], [712, 572, 7.5]], skin, { ...o, length: 14 });
p.stroke({ brush: 'bristle', color: '#eac4a8', width: 5.5, mix: 0, dry: 0, rag: 0, cap: 'round', points: [[710, 574], [722, 565], [733, 556]] });   // the finger

// His neck and head. Red hair, standing up in spikes.
solid(p, [[566, 642, 9], [567, 630, 9]], skin, { ...o, length: 14, edge: false });
solid(p, [[567, 602, 29], [568, 611, 28]], red, { ...o, length: 22 });
for (const [deg, len, w] of [[-160, 14, 12], [-128, 18, 13], [-98, 21, 14], [-70, 20, 14], [-42, 18, 13], [-14, 14, 12]]) {
  const a = deg * Math.PI / 180, bend = r.range(0.1, 0.34), at = (d, t) => [567 + Math.cos(a + bend * t) * d, 606 + Math.sin(a + bend * t) * d];
  const cool = Math.cos(a) < 0;                                        // the side toward the window
  p.tryStroke({ brush: 'bristle', color: mix(cool ? '#b04a48' : '#8a1c18', '#3a0a0e', r() * 0.5), width: w, taper: [0, 0.9], mix: 0, dry: 0, rag: 0, cap: 'round', points: [at(15, 0), at(15 + (len + 14) * 0.5, 0.5), at(29 + len, 1)] });
}
p.tryStroke({ brush: 'bristle', color: '#eac4a8', width: 7, mix: 0, dry: 0, rag: 0, cap: 'round', points: [[587, 612], [590, 621], [588, 630]] });   // his cheek and jaw, as he looks up at her
glint(p, [[584, 584], [594, 600], [596, 616]], () => mix('#ff9c40', '#ffd890', r()), { width: 4.4, dash: 14, gap: 6, opacity: 0.8, rng: r });       // her gold in his hair

p.save();
