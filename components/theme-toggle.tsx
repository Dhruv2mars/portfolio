"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "@/components/icons";

const emptySubscribe = () => () => {};

/** Quiet theme control — dark default, system-aware, persisted override. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      disabled={!mounted}
      className="inline-flex size-8 items-center justify-center rounded-full text-muted transition-[color,background-color,transform] duration-150 ease-[var(--ease-out-quad)] hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.92] disabled:pointer-events-none"
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
              size={15}
              weight="bold"
              aria-hidden
              className={[
                "absolute inset-0 m-auto transition-[opacity,transform] duration-300 ease-[var(--ease-out-expo)]",
                isDark
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-50 opacity-0",
              ].join(" ")}
            />
            <Moon
              size={15}
              weight="bold"
              aria-hidden
              className={[
                "absolute inset-0 m-auto transition-[opacity,transform] duration-300 ease-[var(--ease-out-expo)]",
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
