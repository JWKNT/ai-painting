// The apple worlds: a yellow one, far off; a green one; and a red one, the nearest. Each is
// a round fruit with a hollow at the top, a stalk and a leaf, and the light sits on its
// shoulder. A great caterpillar has come out of the red apple and gone into the green one,
// and its body hangs between them in an arch.
'use strict';
const { studio, open, SUNWARD, LIGHT3, RED, GREEN, GOLD, far, ball } = require('./scene');
const { glint } = studio;

const p = open('apples');
const r = p.rng;

function apple(c, tones, d, leafSide) {
  const { x, y, r: R } = c;
  ball(p, [[x, y, R], [x - 0.3 * R, y - 0.2 * R, 0.8 * R], [x + 0.3 * R, y - 0.2 * R, 0.8 * R], [x, y + 0.26 * R, 0.8 * R]], tones, { center: [x, y + 0.02 * R, R * 1.1], far: d, grain: 0.12 });
  // the streaks of its skin: thin strokes from the stalk down toward the eye, paler on the lit side
  for (let k = 0; k < Math.round(R / 4); k++) {
    const phi = r.range(-1.25, 1.25), t0 = r.range(0.5, 1.3), t1 = t0 + r.range(0.5, 0.9), pts = [];
    for (let i = 0; i <= 4; i++) { const th = t0 + (t1 - t0) * i / 4; pts.push([x + R * 0.97 * Math.sin(phi) * Math.sin(th), y - R * 0.97 * Math.cos(th) + 0.04 * R]); }
    const lit = Math.sin(phi) * LIGHT3[0] - Math.cos((t0 + t1) / 2) * LIGHT3[1] > 0.1;
    p.tryStroke({ brush: 'bristle', color: far(lit ? tones.streak : tones.shadow, x, y, d), width: Math.max(4.6, R * 0.045), opacity: lit ? 0.3 : 0.22, mix: 0.3, dry: 0.15, rag: 0.4, taper: [0.3, 0.5], points: pts });
  }
  // the hollow the stalk grows from, the stalk, and the leaf
  p.tryStroke({ brush: 'soft', color: far(tones.shadow, x, y, d), width: Math.max(8.2, R * 0.3), opacity: 0.55, points: [[x - R * 0.34, y - R * 0.86], [x, y - R * 0.8], [x + R * 0.34, y - R * 0.86]] });
  const top = [x + R * 0.1, y - R * 1.24];
  p.tryStroke({ brush: 'bristle', color: far('#5a3a20', x, y, d), width: Math.max(5, R * 0.075), mix: 0, dry: 0, rag: 0, cap: 'round', points: [[x, y - R * 0.8], [x + R * 0.02, y - R * 1.02], top] });
  p.tryStroke({ color: far('#c89c5c', x, y, d), width: 4, opacity: 0.8, points: [[x - R * 0.03, y - R * 0.84], [x - R * 0.01, y - R * 1.04], [top[0] - R * 0.03, top[1] + 3]] });
  const tip = [x + leafSide * R * 0.62, y - R * 1.2];
  p.tryStroke({ brush: 'bristle', color: far('#2c8a2c', x, y, d), width: Math.max(8, R * 0.22), taper: [0.25, 0.7], mix: 0, dry: 0, rag: 0.05, cap: 'round', points: [[x + R * 0.02, y - R * 0.98], [x + leafSide * R * 0.3, y - R * 1.2], tip] });
  p.tryStroke({ brush: 'bristle', color: far('#a4e050', x, y, d), width: Math.max(5, R * 0.1), opacity: 0.85, taper: [0.25, 0.7], mix: 0.1, dry: 0, rag: 0.05, cap: 'round', points: [[x + leafSide * R * 0.08, y - R * 1.04], [x + leafSide * R * 0.3, y - R * 1.25], [tip[0] - leafSide * R * 0.06, tip[1] - R * 0.03]] });
  // the light on its shoulder
  const hx = x + LIGHT3[0] * R * 0.66, hy = y + LIGHT3[1] * R * 0.66;
  p.tryStroke({ brush: 'soft', color: far('#ffffff', x, y, d * 0.5), width: Math.max(8.2, R * 0.2), opacity: 0.28, points: [[hx - R * 0.16, hy + R * 0.2], [hx, hy], [hx + R * 0.26, hy - R * 0.1]] });
  p.tryStroke({ brush: 'bristle', color: far('#ffffff', x, y, d * 0.5), width: Math.max(4.6, R * 0.05), opacity: 0.8, mix: 0.2, dry: 0, rag: 0.1, cap: 'round', taper: [0.4, 0.4], points: [[hx - R * 0.1, hy + R * 0.14], [hx + R * 0.02, hy], [hx + R * 0.2, hy - R * 0.08]] });
}

apple(GOLD, { shadow: '#8c6212', half: '#dcae24', lit: '#ffe566', shine: '#fffad6', bounce: '#7c8a78', streak: '#fff2a0' }, 0.34, -1);
apple(GREEN, { shadow: '#185a26', half: '#4fa02e', lit: '#aadb44', shine: '#f2ffc8', bounce: '#2c6e74', streak: '#e0f48c' }, 0.16, 1);
apple(RED, { shadow: '#5c0c1e', half: '#b41d26', lit: '#f14a3a', shine: '#ffd8c0', bounce: '#7c3068', streak: '#ff9a6a' }, 0.04, 1);

// The caterpillar: a body of round joints, pale green, from the hole it made in the red apple
// up and over to the hole it made in the green one. The joints at the green apple are painted
// first, so that each nearer joint lies over the one beyond it.
{
  const A = [RED.x + RED.r * 0.52, RED.y - RED.r * 0.7], B = [GREEN.x - GREEN.r * 0.68, GREEN.y + GREEN.r * 0.5], M = [(A[0] + B[0]) / 2 - 16, Math.min(A[1], B[1]) - 132];
  const at = (t) => [(1 - t) * (1 - t) * A[0] + 2 * t * (1 - t) * M[0] + t * t * B[0], (1 - t) * (1 - t) * A[1] + 2 * t * (1 - t) * M[1] + t * t * B[1]];
  const body = { shadow: '#3c6c1c', half: '#8cb834', lit: '#d8ec6c', shine: '#fbffd0', bounce: '#4c8478' };
  for (const [q, R, d] of [[A, 30, 0.04], [B, 23, 0.16]]) {              // the holes
    p.tryStroke({ brush: 'bristle', color: far('#2a0810', q[0], q[1], d), width: R * 0.9, mix: 0, dry: 0, rag: 0.1, cap: 'round', points: [[q[0] - R * 0.9, q[1] + R * 0.2], [q[0], q[1] + R * 0.36], [q[0] + R * 0.9, q[1] + R * 0.2]] });
  }
  const n = 9;
  for (let i = n; i >= 0; i--) {
    const t = i / n, [x, y] = at(t), rad = 26 - 6 * t, d = 0.04 + 0.12 * t;
    ball(p, [[x, y, rad]], body, { far: d, width: 6 });
    if (i % 2 === 0) p.tryStroke({ brush: 'bristle', color: far('#e8843c', x, y, d), width: 5, opacity: 0.8, mix: 0.1, dry: 0, rag: 0, cap: 'round', taper: [0.2, 0.2], points: [[x - rad * 0.5, y - rad * 0.2], [x - rad * 0.1, y - rad * 0.62], [x + rad * 0.44, y - rad * 0.5]] });   // an orange band across every second joint
  }
  glint(p, [at(0.12), at(0.3), at(0.5), at(0.7), at(0.88)].map(([x, y]) => [x + SUNWARD[0] * 17, y + SUNWARD[1] * 17]), () => '#ffffff', { width: 4.2, dash: 14, gap: 22, opacity: 0.7, rng: r });   // the light along its back
}

p.save();
