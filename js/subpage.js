/* Shared behaviour for the standalone experience and project pages.
   These same pages are also loaded into the homepage modal as an iframe, so
   anything that navigates away has to stay hidden in that context. */
(function () {
  var back = document.querySelector('.back-home');
  if (!back) return;

  var inFrame = true;
  try {
    inFrame = window.self !== window.top;
  } catch (e) {
    // Cross-origin access throws, which only happens when framed.
    inFrame = true;
  }

  if (inFrame) return;

  back.classList.add('is-standalone');

  // The hero is dark and everything below it is white, so the pill has to
  // invert once it clears the header or it vanishes against the page.
  var hero = document.querySelector('.project-page-hero, .hero');

  function syncContrast() {
    var limit = hero ? hero.getBoundingClientRect().bottom : 0;
    back.classList.toggle('on-light', limit <= back.getBoundingClientRect().bottom);
  }

  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () {
      syncContrast();
      queued = false;
    });
  }

  syncContrast();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
