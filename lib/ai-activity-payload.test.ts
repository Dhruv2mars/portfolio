import { describe, expect, test } from "bun:test";
import {
  calendarDateInTimeZone,
  isAiActivityPayload,
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

  test("isAiActivityPayload rejects empty, oversized, duplicate, or bad timezone", () => {
    expect(
      isAiActivityPayload({
        version: 1,
        generatedAt: "2026-07-17T00:00:00.000Z",
        timezone: "Asia/Kolkata",
        days: [],
        lifetimeTokens: 0,
      }),
    ).toBe(false);

    expect(
      isAiActivityPayload({
        version: 1,
        generatedAt: "2026-07-17T00:00:00.000Z",
        timezone: "Not/AZone",
        days: [{ date: "2026-07-16", tokens: 10 }],
        lifetimeTokens: 10,
      }),
    ).toBe(false);

    expect(
      isAiActivityPayload({
        version: 1,
        generatedAt: "2026-07-17T00:00:00.000Z",
        timezone: "Asia/Kolkata",
        days: [
          { date: "2026-07-16", tokens: 10 },
          { date: "2026-07-16", tokens: 1 },
        ],
        lifetimeTokens: 11,
      }),
    ).toBe(false);

    expect(
      isAiActivityPayload({
        version: 1,
        generatedAt: "2026-07-17T00:00:00.000Z",
        timezone: "Asia/Kolkata",
        days: [{ date: "2026-07-16", tokens: 10 }],
        lifetimeTokens: 10,
      }),
    ).toBe(true);
  });
});
