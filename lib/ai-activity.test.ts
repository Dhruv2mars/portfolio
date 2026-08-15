import { describe, expect, test } from "bun:test";
import {
  ACTIVITY_WINDOW_DAYS,
  buildAiActivity,
  dayFractionElapsed,
  fillSparseDailySeries,
  intensityFromTokens,
  materializeAiActivity,
  materializeHistory,
  projectTodayTokens,
  sevenDayMinBaseline,
  withLiveToday,
  type DailyTokens,
} from "./ai-activity";
import { shiftYmd, type AiActivityPayload } from "./ai-activity-payload";

const FIXTURE: readonly DailyTokens[] = [
  { date: "2026-01-01", tokens: 0 },
  { date: "2026-01-02", tokens: 1_200 },
  { date: "2026-01-03", tokens: 8_500 },
  { date: "2026-01-04", tokens: 25_000 },
  { date: "2026-01-05", tokens: 80_000 },
];

describe("AI Activity read model", () => {
  test("maps intensity relative to the densest day in the series", () => {
    const activity = buildAiActivity(FIXTURE);
    expect(activity.days.map((d) => d.intensity)).toEqual([0, 1, 1, 2, 4]);
  });

  test("lifetime summary prefers payload lifetime when provided", () => {
    const activity = buildAiActivity(FIXTURE, { lifetimeTokens: 9_999_999 });
    expect(activity.lifetimeTokens).toBe(9_999_999);
  });

  test("lifetime summary falls back to series sum", () => {
    const activity = buildAiActivity(FIXTURE);
    expect(activity.lifetimeTokens).toBe(1_200 + 8_500 + 25_000 + 80_000);
  });

  test("relative intensity buckets by ratio to max", () => {
    expect(intensityFromTokens(0, 100)).toBe(0);
    expect(intensityFromTokens(25, 100)).toBe(1);
    expect(intensityFromTokens(50, 100)).toBe(2);
    expect(intensityFromTokens(75, 100)).toBe(3);
    expect(intensityFromTokens(100, 100)).toBe(4);
  });

  test("fillSparseDailySeries zero-fills calendar gaps", () => {
    const filled = fillSparseDailySeries(
      [
        { date: "2026-01-01", tokens: 10 },
        { date: "2026-01-03", tokens: 30 },
      ],
      "2026-01-03",
      3,
    );
    expect(filled).toEqual([
      { date: "2026-01-01", tokens: 10 },
      { date: "2026-01-02", tokens: 0 },
      { date: "2026-01-03", tokens: 30 },
    ]);
  });

  test("materializeHistory + withLiveToday appends projected today", () => {
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
    const history = materializeHistory(payload);
    expect(history.days.at(-1)?.date).toBe("2026-07-16");
    expect(history.lifetimeTokens).toBe(490);

    const activity = withLiveToday(history, noon);
    const today = activity.days.at(-1);
    expect(today?.date).toBe("2026-07-17");
    expect(today?.live).toBe(true);
    expect(today?.tokens).toBeGreaterThan(0);
    expect(today?.tokens).toBeLessThanOrEqual(40);
    // Lifetime stays published nightly total (excludes synthetic today).
    expect(activity.lifetimeTokens).toBe(490);
  });

  test("a stale payload is zero-filled up to today, never skipped", () => {
    const payload: AiActivityPayload = {
      version: 1,
      generatedAt: "2026-07-17T00:20:00.000Z",
      timezone: "Asia/Kolkata",
      days: [
        { date: "2026-07-15", tokens: 70 },
        { date: "2026-07-16", tokens: 50 },
      ],
      lifetimeTokens: 120,
    };
    // A month after the last nightly sync.
    const noon = new Date("2026-08-15T12:00:00+05:30");
    const activity = withLiveToday(materializeHistory(payload), noon);

    const dates = activity.days.map((d) => d.date);
    expect(dates.at(-1)).toBe("2026-08-15");
    expect(dates.at(0)).toBe(shiftYmd("2026-08-15", -(dates.length - 1)));
    // Consecutive calendar days, no jump across the outage.
    for (let i = 1; i < dates.length; i += 1) {
      expect(shiftYmd(dates[i - 1]!, 1)).toBe(dates[i]!);
    }
    // The outage reads as silence, not as activity.
    const outage = activity.days.filter(
      (d) => d.date > "2026-07-16" && d.date < "2026-08-15",
    );
    expect(outage.length).toBe(29);
    expect(outage.every((d) => d.tokens === 0 && d.intensity === 0)).toBe(true);
    // A month-old feed cannot project today — that would invent activity.
    expect(activity.days.some((d) => d.live)).toBe(false);
    expect(activity.days.at(-1)?.tokens).toBe(0);
  });

  test("the display window never exceeds one year of cells", () => {
    const payload: AiActivityPayload = {
      version: 1,
      generatedAt: "2026-07-17T00:20:00.000Z",
      timezone: "Asia/Kolkata",
      days: [
        { date: "2024-01-01", tokens: 10 },
        { date: "2026-07-16", tokens: 50 },
      ],
      lifetimeTokens: 60,
    };
    const activity = materializeAiActivity(
      payload,
      new Date("2026-08-15T12:00:00+05:30"),
    );
    expect(activity.days.length).toBeLessThanOrEqual(ACTIVITY_WINDOW_DAYS);
    expect(activity.days.at(-1)?.date).toBe("2026-08-15");
  });

  test("materializeAiActivity can omit live today for SSR", () => {
    const payload: AiActivityPayload = {
      version: 1,
      generatedAt: "2026-07-17T00:20:00.000Z",
      timezone: "Asia/Kolkata",
      days: [{ date: "2026-07-16", tokens: 50 }],
      lifetimeTokens: 50,
    };
    const noon = new Date("2026-07-17T12:00:00+05:30");
    const activity = materializeAiActivity(payload, noon, {
      includeLiveToday: false,
    });
    expect(activity.days.at(-1)?.date).toBe("2026-07-16");
    expect(activity.days.some((d) => d.live)).toBe(false);
    expect(activity.lifetimeTokens).toBe(50);
  });

  test("materialize fills sparse history so weekdays stay aligned", () => {
    const payload: AiActivityPayload = {
      version: 1,
      generatedAt: "2026-07-17T00:20:00.000Z",
      timezone: "Asia/Kolkata",
      days: [
        { date: "2026-07-10", tokens: 10 },
        { date: "2026-07-16", tokens: 20 },
      ],
      lifetimeTokens: 30,
    };
    const activity = materializeAiActivity(payload, new Date(), {
      includeLiveToday: false,
    });
    const window = activity.days.slice(-7);
    expect(window.map((d) => d.date)).toEqual([
      "2026-07-10",
      "2026-07-11",
      "2026-07-12",
      "2026-07-13",
      "2026-07-14",
      "2026-07-15",
      "2026-07-16",
    ]);
    expect(window.map((d) => d.tokens)).toEqual([10, 0, 0, 0, 0, 0, 20]);
  });
});

describe("AI Activity projection helpers", () => {
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
    const noon = new Date("2026-07-17T12:00:00+05:30");
    const projection = projectTodayTokens(days, noon, "Asia/Kolkata");
    expect(projection.date).toBe("2026-07-17");
    expect(projection.baseline).toBe(40);
    const fraction = dayFractionElapsed(noon, "Asia/Kolkata");
    expect(projection.tokens).toBe(Math.round(40 * fraction));
  });
});
