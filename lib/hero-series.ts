import { monthAbbreviation } from "@/lib/activity-grid";
import { buildDailySeries, type DailyTokens } from "@/lib/ai-activity";
import {
  type AiActivityPayload,
  AI_ACTIVITY_TIMEZONE,
  calendarDateInTimeZone,
} from "@/lib/ai-activity-payload";

/**
 * The masthead curve: this calendar year, January 1 to today, one line.
 *
 * The grid below it answers "did anything happen on this day". This answers
 * "how much, and which way is it going" — the same measurements, read as a
 * shape instead of as 365 squares. Nothing here is invented: the smoothing is
 * mass-conserving and monotone, so the curve cannot show a peak that was not
 * worked or dip below a day that was zero.
 */

/**
 * Fifteen days, triangular.
 *
 * Raw daily token counts are spiky in a way that says nothing — a 600M
 * Saturday next to a 4M Sunday is one long session and one short one, not a
 * trend. A fortnight's window is the shortest one that reads as work rather
 * than as noise, and an odd length keeps the window centred on its day so the
 * curve does not lag the record it draws.
 */
export const HERO_SMOOTHING_DAYS = 15;

export type HeroPoint = {
  /** Days since January 1. The x axis is numeric, so months land in true
   *  proportion rather than at equal spacing. */
  day: number;
  date: string;
  /** Smoothed tokens per day. */
  value: number;
  /** The measurement itself, kept for the accessible description. */
  raw: number;
};

export type HeroMonthTick = {
  /** Centre of the month's span inside the window. */
  day: number;
  label: string;
};

export type HeroSeries = {
  points: HeroPoint[];
  months: HeroMonthTick[];
  /** Y gridline values, drawn as labels only. Never includes zero. */
  ticks: number[];
  xDomain: [number, number];
  yDomain: [number, number];
  year: number;
  from: string;
  to: string;
  /** Sum of the raw days in the window — the year's total, not the lifetime. */
  total: number;
  peak: { date: string; tokens: number };
  smoothingDays: number;
};

/** Fold an index back inside the series instead of dropping it. */
function mirror(index: number, length: number): number {
  let i = index;
  // A loop rather than one modulo: the window is short and the series is long,
  // so this folds at most once, but it stays correct if that ever changes.
  while (i < 0 || i >= length) {
    if (i < 0) i = -1 - i;
    if (i >= length) i = 2 * length - 1 - i;
  }
  return i;
}

/**
 * Triangular smoothing that conserves mass, including at both ends.
 *
 * The usual convolution drops the taps that fall off the ends, which bleeds
 * the first and last weeks toward zero and draws a year that fades in and
 * fades out — a smoothing artefact the Visitor would read as a quiet January.
 * Here those taps are reflected back inside the series instead of discarded,
 * so every day's kernel carries the same total weight and the tokens under
 * the curve equal the tokens measured.
 */
export function smoothTriangular(
  values: readonly number[],
  window: number,
): number[] {
  if (values.length === 0) return [];
  const radius = Math.max(0, Math.floor((window - 1) / 2));
  if (radius === 0) return [...values];

  const weights: number[] = [];
  let total = 0;
  for (let offset = -radius; offset <= radius; offset += 1) {
    const w = radius + 1 - Math.abs(offset);
    weights.push(w);
    total += w;
  }

  return values.map((_, i) => {
    let weighted = 0;
    for (let offset = -radius; offset <= radius; offset += 1) {
      const j = mirror(i + offset, values.length);
      weighted += values[j]! * weights[offset + radius]!;
    }
    return weighted / total;
  });
}

/**
 * A round number above the peak, and the ladder of labels below it.
 *
 * Steps come from the 1 / 2 / 5 ladder so a label is always a number a reader
 * already knows how to say. The top of the scale clears the peak by a step so
 * the curve has air above it rather than touching the plate's edge.
 */
export function niceScale(
  peak: number,
  targetTicks = 4,
): { max: number; ticks: number[] } {
  if (!Number.isFinite(peak) || peak <= 0) return { max: 1, ticks: [] };

  const rough = peak / targetTicks;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step =
    magnitude *
    ([1, 2, 5, 10].find((m) => magnitude * m >= rough) ?? 10);

  const max = Math.ceil(peak / step) * step + step * 0.5;
  const ticks: number[] = [];
  for (let value = step; value <= peak; value += step) {
    ticks.push(Number(value.toFixed(6)));
  }
  return { max, ticks };
}

/** Centre each month's span inside the window, so a partial month sits at its
 *  own middle rather than pretending to be whole. */
export function monthTicks(points: readonly HeroPoint[]): HeroMonthTick[] {
  const spans = new Map<string, { first: number; last: number; date: string }>();
  for (const point of points) {
    const key = point.date.slice(0, 7);
    const span = spans.get(key);
    if (span) span.last = point.day;
    else spans.set(key, { first: point.day, last: point.day, date: point.date });
  }

  return [...spans.values()].map((span) => ({
    day: (span.first + span.last) / 2,
    label: monthAbbreviation(span.date),
  }));
}

/**
 * Build the year-to-date curve from a published payload.
 *
 * The window is fixed by the calendar, not by the record: it opens on January 1
 * whether or not anything ran that week, so the figure is the same shape
 * tomorrow as it is today and one quiet fortnight cannot crop it.
 */
export function buildHeroSeries(
  payload: AiActivityPayload,
  now = new Date(),
): HeroSeries {
  const timezone = payload.timezone || AI_ACTIVITY_TIMEZONE;
  const today = calendarDateInTimeZone(now, timezone);
  const year = Number(today.slice(0, 4));
  const from = `${today.slice(0, 4)}-01-01`;

  const daily: DailyTokens[] = buildDailySeries(payload.days, from, today);
  const smoothed = smoothTriangular(
    daily.map((day) => day.tokens),
    HERO_SMOOTHING_DAYS,
  );

  const points: HeroPoint[] = daily.map((day, i) => ({
    day: i,
    date: day.date,
    value: Math.round(smoothed[i] ?? 0),
    raw: day.tokens,
  }));

  const peak = daily.reduce(
    (best, day) => (day.tokens > best.tokens ? day : best),
    daily[0] ?? { date: from, tokens: 0 },
  );
  const smoothedPeak = points.reduce((max, p) => Math.max(max, p.value), 0);
  const { max, ticks } = niceScale(smoothedPeak);

  return {
    points,
    months: monthTicks(points),
    ticks,
    xDomain: [0, Math.max(1, points.length - 1)],
    yDomain: [0, max],
    year,
    from,
    to: today,
    total: daily.reduce((sum, day) => sum + day.tokens, 0),
    peak: { date: peak.date, tokens: peak.tokens },
    smoothingDays: HERO_SMOOTHING_DAYS,
  };
}
