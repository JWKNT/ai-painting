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
- The sun can be behind us. Then the picture is in full light, flowers face us, and each thing has its shade on one side. The first Wonderful Everyday painting did this; it is in the history of `paintings/wonderful-everyday`.
- A thing that repeats can have a painter in `scene.js`: `sword` in `paintings/fate`, `tower` in `paintings/final-fantasy-x`. Far off, each returns a single mark.
- The subject gets the most care, not the scenery. A fill of sky or grass makes thousands of strokes with one call, and a figure of a few rounded parts makes a few hundred, so the count of strokes shows where the care went. The owner saw this: characters must not be blobs in a careful landscape.
- A figure near us needs hands and the particular things of its clothes: a collar and its line, cuffs, frills, laces, a pattern on a blade. Give these as much code as the body.
- A face is the hard part: no stroke is narrower than 4px or shorter than 12px. The owner said so, and asked for scenes that are more about the place. Choose a view that needs no face: the place or a creature is the subject, and the people are far off or have their backs to us. Five paintings were painted again this way: `paintings/final-fantasy-x`, `paintings/re-zero`, `paintings/wonderful-everyday`, `paintings/fate` (Archer, big in the middle, was taken out: the picture is the land of swords, with no one in it) and `paintings/explorers-of-sky` (which went back to its first, small figures).
- `shape` in the kit paints any outline by its light, as `solid` does for rounded parts. Use it for a face seen from the side (brow, nose, lips, chin as one outline), a hand, a flipper, a claw, a blade, a flying corner of cloth.
- A face from the side is: the outline of the face in skin; a short dark stroke for the eye; a stroke for the mouth; then the hair as shapes over it. To tilt the head, turn all its points about the neck.
- No stroke can be shorter than 12px, so a small eye is a longer stroke with its top covered by the hair over the brow.
- A mark thinner than 4.8px must use the round brush: the bristle brush is too soft at its edge to meet the rule at 4px.
- Paint a figure at the scale of the things beside it. If it must be bigger, bring it nearer; do not let it stand as a giant among small flowers.
- Light a backlit figure from the side, not from the place of the glow. A glow at the horizon is below a tall figure's head, and light from below looks wrong.
- One eye and one lens can place a whole scene. `at` in `paintings/wonderful-everyday/scene.js` puts a place in metres (to the right, up, away) into the picture. Sizes, shadows and the lines of a floor all come from it.
- Water on a floor, seen from low, is the sky turned over about the line of the eye, with level touches across it and a path of small lights under the sun. `mirror` in that scene does this. A thing that stands in the water shows under itself as upright strokes that the level touches break.
- A wire fence is its posts and its top rail, dark against the sky. The net is two sets of thin strokes that cross, much wider apart than the real wires, at low opacity. Far off they close into a grey.
- Strokes that go round each round top of a cloud leave a hole in its middle, and the cloud becomes a heap of eyes. Let the strokes go one way through the whole cloud, and put a broad light down its sun side.
- A lamp far off is soft strokes that cross, with a second, brighter set in the middle. A hard touch of flame in it looks like a pill.
- A rider far off, from behind, is an upright mark for the head, a cloak over it, and a wider mark for the mount. Nearer, add the hips, the legs, a thick tail, and the head of the mount past the rider's shoulder, on one side or the other. A row of posts that each have one curved tail looks like anchors.
- Hair or cloth that the wind takes is one shape that narrows to a tip, with a few loose strands. At a small size separate locks are planks, because no stroke is thinner than 4px.
- A long fin or tail bends as one curve. Take its middle line through a mean of near places, not straight from point to point, and paint its red or dark end as a part of the same outline.
- When a second version of a figure is less clean than the first, go back. `git checkout <commit> -- <pass files>` brings a pass back, and the painting comes out the same as it did then. Small backs that are painted cleanly are better than big figures with faces.
- The face of a beast: the lower jaw hangs from a hinge far back, so the open mouth is a wedge, not a smile; seen from the side, the sky shows between the two jaws, and there is no red inside to see; the teeth are blunt blocks of different sizes, close together; the eye lies in a dark hollow under a brow, with a lid over the top of it. A red wedge, teeth like ticks and a dash for an eye make a cartoon. `paintings/re-zero/05-whale.js` has both jaws as curves (`lip`, `jaw`, `chin`).
- A star is too small for strokes that cross: three soft strokes of the smallest width make a snowflake. Use the short level touch in a soft glow.
- A blade of steel has a thick dark back, a groove, a flat that holds the dark of the sky, a slope down to the edge that takes the light, and a bright line on the edge. A blade of water or glass is dark at its back, has a band of light inside it and warm light through its thin edge, and has a little glow in the air round it. `paintings/final-fantasy-x/06-relics.js` paints both with the `tint` of `shape`.
- A rock against the light is darker than the ground round it, with light only along the tops of its lumps. A wide lit top over a dark side looks like a cake or a mushroom.
- Cloud that the wind has torn: strokes with round ends that thin out, and loose threads off the edges. Strokes with square ends make a cloud of small squares.
- To show the sky through a gap in a thing, paint nothing in the gap: keep the thing's own fill out of it, and the sky that an earlier pass painted shows there with its own strokes. A fill of sky color in a later pass is a patch; the eye sees where it stops.
- Two short broad things that stand side by side, each with a round mark near its top, look like two small people with eyes. If a picture must have no figure, give each thing the outline of what it is: a long sword is a cross.
- A hill is a hill only if its top is above the line of the eye. Give a far figure its size from its distance, and keep the ground in front of the subject clear: `open2` in `paintings/fate/04-field.js` keeps the swords off the ground in front of the hill.

## The page

Read `../site-theme/PHILOSOPHY.md`, `../site-theme/docs/DESIGN-SYSTEM.md` and `../site-theme/docs/WRITING-STYLE.md` before a change to the page.
Use ASD-STE100 Issue 9 for the page text. Describe the style as ASD-STE100-guided.
`assets/mark.png` and `assets/favicon.png` are copies of the `ai-painting` mark in site-theme.

- The pages are generated and checked in. Edit `tools/build-site.js`, `assets/page.css` or a painting's `about.json`, then run `npm run build` and `npm test`.
- A painting is on the site when its folder has an `about.json`: title, order, alternative text, a one-sentence summary and the paragraphs below the picture. `{strokes}` becomes the stroke count.
- The pages have three tabs: Paintings (the landing page), Brushes (the brush test, `BRUSHES` in `tools/build-site.js`) and Canvas (`canvas/`). The brush test is not among the paintings.
- Every page has a link preview: a painting page and each `playback.html` show the painting as a large picture, and Canvas shows the AI Painting card. Check with `node ../site-theme/tools/check-embeds.mjs .`.
- The landing page shows the paintings by `order`, newest first. Give a new painting order 1 and move the others down.
- The landing page shows every painting at one height, whatever its shape. Keep that when the layout changes.
- The build makes the JPEG copies in `assets/paintings/` with `sips`, so it runs on a Mac.
- The player on a painting page is `player/player.js`, the same file that each `playback.html` contains. After a change to it, run `node tools/build-player.js paintings/<name>` for each painting.
- The video is always an MP4 file. `makeVideo` in the player paints each frame with its own engine, encodes it with the browser's H.264 `VideoEncoder` and writes the file with `mp4`. Do not go back to MediaRecorder: in Firefox it makes only WebM, and it runs in real time. A video is 5 minutes at most.
- Canvas is `assets/canvas.js`: the engine paints each stroke when the pointer is lifted, and a stroke that breaks a rule is refused with the reason. It keeps the painting in `localStorage`, and Play back mounts the player on the strokes.
