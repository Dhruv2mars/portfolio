import { shiftYmd } from "@/lib/ai-activity-payload";

export type DailyTokens = {
  date: string;
  tokens: number;
};

export type AiActivitySource = "tokscale" | "blob" | "fallback";

/**
 * Expand a sparse series into consecutive calendar days from `start` to `end`.
 *
 * Inside this window an absent day is a measured zero, not a hole: the meter
 * reads every local session on the machine, so a day it never mentions is a
 * day nothing ran. That holds only up to the end of the record — past it, an
 * absent day is unknown rather than quiet, and filling it with zero would be
 * an invented number. Callers pick `end`; the hero passes the last measured
 * day (`lastMeasuredDate` in `lib/hero-series.ts`) rather than today.
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
