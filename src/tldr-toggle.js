/*
 * TLDR toggle for case study pages.
 *
 * Markup contract:
 *   [data-tldr-scope]          container whose direct children get filtered
 *     [data-tldr="always"]     child shown in both views (toggle, hero image)
 *     [data-tldr="summary"]    child shown only in the TLDR view
 *     (no data-tldr)           child shown only in the full view
 *   [data-tldr-set="full|tldr"] buttons that switch the view
 *
 * ?view=tldr in the URL opens the page in the TLDR view.
 */
(function () {
  var scopes = document.querySelectorAll('[data-tldr-scope]');
  Array.prototype.forEach.call(scopes, function (scope) {
    var buttons = scope.querySelectorAll('[data-tldr-set]');
    if (!buttons.length) return;
    var toggle = buttons[0].parentNode;

    function setView(view, fromClick) {
      scope.setAttribute('data-tldr-view', view);
      Array.prototype.forEach.call(buttons, function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-tldr-set') === view));
      });
      if (!fromClick) return;
      try {
        var url = new URL(window.location.href);
        if (view === 'tldr') url.searchParams.set('view', 'tldr');
        else url.searchParams.delete('view');
        history.replaceState(null, '', url);
      } catch (e) {}
      // Keep the toggle on screen when the page height changes under the reader.
      if (toggle.getBoundingClientRect().top < 0) {
        toggle.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }

    var initial = new URLSearchParams(window.location.search).get('view') === 'tldr' ? 'tldr' : 'full';
    setView(initial, false);

    Array.prototype.forEach.call(buttons, function (b) {
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
  });
})();
