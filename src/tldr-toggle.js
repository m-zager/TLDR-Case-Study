/*
 * TLDR toggle for case study pages.
 *
 * Markup contract:
 *   [data-tldr-scope]          container whose direct children get filtered
 *     [data-tldr="always"]     child shown in both views (e.g. hero image)
 *     [data-tldr="summary"]    child shown only in the TLDR view
 *     (no data-tldr)           child shown only in the full view
 *   [data-tldr-set="full|tldr"] toggle links; can live anywhere on the page
 *
 * ?view=tldr in the URL opens the page in the TLDR view.
 */
(function () {
  var scopes = document.querySelectorAll('[data-tldr-scope]');
  var buttons = document.querySelectorAll('[data-tldr-set]');
  if (!scopes.length || !buttons.length) return;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  function setView(view, fromClick) {
    each(scopes, function (s) { s.setAttribute('data-tldr-view', view); });
    each(buttons, function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-tldr-set') === view));
    });
    if (!fromClick) return;
    try {
      var url = new URL(window.location.href);
      if (view === 'tldr') url.searchParams.set('view', 'tldr');
      else url.searchParams.delete('view');
      history.replaceState(null, '', url);
    } catch (e) {}
  }

  var initial = new URLSearchParams(window.location.search).get('view') === 'tldr' ? 'tldr' : 'full';
  setView(initial, false);

  each(buttons, function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      setView(b.getAttribute('data-tldr-set'), true);
    });
    // Links only fire on Enter; buttons also fire on Space.
    b.addEventListener('keydown', function (e) {
      if (e.key === ' ') {
        e.preventDefault();
        setView(b.getAttribute('data-tldr-set'), true);
      }
    });
  });
})();
