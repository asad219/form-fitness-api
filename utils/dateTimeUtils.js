const isValidDate = (date) => date instanceof Date && !isNaN(date.getTime());

/**
 * Format a Date as a date-only string (YYYY-MM-DD).
 *
 * @param {Date|null|undefined} date
 * @returns {string|null} null when the input is not a valid Date
 */
const formatDateOnly = (date) => {
  if (!isValidDate(date)) return null;
  return date.toISOString().split('T')[0];
};

/**
 * Format a Date as a 24-hour time-only string (HH:mm:ss, UTC).
 *
 * @param {Date|null|undefined} date
 * @returns {string|null} null when the input is not a valid Date
 */
const formatTimeOnly = (date) => {
  if (!isValidDate(date)) return null;
  return date.toISOString().split('T')[1].slice(0, 8);
};

/**
 * Parse a date-only string (YYYY-MM-DD) into a Date at midnight UTC.
 *
 * @param {string|null|undefined} dateString
 * @returns {Date|null} null when the input is missing or invalid
 */
const convertDateOnlyToDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null;
  const date = new Date(`${dateString}T00:00:00.000Z`);
  return isValidDate(date) ? date : null;
};

/**
 * Parse a time-only string (HH:mm:ss) into a Date on the base date 1900-01-01 (UTC).
 *
 * @param {string|null|undefined} timeString
 * @returns {Date|null} null when the input is missing or invalid
 */
const convertTimeOnlyToDate = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return null;

  const match = timeString.match(/^(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) return null;

  const [hours, minutes, seconds] = match.slice(1).map((part) => parseInt(part, 10));
  if (hours > 23 || minutes > 59 || seconds > 59) return null;

  const date = new Date('1900-01-01T00:00:00.000Z');
  date.setUTCHours(hours, minutes, seconds, 0);
  return date;
};

/**
 * Return a shallow copy of `data` with the given date/time string fields converted to Dates.
 *
 * @param {Record<string, unknown>} data
 * @param {{ dateKeys?: string[], timeKeys?: string[] }} options
 * @returns {Record<string, unknown>}
 */
const transformDateFields = (data, { dateKeys = [], timeKeys = [] } = {}) => {
  const transformed = { ...data };

  dateKeys.forEach((key) => {
    if (typeof transformed[key] === 'string') {
      transformed[key] = convertDateOnlyToDate(transformed[key]);
    }
  });

  timeKeys.forEach((key) => {
    if (typeof transformed[key] === 'string') {
      transformed[key] = convertTimeOnlyToDate(transformed[key]);
    }
  });

  return transformed;
};

/**
 * Parse a clock time such as '07:00 AM', '7:00 pm', '18:30' or '18:30:00'.
 *
 * @param {string|null|undefined} timeString
 * @returns {{ hours: number, minutes: number }|null} null when the input is invalid
 */
const parseClockTime = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return null;

  const match = timeString.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3] && match[3].toUpperCase();

  if (minutes > 59) return null;
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    hours = (hours % 12) + (meridiem === 'PM' ? 12 : 0);
  } else if (hours > 23) {
    return null;
  }

  return { hours, minutes };
};

// Milliseconds the given timezone is ahead of UTC at the given instant
const getTimeZoneOffsetMs = (timestamp, timeZone) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(timestamp));
  const value = (type) => parseInt(parts.find((part) => part.type === type).value, 10);

  const asUtc = Date.UTC(
    value('year'),
    value('month') - 1,
    value('day'),
    value('hour'),
    value('minute'),
    value('second')
  );
  return asUtc - Math.floor(timestamp / 1000) * 1000;
};

/**
 * Combine a date-only value (midnight UTC) and a wall-clock time in `timeZone` into a UTC Date.
 *
 * @param {Date} dateOnly date-only value stored at midnight UTC
 * @param {string} timeString clock time accepted by parseClockTime
 * @param {string} timeZone IANA timezone, e.g. 'America/New_York'
 * @returns {Date|null} null when the date or time is invalid
 */
const zonedDateTimeToUtc = (dateOnly, timeString, timeZone) => {
  const time = parseClockTime(timeString);
  if (!isValidDate(dateOnly) || !time) return null;

  const wallClockAsUtc = Date.UTC(
    dateOnly.getUTCFullYear(),
    dateOnly.getUTCMonth(),
    dateOnly.getUTCDate(),
    time.hours,
    time.minutes
  );

  // Second pass corrects the offset when the first guess lands on the other side of a DST change
  const firstOffset = getTimeZoneOffsetMs(wallClockAsUtc, timeZone);
  const secondOffset = getTimeZoneOffsetMs(wallClockAsUtc - firstOffset, timeZone);
  return new Date(wallClockAsUtc - secondOffset);
};

/**
 * Add calendar months in UTC, clamping to the last day of the target month (Jan 31 + 1 -> Feb 28/29).
 *
 * @param {Date} date
 * @param {number} months
 * @returns {Date}
 */
const addMonthsUtc = (date, months) => {
  const result = new Date(date.getTime());
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDay = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)
  ).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result;
};

module.exports = {
  formatDateOnly,
  formatTimeOnly,
  convertDateOnlyToDate,
  convertTimeOnlyToDate,
  transformDateFields,
  parseClockTime,
  zonedDateTimeToUtc,
  addMonthsUtc,
};
