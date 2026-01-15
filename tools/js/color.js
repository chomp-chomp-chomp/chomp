(function() {
  'use strict';

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function hexToRgb(hex) {
    let cleaned = hex.trim().replace('#', '');
    if (cleaned.length === 3) {
      cleaned = cleaned.split('').map((ch) => ch + ch).join('');
    }
    if (cleaned.length !== 6) return null;
    const num = parseInt(cleaned, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function rgbToHex(r, g, b) {
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
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

  function hslToRgb(h, s, l) {
    const ns = s / 100;
    const nl = l / 100;
    const c = (1 - Math.abs(2 * nl - 1)) * ns;
    const hh = h / 60;
    const x = c * (1 - Math.abs((hh % 2) - 1));
    let r1 = 0;
    let g1 = 0;
    let b1 = 0;

    if (hh >= 0 && hh < 1) {
      r1 = c;
      g1 = x;
    } else if (hh >= 1 && hh < 2) {
      r1 = x;
      g1 = c;
    } else if (hh >= 2 && hh < 3) {
      g1 = c;
      b1 = x;
    } else if (hh >= 3 && hh < 4) {
      g1 = x;
      b1 = c;
    } else if (hh >= 4 && hh < 5) {
      r1 = x;
      b1 = c;
    } else if (hh >= 5 && hh < 6) {
      r1 = c;
      b1 = x;
    }

    const m = nl - c / 2;
    return {
      r: Math.round((r1 + m) * 255),
      g: Math.round((g1 + m) * 255),
      b: Math.round((b1 + m) * 255)
    };
  }

  function show(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
  }

  function hide(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  function updateConverterPreview(rgb) {
    const swatch = document.getElementById('convSwatch');
    const previewText = document.getElementById('convPreviewText');
    const cssOut = document.getElementById('convCss');
    if (!swatch || !previewText || !cssOut) return;
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    swatch.style.background = hex;
    previewText.textContent = `${hex} • rgb(${rgb.r}, ${rgb.g}, ${rgb.b}) • hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    cssOut.textContent = `color: ${hex};`;
    show('convResults');
  }

  window.applyFromHex = function() {
    const hexInput = document.getElementById('convHex');
    if (!hexInput) return;
    const rgb = hexToRgb(hexInput.value);
    if (!rgb) return;

    document.getElementById('convR').value = rgb.r;
    document.getElementById('convG').value = rgb.g;
    document.getElementById('convB').value = rgb.b;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    document.getElementById('convH').value = hsl.h;
    document.getElementById('convS').value = hsl.s;
    document.getElementById('convL').value = hsl.l;

    updateConverterPreview(rgb);
  };

  window.applyFromRgb = function() {
    const r = clamp(parseInt(document.getElementById('convR').value, 10), 0, 255);
    const g = clamp(parseInt(document.getElementById('convG').value, 10), 0, 255);
    const b = clamp(parseInt(document.getElementById('convB').value, 10), 0, 255);
    const hex = rgbToHex(r, g, b);
    document.getElementById('convHex').value = hex;

    const hsl = rgbToHsl(r, g, b);
    document.getElementById('convH').value = hsl.h;
    document.getElementById('convS').value = hsl.s;
    document.getElementById('convL').value = hsl.l;

    updateConverterPreview({ r, g, b });
  };

  window.applyFromHsl = function() {
    const h = clamp(parseInt(document.getElementById('convH').value, 10), 0, 360);
    const s = clamp(parseInt(document.getElementById('convS').value, 10), 0, 100);
    const l = clamp(parseInt(document.getElementById('convL').value, 10), 0, 100);

    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    document.getElementById('convHex').value = hex;
    document.getElementById('convR').value = rgb.r;
    document.getElementById('convG').value = rgb.g;
    document.getElementById('convB').value = rgb.b;

    updateConverterPreview(rgb);
  };

  window.resetConverter = function() {
    document.getElementById('convHex').value = '#EA7480';
    document.getElementById('convR').value = 234;
    document.getElementById('convG').value = 116;
    document.getElementById('convB').value = 128;
    document.getElementById('convH').value = 353;
    document.getElementById('convS').value = 76;
    document.getElementById('convL').value = 69;
    hide('convResults');
  };

  function generatePaletteColors(baseHex, mode, count, spread) {
    const rgb = hexToRgb(baseHex) || { r: 234, g: 116, b: 128 };
    const baseHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors = [];

    if (mode === 'monochrome') {
      const step = spread / Math.max(1, count - 1);
      for (let i = 0; i < count; i += 1) {
        const l = clamp(baseHsl.l - spread / 2 + step * i, 5, 95);
        const color = hslToRgb(baseHsl.h, baseHsl.s, l);
        colors.push(rgbToHex(color.r, color.g, color.b));
      }
      return colors;
    }

    const modeMap = {
      analogous: [0, -1, 1, -2, 2],
      complementary: [0, 2],
      splitComplementary: [0, 2, -2],
      triadic: [0, 2, 4],
      tetradic: [0, 2, 4, 6]
    };

    const offsets = modeMap[mode] || [0];
    const step = spread;
    for (let i = 0; i < count; i += 1) {
      const offset = offsets[i % offsets.length];
      const hue = (baseHsl.h + offset * step + 360) % 360;
      const lightness = clamp(baseHsl.l + (i - count / 2) * 4, 10, 90);
      const color = hslToRgb(hue, baseHsl.s, lightness);
      colors.push(rgbToHex(color.r, color.g, color.b));
    }

    return colors;
  }

  window.generatePalette = function() {
    const base = document.getElementById('palBase').value || '#EA7480';
    const mode = document.getElementById('palMode').value;
    const count = clamp(parseInt(document.getElementById('palCount').value, 10) || 6, 3, 12);
    const spread = clamp(parseInt(document.getElementById('palSpread').value, 10) || 28, 5, 120);

    const colors = generatePaletteColors(base, mode, count, spread);
    const swatches = document.getElementById('palSwatches');
    const list = document.getElementById('palHexList');
    if (!swatches || !list) return;

    swatches.innerHTML = '';
    colors.forEach((hex) => {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.justifyContent = 'space-between';
      item.style.gap = '10px';
      item.style.padding = '8px 10px';
      item.style.borderRadius = '8px';
      item.style.border = '1px solid var(--color-border)';
      item.style.background = 'rgba(0,0,0,0.1)';

      const swatch = document.createElement('span');
      swatch.style.width = '38px';
      swatch.style.height = '22px';
      swatch.style.borderRadius = '6px';
      swatch.style.background = hex;
      swatch.style.border = '1px solid rgba(255,255,255,0.2)';

      const label = document.createElement('span');
      label.textContent = hex;

      item.appendChild(swatch);
      item.appendChild(label);
      swatches.appendChild(item);
    });

    list.value = colors.join('\n');
    show('palResults');
  };

  window.randomizePaletteBase = function() {
    const hex = rgbToHex(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    );
    document.getElementById('palBase').value = hex;
    window.generatePalette();
  };

  window.resetPalette = function() {
    document.getElementById('palBase').value = '#EA7480';
    document.getElementById('palMode').value = 'monochrome';
    document.getElementById('palCount').value = 6;
    document.getElementById('palSpread').value = 28;
    hide('palResults');
  };

  function luminance(rgb) {
    const toLinear = (channel) => {
      const c = channel / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const r = toLinear(rgb.r);
    const g = toLinear(rgb.g);
    const b = toLinear(rgb.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function contrastRatio(fg, bg) {
    const l1 = luminance(fg) + 0.05;
    const l2 = luminance(bg) + 0.05;
    return l1 > l2 ? l1 / l2 : l2 / l1;
  }

  function wcagLabel(ratio, isLarge) {
    const aa = isLarge ? 3 : 4.5;
    const aaa = isLarge ? 4.5 : 7;
    if (ratio >= aaa) return 'AAA';
    if (ratio >= aa) return 'AA';
    return 'Fail';
  }

  window.checkContrast = function() {
    const fgHex = document.getElementById('ctFg').value;
    const bgHex = document.getElementById('ctBg').value;
    const fg = hexToRgb(fgHex);
    const bg = hexToRgb(bgHex);
    if (!fg || !bg) return;

    const ratio = contrastRatio(fg, bg);
    document.getElementById('ctRatio').textContent = ratio.toFixed(2);
    document.getElementById('ctNormal').textContent = wcagLabel(ratio, false);
    document.getElementById('ctLarge').textContent = wcagLabel(ratio, true);

    const preview = document.getElementById('ctPreview');
    if (preview) {
      preview.style.background = rgbToHex(bg.r, bg.g, bg.b);
      preview.style.color = rgbToHex(fg.r, fg.g, fg.b);
    }

    show('ctResults');
  };

  window.swapContrast = function() {
    const fg = document.getElementById('ctFg');
    const bg = document.getElementById('ctBg');
    const temp = fg.value;
    fg.value = bg.value;
    bg.value = temp;
    window.checkContrast();
  };

  window.autoTextColor = function() {
    const bgHex = document.getElementById('ctBg').value;
    const bg = hexToRgb(bgHex);
    if (!bg) return;
    const light = luminance(bg) > 0.5;
    document.getElementById('ctFg').value = light ? '#231F1F' : '#FFFFFF';
    window.checkContrast();
  };

  window.resetContrast = function() {
    document.getElementById('ctFg').value = '#231F1F';
    document.getElementById('ctBg').value = '#FFFFFF';
    hide('ctResults');
  };

  function updateUtil(hex) {
    const swatch = document.getElementById('utilSwatch');
    const out = document.getElementById('utilOut');
    if (swatch) swatch.style.background = hex;
    if (out) out.textContent = hex;
    show('utilResults');
  }

  function adjustLightness(amount) {
    const hex = document.getElementById('utilHex').value;
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const adjusted = clamp(hsl.l + amount, 0, 100);
    const resultRgb = hslToRgb(hsl.h, hsl.s, adjusted);
    updateUtil(rgbToHex(resultRgb.r, resultRgb.g, resultRgb.b));
  }

  window.doLighten = function() {
    const amt = clamp(parseInt(document.getElementById('utilAmt').value, 10) || 0, 1, 100);
    adjustLightness(Math.round(amt * 0.6));
  };

  window.doDarken = function() {
    const amt = clamp(parseInt(document.getElementById('utilAmt').value, 10) || 0, 1, 100);
    adjustLightness(Math.round(-amt * 0.6));
  };

  window.doInvert = function() {
    const rgb = hexToRgb(document.getElementById('utilHex').value);
    if (!rgb) return;
    updateUtil(rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b));
  };

  window.doGrayscale = function() {
    const rgb = hexToRgb(document.getElementById('utilHex').value);
    if (!rgb) return;
    const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
    updateUtil(rgbToHex(gray, gray, gray));
  };

  window.resetUtils = function() {
    document.getElementById('utilHex').value = '#EA7480';
    document.getElementById('utilAmt').value = 12;
    hide('utilResults');
  };
})();
