import { describe, expect, test } from "bun:test";
import {
  buildDailySeries,
  formatCompactTokens,
  formatTokenCount,
} from "./ai-activity";

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
