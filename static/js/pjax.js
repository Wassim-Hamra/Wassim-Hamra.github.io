(function() {
  'use strict';

  if (!window.fetch || !window.history || !window.DOMParser) return;

  var CONTENT_ID = 'pjax-content';
  var isNavigating = false;

  var isModifiedEvent = function(e) {
    return !!(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
  };

  var isInternalNavigableLink = function(link, e) {
    if (!link || !link.getAttribute) return false;
    if (e && (e.defaultPrevented || e.button !== 0 || isModifiedEvent(e))) return false;

    var href = link.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#') return false;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;

    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (err) {
      return false;
    }

    if (url.origin !== window.location.origin) return false;
    if (/\.(pdf|zip|png|jpe?g|gif|webp|svg|mp3|mp4|mov|webm)$/i.test(url.pathname)) return false;
    return true;
  };

  var normalizePath = function(pathname) {
    var path = pathname || '/';
    if (path === '/') return '/index.html';
    return path.replace(/\/+$/, '') || '/index.html';
  };

  var updateActiveNav = function(url) {
    var currentPath = normalizePath(url.pathname);
    var links = document.querySelectorAll('.probootstrap-main-nav a');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var li = link.closest('li');
      if (!li) continue;
      li.classList.remove('active');

      var href = link.getAttribute('href') || '';
      if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) continue;
      try {
        var linkUrl = new URL(href, window.location.href);
        if (normalizePath(linkUrl.pathname) === currentPath) {
          li.classList.add('active');
        }
      } catch (err) {}
    }
  };

  var replaceContent = function(htmlText, targetUrl) {
    var parser = new DOMParser();
    var nextDoc = parser.parseFromString(htmlText, 'text/html');
    var nextContent = nextDoc.getElementById(CONTENT_ID);
    var currentContent = document.getElementById(CONTENT_ID);
    if (!nextContent || !currentContent) return false;

    currentContent.replaceWith(nextContent);
    if (nextDoc.title) document.title = nextDoc.title;

    var nextCanonical = nextDoc.querySelector('link[rel="canonical"]');
    var currentCanonical = document.querySelector('link[rel="canonical"]');
    if (nextCanonical && currentCanonical) {
      currentCanonical.setAttribute('href', nextCanonical.getAttribute('href'));
    }

    updateActiveNav(new URL(targetUrl, window.location.href));
    document.dispatchEvent(new CustomEvent('pjax:load', { detail: { url: targetUrl } }));
    return true;
  };

  var navigate = function(targetUrl, pushStateEntry, preserveScroll) {
    if (isNavigating) return;
    isNavigating = true;

    fetch(targetUrl, {
      method: 'GET',
      headers: { 'X-Requested-With': 'pjax' },
      credentials: 'same-origin'
    }).then(function(res) {
      if (!res.ok) throw new Error('PJAX fetch failed');
      return res.text();
    }).then(function(htmlText) {
      var replaced = replaceContent(htmlText, targetUrl);
      if (!replaced) {
        window.location.href = targetUrl;
        return;
      }
      if (pushStateEntry) {
        history.pushState({ pjax: true }, '', targetUrl);
      }
      if (!preserveScroll) {
        window.scrollTo(0, 0);
      }
    }).catch(function() {
      window.location.href = targetUrl;
    }).finally(function() {
      isNavigating = false;
    });
  };

  document.addEventListener('click', function(e) {
    var target = e.target;
    var link = target && target.closest ? target.closest('a') : null;
    if (!isInternalNavigableLink(link, e)) return;
    e.preventDefault();
    navigate(link.href, true, false);
  }, true);

  window.addEventListener('popstate', function() {
    navigate(window.location.href, false, true);
  });

  window.PJAX = {
    navigate: function(url) {
      navigate(url, true, false);
    }
  };
})();
