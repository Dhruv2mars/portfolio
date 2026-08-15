import { describe, expect, test } from "bun:test";
import { paletteItems } from "@/lib/palette";
import { PROJECT_NAMES } from "@/lib/projects";

describe("command palette reaches everything the Portfolio has", () => {
  test("ids are unique so React keys and activedescendant stay sound", () => {
    const ids = paletteItems(true).map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every Project is reachable", () => {
    const labels = paletteItems(false).map((item) => item.label);
    for (const name of PROJECT_NAMES) {
      expect(labels).toContain(name);
    }
  });

  test("Blog is listed only when a Post is published", () => {
    expect(paletteItems(false).some((i) => i.href === "/blog")).toBe(false);
    expect(paletteItems(true).some((i) => i.href === "/blog")).toBe(true);
  });

  test("every entry either navigates or acts, never neither", () => {
    for (const item of paletteItems(true)) {
      expect(Boolean(item.href) || Boolean(item.action)).toBe(true);
    }
  });
});
