# ai-painting

Paintings made by code, one brush stroke at a time. No image generation: the canvas starts as one flat color and every pixel after that arrives through a recorded stroke.

## Rules

The engine refuses any stroke that breaks these. They are the `RULES` constants at the top of `engine/paint-engine.js`.

- The canvas is at most 1600px on its long side.
- A brush is at least 4px wide, measured at half strength, so a soft brush has to be wider.
- Every stroke travels at least twice its own width, and at least 12px. Wiggling in place does not count; the path has to span that distance.
- Any hex color, at any opacity.

`node tools/validate.js paintings/<name>` re-checks a finished recording stroke by stroke. `node tools/passes.js paintings/<name>` counts the strokes of each pass. `node tools/dry-run.js <pass script>` runs one pass without saving it and lists every stroke that breaks a rule.

## Brushes

`round` clean edge · `soft` airbrush · `flat` square ends, light bristle marks · `bristle` streaky, drags wet color · `dry` broken, runs out of paint · `wash` translucent, pools at the edge · `blend` no paint, smears what is there

Each is a preset of the same parameters (`hardness`, `streak`, `jitter`, `mix`, `dry`, `load`, `rag`, `wobble`, `pool`, `cap`), and any of them can be set per stroke, along with `opacity`, `taper` and per-point pressure.

## Painting

```js
const studio = require('../../lib/studio');
const p = studio.open(__dirname, { pass: 'sky', size: [1600, 1200], background: '#f3eee3' });

p.stroke({ brush: 'bristle', color: '#27496d', width: 40, points: [[100, 200], [400, 180], [700, 260]] });
p.fill({ inside: (x, y) => y > 800, angle: 0.2, width: 24, color: '#5a7d3c', stroke: { brush: 'flat' } });

p.save();   // painting.json (the recording), painting.png, playback.html
```

A painting grows in passes. A new pass name appends strokes; the latest pass can be re-run to repaint it; earlier passes are only ever painted over.

`lib/kit.js` holds colors, noise, curves and a few ways to paint a form by its light with no outline: `solid` builds a body from rounded parts, `orb` a ball with any light on it, `mass` a soft heap such as blossom or cloud, `form` a single limb, `glint` a broken line of light. `camera` draws a whole scene from one eye and one lens, `inPoly` tests a place against an outline, and `glow` puts a round light about a small thing.

## Watching

Open `paintings/<name>/playback.html`. It is one self-contained file: the recording plus the same engine that painted it, so the replay is the painting being made again, stroke by stroke. Space plays and pauses, the timeline scrubs, the ticks mark passes. Choose a playback length of 5 minutes or less, then Save video makes an MP4 file of the replay at that length. The player makes it frame by frame with the browser's H.264 encoder (WebCodecs) and writes the MP4 file itself, so every browser gives the same kind of file, and a fast computer makes it in less time than the replay takes.

`node tools/render.js paintings/<name> --upto 500 --crop 0,0,800,600 --scale 2` renders any moment or detail to a PNG. `node tools/build-player.js paintings/<name>` rebuilds the playback page without repainting.

## The page

The paintings are published at [jehlp.net/ai-painting](https://jehlp.net/ai-painting/), in three tabs: Paintings, Brushes (the brush test) and Canvas. A painting appears there when its folder has an `about.json`. `npm run build` writes the pages, and `npm test` checks the pages, the rules, the MP4 writer and every published recording.

Canvas (`canvas/`, `assets/canvas.js`) lets a person paint with the same engine, brushes and rules. It keeps the painting in the browser, and its Play back uses the player of the paintings, with the same MP4 video.
