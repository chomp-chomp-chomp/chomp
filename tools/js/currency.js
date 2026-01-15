(function() {
  'use strict';

  async function fetchRates(base, date) {
    const endpoint = date
      ? `https://api.frankfurter.app/${date}?from=${base}`
      : `https://api.frankfurter.app/latest?from=${base}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch rates');
    }
    return response.json();
  }

  function formatAmount(value, currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(value);
  }

  function updatePopularRates(rates, base) {
    const popular = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];
    const list = document.getElementById('popularRatesList');
    const container = document.getElementById('popularRates');
    if (!list || !container) return;

    list.innerHTML = '';
    popular.filter((code) => code !== base && rates[code]).forEach((code) => {
      const card = document.createElement('div');
      card.style.border = '1px solid var(--color-border)';
      card.style.padding = '8px 10px';
      card.style.borderRadius = '8px';
      card.innerHTML = `<strong>${code}</strong><div style="color: var(--color-text-secondary);">${rates[code].toFixed(4)}</div>`;
      list.appendChild(card);
    });

    container.style.display = list.children.length ? 'block' : 'none';
  }

  window.swapCurrencies = function() {
    const from = document.getElementById('fromCurrency');
    const to = document.getElementById('toCurrency');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
  };

  window.applyPreset = function(fromCode, toCode) {
    document.getElementById('fromCurrency').value = fromCode;
    document.getElementById('toCurrency').value = toCode;
  };

  window.convertCurrency = async function() {
    const amount = parseFloat(document.getElementById('amount').value || '0');
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    const dateInput = document.getElementById('rateDate').value;

    if (Number.isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const data = await fetchRates(from, dateInput || null);
      const rate = data.rates[to];
      const converted = amount * rate;

      document.getElementById('convertedAmount').textContent = formatAmount(converted, to);
      document.getElementById('conversionRate').textContent = `1 ${from} = ${rate.toFixed(6)} ${to}`;
      document.getElementById('rateTimestamp').textContent = data.date || dateInput || 'Latest';
      updatePopularRates(data.rates, from);
    } catch (error) {
      document.getElementById('convertedAmount').textContent = '--';
      document.getElementById('conversionRate').textContent = 'Could not fetch rates';
      document.getElementById('rateTimestamp').textContent = '--';
    }
  };

  window.resetConverter = function() {
    document.getElementById('amount').value = '1';
    document.getElementById('fromCurrency').value = 'USD';
    document.getElementById('toCurrency').value = 'EUR';
    document.getElementById('rateDate').value = '';
    document.getElementById('convertedAmount').textContent = '--';
    document.getElementById('conversionRate').textContent = '—';
    document.getElementById('rateTimestamp').textContent = '--';
    document.getElementById('popularRates').style.display = 'none';
  };
})();
