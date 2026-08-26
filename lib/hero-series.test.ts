import { describe, expect, test } from "bun:test";
import type { AiActivityPayload } from "@/lib/ai-activity-payload";
import {
  buildHeroSeries,
  HERO_SMOOTHING_DAYS,
  monthTicks,
  niceScale,
  smoothTriangular,
} from "@/lib/hero-series";

function payload(days: { date: string; tokens: number }[]): AiActivityPayload {
  return {
    version: 1,
    generatedAt: "2026-08-21T00:00:00.000Z",
    timezone: "Asia/Kolkata",
    days,
    lifetimeTokens: days.reduce((sum, day) => sum + day.tokens, 0),
  };
}

/** Noon UTC on a date, so the Asia/Kolkata calendar day is unambiguous. */
function at(date: string): Date {
  return new Date(`${date}T06:00:00.000Z`);
}

describe("smoothTriangular", () => {
  test("conserves mass, including at both ends", () => {
    const raw = [900, 0, 0, 120, 400, 0, 0, 0, 55, 700, 0, 12, 0, 0, 640];
    const smoothed = smoothTriangular(raw, HERO_SMOOTHING_DAYS);
    const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
    expect(sum(smoothed)).toBeCloseTo(sum(raw), 6);
  });

  test("does not fade the edges toward zero", () => {
    const flat = new Array(60).fill(100);
    const smoothed = smoothTriangular(flat, HERO_SMOOTHING_DAYS);
    for (const value of smoothed) expect(value).toBeCloseTo(100, 9);
  });

  test("never goes negative and never exceeds the peak", () => {
    const raw = [0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 0];
    const smoothed = smoothTriangular(raw, HERO_SMOOTHING_DAYS);
    for (const value of smoothed) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1000);
    }
  });

  test("an even window still centres on its day", () => {
    const raw = [0, 0, 0, 10, 0, 0, 0];
    const smoothed = smoothTriangular(raw, 6);
    expect(smoothed[2]).toBeCloseTo(smoothed[4]!, 9);
  });

  test("a window of one is the identity", () => {
    expect(smoothTriangular([3, 1, 4], 1)).toEqual([3, 1, 4]);
  });

  test("an empty series stays empty", () => {
    expect(smoothTriangular([], HERO_SMOOTHING_DAYS)).toEqual([]);
  });
});

describe("niceScale", () => {
  test("labels are round numbers off the ladder", () => {
    const { ticks } = niceScale(133_000_000);
    expect(ticks).toEqual([
      25_000_000, 50_000_000, 75_000_000, 100_000_000, 125_000_000,
    ]);
  });

  test("the top of the scale clears the peak without stranding it", () => {
    const { max } = niceScale(133_000_000);
    // A band, not a floor: the peak must reach most of the way up the plate
    // without being drawn against its top edge.
    expect(133_000_000 / max).toBeGreaterThan(0.88);
    expect(133_000_000 / max).toBeLessThan(0.94);
  });

  test("the label count stays near the target across magnitudes", () => {
    for (const peak of [37, 1_400, 158_000_000, 633_639_231, 9.4e11]) {
      const { ticks } = niceScale(peak);
      expect(ticks.length).toBeGreaterThanOrEqual(2);
      expect(ticks.length).toBeLessThanOrEqual(6);
    }
  });

  test("no label is drawn above the peak", () => {
    for (const peak of [1, 999, 12_345_678, 633_639_231]) {
      for (const tick of niceScale(peak).ticks) {
        expect(tick).toBeLessThanOrEqual(peak);
      }
    }
  });

  test("an empty year draws no labels", () => {
    expect(niceScale(0).ticks).toEqual([]);
    expect(niceScale(0).max).toBeGreaterThan(0);
  });
});

describe("buildHeroSeries", () => {
  const series = buildHeroSeries(
    payload([
      { date: "2025-11-30", tokens: 5_000 },
      { date: "2026-01-04", tokens: 120_000_000 },
      { date: "2026-03-15", tokens: 640_000_000 },
      { date: "2026-08-20", tokens: 300_000_000 },
    ]),
    at("2026-08-21"),
  );

  test("opens on January 1 and closes on the last measured day", () => {
    expect(series.from).toBe("2026-01-01");
    // Today is the 21st, but the record stops on the 20th. Drawing the 21st
    // as a zero would be a number nobody measured.
    expect(series.to).toBe("2026-08-20");
    expect(series.points[0]!.date).toBe("2026-01-01");
    expect(series.points.at(-1)!.date).toBe("2026-08-20");
  });

  test("every calendar day in the window has a point", () => {
    expect(series.points.length).toBe(232);
    expect(series.xDomain).toEqual([0, 231]);
  });

  test("a stale payload is not drawn as a run of zero days", () => {
    // A fixture checked in a week ago has no opinion about the last week.
    const stale = buildHeroSeries(
      payload([
        { date: "2026-02-01", tokens: 100_000_000 },
        { date: "2026-02-10", tokens: 200_000_000 },
      ]),
      at("2026-03-01"),
    );
    expect(stale.to).toBe("2026-02-10");
    expect(stale.points.at(-1)!.raw).toBe(200_000_000);
    // The tail is the record's own tail, not a smoothed slide into a zero
    // fortnight that the meter never reported.
    expect(stale.points.at(-1)!.value).toBeGreaterThan(0);
  });

  test("a measured zero inside the record is still drawn", () => {
    // Days the meter reported as zero are inside the record and stay in the
    // window; only days past its end are cropped.
    const quiet = buildHeroSeries(
      payload([
        { date: "2026-01-05", tokens: 50_000_000 },
        { date: "2026-01-20", tokens: 0 },
      ]),
      at("2026-01-31"),
    );
    expect(quiet.to).toBe("2026-01-20");
    expect(quiet.points).toHaveLength(20);
  });

  test("days outside this year are not counted", () => {
    expect(series.total).toBe(120_000_000 + 640_000_000 + 300_000_000);
  });

  test("a day the meter never mentioned is a measured zero", () => {
    expect(series.points[1]!.raw).toBe(0);
  });

  test("the peak is the measured day, not the smoothed one", () => {
    expect(series.peak).toEqual({ date: "2026-03-15", tokens: 640_000_000 });
  });

  test("the curve never invents a value above the record", () => {
    for (const point of series.points) {
      expect(point.value).toBeGreaterThanOrEqual(0);
      expect(point.value).toBeLessThanOrEqual(series.peak.tokens);
    }
  });

  test("the scale holds the whole curve", () => {
    const top = Math.max(...series.points.map((p) => p.value));
    expect(series.yDomain[0]).toBe(0);
    expect(series.yDomain[1]).toBeGreaterThan(top);
  });

  test("one label per month, centred on its own span", () => {
    expect(series.months.map((m) => m.label)).toEqual([
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
    ]);
    expect(series.months[0]!.day).toBe(15); // Jan 1–31, centred on the 16th
  });

  test("the closing month is centred on the days it has, not on 31", () => {
    const august = series.months.at(-1)!;
    expect(august.day).toBeLessThan(series.xDomain[1]);
    expect(august.day).toBeGreaterThan(series.xDomain[1] - 16);
  });

  test("the smoothing window is stated, not hidden", () => {
    expect(series.smoothingDays).toBe(HERO_SMOOTHING_DAYS);
  });

  test("a year with no record draws a frame, not a flat year of zeros", () => {
    const empty = buildHeroSeries(
      payload([{ date: "2025-06-01", tokens: 10 }]),
      at("2026-01-10"),
    );
    // Nothing has been measured this year, so the window is the one day it
    // opens on rather than ten days of invented zeros.
    expect(empty.to).toBe("2026-01-01");
    expect(empty.points.length).toBe(1);
    expect(empty.total).toBe(0);
    expect(empty.ticks).toEqual([]);
    expect(empty.yDomain[1]).toBeGreaterThan(0);
  });

  test("January 1 is a window of one day, not a division by zero", () => {
    const first = buildHeroSeries(payload([{ date: "2026-01-01", tokens: 7 }]), at("2026-01-01"));
    expect(first.points).toHaveLength(1);
    expect(first.points[0]!.value).toBe(7);
    expect(first.xDomain).toEqual([0, 1]);
  });
});

describe("monthTicks", () => {
  test("a single day is its own centre", () => {
    expect(
      monthTicks([{ day: 0, date: "2026-05-04", value: 0, raw: 0 }]),
    ).toEqual([{ day: 0, label: "May" }]);
  });
});
