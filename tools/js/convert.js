(function() {
  'use strict';

  const units = {
    length: {
      m: { name: 'Meters', factor: 1 },
      km: { name: 'Kilometers', factor: 0.001 },
      ft: { name: 'Feet', factor: 3.28084 },
      mi: { name: 'Miles', factor: 0.000621371 },
      in: { name: 'Inches', factor: 39.3701 },
      cm: { name: 'Centimeters', factor: 100 }
    },
    weight: {
      kg: { name: 'Kilograms', factor: 1 },
      g: { name: 'Grams', factor: 1000 },
      lb: { name: 'Pounds', factor: 2.20462 },
      oz: { name: 'Ounces', factor: 35.274 },
      ton: { name: 'Metric Tons', factor: 0.001 }
    },
    volume: {
      l: { name: 'Liters', factor: 1 },
      ml: { name: 'Milliliters', factor: 1000 },
      gal: { name: 'Gallons', factor: 0.264172 },
      qt: { name: 'Quarts', factor: 1.05669 },
      cup: { name: 'Cups', factor: 4.22675 },
      tbsp: { name: 'Tablespoons', factor: 67.628 }
    },
    temperature: {
      c: { name: 'Celsius' },
      f: { name: 'Fahrenheit' },
      k: { name: 'Kelvin' }
    },
    area: {
      m2: { name: 'Square Meters', factor: 1 },
      km2: { name: 'Square Kilometers', factor: 0.000001 },
      ft2: { name: 'Square Feet', factor: 10.7639 },
      acre: { name: 'Acres', factor: 0.000247105 },
      ha: { name: 'Hectares', factor: 0.0001 }
    },
    speed: {
      mps: { name: 'Meters/Second', factor: 1 },
      kph: { name: 'Kilometers/Hour', factor: 3.6 },
      mph: { name: 'Miles/Hour', factor: 2.23694 },
      knot: { name: 'Knots', factor: 1.94384 }
    }
  };

  function updateUnitOptions() {
    const type = document.getElementById('conversionType').value;
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');

    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';

    Object.entries(units[type]).forEach(([key, value]) => {
      fromUnit.add(new Option(value.name, key));
      toUnit.add(new Option(value.name, key));
    });

    if (toUnit.options.length > 1) {
      toUnit.selectedIndex = 1;
    }
  }

  function convertTemperature(value, from, to) {
    let celsius;

    if (from === 'c') celsius = value;
    else if (from === 'f') celsius = (value - 32) * 5 / 9;
    else celsius = value - 273.15;

    if (to === 'c') return celsius;
    if (to === 'f') return celsius * 9 / 5 + 32;
    return celsius + 273.15;
  }

  window.convert = function() {
    const value = parseFloat(document.getElementById('inputValue').value);
    const type = document.getElementById('conversionType').value;
    const from = document.getElementById('fromUnit').value;
    const to = document.getElementById('toUnit').value;

    if (Number.isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }

    let result;

    if (type === 'temperature') {
      result = convertTemperature(value, from, to);
    } else {
      const fromFactor = units[type][from].factor;
      const toFactor = units[type][to].factor;
      result = (value / fromFactor) * toFactor;
    }

    document.getElementById('resultValue').textContent = `${result.toFixed(6)} ${units[type][to].name}`;
    document.getElementById('results').style.display = 'block';
  };

  window.reset = function() {
    document.getElementById('inputValue').value = '1';
    document.getElementById('conversionType').selectedIndex = 0;
    updateUnitOptions();
    document.getElementById('results').style.display = 'none';
  };

  document.addEventListener('DOMContentLoaded', () => {
    updateUnitOptions();

    document.getElementById('conversionType').addEventListener('change', updateUnitOptions);
    document.getElementById('inputValue').addEventListener('input', () => {
      if (document.getElementById('results').style.display === 'block') {
        window.convert();
      }
    });
    document.getElementById('fromUnit').addEventListener('change', () => {
      if (document.getElementById('results').style.display === 'block') {
        window.convert();
      }
    });
    document.getElementById('toUnit').addEventListener('change', () => {
      if (document.getElementById('results').style.display === 'block') {
        window.convert();
      }
    });
  });
})();
