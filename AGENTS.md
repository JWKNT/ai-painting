# AI Painting: the tool and the page

`engine/`, `lib/`, `player/` and `tools/` are the painting tool, and `README.md` describes it.
`paintings/<name>/` holds one painting: its pass scripts, the recording (`painting.json`), the image and a self-contained `playback.html`.
`index.html`, `<name>/index.html` and `assets/` are the jehlp.net pages at `/ai-painting/`.

## The medium

- A painting is only its recorded strokes. Nothing else may reach the canvas: no image generator, no imported picture, no per-pixel drawing.
- The limits are the `RULES` constants in `engine/paint-engine.js`. The owner set them. Do not loosen them or add a way around them.
- A painting grows in passes. Repaint the latest pass freely; earlier passes are painted over, not edited.
- `node tools/validate.js paintings/<name>` checks a recording against the rules. `npm test` checks every published painting.
- `node tools/passes.js paintings/<name>` counts the strokes of each pass. Run it before you publish: the subject of a picture must not be a small part of it.
- A change to the engine changes how old recordings replay. Each `playback.html` carries the engine that made it; the site pages use the current one. Repaint and rebuild after an engine change, and compare the pictures.

## The manner

The owner wants the paintings painterly, in the manner of the Outer Wilds painting, not cartoon-like.

- Paint by light. Choose where the light is, and let each form be dark where it turns from the light and bright along the edge that faces it.
- Use no outlines, no flat shapes of one color, and no symbols for things (ring eyes, V-shaped birds, lollipop trees).
- Keep figures small against the land, with natural proportions. Against the light they are dark shapes with a bright edge.
- Let the strokes show and follow the form. Put mist, glow and distance between the planes.
- `lib/kit.js` has the helpers for this: `solid` (a form built from rounded parts), `mass` (a soft heap such as blossom or cloud), `form` and `glint`.
- Look at close crops of the result, and at the whole picture at the size of the page.

What has worked:

- Paint a dark thing against a bright sky with `mix: 0`. A wet brush picks up the sky, and the dark turns to brown.
- `mass` with its own flow looks like fur. For a sea of clouds, give it a level `flow` and low domes that stand in a floor, and put short lights on the tops in place of `crown`.
- `solid` uses the `rim` tone inside the form on its lit side. Leave `rim` out of the tones for a part that the light cannot reach.
- For a small figure, leave no gap between the arms and the body, keep the neck short, and set the head down on the shoulders.
- For a huge building far away, paint thin floors of short dark marks. A grid of level and upright lines looks like brick.
- For a crowd far away, use plain dark marks of slightly different sizes and tilts. A small symbol repeated many times, such as an arch, becomes a pattern.
- Keep bright lines such as lasers few, and keep them clear of the main figure.
- Paint a mountain range peak by peak, far ones first. Give each peak one face in the light and one in shadow, divided by a ridge that leans, and a spur or two. A row of equal cones looks drawn, and narrow stripes of light look like a wall.
- Paint a forest as trees that stand close, each one stroke, from the far ones to the near ones. A single row of trees along the top of a hill looks like pegs.
- The light can come from the side with the sun out of the picture. `paintings/utawarerumono` does this.
- A ball, such as a world or a fruit, is `orb` in the kit: give it the color of each place from the light on that place. If its strokes follow a flow of your own, lay a dark ground under it first.
- A point of light cannot be a dot. A short level touch with a soft glow under it looks like a star. Three or more soft strokes that cross look like a soft round light. Hard strokes that cross look like a snowflake.
- In a hall or a street, put everything on one vanishing point, and make each person's height a fixed part of the distance from the feet to the eye line.
- A small arch or cross that repeats becomes a symbol: waves like fish scales, foam like eyebrows. Vary the shape, or use straight ragged dabs.
- Paint rain as slanted strokes at three depths and low opacity.
- A painting can keep its repeated things in a module of its own. `paintings/muv-luv-alternative/beta.js` paints each kind of creature at a given place, size and distance.
- A painting of a known work must show what makes it that work. Before you paint, find the look of the place and of its people from references. Choose a scene with the things that no other work has: a mask, ears and tails, a white tiger. A landscape with two small travelers can be from any story.
- A round thing that is turned, such as a tower, a column, a dome or a trunk, is lanes that follow its swell, closer together toward its edges, each piece toned by how it faces the light. `turned` in `paintings/made-in-abyss/scene.js` does this, with rings, windows, crust and a twist.
- A big thing looks big when it goes out of the picture and we look up at the under side of it.
- Figures can be a third of the height of the picture or more. Paint each from the side or from behind, as `solid` forms with folds of dark and light, and leave the face as light and shade.
- A machine is flat plates over its rounded parts: straight strokes with flat ends, a hard edge, light on the edges that take it.
- A flower is a dab that stands the way the grass does, not strokes that cross. A storm on a world is short strokes round a middle, not rings. A butterfly wing is one stroke, thin at the body.
- Give a scene one scale. Choose how high the eye is over the ground. A thing that stands on flat ground at the height y of the picture is then (y - horizon) / eye to the metre. `paintings/fate` sizes every sword this way.
- Choose a pose with a clear outline. Two figures in an embrace become one dark knot. Two figures that stand face to face, or side by side with their backs to us, stay two people.
- A skirt, a coat or a bell of cloth is a filled shape with folds that go out from the waist: give the fill an angle that fans from a point above the waist, and color it by the fold. Thin cloth lets the sky show through it.
- A wing, or a corner of cloth in the wind, is a few long strokes that leave one place and meet again at the tip. Separate feathers look like planks.
- A soft round light is six or more soft strokes that cross at its middle. Fewer look like a star with rays.
- A bubble is a rim with no break in it, in lengths that lie over each other at their ends, and a soft shine inside. A broken rim looks like a dashed ring.
- A fire is a soft glow with tongues of all sizes that lean one way. Tongues of one size in a row look like a sign for a fire.
- A person far off: paint the head as the top of a short upright stroke, then cover the rest of that stroke with the shoulders.
- The sun can be behind us. Then the picture is in full light, flowers face us, and each thing has its shade on one side. `paintings/wonderful-everyday` does this.
- A thing that repeats can have a painter in `scene.js`: `sword` in `paintings/fate`, `sunflower` in `paintings/wonderful-everyday`. Far off, each returns a single mark.
- The subject gets the most care, not the scenery. A fill of sky or grass makes thousands of strokes with one call, and a figure of a few rounded parts makes a few hundred, so the count of strokes shows where the care went. The owner saw this: characters must not be blobs in a careful landscape.
- A figure needs a face that can be read, hands, and the particular things of its clothes: a collar and its line, cuffs, frills, laces, a pattern on a blade. Paint the body in one pass and give the head, the hands and these things as much code as the body.
- `shape` in the kit paints any outline by its light, as `solid` does for rounded parts. Use it for a face seen from the side (brow, nose, lips, chin as one outline), a hand, a flipper, a claw, a blade, a flying corner of cloth.
- A face from the side is: the outline of the face in skin; a short dark stroke for the eye; a stroke for the mouth; then the hair as shapes over it. To tilt the head, turn all its points about the neck.
- No stroke can be shorter than 12px, so a small eye is a longer stroke with its top covered by the hair over the brow.
- A mark thinner than 4.8px must use the round brush: the bristle brush is too soft at its edge to meet the rule at 4px.
- Paint a figure at the scale of the things beside it. If it must be bigger, bring it nearer; do not let it stand as a giant among small flowers.
- Light a backlit figure from the side, not from the place of the glow. A glow at the horizon is below a tall figure's head, and light from below looks wrong.

## The page

Read `../site-theme/PHILOSOPHY.md`, `../site-theme/docs/DESIGN-SYSTEM.md` and `../site-theme/docs/WRITING-STYLE.md` before a change to the page.
Use ASD-STE100 Issue 9 for the page text. Describe the style as ASD-STE100-guided.
`assets/mark.png` and `assets/favicon.png` are copies of the `ai-painting` mark in site-theme.

- The pages are generated and checked in. Edit `tools/build-site.js`, `assets/page.css` or a painting's `about.json`, then run `npm run build` and `npm test`.
- A painting is on the site when its folder has an `about.json`: title, order, alternative text, a one-sentence summary and the paragraphs below the picture. `{strokes}` becomes the stroke count.
- The landing page shows the paintings by `order`, newest first. Give a new painting order 1 and move the others down.
- The landing page shows every painting at one height, whatever its shape. Keep that when the layout changes.
- The build makes the JPEG copies in `assets/paintings/` with `sips`, so it runs on a Mac.
- The player on a painting page is `player/player.js`, the same file that each `playback.html` contains. It records the video in the browser with MediaRecorder, in real time.
