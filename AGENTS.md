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
- For a whole scene, `camera` in the kit gives `at(X, Y, Z)` from one eye and one lens; `inPoly` makes an outline into a test for `fill`; `glow` is the light round a small thing.
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
- A facial expression is the hard part: no stroke is narrower than 4px or shorter than 12px. The owner said so, and later made it exact: only expressions are hard, and characters are welcome. Give a figure a view that needs no expression: from the side, from behind, far off, masked, or a face that is a fixed shape, such as a skull. Five paintings were painted again this way: `paintings/final-fantasy-x`, `paintings/re-zero`, `paintings/wonderful-everyday`, `paintings/fate` (Archer, big in the middle, was taken out: the picture is the land of swords, with no one in it) `paintings/explorers-of-sky` (which went back to its first, small figures) and `paintings/umineko` (two figures in a hall became the Golden Land, a garden with no one in it).
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
- A sky that turns about one place is a flow that every stroke follows: `fill` bends its strokes along the angle that it is given. `swirlAngle` in `paintings/umineko/scene.js` goes round a middle and a little in toward it, and the light and dark arms are the sine of a spiral phase with the same pitch, so the strokes lie along the arms.
- A thing that gives its own light is brightest at its rims and deepest in its folds. `rose` in `paintings/umineko/scene.js` paints a rose at any size: far off a level touch in a glow, nearer a round head (`disc`) with a bright middle, close to us rings of petal strokes round a heart on a disc of deep gold.
- A thin bright crescent near the top of a small round thing is the shine on a glass ball. A flower has none.
- Flowers that stand at even distances are a pattern of dots. Let them grow in clumps: keep a flower by chance, and make the chance a noise of the place.
- A line of equal dashes along an edge looks drawn. Make its pieces few and unequal, or leave the edge to the two tones that meet there.
- No stroke is wider than half its length, so a broad short shape is a fan of strokes from one point. A butterfly's fore wing is three such strokes and its hind wing two; one stroke for each wing makes a propeller.
- The light round a small thing is soft strokes that cross at it. One soft stroke is a bar, and on a dark ground it shows.
- A small chair, a post with a bar across its top and other thin upright things read as crosses or people. If they do not read as what they are, leave them out.
- A dark backdrop needs few strokes. Use wide ones there: the forest of `paintings/umineko` was 30% of the strokes before it was 16%.
- Other work can be in the folder. Stage a painting's own paths (`git add -u`, then `git add paintings/<name>`), not everything.
- A subject for "a scene of action, wonder or awe" that needs no face: a machine or a suit of armour (`paintings/baldr-sky`, `paintings/muramasa`, `paintings/darling-in-the-franxx`), a building or a thing in a building (`paintings/tsukihime`, `paintings/steins-gate`), a light in the land (`paintings/mushoku-tensei`, and the first picture in the history of `paintings/shinsekai-yori`), a beast behind bars with one small figure for scale (`paintings/tower-of-god`).
- When we look straight along a shaft or a street, every stroke of its walls runs to one point. A net of lines on the wall is regular in the angle about that point and in the logarithm of the distance from it (`paintings/baldr-sky/02-shaft.js`).
- A fill does not stop at its bounds: strokes run on past them. Give each band of a wall its own `inside`, or long strokes cross into the next band and the wall becomes noise (`band` in `paintings/steins-gate/03-building.js`).
- Writing on a sign must not be marks that look like letters: bars in a square come out as real characters. Paint each letter as a plain block of color.
- Glass or crystal that gives light is upright rods, each with its own tone, lighter low down and deeper at the top (`paintings/tsukihime/03-castle.js`). Cover the ragged feet of such a thing with mist or with what stands in front.
- A thing that is the light of the scene gives each place the color of the ray that falls on it. Make the rays unequal and out of the order of the rainbow, or the picture is a color wheel (`rayColor` in `scene.js`, in the history of `paintings/shinsekai-yori`). With one light behind bars, the shade of each bar on the floor is a test against the line from the light (`barShade` in `paintings/tower-of-god/scene.js`).
- A thing made of slabs has three faces to each slab: one toward us, one toward the light, and its top. After the fills, put one clean stroke along each under edge and each far edge, or the ends of the fill strokes make a fringe (the front line of the wedge in `paintings/darling-in-the-franxx/05-klaxosaur.js`).
- A trail is pieces along a line. Each piece must be twice as long as it is wide, so find the number of pieces from the length of the line and the greatest width (`trail` in `04-trails.js`, in the history of `paintings/muramasa`); a fixed number leaves most of them out.
- A ring round a small orb, with a touch of light on the orb, is a face. Take the touch off, and make the ring wide enough to stand clear.
- Dark bars across the top of a column of light look like flying saucers. A mast with a bar across it is a cross. Thin pale lines on dark posts are candles. Look for these at the size of the page.
- The page text must have sentences of 25 words or less and no semicolon as punctuation; `npm test` checks it. A name such as Steins;Gate may keep its own.
- What makes a cartoon: an outline round a thing, pure black, the same bright mark on each of many things, rays that go out evenly from a point, and a creature with legs, an eye and a horn at a small size. A far thing is not black: the air makes its dark a blue-violet (`hull` in `paintings/darling-in-the-franxx/05-klaxosaur.js`).
- A horde far off is its dust, a dark stain on the ground and its lights. Paint no legs. Each light is a level touch that comes to a point at each end; most are dim and a few are bright. Touches that lie every way are confetti (`paintings/darling-in-the-franxx/06-horde.js`).
- A burst is not a star. Paint a light with no edge, smoke, a ball of fire of no fixed shape, and sparks that go one way (`burst` in `paintings/baldr-sky/03-swarm.js`). A cross of rays on a light is a sparkle: one long ray is enough. Lightning wanders; it does not go left and right by turns.
- A small round light from `glow` needs six or eight strokes. Four make a flower.
- A heavy thing that has fallen into a building stands behind what is left of the wall. Paint neither it nor the dark of the hole below a ragged line (`lip` in `paintings/steins-gate/04-machine.js`). Cracks are short and stay in the wall; they do not cross glass.
- Level streaks of gold on a plain make it a sea. Shade a plain by how each place of it is turned to the light, from a height field under one camera (`turned` in `paintings/darling-in-the-franxx/03-land.js`).
- Find how a creature of a known work is made before painting it. The great klaxosaur is a black wedge, not an animal with legs. The False Minoshiro is a slug, not a lamb.
- A pass with a new name does not take the old passes out of the recording. Run from an earlier pass that is still there.
- One painting with the whole of the attention comes out better than one of eight. After each pass, look at the whole and at close crops before the next pass.
- `shape` and `solid` put a light line along the lit edge of a form. On a small machine or a plate of armour that line goes most of the way round and is an outline. Set `edge: false`, or make it short and broken (`dash`, `gap`, `edgeOpacity`), and let the lit side be a tone (`virus` at `b451cb8` in the history of `paintings/baldr-sky`, and `plate` in the history of `paintings/muramasa`). The owner took back the swarm of Baldr Sky as it was before this change, so do not make it on a picture that the owner has passed.
- A thing in the night is dark. Crimson armour under the moon is a deep red with cold light only on its upper edges and the warm light of its own fire underneath. A bright red with rows of yellow studs is a toy.
- Two small pale lights side by side on a head or a body are eyes. So are two dark holes with pale marks. Use one, or none.
- A fern frond is a rib with small leaves close together down both sides, each turned toward the end of the frond and shorter than the one before (`fern` in `04-near.js`, in the history of `paintings/shinsekai-yori`). One thick bent stroke for a frond makes a bunch of arms. Thin leaves far apart make barbed wire.
- A tree that is too far off to have a head of leaves is not painted alone: a mound with a light on it is a helmet, and an upright touch is a post. Paint far hedges as thin dark lines, and give a head of leaves (`mass` with three or four small parts) only to trees that are big enough for it (`paintings/mushoku-tensei/04-land.js`).
- Broken glass: the lower part of the pane is dark, and what is left hangs from the frame with a toothed edge. Pale lines for the pieces become an X, a face or letters.
- A block of a town at night has a side that is turned from the light, a tone darker, and one edge toward the light that is a line of it (`block` in `paintings/tsukihime/04-city.js`).
- A stroke whose width is a random number can pass one day and fail the next when the random numbers before it change. Give its length from its width (`Math.max(w * 2.3, …)`).
- A hill is a hill only if its top is above the line of the eye. Give a far figure its size from its distance, and keep the ground in front of the subject clear: `open2` in `paintings/fate/04-field.js` keeps the swords off the ground in front of the hill.
- The owner's rule for the subject: it must be weird and wonderful, and it must be a thing that only this work has. Ask what in the work is strange and is nowhere else: a creature, a machine, a place that cannot be, one image that no one forgets. A view that can be from any work, with figures who look out at it, is generic. The owner sent back three such pictures (Metroid Prime, Summer Time Rendering, No Game No Life).
- That rule does not replace the manner. The second pictures for those three works and the picture for Expedition 33 each showed a strange thing and a character as large flat shapes, and the owner had all four removed. The owner also took back the first Undertale (two children seen from behind, the castle far off in the rain) in place of Sans and his skulls, and the dive of Baldr Sky in place of Gray Christmas. The owner gave no reasons. The reading of Claude: a strange subject that is drawn as a cartoon fails, and a view with backs in front of it is good when the view and the figures are the work's own and the light leads the picture. What stayed was a spider against the moon and a black cat against the dusk.
- A character is not necessary. The owner: "you seem to WANT to insert characters -- which is fine -- but not necessarily optimal". Where a character is in the picture, its design must be its own. Do not use one composition twice in a batch.
- When the owner leaves it to Claude to redo other pictures, the bar is high. Undertale was replaced on that leave, and the owner took the old one back.
- Keep the color that a known thing is known by. The skulls that Sans calls are white: painted dark, because the windows were behind them, they were beetles. Put a soft violet shade on the white, and let the bright edge and the dark holes do the rest (`03-blasters.js` in the history of `paintings/undertale`).
- Find the color of a creature before it is painted, not only its shape. The impure cat was planned pale. In the anime it is black, with red eyes and legs that are too long. A black thing needs the bright part of the sky behind it, so the place where the sun went down was moved behind the roof (`paintings/shinsekai-yori`).
- A long neck that is thick and makes an arch is a dragon. Points along a back are a dragon's too. For a great cat, let the neck go straight down from the shoulders, put the back end higher than the shoulders, and give each ear a wide root (`paintings/shinsekai-yori/04-cat.js`).
- Bone is smooth. Strokes that all go along a skull make fur. Lay them across it, wet (`mix: 0.45`), with little change of tone from stroke to stroke.
- Use `stroke`, not `tryStroke`, for a part that the picture cannot be without, such as an ear or a tooth. Then a part that is too short for its width stops the pass and does not go out of the picture with no word.
- `disc` cannot make a round smaller than about 8.4px in radius with a 4.2px brush, or 9.5px with a 6px brush. For an eye that is smaller, use one slanted stroke with a pale stroke in it.
- A light with a hard mark in it is a sign. A firefly is two soft rounds, one small and bright in one large and dim, with no stroke across.
- The banks of rice fields in true perspective are the grid of a video game. Give each row of fields its own banks, at its own places.
- When the eye is low, the bright shapes that windows lay on a floor run together and go out at the sides. Put the eye as high as the middle of the windows. Then each window lays its own shape, upside down, with its point toward us (`pool` in `scene.js`, in the history of `paintings/undertale`).
- The shade of a person on a floor has the shape of the person: the wide body next to the feet, then the round of the head. A plain triangle is a funnel.
- A small exact shape, such as a heart, is laid in with strokes that go along its edges, and then one stroke of the same color round its outline.
- A thing of folded paper is flat pieces with straight edges. Fill each piece with strokes along its length, give each its own tone for how it is turned to the light, and paint the picture on the paper as blocks of flat color with dark lines between (`paintings/paper-mario/06-plane.js`).
- Arms that are thin and pale and that branch are dead trees or lightning. A thing that flows is thick tongues, each with a round end and a drop or two that has come off it (`tongue` in `04-assembler.js`, in the history of `paintings/baldr-sky`).
- A ring drawn round a hole in the cloud is a hoop. A light with no edge shows the hole.

## The page

Read `../site-theme/PHILOSOPHY.md`, `../site-theme/docs/DESIGN-SYSTEM.md` and `../site-theme/docs/WRITING-STYLE.md` before a change to the page.
Use ASD-STE100 Issue 9 for the page text. Describe the style as ASD-STE100-guided.
`assets/mark.png` and `assets/favicon.png` are copies of the `ai-painting` mark in site-theme.

- The pages are generated and checked in. Edit `tools/build-site.js`, `assets/page.css` or a painting's `about.json`, then run `npm run build` and `npm test`.
- A painting is on the site when its folder has an `about.json`: title, order, alternative text, a one-sentence summary and the paragraphs below the picture. `{strokes}` becomes the stroke count.
- The pages have three tabs: Paintings (the landing page), Brushes (the brush test, `BRUSHES` in `tools/build-site.js`) and Canvas (`canvas/`). The brush test is not among the paintings.
- Every page has a link preview: a painting page and each `playback.html` show the painting as a large picture, and Canvas shows the AI Painting card. Check with `node ../site-theme/tools/check-embeds.mjs .`.
- The landing page shows the paintings by `order`, newest first. Give a new painting order 1 and move the others down.
- The build does not delete the page of a painting that is gone. To remove a painting, delete `paintings/<name>`, `<name>/` and `assets/paintings/<name>.jpg`. Then number the paintings that are left from 1, in the same sequence.
- To put an earlier picture back, run `git rm -r paintings/<name>`, then `git checkout <commit> -- paintings/<name> assets/paintings/<name>.jpg` with the commit that had it. Keep the present `order`. Then run the passes from 1: `git diff <commit> -- paintings/<name>` must show only the `order`.
- The landing page shows every painting at one height, whatever its shape. Keep that when the layout changes.
- The build makes the JPEG copies in `assets/paintings/` with `sips`, so it runs on a Mac.
- The player on a painting page is `player/player.js`, the same file that each `playback.html` contains. After a change to it, run `node tools/build-player.js paintings/<name>` for each painting.
- The video is always an MP4 file. `makeVideo` in the player paints each frame with its own engine, encodes it with the browser's H.264 `VideoEncoder` and writes the file with `mp4`. Do not go back to MediaRecorder: in Firefox it makes only WebM, and it runs in real time. A video is 5 minutes at most.
- Canvas is `assets/canvas.js`: the engine paints each stroke when the pointer is lifted, and a stroke that breaks a rule is refused with the reason. It keeps the painting in `localStorage`, and Play back mounts the player on the strokes.
