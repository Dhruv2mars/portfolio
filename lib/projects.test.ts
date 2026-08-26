import { describe, expect, test } from "bun:test";
import {
  destinationHost,
  getProjects,
  PROJECT_NAMES,
  searchProjects,
} from "@/lib/projects";

describe("Projects are curated, not enumerated", () => {
  test("the list stays small enough to read in one pass", () => {
    expect(getProjects().length).toBeLessThanOrEqual(8);
    expect(new Set(PROJECT_NAMES).size).toBe(PROJECT_NAMES.length);
  });

  test("the second tier carries the current shipped projects", () => {
    expect(PROJECT_NAMES.slice(4)).toEqual([
      "mdv",
      "weathercast",
      "superchant",
      "jvcode-cli",
    ]);
    expect(PROJECT_NAMES).not.toContain("mdv-ts");
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

  test("project sub-lines stay lowercase", () => {
    for (const project of getProjects()) {
      expect(project.description).toBe(project.description.toLowerCase());
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

describe("searchProjects", () => {
  const all = getProjects();

  test("an empty query is not a filter", () => {
    expect(searchProjects(all, "  ")).toHaveLength(all.length);
  });

  test("matches the language, which is what a visitor scans for", () => {
    const rust = searchProjects(all, "rust");
    expect(rust.length).toBeGreaterThan(0);
    expect(rust.every((p) => p.language === "Rust")).toBe(true);
  });

  test("matches the description, not only the name", () => {
    expect(searchProjects(all, "nowcasting").map((p) => p.name)).toEqual([
      "weathercast",
    ]);
  });

  test("a hyphen in the name need not be typed", () => {
    expect(searchProjects(all, "pi queue").map((p) => p.name)).toEqual([
      "pi-queue",
    ]);
  });

  test("matches the year, which is a number on the row", () => {
    expect(searchProjects(all, "2026")).toHaveLength(all.length);
  });

  test("no match is an empty list, never the whole list", () => {
    expect(searchProjects(all, "cobol")).toEqual([]);
  });
});
