import { expect, test } from "bun:test";
import { DEFAULT_THEME, nextTheme, resolveTheme } from "@/lib/theme";

test("dark is the default when no override is stored", () => {
  expect(resolveTheme(null)).toBe("dark");
  expect(DEFAULT_THEME).toBe("dark");
});

test("a manual override always wins", () => {
  expect(resolveTheme("light")).toBe("light");
  expect(resolveTheme("dark")).toBe("dark");
});

test("toggling alternates between exactly two schemes", () => {
  expect(nextTheme("dark")).toBe("light");
  expect(nextTheme("light")).toBe("dark");
  expect(nextTheme(nextTheme("dark"))).toBe("dark");
});
