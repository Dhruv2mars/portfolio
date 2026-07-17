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
  lifetimeTokens: number;
};

/**
 * Stable token → intensity thresholds (GitHub-like 5 levels).
 * Future ingestion should feed DailyTokens[]; intensity is derived here.
 */
export function intensityFromTokens(tokens: number): Intensity {
  if (tokens <= 0) return 0;
  if (tokens <= 5_000) return 1;
  if (tokens <= 20_000) return 2;
  if (tokens <= 50_000) return 3;
  return 4;
}

export function buildAiActivity(
  series: readonly DailyTokens[],
): AiActivity {
  const days: ActivityDay[] = series.map((day) => ({
    ...day,
    intensity: intensityFromTokens(day.tokens),
  }));

  const lifetimeTokens = series.reduce((sum, day) => sum + day.tokens, 0);

  return { days, lifetimeTokens };
}

function formatDateUTC(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Deterministic fixture year ending on the given end date (UTC).
 * No provider secrets — safe for the public app (ADR-0001).
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
    // Quiet weekends, busier mid-week; deterministic wave — not real usage.
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

export function getAiActivity(): AiActivity {
  return buildAiActivity(AI_ACTIVITY_FIXTURE);
}

export function formatTokenCount(tokens: number): string {
  return new Intl.NumberFormat("en-US").format(tokens);
}
