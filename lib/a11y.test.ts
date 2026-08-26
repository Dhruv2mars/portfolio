import { describe, expect, test } from "bun:test";
import { FOCUSABLE_CHROME } from "./a11y";
import { navItems } from "./nav";
import { getProjects } from "./projects";

describe("keyboard chrome", () => {
  test("exposes skip-to-content and main landmark ids", () => {
    expect(FOCUSABLE_CHROME.skipToContentHref).toBe("#main-content");
    expect(FOCUSABLE_CHROME.mainContentId).toBe("main-content");
    expect(FOCUSABLE_CHROME.primaryNavLabel).toBe("Primary");
  });

  test("Primary nav items are named links with real hrefs", () => {
    for (const item of navItems(true)) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.href.startsWith("/")).toBe(true);
    }
  });

  test("Project links expose a name and an outbound url", () => {
    for (const project of getProjects()) {
      expect(project.name.length).toBeGreaterThan(0);
      expect(project.url).toMatch(/^https:\/\//);
    }
  });
});
