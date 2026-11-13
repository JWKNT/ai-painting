// The far land: a pale range, the snow mountain, and green hills at the edge of the plain.
'use strict';
const { studio, open, W, HORIZON, PEAK, peakLine, farLine, nearLine, nA, nB, nC } = require('./scene');
const { mix, wave, clamp, smooth } = studio;

const p = open('mountains');
const r = p.rng;
const slopeOf = (line) => (x) => Math.atan2(line(x + 10) - line(x - 10), 20);

// A ridge: strokes that run with its crest, a firm stroke along the crest itself.
function ridge(line, colorAt, bottom, width, x0 = -20, x1 = W + 20) {
  const slope = slopeOf(line);
  p.fill({
    inside: (x, y) => y > line(x) + width * 0.5 && y < bottom, bounds: [x0, 250, x1, bottom], width, length: width * 6, spacing: 0.5,
    angle: (x, y) => slope(x) * clamp(1 - (y - line(x)) / 120, 0.2, 1) + (nB(x / 70, y / 30) - 0.5) * 0.3, color: colorAt,
    stroke: { brush: 'bristle', opacity: 0.95, mix: 0.15, dry: 0.05 },
  });
  for (let x = x0; x < x1; x += 120) {
    const pts = [];
    for (let k = 0; k <= 7; k++) { const xx = x + k * 20; pts.push([xx, line(xx) + 6]); }
    p.stroke({ brush: 'bristle', color: colorAt(x + 70, line(x + 70) + 6), width: 12, mix: 0.1, dry: 0, rag: 0.05, points: pts });
  }
}

// The far range, pale with distance.
ridge(farLine, (x, y) => mix(mix('#8fa9d6', '#a4bbe0', nA(x / 70, y / 30)), '#cfe0f1', smooth(farLine(x), HORIZON + 10, y) * 0.8), HORIZON + 14, 22);

// The snow mountain. Its strokes run down the slopes; the side toward the sun is lighter.
{
  const slope = slopeOf(peakLine);
  const rock = (x, y) => {
    const side = clamp((x - PEAK.x) / 260, -1, 1);                // -1 far left (shade), +1 far right (sun)
    let c = mix(mix('#5b74b2', '#6f8ac6', nA(x / 40, y / 40)), '#8fa9dc', clamp(0.5 + side * 0.6, 0, 1));
    return mix(c, '#c4d6ec', smooth(PEAK.y + 60, HORIZON + 10, y) * 0.85);   // haze toward its foot
  };
  const within = (m) => (x, y) => Math.abs(x - PEAK.x) < 620 && y > peakLine(x) + m && y < HORIZON + 12;
  p.fill({ inside: within(11), bounds: [PEAK.x - 620, PEAK.y, PEAK.x + 620, HORIZON + 12], width: 22, length: 130, spacing: 0.5, angle: (x, y) => slope(x) + (nB(x / 60, y / 40) - 0.5) * 0.25, color: rock, stroke: { brush: 'bristle', opacity: 0.96, mix: 0.15, dry: 0.05 } });
  for (const side of [-1, 1]) {                                    // the two outlines of the cone
    const pts = [];
    for (let d = 0; d <= 520; d += 26) pts.push([PEAK.x + side * d, peakLine(PEAK.x + side * d) + 6]);
    p.stroke({ brush: 'bristle', color: side < 0 ? '#6b84be' : '#9ab2e0', width: 12, mix: 0.1, dry: 0, points: pts });
  }
  // snow: from the top down, ending in tongues of different lengths
  const snowEdge = (x) => PEAK.y + 70 + 46 * nC(x / 26, 2) + Math.abs(x - PEAK.x) * 0.16;
  const snow = (x, y) => mix(mix('#cfdcf2', '#e4ecf8', nA(x / 20, y / 20)), '#ffffff', clamp(0.45 + (x - PEAK.x) / 150, 0, 1));
  p.fill({ inside: (x, y) => y > peakLine(x) + 7 && y < snowEdge(x), bounds: [PEAK.x - 300, PEAK.y, PEAK.x + 300, PEAK.y + 190], width: 14, length: 70, spacing: 0.5, angle: slope, color: snow, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.1, dry: 0.1, rag: 0.3 } });
  for (let k = 0; k < 26; k++) {                                   // gullies of snow running further down
    const x = PEAK.x + r.range(-170, 170), y0 = snowEdge(x) - 14, len = r.range(30, 80), a = slope(x) + (x < PEAK.x ? Math.PI : 0);
    if (y0 < peakLine(x) + 16) continue;                           // only where the snow line is on the mountain
    p.tryStroke({ brush: 'bristle', color: snow(x, y0), width: r.range(5, 9), opacity: 0.9, taper: [0, 0.8], mix: 0.1, points: [[x, y0], [x + Math.cos(a) * len * 0.5, y0 + Math.abs(Math.sin(a)) * len * 0.5 + 4], [x + Math.cos(a) * len, y0 + Math.abs(Math.sin(a)) * len + 6]] });
  }
  for (const side of [-1, 1]) {                                    // the white outline near the top
    const pts = [];
    for (let d = 0; d <= 150; d += 15) pts.push([PEAK.x + side * d, peakLine(PEAK.x + side * d) + 5]);
    p.stroke({ brush: 'bristle', color: side < 0 ? '#dfe8f6' : '#ffffff', width: 9, mix: 0.05, dry: 0, points: pts });
  }
}

// Haze lying in front of the mountains.
for (let k = 0; k < 14; k++) {
  const x = r.range(-100, W - 200), y = r.range(HORIZON - 34, HORIZON + 6), len = r.range(260, 520);
  p.stroke({ brush: 'soft', color: mix('#eef5fa', '#fff6e4', r()), width: r.range(30, 56), opacity: r.range(0.14, 0.28), points: wave(x, y, x + len, y + r.range(-6, 6), 4, 1, 7) });
}

// The near hills: wooded, green going blue with distance.
ridge(nearLine, (x, y) => mix(mix('#6f9f8c', '#84b08a', nA(x / 50, y / 20)), '#a9c79a', smooth(nearLine(x), HORIZON + 30, y) * 0.7), HORIZON + 34, 18);
for (let x = -10; x < W + 10; x += r.range(7, 22)) {                // treetops along them
  if (nA(x / 90, 77) < 0.36) continue;
  const h = r.range(12.5, 20), y = nearLine(x) + r.range(2, 10);
  p.tryStroke({ brush: 'bristle', color: mix('#4f8770', '#6a9c7c', r()), width: r.range(6, 10), taper: [0, 0.9], mix: 0, dry: 0, rag: 0.2, points: [[x, y], [x + r.range(-2, 2), y - h]] });
}

p.save();
