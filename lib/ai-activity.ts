import fallbackPayload from "@/data/ai-activity.fallback.json";
import {
  AI_ACTIVITY_TIMEZONE,
  type AiActivityPayload,
  isAiActivityPayload,
  projectTodayTokens,
} from "@/lib/ai-activity-payload";
import { fetchPublishedAiActivityPayload } from "@/lib/ai-activity-store";

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
};

/**
 * Absolute thresholds (tests / small fixtures).
 * Real volumes use relative scaling in `buildAiActivity`.
 */
export function intensityFromTokens(tokens: number): Intensity {
  if (tokens <= 0) return 0;
  if (tokens <= 5_000) return 1;
  if (tokens <= 20_000) return 2;
  if (tokens <= 50_000) return 3;
  return 4;
}

function relativeIntensity(tokens: number, maxTokens: number): Intensity {
  if (tokens <= 0 || maxTokens <= 0) return 0;
  const ratio = tokens / maxTokens;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

export function buildAiActivity(
  series: readonly DailyTokens[],
  options?: { liveDates?: ReadonlySet<string>; generatedAt?: string | null; source?: AiActivity["source"] },
): AiActivity {
  const max = Math.max(0, ...series.map((d) => d.tokens));
  const useRelative = max > 50_000;
  const liveDates = options?.liveDates;

  const days: ActivityDay[] = series.map((day) => ({
    ...day,
    intensity: useRelative
      ? relativeIntensity(day.tokens, max)
      : intensityFromTokens(day.tokens),
    live: liveDates?.has(day.date) || undefined,
  }));

  const lifetimeTokens = series.reduce((sum, day) => sum + day.tokens, 0);

  return {
    days,
    lifetimeTokens,
    generatedAt: options?.generatedAt ?? null,
    source: options?.source ?? "fallback",
  };
}

function formatDateUTC(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Deterministic fixture year ending on the given end date (UTC).
 * Used only when no published/fallback payload is available.
 */
export function createFixtureSeries(endDate = new Date("2026-07-17")): DailyTokens[] {
  const end = new Date(
    Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()),
  );
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 364);

  const series: DailyTokens[] = [];
  for (
    let cursor = new Date(start);
    cursor.getTime() <= end.getTime();
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  ) {
    const dayOfYear = Math.floor(
      (cursor.getTime() - Date.UTC(cursor.getUTCFullYear(), 0, 0)) / 86_400_000,
    );
    const weekday = cursor.getUTCDay();
    let tokens = 0;
    if (weekday !== 0 && weekday !== 6) {
      const wave = (Math.sin(dayOfYear / 11) + 1) / 2;
      const burst = dayOfYear % 17 === 0 ? 2.4 : 1;
      tokens = Math.round((800 + wave * 42_000) * burst);
    } else if (dayOfYear % 9 === 0) {
      tokens = 2_400;
    }
    series.push({ date: formatDateUTC(cursor), tokens });
  }
  return series;
}

export const AI_ACTIVITY_FIXTURE = createFixtureSeries();

function payloadFromFallback(): AiActivityPayload {
  if (isAiActivityPayload(fallbackPayload)) return fallbackPayload;
  return {
    version: 1,
    generatedAt: new Date(0).toISOString(),
    timezone: AI_ACTIVITY_TIMEZONE,
    days: AI_ACTIVITY_FIXTURE,
    lifetimeTokens: AI_ACTIVITY_FIXTURE.reduce((s, d) => s + d.tokens, 0),
  };
}

export function materializeAiActivity(
  payload: AiActivityPayload,
  now = new Date(),
  source: AiActivity["source"] = "fallback",
): AiActivity {
  const timeZone = payload.timezone || AI_ACTIVITY_TIMEZONE;
  const history = [...payload.days].sort((a, b) => a.date.localeCompare(b.date));
  const projection = projectTodayTokens(history, now, timeZone);

  const withoutToday = history.filter((d) => d.date < projection.date);
  const series: DailyTokens[] = [
    ...withoutToday,
    { date: projection.date, tokens: projection.tokens },
  ];

  // Keep ~one year of cells for the heatmap.
  const trimmed = series.slice(-365);

  return buildAiActivity(trimmed, {
    liveDates: new Set([projection.date]),
    generatedAt: payload.generatedAt,
    source,
  });
}

export async function getAiActivity(now = new Date()): Promise<AiActivity> {
  const published = await fetchPublishedAiActivityPayload();
  if (published) {
    return materializeAiActivity(published, now, "blob");
  }
  return materializeAiActivity(payloadFromFallback(), now, "fallback");
}

export function formatTokenCount(tokens: number): string {
  return new Intl.NumberFormat("en-US").format(tokens);
}

/** Live counter: start this fraction below the target. */
export const LIVE_COUNT_START_RATIO = 0.8;
/** Live counter: seconds to ease from start → target. */
export const LIVE_COUNT_DURATION_MS = 90_000;
