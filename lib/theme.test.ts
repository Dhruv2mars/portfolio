import { expect, test } from "bun:test";
import {
  DEFAULT_THEME,
  FALLBACK_SCHEME,
  nextTheme,
  resolveTheme,
} from "@/lib/theme";

test("dark is used by default and system resolution remains available", () => {
  expect(DEFAULT_THEME).toBe("dark");
  expect(resolveTheme(null, "light")).toBe("light");
  expect(resolveTheme("system", "light")).toBe("light");
  expect(resolveTheme("system", "dark")).toBe("dark");
});

test("a silent OS falls back to the primary design", () => {
  expect(resolveTheme(null)).toBe(FALLBACK_SCHEME);
  expect(resolveTheme("system", null)).toBe("dark");
});

test("a manual override always wins", () => {
  expect(resolveTheme("light", "dark")).toBe("light");
  expect(resolveTheme("dark", "light")).toBe("dark");
});

test("toggling alternates between exactly two schemes", () => {
  expect(nextTheme("dark")).toBe("light");
  expect(nextTheme("light")).toBe("dark");
  expect(nextTheme(nextTheme("dark"))).toBe("dark");
});
