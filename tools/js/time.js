(function() {
  'use strict';

  function getTimeZoneOffsetMinutes(date, timeZone) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});

    const utcTime = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second)
    );

    return (utcTime - date.getTime()) / 60000;
  }

  function formatInTimeZone(date, timeZone, options) {
    return new Intl.DateTimeFormat('en-US', { timeZone, ...options }).format(date);
  }

  function getDayOfYear(date) {
    const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
    const diff = date - start;
    return Math.floor(diff / 86400000);
  }

  function getIsoWeek(date) {
    const temp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const dayNum = temp.getUTCDay() || 7;
    temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
    return Math.ceil((((temp - yearStart) / 86400000) + 1) / 7);
  }

  function zonedTimeToUtc(dateStr, timeStr, timeZone) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour = 0, minute = 0, second = 0] = timeStr.split(':').map(Number);
    const assumedUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    const offset = getTimeZoneOffsetMinutes(assumedUtc, timeZone);
    return new Date(assumedUtc.getTime() - offset * 60000);
  }

  function updateNow() {
    const tz = document.getElementById('nowTimeZone').value;
    const now = new Date();

    const dateText = formatInTimeZone(now, tz, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
    const timeText = formatInTimeZone(now, tz, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const offsetMinutes = -getTimeZoneOffsetMinutes(now, tz);
    const offsetSign = offsetMinutes >= 0 ? '+' : '-';
    const absOffset = Math.abs(offsetMinutes);
    const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
    const offsetMins = String(absOffset % 60).padStart(2, '0');

    document.getElementById('nowDate').textContent = dateText;
    document.getElementById('nowTime').textContent = timeText;
    document.getElementById('nowOffset').textContent = `UTC${offsetSign}${offsetHours}:${offsetMins}`;
    document.getElementById('nowDst').textContent = offsetMinutes !== -now.getTimezoneOffset() ? 'Yes' : 'No';
    document.getElementById('nowUtcTime').textContent = now.toISOString();
    document.getElementById('nowUnixS').textContent = Math.floor(now.getTime() / 1000);
    document.getElementById('nowUnixMs').textContent = now.getTime();
    document.getElementById('nowIsoDate').textContent = formatInTimeZone(now, tz, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');

    const utcForWeek = new Date(now.toISOString());
    document.getElementById('nowWeekNumber').textContent = getIsoWeek(utcForWeek);
    document.getElementById('nowDayOfYear').textContent = getDayOfYear(utcForWeek);
  }

  window.refreshNow = updateNow;

  window.useMyTimeZone = function() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    ['nowTimeZone', 'convFromTz', 'convToTz', 'timeDiffTz', 'unixTz'].forEach((id) => {
      const select = document.getElementById(id);
      if (select) select.value = tz;
    });
    updateNow();
  };

  window.convertTimeZone = function() {
    const fromTz = document.getElementById('convFromTz').value;
    const toTz = document.getElementById('convToTz').value;
    const dateInput = document.getElementById('convDate');
    const timeInput = document.getElementById('convTime');

    const now = new Date();
    const dateStr = dateInput.value || formatInTimeZone(now, fromTz, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
    const timeStr = timeInput.value || formatInTimeZone(now, fromTz, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const utcDate = zonedTimeToUtc(dateStr, timeStr, fromTz);
    const converted = formatInTimeZone(utcDate, toTz, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const fromDateDisplay = formatInTimeZone(utcDate, fromTz, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const toDateDisplay = formatInTimeZone(utcDate, toTz, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const dayShift = fromDateDisplay === toDateDisplay
      ? 'Same day'
      : `Shifted to ${toDateDisplay}`;

    document.getElementById('convConverted').textContent = converted;
    document.getElementById('convDayShift').textContent = dayShift;
    document.getElementById('convUtcInstant').textContent = utcDate.toISOString();
    document.getElementById('convResults').style.display = 'block';
  };

  window.resetTzConverter = function() {
    document.getElementById('convDate').value = '';
    document.getElementById('convTime').value = '';
    document.getElementById('convResults').style.display = 'none';
  };

  window.calculateDateDiff = function() {
    const startStr = document.getElementById('diffStartDate').value;
    const endStr = document.getElementById('diffEndDate').value;
    if (!startStr || !endStr) return;

    let start = new Date(`${startStr}T00:00:00`);
    let end = new Date(`${endStr}T00:00:00`);
    let negative = false;

    if (start > end) {
      [start, end] = [end, start];
      negative = true;
    }

    let totalDays = Math.round((end - start) / 86400000);
    if (document.getElementById('diffIncludeEnd').checked) totalDays += 1;

    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;
    const approxMonths = (totalDays / 30.44).toFixed(1);

    let temp = new Date(start);
    let years = end.getFullYear() - temp.getFullYear();
    temp.setFullYear(temp.getFullYear() + years);
    if (temp > end) {
      years -= 1;
      temp.setFullYear(temp.getFullYear() - 1);
    }
    let months = end.getMonth() - temp.getMonth();
    if (months < 0) {
      months += 12;
      years -= 1;
    }
    temp.setMonth(temp.getMonth() + months);
    if (temp > end) {
      months -= 1;
      temp.setMonth(temp.getMonth() - 1);
    }
    const daysLeft = Math.floor((end - temp) / 86400000);

    const sign = negative ? '-' : '';
    document.getElementById('diffTotalDays').textContent = `${sign}${totalDays}`;
    document.getElementById('diffWeeksDays').textContent = `${sign}${weeks}w ${days}d`;
    document.getElementById('diffMonthsDays').textContent = `${sign}${approxMonths} months`;
    document.getElementById('diffYmd').textContent = `${sign}${years}y ${months}m ${daysLeft}d`;
    document.getElementById('diffResults').style.display = 'block';
  };

  window.resetDateDiff = function() {
    document.getElementById('diffStartDate').value = '';
    document.getElementById('diffEndDate').value = '';
    document.getElementById('diffIncludeEnd').checked = false;
    document.getElementById('diffResults').style.display = 'none';
  };

  window.calculateTimeDiff = function() {
    const tz = document.getElementById('timeDiffTz').value;
    const startDate = document.getElementById('timeStartDate').value;
    const startTime = document.getElementById('timeStartTime').value || '00:00:00';
    const endDate = document.getElementById('timeEndDate').value;
    const endTime = document.getElementById('timeEndTime').value || '00:00:00';

    if (!startDate || !endDate) return;

    const startUtc = zonedTimeToUtc(startDate, startTime, tz);
    const endUtc = zonedTimeToUtc(endDate, endTime, tz);
    let diffSeconds = Math.floor((endUtc - startUtc) / 1000);
    const sign = diffSeconds < 0 ? '-' : '';
    diffSeconds = Math.abs(diffSeconds);

    const totalMinutes = diffSeconds / 60;
    const totalHours = diffSeconds / 3600;
    const days = Math.floor(diffSeconds / 86400);
    const hours = Math.floor((diffSeconds % 86400) / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;

    document.getElementById('tdSeconds').textContent = `${sign}${diffSeconds}`;
    document.getElementById('tdMinutes').textContent = `${sign}${totalMinutes.toFixed(2)}`;
    document.getElementById('tdHours').textContent = `${sign}${totalHours.toFixed(2)}`;
    document.getElementById('tdDhms').textContent = `${sign}${days}d ${hours}h ${minutes}m ${seconds}s`;
    document.getElementById('timeDiffResults').style.display = 'block';
  };

  window.resetTimeDiff = function() {
    document.getElementById('timeStartDate').value = '';
    document.getElementById('timeStartTime').value = '';
    document.getElementById('timeEndDate').value = '';
    document.getElementById('timeEndTime').value = '';
    document.getElementById('timeDiffResults').style.display = 'none';
  };

  function updateUnixResults(date, timeZone) {
    const local = formatInTimeZone(date, timeZone, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    document.getElementById('uiLocal').textContent = local;
    document.getElementById('uiUtc').textContent = date.toISOString();
    document.getElementById('uiIso').textContent = date.toISOString();
    document.getElementById('uiUnixS').textContent = Math.floor(date.getTime() / 1000);
    document.getElementById('uiUnixMs').textContent = date.getTime();
    document.getElementById('unixIsoResults').style.display = 'block';
  }

  window.convertUnixIso = function() {
    const unixInput = document.getElementById('unixInput').value.trim();
    const isoInput = document.getElementById('isoInput').value.trim();
    const tz = document.getElementById('unixTz').value;
    let date;

    if (unixInput) {
      const numeric = Number(unixInput);
      if (Number.isNaN(numeric)) return;
      date = unixInput.length > 10 ? new Date(numeric) : new Date(numeric * 1000);
      document.getElementById('isoInput').value = date.toISOString();
    } else if (isoInput) {
      date = new Date(isoInput);
      if (Number.isNaN(date.getTime())) return;
      document.getElementById('unixInput').value = Math.floor(date.getTime() / 1000);
    } else {
      return;
    }

    updateUnixResults(date, tz);
  };

  window.resetUnixIso = function() {
    document.getElementById('unixInput').value = '';
    document.getElementById('isoInput').value = '';
    document.getElementById('unixIsoResults').style.display = 'none';
  };

  window.unixUseNow = function() {
    document.getElementById('unixInput').value = Math.floor(Date.now() / 1000);
    window.convertUnixIso();
  };

  document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    document.getElementById('convDate').value = today.toISOString().slice(0, 10);
    updateNow();
  });
})();
