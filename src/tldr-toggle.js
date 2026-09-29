/*
 * TLDR toggle for case study pages.
 *
 * Markup contract:
 *   [data-tldr-scope]          container whose direct children get filtered
 *     [data-tldr="always"]     child shown in both views (e.g. hero image)
 *     [data-tldr="summary"]    child shown only in the TLDR view
 *     (no data-tldr)           child shown only in the full view
 *   [data-tldr-set="full|tldr"] toggle links; can live anywhere on the page
 *   video[data-tldr-play]      TLDR video that plays only while the TLDR view is shown
 *
 * ?view=tldr in the URL opens the page in the TLDR view.
 */
(function () {
  var scopes = document.querySelectorAll('[data-tldr-scope]');
  var buttons = document.querySelectorAll('[data-tldr-set]');
  if (!scopes.length || !buttons.length) return;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  var videos = document.querySelectorAll('[data-tldr-scope] video[data-tldr-play]');

  function setView(view, fromClick) {
    // Where the case study content starts, in page coordinates. Measured before
    // the swap because the page height changes underneath the reader.
    var contentTop = scopes[0].getBoundingClientRect().top + window.pageYOffset;
    var scrolledPastStart = window.pageYOffset > contentTop;

    each(scopes, function (s) { s.setAttribute('data-tldr-view', view); });
    each(buttons, function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-tldr-set') === view));
    });
    each(videos, function (v) {
      if (view === 'tldr') { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    });
    if (!fromClick) return;

    // The toggle sits in a sticky sidebar, so it can be clicked from mid-page.
    // Without this, switching to the shorter view leaves the reader at the
    // bottom of the page. Send them to the start of the new version instead.
    if (scrolledPastStart) window.scrollTo(0, contentTop);

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

/*
 * Lightbox fallback. Webflow's API can't set a lightbox's media, so a lightbox
 * added through it opens nothing. For any lightbox with no media, use the image
 * inside it, then re-run Webflow's lightbox setup so the click opens it.
 * Lightboxes that already have media in the Designer are left alone.
 */
(function () {
  window.Webflow = window.Webflow || [];
  window.Webflow.push(function () {
    var fixed = 0;
    Array.prototype.forEach.call(document.querySelectorAll('.w-lightbox'), function (box) {
      var img = box.querySelector('img');
      if (!img) return;
      var json = null;
      for (var i = 0; i < box.children.length; i++) {
        if (box.children[i].classList.contains('w-json')) { json = box.children[i]; break; }
      }
      var data = { items: [], group: '' };
      try { if (json) data = JSON.parse(json.textContent) || data; } catch (e) {}
      if (data.items && data.items.length) return;
      data.items = [{ type: 'image', url: img.getAttribute('src') }];
      if (!json) {
        json = document.createElement('script');
        json.type = 'application/json';
        json.className = 'w-json';
        box.appendChild(json);
      }
      json.textContent = JSON.stringify(data);
      fixed++;
    });
    if (fixed && window.Webflow.require) {
      var lightbox = window.Webflow.require('lightbox');
      if (lightbox && lightbox.ready) lightbox.ready();
    }
  });
})();
