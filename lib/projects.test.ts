import { describe, expect, it } from "vitest";
import {
  listIndexProjects,
  listSelectedProjects,
  projectsCatalog,
  toIndexRow,
  type Project,
} from "./projects";

const withStill: Project = {
  slug: "with-still",
  title: "With Still",
  lede: "Has a thumbnail.",
  href: "https://example.com/with-still",
  stillSrc: "/projects/with-still.svg",
};

const withoutStill: Project = {
  slug: "without-still",
  title: "Without Still",
  lede: "Missing a thumbnail.",
  href: "https://example.com/without-still",
};

const selectedWithStill: Project = {
  ...withStill,
  slug: "selected",
  title: "Selected",
  stillSrc: "/projects/selected.svg",
  selected: true,
};

describe("Projects catalog", () => {
  it("maps a Project with a still into an index row with title, lede, link, and still", () => {
    expect(toIndexRow(withStill)).toEqual({
      title: "With Still",
      lede: "Has a thumbnail.",
      href: "https://example.com/with-still",
      stillSrc: "/projects/with-still.svg",
    });
  });

  it("returns null for a Project without a still — it stays off the index", () => {
    expect(toIndexRow(withoutStill)).toBeNull();
  });

  it("lists only Projects that have a still thumbnail", () => {
    const rows = listIndexProjects([withStill, withoutStill, selectedWithStill]);
    expect(rows).toHaveLength(2);
    expect(rows.every((row) => Boolean(row.stillSrc))).toBe(true);
    expect(rows.map((row) => row.title)).toEqual(["With Still", "Selected"]);
  });

  it("exposes a selected subset that still requires a still thumbnail", () => {
    const rows = listSelectedProjects([
      withStill,
      withoutStill,
      selectedWithStill,
      {
        ...withoutStill,
        slug: "selected-no-still",
        title: "Selected No Still",
        selected: true,
      },
    ]);
    expect(rows).toEqual([
      {
        title: "Selected",
        lede: "Has a thumbnail.",
        href: "https://example.com/with-still",
        stillSrc: "/projects/selected.svg",
      },
    ]);
  });

  it("ships a curated catalog where every index-visible Project has a still", () => {
    const rows = listIndexProjects(projectsCatalog);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((row) => row.stillSrc.length > 0)).toBe(true);
    expect(rows.every((row) => row.title && row.lede && row.href)).toBe(true);
  });

  it("exposes at least one selected Project for Home", () => {
    const selected = listSelectedProjects(projectsCatalog);
    expect(selected.length).toBeGreaterThan(0);
    expect(selected.every((row) => Boolean(row.stillSrc))).toBe(true);
  });
});
