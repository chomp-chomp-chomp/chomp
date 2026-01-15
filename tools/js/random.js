(function() {
  'use strict';

  const answers = [
    'Absolutely.',
    'Nope.',
    'Ask again after a snack.',
    'The vibes say yes.',
    'The vibes say no.',
    'Maybe. But probably yes.',
    'Maybe. But probably no.',
    'You already know the answer.',
    'It is certain.',
    'Outlook is good.',
    'Don’t count on it.',
    'Highly unlikely.',
    'Try again later.',
    'Concentrate and ask again.',
    'Signs point to yes.',
    'Better not tell you now.',
    'It is decidedly so.',
    'My sources say no.',
    'Outlook not so good.',
    'Yes, but only if you commit.'
  ];

  const nameAdjectives = ['Cosmic', 'Salty', 'Velvet', 'Roasted', 'Electric', 'Golden', 'Midnight', 'Zesty', 'Lunar', 'Wild', 'Crisp', 'Brave', 'Glassy', 'Molten', 'Sunny'];
  const nameNouns = ['Chomp', 'Basilisk', 'Crumb', 'Comet', 'Waffle', 'Sprite', 'Dough', 'Ember', 'Radish', 'Owl', 'Croissant', 'Orbit', 'Sequoia', 'Nova', 'Noodle'];

  function show(id) {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'block';
    }
  }

  function hide(id) {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'none';
    }
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  window.askAnyway = function() {
    const output = document.getElementById('mpocOutput');
    if (!output) return;
    output.textContent = answers[randomInt(0, answers.length - 1)];
    show('mpocResults');
  };

  window.resetMpoc = function() {
    const output = document.getElementById('mpocOutput');
    if (output) output.textContent = '—';
    hide('mpocResults');
  };

  window.doCoinFlip = function() {
    const countInput = document.getElementById('coinCount');
    const output = document.getElementById('coinOutput');
    const counts = document.getElementById('coinCounts');
    if (!countInput || !output || !counts) return;

    let count = parseInt(countInput.value, 10);
    if (Number.isNaN(count) || count < 1) count = 1;
    if (count > 5000) count = 5000;
    countInput.value = count;

    let heads = 0;
    let tails = 0;
    const results = Array.from({ length: count }, () => {
      const flip = Math.random() < 0.5 ? 'H' : 'T';
      if (flip === 'H') heads += 1;
      else tails += 1;
      return flip;
    });

    output.textContent = results.join(' ');
    counts.textContent = `${heads} heads / ${tails} tails`;
    show('coinResults');
  };

  window.resetCoin = function() {
    const output = document.getElementById('coinOutput');
    const counts = document.getElementById('coinCounts');
    if (output) output.textContent = '—';
    if (counts) counts.textContent = '—';
    hide('coinResults');
  };

  window.rollDice = function() {
    const twoDice = document.getElementById('diceTwo');
    const totalEl = document.getElementById('diceTotal');
    const detailsEl = document.getElementById('diceDetails');
    if (!totalEl || !detailsEl) return;

    if (twoDice && twoDice.checked) {
      const first = randomInt(1, 6);
      const second = randomInt(1, 6);
      totalEl.textContent = `${first + second}`;
      detailsEl.textContent = `${first} + ${second}`;
    } else {
      const roll = randomInt(1, 6);
      totalEl.textContent = `${roll}`;
      detailsEl.textContent = `${roll}`;
    }

    show('diceResults');
  };

  window.resetDice = function() {
    const totalEl = document.getElementById('diceTotal');
    const detailsEl = document.getElementById('diceDetails');
    if (totalEl) totalEl.textContent = '—';
    if (detailsEl) detailsEl.textContent = '—';
    hide('diceResults');
  };

  window.generateNumbers = function() {
    const minInput = document.getElementById('numMin');
    const maxInput = document.getElementById('numMax');
    const inclusiveInput = document.getElementById('numInclusive');
    const countInput = document.getElementById('numCount');
    const output = document.getElementById('numOutput');
    if (!minInput || !maxInput || !inclusiveInput || !countInput || !output) return;

    let min = parseInt(minInput.value, 10);
    let max = parseInt(maxInput.value, 10);
    let count = parseInt(countInput.value, 10);

    if (Number.isNaN(min)) min = 0;
    if (Number.isNaN(max)) max = min + 1;
    if (Number.isNaN(count) || count < 1) count = 1;
    if (count > 5000) count = 5000;

    const inclusive = inclusiveInput.checked;
    const upper = inclusive ? max : max - 1;
    if (upper < min) {
      output.value = 'Invalid range.';
      return;
    }

    const results = Array.from({ length: count }, () => randomInt(min, upper));
    output.value = results.join(', ');
  };

  window.resetNumbers = function() {
    const minInput = document.getElementById('numMin');
    const maxInput = document.getElementById('numMax');
    const inclusiveInput = document.getElementById('numInclusive');
    const countInput = document.getElementById('numCount');
    const output = document.getElementById('numOutput');
    if (minInput) minInput.value = '1';
    if (maxInput) maxInput.value = '100';
    if (inclusiveInput) inclusiveInput.checked = true;
    if (countInput) countInput.value = '1';
    if (output) output.value = '';
  };

  window.chompName = function() {
    const output = document.getElementById('chompNameOutput');
    if (!output) return;
    const adjective = nameAdjectives[randomInt(0, nameAdjectives.length - 1)];
    const noun = nameNouns[randomInt(0, nameNouns.length - 1)];
    output.textContent = `${adjective} ${noun}`;
    show('chompNameResults');
  };

  window.resetChompName = function() {
    const output = document.getElementById('chompNameOutput');
    if (output) output.textContent = '—';
    hide('chompNameResults');
  };

  window.generatePassword = function() {
    const lengthInput = document.getElementById('pwLength');
    const lower = document.getElementById('pwLower');
    const upper = document.getElementById('pwUpper');
    const digits = document.getElementById('pwDigits');
    const symbols = document.getElementById('pwSymbols');
    const output = document.getElementById('pwOutput');
    const charsetEl = document.getElementById('pwCharset');
    if (!lengthInput || !output || !charsetEl) return;

    let length = parseInt(lengthInput.value, 10);
    if (Number.isNaN(length) || length < 4) length = 4;
    if (length > 256) length = 256;
    lengthInput.value = length;

    let charset = '';
    const parts = [];
    if (lower && lower.checked) {
      charset += 'abcdefghijklmnopqrstuvwxyz';
      parts.push('lowercase');
    }
    if (upper && upper.checked) {
      charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      parts.push('uppercase');
    }
    if (digits && digits.checked) {
      charset += '0123456789';
      parts.push('digits');
    }
    if (symbols && symbols.checked) {
      charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      parts.push('symbols');
    }

    if (!charset) {
      output.textContent = 'Select at least one character set.';
      charsetEl.textContent = '—';
      show('pwResults');
      return;
    }

    const result = Array.from({ length }, () => charset[randomInt(0, charset.length - 1)]).join('');
    output.textContent = result;
    charsetEl.textContent = parts.join(', ');
    show('pwResults');
  };

  window.resetPassword = function() {
    const lengthInput = document.getElementById('pwLength');
    const lower = document.getElementById('pwLower');
    const upper = document.getElementById('pwUpper');
    const digits = document.getElementById('pwDigits');
    const symbols = document.getElementById('pwSymbols');
    const output = document.getElementById('pwOutput');
    const charsetEl = document.getElementById('pwCharset');
    if (lengthInput) lengthInput.value = '24';
    if (lower) lower.checked = true;
    if (upper) upper.checked = true;
    if (digits) digits.checked = true;
    if (symbols) symbols.checked = false;
    if (output) output.textContent = '—';
    if (charsetEl) charsetEl.textContent = '—';
    hide('pwResults');
  };

  window.rankItems = function() {
    const input = document.getElementById('rankInput');
    const output = document.getElementById('rankOutput');
    if (!input || !output) return;

    const items = input.value
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    if (!items.length) {
      output.value = '';
      return;
    }

    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    output.value = items.map((item, index) => `${index + 1}. ${item}`).join('\n');
  };

  window.resetRank = function() {
    const input = document.getElementById('rankInput');
    const output = document.getElementById('rankOutput');
    if (input) input.value = '';
    if (output) output.value = '';
  };

  function rgbToHex(r, g, b) {
    return `#${[r, g, b].map(value => value.toString(16).padStart(2, '0')).join('')}`;
  }

  function rgbToHsl(r, g, b) {
    const nr = r / 255;
    const ng = g / 255;
    const nb = b / 255;
    const max = Math.max(nr, ng, nb);
    const min = Math.min(nr, ng, nb);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case nr:
          h = (ng - nb) / d + (ng < nb ? 6 : 0);
          break;
        case ng:
          h = (nb - nr) / d + 2;
          break;
        default:
          h = (nr - ng) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  window.randomColor = function() {
    const swatch = document.getElementById('colorSwatch');
    const hexEl = document.getElementById('colorHex');
    const rgbEl = document.getElementById('colorRgb');
    const hslEl = document.getElementById('colorHsl');
    if (!swatch || !hexEl || !rgbEl || !hslEl) return;

    const r = randomInt(0, 255);
    const g = randomInt(0, 255);
    const b = randomInt(0, 255);

    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);

    swatch.style.background = hex;
    hexEl.textContent = hex.toUpperCase();
    rgbEl.textContent = `rgb(${r}, ${g}, ${b})`;
    hslEl.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    show('colorResults');
  };

  window.resetColor = function() {
    const swatch = document.getElementById('colorSwatch');
    const hexEl = document.getElementById('colorHex');
    const rgbEl = document.getElementById('colorRgb');
    const hslEl = document.getElementById('colorHsl');
    if (swatch) swatch.style.background = 'transparent';
    if (hexEl) hexEl.textContent = '—';
    if (rgbEl) rgbEl.textContent = '—';
    if (hslEl) hslEl.textContent = '—';
    hide('colorResults');
  };
})();
