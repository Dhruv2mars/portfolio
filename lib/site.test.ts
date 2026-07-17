import { describe, expect, it } from "vitest";
import { contactLinks, primaryNav } from "./site";

describe("Portfolio shell navigation", () => {
  it("exposes only Home, Writing, and Projects — no About or Activity", () => {
    expect(primaryNav.map((item) => item.label)).toEqual([
      "Home",
      "Writing",
      "Projects",
    ]);
    expect(primaryNav.map((item) => item.href)).toEqual([
      "/",
      "/writing",
      "/projects",
    ]);
  });

  it("exposes contact links for header and footer", () => {
    const labels = contactLinks.map((link) => link.label);
    expect(labels).toEqual(
      expect.arrayContaining(["Email", "X", "GitHub", "LinkedIn"]),
    );
    expect(contactLinks.every((link) => link.href.length > 0)).toBe(true);
  });
});
