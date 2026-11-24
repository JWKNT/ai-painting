// The five who are here. On the ends of the four fingers stand the God Hand, each as small
// as a fly on a tower, black against the fire: the tall one with the great bare head, the
// one with wings, the small one that floats, and the one that is low and round. In the
// middle of the palm kneels Griffith, with his back to us: pale, with long white hair, in
// the light, and his shade lies toward us.
'use strict';
const { studio, open, SUN, FINGERS, GRIFFITH, fire, flesh } = require('./scene');
const { mix } = studio;

const p = open('figures');
const r = p.rng;
const DARK = '#0e050c', RIM = '#ffd890';
const blot = (pts, w, color = DARK, o = {}) => p.stroke({ brush: 'round', color, width: w, ...o, points: pts });
const tip = (name) => { const f = FINGERS.find((q) => q.name === name); return [f.x + f.lean, f.tip + 3]; };
// the fire behind each of them, so that it stands clear
for (const f of FINGERS) for (let i = 0; i < 6; i++) { const a = i * Math.PI / 6 + r() * 0.3, x = f.x + f.lean, y = f.tip - 20, w = 30, l = w * 1.06; p.stroke({ brush: 'soft', color: '#ffb458', width: w, opacity: 0.07, points: [[x - Math.cos(a) * l, y - Math.sin(a) * l], [x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l]] }); }

// the tall one, on the middle finger: a long cloak that is wide at its foot, and a head that is too big, bare and round
{
  const [x, y] = tip('middle');
  blot([[x, y - 1, 1], [x, y - 20, 0.8], [x, y - 40, 0.55]], 17);
  blot([[x - 8.6, y - 47], [x + 8.6, y - 47]], 8.4);                           // the head
  blot([[x - 7, y - 54], [x + 7, y - 54]], 6.6);
  blot([[x - 8, y - 57], [x, y - 59.5], [x + 8, y - 57]], 4, RIM, { opacity: 0.8, taper: [0.3, 0.3] });   // the fire on the top of it
}
// the one with wings, on the first finger: a slight body, and two dark wings that are lifted
{
  const [x, y] = tip('index');
  blot([[x, y - 1, 1], [x, y - 16, 0.8], [x + 1, y - 30, 0.6]], 10);
  for (const e of [-1, 1]) {                                                   // each wing goes up and out from the back and comes down to a point, and is dark all through
    blot([[x + e * 2, y - 27], [x + e * 14, y - 39], [x + e * 25, y - 35], [x + e * 31, y - 17]], 7, DARK, { taper: [0, 0.6] });
    blot([[x + e * 4, y - 24], [x + e * 15, y - 29], [x + e * 23, y - 22]], 9, DARK, { taper: [0, 0.5] });
  }
  blot([[x, y - 30], [x + 1, y - 42.8]], 6.2);                                 // the head
  blot([[x - 5, y - 45], [x + 1, y - 47.5], [x + 8, y - 45]], 4, RIM, { opacity: 0.75, taper: [0.3, 0.3] });
}
// the small one, over the third finger: it does not stand, it hangs in the air, a round thing as big as a child
{
  const [x, y] = tip('ring');
  blot([[x - 6.6, y - 19.5], [x + 6.6, y - 19.5]], 6.4);
  blot([[x - 6.6, y - 24.5], [x + 6.6, y - 24.5]], 6.4);
  blot([[x - 6.2, y - 28.5], [x + 6.2, y - 28.5]], 5.4);
  blot([[x, y - 17], [x + 1, y - 4.6]], 4.2, DARK, { taper: [0, 0.7] });
  blot([[x - 6.2, y - 31], [x, y - 33], [x + 6.2, y - 31]], 4, RIM, { opacity: 0.75, taper: [0.3, 0.3] });
}
// the low round one, on the little finger: a heavy body bent over, with the head down between the shoulders
{
  const [x, y] = tip('little');
  blot([[x - 10.2, y - 4], [x + 10.2, y - 4]], 10);
  blot([[x - 9, y - 11], [x + 9, y - 11]], 8.8);
  blot([[x - 6, y - 17.5], [x + 7.6, y - 17.5]], 6.5);
  blot([[x - 6, y - 20.5], [x + 1, y - 22], [x + 8, y - 20]], 4, RIM, { opacity: 0.7, taper: [0.3, 0.3] });
}

// Griffith, in the middle of the palm. He kneels and sits back on his heels, with his back to us, and looks up at the black sun.
// So he is wide low down and narrow at the head. The light is on the top of his head and his shoulders; his back is in his own shade.
{
  const { x, y } = GRIFFITH;
  p.stroke({ brush: 'soft', color: flesh(0.06), width: 20, opacity: 0.42, points: [[x, y + 4], [x + 1, y + 24], [x + 2, y + 46]] });   // his shade, toward us
  blot([[x - 11, y], [x + 11, y]], 8.4, '#6a3c44');                                           // his legs, folded under him
  blot([[x - 8, y - 4.5], [x + 8, y - 4.5]], 5, '#8c5c5c', { opacity: 0.9 });
  blot([[x - 3.4, y - 4], [x - 2.4, y - 18]], 6.4, '#946868');                                // his back, thin, wound in cloth
  blot([[x + 3.4, y - 4], [x + 2.4, y - 18]], 6.4, '#a87c74');
  blot([[x - 0.4, y - 30], [x - 0.6, y - 16], [x + 0.6, y - 8]], 6.4, '#dccfca', { taper: [0, 0.55] });   // his long white hair, down his back
  blot([[x - 6.2, y - 21], [x - 9, y - 9]], 4.2, '#f0cfae', { opacity: 0.85, taper: [0, 0.4] });           // the light on each shoulder and down each arm
  blot([[x + 6.2, y - 21], [x + 9, y - 9]], 4.2, '#f6d8b6', { opacity: 0.9, taper: [0, 0.4] });
  blot([[x - 6.2, y - 30], [x, y - 32.5], [x + 6.2, y - 30]], 4.4, '#fff8ec');                // the light on the top of his head
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 6 + r() * 0.3, w = 26, l = w * 1.06; p.stroke({ brush: 'soft', color: '#ffc890', width: w, opacity: 0.04, points: [[x - Math.cos(a) * l, y - 14 - Math.sin(a) * l], [x, y - 14], [x + Math.cos(a) * l, y - 14 + Math.sin(a) * l]] }); }
}

p.save();
