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

/**
 * The page background each scheme paints, as a literal hex.
 *
 * Three things outside CSS need this number and none of them can read a custom
 * property: the `themeColor` metadata pair, the unconditioned `theme-color`
 * tag the toggle keeps in sync, and the install manifest. They were three
 * copies of the same two values and the manifest's copy had drifted to white
 * in both slots. One declaration, so they cannot disagree again.
 *
 * These must track `--background` in `app/globals.css`.
 */
export const SCHEME_BACKGROUND = {
  light: "#fafafa",
  dark: "#09090b",
} as const satisfies Record<ColorScheme, string>;

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
