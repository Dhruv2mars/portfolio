import {
  AI_ACTIVITY_TIMEZONE,
  calendarDateInTimeZone,
  type AiActivityPayload,
  shiftMonth,
  shiftYmd,
  startOfMonth,
} from "@/lib/ai-activity-payload";

export type DailyTokens = {
  date: string;
  tokens: number;
};

export type Intensity = 0 | 1 | 2 | 3 | 4;

export type ActivityDay = DailyTokens & {
  intensity: Intensity;
};

export type AiActivity = {
  days: ActivityDay[];
  /** All-time total, from the payload — not the sum of the drawn window. */
  lifetimeTokens: number;
  timezone: string;
};

export type AiActivitySource = "blob" | "fallback";

/**
 * Four filled steps, cut at the quartiles of the days that had any work in
 * them — not at quarters of the busiest day.
 *
 * A single 400M-token afternoon against 140 ordinary days is what a scale
 * measured off the maximum draws: one black square and a grey field. Cutting
 * at the quartiles spends the four steps on the days there actually are, so
 * the grid reads as a distribution rather than as one outlier and its
 * shadow.
 */
export type IntensityThresholds = readonly [number, number, number];

export function quartileThresholds(
  days: readonly DailyTokens[],
): IntensityThresholds {
  const positive = days
    .map((day) => day.tokens)
    .filter((tokens) => tokens > 0)
    .sort((a, b) => a - b);
  if (positive.length === 0) return [0, 0, 0];
  const at = (ratio: number) =>
    positive[
      Math.min(positive.length - 1, Math.floor(positive.length * ratio))
    ]!;
  return [at(0.25), at(0.5), at(0.75)];
}

export function intensityFromTokens(
  tokens: number,
  thresholds: IntensityThresholds,
): Intensity {
  if (tokens <= 0) return 0;
  if (tokens <= thresholds[0]) return 1;
  if (tokens <= thresholds[1]) return 2;
  if (tokens <= thresholds[2]) return 3;
  return 4;
}

/** Never draw more than this much history, however long the record runs. */
export const ACTIVITY_MAX_MONTHS = 12;

/**
 * A month earns its columns by being worked in on at least this share of its
 * days. Below it the month is a few marks in a field of blanks, which draws
 * as an outage rather than as the beginning of a record.
 */
export const ACTIVITY_MIN_MONTH_RATIO = 0.25;

/** Days in the calendar month a YYYY-MM-DD date falls in. */
function daysInMonth(date: string): number {
  const [y, m] = date.split("-").map(Number);
  return new Date(Date.UTC(y!, m!, 0)).getUTCDate();
}

/**
 * Where the drawing starts: walk back from this month for as long as each
 * month was worked in, and stop at the first one that was not.
 *
 * The window is chosen rather than fixed because a fixed year of cells is
 * mostly a picture of the months before the habit existed — and the first few
 * scattered days of a tool being tried out are not a record of using it. The
 * rule slides forward on its own: a quiet month never enters the window, and
 * once the run is longer than the cap the cap is what shows.
 */
export function activityWindowStart(
  days: readonly DailyTokens[],
  today: string,
  maxMonths = ACTIVITY_MAX_MONTHS,
): string {
  const activeDays = new Map<string, number>();
  for (const day of days) {
    if (day.tokens <= 0) continue;
    const month = day.date.slice(0, 7);
    activeDays.set(month, (activeDays.get(month) ?? 0) + 1);
  }

  // The current month is always in, however young it is — it is the month the
  // grid's last cell lives in.
  let start = startOfMonth(today);
  for (let back = 1; back < maxMonths; back++) {
    const month = shiftMonth(today, -back);
    const needed = Math.ceil(daysInMonth(month) * ACTIVITY_MIN_MONTH_RATIO);
    if ((activeDays.get(month.slice(0, 7)) ?? 0) < needed) break;
    start = month;
  }
  return start;
}

/**
 * Expand a sparse series into consecutive calendar days from `start` to `end`.
 *
 * Inside this window an absent day is a measured zero, not a hole: the meter
 * reads every local session on the machine, so a day it never mentions is a
 * day nothing ran. The one genuinely unknown day is today, which the nightly
 * sync has not reached yet — and today's zero is drawn as the emptiest step,
 * which is what it is.
 */
export function buildDailySeries(
  days: readonly DailyTokens[],
  start: string,
  end: string,
): DailyTokens[] {
  const byDate = new Map(days.map((day) => [day.date, day.tokens]));
  const series: DailyTokens[] = [];
  for (let cursor = start; cursor <= end; cursor = shiftYmd(cursor, 1)) {
    series.push({ date: cursor, tokens: byDate.get(cursor) ?? 0 });
  }
  return series;
}

export function buildAiActivity(
  series: readonly DailyTokens[],
  options?: { timezone?: string; lifetimeTokens?: number },
): AiActivity {
  const thresholds = quartileThresholds(series);

  return {
    days: series.map((day) => ({
      ...day,
      intensity: intensityFromTokens(day.tokens, thresholds),
    })),
    lifetimeTokens:
      options?.lifetimeTokens ??
      series.reduce((sum, day) => sum + day.tokens, 0),
    timezone: options?.timezone ?? AI_ACTIVITY_TIMEZONE,
  };
}

export function materializeAiActivity(
  payload: AiActivityPayload,
  now = new Date(),
): AiActivity {
  const timezone = payload.timezone || AI_ACTIVITY_TIMEZONE;
  const today = calendarDateInTimeZone(now, timezone);
  const start = activityWindowStart(payload.days, today);

  return buildAiActivity(buildDailySeries(payload.days, start, today), {
    timezone,
    lifetimeTokens: payload.lifetimeTokens,
  });
}

/** Exact count. Used where a number is a number: alt text, tests, scripts. */
export function formatTokenCount(tokens: number): string {
  return new Intl.NumberFormat("en-US").format(tokens);
}

/**
 * The number as it is read aloud: `10.4B`, `512M`, `84.2K`. Ten billion is
 * eleven digits, and eleven digits is a serial number, not a quantity — the
 * page wants the magnitude, and the magnitude is the first three characters.
 */
export function formatCompactTokens(tokens: number): string {
  const value = Math.max(0, Math.round(tokens));
  for (const [limit, suffix] of [
    [1e12, "T"],
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ] as const) {
    if (value >= limit) {
      const scaled = value / limit;
      return `${scaled >= 100 ? Math.round(scaled) : Number(scaled.toFixed(1))}${suffix}`;
    }
  }
  return String(value);
}
