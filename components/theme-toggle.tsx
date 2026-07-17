"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "@phosphor-icons/react";

const emptySubscribe = () => () => {};

/** Quiet Vercel-like theme control — system default, persisted light/dark override. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      disabled={!mounted}
      className="inline-flex size-8 items-center justify-center rounded-md text-muted transition-[color,background-color,transform] duration-150 ease-[var(--ease-out-quad)] hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground active:scale-[0.94] disabled:pointer-events-none"
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
      <span className="relative size-4">
        {mounted ? (
          <>
            <Sun
              size={16}
              weight="bold"
              aria-hidden
              className={[
                "absolute inset-0 transition-[opacity,transform] duration-200 ease-[var(--ease-out-expo)]",
                isDark
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-50 opacity-0",
              ].join(" ")}
            />
            <Moon
              size={16}
              weight="bold"
              aria-hidden
              className={[
                "absolute inset-0 transition-[opacity,transform] duration-200 ease-[var(--ease-out-expo)]",
                isDark
                  ? "rotate-90 scale-50 opacity-0"
                  : "rotate-0 scale-100 opacity-100",
              ].join(" ")}
            />
          </>
        ) : (
          <span className="absolute inset-0 rounded-sm bg-border" aria-hidden />
        )}
      </span>
    </button>
  );
}
