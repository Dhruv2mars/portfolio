import { describe, expect, test } from "bun:test";
import { HOME_SECTIONS, navItems } from "@/lib/nav";

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
