import { describe, expect, test } from "bun:test";
import { formatFigureDate, monthAbbreviation } from "@/lib/figure";

describe("activity dates", () => {
  test("dates read the same regardless of the runner's timezone", () => {
    expect(monthAbbreviation("2026-01-31")).toBe("Jan");
    expect(formatFigureDate("2026-08-15")).toBe("Sat, Aug 15, 2026");
  });

  test("a month abbreviation never slips across a boundary", () => {
    // Both ends of a month, in a runner an hour either side of UTC.
    expect(monthAbbreviation("2026-03-01")).toBe("Mar");
    expect(monthAbbreviation("2026-12-31")).toBe("Dec");
  });
});
