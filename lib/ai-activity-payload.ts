/**
 * Published AI Activity payload (nightly → Vercel Blob).
 * Public-safe: daily combined token totals only.
 */
export type AiActivityPayload = {
  version: 1;
  generatedAt: string;
  timezone: string;
  /** Complete days only (through yesterday in `timezone`). */
  days: { date: string; tokens: number }[];
  lifetimeTokens: number;
};

export const AI_ACTIVITY_TIMEZONE = "Asia/Kolkata";
export const AI_ACTIVITY_BLOB_PATH = "ai-activity/latest.json";
export const AI_ACTIVITY_MAX_DAYS = 800;
const MAX_GENERATED_AT_LEN = 40;
const MAX_TIMEZONE_LEN = 64;

export function isValidIanaTimeZone(timeZone: string): boolean {
  if (
    timeZone.length < 1 ||
    timeZone.length > MAX_TIMEZONE_LEN ||
    timeZone !== timeZone.trim()
  ) {
    return false;
  }
  try {
    Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function isAiActivityPayload(value: unknown): value is AiActivityPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (v.version !== 1) return false;
  if (
    typeof v.generatedAt !== "string" ||
    v.generatedAt.length === 0 ||
    v.generatedAt.length > MAX_GENERATED_AT_LEN
  ) {
    return false;
  }
  if (typeof v.timezone !== "string" || !isValidIanaTimeZone(v.timezone)) {
    return false;
  }
  if (
    typeof v.lifetimeTokens !== "number" ||
    !Number.isFinite(v.lifetimeTokens) ||
    v.lifetimeTokens < 0
  ) {
    return false;
  }
  if (!Array.isArray(v.days)) return false;
  if (v.days.length === 0 || v.days.length > AI_ACTIVITY_MAX_DAYS) return false;

  const seen = new Set<string>();
  for (const day of v.days) {
    if (!day || typeof day !== "object") return false;
    const date = (day as { date?: unknown }).date;
    const tokens = (day as { tokens?: unknown }).tokens;
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return false;
    }
    if (seen.has(date)) return false;
    seen.add(date);
    if (
      typeof tokens !== "number" ||
      !Number.isFinite(tokens) ||
      tokens < 0
    ) {
      return false;
    }
  }
  return true;
}

export function parseAiActivityPayload(
  value: unknown,
): AiActivityPayload | null {
  return isAiActivityPayload(value) ? value : null;
}

/** Reject payloads whose days extend past yesterday in the payload timezone. */
export function payloadDaysWithinHistory(
  payload: AiActivityPayload,
  now = new Date(),
): boolean {
  const cutoff = yesterdayInTimeZone(now, payload.timezone);
  return payload.days.every((d) => d.date <= cutoff);
}

/** Calendar YYYY-MM-DD in a timezone. */
export function calendarDateInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Shift a YYYY-MM-DD by whole calendar days (noon-UTC probe). */
export function shiftYmd(date: string, deltaDays: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const utcNoon = new Date(Date.UTC(y!, m! - 1, d!, 12, 0, 0));
  utcNoon.setUTCDate(utcNoon.getUTCDate() + deltaDays);
  return calendarDateInTimeZone(utcNoon, "UTC");
}

/** First day of the month a date falls in. */
export function startOfMonth(date: string): string {
  return `${date.slice(0, 7)}-01`;
}

/** Same day-of-month `deltaMonths` away, clamped to the 1st. */
export function shiftMonth(date: string, deltaMonths: number): string {
  const [y, m] = date.split("-").map(Number);
  const total = y! * 12 + (m! - 1) + deltaMonths;
  const year = Math.floor(total / 12);
  const month = total - year * 12 + 1;
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-01`;
}

/** Previous calendar day (YYYY-MM-DD) in a timezone. */
export function yesterdayInTimeZone(now: Date, timeZone: string): string {
  return shiftYmd(calendarDateInTimeZone(now, timeZone), -1);
}
