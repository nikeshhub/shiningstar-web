import NepaliDateModule from "nepali-date-converter";

// Defensive interop: most bundlers unwrap the default, but if we land on the
// module namespace, reach into `.default`.
const NepaliDate = NepaliDateModule?.fromAD
  ? NepaliDateModule
  : NepaliDateModule?.default || NepaliDateModule;

const BS_MONTHS_EN = [
  "Baisakh",
  "Jestha",
  "Asar",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

const DATE_ONLY_RE = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/;
const DATE_TIME_RE = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)$/;
const pad2 = (value) => String(value).padStart(2, "0");
const padDateParts = (year, month, day) => `${year}-${pad2(month)}-${pad2(day)}`;
const cloneDate = (value) => new Date(value.getTime());
const isLikelyBSYear = (year) => year >= 2000 && year <= 2099;
const buildADISODate = (date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const parseBSDateString = (value) => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const dateOnlyMatch = trimmed.match(DATE_ONLY_RE);
  if (dateOnlyMatch) {
    const [, yearStr, monthStr, dayStr] = dateOnlyMatch;
    const year = Number(yearStr);
    if (!isLikelyBSYear(year)) {
      return null;
    }

    try {
      return new NepaliDate(`${year}-${pad2(monthStr)}-${pad2(dayStr)}`);
    } catch (error) {
      return null;
    }
  }

  const dateTimeMatch = trimmed.match(DATE_TIME_RE);
  if (dateTimeMatch) {
    const [, yearStr, monthStr, dayStr] = dateTimeMatch;
    const year = Number(yearStr);
    if (!isLikelyBSYear(year)) {
      return null;
    }

    try {
      return new NepaliDate(`${year}-${pad2(monthStr)}-${pad2(dayStr)}`);
    } catch (error) {
      return null;
    }
  }

  return null;
};

/**
 * Bikram Sambat (BS / Nepali) date formatting helpers — client side.
 *
 * All helpers accept a JS Date, a date string, a timestamp (ms), or nullish
 * and return a safe string ("-") when the input cannot be converted.
 *
 * Every user-facing date in the client should go through one of these
 * helpers so we stay on a single calendar.
 */

const toJsDate = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : cloneDate(value);
  }

  if (typeof value === "string") {
    const bsDate = parseBSDateString(value);
    if (bsDate) {
      const date = bsDate.toJsDate();
      return Number.isNaN(date.getTime()) ? null : date;
    }
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toNepali = (value) => {
  const jsDate = toJsDate(value);
  if (!jsDate) return null;
  try {
    return NepaliDate.fromAD(jsDate);
  } catch (err) {
    return null;
  }
};

/**
 * Long-form BS date. Example: "24 Baisakh 2081"
 */
export const formatBSDate = (value, { language = "en" } = {}) => {
  const np = toNepali(value);
  if (!np) return "-";
  return np.format("DD MMMM YYYY", language);
};

/**
 * Numeric short BS date. Example: "2081/01/24"
 */
export const formatBSDateShort = (value, { language = "en" } = {}) => {
  const np = toNepali(value);
  if (!np) return "-";
  return np.format("YYYY/MM/DD", language);
};

/**
 * Day-of-week long form. Example: "Monday, 24 Baisakh 2081"
 */
export const formatBSDateWithDay = (value, { language = "en" } = {}) => {
  const np = toNepali(value);
  if (!np) return "-";
  return np.format("ddd, DD MMMM YYYY", language);
};

/**
 * Convert an AD Date/string into a normalized BS date string (`YYYY-MM-DD`).
 */
export const adToBSDate = (value) => {
  const jsDate = toJsDate(value);
  if (!jsDate) return "";

  try {
    return NepaliDate.fromAD(jsDate).format("YYYY-MM-DD");
  } catch (error) {
    return "";
  }
};

/**
 * Normalize a BS date string (`YYYY-MM-DD` or `YYYY/MM/DD`) into `YYYY-MM-DD`.
 */
export const normalizeBSDate = (value) => {
  const bsDate = parseBSDateString(value);
  if (!bsDate) return "";
  return bsDate.format("YYYY-MM-DD");
};

/**
 * Parse a BS date or local BS date-time string to an AD JS Date.
 */
export const bsToADDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : cloneDate(value);
  }

  if (typeof value !== "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  const dateTimeMatch = trimmed.match(DATE_TIME_RE);
  if (dateTimeMatch && isLikelyBSYear(Number(dateTimeMatch[1]))) {
    try {
      const [, yearStr, monthStr, dayStr, hourStr = "0", minuteStr = "0", secondStr = "0"] = dateTimeMatch;
      const date = new NepaliDate(
        padDateParts(Number(yearStr), Number(monthStr), Number(dayStr))
      ).toJsDate();
      date.setHours(Number(hourStr), Number(minuteStr), Number(secondStr), 0);
      return date;
    } catch (error) {
      return null;
    }
  }

  const normalized = normalizeBSDate(trimmed);
  if (normalized) {
    try {
      return new NepaliDate(normalized).toJsDate();
    } catch (error) {
      return null;
    }
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Convert a BS date string to an AD `YYYY-MM-DD` string.
 */
export const bsToADISODate = (value) => {
  const date = bsToADDate(value);
  if (!date) return "";
  return buildADISODate(date);
};

/**
 * Convert a BS date-time string to an AD ISO timestamp.
 */
export const bsToADISOString = (value) => {
  const date = bsToADDate(value);
  return date ? date.toISOString() : "";
};

/**
 * Today's date in BS (`YYYY-MM-DD`).
 */
export const todayBSDate = () => adToBSDate(new Date());

export const currentBSYear = () => getCurrentBSDateParts()?.year ?? parseInt(adToBSDate(new Date()).substring(0, 4), 10);

/**
 * Returns BS year/month/date fields or null.
 */
export const getBSDateParts = (value) => {
  const normalized = normalizeBSDate(value);
  if (normalized) {
    try {
      return new NepaliDate(normalized).getBS();
    } catch (error) {
      return null;
    }
  }

  const np = toNepali(value);
  if (!np) return null;
  return np.getBS();
};

/**
 * Current BS year/month/date fields.
 */
export const getCurrentBSDateParts = () => getBSDateParts(new Date());

/**
 * BS month options for selects.
 */
export const getBSMonthOptions = () =>
  BS_MONTHS_EN.map((label, index) => ({
    label,
    value: index + 1,
  }));

/**
 * BS year options centered around the current BS year.
 */
export const getBSYearOptions = ({ past = 2, future = 2 } = {}) => {
  const currentYear = getCurrentBSDateParts()?.year || 2080;
  return Array.from({ length: past + future + 1 }, (_, index) => {
    const year = currentYear - past + index;
    return {
      label: String(year),
      value: year,
    };
  });
};

/**
 * Build a local BS date-time string from separate BS date and time inputs.
 */
export const combineBSDateTime = (dateValue, timeValue) => {
  const normalizedDate = normalizeBSDate(dateValue);
  if (!normalizedDate || !timeValue) return "";
  return `${normalizedDate}T${timeValue}`;
};

/**
 * Convert an AD timestamp into `{ date, time }` in BS/local time for forms.
 */
export const adToBSDateTimeParts = (value) => {
  const jsDate = toJsDate(value);
  if (!jsDate) {
    return { date: "", time: "" };
  }

  return {
    date: adToBSDate(jsDate),
    time: `${pad2(jsDate.getHours())}:${pad2(jsDate.getMinutes())}`,
  };
};

/**
 * BS date with AD reference in parentheses.
 * Example: "24 Baisakh 2081 (06 May 2024)"
 */
export const formatBSWithAD = (value) => {
  const jsDate = toJsDate(value);
  if (!jsDate) return "-";
  const bs = formatBSDate(jsDate);
  const ad = jsDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${bs} (${ad})`;
};

/**
 * Returns BS year/month/date fields or null.
 */
export const toBS = (value) => {
  return getBSDateParts(value);
};

/**
 * Convert a JS Date or BS date string to an AD `YYYY-MM-DD` string.
 */
export const toADISODate = (value) => {
  const normalizedBS = normalizeBSDate(value);
  if (normalizedBS) {
    return bsToADISODate(normalizedBS) || null;
  }

  const jsDate = toJsDate(value);
  return jsDate ? buildADISODate(jsDate) : null;
};

const api = {
  adToBSDate,
  adToBSDateTimeParts,
  bsToADDate,
  bsToADISODate,
  bsToADISOString,
  combineBSDateTime,
  formatBSDate,
  formatBSDateShort,
  formatBSDateWithDay,
  formatBSWithAD,
  getBSDateParts,
  getBSMonthOptions,
  getBSYearOptions,
  getCurrentBSDateParts,
  currentBSYear,
  normalizeBSDate,
  todayBSDate,
  toBS,
  toADISODate,
};

export default api;
