import { describe, expect, test } from "bun:test";
import {
  buildCommands,
  filterCommands,
  groupCommands,
} from "@/lib/commands";

describe("buildCommands", () => {
  test("covers all three pages plus the core actions", () => {
    const items = buildCommands({ isDark: false });
    const ids = items.map((i) => i.id);
    expect(ids).toContain("home");
    expect(ids).toContain("writings");
    expect(ids).toContain("projects");
    expect(ids).toContain("copy-email");
    expect(ids).toContain("theme");
    expect(ids).toContain("source");
  });

  test("theme label flips with current theme", () => {
    const dark = buildCommands({ isDark: true }).find((i) => i.id === "theme");
    const light = buildCommands({ isDark: false }).find(
      (i) => i.id === "theme",
    );
    expect(dark?.label).toBe("Switch to light theme");
    expect(light?.label).toBe("Switch to dark theme");
  });

  test("mail-to email social is excluded — copy action owns Email", () => {
    const items = buildCommands({ isDark: false });
    expect(
      items.filter((i) => i.group === "Socials").map((i) => i.label),
    ).not.toContain("Email");
    const copy = items.find((i) => i.id === "copy-email");
    expect(copy?.action).toEqual({
      type: "copy",
      text: "Dhruv2mars@gmail.com",
      doneLabel: "Email copied",
    });
  });

  test("navigate items carry hrefs", () => {
    const items = buildCommands({ isDark: false });
    for (const item of items) {
      if (item.action.type === "navigate") {
        expect(item.action.href.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("filterCommands", () => {
  const items = buildCommands({ isDark: false });

  test("empty query returns everything", () => {
    expect(filterCommands(items, "")).toHaveLength(items.length);
    expect(filterCommands(items, "   ")).toHaveLength(items.length);
  });

  test("matches by label, case-insensitive", () => {
    const out = filterCommands(items, "WRITINGS");
    expect(out.map((i) => i.id)).toEqual(["writings"]);
  });

  test("matches by keyword", () => {
    const out = filterCommands(items, "dark");
    expect(out.map((i) => i.id)).toContain("theme");
  });

  test("unknown query yields no items", () => {
    expect(filterCommands(items, "xylophone")).toHaveLength(0);
  });
});

describe("groupCommands", () => {
  test("groups in stable order and drops empty groups", () => {
    const items = buildCommands({ isDark: false });
    const groups = groupCommands(items);
    expect(groups.map((g) => g.group)).toEqual([
      "Navigate",
      "Actions",
      "Socials",
    ]);

    const onlyProjects = filterCommands(items, "projects");
    const filtered = groupCommands(onlyProjects);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]!.group).toBe("Navigate");
  });
});
