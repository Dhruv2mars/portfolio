import { describe, expect, test } from "bun:test";
import {
  calendarDateInTimeZone,
  dayFractionElapsed,
  projectTodayTokens,
  sevenDayMinBaseline,
  yesterdayInTimeZone,
} from "./ai-activity-payload";

describe("AI Activity payload helpers", () => {
  test("calendarDateInTimeZone formats en-CA style dates", () => {
    const d = new Date("2026-07-16T20:00:00+05:30");
    expect(calendarDateInTimeZone(d, "Asia/Kolkata")).toBe("2026-07-16");
  });

  test("yesterdayInTimeZone crosses midnight in the site timezone", () => {
    const d = new Date("2026-07-17T01:00:00+05:30");
    expect(yesterdayInTimeZone(d, "Asia/Kolkata")).toBe("2026-07-16");
  });

  test("sevenDayMinBaseline uses the minimum of the last 7 positive days", () => {
    const days = [
      { date: "2026-07-10", tokens: 50 },
      { date: "2026-07-11", tokens: 40 },
      { date: "2026-07-12", tokens: 0 },
      { date: "2026-07-13", tokens: 20 },
      { date: "2026-07-14", tokens: 30 },
      { date: "2026-07-15", tokens: 25 },
      { date: "2026-07-16", tokens: 60 },
    ];
    // last 7 with tokens>0 before 07-17: 50,40,20,30,25,60 → min 20
    expect(sevenDayMinBaseline(days, "2026-07-17")).toBe(20);
  });

  test("projectTodayTokens scales the 7-day min by elapsed day fraction", () => {
    const days = [
      { date: "2026-07-10", tokens: 100 },
      { date: "2026-07-11", tokens: 80 },
      { date: "2026-07-12", tokens: 60 },
      { date: "2026-07-13", tokens: 40 },
      { date: "2026-07-14", tokens: 90 },
      { date: "2026-07-15", tokens: 70 },
      { date: "2026-07-16", tokens: 50 },
    ];
    // noon IST ≈ 0.5 of day
    const noon = new Date("2026-07-17T12:00:00+05:30");
    const projection = projectTodayTokens(days, noon, "Asia/Kolkata");
    expect(projection.date).toBe("2026-07-17");
    expect(projection.baseline).toBe(40);
    const fraction = dayFractionElapsed(noon, "Asia/Kolkata");
    expect(projection.tokens).toBe(Math.round(40 * fraction));
  });
});
