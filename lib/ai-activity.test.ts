import { describe, expect, test } from "bun:test";
import {
  buildAiActivity,
  intensityFromTokens,
  materializeAiActivity,
  type DailyTokens,
} from "./ai-activity";
import type { AiActivityPayload } from "./ai-activity-payload";

const FIXTURE: readonly DailyTokens[] = [
  { date: "2026-01-01", tokens: 0 },
  { date: "2026-01-02", tokens: 1_200 },
  { date: "2026-01-03", tokens: 8_500 },
  { date: "2026-01-04", tokens: 25_000 },
  { date: "2026-01-05", tokens: 80_000 },
];

describe("AI Activity read model", () => {
  test("maps small fixtures with absolute intensity thresholds", () => {
    const small = FIXTURE.slice(0, 4);
    const activity = buildAiActivity(small);
    expect(activity.days.map((d) => d.intensity)).toEqual([0, 1, 2, 3]);
  });

  test("lifetime summary is the sum of series tokens", () => {
    const activity = buildAiActivity(FIXTURE);
    expect(activity.lifetimeTokens).toBe(1_200 + 8_500 + 25_000 + 80_000);
  });

  test("intensity thresholds are stable for small series", () => {
    expect(intensityFromTokens(0)).toBe(0);
    expect(intensityFromTokens(1)).toBe(1);
    expect(intensityFromTokens(5_000)).toBe(1);
    expect(intensityFromTokens(5_001)).toBe(2);
    expect(intensityFromTokens(20_000)).toBe(2);
    expect(intensityFromTokens(20_001)).toBe(3);
    expect(intensityFromTokens(50_000)).toBe(3);
    expect(intensityFromTokens(50_001)).toBe(4);
  });

  test("materializeAiActivity appends a live projected today cell", () => {
    const payload: AiActivityPayload = {
      version: 1,
      generatedAt: "2026-07-17T00:20:00.000Z",
      timezone: "Asia/Kolkata",
      days: [
        { date: "2026-07-10", tokens: 100 },
        { date: "2026-07-11", tokens: 80 },
        { date: "2026-07-12", tokens: 60 },
        { date: "2026-07-13", tokens: 40 },
        { date: "2026-07-14", tokens: 90 },
        { date: "2026-07-15", tokens: 70 },
        { date: "2026-07-16", tokens: 50 },
      ],
      lifetimeTokens: 490,
    };
    const noon = new Date("2026-07-17T12:00:00+05:30");
    const activity = materializeAiActivity(payload, noon, "fallback");
    const today = activity.days.at(-1);
    expect(today?.date).toBe("2026-07-17");
    expect(today?.live).toBe(true);
    expect(today?.tokens).toBeGreaterThan(0);
    expect(today?.tokens).toBeLessThanOrEqual(40);
  });
});
