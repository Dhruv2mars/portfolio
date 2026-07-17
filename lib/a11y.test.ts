import { describe, expect, test } from "bun:test";
import {
  FOCUSABLE_CHROME,
  isKeyboardReachableControl,
} from "./a11y";
import { PRIMARY_NAV } from "./nav";
import { getSelectedProjects } from "./projects";
import { getLatestPublishedPosts } from "./writings";

describe("Editorial keyboard chrome", () => {
  test("exposes skip-to-content and main landmark ids", () => {
    expect(FOCUSABLE_CHROME.skipToContentHref).toBe("#main-content");
    expect(FOCUSABLE_CHROME.mainContentId).toBe("main-content");
    expect(FOCUSABLE_CHROME.primaryNavLabel).toBe("Primary");
  });

  test("Primary nav items are named links with real hrefs", () => {
    for (const item of PRIMARY_NAV) {
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

  test("selected Project links expose name and outbound url", () => {
    for (const project of getSelectedProjects()) {
      expect(
        isKeyboardReachableControl({
          hasAccessibleName: project.name.length > 0,
          tabbable: true,
        }),
      ).toBe(true);
      expect(project.url).toMatch(/^https:\/\//);
    }
  });

  test("published Post links expose title and writings href shape", () => {
    for (const post of getLatestPublishedPosts(3)) {
      expect(
        isKeyboardReachableControl({
          hasAccessibleName: post.title.length > 0,
          tabbable: true,
        }),
      ).toBe(true);
      expect(post.slug.length).toBeGreaterThan(0);
    }
  });
});
