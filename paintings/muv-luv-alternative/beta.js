// The BETA, as they are painted here: each kind is a few dark forms with the glare along
// the edges that face it, and the one thing that tells it from the others. `far` (0 near,
// 1 at the horizon) lets the smoke between take its darks.
'use strict';
const { studio, LIGHT, veil } = require('./scene');
const { mix, solid, glint } = studio;

const aged = (tones, x, y, far) => { const out = {}; for (const k of Object.keys(tones)) out[k] = k === 'rim' ? tones[k] : veil(tones[k], x, y, far); return out; };
const base = (s) => ({ light: LIGHT, turn: 0.45, width: Math.max(5, Math.min(7, 5 * s + 1)), length: Math.max(18, 30 * s), vary: 0.06, lights: s > 0.8, dash: 18, gap: 10, edgeOpacity: 0.8 });

const SHELL = { shadow: '#0b1218', half: '#1a302e', lit: '#587868', rim: '#ffb46c', bounce: '#141a2a' };
const FLESH = { shadow: '#160a12', half: '#34121c', lit: '#8c3430', rim: '#ff9a5c', bounce: '#1c1020' };
const HIDE = { shadow: '#140c14', half: '#2c1a22', lit: '#7a4038', rim: '#ffa060', bounce: '#1a1424' };
const CLAW = { shadow: '#3a3038', half: '#8a7870', lit: '#f0d8b8', rim: '#fff0d0', bounce: '#4a4458' };
const RED = { shadow: '#3a0a10', half: '#8a1418', lit: '#e0362a', rim: '#ffb070', bounce: '#4a1020' };

// Legs: dark strokes from under a body to the ground, running.
function legs(p, x, y, s, list, color) {
  for (const [u0, v0, u1, v1, w] of list) p.tryStroke({ brush: 'bristle', color, width: Math.max(4.6, w * s), mix: 0, dry: 0, rag: 0.1, cap: 'round', taper: [0, 0.6], points: [[x + u0 * s, y + v0 * s], [x + (u0 + u1) / 2 * s + 3 * s, y + (v0 + v1) / 2 * s], [x + u1 * s, y + v1 * s]] });
}
// Dust thrown up behind something that runs.
function dust(p, x, y, s, dir) {
  const r = p.rng;
  for (let k = 0; k < 3; k++) p.tryStroke({ brush: 'soft', color: mix('#5a2a2a', '#c86a3a', r()), width: r.range(22, 36) * Math.max(0.8, s), opacity: r.range(0.1, 0.2), taper: [0, 0.6], points: [[x, y - 4 * s], [x - dir * r.range(30, 60) * s, y - r.range(10, 26) * s], [x - dir * r.range(70, 120) * s, y - r.range(20, 50) * s]] });
}

// Destroyer-class: it runs behind a shell of armor as hard as anything on earth. The shell is
// what we see: a great hump, low at the nose. `dir` is -1 if it runs toward the left.
function destroyer(p, x, y, s, dir = -1, far = 0) {
  const r = p.rng, o = base(s), P = (u, v, rad) => (rad == null ? [x + dir * u * s, y + v * s] : [x + dir * u * s, y + v * s, rad * s]);
  dust(p, x - dir * 40 * s, y, s, dir);
  legs(p, x, y, s, [[dir * 30, -20, dir * 44, 0, 8], [dir * 4, -18, dir * 14, 2, 9], [dir * -24, -18, dir * -12, 1, 9], [dir * -48, -16, dir * -40, 0, 7]], veil('#0b0810', x, y, far));
  solid(p, [P(-18, -34, 21), P(-54, -26, 15)], aged(FLESH, x, y, far), o);                                     // the soft body behind
  solid(p, [P(60, -15, 12), P(48, -38, 21), P(18, -56, 27), P(-14, -53, 22)], aged(SHELL, x, y, far), o);      // the shell
  for (const [u0, v0, u1, v1] of [[52, -46, 22, -74], [36, -30, 0, -66], [22, -22, -18, -50]]) {               // the grooves worn in it
    p.tryStroke({ brush: 'bristle', color: veil('#070a0e', x, y, far), width: Math.max(4.4, 4.6 * s), opacity: 0.4, mix: 0.2, dry: 0.1, rag: 0.2, taper: [0.3, 0.3], points: [P(u0, v0), P((u0 + u1) / 2 + 4, (v0 + v1) / 2 - 3), P(u1, v1)] });
  }
}

// Grappler-class: a low wide body on many legs, two great forelimbs that end in pale clubs
// harder than steel, and a tail held up over its back with a pale lump at the end of it.
function grappler(p, x, y, s, dir = -1, far = 0) {
  const o = base(s), P = (u, v, rad) => (rad == null ? [x + dir * u * s, y + v * s] : [x + dir * u * s, y + v * s, rad * s]);
  dust(p, x - dir * 30 * s, y, s, dir);
  legs(p, x, y, s, [[dir * 26, -22, dir * 40, 0, 8], [dir * 6, -20, dir * 12, 2, 8], [dir * -14, -20, dir * -22, 1, 8], [dir * -34, -18, dir * -44, 0, 7]], veil('#0b0810', x, y, far));
  solid(p, [P(-60, -92, 9), P(-52, -70, 6), P(-36, -46, 8)], aged(HIDE, x, y, far), o);                         // the tail
  solid(p, [P(-66, -98, 11), P(-58, -92, 11)], aged(CLAW, x, y, far), o);                                       // the pale thing at its end
  solid(p, [P(-34, -30, 24), P(12, -36, 29)], aged(HIDE, x, y, far), o);                                        // the body
  for (const [du, dv] of [[-10, -6], [6, 4]]) {                                                                 // the two forelimbs and their clubs
    solid(p, [P(12 + du, -50 + dv, 12), P(40 + du, -80 + dv, 10), P(60 + du, -62 + dv, 10)], aged(HIDE, x, y, far), o);
    solid(p, [P(60 + du, -62 + dv, 14), P(82 + du, -40 + dv, 11)], aged(CLAW, x, y, far), o);
  }
}

// Tank-class: small, red, quick, all mouth. One alone is nothing; they come in thousands.
function tank(p, x, y, s, dir = -1, far = 0) {
  const r = p.rng, o = base(s), P = (u, v, rad) => (rad == null ? [x + dir * u * s, y + v * s] : [x + dir * u * s, y + v * s, rad * s]);
  legs(p, x, y, s, [[dir * 12, -12, dir * 20, 0, 6], [dir * -2, -12, dir * 2, 1, 6], [dir * -16, -12, dir * -22, 0, 6]], veil('#12060a', x, y, far));
  solid(p, [P(-18, -20, 14), P(14, -24, 17)], aged(RED, x, y, far), o);                                         // the body
  solid(p, [P(10, -34, 7), P(30, -44, 6), P(40, -30, 5)], aged(RED, x, y, far), o);                             // an arm, reaching
  if (s >= 1.2) {                                                                                               // the mouth, low on its front, and the pale line of its teeth
    p.tryStroke({ brush: 'bristle', color: '#12050a', width: 7 * s, mix: 0, dry: 0, rag: 0, cap: 'round', points: [P(6, -11), P(20, -15), P(30, -24)] });
    glint(p, [P(4, -15), P(18, -19.5), P(29, -28)], () => mix('#a89080', '#e8d4b4', r()), { width: 4, dash: 13, gap: 7, opacity: 0.6, rng: r });
  }
}

module.exports = { destroyer, grappler, tank, dust, legs, aged, base, SHELL, FLESH, HIDE, CLAW, RED };
