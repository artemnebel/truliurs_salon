/* Browsers re-apply your previous scroll position on reload and on back,
   which on a one-page site means reopening it halfway down. Worse, the
   global scroll-behavior: smooth turns that restoration into a visible
   animated scroll. Start at the top instead; a #section link still jumps
   normally, since that is fragment navigation rather than restoration. */
(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  window.addEventListener('pageshow', function () {
    if (location.hash) return;
    /* 'instant' so smooth scrolling does not animate the jump to the top */
    try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
    catch (e) { window.scrollTo(0, 0); }
  });
})();

/* Mobile header nav: the toggle only exists below 720px, but the state lives
   on .site-header__inner so the CSS can decide when to show the panel. */
(function () {
  var inner = document.querySelector('.site-header__inner');
  if (!inner) return;

  var toggle = inner.querySelector('.site-header__toggle');
  var nav = inner.querySelector('.site-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    inner.setAttribute('data-open', String(open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    /* the sheet covers the viewport, so hold the page still behind it */
    document.body.classList.toggle('nav-open', open);
  }
  setOpen(false);

  toggle.addEventListener('click', function () {
    setOpen(inner.getAttribute('data-open') !== 'true');
  });

  /* tapping a link jumps down the page, so close the panel behind it */
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') setOpen(false);
  });

  /* rotating to landscape can cross the breakpoint while the panel is open */
  var desktop = window.matchMedia('(min-width: 721px)');
  function sync() { if (desktop.matches) setOpen(false); }
  if (desktop.addEventListener) desktop.addEventListener('change', sync);
  else if (desktop.addListener) desktop.addListener(sync);
})();
