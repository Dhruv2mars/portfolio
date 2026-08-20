import {
  AI_ACTIVITY_TIMEZONE,
  calendarDateInTimeZone,
  type AiActivityPayload,
  shiftYmd,
  weekdayIndex,
} from "@/lib/ai-activity-payload";

export type DailyTokens = {
  date: string;
  tokens: number;
};

export type Intensity = 0 | 1 | 2 | 3 | 4;

export type ActivityDay = DailyTokens & {
  intensity: Intensity;
};

/**
 * The four numbers under the title. One total is a milestone and says nothing
 * about whether the habit is still alive; four nested windows say the same
 * thing the grid says, in figures, for the Visitor who reads numbers before
 * pictures. All but the first are sums of the drawn series, so they can never
 * disagree with the cells above them.
 */
export type ActivityTotals = {
  /** All-time, from the payload — not the sum of the drawn window. */
  lifetime: number;
  days30: number;
  days7: number;
  today: number;
};

export type AiActivity = {
  days: ActivityDay[];
  /** All-time total, from the payload — not the sum of the drawn window. */
  lifetimeTokens: number;
  totals: ActivityTotals;
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

/**
 * The frame is a fixed year, and it does not move.
 *
 * An earlier version chose the window from the record — walk back for as long
 * as each month was worked in, stop at the first that was not — which meant the
 * figure was a different shape every month and a different shape again on the
 * day a quiet month rolled out of it. A measure whose axis changes with what it
 * measures is not a measure. So the grid is a calendar: fifty-two weeks back
 * from today, Sunday-aligned, exactly as the reference and every graph like it
 * draws one. The months before the habit existed are drawn empty, which is what
 * they were, and the record reads as having started rather than as having been
 * cropped.
 */
export const ACTIVITY_WEEKS = 52;

/**
 * The Sunday that opens the window: this week's Sunday, then fifty-two Sundays
 * back from it.
 *
 * Counting whole weeks off the current week — rather than counting 364 days
 * back from today and rounding — is what makes the plate exactly 53 columns on
 * every day of every week. Counting days puts a Saturday at exactly 52 columns
 * and every other day at 53, and a figure that loses a column once a week is a
 * figure that moves under the Visitor.
 */
export function activityWindowStart(
  today: string,
  weeks = ACTIVITY_WEEKS,
): string {
  return shiftYmd(today, -(weekdayIndex(today) + weeks * 7));
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

/** Sum of the last `count` days of a consecutive series ending today. */
function sumTrailing(days: readonly DailyTokens[], count: number): number {
  return days
    .slice(-count)
    .reduce((total, day) => total + Math.max(0, day.tokens), 0);
}

export function buildAiActivity(
  series: readonly DailyTokens[],
  options?: { timezone?: string; lifetimeTokens?: number },
): AiActivity {
  const thresholds = quartileThresholds(series);
  const lifetimeTokens =
    options?.lifetimeTokens ??
    series.reduce((sum, day) => sum + day.tokens, 0);

  return {
    days: series.map((day) => ({
      ...day,
      intensity: intensityFromTokens(day.tokens, thresholds),
    })),
    lifetimeTokens,
    totals: {
      lifetime: lifetimeTokens,
      days30: sumTrailing(series, 30),
      days7: sumTrailing(series, 7),
      today: sumTrailing(series, 1),
    },
    timezone: options?.timezone ?? AI_ACTIVITY_TIMEZONE,
  };
}

export function materializeAiActivity(
  payload: AiActivityPayload,
  now = new Date(),
): AiActivity {
  const timezone = payload.timezone || AI_ACTIVITY_TIMEZONE;
  const today = calendarDateInTimeZone(now, timezone);
  const start = activityWindowStart(today);

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
