import { describe, expect, test } from "bun:test";
import {
  FOCUSABLE_CHROME,
  isKeyboardReachableControl,
} from "./a11y";
import { PRIMARY_NAV } from "./nav";

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
          roleOrTag: "a",
          hasAccessibleName: item.label.length > 0,
          tabbable: true,
        }),
      ).toBe(true);
    }
  });

  test("theme control requires an accessible name when tabbable", () => {
    expect(
      isKeyboardReachableControl({
        roleOrTag: "button",
        hasAccessibleName: true,
        tabbable: true,
      }),
    ).toBe(true);
    expect(
      isKeyboardReachableControl({
        roleOrTag: "button",
        hasAccessibleName: false,
        tabbable: true,
      }),
    ).toBe(false);
  });
});
