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
