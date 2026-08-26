"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { DEFAULT_THEME } from "@/lib/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      // Start dark by default. `enableSystem` remains available for an
      // explicitly stored `system` preference, while an absent preference uses
      // DEFAULT_THEME.
      defaultTheme={DEFAULT_THEME}
      enableSystem
      disableTransitionOnChange={false}
      storageKey="theme"
    >
      {children}
    </NextThemeProvider>
  );
}
