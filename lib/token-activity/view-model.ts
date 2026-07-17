export type TokenActivityRange = "daily" | "weekly" | "cumulative";

export type TokenActivityDay = {
  date: string;
  tokens: number;
};

export type TokenIntensity = 0 | 1 | 2 | 3 | 4;

export type TokenActivityCell = {
  date: string;
  tokens: number;
  intensity: TokenIntensity;
  weekday: number;
};

export type TokenActivityStat = {
  label: string;
  value: string;
  hint?: string;
};

export type TokenActivitySeriesPoint = {
  key: string;
  label: string;
  value: number;
};

export type TokenActivityViewModel = {
  range: TokenActivityRange;
  title: string;
  description: string;
  stats: readonly TokenActivityStat[];
  cells: readonly TokenActivityCell[];
  series: readonly TokenActivitySeriesPoint[];
  legend: readonly { intensity: TokenIntensity; label: string }[];
};

const RANGE_COPY: Record<
  TokenActivityRange,
  { title: string; description: string }
> = {
  daily: {
    title: "Token activity",
    description: "Day-by-day AI usage — proof of staying AI-pilled.",
  },
  weekly: {
    title: "Token activity",
    description: "Weekly rhythm of AI usage across the last year.",
  },
  cumulative: {
    title: "Token activity",
    description: "Running total of tokens spent building with AI.",
  },
};

const DAILY_SERIES_WINDOW = 28;
const WEEKLY_SERIES_WINDOW = 26;

export function buildTokenActivityViewModel(
  days: readonly TokenActivityDay[],
  range: TokenActivityRange,
): TokenActivityViewModel {
  const ordered = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const cells = toCells(ordered);
  const series = toSeries(ordered, range);
  const stats = toStats(ordered, range);
  const copy = RANGE_COPY[range];

  return {
    range,
    title: copy.title,
    description: copy.description,
    stats,
    cells,
    series,
    legend: [
      { intensity: 0, label: "None" },
      { intensity: 1, label: "Low" },
      { intensity: 2, label: "Medium" },
      { intensity: 3, label: "High" },
      { intensity: 4, label: "Peak" },
    ],
  };
}

function toCells(days: readonly TokenActivityDay[]): TokenActivityCell[] {
  const thresholds = intensityThresholds(days.map((d) => d.tokens));

  return days.map((day) => ({
    date: day.date,
    tokens: day.tokens,
    intensity: intensityFor(day.tokens, thresholds),
    weekday: utcWeekday(day.date),
  }));
}

function toSeries(
  days: readonly TokenActivityDay[],
  range: TokenActivityRange,
): TokenActivitySeriesPoint[] {
  if (range === "daily") {
    return days.slice(-DAILY_SERIES_WINDOW).map((day) => ({
      key: day.date,
      label: formatShortDate(day.date),
      value: day.tokens,
    }));
  }

  const weeks = bucketByWeek(days);

  if (range === "weekly") {
    return weeks.slice(-WEEKLY_SERIES_WINDOW).map((week) => ({
      key: week.key,
      label: week.label,
      value: week.tokens,
    }));
  }

  let running = 0;
  return weeks.map((week) => {
    running += week.tokens;
    return {
      key: week.key,
      label: week.label,
      value: running,
    };
  });
}

function toStats(
  days: readonly TokenActivityDay[],
  range: TokenActivityRange,
): TokenActivityStat[] {
  const total = days.reduce((sum, day) => sum + day.tokens, 0);
  const activeDays = days.filter((day) => day.tokens > 0).length;
  const last = days.at(-1);
  const lastSeven = days.slice(-7);
  const sevenAvg =
    lastSeven.length === 0
      ? 0
      : Math.round(
          lastSeven.reduce((sum, day) => sum + day.tokens, 0) / lastSeven.length,
        );

  if (range === "daily") {
    return [
      {
        label: "Last day",
        value: formatTokens(last?.tokens ?? 0),
        hint: last?.date,
      },
      {
        label: "7-day avg",
        value: formatTokens(sevenAvg),
      },
      {
        label: "Active days",
        value: String(activeDays),
        hint: `of ${days.length}`,
      },
    ];
  }

  const weeks = bucketByWeek(days);
  const thisWeek = weeks.at(-1);
  const weeklyAvg =
    weeks.length === 0
      ? 0
      : Math.round(weeks.reduce((sum, week) => sum + week.tokens, 0) / weeks.length);
  const activeWeeks = weeks.filter((week) => week.tokens > 0).length;

  if (range === "weekly") {
    return [
      {
        label: "This week",
        value: formatTokens(thisWeek?.tokens ?? 0),
        hint: thisWeek?.label,
      },
      {
        label: "Weekly avg",
        value: formatTokens(weeklyAvg),
      },
      {
        label: "Active weeks",
        value: String(activeWeeks),
        hint: `of ${weeks.length}`,
      },
    ];
  }

  const peak = days.reduce(
    (best, day) => (day.tokens > best.tokens ? day : best),
    days[0] ?? { date: "", tokens: 0 },
  );

  return [
    {
      label: "Total tokens",
      value: formatTokens(total),
    },
    {
      label: "Active days",
      value: String(activeDays),
      hint: `of ${days.length}`,
    },
    {
      label: "Peak day",
      value: formatTokens(peak.tokens),
      hint: peak.date || undefined,
    },
  ];
}

function bucketByWeek(days: readonly TokenActivityDay[]) {
  const buckets = new Map<
    string,
    { key: string; label: string; tokens: number; start: string }
  >();

  for (const day of days) {
    const start = startOfUtcWeek(day.date);
    const existing = buckets.get(start);
    if (existing) {
      existing.tokens += day.tokens;
    } else {
      buckets.set(start, {
        key: start,
        label: formatShortDate(start),
        tokens: day.tokens,
        start,
      });
    }
  }

  return [...buckets.values()].sort((a, b) => a.start.localeCompare(b.start));
}

function intensityThresholds(values: readonly number[]): number[] {
  const positive = values.filter((v) => v > 0).sort((a, b) => a - b);
  if (positive.length === 0) {
    return [1, 2, 3, 4];
  }

  const at = (ratio: number) =>
    positive[Math.min(positive.length - 1, Math.floor(positive.length * ratio))]!;

  return [at(0.25), at(0.5), at(0.75), at(0.9)];
}

function intensityFor(tokens: number, thresholds: number[]): TokenIntensity {
  if (tokens <= 0) return 0;
  if (tokens <= thresholds[0]!) return 1;
  if (tokens <= thresholds[1]!) return 2;
  if (tokens <= thresholds[2]!) return 3;
  return 4;
}

export function formatTokens(tokens: number): string {
  if (tokens < 1_000) return String(tokens);
  if (tokens < 1_000_000) {
    const k = tokens / 1_000;
    return `${trimNumber(k)}K`;
  }
  const m = tokens / 1_000_000;
  return `${trimNumber(m)}M`;
}

function trimNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function utcWeekday(iso: string): number {
  return parseUtcDate(iso).getUTCDay();
}

function startOfUtcWeek(iso: string): string {
  const date = parseUtcDate(iso);
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return formatUtcDate(date);
}

function formatShortDate(iso: string): string {
  const date = parseUtcDate(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function parseUtcDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!));
}

function formatUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
