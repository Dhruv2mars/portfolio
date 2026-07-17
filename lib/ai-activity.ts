import {
  AI_ACTIVITY_TIMEZONE,
  calendarDateInTimeZone,
  type AiActivityPayload,
  shiftYmd,
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
  timezone: string;
};

export type AiActivitySource = "blob" | "fallback";

/** GitHub-like 5-level scale relative to the densest day in the series. */
export function intensityFromTokens(
  tokens: number,
  maxTokens: number,
): Intensity {
  if (tokens <= 0 || maxTokens <= 0) return 0;
  const ratio = tokens / maxTokens;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
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
  const startDate = shiftYmd(endDate, -(windowDays - 1));
  const filled: DailyTokens[] = [];
  for (
    let cursor = startDate;
    cursor <= endDate;
    cursor = shiftYmd(cursor, 1)
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
    timezone: options?.timezone ?? AI_ACTIVITY_TIMEZONE,
  };
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

/** Cacheable history through the payload’s last published day (no live today). */
export function materializeHistory(payload: AiActivityPayload): AiActivity {
  const timeZone = payload.timezone || AI_ACTIVITY_TIMEZONE;
  const history = [...payload.days].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const endHistory = history.at(-1)!.date;

  return buildAiActivity(fillSparseDailySeries(history, endHistory, 364), {
    generatedAt: payload.generatedAt,
    timezone: timeZone,
    lifetimeTokens: payload.lifetimeTokens,
  });
}

/**
 * Append the live today cell. Projection is ≤ recent positive days, so
 * existing intensities stay valid without a full rebuild.
 * Lifetime stays the published nightly total (excludes synthetic today).
 */
export function withLiveToday(history: AiActivity, now = new Date()): AiActivity {
  const projection = projectTodayTokens(
    history.days,
    now,
    history.timezone,
  );
  // Avoid duplicating the last published day if clocks briefly disagree.
  if (projection.date <= (history.days.at(-1)?.date ?? "")) {
    return history;
  }
  const max = Math.max(0, ...history.days.map((d) => d.tokens));

  return {
    days: [
      ...history.days,
      {
        date: projection.date,
        tokens: projection.tokens,
        intensity: intensityFromTokens(projection.tokens, max),
        live: true,
      },
    ],
    lifetimeTokens: history.lifetimeTokens,
    generatedAt: history.generatedAt,
    timezone: history.timezone,
  };
}

export function materializeAiActivity(
  payload: AiActivityPayload,
  now = new Date(),
  options?: { includeLiveToday?: boolean },
): AiActivity {
  const history = materializeHistory(payload);
  if (options?.includeLiveToday === false) return history;
  return withLiveToday(history, now);
}

export function formatTokenCount(tokens: number): string {
  return new Intl.NumberFormat("en-US").format(tokens);
}

export const LIVE_COUNT_START_RATIO = 0.8;
export const LIVE_COUNT_DURATION_MS = 90_000;
