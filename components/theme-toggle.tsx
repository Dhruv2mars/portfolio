"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "@phosphor-icons/react";

const emptySubscribe = () => () => {};

/**
 * Quiet Vercel-like theme control: system by default, click cycles
 * and persists a manual light/dark override via next-themes.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      disabled={!mounted}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-[color,transform] duration-200 ease-[var(--ease-editorial)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground active:scale-[0.97] disabled:pointer-events-none"
      aria-label={
        !mounted
          ? "Theme"
          : isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
      }
      onClick={() => {
        if (!mounted) return;
        setTheme(isDark ? "light" : "dark");
      }}
    >
      {mounted ? (
        isDark ? (
          <Sun size={16} weight="regular" aria-hidden="true" />
        ) : (
          <Moon size={16} weight="regular" aria-hidden="true" />
        )
      ) : (
        <span className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
