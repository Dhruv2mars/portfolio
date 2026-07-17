import { describe, expect, test } from "bun:test";
import { resolveTheme } from "./theme";

describe("resolveTheme", () => {
  test("follows system preference when there is no override", () => {
    expect(resolveTheme("light", null)).toBe("light");
    expect(resolveTheme("dark", null)).toBe("dark");
  });

  test("persisted override wins over system preference", () => {
    expect(resolveTheme("dark", "light")).toBe("light");
    expect(resolveTheme("light", "dark")).toBe("dark");
  });
});
