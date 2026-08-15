export type ColorScheme = "light" | "dark";
export type ThemeOverride = ColorScheme | null;

/**
 * Dark is the default and the primary design; light is a real alternative,
 * not an inversion (DESIGN.md §6). A manual choice always wins and is
 * persisted. Runtime applies this via `next-themes`; this is the contract.
 */
export const DEFAULT_THEME: ColorScheme = "dark";

export function resolveTheme(override: ThemeOverride): ColorScheme {
  return override ?? DEFAULT_THEME;
}

export function nextTheme(current: ColorScheme): ColorScheme {
  return current === "dark" ? "light" : "dark";
}
