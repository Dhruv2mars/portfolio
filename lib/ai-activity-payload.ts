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

export function isAiActivityPayload(value: unknown): value is AiActivityPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (v.version !== 1) return false;
  if (typeof v.generatedAt !== "string") return false;
  if (typeof v.timezone !== "string") return false;
  if (
    typeof v.lifetimeTokens !== "number" ||
    !Number.isFinite(v.lifetimeTokens) ||
    v.lifetimeTokens < 0
  ) {
    return false;
  }
  if (!Array.isArray(v.days)) return false;
  if (v.days.length === 0 || v.days.length > AI_ACTIVITY_MAX_DAYS) return false;
  return v.days.every(
    (day) =>
      day &&
      typeof day === "object" &&
      typeof (day as { date?: unknown }).date === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test((day as { date: string }).date) &&
      typeof (day as { tokens?: unknown }).tokens === "number" &&
      Number.isFinite((day as { tokens: number }).tokens) &&
      (day as { tokens: number }).tokens >= 0,
  );
}

export function parseAiActivityPayload(
  value: unknown,
): AiActivityPayload | null {
  return isAiActivityPayload(value) ? value : null;
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

/** Previous calendar day (YYYY-MM-DD) in a timezone. */
export function yesterdayInTimeZone(now: Date, timeZone: string): string {
  return shiftYmd(calendarDateInTimeZone(now, timeZone), -1);
}
