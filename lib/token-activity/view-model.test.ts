import { describe, expect, it } from "vitest";
import { tokenActivityFixture } from "./fixtures";
import {
  buildTokenActivityViewModel,
  type TokenActivityDay,
} from "./view-model";

const sampleDays: readonly TokenActivityDay[] = [
  { date: "2026-01-01", tokens: 0 },
  { date: "2026-01-02", tokens: 12_000 },
  { date: "2026-01-03", tokens: 45_000 },
  { date: "2026-01-04", tokens: 8_000 },
  { date: "2026-01-05", tokens: 0 },
  { date: "2026-01-06", tokens: 90_000 },
  { date: "2026-01-07", tokens: 22_000 },
  { date: "2026-01-08", tokens: 15_000 },
  { date: "2026-01-09", tokens: 30_000 },
  { date: "2026-01-10", tokens: 5_000 },
  { date: "2026-01-11", tokens: 0 },
  { date: "2026-01-12", tokens: 40_000 },
  { date: "2026-01-13", tokens: 55_000 },
  { date: "2026-01-14", tokens: 18_000 },
];

describe("buildTokenActivityViewModel", () => {
  it("exposes stats, contribution cells, and a series for the selected range", () => {
    const model = buildTokenActivityViewModel(sampleDays, "daily");

    expect(model.range).toBe("daily");
    expect(model.stats.length).toBeGreaterThanOrEqual(3);
    expect(model.cells.length).toBe(sampleDays.length);
    expect(model.series.length).toBeGreaterThan(0);
    expect(model.cells.every((cell) => cell.intensity >= 0 && cell.intensity <= 4)).toBe(
      true,
    );
  });

  it("keeps grid cells day-grained while series re-buckets by range", () => {
    const daily = buildTokenActivityViewModel(sampleDays, "daily");
    const weekly = buildTokenActivityViewModel(sampleDays, "weekly");
    const cumulative = buildTokenActivityViewModel(sampleDays, "cumulative");

    expect(daily.cells).toEqual(weekly.cells);
    expect(weekly.cells).toEqual(cumulative.cells);

    expect(daily.series.map((p) => p.value)).toEqual([
      0, 12_000, 45_000, 8_000, 0, 90_000, 22_000, 15_000, 30_000, 5_000, 0,
      40_000, 55_000, 18_000,
    ]);
    expect(weekly.series.length).toBeLessThan(daily.series.length);
    expect(weekly.series.reduce((sum, p) => sum + p.value, 0)).toBe(
      daily.series.reduce((sum, p) => sum + p.value, 0),
    );

    const cumulativeValues = cumulative.series.map((p) => p.value);
    expect(cumulativeValues.at(-1)).toBe(340_000);
    for (let i = 1; i < cumulativeValues.length; i++) {
      expect(cumulativeValues[i]!).toBeGreaterThanOrEqual(cumulativeValues[i - 1]!);
    }
  });

  it("formats range-specific stats from the same fixture contract", () => {
    const daily = buildTokenActivityViewModel(sampleDays, "daily");
    const weekly = buildTokenActivityViewModel(sampleDays, "weekly");
    const cumulative = buildTokenActivityViewModel(sampleDays, "cumulative");

    expect(daily.stats.map((s) => s.label)).toEqual([
      "Last day",
      "7-day avg",
      "Active days",
    ]);
    expect(daily.stats[0]?.value).toBe("18K");

    expect(weekly.stats.map((s) => s.label)).toEqual([
      "This week",
      "Weekly avg",
      "Active weeks",
    ]);

    expect(cumulative.stats.map((s) => s.label)).toEqual([
      "Total tokens",
      "Active days",
      "Peak day",
    ]);
    expect(cumulative.stats[0]?.value).toBe("340K");
    expect(cumulative.stats[2]?.value).toBe("90K");
  });

  it("builds a demoable year-shaped fixture with non-trivial activity", () => {
    expect(tokenActivityFixture.length).toBeGreaterThanOrEqual(365);
    const model = buildTokenActivityViewModel(tokenActivityFixture, "cumulative");
    expect(model.cells.length).toBe(tokenActivityFixture.length);
    expect(model.cells.some((cell) => cell.intensity >= 3)).toBe(true);
    expect(model.cells.some((cell) => cell.intensity === 0)).toBe(true);
    expect(
      model.stats.find((s) => s.label === "Total tokens")?.value.length,
    ).toBeGreaterThan(0);
  });
});
