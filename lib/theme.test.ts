import { describe, expect, it } from "vitest";
import {
  cycleThemePreference,
  parseStoredTheme,
  resolveTheme,
  themeLabel,
} from "@/lib/theme";

describe("parseStoredTheme", () => {
  it("accepts light, dark, and system", () => {
    expect(parseStoredTheme("light")).toBe("light");
    expect(parseStoredTheme("dark")).toBe("dark");
    expect(parseStoredTheme("system")).toBe("system");
  });

  it("treats missing or unknown values as system", () => {
    expect(parseStoredTheme(null)).toBe("system");
    expect(parseStoredTheme("")).toBe("system");
    expect(parseStoredTheme("nope")).toBe("system");
  });
});

describe("resolveTheme", () => {
  it("follows prefers-color-scheme when preference is system", () => {
    expect(resolveTheme("system", "light")).toBe("light");
    expect(resolveTheme("system", "dark")).toBe("dark");
  });

  it("falls back to dark when system preference is unset", () => {
    expect(resolveTheme("system", null)).toBe("dark");
  });

  it("lets a manual preference override system", () => {
    expect(resolveTheme("light", "dark")).toBe("light");
    expect(resolveTheme("dark", "light")).toBe("dark");
  });
});

describe("cycleThemePreference", () => {
  it("cycles system → light → dark → system", () => {
    expect(cycleThemePreference("system")).toBe("light");
    expect(cycleThemePreference("light")).toBe("dark");
    expect(cycleThemePreference("dark")).toBe("system");
  });
});

describe("themeLabel", () => {
  it("names the preference for assistive labels", () => {
    expect(themeLabel("system")).toBe("System");
    expect(themeLabel("light")).toBe("Light");
    expect(themeLabel("dark")).toBe("Dark");
  });
});
