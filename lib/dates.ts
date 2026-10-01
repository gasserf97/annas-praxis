export const PRACTICE_TIME_ZONE = "Europe/Berlin";

const dateKeyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const timePattern = /^(\d{2}):(\d{2})$/;

export function isDateKey(value: string) {
  if (!dateKeyPattern.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const probe = new Date(Date.UTC(year, month - 1, day));
  return (
    probe.getUTCFullYear() === year &&
    probe.getUTCMonth() === month - 1 &&
    probe.getUTCDate() === day
  );
}

export function isTimeKey(value: string) {
  if (!timePattern.test(value)) return false;
  const [hour, minute] = value.split(":").map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

export function addDays(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return next.toISOString().slice(0, 10);
}

export function dateKeyInBerlin(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PRACTICE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function todayKey(now = new Date()) {
  return dateKeyInBerlin(now);
}

/** Monday as a calendar date in Europe/Berlin. */
export function startOfWeekKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const fromMonday = weekday === 0 ? 6 : weekday - 1;
  return addDays(dateKey, -fromMonday);
}

export function berlinClock(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: PRACTICE_TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  let hour = Number(get("hour"));
  if (hour === 24) hour = 0;
  return {
    dateKey: `${get("year")}-${get("month")}-${get("day")}`,
    hour,
    minute: Number(get("minute")),
  };
}

/**
 * Interprets a wall-clock time in Europe/Berlin and returns the UTC instant.
 * The offset is derived from Intl so summer and winter time both work.
 */
export function berlinToUtc(dateKey: string, time: string) {
  const asUtc = new Date(`${dateKey}T${time}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PRACTICE_TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(asUtc);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  let hour = get("hour");
  let day = get("day");
  if (hour === 24) {
    hour = 0;
    day += 1;
  }
  const displayed = Date.UTC(get("year"), get("month") - 1, day, hour, get("minute"));
  const offset = displayed - asUtc.getTime();
  return new Date(asUtc.getTime() - offset);
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: PRACTICE_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: PRACTICE_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDayMonth(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: PRACTICE_TIME_ZONE,
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatDateKeyLong(dateKey: string) {
  return formatLongDate(berlinToUtc(dateKey, "12:00"));
}

export function formatWeekdayShort(dateKey: string) {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: PRACTICE_TIME_ZONE,
    weekday: "short",
  }).format(berlinToUtc(dateKey, "12:00"));
}

export function formatWeekRange(startKey: string) {
  const endKey = addDays(startKey, 6);
  const start = berlinToUtc(startKey, "12:00");
  const end = berlinToUtc(endKey, "12:00");
  const sameMonth = startKey.slice(0, 7) === endKey.slice(0, 7);
  const startLabel = new Intl.DateTimeFormat("de-DE", {
    timeZone: PRACTICE_TIME_ZONE,
    day: "numeric",
    month: sameMonth ? undefined : "short",
  }).format(start);
  const endLabel = new Intl.DateTimeFormat("de-DE", {
    timeZone: PRACTICE_TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(end);
  return `${startLabel} – ${endLabel}`;
}

export function ageFromDob(dob: string, today = todayKey()) {
  if (!isDateKey(dob)) return null;
  const [year, month, day] = dob.split("-").map(Number);
  const [todayYear, todayMonth, todayDay] = today.split("-").map(Number);
  let age = todayYear - year;
  if (todayMonth < month || (todayMonth === month && todayDay < day)) age -= 1;
  if (age < 0 || age > 120) return null;
  return age;
}

export function greeting(now = new Date()) {
  const hour = berlinClock(now).hour;
  if (hour < 11) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

export function formatNumber(value: number, digits = 1) {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value);
}
