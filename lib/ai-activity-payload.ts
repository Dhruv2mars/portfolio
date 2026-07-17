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

/** Calendar YYYY-MM-DD in a timezone. */
export function calendarDateInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Previous calendar day (YYYY-MM-DD) in a timezone. */
export function yesterdayInTimeZone(now: Date, timeZone: string): string {
  // Noon UTC probe days avoid DST edge cases when shifting by 24h from local midnight.
  const today = calendarDateInTimeZone(now, timeZone);
  const [y, m, d] = today.split("-").map(Number);
  const utcNoon = new Date(Date.UTC(y!, m! - 1, d!, 12, 0, 0));
  utcNoon.setUTCDate(utcNoon.getUTCDate() - 1);
  return calendarDateInTimeZone(utcNoon, timeZone);
}

/**
 * Fraction of the local calendar day elapsed [0, 1].
 */
export function dayFractionElapsed(now: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const second = Number(parts.find((p) => p.type === "second")?.value ?? 0);
  const elapsed = hour * 3600 + minute * 60 + second;
  return Math.min(1, Math.max(0, elapsed / 86_400));
}

/**
 * Conservative full-day baseline: minimum of the last up-to-7 days
 * before `beforeDate` that have tokens > 0.
 */
export function sevenDayMinBaseline(
  days: readonly { date: string; tokens: number }[],
  beforeDate: string,
): number {
  const prior = days
    .filter((d) => d.date < beforeDate && d.tokens > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);
  if (prior.length === 0) return 0;
  return Math.min(...prior.map((d) => d.tokens));
}

/** Projected tokens “so far today” from the 7-day min baseline. */
export function projectTodayTokens(
  days: readonly { date: string; tokens: number }[],
  now: Date,
  timeZone: string,
): { date: string; tokens: number; baseline: number } {
  const today = calendarDateInTimeZone(now, timeZone);
  const baseline = sevenDayMinBaseline(days, today);
  const tokens = Math.round(baseline * dayFractionElapsed(now, timeZone));
  return { date: today, tokens, baseline };
}
