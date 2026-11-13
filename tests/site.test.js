// The jehlp.net pages: they are current with their sources and keep the shared page contracts.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { pages, paintings } = require('../tools/build-site.js');

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
  for (const p of list) {
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
