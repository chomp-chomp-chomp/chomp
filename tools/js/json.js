(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Tab switching
  // ---------------------------------------------------------------------------

  window.switchTab = function (tabName) {
    document.querySelectorAll('.json-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.json-tab-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById('tab-btn-' + tabName).classList.add('active');
    document.getElementById('tab-' + tabName).classList.add('active');
  };

  // ---------------------------------------------------------------------------
  // Validate & Format tab
  // ---------------------------------------------------------------------------

  function showValidateResult(ok, message) {
    const el = document.getElementById('validate-status');
    el.textContent = message;
    el.className = 'json-status ' + (ok ? 'json-status-ok' : 'json-status-error');
  }

  window.formatJSON = function () {
    const input = document.getElementById('validate-input').value.trim();
    if (!input) return;
    try {
      const parsed = JSON.parse(input);
      document.getElementById('validate-output').value = JSON.stringify(parsed, null, 2);
      showValidateResult(true, '✓ Valid JSON');
    } catch (e) {
      document.getElementById('validate-output').value = '';
      showValidateResult(false, '✗ ' + e.message);
    }
  };

  window.minifyJSON = function () {
    const input = document.getElementById('validate-input').value.trim();
    if (!input) return;
    try {
      const parsed = JSON.parse(input);
      document.getElementById('validate-output').value = JSON.stringify(parsed);
      showValidateResult(true, '✓ Valid JSON');
    } catch (e) {
      document.getElementById('validate-output').value = '';
      showValidateResult(false, '✗ ' + e.message);
    }
  };

  window.validateOnly = function () {
    const input = document.getElementById('validate-input').value.trim();
    if (!input) return;
    try {
      JSON.parse(input);
      showValidateResult(true, '✓ Valid JSON');
    } catch (e) {
      showValidateResult(false, '✗ ' + e.message);
    }
  };

  window.clearValidate = function () {
    document.getElementById('validate-input').value = '';
    document.getElementById('validate-output').value = '';
    document.getElementById('validate-status').textContent = '';
    document.getElementById('validate-status').className = 'json-status';
  };

  window.copyValidateOutput = function () {
    const output = document.getElementById('validate-output');
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      flashButton('copy-validate-btn', 'Copied!');
    });
  };

  // ---------------------------------------------------------------------------
  // Generate from Template tab
  // ---------------------------------------------------------------------------

  const WORDS = [
    'apple', 'river', 'stone', 'forest', 'ember', 'cloud', 'grain', 'vessel',
    'harbor', 'lantern', 'meadow', 'cedar', 'horizon', 'copper', 'pebble',
    'sparrow', 'timber', 'flint', 'clover', 'anchor'
  ];

  const FIRSTNAMES = ['Alice', 'Bob', 'Clara', 'David', 'Elena', 'Felix', 'Grace', 'Hugo'];
  const LASTNAMES  = ['Smith', 'Jones', 'Rivera', 'Chen', 'Patel', 'Nguyen', 'Kim', 'Müller'];
  const DOMAINS    = ['example.com', 'mail.io', 'inbox.net', 'post.co'];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function generateDate() {
    const start = new Date(2015, 0, 1);
    const end   = new Date();
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return d.toISOString().split('T')[0];
  }

  /**
   * Resolve a type annotation string into a generated value.
   * Supported annotations:
   *   string          → random word
   *   string:N        → N random words joined by space
   *   number          → random integer 1–1000
   *   number:MIN-MAX  → random integer in range
   *   float           → random float 0–100 (2 dp)
   *   float:MIN-MAX   → random float in range
   *   boolean         → random true/false
   *   email           → random email address
   *   uuid            → UUID v4
   *   date            → ISO date (YYYY-MM-DD)
   *   datetime        → ISO datetime string
   *   timestamp       → Unix timestamp (seconds)
   *   url             → placeholder URL
   *   name            → random full name
   *   null            → null
   */
  function resolveType(annotation) {
    const [type, param] = annotation.split(':');

    switch (type.trim().toLowerCase()) {
      case 'string': {
        const count = param ? parseInt(param, 10) : 1;
        return Array.from({ length: count }, () => pick(WORDS)).join(' ');
      }
      case 'number': {
        if (param && param.includes('-')) {
          const [min, max] = param.split('-').map(Number);
          return randInt(min, max);
        }
        return randInt(1, 1000);
      }
      case 'float': {
        if (param && param.includes('-')) {
          const [min, max] = param.split('-').map(Number);
          return parseFloat((Math.random() * (max - min) + min).toFixed(2));
        }
        return parseFloat((Math.random() * 100).toFixed(2));
      }
      case 'boolean':
        return Math.random() < 0.5;
      case 'email': {
        const first = pick(FIRSTNAMES).toLowerCase();
        const last  = pick(LASTNAMES).toLowerCase();
        return `${first}.${last}@${pick(DOMAINS)}`;
      }
      case 'uuid':
        return generateUUID();
      case 'date':
        return generateDate();
      case 'datetime':
        return new Date(
          new Date(2015, 0, 1).getTime() +
          Math.random() * (Date.now() - new Date(2015, 0, 1).getTime())
        ).toISOString();
      case 'timestamp':
        return Math.floor(Date.now() / 1000) - randInt(0, 315360000); // up to 10 years ago
      case 'url':
        return `https://example.com/${pick(WORDS)}/${randInt(1, 999)}`;
      case 'name':
        return `${pick(FIRSTNAMES)} ${pick(LASTNAMES)}`;
      case 'null':
        return null;
      default:
        return annotation; // return as-is if unrecognised
    }
  }

  /**
   * Walk a template value and replace type annotations with generated data.
   */
  function generateValue(template) {
    if (typeof template === 'string') {
      return resolveType(template);
    }

    if (Array.isArray(template)) {
      // Array with a single string element → treat as type, generate 3 items
      if (template.length === 1 && typeof template[0] === 'string') {
        const [typeStr, countStr] = template[0].split(':');
        // If the annotation itself encodes a count (e.g. "string:3"), we use it
        // but for array repetition we always generate 3 unless a second array element
        // specifies the count.
        const count = 3;
        // Re-pack without the count suffix so resolveType gets a clean annotation
        const annotation = typeStr + (countStr && !isNaN(countStr) ? '' : (countStr ? ':' + countStr : ''));
        return Array.from({ length: count }, () => resolveType(annotation));
      }
      // Array with [typeString, count] shorthand
      if (template.length === 2 && typeof template[0] === 'string' && typeof template[1] === 'number') {
        return Array.from({ length: template[1] }, () => resolveType(template[0]));
      }
      // Otherwise recurse into each element
      return template.map(generateValue);
    }

    if (template !== null && typeof template === 'object') {
      const result = {};
      for (const [key, val] of Object.entries(template)) {
        result[key] = generateValue(val);
      }
      return result;
    }

    return template;
  }

  window.generateFromTemplate = function () {
    const input = document.getElementById('template-input').value.trim();
    const statusEl = document.getElementById('template-status');
    if (!input) return;

    let template;
    try {
      template = JSON.parse(input);
    } catch (e) {
      statusEl.textContent = '✗ Template is not valid JSON — ' + e.message;
      statusEl.className = 'json-status json-status-error';
      document.getElementById('template-output').value = '';
      return;
    }

    const countEl = document.getElementById('generate-count');
    const count = Math.min(Math.max(parseInt(countEl.value, 10) || 1, 1), 50);

    let result;
    if (count === 1) {
      result = generateValue(template);
    } else {
      result = Array.from({ length: count }, () => generateValue(template));
    }

    document.getElementById('template-output').value = JSON.stringify(result, null, 2);
    statusEl.textContent = `✓ Generated ${count} item${count > 1 ? 's' : ''}`;
    statusEl.className = 'json-status json-status-ok';
  };

  window.clearTemplate = function () {
    document.getElementById('template-input').value = '';
    document.getElementById('template-output').value = '';
    document.getElementById('template-status').textContent = '';
    document.getElementById('template-status').className = 'json-status';
    document.getElementById('generate-count').value = '1';
  };

  window.copyTemplateOutput = function () {
    const output = document.getElementById('template-output');
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      flashButton('copy-template-btn', 'Copied!');
    });
  };

  window.loadExample = function () {
    document.getElementById('template-input').value = JSON.stringify({
      id: 'uuid',
      name: 'name',
      email: 'email',
      age: 'number:18-65',
      score: 'float:0-10',
      active: 'boolean',
      joined: 'date',
      website: 'url',
      tags: ['string']
    }, null, 2);
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function flashButton(id, text) {
    const btn = document.getElementById(id);
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = text;
    setTimeout(() => { btn.textContent = orig; }, 2000);
  }

})();
