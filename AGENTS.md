# AI Painting: the tool and the page

`engine/`, `lib/`, `player/` and `tools/` are the painting tool, and `README.md` describes it.
`paintings/<name>/` holds one painting: its pass scripts, the recording (`painting.json`), the image and a self-contained `playback.html`.
`index.html`, `<name>/index.html` and `assets/` are the jehlp.net pages at `/ai-painting/`.

## The medium

- A painting is only its recorded strokes. Nothing else may reach the canvas: no image generator, no imported picture, no per-pixel drawing.
- The limits are the `RULES` constants in `engine/paint-engine.js`. The owner set them. Do not loosen them or add a way around them.
- A painting grows in passes. Repaint the latest pass freely; earlier passes are painted over, not edited.
- `node tools/validate.js paintings/<name>` checks a recording against the rules. `npm test` checks every published painting.
- A change to the engine changes how old recordings replay. Each `playback.html` carries the engine that made it; the site pages use the current one. Repaint and rebuild after an engine change, and compare the pictures.

## The manner

The owner wants the paintings painterly, in the manner of the Outer Wilds painting, not cartoon-like.

- Paint by light. Choose where the light is, and let each form be dark where it turns from the light and bright along the edge that faces it.
- Use no outlines, no flat shapes of one color, and no symbols for things (ring eyes, V-shaped birds, lollipop trees).
- Keep figures small against the land, with natural proportions. Against the light they are dark shapes with a bright edge.
- Let the strokes show and follow the form. Put mist, glow and distance between the planes.
- `lib/kit.js` has the helpers for this: `solid` (a form built from rounded parts), `mass` (a soft heap such as blossom or cloud), `form` and `glint`.
- Look at close crops of the result, and at the whole picture at the size of the page.

## The page

Read `../site-theme/PHILOSOPHY.md`, `../site-theme/docs/DESIGN-SYSTEM.md` and `../site-theme/docs/WRITING-STYLE.md` before a change to the page.
Use ASD-STE100 Issue 9 for the page text. Describe the style as ASD-STE100-guided.
`assets/mark.png` and `assets/favicon.png` are copies of the `ai-painting` mark in site-theme.

- The pages are generated and checked in. Edit `tools/build-site.js`, `assets/page.css` or a painting's `about.json`, then run `npm run build` and `npm test`.
- A painting is on the site when its folder has an `about.json`: title, order, alternative text, a one-sentence summary and the paragraphs below the picture. `{strokes}` becomes the stroke count.
- The landing page shows every painting at one height, whatever its shape. Keep that when the layout changes.
- The build makes the JPEG copies in `assets/paintings/` with `sips`, so it runs on a Mac.
- The player on a painting page is `player/player.js`, the same file that each `playback.html` contains. It records the video in the browser with MediaRecorder, in real time.
