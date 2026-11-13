// The camp on the cliff: the ship on its three legs, a traveler on a log roasting a
// marshmallow, and the fire between them.
'use strict';
const { studio, open, FIRE, cliffTop, loopDisc, clamp } = require('./scene');
const { arc, mix } = studio;

const p = open('camp');
const r = p.rng;
const DARK = '#14111f', DARKER = '#0d0b16';
const fit = (stroke, widths) => widths.some((width) => p.tryStroke({ ...stroke, width }));

// ---------------------------------------------------------------- shadows thrown by the fire
for (const [x0, y0, x1, y1, w] of [[520, 908, 330, 930, 30], [470, 918, 250, 952, 36], [760, 910, 960, 926, 20], [840, 914, 1000, 934, 18]]) {
  p.stroke({ brush: 'soft', color: '#07070e', width: w, opacity: 0.5, taper: [0, 0.6], points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2 + 3], [x1, y1]] });
}

// ---------------------------------------------------------------- the ship
{
  const hull = '#17131f', wood = '#211926';
  // legs: one each side and one toward us, with pads for feet
  const legs = [[[796, 800], [752, 898]], [[884, 800], [926, 898]], [[838, 806], [836, 904]]];
  for (const [a, b] of [legs[1], legs[0], legs[2]]) {
    p.line(a[0], a[1], b[0], b[1], { brush: 'flat', color: hull, width: 8, rag: 0, jitter: 0.2, streak: 0.1 });
    p.line(b[0] - 14, b[1] + 1, b[0] + 14, b[1] + 1, { brush: 'flat', color: DARKER, width: 7, rag: 0, cap: 'round' });
  }
  p.line(770, 858, 836, 838, { color: hull, width: 4.5 });   // braces between the legs
  p.line(908, 858, 838, 838, { color: hull, width: 4.5 });

  // hull: a squat cabin, laid in with broad strokes
  for (const y of [719, 745, 771, 790]) {
    p.stroke({ brush: 'bristle', color: mix(hull, wood, r()), width: 34, mix: 0, dry: 0, rag: 0, cap: 'round', streak: 0.2, jitter: 0.5, points: [[795, y], [840, y + r.range(-1.5, 1.5)], [884, y]] });
  }
  p.line(806, 698, 874, 697, { brush: 'flat', color: hull, width: 15, rag: 0, cap: 'round' });       // the roof housing
  p.line(906, 736, 906, 786, { brush: 'flat', color: hull, width: 22, rag: 0, cap: 'round' });       // a thruster pod
  p.line(892, 760, 908, 760, { color: hull, width: 8 });
  p.line(900, 792, 912, 806, { color: DARKER, width: 6 });                                          // its nozzle
  p.line(868, 692, 874, 640, { color: hull, width: 4 });                                            // antenna
  p.line(852, 690, 852, 668, { color: hull, width: 4.5 });

  // planking
  for (const x of [812, 836, 860, 882]) p.line(x, 706, x + 1, 800, { color: '#2a1f2c', width: 4, opacity: 0.55 });

  // cockpit: a round canopy at the front, lit from inside
  const cx = 786, cy = 756;
  loopDisc(p, cx, cy, 39, hull, 13);
  loopDisc(p, cx, cy, 27, '#e8983c', 9);
  p.stroke({ color: '#ffc468', width: 8, opacity: 0.9, points: arc(cx - 2, cy - 2, 14, 2.4, 5.2, 8) });
  p.stroke({ color: '#ffe6ac', width: 5, opacity: 0.85, points: arc(cx - 4, cy - 4, 9, 2.8, 4.9, 6) });
  p.line(cx - 19, cy + 17, cx + 19, cy + 16, { color: '#2a1c22', width: 11, opacity: 0.93 });          // the console, dark against the cabin light
  p.line(cx + 9, cy + 9, cx + 10, cy - 6, { color: '#2a1c22', width: 7, opacity: 0.9 });                // the back of the pilot's seat
  p.stroke({ color: hull, width: 5, points: arc(cx, cy, 29.5, 0, 6.283, 22) });
  p.stroke({ brush: 'soft', color: '#ff9a40', width: 30, opacity: 0.22, points: arc(cx, cy, 34, 0.3, 6.583, 20) });

  // the low sun along the top and the far side
  p.stroke({ color: '#ff9c48', width: 4, opacity: 0.85, points: [[802, 690.5], [840, 689.5], [878, 690]] });
  p.stroke({ color: '#ffb866', width: 4, opacity: 0.8, points: [[900, 706], [903, 740], [902, 790]] });
  p.stroke({ color: '#f08a3c', width: 4, opacity: 0.8, points: [[917, 730], [918, 760], [916, 790]] });
  p.line(871.5, 686, 876.5, 642, { color: '#ffa858', width: 4, opacity: 0.6 });
  p.line(928, 806, 936, 890, { color: '#e88038', width: 4, opacity: 0.55 });
  p.stroke({ color: '#ff9c48', width: 4, opacity: 0.6, points: arc(cx, cy, 39, -2.2, -0.9, 6) });
  // a small red beacon at the tip of the antenna
  p.stroke({ brush: 'soft', color: '#ff4a2a', width: 14, opacity: 0.5, points: [[859, 641], [890, 636]] });
  p.line(868, 640, 880.5, 638, { color: '#ff7a54', width: 4 });
}

// ---------------------------------------------------------------- the log and the traveler
{
  const suit = '#16131f';
  // firelit haze behind, so the figure stands out from the valley
  p.stroke({ brush: 'soft', color: '#b06a5c', width: 84, opacity: 0.24, points: [[372, 836], [470, 826], [572, 832]] });
  p.stroke({ brush: 'soft', color: '#c8805e', width: 50, opacity: 0.2, points: [[430, 812], [482, 800], [540, 812]] });
  p.stroke({ brush: 'bristle', color: '#120e18', width: 21, mix: 0, dry: 0, rag: 0.05, points: [[434, 893], [486, 891], [540, 889]] });
  p.line(430, 884, 436, 902, { brush: 'flat', color: '#241a1e', width: 7, rag: 0, opacity: 0.9 });   // the sawn end
  loopDisc(p, 410, 893, 12, '#151320', 8);                                                          // the helmet, set down beside it
  p.stroke({ color: '#5a6a9a', width: 4, opacity: 0.6, points: arc(410, 893, 8, -2.6, -0.5, 6) });

  p.line(465, 872, 462, 834, { brush: 'flat', color: DARKER, width: 15, rag: 0, cap: 'round' });    // pack
  p.line(486, 876, 478, 826, { brush: 'flat', color: suit, width: 24, rag: 0, cap: 'round', streak: 0.1, jitter: 0.2 });   // body, leaning back
  p.line(487, 879, 521, 872, { color: suit, width: 13 });                                           // thigh
  p.line(522, 873, 530, 898, { color: suit, width: 10.5 });                                         // shin
  p.line(526, 900, 545, 900, { color: DARKER, width: 8 });                                          // boot
  p.line(480, 834, 498, 853, { color: suit, width: 9.5 });                                          // upper arm
  p.line(498, 853, 519, 846, { color: suit, width: 8.5 });                                          // forearm
  loopDisc(p, 481, 803, 14, '#1a1a2c', 8);                                                          // head, tipped back to look up
  p.stroke({ color: '#1a1a2c', width: 8.5, taper: [0, 0.85], points: [[472, 800], [458, 798.5], [446, 804]] }); // a long ear, swept back
  p.stroke({ color: '#1a1a2c', width: 6, taper: [0, 0.8], points: [[489, 797], [498, 795], [505.5, 797.5]] });  // the tip of the other
  p.line(475, 815, 483, 830, { color: suit, width: 8 });                                            // neck and collar

  // the stick, and the marshmallow at the end of it
  p.line(517, 846, 592, 838, { color: '#2a1c18', width: 4 });
  p.line(586, 838.5, 600.2, 837, { color: '#fff1d2', width: 7 });
  p.line(588, 841.6, 600.6, 840, { brush: 'flat', color: '#e8a860', width: 4.5, opacity: 0.7, rag: 0 });
}

// ---------------------------------------------------------------- the fire
{
  const { x, y } = FIRE;
  // ring of stones, then the logs laid across each other
  for (const [dx, dy, w] of [[-34, 2, 10], [-22, 9, 9], [-4, 12, 10], [16, 10, 9], [32, 3, 10], [38, -6, 8], [-40, -6, 8]]) {
    p.line(x + dx - w * 1.05, y + dy, x + dx + w * 1.05, y + dy + r.range(-1.5, 1.5), { color: r.pick(['#1b1722', '#231b24', '#15121c']), width: w });
  }
  p.line(x - 26, y + 1, x + 22, y - 9, { brush: 'flat', color: '#24120f', width: 9, rag: 0.05 });
  p.line(x - 20, y - 10, x + 27, y + 1, { brush: 'flat', color: '#1c0f0e', width: 9, rag: 0.05 });
  p.line(x - 8, y + 3, x + 6, y - 16, { brush: 'flat', color: '#2a1510', width: 8, rag: 0.05 });
  p.line(x - 18, y - 3, x + 14, y - 8, { color: '#ff6a1c', width: 4, opacity: 0.9 });              // embers
  p.line(x - 10, y - 9, x + 18, y - 2, { color: '#ffa53a', width: 4, opacity: 0.8 });

  // light spreading from it
  // (a soft brush drawn through the fire: wide and faint first, then tighter and brighter)
  for (const [w, color, o, lift] of [[210, '#e8621f', 0.1, 30], [146, '#ff7a24', 0.15, 26], [90, '#ff9230', 0.22, 24], [60, '#ffa53c', 0.3, 22]]) {
    p.stroke({ brush: 'soft', color, width: w, opacity: o, points: [[x - w * 1.03, y - lift + 6], [x, y - lift - 6], [x + w * 1.03, y - lift + 6]] });
  }
  p.stroke({ brush: 'soft', color: '#ff9a38', width: 56, opacity: 0.22, points: [[x - 2, y + 16], [x + 4, y - 50], [x + 14, y - 104]] });

  // flames: red tongues outside, orange within, yellow at the heart
  const flame = (dx, h, w, color, sway, o) => {
    const pts = [];
    for (let k = 0; k <= 5; k++) { const f = k / 5; pts.push([x + dx + Math.sin(f * 3.1 + sway) * w * 0.55 * f + sway * 3 * f, y - 6 - h * f]); }
    fit({ brush: 'round', hardness: 0.6, color, opacity: o, taper: [0, 1], points: pts }, [w, w * 0.75, 6]);
  };
  for (const [dx, h, w, sway] of [[-17, 44, 15, 0.4], [-7, 66, 18, -0.5], [5, 78, 19, 0.6], [16, 54, 16, -0.3], [24, 36, 13, 0.8]]) flame(dx, h, w, '#e2491a', sway, 0.9);
  for (const [dx, h, w, sway] of [[-12, 36, 12, 0.2], [-3, 52, 14, -0.6], [7, 60, 14, 0.5], [16, 40, 12, -0.2]]) flame(dx, h, w, '#ff8a1e', sway, 0.92);
  for (const [dx, h, w, sway] of [[-6, 30, 9, -0.3], [3, 42, 10, 0.4], [11, 30, 9, -0.5]]) flame(dx, h, w, '#ffc23c', sway, 0.95);
  for (const [dx, h, w, sway] of [[-1, 22, 7, 0.2], [6, 26, 7, -0.3]]) flame(dx, h, w, '#fff0ae', sway, 0.95);

  // smoke lifting off and leaning with the air
  for (const [dx, dy, w, o] of [[4, -90, 34, 0.12], [16, -150, 46, 0.1], [36, -215, 60, 0.08]]) {
    p.stroke({ brush: 'soft', color: '#8a6a7a', width: w, opacity: o, points: [[x + dx - 8, y + dy + 40], [x + dx, y + dy], [x + dx + 16, y + dy - 44], [x + dx + 40, y + dy - 80]] });
  }
}

// ---------------------------------------------------------------- firelight on what faces it
{
  const lit = (pts, color, w = 4, o = 0.85) => p.stroke({ color, width: w, opacity: o, points: pts });
  // the traveler: shin, knee, thigh, arm, chest, face
  lit([[535, 876], [537.5, 888], [536, 899]], '#f08a3a', 4.5);
  lit([[494, 871.5], [509, 868], [524, 866]], '#d9742f', 4.5, 0.8);
  lit([[502, 850], [512, 846], [521, 842.5]], '#e88638', 4, 0.85);
  lit([[494, 832], [498, 846], [496, 860]], '#b85e2a', 5, 0.7);
  p.stroke({ color: '#7e90c4', width: 6, opacity: 0.6, points: arc(481, 803, 8.5, -0.75, 0.95, 6) });    // the blue of a Hearthian's face
  p.stroke({ color: '#e0a070', width: 4.5, opacity: 0.85, points: arc(481, 803, 11.5, -0.6, 0.85, 6) }); // firelight along it
  p.stroke({ color: '#ff9c4c', width: 4, opacity: 0.55, points: arc(481, 803, 12.5, -2.5, -1.2, 6) });   // the sun on the crown of the head
  lit([[466, 829], [472, 826.5], [479, 826]], '#ff9c4c', 4, 0.5);                                        // and on the shoulder
  // the log and the ground by the fire
  lit([[500, 882], [520, 880.5], [541, 879.5]], '#c8682c', 4.5, 0.8);
  lit([[545, 884], [546, 893], [545, 899]], '#e07a30', 5, 0.8);
  for (const [x0, x1, yy, o] of [[556, 590, 912, 0.55], [630, 676, 912, 0.55], [566, 660, 921, 0.4], [520, 560, 906, 0.4], [668, 720, 905, 0.35]]) {
    p.stroke({ brush: 'bristle', color: mix('#d8782c', '#ffab4c', r()), width: 8, opacity: o, mix: 0.3, points: [[x0, yy], [(x0 + x1) / 2, yy + 1], [x1, yy]] });
  }
  // the ship: the near legs, the belly, the underside of the canopy
  lit([[748, 890], [770, 842], [791, 804]], '#c86a2c', 4, 0.75);
  lit([[832, 896], [833.5, 850], [834.5, 812]], '#b05a28', 4, 0.6);
  lit([[797, 806], [838, 809], [880, 806]], '#9a4e26', 5, 0.6);
  p.stroke({ color: '#c8702e', width: 4.5, opacity: 0.7, points: arc(786, 756, 37, 1.3, 2.9, 8) });
  lit([[740, 900], [752, 903], [764, 901]], '#e07a30', 4, 0.7);
}

// ---------------------------------------------------------------- sparks going up
for (let k = 0; k < 22; k++) {
  const h = r.range(40, 260), drift = r.range(-26, 70) * (h / 260), x = FIRE.x + r.range(-10, 14) + drift, y = FIRE.y - 40 - h;
  const a = -1.57 + r.range(-0.7, 0.9), len = r.range(12.4, 16);
  p.line(x, y, x + Math.cos(a) * len, y + Math.sin(a) * len, { color: r.pick(['#ffd27a', '#ffb048', '#ff8a2c', '#ffe6a0']), width: 4, opacity: clamp(1.05 - h / 300, 0.25, 1) });
}

p.save();
