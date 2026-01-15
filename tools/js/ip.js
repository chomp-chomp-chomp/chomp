(function() {
  'use strict';

  const API_KEY = '25463b02f43f7899916d89b8eb4043ec';
  let currentIP = '';

  async function getIP() {
    try {
      const response = await fetch(`https://api.whatismyip.com/ip.php?key=${API_KEY}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const ip = await response.text();
      currentIP = ip.trim();
      document.getElementById('ipDisplay').textContent = currentIP;
    } catch (error) {
      document.getElementById('ipDisplay').textContent = 'Unable to fetch IP';
      console.error('Error fetching IP:', error);
    }
  }

  window.lookupIP = async function() {
    if (!currentIP) {
      alert('IP address not loaded yet');
      return;
    }

    try {
      const lookupResponse = await fetch(`https://api.whatismyip.com/ip-address-lookup.php?key=${API_KEY}&input=${currentIP}&output=json`);

      if (!lookupResponse.ok) {
        throw new Error(`HTTP error! status: ${lookupResponse.status}`);
      }

      const jsonData = await lookupResponse.json();
      const lookupArray = jsonData.ip_address_lookup || [];
      const data = lookupArray.length === 1 ? lookupArray[0] : (lookupArray[1] || {});

      document.getElementById('ip').textContent = currentIP;
      document.getElementById('city').textContent = data.city || 'n/a';
      document.getElementById('region').textContent = data.region || 'n/a';
      document.getElementById('postal').textContent = data.postalcode || 'n/a';
      document.getElementById('country').textContent = data.country || 'n/a';

      if (data.latitude && data.longitude) {
        const mapLink = document.createElement('a');
        mapLink.href = `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`;
        mapLink.target = '_blank';
        mapLink.textContent = `${data.latitude}, ${data.longitude}`;
        document.getElementById('coordinates').innerHTML = '';
        document.getElementById('coordinates').appendChild(mapLink);
      } else {
        document.getElementById('coordinates').textContent = 'n/a';
      }

      document.getElementById('timezone').textContent = data.time || 'n/a';

      const now = new Date();
      const localTimeStr = now.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      document.getElementById('localtime').textContent = localTimeStr;

      document.getElementById('isp').textContent = data.isp || 'n/a';
      document.getElementById('org').textContent = data.isp || 'n/a';

      if (data.asn) {
        const asnLink = document.createElement('a');
        asnLink.href = `https://asnlookup.com/asn/AS${data.asn}`;
        asnLink.target = '_blank';
        asnLink.textContent = `AS${data.asn}`;
        document.getElementById('asn').innerHTML = '';
        document.getElementById('asn').appendChild(asnLink);
      } else {
        document.getElementById('asn').textContent = 'n/a';
      }

      document.getElementById('results').style.display = 'block';

      await getHostname(currentIP);
      await fetchWHOIS(currentIP);
      displayBrowserDetails();

      document.getElementById('copyAllBtn').style.display = 'inline-block';
    } catch (error) {
      alert('Error fetching IP details. Please try again.');
      console.error('Error:', error);
    }
  };

  async function getHostname(ip) {
    try {
      const response = await fetch(`https://api.whatismyip.com/host-name.php?key=${API_KEY}&input=${ip}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const hostname = await response.text();
      document.getElementById('domain').textContent = hostname.trim() || 'n/a';
    } catch (error) {
      console.error('Error fetching hostname:', error);
      document.getElementById('domain').textContent = 'n/a';
    }
  }

  async function fetchWHOIS(ip) {
    try {
      const response = await fetch(`https://api.whatismyip.com/whois.php?key=${API_KEY}&input=${ip}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let whois = await response.text();

      whois = whois.replace(
        /please report at[\s\n]*#[\s\n]*https:\/\/www\.arin\.net\/resources\/registry\/whois\/inaccuracy_reporting\//g,
        'please <a href="https://www.arin.net/resources/registry/whois/inaccuracy_reporting/" target="_blank">report</a> them.'
      );

      whois = whois.replace(
        /subject to the Terms of Use[\s\n]*#[\s\n]*available at:\s*https:\/\/www\.arin\.net\/resources\/registry\/whois\/tou\//g,
        'subject to the <a href="https://www.arin.net/resources/registry/whois/tou/" target="_blank">Terms of Use</a>.'
      );

      document.getElementById('whoisData').value = whois;

      const rangeMatch = whois.match(/(\d+\.\d+\.\d+\.\d+)\s*-\s*(\d+\.\d+\.\d+\.\d+)/);

      if (rangeMatch) {
        const startIP = rangeMatch[1];
        const endIP = rangeMatch[2];
        const cidr = rangeToCIDR(startIP, endIP);
        document.getElementById('network').textContent = `${cidr} (${startIP} - ${endIP})`;
      } else {
        document.getElementById('network').textContent = 'n/a';
      }

      document.getElementById('whoisResults').style.display = 'block';
    } catch (error) {
      document.getElementById('whoisData').value = 'Unable to fetch WHOIS data';
      document.getElementById('whoisResults').style.display = 'block';
      console.error('WHOIS error:', error);
    }
  }

  function rangeToCIDR(startIP, endIP) {
    const ipToInt = (ip) => ip.split('.').reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0) >>> 0;

    const start = ipToInt(startIP);
    const end = ipToInt(endIP);
    const rangeSize = end - start + 1;
    const prefixLength = 32 - Math.floor(Math.log2(rangeSize));

    return `${startIP}/${prefixLength}`;
  }

  function displayBrowserDetails() {
    document.getElementById('userAgent').textContent = navigator.userAgent || '-';
    document.getElementById('screenRes').textContent = `${screen.width} x ${screen.height}` || '-';
    document.getElementById('browserLang').textContent = navigator.language || '-';
    document.getElementById('platform').textContent = navigator.platform || '-';
    document.getElementById('cookies').textContent = navigator.cookieEnabled ? 'yes' : 'no';
    document.getElementById('dnt').textContent = navigator.doNotTrack || '0';

    document.getElementById('browserDetails').style.display = 'block';
  }

  window.copyIP = function(e) {
    if (!currentIP) {
      alert('IP address not loaded yet');
      return;
    }

    navigator.clipboard.writeText(currentIP).then(() => {
      const btn = e.target;
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    }).catch((err) => {
      alert('Failed to copy IP address');
      console.error('Copy error:', err);
    });
  };

  window.copyAllDetails = function(e) {
    let allDetails = '=== MY IP ADDRESS ===\n\n';
    allDetails += `IP Address: ${document.getElementById('ip').textContent}\n`;
    allDetails += `City: ${document.getElementById('city').textContent}\n`;
    allDetails += `State/Region: ${document.getElementById('region').textContent}\n`;
    allDetails += `Postal Code: ${document.getElementById('postal').textContent}\n`;
    allDetails += `Country: ${document.getElementById('country').textContent}\n`;
    allDetails += `Coordinates: ${document.getElementById('coordinates').textContent}\n`;
    allDetails += `Time Zone: ${document.getElementById('timezone').textContent}\n`;
    allDetails += `Local Time: ${document.getElementById('localtime').textContent}\n`;
    allDetails += `ISP: ${document.getElementById('isp').textContent}\n`;
    allDetails += `Domain: ${document.getElementById('domain').textContent}\n`;
    allDetails += `Organization: ${document.getElementById('org').textContent}\n`;
    allDetails += `ASN: ${document.getElementById('asn').textContent}\n`;
    allDetails += `Network IP Range: ${document.getElementById('network').textContent}\n\n`;

    allDetails += '=== IP ADDRESS WHOIS ===\n\n';
    allDetails += `${document.getElementById('whoisData').value}\n\n`;

    allDetails += '=== ADDITIONAL DETAILS ===\n\n';
    allDetails += `User Agent: ${document.getElementById('userAgent').textContent}\n`;
    allDetails += `Screen Resolution: ${document.getElementById('screenRes').textContent}\n`;
    allDetails += `Browser Language: ${document.getElementById('browserLang').textContent}\n`;
    allDetails += `Platform: ${document.getElementById('platform').textContent}\n`;
    allDetails += `Cookies Enabled: ${document.getElementById('cookies').textContent}\n`;
    allDetails += `Do Not Track: ${document.getElementById('dnt').textContent}\n`;

    navigator.clipboard.writeText(allDetails).then(() => {
      const btn = e.target;
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    }).catch((err) => {
      alert('Failed to copy details');
      console.error('Copy error:', err);
    });
  };

  window.addEventListener('load', getIP);
})();
