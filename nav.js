/* Where the page starts. Loaded from <head> without defer so this runs
   before the browser has acted on a #fragment. */
(function () {
  /* Browsers re-apply your last scroll position on reload, and the global
     scroll-behavior: smooth turns that into a visible animated scroll. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  function toTop() {
    /* 'instant' so smooth scrolling does not animate the jump */
    try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
    catch (e) { window.scrollTo(0, 0); }
  }

  /* Tapping a section link used to put #services in the address bar, and a
     fragment copied from there travels with every link shared afterwards —
     so the shared link reopened at "What we specialize in". A fragment is
     honoured only when it came from a link on this site (the booking page
     links to index.html#services); opened from a message or anywhere else,
     the page starts at the top and the fragment is stripped so the next
     copy of the URL is clean. */
  var fromThisSite = false;
  try {
    fromThisSite = !!document.referrer &&
      new URL(document.referrer).origin === location.origin;
  } catch (e) {}

  if (location.hash && !fromThisSite) {
    try { history.replaceState(null, '', location.pathname + location.search); }
    catch (e) {}
    toTop();
    window.addEventListener('DOMContentLoaded', toTop);
    window.addEventListener('load', toTop);
  }

  window.addEventListener('pageshow', function () {
    if (!location.hash) toTop();
  });
})();

/* Same-page section links scroll without writing a #fragment to the URL, so
   the address bar stays clean and stays safe to copy and share. */
(function () {
  function wire() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else { wire(); }
})();

/* Mobile header nav: the toggle only exists below 720px, but the state lives
   on .site-header__inner so the CSS can decide when to show the panel. */
(function () {
 function init() {
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
 }
 if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', init);
 } else { init(); }
})();
