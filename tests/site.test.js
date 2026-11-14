// The jehlp.net pages: they are current with their sources and keep the shared page contracts.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { pages, paintings, BRUSHES } = require('../tools/build-site.js');

const ROOT = path.join(__dirname, '..');
const built = pages();
const list = paintings();

test('the checked-in pages are the current build', () => {
  for (const [file, text] of Object.entries(built)) {
    assert.equal(fs.readFileSync(path.join(ROOT, file), 'utf8'), text, `${file} is stale: run npm run build`);
  }
});

test('each page has the shared masthead, one home link, the theme and its canonical address', () => {
  for (const [file, html] of Object.entries(built)) {
    const address = 'https://jehlp.net/ai-painting/' + file.replace(/index\.html$/, '');
    assert.ok(html.includes(`<link rel="canonical" href="${address}">`), file);
    assert.equal((html.match(/<img class="site-mark" src="[^"]*assets\/mark\.png" width="32" height="32" alt="">/g) || []).length, 1, file);
    assert.equal((html.match(/class="site-home" href="https:\/\/jehlp\.net\/"/g) || []).length, 1, file);
    assert.ok(html.includes('data-theme-toggle'), file);
    assert.ok(/<script src="https:\/\/jehlp\.net\/site-theme\/v2\/theme\.js[^"]*"><\/script>\s*<link rel="stylesheet" href="https:\/\/jehlp\.net\/site-theme\/v2\/base\.css/.test(html), file);
    assert.ok(!/localhost|127\.0\.0\.1|file:\/\//.test(html), file);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, file);
  }
});

test('the landing page links each painting once from its picture and once from its title', () => {
  for (const p of list.filter((p) => p.slug !== BRUSHES)) {
    assert.equal((built['index.html'].match(new RegExp(`href="${p.slug}/"`, 'g')) || []).length, 2, p.slug);
    assert.ok(fs.existsSync(path.join(ROOT, 'assets/paintings', p.slug + '.jpg')), p.slug);
  }
});

test('a painting page has the picture, the player controls and the files they need', () => {
  for (const p of list) {
    const html = built[`${p.slug}/index.html`];
    for (const role of ['frame', 'view', 'poster', 'play', 'seek', 'time', 'speed', 'download', 'status']) {
      assert.equal((html.match(new RegExp(`data-role="${role}"`, 'g')) || []).length, 1, `${p.slug} ${role}`);
    }
    assert.ok(/<div class="player-controls" hidden>/.test(html), 'controls stay hidden without the script');
    assert.ok(/<select id="length" data-role="speed" data-ui-select>/.test(html) && /<label class="sr-only" for="length">/.test(html), p.slug);
    assert.ok(html.includes('role="status" aria-live="polite"'), p.slug);
    for (const ref of html.match(/(?:src|data-src)="\.\.\/[^"?]+/g)) {
      assert.ok(fs.existsSync(path.join(ROOT, p.slug, ref.replace(/^[a-z-]+="/, ''))), `${p.slug}: ${ref}`);
    }
  }
});

// A screen for the writing rules, not a full check: descriptive sentences stay at 25 words or fewer.
test('page sentences are short', () => {
  const texts = list.flatMap((p) => p.text.concat(p.summary));
  for (const m of built['index.html'].matchAll(/<(?:p|li)>([^<]+)<\/(?:p|li)>/g)) texts.push(m[1]);
  for (const text of texts) {
    for (const sentence of text.split(/(?<=[.:])\s+/)) {
      assert.ok(sentence.split(/\s+/).length <= 25, sentence);
      assert.ok(!sentence.includes(';'), sentence);
    }
  }
});

test('the brush test has its own tab, and the tabs mark the page that is open', () => {
  const tabs = { 'index.html': 'Paintings', [`${BRUSHES}/index.html`]: 'Brushes', 'canvas/index.html': 'Canvas' };
  for (const [file, current] of Object.entries(tabs)) {
    const nav = built[file].match(/<nav class="tabs" aria-label="AI Painting">([\s\S]*?)<\/nav>/);
    assert.ok(nav, file);
    assert.deepEqual([...nav[1].matchAll(/>([^<]+)<\/a>/g)].map((m) => m[1]), ['Paintings', 'Brushes', 'Canvas'], file);
    assert.deepEqual([...nav[1].matchAll(/aria-current="page">([^<]+)</g)].map((m) => m[1]), [current], file);
  }
  assert.ok(!built['index.html'].includes(`<figure style="--ar: 1.3333"><a href="${BRUSHES}/">`), 'the brush test is not among the paintings');
  assert.ok(!built[`${BRUSHES}/index.html`].includes('All paintings'));
  for (const p of list.filter((p) => p.slug !== BRUSHES)) assert.ok(!built[`${p.slug}/index.html`].includes('class="tabs"'), p.slug);
});

test('the canvas page has the tools, the frame, the playback template and the files they need', () => {
  const html = built['canvas/index.html'], page = html.replace(/<template[\s\S]*?<\/template>/, '');
  for (const role of ['brush', 'color', 'width', 'width-value', 'opacity', 'opacity-value', 'undo', 'redo', 'new', 'save', 'play', 'frame', 'view', 'guide', 'tip', 'status', 'player', 'replace']) {
    assert.equal((page.match(new RegExp(`data-role="${role}"`, 'g')) || []).length, 1, role);
  }
  assert.ok(/<div class="studio" data-studio hidden>/.test(html) && html.includes('<noscript>'), 'without the script, the page says that the canvas needs it');
  assert.equal((html.match(/<option value="[a-z]+"/g) || []).length, 7 + 3, 'seven brushes and three shapes');
  assert.ok(/<template id="playback">[\s\S]*data-role="download"[\s\S]*<\/template>/.test(html));
  for (const ref of html.match(/src="\.\.\/[^"?]+/g)) {
    assert.ok(fs.existsSync(path.join(ROOT, 'canvas', ref.replace(/^src="/, ''))), ref);
  }
});

test('each page has a complete link preview: a painting as a large picture, other pages with the symbol card', () => {
  for (const [file, html] of Object.entries(built)) {
    for (const key of ['og:type', 'og:site_name', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt']) {
      assert.ok(new RegExp(`<meta property="${key}" content="[^"]+">`).test(html), `${file} ${key}`);
    }
    const image = html.match(/property="og:image" content="([^"]+)"/)[1];
    const card = html.match(/name="twitter:card" content="([^"]+)"/)[1];
    if (file === 'canvas/index.html') assert.deepEqual([image, card], ['https://jehlp.net/site-theme/v2/cards/ai-painting.png', 'summary'], file);
    else {
      assert.ok(/^https:\/\/jehlp\.net\/ai-painting\/assets\/paintings\/[a-z0-9-]+\.jpg$/.test(image), file);
      assert.equal(card, 'summary_large_image', file);
      assert.ok(fs.existsSync(path.join(ROOT, image.replace('https://jehlp.net/ai-painting/', ''))), file);
    }
  }
});
