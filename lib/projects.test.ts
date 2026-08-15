import { describe, expect, test } from "bun:test";
import { destinationHost, getProjects, PROJECT_NAMES } from "@/lib/projects";

describe("Projects are curated, not enumerated", () => {
  test("the list stays small enough to read in one pass", () => {
    expect(getProjects().length).toBeLessThanOrEqual(8);
    expect(new Set(PROJECT_NAMES).size).toBe(PROJECT_NAMES.length);
  });

  test("every Project has a real destination and a description", () => {
    for (const project of getProjects()) {
      expect(() => new URL(project.url)).not.toThrow();
      expect(project.url.startsWith("https://")).toBe(true);
      if (project.live) {
        expect(project.live.startsWith("https://")).toBe(true);
      }
      expect(project.description.length).toBeGreaterThan(20);
      expect(project.language.length).toBeGreaterThan(0);
    }
  });

  test("the hover destination is the host a click actually reaches", () => {
    const [relunar] = getProjects();
    expect(destinationHost(relunar!)).toBe("relunar.com");

    const npm = getProjects().find((p) => p.live?.includes("npmjs.com"));
    expect(npm && destinationHost(npm)).toBe("npmjs.com");
  });

  test("notes are facts, never vanity metrics", () => {
    for (const project of getProjects()) {
      if (!project.note) continue;
      expect(project.note).not.toMatch(/\d/);
    }
  });
});
