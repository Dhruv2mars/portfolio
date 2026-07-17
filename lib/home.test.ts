import { describe, expect, test } from "bun:test";
import { PRIMARY_NAV } from "./nav";
import { site } from "./site";
import {
  HOME_SHELL_ORDER,
  composeHomeContentSections,
  type HomeCompositionInput,
} from "./home";

describe("Home composition", () => {
  test("shell order is intro → AI Activity → selected Projects → Writings → footer", () => {
    expect(HOME_SHELL_ORDER).toEqual([
      "intro",
      "ai-activity",
      "selected-projects",
      "writings",
      "footer",
    ]);
  });

  test("content sections keep shell order and always include intro + AI Activity", () => {
    const input: HomeCompositionInput = {
      selectedProjectCount: 5,
      publishedPostCount: 2,
    };

    expect(composeHomeContentSections(input)).toEqual([
      "intro",
      "ai-activity",
      "selected-projects",
      "writings",
    ]);
  });

  test("omits Writings from Home content when no published Posts", () => {
    expect(
      composeHomeContentSections({
        selectedProjectCount: 5,
        publishedPostCount: 0,
      }),
    ).toEqual(["intro", "ai-activity", "selected-projects"]);
  });

  test("omits selected Projects when curation is empty", () => {
    expect(
      composeHomeContentSections({
        selectedProjectCount: 0,
        publishedPostCount: 1,
      }),
    ).toEqual(["intro", "ai-activity", "writings"]);
  });

  test("Visitor path language avoids Blog and dashboard copy", () => {
    const labels = [
      ...PRIMARY_NAV.map((item) => item.label),
      site.positioning,
      "Selected Projects",
      "Latest Writings",
      "AI Activity",
    ].join(" ");

    expect(labels).not.toMatch(/\bBlog\b/i);
    expect(labels).not.toMatch(/\bdashboard\b/i);
    expect(labels).not.toMatch(/\bArticles\b/i);
    expect(PRIMARY_NAV.some((item) => item.label === "Writings")).toBe(true);
  });
});
