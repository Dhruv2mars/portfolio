import { describe, expect, test } from "bun:test";
import { HOME_SECTIONS, navItems } from "@/lib/nav";

describe("navigation shows only what exists", () => {
  test("Blog is absent until a Post is published", () => {
    const labels = navItems(false).map((item) => item.label);
    expect(labels).not.toContain("blog");
    expect(labels).toEqual([...HOME_SECTIONS]);
  });

  test("Blog appears the moment a Post exists", () => {
    expect(navItems(true).map((item) => item.label)).toContain("blog");
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
