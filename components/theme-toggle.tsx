"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "@phosphor-icons/react";

/**
 * Quiet Vercel-like theme control: system by default, click cycles
 * and persists a manual light/dark override via next-themes.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="inline-flex size-8 items-center justify-center rounded-md text-muted transition-[color,transform] duration-200 ease-[var(--ease-editorial)] hover:text-foreground active:scale-[0.97]"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
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
