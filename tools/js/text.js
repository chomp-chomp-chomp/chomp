(function() {
  'use strict';

  const input = document.getElementById('inputText');
  const copyBtn = document.getElementById('copyBtn');
  const undoBtn = document.getElementById('undoBtn');
  const resetBtn = document.getElementById('resetBtn');
  const actionButtons = document.querySelectorAll('[data-action]');

  const history = [];

  function updateCounts() {
    const text = input.value;
    document.getElementById('charsWithSpaces').textContent = text.length;
    document.getElementById('charsNoSpaces').textContent = text.replace(/\s/g, '').length;

    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById('wordCount').textContent = words;

    const lines = text ? text.split(/\n/).length : 0;
    document.getElementById('lineCount').textContent = lines;

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    document.getElementById('sentenceCount').textContent = sentences.length;
  }

  function pushHistory() {
    history.push(input.value);
    undoBtn.disabled = history.length === 0;
  }

  function setText(newText) {
    pushHistory();
    input.value = newText;
    updateCounts();
  }

  function normalizeLines(text) {
    return text.replace(/\r\n/g, '\n');
  }

  function getLines(text) {
    return normalizeLines(text).split('\n');
  }

  function wrapLine(line, width) {
    if (!line || line.length <= width) return line;
    const words = line.split(/\s+/);
    let current = '';
    const lines = [];

    words.forEach((word) => {
      if ((current + word).length > width) {
        if (current) lines.push(current.trim());
        current = `${word} `;
      } else {
        current += `${word} `;
      }
    });

    if (current) lines.push(current.trim());
    return lines.join('\n');
  }

  const actions = {
    sortAsc: (text) => getLines(text).sort((a, b) => a.localeCompare(b)).join('\n'),
    sortDesc: (text) => getLines(text).sort((a, b) => b.localeCompare(a)).join('\n'),
    dedupeLines: (text) => {
      const seen = new Set();
      return getLines(text).filter((line) => {
        if (seen.has(line)) return false;
        seen.add(line);
        return true;
      }).join('\n');
    },
    reverseText: (text) => text.split('').reverse().join(''),
    reverseLines: (text) => getLines(text).reverse().join('\n'),
    numberLines: (text) => getLines(text).map((line, idx) => `${idx + 1}. ${line}`).join('\n'),
    removeLineNumbers: (text) => getLines(text).map((line) => line.replace(/^\s*\d+[.)-:]?\s+/, '')).join('\n'),
    removeBullets: (text) => getLines(text).map((line) => line.replace(/^\s*[-*•]+\s+/, '')).join('\n'),
    uniqueLinesCI: (text) => {
      const seen = new Set();
      return getLines(text).filter((line) => {
        const key = line.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).join('\n');
    },
    addPrefixSuffix: (text) => {
      const prefix = document.getElementById('prefixInput').value || '';
      const suffix = document.getElementById('suffixInput').value || '';
      return getLines(text).map((line) => `${prefix}${line}${suffix}`).join('\n');
    },
    wrapLines: (text) => {
      const width = parseInt(document.getElementById('wrapWidthInput').value, 10) || 80;
      return getLines(text).map((line) => wrapLine(line, width)).join('\n');
    },
    sentenceCase: (text) => {
      const lower = text.toLowerCase();
      return lower.replace(/(^|[.!?]\s+)([a-z])/g, (match, prefix, letter) => `${prefix}${letter.toUpperCase()}`);
    },
    toggleCase: (text) => text.split('').map((char) => {
      const lower = char.toLowerCase();
      return char === lower ? char.toUpperCase() : lower;
    }).join(''),
    capitalizeLines: (text) => getLines(text).map((line) => line.charAt(0).toUpperCase() + line.slice(1)).join('\n'),
    removeDiacritics: (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    smartQuotesToAscii: (text) => text
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/…/g, '...'),
    asciiToSmartQuotes: (text) => {
      let result = '';
      let doubleOpen = true;
      let singleOpen = true;
      for (const char of text) {
        if (char === '"') {
          result += doubleOpen ? '“' : '”';
          doubleOpen = !doubleOpen;
        } else if (char === "'") {
          result += singleOpen ? '‘' : '’';
          singleOpen = !singleOpen;
        } else {
          result += char;
        }
      }
      return result;
    },
    removeTrailingWhitespace: (text) => getLines(text).map((line) => line.replace(/\s+$/, '')).join('\n'),
    indentBlock: (text) => {
      const size = parseInt(document.getElementById('indentSizeInput').value, 10) || 2;
      const spaces = ' '.repeat(size);
      return getLines(text).map((line) => `${spaces}${line}`).join('\n');
    },
    unindentBlock: (text) => {
      const size = parseInt(document.getElementById('indentSizeInput').value, 10) || 2;
      const regex = new RegExp(`^ {0,${size}}`);
      return getLines(text).map((line) => line.replace(regex, '')).join('\n');
    },
    tabsToSpaces: (text) => {
      const size = parseInt(document.getElementById('tabSizeInput').value, 10) || 2;
      return text.replace(/\t/g, ' '.repeat(size));
    },
    spacesToTabs: (text) => {
      const size = parseInt(document.getElementById('tabSizeInput').value, 10) || 2;
      const regex = new RegExp(` {${size}}`, 'g');
      return text.replace(regex, '\t');
    },
    alignColumns: (text) => {
      let delimiter = document.getElementById('delimiterInput').value || ',';
      if (delimiter === '\\t') delimiter = '\t';
      const rows = getLines(text).map((line) => line.split(delimiter));
      const widths = [];
      rows.forEach((row) => {
        row.forEach((cell, idx) => {
          widths[idx] = Math.max(widths[idx] || 0, cell.trim().length);
        });
      });
      return rows.map((row) => row.map((cell, idx) => cell.trim().padEnd(widths[idx], ' ')).join(`${delimiter} `)).join('\n');
    },
    emDashToHyphen: (text) => text.replace(/—/g, ' - '),
    emDashToDoubleHyphen: (text) => text.replace(/—/g, ' -- '),
    emDashToColon: (text) => text.replace(/—/g, ': '),
    emDashToSemicolon: (text) => text.replace(/—/g, '; ')
  };

  actionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (!actions[action]) return;
      const newText = actions[action](input.value);
      setText(newText);
    });
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(input.value).then(() => {
      const original = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 2000);
    });
  });

  undoBtn.addEventListener('click', () => {
    const previous = history.pop();
    if (previous !== undefined) {
      input.value = previous;
      updateCounts();
    }
    undoBtn.disabled = history.length === 0;
  });

  resetBtn.addEventListener('click', () => {
    input.value = '';
    history.length = 0;
    undoBtn.disabled = true;
    updateCounts();
  });

  input.addEventListener('input', updateCounts);
  updateCounts();
})();
