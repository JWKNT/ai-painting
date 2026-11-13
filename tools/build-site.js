#!/usr/bin/env node
// Build the jehlp.net pages: the landing page and one page for each painting that has an
// about.json. The pages are checked in, because GitHub Pages serves the repository as it is.
//
//   node tools/build-site.js
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://jehlp.net/ai-painting/';
const THEME = 'https://jehlp.net/site-theme/v2/';
const THEME_VERSION = '20261108-justify';
const COMPONENTS_VERSION = '20261105-math3';

const read = (file) => fs.readFileSync(path.join(ROOT, file));
const stamp = (file) => crypto.createHash('sha1').update(read(file)).digest('hex').slice(0, 8);
const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function paintings() {
  const dir = path.join(ROOT, 'paintings');
  return fs.readdirSync(dir)
    .filter((slug) => fs.existsSync(path.join(dir, slug, 'about.json')))
    .map((slug) => {
      const about = JSON.parse(read(`paintings/${slug}/about.json`));
      const data = JSON.parse(read(`paintings/${slug}/painting.json`));
      const strokes = data.strokes.length.toLocaleString('en-US');
      const fill = (text) => text.replace(/\{strokes\}/g, strokes);
      return { slug, ...about, width: data.width, height: data.height, summary: fill(about.summary), text: about.text.map(fill) };
    })
    .sort((a, b) => a.order - b.order);
}

// A JPEG copy of the finished painting, for the landing page and as the first view of its own page.
function picture(p) {
  const source = path.join(ROOT, 'paintings', p.slug, 'painting.png'), out = path.join(ROOT, 'assets/paintings', p.slug + '.jpg');
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(source).mtimeMs) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '90', source, '--out', out], { stdio: 'ignore' });
  }
  return `assets/paintings/${p.slug}.jpg`;
}

const utility = '<span class="site-utility-pair"><a class="site-home" href="https://jehlp.net/" aria-label="Home — jehlp.net" title="Home — jehlp.net"><span aria-hidden="true">✳</span></a><button class="theme-toggle" type="button" data-theme-toggle aria-label="Use dark theme"></button></span>';
const footer = '<footer class="site-footer"><p><a href="https://github.com/JWKNT/ai-painting">Source code</a><span class="ui-link-arrow" aria-hidden="true"></span></p></footer>';

function head({ title, description, url, image, up, components }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#fbfaf7">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title.replace(/ · jehlp\.net$/, ''))}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:site_name" content="jehlp.net"><meta property="og:image" content="${SITE}${image}">
<link rel="canonical" href="${url}">
<link rel="icon" href="${up}assets/favicon.png" type="image/png">
<script src="${THEME}theme.js?v=${THEME_VERSION}"></script>
<link rel="stylesheet" href="${THEME}base.css?v=${THEME_VERSION}">${components ? `
<link rel="stylesheet" href="${THEME}components.css?v=${COMPONENTS_VERSION}">` : ''}
<link rel="stylesheet" href="${up}assets/page.css?v=${stamp('assets/page.css')}">${components ? `
<script src="${THEME}components.js?v=${COMPONENTS_VERSION}" defer></script>` : ''}
</head>`;
}

function landing(list) {
  const works = list.map((p) => {
    const src = picture(p);
    return `<figure${p.wide ? ' class="wide"' : ''}><a href="${p.slug}/"><img src="${src}?v=${stamp(src)}" width="${p.width}" height="${p.height}" alt="${esc(p.alt)}"></a><figcaption><a href="${p.slug}/">${esc(p.title)}</a></figcaption></figure>`;
  }).join('\n');
  return `${head({ title: 'AI Painting · jehlp.net', description: 'Paintings that an AI makes with brush strokes only, each with a playback of all its strokes.', url: SITE, image: `assets/paintings/${list[0].slug}.jpg`, up: '' })}
<body>
<a class="skip-link" href="#main">Skip to the paintings</a>
<header class="site-header site-header--identity">
  <div class="site-brand">
    <img class="site-mark" src="assets/mark.png" width="32" height="32" alt="">
    <h1 class="site-title">AI Painting</h1>
  </div>
  <nav aria-label="Page links">
    ${utility}
  </nav>
</header>

<main id="main" class="page">
<div class="intro">
<div class="prose">
<p>Claude, an AI model, makes each painting here. It writes a program, and the program paints with brush strokes on a canvas of one color. It uses no image generator.</p>
<p>The program records each stroke. Open a painting to play its strokes in sequence. You can also download the playback as a video.</p>
</div>
<div class="rules prose">
<p>The program must obey these rules:</p>
<ul>
<li>A brush is at least 4 pixels wide.</li>
<li>Each stroke moves at least two times the width of its brush.</li>
<li>The canvas is at most 1,600 pixels on its long side.</li>
<li>A stroke can have any color.</li>
</ul>
</div>
</div>

<section class="works" aria-label="Paintings">
${works}
</section>
</main>

${footer}
</body></html>
`;
}

function page(p) {
  const src = picture(p), data = `paintings/${p.slug}/painting.json`;
  return `${head({ title: `${p.title} · AI Painting · jehlp.net`, description: p.summary, url: `${SITE}${p.slug}/`, image: src, up: '../', components: true })}
<body>
<a class="skip-link" href="#main">Skip to the painting</a>
<header class="site-header site-header--identity">
  <div class="site-brand">
    <img class="site-mark" src="../assets/mark.png" width="32" height="32" alt="">
    <span class="site-title">AI Painting</span>
  </div>
  <nav aria-label="Site links">
    <a href="../">All paintings</a>
    ${utility}
  </nav>
</header>

<main id="main" class="page">
<article class="work" data-player data-src="../${data}?v=${stamp(data)}" data-name="${p.slug}" style="--ar: ${+(p.width / p.height).toFixed(4)}">
<h1 class="work-title">${esc(p.title)}</h1>
<div class="player-frame" data-role="frame">
  <canvas data-role="view" width="${p.width}" height="${p.height}"></canvas>
  <img data-role="poster" src="../${src}?v=${stamp(src)}" width="${p.width}" height="${p.height}" alt="${esc(p.alt)}">
  <div class="player-tip" data-role="tip"></div>
</div>
<div class="player-controls" hidden>
  <button type="button" data-role="play"><span data-role="play-text">Play</span></button>
  <div class="player-track"><input type="range" data-role="seek" min="0" max="1000" step="1" value="1000" aria-label="Timeline"><div class="player-ticks" data-role="ticks"></div></div>
  <span class="player-time" data-role="time"></span>
  <span class="player-pass" data-role="pass"></span>
  <label class="sr-only" for="length">Playback length</label>
  <select id="length" data-role="speed" data-ui-select></select>
  <button type="button" data-role="download">Download video</button>
</div>
<p class="player-status" data-role="status" role="status" aria-live="polite"></p>
<div class="prose work-text">
${p.text.map((t) => `<p>${esc(t)}</p>`).join('\n')}
</div>
</article>
</main>

${footer}
<script src="../engine/paint-engine.js?v=${stamp('engine/paint-engine.js')}" defer></script>
<script src="../player/player.js?v=${stamp('player/player.js')}" defer></script>
<script src="../assets/page.js?v=${stamp('assets/page.js')}" defer></script>
</body></html>
`;
}

// Every generated page, as { 'path/from/root.html': text }.
function pages() {
  const list = paintings(), out = { 'index.html': landing(list) };
  for (const p of list) out[`${p.slug}/index.html`] = page(p);
  return out;
}

if (require.main === module) {
  const out = pages();
  for (const [file, text] of Object.entries(out)) {
    fs.mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, file), text);
  }
  console.log(Object.keys(out).join(', '));
}

module.exports = { pages, paintings };
