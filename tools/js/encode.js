(function() {
  'use strict';

  let input;
  let output;
  let encodeType;

  function encodeURIComp() {
    try {
      output.value = encodeURIComponent(input.value);
    } catch (e) {
      output.value = 'Error encoding text';
    }
  }

  function decodeURIComp() {
    try {
      output.value = decodeURIComponent(input.value);
    } catch (e) {
      output.value = 'Error decoding text';
    }
  }

  function base64Encode() {
    try {
      output.value = btoa(input.value);
    } catch (e) {
      output.value = 'Error encoding Base64';
    }
  }

  function base64Decode() {
    try {
      output.value = atob(input.value);
    } catch (e) {
      output.value = 'Error decoding Base64';
    }
  }

  function hexEncode() {
    try {
      output.value = Array.from(input.value)
        .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
    } catch (e) {
      output.value = 'Error encoding to hex';
    }
  }

  function hexDecode() {
    try {
      const hex = input.value.replace(/\s/g, '');
      if (hex.length % 2 !== 0) {
        output.value = 'Invalid hex string (odd length)';
        return;
      }
      output.value = hex.match(/.{1,2}/g)
        .map((byte) => String.fromCharCode(parseInt(byte, 16)))
        .join('');
    } catch (e) {
      output.value = 'Error decoding hex';
    }
  }

  function binaryEncode() {
    try {
      output.value = Array.from(input.value)
        .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');
    } catch (e) {
      output.value = 'Error encoding to binary';
    }
  }

  function binaryDecode() {
    try {
      const binary = input.value.replace(/\s/g, '');
      if (binary.length % 8 !== 0) {
        output.value = 'Invalid binary string (length must be multiple of 8)';
        return;
      }
      output.value = binary.match(/.{1,8}/g)
        .map((byte) => String.fromCharCode(parseInt(byte, 2)))
        .join('');
    } catch (e) {
      output.value = 'Error decoding binary';
    }
  }

  async function sha256Hash() {
    try {
      const msgBuffer = new TextEncoder().encode(input.value);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      output.value = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      output.value = 'Error generating SHA-256 hash';
    }
  }

  window.processEncode = function() {
    const selectedType = encodeType.value;
    if (!selectedType) {
      alert('Please select an encoding type');
      return;
    }

    const functions = {
      encodeURI: encodeURIComp,
      decodeURI: decodeURIComp,
      base64Encode,
      base64Decode,
      hexEncode,
      hexDecode,
      binaryEncode,
      binaryDecode,
      sha256Hash
    };

    if (functions[selectedType]) {
      functions[selectedType]();
    }
  };

  window.clearFields = function() {
    input.value = '';
    output.value = '';
    encodeType.selectedIndex = 0;
  };

  window.copyOutput = function() {
    output.select();
    navigator.clipboard.writeText(output.value).then(() => {
      const btn = document.activeElement;
      if (btn && btn.tagName === 'BUTTON') {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }
    }).catch(() => {
      alert('Failed to copy');
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    input = document.getElementById('input');
    output = document.getElementById('output');
    encodeType = document.getElementById('encodeType');
  });
})();
