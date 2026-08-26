import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  DEFAULT_THEME,
  FALLBACK_SCHEME,
  SCHEME_BACKGROUND,
  nextTheme,
  resolveTheme,
  type ColorScheme,
} from "@/lib/theme";

test("the OS is followed when nothing is stored", () => {
  expect(DEFAULT_THEME).toBe("system");
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

describe("SCHEME_BACKGROUND", () => {
  /**
   * `oklch(L C H)` to a `#rrggbb` string, by the spec's own matrices.
   *
   * The two numbers in `SCHEME_BACKGROUND` are a hand copy of two custom
   * properties in a stylesheet the type system cannot see, and the comment
   * above them says they must track it. That was a promise; this makes it a
   * gate. Converting is the only way to check it, because the stylesheet
   * writes the colour in `oklch` and the three consumers that need it —
   * `themeColor`, the `theme-color` tag, the manifest — can only take hex.
   */
  const oklchToHex = (L: number, C: number, H: number): string => {
    const hr = (H * Math.PI) / 180;
    const a = C * Math.cos(hr);
    const b = C * Math.sin(hr);

    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

    const linear = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];

    return (
      "#" +
      linear
        .map((v) => {
          const encoded =
            v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
          const byte = Math.round(Math.min(1, Math.max(0, encoded)) * 255);
          return byte.toString(16).padStart(2, "0");
        })
        .join("")
    );
  };

  /** The `--background` each scheme declares, read out of the stylesheet. */
  const declared = (): Record<ColorScheme, string> => {
    const css = readFileSync(
      new URL("../app/globals.css", import.meta.url),
      "utf8",
    );
    // `:root` is light and `.dark` is dark; take the first `--background` in
    // each block so a media-query override further down cannot be mistaken
    // for the base declaration.
    const block = (selector: string) => {
      const at = css.indexOf(selector);
      expect(at).toBeGreaterThan(-1);
      const match = /--background:\s*oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/.exec(
        css.slice(at),
      );
      if (!match) throw new Error(`no --background under ${selector}`);
      return oklchToHex(Number(match[1]), Number(match[2]), Number(match[3]));
    };
    return { light: block(":root {"), dark: block(".dark {") };
  };

  test("the hex each consumer reads is the colour the sheet actually paints", () => {
    // Not a style preference — a `theme-color` that disagrees with the page
    // paints a seam across the top of the browser chrome on a phone.
    expect(SCHEME_BACKGROUND).toEqual(declared());
  });

  test("light is near-white, not paper-white", () => {
    // §6: near-black rather than pure black, near-white rather than pure
    // white. Pure white leaves `--card` and `--popover` nowhere to be raised
    // to, and the frame reads flat.
    expect(SCHEME_BACKGROUND.light).not.toBe("#ffffff");
  });
});
