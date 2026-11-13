// Start the playback of the painting on this page. Without this script the page shows the finished painting.
for (const el of document.querySelectorAll('[data-player]')) {
  el.querySelector('.player-controls').hidden = false;
  PaintPlayer.mount(el, { src: el.dataset.src, name: el.dataset.name });
}
