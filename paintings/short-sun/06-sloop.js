// The sloop: a small boat with one mast, running before the wind toward the right. The sun
// is beyond her, so her old patched sails are lit through and glow, and her hull is dark.
// Horn sits at the tiller in the stern. Seawrack stands in the bow, holding to the forestay
// with her one arm, and the wind carries her gold hair out ahead of her. Babbie, the hus,
// lies on the deck between them. A lantern hangs at the stern.
'use strict';
const { studio, open, MAST, nA } = require('./scene');
const { mix, clamp, glint } = studio;

const p = open('sloop');
const r = p.rng;
const { x: mx, foot, top } = MAST;
const B = (dx, dy) => [mx + dx, foot + dy];                             // a place on the boat, from the foot of the mast
const wood = { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.08, cap: 'round', streak: 0.3, jitter: 0.4 };
const line = (a, b, w, color, extra = {}) => p.tryStroke({ ...wood, ...extra, color, width: w, points: [B(...a), B(...b)] });
const warm = () => mix('#ff9c50', '#ffe0a0', r());

// Herself in the water: the dark of the hull and the glow of the sails, broken by the waves.
for (let k = 0; k < 9; k++) {
  const y = 32 + k * 9, half = 116 - k * 9;
  p.tryStroke({ brush: 'bristle', color: '#04101a', width: 9, opacity: 0.55 - k * 0.05, mix: 0.3, dry: 0.15, rag: 0.5, taper: [0.3, 0.3], points: [B(-half + r.range(-10, 10) + 6, y), B(6, y + 1), B(half + r.range(-10, 10) + 6, y)] });
}
for (let k = 0; k < 12; k++) {
  const y = 44 + k * 12 + r.range(-3, 3), x = r.range(-70, 80), len = r.range(26, 60);
  p.tryStroke({ brush: 'bristle', color: mix('#c87c44', '#ffcf86', r()), width: r.range(5, 8), opacity: 0.4 - k * 0.025, mix: 0.3, dry: 0.15, rag: 0.5, taper: [0.4, 0.4], points: [B(x - len / 2, y), B(x, y - 1), B(x + len / 2, y)] });
}

// The wake behind her: two lines of broken foam that spread as they fall astern. And the wave
// her bow makes: a small curl of white at the stem, and foam drawn back along her side.
for (const spread of [-0.03, 0.09]) {
  for (let k = 0; k < 9; k++) {
    const x0 = -128 - k * 46 + r.range(-8, 8), y0 = 30 + (x0 + 128) * -spread + r.range(-2, 2), len = r.range(26, 48);
    p.tryStroke({ brush: 'dry', color: mix('#7c98b8', '#c4d4e8', r()), width: r.range(4.6, 6.5), opacity: 0.45 - k * 0.04, load: 0, dry: 0.6, rag: 0.7, points: [B(x0, y0), B(x0 - len, y0 + len * spread)] });
  }
}
for (const [x0, x1, y, w, o] of [[126, 96, 27, 7, 0.8], [104, 60, 31, 6, 0.6], [140, 112, 33, 5.5, 0.6], [66, 24, 33, 5, 0.4], [122, 96, 38, 5, 0.4]]) {
  p.tryStroke({ brush: 'dry', color: mix('#ffe2c0', '#ffffff', r()), width: w, opacity: o, load: 0, dry: 0.45, rag: 0.7, points: [B(x0, y), B((x0 + x1) / 2, y - 2), B(x1, y + 1)] });
}

// The hull: three strakes of dark planking, the top one lighter, and the stem rising at the bow.
const sheer = (t) => [-124 + 250 * t, -6 + 20 * Math.sin(Math.PI * t) * 0.5 - 16 * t * t + 4 * (1 - t)];                // the line of her deck, from stern to bow
const keel = (t) => [-112 + 218 * t, 26 - 3 * Math.sin(Math.PI * t)];
const strake = (k, color, w) => { const pts = []; for (let i = 0; i <= 6; i++) { const t = i / 6, a = sheer(t), b = keel(t); pts.push(B(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k)); } p.stroke({ ...wood, color, width: w, points: pts }); };
strake(0.82, '#0a0c14', 13);
strake(0.5, '#141018', 13);
strake(0.18, '#2a1c1c', 12);
{ const pts = []; for (let i = 0; i <= 6; i++) pts.push(B(...sheer(i / 6))); p.stroke({ ...wood, color: '#4a3024', width: 6, points: pts }); glint(p, pts.slice(3).map(([x, y]) => [x, y - 2.5]), warm, { width: 4, dash: 30, gap: 10, opacity: 0.8, rng: r }); }   // the gunwale, and the sun along its forward part
p.stroke({ ...wood, color: '#1c1418', width: 8, points: [B(...sheer(1)), B(118, 4), B(...keel(1))] });                   // the stem
glint(p, [B(128, -18), B(121, 4), B(110, 22)], warm, { width: 4, dash: 18, gap: 6, opacity: 0.9, rng: r });

// Mast, boom and stays.
line([0, 2], [0, top - foot], 6, '#1a1210');
line([0, -28], [-116, -38], 5, '#1a1210');                               // the boom
for (const [a, b] of [[[0, top - foot + 4], [-122, -8]], [[0, top - foot + 4], [126, -18]], [[0, top - foot + 40], [-40, -6]], [[0, top - foot + 40], [40, -6]]]) line(a, b, 4, '#1a1210', { opacity: 0.6, brush: 'round' });   // backstay, forestay, shrouds

// A sail: a three-cornered piece of old canvas, painted in strips that run down it, bright
// where the sun comes through it and dull at its seams and patches.
function sail(a, b, c, glowAt) {
  const inside = (x, y) => { const s = (q, u, v) => (q[0] - v[0]) * (u[1] - v[1]) - (u[0] - v[0]) * (q[1] - v[1]); const q = [x, y], d1 = s(q, a, b), d2 = s(q, b, c), d3 = s(q, c, a); return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0)); };
  const x0 = Math.min(a[0], b[0], c[0]), x1 = Math.max(a[0], b[0], c[0]), y0 = Math.min(a[1], b[1], c[1]), y1 = Math.max(a[1], b[1], c[1]);
  const tone = (x, y) => {
    const g = clamp(1 - Math.hypot(x - glowAt[0], y - glowAt[1]) / 190, 0, 1), seam = Math.abs(((x - x0) / 26) % 1 - 0.5) < 0.09 ? 0.3 : 0;
    return mix(mix(mix('#8a5a4a', '#d89a5c', nA(x / 30, y / 60)), '#ffdc96', g * 0.85), '#5c3c38', seam);
  };
  p.fill({ inside, bounds: [x0, y0, x1, y1], width: 12, length: 90, spacing: 0.45, angle: () => Math.PI / 2 + 0.06, color: tone, stroke: { brush: 'bristle', opacity: 0.96, mix: 0.1, dry: 0.04, rag: 0.15, streak: 0.35, jitter: 0.5 } });
  p.fill({ inside, bounds: [x0, y0, x1, y1], width: 6, length: 50, spacing: 0.9, overlap: 0.7, angle: () => Math.PI / 2 + 0.06, color: (x, y) => tone(x + r.range(-4, 4), y + r.range(-6, 6)), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.1, rag: 0.15 } });
  for (const [u, v] of [[a, b], [b, c], [c, a]]) p.tryStroke({ ...wood, color: '#6c4438', width: 4.6, opacity: 0.8, points: [u, [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2], v] });   // its bound edges
}
const mainTop = B(-3, top - foot + 8), mainTack = B(-3, -30), mainClew = B(-112, -40);
sail(mainTop, mainTack, mainClew, B(-20, -120));
for (const [x, y, w, h] of [[-52, -70, 22, 26], [-30, -150, 16, 20]]) for (let i = 0; i < 2; i++) p.tryStroke({ ...wood, cap: 'flat', color: mix('#6c4a40', '#9c6c4c', r()), width: w / 2 + 1, opacity: 0.85, points: [B(x + (i - 0.5) * w / 2, y), B(x + (i - 0.5) * w / 2, y + h)] });   // patches
const jibTop = B(3, top - foot + 30), jibTack = B(124, -20), jibClew = B(12, -24);
sail(jibTop, jibClew, jibTack, B(60, -80));
glint(p, [jibTop, [(jibTop[0] + jibTack[0]) / 2, (jibTop[1] + jibTack[1]) / 2], jibTack], warm, { width: 4.4, dash: 40, gap: 10, opacity: 0.9, rng: r });   // the sun down the edge of the jib
glint(p, [mainTop, B(-3, -130), mainTack].map(([x, y]) => [x - 5, y]), warm, { width: 4, dash: 34, gap: 16, opacity: 0.6, rng: r });
p.tryStroke({ ...wood, color: '#c8382c', width: 6, taper: [0, 0.7], points: [B(0, top - foot + 2), B(16, top - foot - 3), B(34, top - foot + 1)] });       // a pennant at the masthead, streaming forward

// The lantern at the stern.
p.stroke({ brush: 'soft', color: '#ff9a3a', width: 40, opacity: 0.3, points: [B(-164, -30), B(-124, -34), B(-84, -30)] });
p.stroke({ brush: 'soft', color: '#ffc060', width: 18, opacity: 0.55, points: [B(-143, -31), B(-124, -33), B(-105, -31)] });
line([-124, -8], [-124, -40], 4.2, '#1a1210', { brush: 'round' });       // its post
line([-124, -26], [-124, -39], 6, '#ffe6a0');

// Babbie: a low heavy animal, dark, with a big head held down and a pale tusk.
line([-70, -9], [-44, -12], 13, '#17111a');
line([-58, -16], [-40, -16], 9, '#17111a');
line([-44, -13], [-29, -9], 10, '#1f161c');
line([-31, -7], [-18.8, -9.4], 4, '#d8cdb4', { brush: 'round', opacity: 0.9 });
// Horn: sitting in the stern, one hand on the tiller, his face to the bow.
line([-112, -8], [-126, -2], 4.4, '#2a1c14', { brush: 'round' });         // the tiller
line([-98, -8], [-96, -28], 10, '#1c2030');                               // his body
line([-96, -24], [-110, -10], 5, '#1c2030');                              // his arm, to the tiller
line([-95, -30], [-94, -44], 7, '#2c2420');                               // his head: dark hair, going grey
p.tryStroke({ color: '#d8a47c', width: 4, opacity: 0.9, points: [B(-91, -42), B(-90.4, -29.6)] });   // his face, in the light
// Seawrack: standing in the bow behind the gunwale, slight, in a pale shift. One arm holds
// the stay. Her hair is gold, and the wind carries it forward.
line([90, -16], [90, -40], 9, '#8a7c88');                                 // the shift, in shadow on this side
line([93, -18], [93, -38], 4.2, '#ffe6c0', { brush: 'round', opacity: 0.85 });   // and the sun down the side that faces it
line([90, -38], [91, -53], 7, '#a8846c');                                 // shoulders and neck
line([93, -47], [103, -62], 4.6, '#d8a888');                              // the arm that holds on
line([90.6, -52], [91, -66], 7, '#c89c7c');                               // her head
for (const [a, b, c2, w, col] of [[[87, -66], [97, -68], [108, -61], 6.5, '#d8a030'], [[88, -61], [100, -60], [112, -52], 5.5, '#e8b844'], [[87, -58], [96, -53], [103, -44], 5, '#c89028']]) {   // her hair
  p.tryStroke({ ...wood, color: col, width: w, taper: [0, 0.75], points: [B(...a), B(...b), B(...c2)] });
}
glint(p, [B(90, -69), B(100, -70), B(110, -63)], () => '#fff2b0', { width: 4, dash: 13, gap: 5, opacity: 0.9, rng: r });

p.save();
