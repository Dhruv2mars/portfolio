export type ThemeMode = "light" | "dark";
export type ThemePreference = ThemeMode | "system";

export const THEME_STORAGE_KEY = "portfolio-theme";

export function parseStoredTheme(value: string | null): ThemePreference {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return "system";
}

/** System unset → dark (ADR-0014). Manual light/dark overrides system. */
export function resolveTheme(
  preference: ThemePreference,
  systemPreference: ThemeMode | null,
): ThemeMode {
  if (preference === "light" || preference === "dark") {
    return preference;
  }
  return systemPreference ?? "dark";
}

/** Cycle system → light → dark → system so Visitors can clear the override. */
export function cycleThemePreference(
  preference: ThemePreference,
): ThemePreference {
  if (preference === "system") return "light";
  if (preference === "light") return "dark";
  return "system";
}

export function themeLabel(preference: ThemePreference): string {
  if (preference === "system") return "System";
  if (preference === "light") return "Light";
  return "Dark";
}
