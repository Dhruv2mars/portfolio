export type ColorScheme = "light" | "dark";
export type ThemeOverride = ColorScheme | null;

/**
 * Resolves the visible theme from system preference and an optional
 * persisted manual override (header control).
 */
export function resolveTheme(
  systemPreference: ColorScheme,
  override: ThemeOverride,
): ColorScheme {
  return override ?? systemPreference;
}
