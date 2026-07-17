"use client";

import { useTheme } from "@/components/theme-provider";
import { themeLabel } from "@/lib/theme";

export function ThemeToggle() {
  const { preference, cycle } = useTheme();
  const label = themeLabel(preference);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={cycle}
      aria-label={`Theme: ${label}. Activate to cycle theme.`}
      title={`Theme: ${label}`}
    >
      <span
        className="theme-toggle__mark"
        data-mode={preference}
        aria-hidden="true"
      />
      <span className="theme-toggle__text">{label}</span>
    </button>
  );
}
