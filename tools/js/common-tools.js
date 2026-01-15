(function() {
  'use strict';

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    fallbackCopy(text);
    return Promise.resolve();
  }

  window.copyText = function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.value !== undefined ? el.value : el.textContent;
    copyToClipboard(text || '').then(() => {
      const active = document.activeElement;
      if (active && active.tagName === 'BUTTON') {
        const original = active.textContent;
        active.textContent = 'Copied!';
        setTimeout(() => {
          active.textContent = original;
        }, 2000);
      }
    });
  };

  window.copyTextArea = function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.value || '';
    copyToClipboard(text).then(() => {
      const active = document.activeElement;
      if (active && active.tagName === 'BUTTON') {
        const original = active.textContent;
        active.textContent = 'Copied!';
        setTimeout(() => {
          active.textContent = original;
        }, 2000);
      }
    });
  };

  window.copyValue = function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    copyToClipboard(el.value || '').then(() => {
      const active = document.activeElement;
      if (active && active.tagName === 'BUTTON') {
        const original = active.textContent;
        active.textContent = 'Copied!';
        setTimeout(() => {
          active.textContent = original;
        }, 2000);
      }
    });
  };
})();
