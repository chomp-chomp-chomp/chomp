(function() {
  'use strict';

  function show(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
  }

  function hide(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  function formatTemp(value, unit) {
    return `${value.toFixed(1)}°${unit}`;
  }

  function cToF(c) {
    return (c * 9) / 5 + 32;
  }

  function fToC(f) {
    return ((f - 32) * 5) / 9;
  }

  function dewPoint(tempC, humidity) {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
    return (b * alpha) / (a - alpha);
  }

  function weatherCodeDescription(code) {
    const map = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Rain showers',
      81: 'Heavy rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Severe thunderstorm'
    };
    return map[code] || 'Unknown';
  }

  function getMoonPhase(date) {
    const synodicMonth = 29.530588853;
    const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14));
    const daysSince = (date - knownNewMoon) / 86400000;
    const age = ((daysSince % synodicMonth) + synodicMonth) % synodicMonth;
    const illumination = (1 - Math.cos((2 * Math.PI * age) / synodicMonth)) / 2;
    let phase = 'New Moon';
    let emoji = '🌑';

    if (age < 1.84566) {
      phase = 'New Moon';
      emoji = '🌑';
    } else if (age < 5.53699) {
      phase = 'Waxing Crescent';
      emoji = '🌒';
    } else if (age < 9.22831) {
      phase = 'First Quarter';
      emoji = '🌓';
    } else if (age < 12.91963) {
      phase = 'Waxing Gibbous';
      emoji = '🌔';
    } else if (age < 16.61096) {
      phase = 'Full Moon';
      emoji = '🌕';
    } else if (age < 20.30228) {
      phase = 'Waning Gibbous';
      emoji = '🌖';
    } else if (age < 23.99361) {
      phase = 'Last Quarter';
      emoji = '🌗';
    } else {
      phase = 'Waning Crescent';
      emoji = '🌘';
    }

    return {
      phase,
      age: age.toFixed(1),
      illumination: `${Math.round(illumination * 100)}%`,
      emoji
    };
  }

  async function fetchLocationFromIP() {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('Failed to load location');
    return response.json();
  }

  async function fetchWeather(lat, lon) {
    const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,visibility,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Failed to fetch weather');
    return response.json();
  }

  window.getCurrentWeather = async function() {
    const lat = parseFloat(document.getElementById('currentLat').value);
    const lon = parseFloat(document.getElementById('currentLon').value);
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      alert('Please provide latitude and longitude.');
      return;
    }

    try {
      const data = await fetchWeather(lat, lon);
      const current = data.current || {};
      const daily = data.daily || {};
      const tempC = current.temperature_2m;
      const humidity = current.relative_humidity_2m;
      const dewC = dewPoint(tempC, humidity);
      const tempF = cToF(tempC);
      const dewF = cToF(dewC);
      const high = daily.temperature_2m_max ? daily.temperature_2m_max[0] : null;
      const low = daily.temperature_2m_min ? daily.temperature_2m_min[0] : null;

      document.getElementById('currentTime').textContent = current.time || '--';
      document.getElementById('currentTemp').textContent = `${formatTemp(tempF, 'F')} / ${formatTemp(tempC, 'C')}`;
      document.getElementById('currentHighLow').textContent = high !== null && low !== null ? `${formatTemp(cToF(high), 'F')} / ${formatTemp(cToF(low), 'F')}` : '--';
      document.getElementById('currentFeelsLike').textContent = `${formatTemp(cToF(current.apparent_temperature), 'F')} / ${formatTemp(current.apparent_temperature, 'C')}`;
      document.getElementById('currentHumidity').textContent = `${humidity}%`;
      document.getElementById('currentDewPoint').textContent = `${formatTemp(dewF, 'F')} / ${formatTemp(dewC, 'C')}`;
      document.getElementById('currentWind').textContent = `${current.wind_speed_10m} m/s`;
      document.getElementById('currentPressure').textContent = `${current.pressure_msl} hPa`;
      document.getElementById('currentPrecip').textContent = `${current.precipitation} mm`;
      document.getElementById('currentClouds').textContent = `${current.cloud_cover}%`;
      document.getElementById('currentVisibility').textContent = `${current.visibility} m`;
      document.getElementById('currentUV').textContent = daily.uv_index_max ? daily.uv_index_max[0] : '--';
      document.getElementById('currentWeather').textContent = weatherCodeDescription(current.weather_code);

      document.getElementById('currentSunrise').textContent = daily.sunrise ? daily.sunrise[0] : '--';
      document.getElementById('currentSunset').textContent = daily.sunset ? daily.sunset[0] : '--';

      const moon = getMoonPhase(new Date());
      document.getElementById('currentMoonPhase').textContent = `${moon.phase} (${moon.illumination})`;

      show('currentWeatherResults');
    } catch (error) {
      alert('Unable to fetch current weather.');
      console.error(error);
    }
  };

  window.getLocationForCurrent = async function() {
    try {
      const data = await fetchLocationFromIP();
      document.getElementById('currentLat').value = data.latitude;
      document.getElementById('currentLon').value = data.longitude;
      document.getElementById('currentLocationInfo').value = `${data.city}, ${data.region}, ${data.country_name}`;
      show('currentLocationDisplay');
      await window.getCurrentWeather();
    } catch (error) {
      alert('Unable to get your location.');
    }
  };

  window.resetCurrentWeather = function() {
    document.getElementById('currentLat').value = '';
    document.getElementById('currentLon').value = '';
    document.getElementById('currentLocationInfo').value = '';
    hide('currentLocationDisplay');
    hide('currentWeatherResults');
  };

  window.convertFromF = function() {
    const f = parseFloat(document.getElementById('fahrenheit').value);
    if (Number.isNaN(f)) return;
    document.getElementById('celsius').value = fToC(f).toFixed(2);
  };

  window.convertFromC = function() {
    const c = parseFloat(document.getElementById('celsius').value);
    if (Number.isNaN(c)) return;
    document.getElementById('fahrenheit').value = cToF(c).toFixed(2);
  };

  window.calculateComfort = function() {
    const temp = parseFloat(document.getElementById('temp').value);
    const unit = document.getElementById('unit').value;
    const humidityInput = parseFloat(document.getElementById('humidity').value);
    const dewInput = parseFloat(document.getElementById('dewpoint').value);
    const wind = parseFloat(document.getElementById('wind').value) || 0;
    const sun = parseFloat(document.getElementById('sun').value) || 0;

    if (Number.isNaN(temp)) return;

    let tempC = unit === 'F' ? fToC(temp) : temp;
    let rh = humidityInput;
    if (Number.isNaN(rh) && !Number.isNaN(dewInput)) {
      const dewC = unit === 'F' ? fToC(dewInput) : dewInput;
      const a = 17.27;
      const b = 237.7;
      const alpha = (a * dewC) / (b + dewC);
      const beta = (a * tempC) / (b + tempC);
      rh = clamp(Math.round(100 * Math.exp(alpha - beta)), 0, 100);
    }

    if (Number.isNaN(rh)) rh = 50;

    const tempF = cToF(tempC);
    const hi = -42.379 + 2.04901523 * tempF + 10.14333127 * rh - 0.22475541 * tempF * rh - 0.00683783 * tempF * tempF - 0.05481717 * rh * rh + 0.00122874 * tempF * tempF * rh + 0.00085282 * tempF * rh * rh - 0.00000199 * tempF * tempF * rh * rh;
    const simple = tempF + 0.33 * rh - 0.7 * wind - 4;
    const enhanced = simple + (sun / 100) * 7 - wind * 0.15;

    document.getElementById('calcRH').textContent = `${rh}%`;
    document.getElementById('fullHI').textContent = `${hi.toFixed(1)}°F`;
    document.getElementById('simpleHI').textContent = `${simple.toFixed(1)}°F`;
    document.getElementById('enhancedHI').textContent = `${enhanced.toFixed(1)}°F`;
    document.getElementById('dewComfort').textContent = rh > 65 ? 'Sticky' : rh > 50 ? 'Humid' : 'Comfortable';
    show('results');
  };

  window.resetCalculator = function() {
    ['temp', 'humidity', 'dewpoint'].forEach((id) => {
      document.getElementById(id).value = '';
    });
    document.getElementById('wind').value = 0;
    document.getElementById('sun').value = 0;
    hide('results');
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  window.calculateWindChill = function() {
    const temp = parseFloat(document.getElementById('windChillTemp').value);
    const unit = document.getElementById('windChillUnit').value;
    const windSpeed = parseFloat(document.getElementById('windSpeed').value);

    if (Number.isNaN(temp) || Number.isNaN(windSpeed)) return;

    const tempF = unit === 'F' ? temp : cToF(temp);
    const wc = 35.74 + 0.6215 * tempF - 35.75 * Math.pow(windSpeed, 0.16) + 0.4275 * tempF * Math.pow(windSpeed, 0.16);

    document.getElementById('windChillValue').textContent = `${wc.toFixed(1)}°F`;
    document.getElementById('windChillComfort').textContent = wc < 0 ? 'Extreme cold' : wc < 32 ? 'Cold' : 'Cool';
    show('windChillResults');
  };

  window.resetWindChill = function() {
    document.getElementById('windChillTemp').value = '';
    document.getElementById('windSpeed').value = '';
    hide('windChillResults');
  };

  window.getLocationForUV = async function() {
    try {
      const data = await fetchLocationFromIP();
      document.getElementById('uvLat').value = data.latitude;
      document.getElementById('uvLocationInfo').value = `${data.city}, ${data.region}, ${data.country_name}`;
      show('uvLocationDisplay');
    } catch (error) {
      alert('Unable to get your location.');
    }
  };

  window.calculateUV = function() {
    const lat = parseFloat(document.getElementById('uvLat').value);
    const dateStr = document.getElementById('uvDate').value;
    const timeStr = document.getElementById('uvTime').value;
    const cloud = clamp(parseFloat(document.getElementById('uvCloud').value) || 0, 0, 100);

    if (Number.isNaN(lat) || !dateStr || !timeStr) return;

    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
    const dayOfYear = getDayOfYear(date);
    const declination = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);
    const hourAngle = (15 * (hour + minute / 60 - 12)) * (Math.PI / 180);
    const latRad = lat * (Math.PI / 180);
    const declRad = declination * (Math.PI / 180);

    const elevation = Math.asin(
      Math.sin(latRad) * Math.sin(declRad) +
      Math.cos(latRad) * Math.cos(declRad) * Math.cos(hourAngle)
    );

    const uvClear = Math.max(0, 12 * Math.sin(elevation));
    const uvAdjusted = uvClear * (1 - cloud * 0.75 / 100);

    let risk = 'Low';
    let protection = 'Sunglasses + SPF if sensitive.';
    if (uvAdjusted >= 3 && uvAdjusted < 6) {
      risk = 'Moderate';
      protection = 'SPF 30, hat, shade.';
    } else if (uvAdjusted >= 6 && uvAdjusted < 8) {
      risk = 'High';
      protection = 'SPF 30+, limit sun 10-4.';
    } else if (uvAdjusted >= 8 && uvAdjusted < 11) {
      risk = 'Very High';
      protection = 'SPF 50+, cover up, avoid midday.';
    } else if (uvAdjusted >= 11) {
      risk = 'Extreme';
      protection = 'Avoid sun, full protection required.';
    }

    document.getElementById('uvIndex').textContent = uvAdjusted.toFixed(1);
    document.getElementById('uvRisk').textContent = risk;
    document.getElementById('uvProtection').textContent = protection;
    show('uvResults');
  };

  window.resetUV = function() {
    document.getElementById('uvLat').value = '';
    document.getElementById('uvDate').value = '';
    document.getElementById('uvTime').value = '';
    document.getElementById('uvCloud').value = 0;
    document.getElementById('uvLocationInfo').value = '';
    hide('uvLocationDisplay');
    hide('uvResults');
  };

  window.getLocationForSun = async function() {
    try {
      const data = await fetchLocationFromIP();
      document.getElementById('sunLat').value = data.latitude;
      document.getElementById('sunLon').value = data.longitude;
      document.getElementById('sunLocationInfo').value = `${data.city}, ${data.region}, ${data.country_name}`;
      show('sunLocationDisplay');
    } catch (error) {
      alert('Unable to get your location.');
    }
  };

  window.calculateSunTimes = async function() {
    const lat = parseFloat(document.getElementById('sunLat').value);
    const lon = parseFloat(document.getElementById('sunLon').value);
    const date = document.getElementById('sunDate').value;

    if (Number.isNaN(lat) || Number.isNaN(lon) || !date) return;

    try {
      const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=${date}&formatted=0`);
      if (!response.ok) throw new Error('Failed to fetch sun data');
      const data = await response.json();
      const results = data.results || {};

      const sunrise = results.sunrise ? new Date(results.sunrise).toLocaleTimeString() : '--';
      const sunset = results.sunset ? new Date(results.sunset).toLocaleTimeString() : '--';
      const solarNoon = results.solar_noon ? new Date(results.solar_noon).toLocaleTimeString() : '--';
      const dayLength = results.day_length ? `${Math.round(results.day_length / 3600)}h ${Math.round((results.day_length % 3600) / 60)}m` : '--';

      document.getElementById('sunrise').textContent = sunrise;
      document.getElementById('sunset').textContent = sunset;
      document.getElementById('solarNoon').textContent = solarNoon;
      document.getElementById('daylight').textContent = dayLength;
      document.getElementById('moonrise').textContent = 'n/a';
      document.getElementById('moonset').textContent = 'n/a';
      show('sunResults');
    } catch (error) {
      alert('Unable to calculate sun times.');
    }
  };

  window.resetSunTimes = function() {
    document.getElementById('sunLat').value = '';
    document.getElementById('sunLon').value = '';
    document.getElementById('sunDate').value = '';
    document.getElementById('sunLocationInfo').value = '';
    hide('sunLocationDisplay');
    hide('sunResults');
  };

  window.calculateMoonPhase = function() {
    const dateStr = document.getElementById('moonDate').value;
    if (!dateStr) return;
    const date = new Date(`${dateStr}T00:00:00`);
    const moon = getMoonPhase(date);

    document.getElementById('moonPhase').textContent = moon.phase;
    document.getElementById('moonIllumination').textContent = moon.illumination;
    document.getElementById('moonAge').textContent = `${moon.age} days`;
    document.getElementById('moonEmoji').textContent = moon.emoji;
    show('moonResults');
  };

  window.resetMoonPhase = function() {
    document.getElementById('moonDate').value = '';
    hide('moonResults');
  };
})();
