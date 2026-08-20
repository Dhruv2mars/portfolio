import { describe, expect, test } from "bun:test";
import {
  ACTIVITY_WEEKS,
  activityWindowStart,
  buildAiActivity,
  buildDailySeries,
  formatCompactTokens,
  formatTokenCount,
  intensityFromTokens,
  materializeAiActivity,
  quartileThresholds,
  type DailyTokens,
} from "./ai-activity";
import {
  shiftYmd,
  weekdayIndex,
  type AiActivityPayload,
} from "./ai-activity-payload";

const FIXTURE: readonly DailyTokens[] = [
  { date: "2026-01-01", tokens: 0 },
  { date: "2026-01-02", tokens: 1_200 },
  { date: "2026-01-03", tokens: 8_500 },
  { date: "2026-01-04", tokens: 25_000 },
  { date: "2026-01-05", tokens: 80_000 },
];

/** `count` worked days at the head of a month, the rest of it silent. */
function workedMonth(month: string, count: number): DailyTokens[] {
  return Array.from({ length: count }, (_, i) => ({
    date: `${month}-${String(i + 1).padStart(2, "0")}`,
    tokens: 1_000 * (i + 1),
  }));
}

describe("intensity scale", () => {
  test("cuts at the quartiles of the days that had work in them", () => {
    // Zeros are the empty step, not a quarter of the scale, so they cannot
    // drag the cuts down.
    expect(quartileThresholds(FIXTURE)).toEqual([8_500, 25_000, 80_000]);
  });

  test("one huge day does not flatten the rest into one grey step", () => {
    const days = [
      ...Array.from({ length: 8 }, (_, i) => ({
        date: `2026-01-0${i + 1}`,
        tokens: (i + 1) * 1_000,
      })),
      { date: "2026-01-09", tokens: 400_000_000 },
    ];
    const thresholds = quartileThresholds(days);
    const levels = days.map((d) => intensityFromTokens(d.tokens, thresholds));
    // Every step is spent on days that exist, top step included.
    expect(new Set(levels)).toEqual(new Set([1, 2, 3, 4]));
  });

  test("a series with no work at all has no filled steps to hand out", () => {
    expect(quartileThresholds([{ date: "2026-01-01", tokens: 0 }])).toEqual([
      0, 0, 0,
    ]);
  });

  test("buckets are lower-inclusive and zero is always empty", () => {
    const thresholds = [10, 20, 30] as const;
    expect(intensityFromTokens(0, thresholds)).toBe(0);
    expect(intensityFromTokens(1, thresholds)).toBe(1);
    expect(intensityFromTokens(10, thresholds)).toBe(1);
    expect(intensityFromTokens(11, thresholds)).toBe(2);
    expect(intensityFromTokens(20, thresholds)).toBe(2);
    expect(intensityFromTokens(30, thresholds)).toBe(3);
    expect(intensityFromTokens(31, thresholds)).toBe(4);
  });
});

describe("daily series", () => {
  test("zero-fills calendar gaps inside the window", () => {
    expect(
      buildDailySeries(
        [
          { date: "2026-01-01", tokens: 10 },
          { date: "2026-01-03", tokens: 30 },
        ],
        "2026-01-01",
        "2026-01-03",
      ),
    ).toEqual([
      { date: "2026-01-01", tokens: 10 },
      { date: "2026-01-02", tokens: 0 },
      { date: "2026-01-03", tokens: 30 },
    ]);
  });

  test("spans both ends inclusively and stays consecutive across a month", () => {
    const series = buildDailySeries([], "2026-01-30", "2026-02-02");
    expect(series.map((d) => d.date)).toEqual([
      "2026-01-30",
      "2026-01-31",
      "2026-02-01",
      "2026-02-02",
    ]);
  });

  test("days outside the window are left out, not folded in", () => {
    const series = buildDailySeries(
      [
        { date: "2025-12-31", tokens: 99 },
        { date: "2026-01-02", tokens: 30 },
      ],
      "2026-01-01",
      "2026-01-02",
    );
    expect(series).toEqual([
      { date: "2026-01-01", tokens: 0 },
      { date: "2026-01-02", tokens: 30 },
    ]);
  });
});

describe("window", () => {
  test("opens on a Sunday, so every column is a whole week", () => {
    // 2026-08-19 is a Wednesday; its week opens on the 16th, and 52 Sundays
    // before that is 2025-08-17.
    expect(activityWindowStart("2026-08-19")).toBe("2025-08-17");
    expect(weekdayIndex(activityWindowStart("2026-08-19"))).toBe(0);
  });

  test("is the same width whatever day it is asked on", () => {
    const widths = new Set(
      Array.from({ length: 14 }, (_, i) => {
        const today = shiftYmd("2026-08-19", i);
        const start = activityWindowStart(today);
        return Math.round(
          (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) /
            86_400_000,
        );
      }),
    );
    // 52 whole weeks plus however much of this one has happened — 53 columns
    // on every day of the week, including Saturday.
    for (const days of widths) {
      expect(Math.ceil((days + 1) / 7)).toBe(ACTIVITY_WEEKS + 1);
    }
  });

  test("a shorter window is still Sunday-aligned", () => {
    // Wednesday 2026-08-19 sits in the week that opened on the 16th; four
    // Sundays before that is 2026-07-19.
    expect(activityWindowStart("2026-08-19", 4)).toBe("2026-07-19");
  });
});

describe("read model", () => {
  test("lifetime prefers the payload total over the drawn window", () => {
    expect(buildAiActivity(FIXTURE, { lifetimeTokens: 9_999_999 }).lifetimeTokens).toBe(
      9_999_999,
    );
  });

  test("lifetime falls back to the sum of the series", () => {
    expect(buildAiActivity(FIXTURE).lifetimeTokens).toBe(
      1_200 + 8_500 + 25_000 + 80_000,
    );
  });

  test("materialize ends on today in the payload's timezone", () => {
    const payload: AiActivityPayload = {
      version: 1,
      generatedAt: "2026-08-19T00:20:00.000Z",
      timezone: "Asia/Kolkata",
      days: [...workedMonth("2026-07", 20), ...workedMonth("2026-08", 15)],
      lifetimeTokens: 10_406_452_370,
    };
    const activity = materializeAiActivity(
      payload,
      new Date("2026-08-19T12:00:00+05:30"),
    );

    expect(activity.timezone).toBe("Asia/Kolkata");
    expect(activity.lifetimeTokens).toBe(10_406_452_370);
    // The window is the calendar, not the record: months before the habit are
    // drawn empty rather than cropped away.
    expect(activity.days.at(0)?.date).toBe(activityWindowStart("2026-08-19"));
    expect(activity.days.at(-1)?.date).toBe("2026-08-19");
    for (let i = 1; i < activity.days.length; i += 1) {
      expect(shiftYmd(activity.days[i - 1]!.date, 1)).toBe(activity.days[i]!.date);
    }
  });

  test("today is drawn empty until the nightly sync reaches it", () => {
    const payload: AiActivityPayload = {
      version: 1,
      generatedAt: "2026-08-19T00:20:00.000Z",
      timezone: "Asia/Kolkata",
      days: workedMonth("2026-08", 18),
      lifetimeTokens: 500,
    };
    const today = materializeAiActivity(
      payload,
      new Date("2026-08-19T12:00:00+05:30"),
    ).days.at(-1);
    // No projection, no live counter: an uncounted day counts zero.
    expect(today).toEqual({ date: "2026-08-19", tokens: 0, intensity: 0 });
  });

  test("the last cell follows the reader's timezone, not the runner's", () => {
    const payload: AiActivityPayload = {
      version: 1,
      generatedAt: "2026-08-19T00:20:00.000Z",
      timezone: "Asia/Kolkata",
      days: workedMonth("2026-08", 18),
      lifetimeTokens: 500,
    };
    // 19:00Z is already past midnight in New Delhi.
    const activity = materializeAiActivity(
      payload,
      new Date("2026-08-19T19:00:00Z"),
    );
    expect(activity.days.at(-1)?.date).toBe("2026-08-20");
  });

  test("a stale feed reads as silence, never as invented activity", () => {
    const payload: AiActivityPayload = {
      version: 1,
      generatedAt: "2026-07-17T00:20:00.000Z",
      timezone: "Asia/Kolkata",
      days: workedMonth("2026-07", 16),
      lifetimeTokens: 120,
    };
    // A month after the last nightly sync.
    const activity = materializeAiActivity(
      payload,
      new Date("2026-08-15T12:00:00+05:30"),
    );
    const outage = activity.days.filter((d) => d.date > "2026-07-16");
    expect(outage.length).toBe(30);
    expect(outage.every((d) => d.tokens === 0 && d.intensity === 0)).toBe(true);
    // The published lifetime is not rewritten by the outage.
    expect(activity.lifetimeTokens).toBe(120);
  });
});

describe("number formatting", () => {
  test("exact counts keep every digit", () => {
    expect(formatTokenCount(10_406_452_370)).toBe("10,406,452,370");
  });

  test("compact counts read as a magnitude", () => {
    expect(formatCompactTokens(10_406_452_370)).toBe("10.4B");
    expect(formatCompactTokens(512_000_000)).toBe("512M");
    expect(formatCompactTokens(84_240)).toBe("84.2K");
    expect(formatCompactTokens(999)).toBe("999");
    expect(formatCompactTokens(0)).toBe("0");
    expect(formatCompactTokens(1_000)).toBe("1K");
  });
});
