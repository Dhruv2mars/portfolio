import { describe, expect, test } from "bun:test";
import {
  getProjects,
  getSelectedProjects,
  PROJECT_NAMES,
} from "./projects";

const REQUIRED_NAMES = [
  "GridFall",
  "Project-r",
  "Cinemasketch",
  "SuperChant",
  "Detox",
  "Offdex",
  "Gunmetal",
  "MDV",
] as const;

const DEFAULT_HOME_SELECTION = [
  "Project-r",
  "Offdex",
  "Gunmetal",
  "Cinemasketch",
  "GridFall",
] as const;

describe("Projects read model", () => {
  test("index includes every shipped Project with required fields", () => {
    const projects = getProjects();
    const names = projects.map((p) => p.name);

    expect(names).toEqual([...REQUIRED_NAMES]);
    expect(PROJECT_NAMES).toEqual([...REQUIRED_NAMES]);

    for (const project of projects) {
      expect(project.name.length).toBeGreaterThan(0);
      expect(project.description.length).toBeGreaterThan(0);
      expect(project.url).toMatch(/^https:\/\//);
      if (project.year !== undefined) {
        expect(project.year).toBeGreaterThanOrEqual(2000);
      }
    }
  });

  test("preserves outbound urls for each Project", () => {
    const byName = Object.fromEntries(
      getProjects().map((p) => [p.name, p.url]),
    );

    expect(byName["GridFall"]).toBe("https://github.com/Dhruv2mars/GridFall");
    expect(byName["Project-r"]).toBe("https://github.com/Dhruv2mars/project-r");
    expect(byName["Cinemasketch"]).toBe(
      "https://github.com/Dhruv2mars/cinemasketch",
    );
    expect(byName["SuperChant"]).toBe(
      "https://github.com/Dhruv2mars/superchant",
    );
    expect(byName["Detox"]).toBe("https://github.com/Dhruv2mars/detox");
    expect(byName["Offdex"]).toBe("https://github.com/Dhruv2mars/offdex");
    expect(byName["Gunmetal"]).toBe("https://github.com/Dhruv2mars/gunmetal");
    expect(byName["MDV"]).toBe("https://github.com/Dhruv2mars/mdv");
  });

  test("selected curation defaults to the Home proof set in order", () => {
    const selected = getSelectedProjects();
    expect(selected.map((p) => p.name)).toEqual([...DEFAULT_HOME_SELECTION]);

    for (const project of selected) {
      expect(project.selected).toBe(true);
      expect(project.url).toMatch(/^https:\/\//);
    }

    const unselected = getProjects().filter((p) => !p.selected);
    expect(unselected.map((p) => p.name)).toEqual([
      "SuperChant",
      "Detox",
      "MDV",
    ]);
  });
});
