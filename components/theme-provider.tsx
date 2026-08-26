"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { DEFAULT_THEME } from "@/lib/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      // Follow the OS by default; `enableSystem` resolves it, and a media query
      // that reports nothing lands on FALLBACK_SCHEME via `resolveTheme`.
      defaultTheme={DEFAULT_THEME}
      enableSystem
      disableTransitionOnChange={false}
      storageKey="theme"
    >
      {children}
    </NextThemeProvider>
  );
}
