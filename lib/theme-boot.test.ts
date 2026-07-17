import { describe, expect, it } from "vitest";
import { themeBootScript } from "@/lib/theme-boot";
import { THEME_STORAGE_KEY } from "@/lib/theme";

describe("themeBootScript", () => {
  it("embeds the storage key and dark fallback", () => {
    const script = themeBootScript();
    expect(script).toContain(THEME_STORAGE_KEY);
    expect(script).toContain('(s||"dark")');
    expect(script).toContain("prefers-color-scheme");
  });
});
