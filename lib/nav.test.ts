import { describe, expect, test } from "bun:test";
import { activeSectionId, HOME_SECTIONS, navItems } from "@/lib/nav";

describe("navigation shows only what exists", () => {
  test("Blog is absent until a Post is published", () => {
    const items = navItems(false);
    expect(items.map((item) => item.label)).not.toContain("Blog");
    expect(items.map((item) => item.section)).toEqual([...HOME_SECTIONS]);
  });

  test("Blog appears the moment a Post exists", () => {
    expect(navItems(true).map((item) => item.label)).toContain("Blog");
  });

  test("Home sections are in-page anchors, routes are not", () => {
    for (const item of navItems(true)) {
      if (item.section) {
        expect(item.href).toBe(`/#${item.section}`);
      } else {
        expect(item.href.startsWith("/#")).toBe(false);
      }
    }
  });
});

describe("the nav marks the section a reader is actually in", () => {
  const sections = [
    { id: "activity", top: 600 },
    { id: "work", top: 1400 },
  ];

  test("nothing is current above the first section", () => {
    expect(activeSectionId(sections, 0)).toBe(null);
    expect(activeSectionId(sections, 599)).toBe(null);
  });

  test("a section becomes current the moment its top passes", () => {
    expect(activeSectionId(sections, 600)).toBe("activity");
    expect(activeSectionId(sections, 1399)).toBe("activity");
    expect(activeSectionId(sections, 1400)).toBe("work");
  });

  test("the last section wins at the foot of the page, however short", () => {
    // Scrolled nowhere near `work`, but there is no more page to scroll.
    expect(activeSectionId(sections, 700, true)).toBe("work");
  });

  test("a page with no sections has nothing to mark", () => {
    expect(activeSectionId([], 0)).toBe(null);
    expect(activeSectionId([], 999, true)).toBe(null);
  });
});
