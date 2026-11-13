// The hall itself: the far wall with its paper and its panelling, the two tall windows and
// the storm in them, the lightning, the galleries either side of the stairs with the dark
// under them, and the chandelier swinging overhead.
'use strict';
const { studio, open, W, BOLT, BACK, LAND, nA, nB, lit, bar, post } = require('./scene');
const { mix, clamp, smooth, arc } = studio;

const p = open('hall');
const r = p.rng;

// The wall: dark wine-colored paper, in upright strokes, darker toward the ceiling.
const wall = (x, y) => lit(mix(mix('#1c0b12', '#36141d', nA(x / 40, y / 200)), '#100609', smooth(280, 0, y) * 0.75), x, y, 0.55, 0.5);
p.fill({ inside: (x, y) => y < LAND + 6, bounds: [0, 0, W, LAND + 6], width: 24, length: 150, spacing: 0.5, angle: (x, y) => Math.PI / 2 + (nB(x / 60, y / 200) - 0.5) * 0.08, color: wall, stroke: { brush: 'bristle', opacity: 0.95, mix: 0.12, dry: 0.05 } });
bar(p, 0, W, 120, 9, (x, y) => lit('#3c2420', x, y, 0.8, 0.6));                     // the cornice
bar(p, 0, W, 110, 8, () => '#0a0508');

// The panelling under the paper.
const wood = (x, y) => lit(mix('#160b0d', '#2c1712', nA(x / 30, y / 8)), x, y, 0.42, 0.5);
for (const y of [483, 507, 531, 550]) bar(p, 210, 1390, y, 26, wood);
for (let x = 250; x < 1390; x += 108) post(p, x, 476, 554, 5, () => '#0a0507', { stroke: { opacity: 0.7 } });
bar(p, 210, 1390, 471, 7, (x, y) => lit('#4a2c1c', x, y, 0.95, 0.7));

// Flat pillars between the portrait and the windows.
for (const x of [582, 1018]) {
  post(p, x, 124, 468, 30, (px, py) => lit(mix('#2a1e26', '#3a2a30', nA(px / 9, py / 90)), px, py, 0.6, 0.5));
  post(p, x - 13, 130, 466, 5, (px, py) => lit('#3a2a30', px, py, 0.2, 1.1), { stroke: { opacity: 0.8 } });   // the edge toward the window
  post(p, x + 13, 130, 466, 5, (px, py) => lit('#3a2a30', px, py, 1.1, 0.2), { stroke: { opacity: 0.8 } });   // the edge toward the witch
  bar(p, x - 24, x + 24, 131, 12, (px, py) => lit('#4a3434', px, py, 0.8, 0.7));
}

// A window: the storm outside, rain driving across it, its dark frame and bars. In the left
// one the lightning stands, and its light comes into the hall.
function windowAt(cx, flash) {
  const inside = (x, y) => Math.abs(x - cx) < 84 && y < 516 && (y > 240 || Math.hypot(x - cx, y - 240) < 84);
  const sky = (x, y) => {
    const n = nA(x / 60, y / 40 + cx);
    const c = mix('#0e1424', '#28344e', n);
    return flash ? mix(c, '#c8d6f8', clamp(Math.exp(-Math.pow((x - (cx - 16)) / 50, 2)) * 0.85 + 0.3 * n, 0, 1)) : c;
  };
  p.fill({ inside, bounds: [cx - 90, 150, cx + 90, 520], width: 14, length: 70, spacing: 0.5, angle: () => 1.15, color: sky, stroke: { brush: 'bristle', opacity: 0.96, mix: 0.15, dry: 0.05 } });
  for (let k = 0; k < 46; k++) {                                                  // rain
    const x = cx + r.range(-80, 80), y = r.range(160, 490);
    if (!inside(x, y) || !inside(x - 11, y + 26)) continue;
    p.tryStroke({ color: flash ? '#eef2ff' : '#7c8cb4', width: 4, opacity: r.range(0.2, 0.5), points: [[x, y], [x - 11, y + 26]] });
  }
  if (flash) {                                                                     // the bolt: a thin crooked line down the sky, with two branches
    const bolt = [[cx - 30, 158]];
    while (bolt[bolt.length - 1][1] < 500) { const [bx, by] = bolt[bolt.length - 1]; bolt.push([clamp(bx + r.range(-17, 15), cx - 70, cx + 50), by + r.range(18, 34)]); }
    p.stroke({ brush: 'soft', color: '#b8ccff', width: 26, opacity: 0.35, points: bolt.filter((q, i) => i % 3 === 0 || i === bolt.length - 1) });
    for (let i = 0; i + 1 < bolt.length; i++) p.tryStroke({ color: '#ffffff', width: i < bolt.length * 0.6 ? 4.6 : 4, points: [bolt[i], bolt[i + 1]] });
    for (const [from, dir] of [[3, -1], [6, 1]]) {
      let q = bolt[Math.min(from, bolt.length - 2)];
      for (let k = 0; k < 3; k++) { const n = [clamp(q[0] + dir * r.range(8, 20), cx - 76, cx + 76), q[1] + r.range(16, 26)]; p.tryStroke({ color: '#e8eeff', width: 4, opacity: 0.8 - k * 0.2, points: [q, n] }); q = n; }
    }
  }
  const dark = (x, y) => lit('#0a0810', x, y, 0.5, flash ? 0.25 : 0.4);
  post(p, cx - 88, 240, 520, 11, dark);
  post(p, cx + 88, 240, 520, 11, dark);
  p.stroke({ brush: 'bristle', color: dark(cx, 150), width: 11, mix: 0, dry: 0, rag: 0.1, cap: 'flat', points: arc(cx, 240, 88, Math.PI, Math.PI * 2, 14) });
  bar(p, cx - 102, cx + 102, 522, 11, (x, y) => lit('#1c1218', x, y, 0.7, 0.9));   // the sill
  post(p, cx, 156, 516, 6, dark);
  for (const y of [240, 332, 424]) bar(p, cx - 84, cx + 84, y, 5, dark);
}
windowAt(BOLT.x, true);
windowAt(1192, false);
// The flash comes into the hall: a cold haze round the window, and a shaft of it slanting to the floor.
p.stroke({ brush: 'soft', color: '#9fb4ee', width: 210, opacity: 0.13, points: [[BOLT.x - 215, 340], [BOLT.x, 320], [BOLT.x + 215, 345]] });
p.stroke({ brush: 'soft', color: '#b8c8f4', width: 110, opacity: 0.12, points: [[BOLT.x - 112, 330], [BOLT.x, 322], [BOLT.x + 112, 332]] });
p.stroke({ brush: 'soft', color: '#a8bcf0', width: 150, opacity: 0.07, points: [[BOLT.x + 10, 360], [BOLT.x + 130, 600], [BOLT.x + 260, 880]] });

// The galleries either side of the stairs: a beam, a rail on turned posts above it, and
// under it the dark, with a doorway darker still.
for (const [x0, x1] of [[210, 560], [1040, 1390]]) {
  const mid = (x0 + x1) / 2;
  p.fill({ inside: (x, y) => x > x0 - 40 && x < x1 + 40 && y > LAND + 8 && y < BACK + 6, bounds: [x0 - 40, LAND + 8, x1 + 40, BACK + 6], width: 20, length: 90, spacing: 0.5, angle: () => Math.PI / 2, color: (x, y) => lit(mix('#0c070b', '#170c10', nA(x / 30, y / 60)), x, y, 0.5, 0.3), stroke: { brush: 'bristle', opacity: 0.96, mix: 0.1, dry: 0.03 } });
  for (const dx of [-30, -8, 14]) post(p, mid + dx, 602, BACK + 4, 26, () => '#040305');   // the doorway
  p.stroke({ brush: 'bristle', color: '#040305', width: 22, mix: 0, dry: 0, rag: 0.1, cap: 'round', points: arc(mid - 8, 606, 26, Math.PI, Math.PI * 2, 8) });
  bar(p, x0, x1, LAND, 14, (x, y) => lit('#22130f', x, y, 0.8, 0.7));              // the beam
  for (let x = x0 + 8; x < x1 - 4; x += 16) post(p, x, 500, 548, 5.5, (px, py) => lit('#160c0c', px, py, 0.9, 0.9), { stroke: { opacity: 0.9 } });   // the posts of the rail
  bar(p, x0, x1, 495, 8, (x, y) => lit('#2c1812', x, y, 1.1, 1.0));                // the rail
}

// The chandelier, far up, swinging in the draught: a dark ring, its chain, and a few flames
// blown sideways.
{
  const cx = 812, cy = 62;
  p.stroke({ brush: 'bristle', color: '#07050a', width: 5, mix: 0, dry: 0, rag: 0, points: [[800, -6], [806, 28], [cx, cy - 14]] });
  p.stroke({ brush: 'bristle', color: '#0a070c', width: 8, mix: 0, dry: 0, rag: 0.1, cap: 'round', points: [[cx - 118, cy], [cx - 60, cy + 13], [cx, cy + 17], [cx + 60, cy + 13], [cx + 118, cy]] });
  p.stroke({ brush: 'bristle', color: '#0a070c', width: 6, mix: 0, dry: 0, rag: 0.1, cap: 'round', points: [[cx - 118, cy], [cx - 60, cy - 9], [cx, cy - 12], [cx + 60, cy - 9], [cx + 118, cy]] });
  for (const dx of [-112, -70, -24, 26, 72, 114]) {
    const y = cy + 14 - Math.abs(dx) * 0.1;
    p.line(cx + dx, y, cx + dx, y - 15, { color: '#1a1216', width: 5 });           // a candle
    p.stroke({ brush: 'soft', color: '#ffb050', width: 12, opacity: 0.4, points: [[cx + dx - 8, y - 16], [cx + dx + 16, y - 24]] });
    p.line(cx + dx, y - 15, cx + dx + 11, y - 22, { color: '#ffd890', width: 4, opacity: 0.9 });   // its flame, blown over
  }
}

p.save();
