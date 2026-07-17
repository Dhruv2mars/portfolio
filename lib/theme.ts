export type ColorScheme = "light" | "dark";
export type ThemeOverride = ColorScheme | null;

/**
 * Product policy for visible theme: system preference unless a manual
 * override is persisted. Runtime applies this via `next-themes`
 * (`defaultTheme="system"` + storage); this helper is the tested contract.
 */
export function resolveTheme(
  systemPreference: ColorScheme,
  override: ThemeOverride,
): ColorScheme {
  return override ?? systemPreference;
}
