// The two travelers, seen from behind as they come down the slope. Kuon is ahead: long black
// hair, the white ears and the long white tail of her people, white sleeves, a dark skirt, a
// rose sash. She has turned her head to look back, and points down to the village. Haku
// follows in a green robe with a blanket over his shoulders, leaning on a staff, tired
// already. The sun is on their left sides, and their shadows run long over the snow.
'use strict';
const { studio, open, SUNWARD, KUON, HAKU } = require('./scene');
const { mix, solid, glint } = studio;

const p = open('travelers');
const r = p.rng;
const o = { light: SUNWARD, turn: 0, width: 5, length: 22, vary: 0.06, dash: 18, gap: 8, edgeOpacity: 0.85 };
const place = (f) => { const s = f.h / 100; return (x, y, rad) => (rad == null ? [f.x + x * s, f.y + y * s] : [f.x + x * s, f.y + y * s, rad * s]); };
const K = place(KUON), M = place(HAKU);                                 // a figure is laid out 100 units tall
const mark = (a, b, w, color, extra = {}) => p.stroke({ brush: 'bristle', color, width: w, mix: 0, dry: 0, rag: 0, cap: 'round', ...extra, points: [a, b] });

const white = { shadow: '#6c7ab4', half: '#a0acd8', lit: '#fff2e4', rim: '#ffffff', bounce: '#8090c8' };
const navy = { shadow: '#141a3c', half: '#26305c', lit: '#6878b0', rim: '#ffe2c8', bounce: '#2a3870' };
const rose = { shadow: '#7a2848', half: '#c04c6c', lit: '#f79aa4', rim: '#ffe0d4' };
const hair = { shadow: '#0c0b16', half: '#1c1a2a', lit: '#5a546c', rim: '#ffd8b8', bounce: '#1c2444' };
const fur = { shadow: '#8794c8', half: '#bcc6e6', lit: '#fff6ec', rim: '#ffffff', bounce: '#a0aede' };
const green = { shadow: '#11241f', half: '#22483c', lit: '#62997c', rim: '#ffe6c4', bounce: '#1c3a4a' };
const grey = { shadow: '#1e2030', half: '#3a3c52', lit: '#8c867c', rim: '#ffe0c0', bounce: '#2a3050' };
const cream = { shadow: '#5c5e84', half: '#9492a8', lit: '#f4e4c8', rim: '#fff6e0', bounce: '#7078a8' };

// Their shadows, long over the snow, away from the sun.
for (const [f, len, w] of [[HAKU, 380, 30], [KUON, 330, 26]]) {
  p.stroke({ brush: 'bristle', color: '#4a5aa2', width: w, opacity: 0.62, mix: 0.3, dry: 0.05, rag: 0.3, taper: [0, 0.6], points: [[f.x - 4, f.y - 3], [f.x + len * 0.5, f.y - 3 - len * 0.05], [f.x + len, f.y - 3 - len * 0.1]] });
}

// ---------------------------------------------------------------- Kuon
mark(K(-6, -1.5), K(-5.5, -10.5), 7, '#241a20');                       // boots
mark(K(7, -1), K(6.5, -10), 7, '#241a20');
solid(p, [K(0, -52, 9), K(0.5, -34, 12.5), K(1, -16, 15.5)], navy, o);   // the skirt
solid(p, [K(0, -54, 8.5), K(0, -66, 9.5), K(0, -77, 9.5)], white, o);    // her back
solid(p, [K(-8, -55, 3.6), K(0, -53.5, 3.2), K(8, -55.5, 3.6)], rose, o);   // the sash, tied behind
solid(p, [K(-9.5, -76, 4), K(-13, -63, 5.2), K(-14.5, -51, 6.4)], white, o);   // the arm at her side, in its wide sleeve
mark(K(-19.5, -48.5), K(-10, -49.5), 5, '#26305c');                    // the dark band at its cuff
solid(p, [K(-0.5, -86, 7.5), K(0, -72, 6.4), K(0.8, -58, 5), K(1.5, -46, 3.8)], hair, o);   // her hair, down her back
mark(K(-3, -48.5), K(5.5, -48), 4.6, '#f0e8e8');                       // and the band that ties it
solid(p, [K(9.5, -76, 4), K(21, -73, 4.6), K(33, -68, 5.4)], white, o);   // the arm that points down to the village
mark(K(31, -74), K(34.5, -62.5), 5, '#26305c');
mark(K(35, -67.5), K(42, -65), 4.4, '#f0c8a8');                        // her hand
for (const [x0, y0, x1, y1] of [[-2.5, -90, -9.6, -100.4], [1.5, -90.5, 8.2, -101]]) {     // her ears: white and pointed. Her hair covers where they begin
  p.stroke({ brush: 'bristle', color: '#dcdaea', width: 9, taper: [0, 0.75], mix: 0, dry: 0, rag: 0, cap: 'round', points: [K(x0, y0), K((x0 + x1) / 2, (y0 + y1) / 2), K(x1, y1)] });
  p.tryStroke({ color: '#fffaf2', width: 4, opacity: 0.9, taper: [0, 0.6], points: [K(x0 - 3.4, y0 - 4.2), K(x1 - 0.6, y1 + 1.4)] });
}
solid(p, [K(-1, -87.5, 8), K(-1, -90, 8)], hair, { ...o, length: 14 });   // her head
mark(K(-8.2, -92), K(-7.6, -84.5), 5.5, '#f6d2b4');                    // her face, turned back toward him
// her tail: long, thick and white, held out behind her and curling up at the end
{
  const spine = [[1, -50, 4.5], [11, -38, 6.5], [24, -28, 8], [37, -25, 8.8], [47, -31, 8.8], [53, -41, 7.6]];
  solid(p, spine.map((q) => K(...q)), fur, { ...o, length: 26, edge: false });
  for (let k = 0; k < 26; k++) {                                        // the fur: short strokes that stand out from it all the way along
    const f = r.range(0.1, 1), i = Math.min(spine.length - 2, Math.floor(f * (spine.length - 1))), g = f * (spine.length - 1) - i;
    const x = spine[i][0] + (spine[i + 1][0] - spine[i][0]) * g, y = spine[i][1] + (spine[i + 1][1] - spine[i][1]) * g, rad = spine[i][2] + (spine[i + 1][2] - spine[i][2]) * g;
    const dx = spine[i + 1][0] - spine[i][0], dy = spine[i + 1][1] - spine[i][1], l = Math.hypot(dx, dy), up = r() < 0.5 ? 1 : -1;
    const nx = dy / l * up, ny = -dx / l * up, lean = 0.55, ox = nx + dx / l * lean, oy = ny + dy / l * lean, sunny = nx * SUNWARD[0] + ny * SUNWARD[1] > 0;
    p.tryStroke({ brush: 'bristle', color: sunny ? mix('#fff0e2', '#ffffff', r()) : mix('#8794c8', '#b4bee2', r()), width: 4.6, opacity: 0.9, taper: [0, 0.8], mix: 0.1, dry: 0, rag: 0.2, points: [K(x + nx * rad * 0.5, y + ny * rad * 0.5), K(x + nx * rad * 0.5 + ox * 7.4, y + ny * rad * 0.5 + oy * 7.4)] });
  }
}

// ---------------------------------------------------------------- Haku
solid(p, [M(-4, -40, 4.4), M(-5, -20, 4), M(-6, -3, 3.4)], grey, o);    // his legs, mid stride
solid(p, [M(4, -40, 4.4), M(6.5, -21, 4), M(8.5, -4, 3.4)], grey, o);
mark(M(-9.5, -1), M(-2, -1.5), 6.5, '#1c1820');
mark(M(5.5, -2), M(13, -2.6), 6.5, '#1c1820');
solid(p, [M(0, -44, 11), M(-0.5, -32, 12), M(0, -24, 11.5)], green, o); // the skirts of his robe
solid(p, [M(0, -46, 10.5), M(1, -60, 10.5), M(2, -74, 11)], green, o);  // his back, bent a little
mark(M(-10, -46), M(10.5, -45.5), 6, '#161a26');                       // his sash
p.stroke({ brush: 'bristle', color: '#2a1c1a', width: 5, mix: 0, dry: 0, rag: 0, cap: 'round', points: [M(-18.5, -96), M(-15.5, -48), M(-12.5, 1)] });   // the staff
glint(p, [M(-19.8, -96), M(-16.8, -48), M(-13.8, 0)], () => mix('#ffd2a8', '#fff0d8', r()), { width: 4, dash: 24, gap: 14, opacity: 0.7, rng: r });
solid(p, [M(-11, -73, 4), M(-15.5, -60, 4), M(-14.5, -49, 3.6)], green, o);   // the arm that holds it
mark(M(-17.6, -51), M(-12, -47.6), 4.6, '#eec4a4');                    // his hand on it
solid(p, [M(12.5, -73, 4), M(14.5, -59, 4), M(11.5, -49, 3.6)], green, o);
solid(p, [[M(-10.5, -76, 5), M(2, -80, 6), M(13.5, -76, 5)], [M(-10.5, -75, 4.6), M(-12.5, -63, 4.6)]], cream, o);   // the blanket over his shoulders
solid(p, [M(3, -86.5, 6.6), M(3.4, -89, 6.6)], hair, { ...o, length: 14 });   // his head: black hair, untidy
solid(p, [M(0.5, -92.5, 4.6), M(6.5, -91.5, 4.4)], hair, { ...o, length: 14, edge: false });   // untidy on top
mark(M(5.5, -84), M(10, -79), 5, '#0c0b16');                           // tied in a short tail
mark(M(-2.8, -88), M(-2.2, -81.5), 4.6, '#eec4a4');                    // his cheek and neck, in the sun

p.save();
