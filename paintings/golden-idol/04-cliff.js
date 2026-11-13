// The cliff: dark ground running toward us from its top, a face of rock turned to the sun
// where it drops to the sea, low light raking along the top, and grass at the lip.
'use strict';
const { studio, open, W, H, EDGE, cliffTop, edgeX, faceX, onCliff, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('cliff');
const r = p.rng;

// How far a point is from the outer side of the face, measured level.
const inland = (x, y) => faceX(Math.max(y, EDGE.y)) - x;

function ground(x, y) {
  const depth = clamp((y - cliffTop(Math.min(x, EDGE.x))) / 300, 0, 1);        // 0 at the top line, 1 at our feet
  let c = mix(mix('#33273d', '#443241', nA(x / 50, y / 22)), mix('#1f1930', '#281f34', nA(x / 40, y / 30)), smooth(0, 0.8, depth));
  c = mix(c, '#7a4a48', 0.5 * (1 - depth) * smooth(300, 900, x));              // the last sun warms the top, toward the lip
  return mix(c, '#15111f', 0.6 * smooth(0.6, 1, depth));
}
function rock(x, y) {
  const strata = nC(x / 90 + 3, y / 13), block = nB(x / 26, y / 60);
  const out = clamp(1 - inland(x, y) / band(y), 0, 1);                         // 1 at the outer edge, 0 where the face turns away
  let c = mix(mix('#a8523f', '#dc8850', strata), '#f6b468', smooth(0.7, 1, block) * 0.7);
  c = mix(c, '#6a3248', smooth(0.42, 0.1, block) * 0.75);                      // cracks and hollows
  c = mix(c, '#7a3c48', (1 - smooth(0, 0.7, out)) * 0.45);                     // a little dimmer toward the edge
  return mix(c, '#4a2a48', 0.45 * smooth(760, 1000, y));
}

const lean = (x) => Math.atan2(cliffTop(x + 14) - cliffTop(x - 14), 28);
// The lit face is the band between the edge and its outer side.
const band = (y) => faceX(y) - edgeX(y);
const onGround = (m) => (x, y) => onCliff(x, y - m) && onCliff(x, y) && (y < EDGE.y + 4 || x < edgeX(y) + 6);
const onFace = (m) => (x, y) => onCliff(x, y) && y > EDGE.y + m - 6 && x >= edgeX(y) - 4 && inland(x, y) > m;

// The ground, toward us.
p.fill({ inside: onGround(18), bounds: [-20, 680, 940, H + 10], width: 40, length: 200, spacing: 0.5, angle: (x, y) => lean(Math.min(x, EDGE.x)) * clamp(1 - (y - 700) / 200, 0, 1) + (nB(x / 90, y / 50) - 0.5) * 0.25, color: ground, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.1, dry: 0.05 } });
p.fill({ inside: onGround(9), bounds: [-20, 680, 940, H + 10], width: 20, length: 110, spacing: 0.7, overlap: 0.7, angle: (x, y) => (nB(x / 60, y / 30) - 0.5) * 0.5, color: (x, y) => ground(x + r.range(-10, 10), y + r.range(-6, 6)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.1 } });
for (let x = -30; x < EDGE.x - 30; x += 120) {                                  // a firm top line
  const pts = [];
  for (let k = 0; k <= 7; k++) { const xx = Math.min(EDGE.x - 6, x + k * 19); pts.push([xx, cliffTop(xx) + 7]); }
  p.tryStroke({ brush: 'bristle', color: ground(x + 66, cliffTop(x + 66) + 8), width: 14, mix: 0.05, dry: 0, rag: 0.05, points: pts });
}

// The face: strokes dragged down the rock, bright where a block catches the sun.
const fall = (x, y) => Math.atan2(40, faceX(y + 20) - faceX(y - 20)) + (nB(x / 30, y / 50) - 0.5) * 0.3;
p.fill({ inside: onFace(11), bounds: [840, 690, 1080, H + 10], width: 22, length: 120, spacing: 0.45, angle: fall, color: rock, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.1, dry: 0.05 } });
p.fill({ inside: onFace(6), bounds: [840, 690, 1080, H + 10], width: 10, length: 70, spacing: 0.7, overlap: 0.8, angle: fall, color: (x, y) => rock(x + r.range(-5, 5), y + r.range(-14, 14)), stroke: { brush: 'flat', opacity: 0.88 } });
{
  const edge = [], inner = [];
  for (let y = EDGE.y + 6; y <= H + 12; y += 24) { edge.push([faceX(y) - 5, y]); inner.push([edgeX(y), y]); }
  p.stroke({ brush: 'bristle', color: '#f6a558', width: 9, opacity: 0.9, mix: 0.1, points: edge });                 // the outer edge, full in the sun
  p.stroke({ color: '#ffd592', width: 4, opacity: 0.8, points: edge.slice(0, 7).map(([x, y]) => [x + 2, y]) });
  p.stroke({ brush: 'bristle', color: '#ffb868', width: 7, opacity: 0.85, mix: 0.1, dry: 0, points: inner });      // the edge itself, catching the light as it comes toward us
}
for (let k = 0; k < 7; k++) {                                                   // cracks running down and across the face
  const y = r.range(EDGE.y + 60, H - 30), x = faceX(y) - r.range(12, Math.max(14, band(y) * 0.75)), len = r.range(34, 70), a = r.range(1.1, 2.0);
  p.tryStroke({ color: '#4d2640', width: r.range(4, 5.5), opacity: 0.65, taper: [0.3, 0.6], points: [[x, y], [x + Math.cos(a) * len * 0.5 + r.range(-8, 8), y + Math.sin(a) * len * 0.5], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
}

// Low sun raking along the top of the cliff, strongest at the lip.
for (let x = 380; x < EDGE.x - 8; x += r.range(30, 80)) {
  const len = r.range(28, 80), near = smooth(380, 900, x);
  if (x + len > EDGE.x - 4) continue;
  p.tryStroke({ color: mix('#b0553e', '#ffb060', near), width: r.range(4, 5.5), opacity: 0.3 + 0.55 * near, taper: [0.3, 0.3], points: [[x, cliffTop(x) + 3], [x + len / 2, cliffTop(x + len / 2) + 3], [x + len, cliffTop(x + len) + 3]] });
}
p.stroke({ color: '#ffc070', width: 5, opacity: 0.9, points: [[EDGE.x - 40, cliffTop(EDGE.x - 40) + 2.5], [EDGE.x - 16, cliffTop(EDGE.x - 16) + 2.5], [EDGE.x + 2, EDGE.y + 4]] });

// Grass along the top, in tufts, a few blades lit.
for (let x = 0; x < EDGE.x + 2; x += r.range(3, 9)) {
  if (nB(x / 40, 61) < 0.5) { x += r.range(10, 36); continue; }
  const h = r.range(12.5, 17) * (0.9 + 1.2 * nB(x / 40, 61) * r()), bend = r.range(-0.3, 0.5) * h, bright = r() < 0.08 + 0.3 * smooth(400, 900, x);
  p.tryStroke({ color: bright ? mix('#c8603a', '#ffb45c', r()) : r.pick(['#1c1529', '#241b30', '#15101f']), width: 4, opacity: bright ? r.range(0.55, 0.9) : 1, taper: [0, 0.6], points: [[x, cliffTop(x) + 5], [x + bend * 0.4, cliffTop(x) + 5 - h * 0.6], [x + bend, cliffTop(x) + 5 - h]] });
}

p.save();
