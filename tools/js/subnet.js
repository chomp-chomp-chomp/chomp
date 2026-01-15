(function() {
  'use strict';

  function ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  }

  function intToIp(int) {
    return [
      (int >>> 24) & 0xFF,
      (int >>> 16) & 0xFF,
      (int >>> 8) & 0xFF,
      int & 0xFF
    ].join('.');
  }

  function cidrToMask(cidr) {
    const mask = ~(2 ** (32 - cidr) - 1);
    return intToIp(mask >>> 0);
  }

  function maskToCidr(mask) {
    const binary = ipToInt(mask).toString(2);
    return binary.split('1').length - 1;
  }

  window.calculate = function() {
    const ipInput = document.getElementById('ipAddress').value;
    const cidrInput = document.getElementById('cidr').value;
    const maskInput = document.getElementById('subnetMask').value;

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(ipInput)) {
      alert('Invalid IP address format');
      return;
    }

    let cidr;
    if (cidrInput) {
      cidr = parseInt(cidrInput, 10);
      if (cidr < 0 || cidr > 32) {
        alert('CIDR must be between 0 and 32');
        return;
      }
      document.getElementById('subnetMask').value = cidrToMask(cidr);
    } else if (maskInput && ipPattern.test(maskInput)) {
      cidr = maskToCidr(maskInput);
      document.getElementById('cidr').value = cidr;
    } else {
      alert('Please provide either CIDR or a valid subnet mask');
      return;
    }

    const ipInt = ipToInt(ipInput);
    const maskInt = ipToInt(cidrToMask(cidr));
    const wildcardInt = ~maskInt >>> 0;

    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | wildcardInt) >>> 0;
    const firstUsableInt = networkInt + 1;
    const lastUsableInt = broadcastInt - 1;

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = totalHosts > 2 ? totalHosts - 2 : totalHosts;

    document.getElementById('networkAddress').textContent = intToIp(networkInt);
    document.getElementById('broadcastAddress').textContent = intToIp(broadcastInt);
    document.getElementById('firstIP').textContent = intToIp(firstUsableInt);
    document.getElementById('lastIP').textContent = intToIp(lastUsableInt);
    document.getElementById('totalHosts').textContent = totalHosts.toLocaleString();
    document.getElementById('usableHosts').textContent = usableHosts.toLocaleString();
    document.getElementById('cidrNotation').textContent = `/${cidr}`;
    document.getElementById('subnetMaskResult').textContent = cidrToMask(cidr);
    document.getElementById('wildcardMask').textContent = intToIp(wildcardInt);

    document.getElementById('results').style.display = 'block';
  };

  window.reset = function() {
    document.getElementById('ipAddress').value = '192.168.1.0';
    document.getElementById('cidr').value = '24';
    document.getElementById('subnetMask').value = '255.255.255.0';
    document.getElementById('results').style.display = 'none';
  };

  window.calculateCIDRRange = function() {
    const cidrBlock = document.getElementById('cidrBlock').value.trim();
    const targetCidr = parseInt(document.getElementById('targetCidr').value, 10);
    const maxSubnets = parseInt(document.getElementById('maxSubnets').value, 10) || 100;

    const parts = cidrBlock.split('/');
    if (parts.length !== 2) {
      alert('Invalid CIDR format. Use format: 192.168.0.0/16');
      return;
    }

    const baseIP = parts[0];
    const baseCidr = parseInt(parts[1], 10);

    if (baseCidr < 0 || baseCidr > 32 || targetCidr < 0 || targetCidr > 32) {
      alert('CIDR values must be between 0 and 32');
      return;
    }

    if (targetCidr <= baseCidr) {
      alert('Target CIDR must be larger (more specific) than base CIDR');
      return;
    }

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(baseIP)) {
      alert('Invalid IP address format');
      return;
    }

    const baseIpInt = ipToInt(baseIP);
    const baseMaskInt = ipToInt(cidrToMask(baseCidr));
    const networkInt = (baseIpInt & baseMaskInt) >>> 0;

    const subnetBits = targetCidr - baseCidr;
    const totalSubnets = Math.pow(2, subnetBits);
    const hostsPerSubnet = Math.pow(2, 32 - targetCidr);
    const subnetSize = Math.pow(2, 32 - targetCidr);

    let subnetHtml = '';
    const displayCount = Math.min(totalSubnets, maxSubnets);

    for (let i = 0; i < displayCount; i += 1) {
      const subnetIpInt = (networkInt + (i * subnetSize)) >>> 0;
      const subnetIp = intToIp(subnetIpInt);
      const broadcastInt = (subnetIpInt + subnetSize - 1) >>> 0;
      const broadcastIp = intToIp(broadcastInt);

      subnetHtml += `<div style="padding: 8px 0; border-bottom: 1px solid var(--color-border);">
        <strong>${subnetIp}/${targetCidr}</strong><br>
        <span style="color: var(--color-text-muted); font-size: 0.85em;">
          Range: ${subnetIp} - ${broadcastIp}
        </span>
      </div>`;
    }

    if (totalSubnets > maxSubnets) {
      subnetHtml += `<div style="padding: 12px; text-align: center; color: var(--color-text-muted); font-style: italic;">
        Showing ${displayCount} of ${totalSubnets.toLocaleString()} total subnets
      </div>`;
    }

    document.getElementById('totalSubnets').textContent = totalSubnets.toLocaleString();
    document.getElementById('hostsPerSubnet').textContent = hostsPerSubnet.toLocaleString();
    document.getElementById('subnetList').innerHTML = subnetHtml;
    document.getElementById('cidrResults').style.display = 'block';
  };

  window.resetCIDR = function() {
    document.getElementById('cidrBlock').value = '192.168.0.0/16';
    document.getElementById('targetCidr').value = '24';
    document.getElementById('maxSubnets').value = '100';
    document.getElementById('cidrResults').style.display = 'none';
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cidr').addEventListener('input', (e) => {
      const cidr = parseInt(e.target.value, 10);
      if (cidr >= 0 && cidr <= 32) {
        document.getElementById('subnetMask').value = cidrToMask(cidr);
      }
    });

    document.getElementById('subnetMask').addEventListener('input', (e) => {
      const mask = e.target.value;
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipPattern.test(mask)) {
        document.getElementById('cidr').value = maskToCidr(mask);
      }
    });
  });
})();
