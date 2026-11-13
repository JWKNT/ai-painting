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

## The page

Read `../site-theme/PHILOSOPHY.md`, `../site-theme/docs/DESIGN-SYSTEM.md` and `../site-theme/docs/WRITING-STYLE.md` before a change to the page.
Use ASD-STE100 Issue 9 for the page text. Describe the style as ASD-STE100-guided.
`assets/mark.png` and `assets/favicon.png` are copies of the `ai-painting` mark in site-theme.

- The pages are generated and checked in. Edit `tools/build-site.js`, `assets/page.css` or a painting's `about.json`, then run `npm run build` and `npm test`.
- A painting is on the site when its folder has an `about.json`: title, order, alternative text, a one-sentence summary and the paragraphs below the picture. `{strokes}` becomes the stroke count.
- The landing page shows every painting at one height, whatever its shape. Keep that when the layout changes.
- The build makes the JPEG copies in `assets/paintings/` with `sips`, so it runs on a Mac.
- The player on a painting page is `player/player.js`, the same file that each `playback.html` contains. It records the video in the browser with MediaRecorder, in real time.
