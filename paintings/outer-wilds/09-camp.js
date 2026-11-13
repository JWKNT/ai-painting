// The camp on the cliff: the ship on its three legs, a traveler on a log roasting a
// marshmallow, and the fire between them. Two lights work on everything here: the red sun
// behind, which edges the tops and far sides, and the fire, which warms whatever faces it.
'use strict';
const { studio, open, SUN, FIRE, loopDisc, layIn, clamp, smooth, nB } = require('./scene');
const { arc, mix, solid, form, glint } = studio;

const p = open('camp');
const r = p.rng;
const DARK = '#14111f', DARKER = '#0d0b16';
const SUNLIGHT = { at: [SUN.x, SUN.y] }, FIRELIGHT = { at: [FIRE.x, FIRE.y - 24] };
const sunEdge = () => mix('#e07a34', '#ffb866', r()), fireEdge = () => mix('#c8642a', '#ff9c44', r());

// ---------------------------------------------------------------- shadows thrown by the fire
for (const [x0, y0, x1, y1, w] of [[520, 908, 330, 930, 30], [470, 918, 250, 952, 36], [760, 910, 960, 926, 20], [840, 914, 1000, 934, 18]]) {
  p.stroke({ brush: 'soft', color: '#07070e', width: w, opacity: 0.5, taper: [0, 0.6], points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2 + 3], [x1, y1]] });
}

// ---------------------------------------------------------------- the ship
{
  const hull = { shadow: '#0d0a14', half: '#1a1420', lit: '#553024', rim: '#ff9c48', bounce: '#20182a' };
  const sun = { light: SUNLIGHT, turn: 0.45, width: 5, length: 26, vary: 0.06 };
  // legs: one each side and one toward us, with pads for feet
  const legs = [[[796, 800], [752, 898]], [[884, 800], [926, 898]], [[838, 806], [836, 904]]];
  for (const [a, b] of [legs[1], legs[0], legs[2]]) {
    p.line(a[0], a[1], b[0], b[1], { brush: 'bristle', color: '#120e19', width: 8, mix: 0, dry: 0, rag: 0, cap: 'round', streak: 0.15 });
    p.line(b[0] - 14, b[1] + 1, b[0] + 14, b[1] + 1, { brush: 'bristle', color: DARKER, width: 7, mix: 0, dry: 0, rag: 0, cap: 'round' });
  }
  p.line(770, 858, 836, 838, { brush: 'bristle', color: '#120e19', width: 4.6, mix: 0, dry: 0, rag: 0, cap: 'round' });   // braces between the legs
  p.line(908, 858, 838, 838, { brush: 'bristle', color: '#120e19', width: 4.6, mix: 0, dry: 0, rag: 0, cap: 'round' });

  // hull: a squat cabin of dark planks, its top and far side edged by the sun
  for (const y of [722, 748, 772, 788]) p.stroke({ brush: 'bristle', color: hull.shadow, width: 34, mix: 0, dry: 0, rag: 0, cap: 'round', streak: 0.2, jitter: 0.5, points: [[798, y], [840, y + r.range(-1.5, 1.5)], [882, y]] });
  solid(p, [[[800, 724, 22], [880, 724, 22]], [[800, 785, 22], [880, 785, 22]], [[800, 724, 22], [800, 785, 22]], [[880, 724, 22], [880, 785, 22]], [[820, 754, 40], [860, 754, 40]]], hull, { ...sun, flow: (x, y) => (nB(x / 40, y / 12) - 0.5) * 0.12, length: 36, base: false });
  for (const x of [812, 836, 860, 882]) p.line(x, 708, x + 1, 800, { brush: 'bristle', color: '#07060c', width: 4.4, opacity: 0.4, mix: 0.2, dry: 0.1, rag: 0.1 });   // planking
  solid(p, [[808, 698, 8], [872, 697, 8]], hull, sun);                                              // the roof housing
  solid(p, [[906, 738, 11.5], [906, 784, 11.5]], hull, sun);                                        // a thruster pod
  p.line(892, 760, 908, 760, { brush: 'bristle', color: hull.shadow, width: 8, mix: 0, dry: 0, rag: 0, cap: 'round' });
  p.line(900, 792, 912, 806, { brush: 'bristle', color: DARKER, width: 6, mix: 0, dry: 0, rag: 0, cap: 'round' });   // its nozzle
  form(p, [[868, 692], [871, 666], [874, 640]], 4.4, { dark: '#120e19', light: sunEdge, toward: SUNLIGHT, rag: 0, lightOpacity: 0.6, dash: 20, gap: 10 });   // antenna
  p.line(852, 690, 852, 668, { brush: 'bristle', color: '#120e19', width: 4.6, mix: 0, dry: 0, rag: 0, cap: 'round' });

  // cockpit: a round canopy at the front. The lamp inside lights the glass from below, and
  // the upper part of it holds a little of the night sky.
  const cx = 786, cy = 756;
  p.stroke({ brush: 'soft', color: '#ff9a40', width: 36, opacity: 0.2, points: arc(cx, cy, 42, 0.3, 6.583, 20) });
  loopDisc(p, cx, cy, 39, '#110d18', 13);
  const glass = (x, y) => {
    const rho = Math.hypot(x - cx, y - cy - 7) / 31, up = clamp((cy - 4 - y) / 26, 0, 1);
    return mix(mix('#ffcc70', '#b8662a', smooth(0.05, 1, rho)), '#3c2a4c', up * 0.6);
  };
  layIn(p, { x: cx, y: cy, r: 28 }, glass, 8);
  p.fill({ inside: (x, y) => Math.hypot(x - cx, y - cy) < 24, bounds: [cx - 28, cy - 28, cx + 28, cy + 28], width: 6, length: 20, spacing: 0.6, angle: (x, y) => Math.atan2(y - cy - 7, x - cx) + 1.571, color: (x, y) => glass(x + r.range(-3, 3), y + r.range(-3, 3)), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.3, dry: 0, rag: 0.1 } });
  p.line(cx - 19, cy + 17, cx + 19, cy + 16, { brush: 'bristle', color: '#231720', width: 11, opacity: 0.92, mix: 0.15, dry: 0, rag: 0, cap: 'round' });   // the console, dark against the lamp
  p.line(cx + 9, cy + 10, cx + 10, cy - 7, { brush: 'bristle', color: '#231720', width: 7, opacity: 0.88, mix: 0.15, dry: 0, rag: 0, cap: 'round' });       // the back of the pilot's seat
  p.tryStroke({ brush: 'bristle', color: '#9a94c0', width: 5, opacity: 0.32, mix: 0.3, dry: 0.1, rag: 0.2, taper: [0.4, 0.4], points: arc(cx - 1, cy - 1, 19, 3.3, 4.7, 7) });   // the sky in the glass
  p.stroke({ brush: 'bristle', color: '#110d18', width: 5, mix: 0, dry: 0, rag: 0, cap: 'round', points: arc(cx, cy, 29.5, 0, 6.283, 22) });
  glint(p, arc(cx, cy, 37.5, -2.3, -0.75, 10), sunEdge, { width: 4, dash: 22, gap: 8, opacity: 0.75 });

  // a small red beacon at the tip of the antenna
  p.stroke({ brush: 'soft', color: '#ff4a2a', width: 14, opacity: 0.5, points: [[859, 641], [890, 636]] });
  p.line(868, 640, 880.5, 638, { color: '#ff7a54', width: 4 });
  // the sun down the far leg
  glint(p, [[929, 806], [933, 850], [937, 890]], sunEdge, { width: 4, dash: 24, gap: 14, opacity: 0.55 });
}

// ---------------------------------------------------------------- the log and the traveler
{
  const suit = { shadow: '#100d17', half: '#231820', lit: '#8a4424', rim: '#ffa650', bounce: '#1a1626' };
  const fire = { light: FIRELIGHT, turn: 0.4, width: 5, length: 20, vary: 0.06 };
  // firelit haze behind, so the figure stands out from the valley
  p.stroke({ brush: 'soft', color: '#b06a5c', width: 84, opacity: 0.24, points: [[372, 836], [470, 826], [572, 832]] });
  p.stroke({ brush: 'soft', color: '#c8805e', width: 50, opacity: 0.2, points: [[430, 812], [482, 800], [540, 812]] });
  form(p, [[434, 893], [486, 891], [540, 889]], 21, { dark: '#110d17', mid: '#2c1a1c', light: fireEdge, toward: [0.3, -1], rag: 0.05, midOpacity: 0.7, lightOpacity: 0.7, dash: 30, gap: 12 });   // the log
  p.line(430, 884, 436, 902, { brush: 'bristle', color: '#241a1e', width: 7, opacity: 0.9, mix: 0.1, dry: 0, rag: 0 });   // its sawn end
  loopDisc(p, 410, 893, 12, '#14121f', 8);                                                          // the helmet, set down beside it
  p.tryStroke({ brush: 'bristle', color: '#5a6a9a', width: 4.4, opacity: 0.5, mix: 0.2, dry: 0, rag: 0, taper: [0.3, 0.3], points: arc(410, 893, 8, -2.6, -0.5, 6) });

  solid(p, [[465, 872, 7.5], [462, 834, 7.5]], suit, fire);                                         // pack
  solid(p, [[486, 876, 12], [483, 852, 12.5], [478, 828, 11]], suit, fire);                         // body, leaning back
  solid(p, [[487, 879, 7], [521, 872, 6.5]], suit, fire);                                           // thigh
  solid(p, [[522, 873, 5.6], [530, 898, 5.2]], suit, fire);                                         // shin
  p.line(526, 900, 545, 900, { brush: 'bristle', color: DARKER, width: 8, mix: 0, dry: 0, rag: 0, cap: 'round' });   // boot
  solid(p, [[480, 834, 5.4], [498, 853, 5], [519, 846, 4.6]], suit, fire);                          // arm
  p.line(475, 815, 483, 830, { brush: 'bristle', color: suit.shadow, width: 8, mix: 0, dry: 0, rag: 0, cap: 'round' });   // neck and collar
  // the head, tipped back to look up: a Hearthian's blue skin, warmed by the fire on the side that faces it
  loopDisc(p, 481, 803, 14, '#17172a', 8);
  p.tryStroke({ brush: 'bristle', color: '#6878a8', width: 6, opacity: 0.55, mix: 0.2, dry: 0, rag: 0, cap: 'round', taper: [0.3, 0.3], points: arc(481, 803, 8.5, -0.75, 0.95, 6) });   // the blue of a Hearthian's face
  glint(p, arc(481, 803, 11.6, -0.7, 0.95, 7), () => mix('#d08a5c', '#f0b080', r()), { width: 4.2, dash: 14, gap: 4, opacity: 0.8 });                                              // firelight along it
  p.stroke({ brush: 'bristle', color: '#17172a', width: 8.5, taper: [0, 0.85], mix: 0, dry: 0, rag: 0, cap: 'round', points: [[472, 800], [458, 798.5], [446, 804]] }); // a long ear, swept back
  p.stroke({ brush: 'bristle', color: '#17172a', width: 6, taper: [0, 0.8], mix: 0, dry: 0, rag: 0, cap: 'round', points: [[489, 797], [498, 795], [505.5, 797.5]] });  // the tip of the other
  glint(p, arc(481, 803, 12.5, -2.6, -1.1, 6), sunEdge, { width: 4, dash: 14, gap: 6, opacity: 0.5 });   // the sun on the crown of the head

  // the stick, and the marshmallow at the end of it
  p.line(517, 846, 592, 838, { brush: 'bristle', color: '#2a1c18', width: 4.4, mix: 0, dry: 0, rag: 0, cap: 'round' });
  p.line(586, 838.5, 600.2, 837, { brush: 'bristle', color: '#ffeccc', width: 7, mix: 0, dry: 0, rag: 0, cap: 'round' });
  p.line(588, 841.6, 600.6, 840, { brush: 'bristle', color: '#e8a860', width: 4.5, opacity: 0.7, mix: 0.2, dry: 0, rag: 0 });
}

// ---------------------------------------------------------------- the fire
{
  const { x, y } = FIRE;
  // ring of stones, then the logs laid across each other
  for (const [dx, dy, w] of [[-34, 2, 10], [-22, 9, 9], [-4, 12, 10], [16, 10, 9], [32, 3, 10], [38, -6, 8], [-40, -6, 8]]) {
    p.line(x + dx - w * 1.05, y + dy, x + dx + w * 1.05, y + dy + r.range(-1.5, 1.5), { brush: 'bristle', color: r.pick(['#1b1722', '#231b24', '#15121c']), width: w, mix: 0, dry: 0, rag: 0, cap: 'round' });
    p.tryStroke({ color: fireEdge(), width: 4, opacity: 0.45, points: [[x + dx - 6.3 - Math.sign(dx) * 2, y + dy - w * 0.42], [x + dx + 6.3 - Math.sign(dx) * 2, y + dy - w * 0.42]] });   // the fire on the stones' inner sides
  }
  p.line(x - 26, y + 1, x + 22, y - 9, { brush: 'bristle', color: '#24120f', width: 9, mix: 0, dry: 0, rag: 0.05 });
  p.line(x - 20, y - 10, x + 27, y + 1, { brush: 'bristle', color: '#1c0f0e', width: 9, mix: 0, dry: 0, rag: 0.05 });
  p.line(x - 8, y + 3, x + 6, y - 16, { brush: 'bristle', color: '#2a1510', width: 8, mix: 0, dry: 0, rag: 0.05 });
  p.line(x - 18, y - 3, x + 14, y - 8, { color: '#ff6a1c', width: 4, opacity: 0.9 });              // embers
  p.line(x - 10, y - 9, x + 18, y - 2, { color: '#ffa53a', width: 4, opacity: 0.8 });

  // light spreading from it
  // (a soft brush drawn through the fire: wide and faint first, then tighter and brighter)
  for (const [w, color, o, lift] of [[210, '#e8621f', 0.1, 30], [146, '#ff7a24', 0.15, 26], [90, '#ff9230', 0.22, 24], [60, '#ffa53c', 0.3, 22]]) {
    p.stroke({ brush: 'soft', color, width: w, opacity: o, points: [[x - w * 1.03, y - lift + 6], [x, y - lift - 6], [x + w * 1.03, y - lift + 6]] });
  }
  p.stroke({ brush: 'soft', color: '#ff9a38', width: 56, opacity: 0.22, points: [[x - 2, y + 16], [x + 4, y - 50], [x + 14, y - 104]] });

  // flames: many small tongues, each one stroke. The outer ones are long, thin and red, and
  // they lean in as they rise; toward the heart they are short, broad and nearly white.
  const tongues = [];
  for (let k = 0; k < 54; k++) { const u = r.range(-1, 1); tongues.push({ u, cool: clamp(Math.abs(u) + r.range(-0.25, 0.25), 0, 1), sway: r.range(-0.7, 0.7) }); }
  tongues.sort((a, b) => b.cool - a.cool);
  for (const t of tongues) {
    const heat = 1 - t.cool;
    const color = heat > 0.72 ? mix('#ffd466', '#fff2b8', (heat - 0.72) / 0.28) : heat > 0.38 ? mix('#ff8c20', '#ffd466', (heat - 0.38) / 0.34) : mix('#b8301a', '#ff8c20', heat / 0.38);
    const h = (30 + 56 * (1 - t.u * t.u)) * (1 - 0.5 * heat) * r.range(0.75, 1.15), w = Math.max(4.6, (5 + 6.5 * heat) * r.range(0.8, 1.15)), bx = x + 3 + t.u * 23 * (1 - 0.3 * heat), by = y - 4 - r.range(0, 7) - 6 * heat;
    const pts = [];
    for (let i = 0; i <= 5; i++) { const f = i / 5; pts.push([bx + Math.sin(f * 3.2 + t.sway * 5) * 4.5 * f + t.sway * 9 * f * f - t.u * 10 * f, by - h * f]); }
    p.tryStroke({ brush: 'bristle', color, width: w, opacity: 0.6 + 0.35 * heat, mix: 0.2, dry: 0, rag: 0.15, streak: 0.3, taper: [0, 1], cap: 'round', points: pts });
  }

  // smoke lifting off and leaning with the air
  for (const [dx, dy, w, o] of [[4, -90, 34, 0.12], [16, -150, 46, 0.1], [36, -215, 60, 0.08]]) {
    p.stroke({ brush: 'soft', color: '#8a6a7a', width: w, opacity: o, points: [[x + dx - 8, y + dy + 40], [x + dx, y + dy], [x + dx + 16, y + dy - 44], [x + dx + 40, y + dy - 80]] });
  }
}

// ---------------------------------------------------------------- firelight on what faces it
{
  // the ground by the fire
  for (const [x0, x1, yy, o] of [[556, 590, 912, 0.55], [630, 676, 912, 0.55], [566, 660, 921, 0.4], [520, 560, 906, 0.4], [668, 720, 905, 0.35]]) {
    p.stroke({ brush: 'bristle', color: mix('#d8782c', '#ffab4c', r()), width: 8, opacity: o, mix: 0.3, points: [[x0, yy], [(x0 + x1) / 2, yy + 1], [x1, yy]] });
  }
  // the ship: the near legs, the belly, the underside of the canopy
  glint(p, [[748, 890], [770, 842], [791, 804]], fireEdge, { width: 4, dash: 26, gap: 10, opacity: 0.7 });
  glint(p, [[832, 896], [833.5, 850], [834.5, 812]], fireEdge, { width: 4, dash: 24, gap: 14, opacity: 0.5 });
  glint(p, [[797, 806], [838, 809], [880, 806]], () => mix('#8a4422', '#c06a30', r()), { width: 4.6, dash: 26, gap: 12, opacity: 0.55 });
  glint(p, arc(786, 756, 37, 1.3, 2.9, 8), fireEdge, { width: 4.2, dash: 20, gap: 8, opacity: 0.6 });
  glint(p, [[740, 900], [752, 903], [764, 901]], fireEdge, { width: 4, dash: 20, gap: 4, opacity: 0.6 });
}

// ---------------------------------------------------------------- sparks going up
for (let k = 0; k < 22; k++) {
  const h = r.range(40, 260), drift = r.range(-26, 70) * (h / 260), x = FIRE.x + r.range(-10, 14) + drift, y = FIRE.y - 40 - h;
  const a = -1.57 + r.range(-0.7, 0.9), len = r.range(12.4, 16);
  p.line(x, y, x + Math.cos(a) * len, y + Math.sin(a) * len, { color: r.pick(['#ffd27a', '#ffb048', '#ff8a2c', '#ffe6a0']), width: 4, opacity: clamp(1.05 - h / 300, 0.25, 1) });
}

p.save();
