// The child, and the things near us. The child is small and far below the cat. It runs
// home along the path with a paper lantern on a stick, and it does not look up. The
// lantern lights the front of the child and a round of the path; the child's shade goes
// back along the path behind it. In the corners near us are reeds, and a few fireflies
// are out over the water.
'use strict';
const { studio, open, W, H, BANK, CHILD } = require('./scene');
const { mix, glow, disc } = studio;

const p = open('child');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.06, dry: 0, rag: 0.05, cap: 'round' };
const { x: X, feet: F } = CHILD;
const LAN = [X + 50, F - 54];                            // the lantern

// ---------------------------------------------------------------- the light of the lantern on the path, and the child's shade
for (const [w, op] of [[56, 0.1], [34, 0.16]]) glow(p, LAN[0] - 6, F + 1, w, '#f0984c', op, 6, 0.26);
p.stroke({ brush: 'soft', color: '#12102a', width: 11, opacity: 0.5, taper: [0.2, 0.9], points: [[X - 4, F + 1], [X - 60, F + 3], [X - 130, F + 4]] });

// ---------------------------------------------------------------- the child
const SKIN = ['#8c5c64', '#ffcf9c'], CLOTH = ['#7c74a8', '#ffeccc'], BLUE = ['#23234c', '#5c5488'], HAIR = ['#2c1820', '#b0603c'];
// the back leg, the back arm
p.stroke({ ...line, color: SKIN[0], width: 7, taper: [0, 0.2], points: [[X - 2, F - 44], [X - 13, F - 22], [X - 27, F - 6]] });
p.stroke({ ...line, color: '#3c2c38', width: 6, points: [[X - 25, F - 7.4], [X - 37, F - 1]] });                              // its foot: the heel is up
p.stroke({ ...line, color: CLOTH[0], width: 6, points: [[X + 4, F - 73], [X - 6, F - 60], [X - 14, F - 50]] });
// the front leg
p.stroke({ ...line, color: mix(SKIN[0], SKIN[1], 0.5), width: 7.4, taper: [0, 0.2], points: [[X + 2, F - 44], [X + 17, F - 26], [X + 25, F - 4]] });
p.tryStroke({ brush: 'round', color: SKIN[1], width: 4, opacity: 0.8, points: [[X + 8, F - 40], [X + 20, F - 25], [X + 28, F - 6]] });
p.stroke({ ...line, color: '#3c2c38', width: 6, points: [[X + 23, F - 2.4], [X + 36.4, F - 1.4]] });
// the skirt: dark blue, and it swings back
for (const [dx, c] of [[-10, 0], [-2, 0.3], [6, 1]]) p.stroke({ ...line, color: mix(BLUE[0], BLUE[1], c), width: 9, points: [[X + dx * 0.4, F - 54], [X + dx, F - 36]] });
// the body: a white top. Its front is in the light of the lantern.
p.stroke({ ...line, color: CLOTH[0], width: 10, points: [[X - 3, F - 50], [X + 2, F - 76]] });
p.stroke({ ...line, color: mix(CLOTH[0], CLOTH[1], 0.75), width: 9, points: [[X + 4, F - 50], [X + 9, F - 76]] });
p.tryStroke({ brush: 'round', color: '#c8404c', width: 4, points: [[X + 2, F - 78], [X + 14, F - 75]] });                      // the red at its neck
// the head: brown hair, cut short, which goes back in the wind of its running; the face is to the right, in the light
disc(p, X + 10, F - 89, 9.6, HAIR[0], 6);
p.stroke({ ...line, color: HAIR[0], width: 7, taper: [0, 0.7], points: [[X + 6, F - 93], [X - 3, F - 88], [X - 10, F - 80]] });
p.stroke({ ...line, color: SKIN[1], width: 6, points: [[X + 15.5, F - 92], [X + 16.5, F - 79.5]] });
p.tryStroke({ brush: 'round', color: HAIR[1], width: 4, opacity: 0.9, points: [[X + 5, F - 97], [X + 13, F - 98.5], [X + 19, F - 94]] });
// the front arm, which holds the stick out; the stick; and the lantern that hangs from it
p.stroke({ ...line, color: mix(CLOTH[0], CLOTH[1], 0.8), width: 6, points: [[X + 8, F - 73], [X + 19, F - 62], [X + 30, F - 66]] });
p.stroke({ ...line, mix: 0, color: '#1c1420', width: 4.8, points: [[X + 28, F - 65], [LAN[0], F - 78]] });
p.stroke({ brush: 'round', color: '#1c1420', width: 4, points: [[LAN[0], F - 79], [LAN[0], F - 66.6]] });
for (const [w, op] of [[70, 0.09], [40, 0.16], [22, 0.3]]) glow(p, LAN[0], LAN[1], w, '#ffb050', op, 6);
for (const dx of [-4.6, 4.6, 0]) p.stroke({ ...line, mix: 0, color: dx ? '#ffc860' : '#ffe49c', width: 7, points: [[LAN[0] + dx, LAN[1] - 9.4], [LAN[0] + dx, LAN[1] + 9.4]] });
p.stroke({ brush: 'round', color: '#fff6d8', width: 5, points: [[LAN[0], LAN[1] - 6.2], [LAN[0], LAN[1] + 6.4]] });
for (const dy of [-12, 12]) p.stroke({ ...line, cap: 'flat', mix: 0, color: '#1c1420', width: 5, points: [[LAN[0] - 6.4, LAN[1] + dy], [LAN[0] + 6.4, LAN[1] + dy]] });
// the lantern, in the water
for (let k = 0; k < 6; k++) p.tryStroke({ brush: 'soft', color: '#ffb050', width: 9, opacity: 0.4 - k * 0.05, taper: [0.3, 0.3], points: [[LAN[0] - r.range(8, 16), BANK + 46 + k * 15], [LAN[0] + r.range(8, 16), BANK + 46 + k * 15 + r.range(-1, 1)]] });

// ---------------------------------------------------------------- reeds in the two corners near us
function reeds(x0, x1, n, lean) {
  for (let k = 0; k < n; k++) {
    const x = r.range(x0, x1), h = r.range(90, 230), top = H - h, bend = lean * r.range(20, 70) + r.range(-14, 14), c = mix('#0c0c20', '#1c2038', r());
    p.tryStroke({ ...line, mix: 0, color: c, width: r.range(5, 7.5), taper: [0, 0.8], points: [[x, H + 6], [x + bend * 0.3, H - h * 0.55], [x + bend, top]] });
    if (r() < 0.4) p.tryStroke({ ...line, mix: 0, rag: 0.3, color: mix('#2c2036', '#4c3444', r()), width: 9, taper: [0.5, 0.5], points: [[x + bend - lean * 2, top + 6], [x + bend + lean * 5, top - 20]] });        // its head of seed
    if (r() < 0.5) p.tryStroke({ brush: 'round', color: '#c07868', width: 4, opacity: 0.45, taper: [0.2, 0.8], points: [[x + bend * 0.2 - 3, H - h * 0.4], [x + bend * 0.75 - 3, top + h * 0.12]] });            // the red of the sky on one side of it
  }
}
reeds(-10, 150, 34, 1); reeds(1470, W + 10, 26, -1);

// ---------------------------------------------------------------- fireflies
// Each is a small soft light with no edge: a hard mark in it would make it a sign, not a light.
for (const [x, y] of [[96, 806], [176, 852], [222, 768], [70, 700], [1500, 852], [1440, 910], [1548, 800], [310, 906], [1296, 940], [140, 930], [1390, 840]]) { glow(p, x, y, 20, '#a8d848', 0.12, 8); glow(p, x, y, 9, '#e4ff8c', 0.42, 8); }

p.save();
