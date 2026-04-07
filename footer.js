/**
 * Chomp Chomp Shared Footer
 * Injects the site footer into any page with <footer class="site-footer">
 * Update this file to change the footer across the entire site.
 */

(function () {
  'use strict';

  var TAGLINE = 'Baking is the materialization of comfort itself.';
  var COPYRIGHT = '\u00a9 2026 Chomp Chomp';

  var FOOTER_HTML = [
    '<div class="footer-content">',
    '  <p>' + TAGLINE + '</p>',
    '  <div class="footer-links">',
    '    <a href="mailto:hey@chompchomp.cc">hey@chompchomp.cc</a>',
    '    <a href="https://www.chomp.ltd">chomp chomp: cookies, etc.</a>',
    '    <a href="https://chompchomp.cc">chomp chomp: recipes &amp; rituals</a>',
    '  </div>',
    '  <p class="footer-copyright">' + COPYRIGHT + '</p>',
    '</div>'
  ].join('\n');

  function injectFooter() {
    var footer = document.querySelector('footer.site-footer');
    if (footer) {
      footer.innerHTML = FOOTER_HTML;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }
})();
