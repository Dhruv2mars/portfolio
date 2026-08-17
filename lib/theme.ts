export type ColorScheme = "light" | "dark";
/** What the Visitor has asked for — including "ask my OS". */
export type ThemePreference = ColorScheme | "system";

/**
 * The site follows the operating system until the Visitor says otherwise. A
 * manual choice always wins and is persisted. Runtime applies this via
 * `next-themes`; this module is the contract.
 */
export const DEFAULT_THEME: ThemePreference = "system";

/** Used only where the OS expresses no preference at all. */
export const FALLBACK_SCHEME: ColorScheme = "dark";

export function resolveTheme(
  preference: ThemePreference | null,
  systemScheme: ColorScheme | null = null,
): ColorScheme {
  if (preference === "light" || preference === "dark") return preference;
  return systemScheme ?? FALLBACK_SCHEME;
}

export function nextTheme(current: ColorScheme): ColorScheme {
  return current === "dark" ? "light" : "dark";
}
