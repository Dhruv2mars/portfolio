"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "@/components/icons";
import { nextTheme, type ColorScheme } from "@/lib/theme";

/** Never fires — the snapshot difference alone reports "hydrated". */
const noSubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );

  const current: ColorScheme = resolvedTheme === "light" ? "light" : "dark";
  const target = nextTheme(current);

  function toggle() {
    const apply = () => setTheme(target);
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduced) {
      doc.startViewTransition(apply);
    } else {
      apply();
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? `Switch to ${target} theme` : "Switch theme"}
      className="flex size-8 touch-manipulation items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent hover:text-foreground active:scale-[0.98] dark:hover:bg-accent/50"
    >
      {/* Both render until mounted so the control never shifts or flashes. */}
      <Sun className={`size-4.5 ${mounted && current === "dark" ? "block" : "hidden"}`} />
      <Moon className={`size-4.5 ${mounted && current === "dark" ? "hidden" : "block"}`} />
    </button>
  );
}
