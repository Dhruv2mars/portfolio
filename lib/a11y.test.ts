import { describe, expect, test } from "bun:test";
import { FOCUSABLE_CHROME, isKeyboardReachableControl } from "./a11y";
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
      expect(
        isKeyboardReachableControl({
          hasAccessibleName: item.label.length > 0,
          tabbable: true,
        }),
      ).toBe(true);
    }
  });

  test("theme control requires an accessible name when tabbable", () => {
    expect(
      isKeyboardReachableControl({
        hasAccessibleName: true,
        tabbable: true,
      }),
    ).toBe(true);
    expect(
      isKeyboardReachableControl({
        hasAccessibleName: false,
        tabbable: true,
      }),
    ).toBe(false);
  });

  test("Project links expose a name and an outbound url", () => {
    for (const project of getProjects()) {
      expect(
        isKeyboardReachableControl({
          hasAccessibleName: project.name.length > 0,
          tabbable: true,
        }),
      ).toBe(true);
      expect(project.url).toMatch(/^https:\/\//);
    }
  });
});
