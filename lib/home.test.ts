import { describe, expect, test } from "bun:test";
import { PRIMARY_NAV } from "./nav";
import { site } from "./site";
import {
  HOME_SECTION_COPY,
  HOME_SHELL_ORDER,
  composeHomeContentSections,
  type HomeCompositionInput,
} from "./home";

describe("Home composition", () => {
  test("shell order is intro → AI Activity → selected Projects → Blog → footer", () => {
    expect(HOME_SHELL_ORDER).toEqual([
      "intro",
      "ai-activity",
      "selected-projects",
      "blog",
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
      "blog",
    ]);
  });

  test("omits Blog from Home content when no published Posts", () => {
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
    ).toEqual(["intro", "ai-activity", "blog"]);
  });

  test("Visitor-facing language stays editorial, not dashboard copy", () => {
    const sectionTitles = Object.values(HOME_SECTION_COPY).filter(
      (title): title is string => title !== null,
    );
    const labels = [
      ...PRIMARY_NAV.map((item) => item.label),
      site.positioning,
      ...sectionTitles,
    ].join(" ");

    expect(labels).not.toMatch(/\bdashboard\b/i);
    expect(labels).not.toMatch(/\bArticles\b/i);
    expect(PRIMARY_NAV.some((item) => item.label === "Blog")).toBe(true);
    expect(HOME_SECTION_COPY.blog).toBe("Latest Posts");
    expect(HOME_SECTION_COPY["selected-projects"]).toBe("Selected Projects");
    expect(HOME_SECTION_COPY["ai-activity"]).toBe("AI Activity");
  });
});
