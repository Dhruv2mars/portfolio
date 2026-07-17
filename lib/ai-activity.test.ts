import { describe, expect, test } from "bun:test";
import {
  buildAiActivity,
  intensityFromTokens,
  type DailyTokens,
} from "./ai-activity";

const FIXTURE: readonly DailyTokens[] = [
  { date: "2026-01-01", tokens: 0 },
  { date: "2026-01-02", tokens: 1_200 },
  { date: "2026-01-03", tokens: 8_500 },
  { date: "2026-01-04", tokens: 25_000 },
  { date: "2026-01-05", tokens: 80_000 },
];

describe("AI Activity read model", () => {
  test("maps fixture days to token intensities on a 0–4 scale", () => {
    const activity = buildAiActivity(FIXTURE);

    expect(activity.days).toHaveLength(5);
    expect(activity.days.map((d) => d.intensity)).toEqual([0, 1, 2, 3, 4]);
    expect(activity.days[2]).toEqual({
      date: "2026-01-03",
      tokens: 8_500,
      intensity: 2,
    });
  });

  test("lifetime summary is the sum of fixture tokens", () => {
    const activity = buildAiActivity(FIXTURE);
    expect(activity.lifetimeTokens).toBe(1_200 + 8_500 + 25_000 + 80_000);
  });

  test("intensity thresholds are stable for ingestion to reuse", () => {
    expect(intensityFromTokens(0)).toBe(0);
    expect(intensityFromTokens(1)).toBe(1);
    expect(intensityFromTokens(5_000)).toBe(1);
    expect(intensityFromTokens(5_001)).toBe(2);
    expect(intensityFromTokens(20_000)).toBe(2);
    expect(intensityFromTokens(20_001)).toBe(3);
    expect(intensityFromTokens(50_000)).toBe(3);
    expect(intensityFromTokens(50_001)).toBe(4);
  });
});
