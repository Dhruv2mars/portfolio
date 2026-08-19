import { describe, expect, test } from "bun:test";
import {
  formatZoneTime,
  handsPath,
  offsetLabel,
  zoneClock,
  zoneOffsetMinutes,
} from "./local-time";

/** 2026-08-19T09:15:00Z — a fixed instant, so none of this drifts. */
const AT = new Date("2026-08-19T09:15:00.000Z");

describe("the clock reads the author's wall time, not the reader's", () => {
  test("formats two digits and a meridiem", () => {
    expect(formatZoneTime("UTC", AT)).toBe("09:15 AM");
    expect(formatZoneTime("Asia/Kolkata", AT)).toBe("02:45 PM");
  });

  test("reports the wall-clock hour and minute in the zone", () => {
    expect(zoneClock("Asia/Kolkata", AT)).toEqual({ hour: 14, minute: 45 });
  });

  test("folds midnight to hour zero rather than twenty-four", () => {
    expect(zoneClock("UTC", new Date("2026-08-19T00:30:00.000Z")).hour).toBe(0);
  });

  test("measures the zone's offset from UTC, half-hours included", () => {
    expect(zoneOffsetMinutes("UTC", AT)).toBe(0);
    expect(zoneOffsetMinutes("Asia/Kolkata", AT)).toBe(330);
    expect(zoneOffsetMinutes("America/Los_Angeles", AT)).toBe(-420);
  });
});

describe("the offset is named the way a person would say it", () => {
  test("keeps the minutes a whole-hour reading would drop", () => {
    expect(offsetLabel(330)).toBe("5h 30m ahead");
  });

  test("says only the hours when there are no minutes", () => {
    expect(offsetLabel(-180)).toBe("3h behind");
  });

  test("says only the minutes when there is no hour", () => {
    expect(offsetLabel(45)).toBe("45m ahead");
  });

  test("names no distance at all when there is none", () => {
    expect(offsetLabel(0)).toBe("same time");
  });
});

describe("the hands point where the time says", () => {
  test("straight up at twelve o'clock sharp", () => {
    expect(handsPath(12, 0)).toBe("M8 8 L8 5.6 M8 8 L8 4");
  });

  test("hour hand carries the minutes rather than jumping", () => {
    const onTheHour = handsPath(3, 0);
    const halfPast = handsPath(3, 30);
    expect(halfPast).not.toBe(onTheHour);
    // Half past three: the minute hand is straight down.
    expect(halfPast.endsWith("L8 12")).toBe(true);
  });
});
