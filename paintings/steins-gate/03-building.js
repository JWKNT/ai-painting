// The front of the building, from the third storey up. Under the roof is a long band of
// painted boards, each a different picture in pale bright colors. Under that are the
// storeys: a band of wall, a band of windows, and so on down. The glass is dark, and holds
// the sky. At the left a tall yellow sign hangs down the front; its red letters are too far to read. At the right
// the side wall goes away from us, in the sun.
'use strict';
const { studio, open, H, ROOF, FRONT, SIDE, BOARDS, SAT, nA, nB, nC, hash } = require('./scene');
const { mix, smooth, inPoly } = studio;

const p = open('building');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.03, rag: 0.12, cap: 'flat' };
const band = (x0, x1, y0, y1, color, o = {}) => p.fill({ inside: (x, y) => x >= x0 && x <= x1 && y >= y0 && y <= y1, bounds: [x0, y0, x1, y1], width: o.width || 8, length: o.length || 90, spacing: 0.5, overlap: 0.6, angle: () => (o.up ? Math.PI / 2 : 0) + r.range(-0.012, 0.012), color, stroke: { ...line, opacity: 0.97 } });
// The wall: a pale warm grey, with old stains that run down it, and darker toward the left, which is further from the sun.
const wall = (x, y) => { let c = mix('#cfcabb', '#e2ddcc', nA(x / 140, y / 40)); c = mix(c, '#9c9a94', (nC(x / 9, y / 120) > 0.66 ? 0.22 : 0) + smooth(500, -100, x) * 0.16); return mix(c, '#8c8c90', Math.exp(-Math.pow(Math.hypot(x - (SAT.x - 120), y - 520) / 260, 2)) * 0.3); };   // the last part is the shade of the machine on the wall under it

// ---------------------------------------------------------------- the roof edge, and the band of painted boards
band(FRONT.x0, FRONT.x1, ROOF, BOARDS.y0 + 2, (x, y) => mix(wall(x, y), '#f4f0e4', 0.4), { width: 6 });
p.stroke({ ...line, color: '#8c887c', width: 5, opacity: 0.8, points: [[FRONT.x0, BOARDS.y0 + 1], [FRONT.x1, BOARDS.y0 + 1]] });
{
  const colors = ['#ec8cac', '#f0d458', '#7cd0b0', '#6cb8e4', '#b094dc', '#f6f2e8', '#e4644c', '#f4a868'];
  for (let x = FRONT.x0, i = 0; x < FRONT.x1; i++) {
    const w = Math.min(FRONT.x1 - x, r.range(110, 190)), base = colors[Math.floor(hash(i, 1) * colors.length)], other = colors[Math.floor(hash(i, 2) * colors.length)], third = colors[Math.floor(hash(i, 3) * colors.length)];
    const kind = Math.floor(hash(i, 4) * 4), cx = x + w * (0.3 + 0.4 * hash(i, 5)), cy = (BOARDS.y0 + BOARDS.y1) / 2 + (hash(i, 6) - 0.5) * 40;
    // each board is a field of one color with one or two large plain shapes on it: a round, a slanted band, a wave, a sun with rays
    const paint = (px, py) => {
      const dx = px - cx, dy = py - cy;
      let c = base;
      if (kind === 0 && Math.hypot(dx, dy * 1.1) < 44) c = other;
      if (kind === 1 && Math.abs(dx * 0.8 + dy) < 26) c = other;
      if (kind === 2 && py > cy + 14 * Math.sin(px / 22)) c = other;
      if (kind === 3 && (Math.hypot(dx, dy) < 26 || (Math.abs(Math.sin(Math.atan2(dy, dx) * 5)) > 0.8 && Math.hypot(dx, dy) < 62))) c = other;
      if (Math.abs(dx - w * 0.3) < 9 && kind !== 1) c = third;
      return mix(mix(c, '#b8b4a8', 0.06), '#8c8c90', Math.exp(-Math.pow(Math.hypot(px - (SAT.x - 110), py - 420) / 200, 2)) * 0.35);   // bleached by the sun; and the shade of the machine
    };
    band(x + 2, x + w - 2, BOARDS.y0 + 5, BOARDS.y1 - 3, paint, { width: 6, length: 22 });
    p.stroke({ ...line, color: '#6c6c68', width: 5, points: [[x + w, BOARDS.y0 + 4], [x + w, BOARDS.y1 - 2]] });                      // the post between two boards
    x += w;
  }
  p.stroke({ ...line, color: '#7c7870', width: 6, points: [[FRONT.x0, BOARDS.y1], [FRONT.x1, BOARDS.y1]] });                          // the rail under them
  p.stroke({ brush: 'soft', color: '#5c5c60', width: 16, opacity: 0.3, points: [[FRONT.x0, BOARDS.y1 + 10], [FRONT.x1, BOARDS.y1 + 10]] });   // and the shade under that rail
}

// ---------------------------------------------------------------- the storeys
// Each storey is a band of wall and, under it, a band of windows. A window is one pane of dark glass, lighter toward its top,
// where it holds the sky; here and there a pane holds a cloud, and behind some a pale blind is part of the way down.
const PANE = 58;
for (let y0 = BOARDS.y1 + 3, k = 0; y0 < H; k++) {
  const wy0 = y0 + 42, wy1 = y0 + 96;
  band(FRONT.x0, FRONT.x1, y0, Math.min(H, wy0), wall, { width: 7 });
  if (wy0 < H) {
    const y1 = Math.min(H, wy1);
    band(FRONT.x0, FRONT.x1, wy0, y1, (x, y) => { const i = Math.floor((x - FRONT.x0) / PANE), h = hash(i, k), t = (y - wy0) / (wy1 - wy0); let c = mix('#34495c', '#5c7890', h); c = mix(c, '#a8ccdc', smooth(0.6, 0, t) * (0.25 + 0.3 * hash(k, i))); return h > 0.86 ? mix(c, '#e8f0f0', 0.5) : c; }, { width: 6.5, length: 40 });
    for (let x = FRONT.x0 + PANE, i = 1; x < FRONT.x1; x += PANE, i++) {
      if (hash(i, k + 40) < 0.22 && y1 - wy0 > 30) band(x - PANE + 4, x - 4, wy0 + 2, wy0 + 14 + hash(k, i) * 30, () => mix('#d8d4c4', '#ece8dc', r()), { width: 6, length: 30 });   // a blind
      p.tryStroke({ ...line, color: '#bcb8a8', width: 6, points: [[x, wy0], [x, Math.max(wy0 + 13, y1)]] });                                                                      // the post between two panes
    }
    p.stroke({ brush: 'soft', color: '#3c3c44', width: 9, opacity: 0.35, points: [[FRONT.x0, wy0 + 4], [FRONT.x1, wy0 + 4]] });   // the shade of the wall above, on the glass
    if (wy1 < H) p.stroke({ ...line, color: '#f2eee2', width: 5.5, points: [[FRONT.x0, wy1], [FRONT.x1, wy1]] });                // the sill, which takes the light
  }
  y0 = wy1 + 2;
}

// ---------------------------------------------------------------- the tall yellow sign, with its red marks
{
  const x0 = 64, x1 = 176, y0 = BOARDS.y1 + 22;
  p.stroke({ brush: 'soft', color: '#4c4c50', width: 22, opacity: 0.3, points: [[x0 - 12, y0 + 10], [x0 - 12, 700], [x0 - 12, H + 10]] });    // its shade on the wall
  band(x0, x1, y0, H + 6, (x, y) => mix(mix('#e8c636', '#f4dc5c', nA(x / 30, y / 60)), '#c8a428', (nC(x / 8, y / 100) > 0.7 ? 0.25 : 0)), { width: 8, length: 70, up: true });
  for (const x of [x0 + 3, x1 - 3]) p.stroke({ ...line, color: '#c03c30', width: 6, points: [[x, y0], [x, H + 4]] });
  p.stroke({ ...line, color: '#c03c30', width: 6, points: [[x0, y0 + 3], [x1, y0 + 3]] });
  // The writing on it is too far to read: each letter is only a square of red.
  for (let cy = y0 + 60; cy < H + 40; cy += 92) band(x0 + 24, x1 - 24, cy - 32, cy + 32, () => mix('#c8342c', '#a82824', r()), { width: 7, length: 40 });
}

// ---------------------------------------------------------------- the side wall, which goes away from us: it is in the sun
{
  const toVP = (x, y0) => y0 + (SIDE.vy - y0) * (x - FRONT.x1) / (SIDE.vx - FRONT.x1), back = (x, y) => (y - SIDE.vy * (x - FRONT.x1) / (SIDE.vx - FRONT.x1)) / (1 - (x - FRONT.x1) / (SIDE.vx - FRONT.x1));   // back: the height on the front edge that a place of this wall is level with
  const quad = [[FRONT.x1, ROOF], [SIDE.x1, toVP(SIDE.x1, ROOF)], [SIDE.x1, H + 10], [FRONT.x1, H + 10]];
  p.fill({ inside: inPoly(quad), bounds: [FRONT.x1, ROOF, SIDE.x1, H], width: 6, length: 60, spacing: 0.5, angle: (x, y) => Math.atan2(SIDE.vy - y, SIDE.vx - x), color: (x, y) => {
    const y0 = back(x, y), f = (y0 - (BOARDS.y1 + 3)) / 94, part = f - Math.floor(f);
    if (y0 < BOARDS.y1) return mix('#f6f2e6', '#e4e0d0', nA(x / 20, y / 60));
    return part > 0.33 ? mix('#506478', '#8ca8b8', nB(x / 12, y / 40)) : mix('#f4f0e2', '#e0dccc', nA(x / 20, y / 60));
  }, stroke: { ...line, opacity: 0.97 } });
  p.stroke({ ...line, color: '#fbf8f0', width: 5.5, points: [[FRONT.x1, ROOF - 2], [FRONT.x1, H + 4]] });                                  // the corner of the building, in the sun
  p.stroke({ ...line, color: '#7c8088', width: 5, opacity: 0.7, points: [[SIDE.x1 + 1, toVP(SIDE.x1, ROOF)], [SIDE.x1 + 1, H + 4]] });     // its far edge
}

p.save();
