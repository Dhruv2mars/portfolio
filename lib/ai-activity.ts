import {
  AI_ACTIVITY_TIMEZONE,
  calendarDateInTimeZone,
  type AiActivityPayload,
  isAiActivityPayload,
  projectTodayTokens,
  yesterdayInTimeZone,
} from "@/lib/ai-activity-payload";

export type DailyTokens = {
  date: string;
  tokens: number;
};

export type Intensity = 0 | 1 | 2 | 3 | 4;

export type ActivityDay = DailyTokens & {
  intensity: Intensity;
  /** Synthetic “live” projection for the current local day. */
  live?: boolean;
};

export type AiActivity = {
  days: ActivityDay[];
  lifetimeTokens: number;
  /** ISO timestamp of the nightly payload, when known. */
  generatedAt: string | null;
  source: "blob" | "fallback";
  timezone: string;
};

/** GitHub-like 5-level scale relative to the densest day in the series. */
export function intensityFromTokens(
  tokens: number,
  maxTokens = tokens,
): Intensity {
  if (tokens <= 0 || maxTokens <= 0) return 0;
  const ratio = tokens / maxTokens;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function addCalendarDays(date: string, delta: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const utcNoon = new Date(Date.UTC(y!, m! - 1, d!, 12, 0, 0));
  utcNoon.setUTCDate(utcNoon.getUTCDate() + delta);
  return calendarDateInTimeZone(utcNoon, "UTC");
}

/**
 * Expand a sparse daily series into consecutive calendar days (0-filled gaps)
 * ending on `endDate`, keeping at most `windowDays` cells.
 */
export function fillSparseDailySeries(
  days: readonly DailyTokens[],
  endDate: string,
  windowDays = 365,
): DailyTokens[] {
  const byDate = new Map(days.map((d) => [d.date, d.tokens]));
  const startDate = addCalendarDays(endDate, -(windowDays - 1));
  const filled: DailyTokens[] = [];
  for (
    let cursor = startDate;
    cursor <= endDate;
    cursor = addCalendarDays(cursor, 1)
  ) {
    filled.push({ date: cursor, tokens: byDate.get(cursor) ?? 0 });
  }
  return filled;
}

export function buildAiActivity(
  series: readonly DailyTokens[],
  options?: {
    liveDate?: string;
    generatedAt?: string | null;
    source?: AiActivity["source"];
    timezone?: string;
    /** Authoritative lifetime from the payload (preferred over series sum). */
    lifetimeTokens?: number;
  },
): AiActivity {
  const max = Math.max(0, ...series.map((d) => d.tokens));
  const liveDate = options?.liveDate;

  const days: ActivityDay[] = series.map((day) => ({
    ...day,
    intensity: intensityFromTokens(day.tokens, max),
    live: liveDate === day.date ? true : undefined,
  }));

  const seriesSum = series.reduce((sum, day) => sum + day.tokens, 0);
  const lifetimeTokens =
    options?.lifetimeTokens !== undefined
      ? options.lifetimeTokens
      : seriesSum;

  return {
    days,
    lifetimeTokens,
    generatedAt: options?.generatedAt ?? null,
    source: options?.source ?? "fallback",
    timezone: options?.timezone ?? AI_ACTIVITY_TIMEZONE,
  };
}

export function materializeAiActivity(
  payload: AiActivityPayload,
  now = new Date(),
  source: AiActivity["source"] = "fallback",
  options?: { includeLiveToday?: boolean },
): AiActivity {
  const includeLiveToday = options?.includeLiveToday ?? true;
  const timeZone = payload.timezone || AI_ACTIVITY_TIMEZONE;
  const endHistory = yesterdayInTimeZone(now, timeZone);
  const history = [...payload.days]
    .filter((d) => d.date <= endHistory)
    .sort((a, b) => a.date.localeCompare(b.date));

  const filledHistory = fillSparseDailySeries(history, endHistory, 364);

  if (!includeLiveToday) {
    return buildAiActivity(filledHistory, {
      generatedAt: payload.generatedAt,
      source,
      timezone: timeZone,
      lifetimeTokens: payload.lifetimeTokens,
    });
  }

  const projection = projectTodayTokens(history, now, timeZone);
  const series: DailyTokens[] = [
    ...filledHistory,
    { date: projection.date, tokens: projection.tokens },
  ];

  return buildAiActivity(series, {
    liveDate: projection.date,
    generatedAt: payload.generatedAt,
    source,
    timezone: timeZone,
    // History lifetime from payload + projected today (not in nightly sum).
    lifetimeTokens: payload.lifetimeTokens + projection.tokens,
  });
}

export function formatTokenCount(tokens: number): string {
  return new Intl.NumberFormat("en-US").format(tokens);
}

export const LIVE_COUNT_START_RATIO = 0.8;
export const LIVE_COUNT_DURATION_MS = 90_000;

export function assertValidPayload(payload: unknown): asserts payload is AiActivityPayload {
  if (!isAiActivityPayload(payload)) {
    throw new Error("Invalid AI Activity payload");
  }
}
