// Walpurgisnacht. She hangs head down. Highest is the great wheel that she has in place of
// legs, with smaller wheels beside it. Under the wheel is her wide skirt, which opens upward:
// dark blue, with white frills. Under that is her body, with her two long white sleeves out
// at each side; then her head, which is white and has no eyes, only a wide red mouth that
// laughs; and lowest of all the two horns of her cap. A ring of colors is behind her.
'use strict';
const { studio, open, WITCH, far } = require('./scene');
const { mix, clamp, smooth, solid, glint, arc, noise2 } = studio;

const p = open('witch');
const r = p.rng;
const X = WITCH.x, WAIST = WITCH.waist, HEM = 168, D = 0.2;
const nF = noise2(811);
const line = { brush: 'bristle', mix: 0.1, dry: 0.02, rag: 0.12, cap: 'round' };
const tint = (c, x, y) => far(c, x, y, D);

// The ring of colors behind her.
['#ff7a6c', '#ffb45c', '#fff08c', '#8ceca0', '#7cc4ff', '#c498ff'].forEach((c, i) => {
  const rr = 372 - i * 11, pts = arc(X, 210, rr, 0, 6.283, 70);
  glint(p, pts, () => tint(c, X, 210 + rr), { width: 6, dash: 150, gap: 50, opacity: 0.42, rng: r, brush: 'bristle' });
});

// A wheel: a ring with teeth on the outside of it, spokes, and a hub. It is of dark iron, a little lighter on the part of it that is toward her light.
function wheel(cx, cy, R, teeth, turn) {
  const iron = (a) => tint(mix(mix('#141c26', '#2a3846', r()), '#8ca4a8', clamp(Math.sin(a) * 0.45 + 0.05, 0, 0.5)), cx + Math.cos(a) * R, cy + Math.sin(a) * R);
  const stroke = { brush: 'bristle', mix: 0.1, dry: 0.03, rag: 0.15, cap: 'flat' }, w = Math.max(8, R * 0.06);
  for (let rr = R * 0.8; rr <= R * 0.965; rr += w * 0.75) { const piece = Math.max(0.3, 2.4 * w / rr); for (let a = turn; a < turn + 6.283; a += piece * 0.92) p.tryStroke({ ...stroke, color: iron(a + piece / 2), width: w, points: arc(cx, cy, rr, a, a + piece, 6) }); }
  const tw = 6.283 * R / teeth * 0.5, th = Math.max(6, tw / 2.15);
  for (let k = 0; k < teeth; k++) { const a = turn + k / teeth * 6.283; for (const rr of [R * 0.97 + th * 0.5, R * 0.97 + th * 1.4]) p.tryStroke({ ...stroke, color: iron(a), width: th, points: [[cx + Math.cos(a) * rr + Math.sin(a) * tw / 2, cy + Math.sin(a) * rr - Math.cos(a) * tw / 2], [cx + Math.cos(a) * rr - Math.sin(a) * tw / 2, cy + Math.sin(a) * rr + Math.cos(a) * tw / 2]] }); }
  for (let k = 0; k < 6; k++) { const a = turn + 0.3 + k / 6 * 6.283; p.tryStroke({ ...stroke, color: iron(a), width: Math.max(8, R * 0.085), points: [[cx + Math.cos(a) * R * 0.14, cy + Math.sin(a) * R * 0.14], [cx + Math.cos(a) * R * 0.5, cy + Math.sin(a) * R * 0.5], [cx + Math.cos(a) * R * 0.82, cy + Math.sin(a) * R * 0.82]] }); }
  studio.disc(p, cx, cy, R * 0.2, iron(1.5), Math.max(8, R * 0.07), { brush: 'bristle', mix: 0.1, dry: 0, rag: 0.1, cap: 'round' });
  p.tryStroke({ ...stroke, cap: 'round', color: tint('#0a0e14', cx, cy), width: Math.max(6, R * 0.05), points: arc(cx, cy, Math.max(R * 0.07, 7), 0, 6.283, 10) });
  for (let a = 0.5; a < 2.6; a += 0.34) p.tryStroke({ color: tint('#c8e0d8', cx, cy + R), width: 4.4, opacity: 0.6, points: arc(cx, cy, R * 0.79, a, a + 0.24, 5) });
}
wheel(X - 262, 28, 84, 14, 0.5);
wheel(X + 270, 40, 96, 16, 1.2);
wheel(X, 96, 196, 24, 0.2);

// Her skirt. It is a bell that opens upward: narrow at her waist, wide at its hem, which is under the wheel. Its folds go out from her waist.
{
  const up = (y) => clamp((WAIST - y) / (WAIST - HEM), 0, 1), halfW = (y) => 30 + 232 * Math.pow(up(y), 0.78);
  const hemAt = (x) => HEM + 9 * Math.sin((x - X) / 13) - 26 * Math.pow((x - X) / 262, 2);          // the hem is in scallops, and its two ends are higher than its middle
  const inside = (x, y) => y < WAIST + 4 && y > hemAt(x) && Math.abs(x - X) < halfW(y);
  const fan = (x, y) => Math.atan2(y - (WAIST + 16), x - X);
  const cloth = (x, y) => {
    const u = clamp((x - X) / halfW(y), -1, 1), fold = Math.sin(Math.atan2(x - X, WAIST + 40 - y) * 30 + 0.5) * 0.5 + (nF(x / 40, y / 60) - 0.5) * 0.6;
    let c = fold > 0 ? mix('#263f96', '#5c86dc', clamp(fold * 1.5, 0, 1)) : mix('#263f96', '#111c54', clamp(-fold * 1.6, 0, 1));
    c = mix(c, '#0e1746', smooth(0.5, 1, Math.abs(u)) * 0.45);                                    // it turns away at its two sides
    c = mix(c, '#c88470', smooth(0.5, 0, up(y)) * 0.16);                                          // the fires of the city, on the part of it that is lowest
    return tint(mix(c, '#dcecff', smooth(0.93, 1, Math.abs(u)) * 0.6), x, y);
  };
  const box = [X - 270, HEM - 40, X + 270, WAIST + 6];
  p.fill({ inside, bounds: box, width: 12, length: 64, spacing: 0.5, angle: (x, y) => fan(x, y) + r.range(-0.04, 0.04), color: cloth, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.15, dry: 0.03, rag: 0.15, cap: 'round' } });
  p.fill({ inside, bounds: box, width: 7, length: 40, spacing: 1, overlap: 0.7, angle: (x, y) => fan(x, y) + r.range(-0.07, 0.07), color: (x, y) => cloth(x + r.range(-3, 3), y), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.15, dry: 0.03, rag: 0.2, cap: 'round' } });
  // its frills: white, in rows. Each is a line of short curved dabs, like the edge of a shell; there are two rows at the hem and one half way down.
  const frill = (x, y, w) => {
    p.tryStroke({ ...line, color: tint('#7c8cc8', x, y), width: 5.5, opacity: 0.6, points: [[x - w * 1.05, y + w * 0.62], [x + w * 1.05, y + w * 0.62]] });   // the shade under it
    p.tryStroke({ ...line, color: tint(mix('#cfd9f4', '#ffffff', r()), x, y), width: w, points: [[x - w * 1.08, y + 4], [x, y - 4], [x + w * 1.08, y + 4]] });
  };
  for (let x = X - halfW(HEM) + 22; x < X + halfW(HEM) - 14; x += 26) frill(x, hemAt(x) + 22, 15);
  for (let x = X - halfW(HEM) + 8; x < X + halfW(HEM) - 4; x += 30) frill(x, hemAt(x) + 6, 18);
  for (let x = X - 122; x < X + 126; x += 21) frill(x, WAIST - (WAIST - HEM) * 0.47 - 14 * Math.pow((x - X) / 126, 2), 11);
}

// Her body, and her two arms. The sleeves are long and white, and wider at the wrist.
const blue = { shadow: '#131f5c', half: '#2a46a0', lit: '#648ee0', rim: '#e0ecff', bounce: '#5c3c6c' };
const white = { shadow: '#7c88bc', half: '#bcc6e6', lit: '#fbfcff', rim: '#ffffff', bounce: '#c0a09c' };
const o = { light: [-0.45, -0.6], turn: 0, width: 8, length: 34, vary: 0.05, dash: 26, gap: 9, edgeOpacity: 0.7 };
for (const s of [-1, 1]) {
  solid(p, [[X + s * 44, 398, 17], [X + s * 128, 404, 22], [X + s * 214, 420, 34]], white, { ...o, length: 40 });
  p.stroke({ ...line, cap: 'flat', color: tint('#2a46a0', X + s * 240, 426), width: 13, points: [[X + s * 236, 392], [X + s * 244, 426], [X + s * 238, 458]] });   // the blue band at the wrist
  for (let k = 0; k < 5; k++) p.tryStroke({ ...line, color: tint(mix('#c4d0f0', '#ffffff', r()), X + s * 254, 400 + k * 13), width: 10, points: [[X + s * 248, 396 + k * 13], [X + s * 262, 400 + k * 13]].map(([x, y], i) => [x + (i ? s * 3 : -s * 3), y]) });   // the frill of the cuff
  solid(p, [[X + s * 262, 426, 8], [X + s * 284, 432, 6]], white, { ...o, length: 14, width: 5.5 });                                             // her hand
}
solid(p, [[X, WAIST + 2, 30], [X, 372, 38], [X, 398, 44]], blue, { ...o, length: 36 });
p.stroke({ ...line, cap: 'flat', color: tint('#e8eefc', X, 366), width: 22, points: [[X + 2, WAIST + 6], [X + 2, 366], [X + 2, 402]] });                // the white down the front of it
for (let x = X - 46; x <= X + 46; x += 18) p.tryStroke({ ...line, color: tint(mix('#c4d0f0', '#ffffff', r()), x, 408), width: 12, points: [[x - 13, 403], [x, 411], [x + 13, 403]] });   // the frill at her neck
solid(p, [[X, 414, 12], [X, 424, 12]], white, { ...o, length: 14, edge: false });                                                                 // her neck

// Her head: white, round, with no eyes. She is head down, so her mouth is uppermost. It is wide and red, and she laughs.
solid(p, [[X, 462, 43], [X, 466, 43]], { shadow: '#8c94c4', half: '#ccd2ea', lit: '#fbf8f0', rim: '#ffffff', bounce: '#e0a890' }, { ...o, length: 30 });
p.stroke({ ...line, color: '#b81c2c', width: 9, points: arc(X, 470, 27, Math.PI + 0.3, 2 * Math.PI - 0.3, 12) });
p.stroke({ ...line, color: '#3a0a16', width: 6, points: arc(X, 474, 22, Math.PI + 0.45, 2 * Math.PI - 0.45, 10) });
p.tryStroke({ color: '#fff4ec', width: 4, opacity: 0.9, points: arc(X, 472, 24.5, Math.PI + 0.55, 2 * Math.PI - 0.55, 8) });                     // her teeth

// Her cap: two long horns that hang from her head and turn up at their ends, white, with bands of blue, and a ball at the end of each.
for (const s of [-1, 1]) {
  solid(p, [[X + s * 18, 496, 17], [X + s * 58, 532, 14], [X + s * 96, 566, 9], [X + s * 122, 560, 6]], white, { ...o, length: 26 });
  for (const [t, w] of [[0.2, 30], [0.42, 24], [0.62, 18]]) { const x = X + s * (18 + 100 * t), y = 496 + 78 * t; p.tryStroke({ ...line, cap: 'flat', color: tint('#2a46a0', x, y), width: 7, points: [[x + s * w * 0.42, y - w * 0.45], [x - s * w * 0.42, y + w * 0.45]] }); }
  studio.disc(p, X + s * 130, 556, 10.5, tint('#ffd24c', X + s * 130, 556), 6.5, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round' });
}
p.stroke({ ...line, cap: 'flat', color: tint('#2a46a0', X, 498), width: 14, points: [[X - 34, 492], [X, 502], [X + 34, 492]] });                         // the band of the cap, across her brow

// Streamers: long thin strips of color that hang from the two ends of the hem and go with the storm.
for (const s of [-1, 1]) {
  ['#ff8c7c', '#fff08c', '#8ceca0', '#7cc4ff'].forEach((c, i) => {
    const x0 = X + s * (250 - i * 8), y0 = 150 + i * 6, sway = 40 + i * 26;
    p.tryStroke({ ...line, color: tint(c, x0, y0 + 140), width: 6, opacity: 0.7, taper: [0, 0.7], points: [[x0, y0], [x0 + s * sway * 0.6, y0 + 90], [x0 + s * sway * 0.2 - 30, y0 + 190], [x0 + s * sway - 30, y0 + 280 + i * 20]] });
  });
}

p.save();
