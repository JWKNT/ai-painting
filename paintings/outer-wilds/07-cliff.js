// The near ground: haze in the valley behind it, then the cliff the camp stands on, its
// sunlit face, and the dark slope rising out of the right corner.
'use strict';
const { studio, open, W, H, SUN, FIRE, cliffTop, slopeTop, warmth, nA, nB, nC, clamp, smooth } = require('./scene');
const { mix, wave } = studio;

const p = open('cliff');
const r = p.rng;

// Haze hanging in the valley, so the camp will stand dark against something lighter.
for (let k = 0; k < 22; k++) {
  const x = r.range(150, 1250), y = r.range(770, 880), len = r.range(240, 460), warm = clamp(warmth(x) * 1.2, 0, 1);
  p.stroke({
    brush: 'soft', width: r.range(60, 110), opacity: r.range(0.1, 0.18) + 0.08 * warm,
    color: mix(mix('#5b4a86', '#7a5a8e', r()), mix('#e8754a', '#ffa860', r()), warm),
    points: wave(x - len / 2, y, x + len / 2, y + r.range(-10, 10), r.range(4, 10), 1, 8),
  });
}

const edgeX = 1004;   // where the cliff top turns over into its face
const fireGlow = (x, y) => Math.exp(-Math.pow(Math.hypot(x - FIRE.x, (y - FIRE.y - 14) * 2.1) / 150, 2));

function ground(x, y) {
  let c = mix('#121125', '#1c1830', nA(x / 46, y / 22));
  c = mix(c, '#08080f', smooth(930, 1010, y) * 0.75);
  const f = fireGlow(x, y);
  return mix(c, mix('#6e3219', '#c9722c', f), clamp(f * 1.05, 0, 0.9));
}
function face(x, y) {
  let outer = edgeX; while (outer < 1136 && cliffTop(outer) < y) outer += 2;
  const inward = clamp((outer - x) / 90, 0, 1);   // 0 at the lit outer edge, 1 deep inside
  const lit = clamp(nC(x / 18, y / 60) * 0.7 + (1 - inward) * 0.55 - inward * 0.25, 0, 1);
  let c = mix(mix('#6a2c20', '#a4482a', lit), '#d8702e', smooth(0.62, 0.95, lit));
  c = mix(c, '#2a1420', smooth(0.4, 0.1, lit) * 0.8);
  return mix(c, '#1a0f1a', smooth(950, 1010, y) * 0.5);
}

const slope = (x) => Math.atan2(cliffTop(x + 14) - cliffTop(x - 14), 28);
const onTop = (m) => (x, y) => x < edgeX + 4 && y > cliffTop(x) + m;
const onFace = (m) => (x, y) => x >= edgeX - 6 && x < 1136 && y > cliffTop(x) + m;

// The top of the cliff: broad strokes first, then smaller ones, all lying along the ground.
p.fill({ inside: onTop(20), bounds: [-20, 820, edgeX + 10, H + 10], width: 40, length: 170, spacing: 0.5, angle: (x, y) => slope(x) * clamp(1 - (y - cliffTop(x)) / 200, 0, 1) + (nB(x / 90, y / 50) - 0.5) * 0.25, color: ground, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.1, dry: 0.05 } });
p.fill({ inside: onTop(10), bounds: [-20, 820, edgeX + 10, H + 10], width: 20, length: 110, spacing: 0.7, overlap: 0.7, angle: (x, y) => slope(x) * clamp(1 - (y - cliffTop(x)) / 200, 0, 1) + (nB(x / 60, y / 30) - 0.5) * 0.5, color: (x, y) => ground(x + r.range(-10, 10), y + r.range(-6, 6)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.1 } });
for (let x = -30; x < edgeX - 20; x += 120) {   // a firm crest
  const pts = [];
  for (let k = 0; k <= 8; k++) { const xx = Math.min(edgeX - 4, x + k * 18); pts.push([xx, cliffTop(xx) + 7]); }
  p.tryStroke({ brush: 'bristle', color: ground(x + 70, cliffTop(x + 70) + 8), width: 14, mix: 0.05, dry: 0, rag: 0.05, points: pts });
}

// The face of the cliff, turned toward the sun: strokes dragged down the rock.
p.fill({ inside: onFace(12), bounds: [edgeX - 10, 890, 1140, H + 10], width: 22, length: 120, spacing: 0.5, angle: (x, y) => 1.2 + (nB(x / 30, y / 60) - 0.5) * 0.4, color: face, stroke: { brush: 'bristle', opacity: 0.96, mix: 0.1 } });
p.fill({ inside: onFace(6), bounds: [edgeX - 10, 890, 1140, H + 10], width: 10, length: 70, spacing: 0.8, overlap: 0.8, angle: (x, y) => 1.2 + (nB(x / 20, y / 40) - 0.5) * 0.6, color: (x, y) => face(x + r.range(-5, 5), y + r.range(-12, 12)), stroke: { brush: 'flat', opacity: 0.85 } });
{
  const pts = [];
  for (let y = 905; y <= 1010; y += 21) { let x = edgeX; while (x < 1136 && cliffTop(x) < y) x += 1; pts.push([x - 5, y]); }
  p.stroke({ brush: 'bristle', color: '#e07a34', width: 9, opacity: 0.85, mix: 0.1, points: pts });   // the lit outer edge of the rock
  p.stroke({ color: '#ffb060', width: 4, opacity: 0.7, points: pts.slice(0, 5).map(([x, y]) => [x + 2, y]) });
}

// The slope in the right corner: dark, close, facing away from the light.
const rise = (x) => Math.atan2(slopeTop(x + 14) - slopeTop(x - 14), 28);
const slopeColor = (x, y) => mix(mix('#100e1e', '#191527', nA(x / 40, y / 22)), '#07070d', smooth(950, 1010, y) * 0.7);
p.fill({ inside: (x, y) => x > 1150 && y > slopeTop(x) + 18, bounds: [1140, 900, W + 20, H + 10], width: 36, length: 200, spacing: 0.5, angle: (x, y) => rise(x) + (nB(x / 80, y / 40) - 0.5) * 0.3, color: slopeColor, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.1, dry: 0.05 } });
for (let x = 1160; x < W + 20; x += 110) {
  const pts = [];
  for (let k = 0; k <= 7; k++) pts.push([x + k * 18, slopeTop(x + k * 18) + 7]);
  p.tryStroke({ brush: 'bristle', color: slopeColor(x + 60, slopeTop(x + 60) + 10), width: 14, mix: 0.05, dry: 0, rag: 0.05, points: pts });
}

// Low sun raking along both crests: a broken line of light on the grass.
function rimLight(top, from, to, strength) {
  for (let x = from; x < to; x += r.range(30, 90)) {
    const len = r.range(26, 80), near = strength(x);
    if (near < 0.08 || x + len > to) continue;
    p.tryStroke({ color: mix('#a8452a', '#ffa552', near), width: r.range(4, 5), opacity: 0.25 + 0.45 * near, taper: [0.3, 0.3], points: [[x, top(x) + 2.5], [x + len / 2, top(x + len / 2) + 2.5], [x + len, top(x + len) + 2.5]] });
  }
}
rimLight(cliffTop, 300, edgeX - 6, (x) => smooth(300, 980, x) * (1 - 0.8 * smooth(FIRE.x - 30, FIRE.x + 30, x) * smooth(FIRE.x + 90, FIRE.x + 30, x)));
rimLight(slopeTop, 1180, W, (x) => smooth(1700, 1200, x));

// Grass along the crests: short upward flicks, dark, a few catching the light.
function grass(top, from, to, lit) {
  for (let x = from; x < to; x += r.range(3, 9)) {
    if (nB(x / 38, 91) < 0.5) { x += r.range(10, 40); continue; }   // grass grows in tufts
    const h = r.range(12.5, 17) * (0.9 + 1.1 * nB(x / 38, 91) * r()), lean = r.range(-0.5, 0.5) * h, bright = r() < lit(x);
    p.tryStroke({ color: bright ? mix('#c05a2c', '#ffa04c', r()) : r.pick(['#0f0e1d', '#151327', '#0b0b16']), width: 4, opacity: bright ? r.range(0.5, 0.9) : 1, taper: [0, 0.6], points: [[x, top(x) + 5], [x + lean * 0.4, top(x) + 5 - h * 0.6], [x + lean, top(x) + 5 - h]] });
  }
}
grass(cliffTop, 0, edgeX - 4, (x) => 0.06 + 0.2 * smooth(400, 1000, x));
grass(slopeTop, 1160, W, () => 0.18);

p.save();
