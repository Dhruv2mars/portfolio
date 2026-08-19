import { describe, expect, test } from "bun:test";
import {
  buildActivityWeeks,
  formatActivityDate,
  monthAbbreviation,
  weekdayIndex,
} from "@/lib/activity-grid";
import type { ActivityDay } from "@/lib/ai-activity";
import { buildDailySeries } from "@/lib/ai-activity";
import { shiftYmd } from "@/lib/ai-activity-payload";

/** A quiet window of the given length: layout is what is under test here. */
function series(endDate: string, days: number): ActivityDay[] {
  const start = shiftYmd(endDate, -(days - 1));
  return buildDailySeries([], start, endDate).map((day) => ({
    ...day,
    intensity: 0,
  }));
}

describe("activity grid layout", () => {
  test("weekday index is Sunday-based and timezone-stable", () => {
    expect(weekdayIndex("2026-08-16")).toBe(0); // Sunday
    expect(weekdayIndex("2026-08-15")).toBe(6); // Saturday
  });

  test("every column is exactly seven slots tall", () => {
    const weeks = buildActivityWeeks(series("2026-08-15", 365));
    for (const week of weeks) {
      expect(week.cells.length).toBe(7);
    }
  });

  test("padding lands only at the two ends", () => {
    const weeks = buildActivityWeeks(series("2026-08-15", 365));
    const flat = weeks.flatMap((week) => week.cells);
    const first = flat.findIndex(Boolean);
    const last = flat.length - 1 - [...flat].reverse().findIndex(Boolean);
    expect(flat.slice(first, last + 1).every(Boolean)).toBe(true);
    expect(flat.filter(Boolean).length).toBe(365);
  });

  test("days stay in order and start on their real weekday", () => {
    const weeks = buildActivityWeeks(series("2026-08-15", 365));
    const days = weeks.flatMap((w) => w.cells).filter(Boolean) as ActivityDay[];
    expect(days.at(-1)!.date).toBe("2026-08-15");
    expect(weeks[0]!.cells.findIndex(Boolean)).toBe(
      weekdayIndex(days[0]!.date),
    );
  });

  test("a month is labelled at most once, never on the last column", () => {
    const weeks = buildActivityWeeks(series("2026-08-15", 365));
    const labelled = weeks.flatMap((week) =>
      week.monthLabel ? [week.cells.find(Boolean)!.date.slice(0, 7)] : [],
    );
    expect(new Set(labelled).size).toBe(labelled.length);
    expect(labelled.length).toBeGreaterThanOrEqual(11);
    expect(weeks.at(-1)!.monthLabel).toBeUndefined();
  });

  test("the first month is labelled even when its week opens on a stub", () => {
    // 2026-01-01 is a Thursday, so week 0 is three empty slots and then Jan.
    const weeks = buildActivityWeeks(
      buildDailySeries([], "2026-01-01", "2026-03-01").map((day) => ({
        ...day,
        intensity: 0 as const,
      })),
    );
    expect(weeks[0]!.cells[0]).toBeNull();
    expect(weeks[0]!.monthLabel).toBe("Jan");
  });

  test("an empty series produces no columns", () => {
    expect(buildActivityWeeks([])).toEqual([]);
  });

  test("dates read the same regardless of the runner's timezone", () => {
    expect(monthAbbreviation("2026-01-31")).toBe("Jan");
    expect(formatActivityDate("2026-08-15")).toBe("Sat, Aug 15, 2026");
  });
});
