"use client";

import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

/**
 * The theme control is words, not an icon (DESIGN.md §5).
 *
 *   dark ⁄ light
 *
 * Two real buttons, keyboard-native, the active one in --fg and the inactive
 * in --fg-dim. Explicit, zero iconography, more confident than any sun/moon.
 * Switching uses a flat 260ms root crossfade via `startViewTransition` where
 * supported — explicitly not a circular wipe from the toggle (DESIGN §7).
 */

const emptySubscribe = () => () => {};

type Scheme = "dark" | "light";

/** A transparent 24px-tall hit area — target size without moving the words. */
function HitArea() {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        left: -2,
        right: -2,
        top: "50%",
        height: 24,
        transform: "translateY(-50%)",
      }}
    />
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // the server has no theme; only claim one once we are on the client
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const active: Scheme | null = mounted
    ? resolvedTheme === "light"
      ? "light"
      : "dark"
    : null;

  function apply(next: Scheme) {
    if (active === next) return;

    const startViewTransition = document.startViewTransition?.bind(document);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduce && startViewTransition) {
      startViewTransition(() => {
        flushSync(() => setTheme(next));
      });
      return;
    }

    setTheme(next);
  }

  return (
    <div
      role="group"
      aria-label="Theme"
      className="flex items-center whitespace-nowrap"
    >
      {(["dark", "light"] as const).map((scheme, i) => (
        <span key={scheme} className="flex items-center">
          {i > 0 ? (
            <span
              aria-hidden="true"
              className="theme-word"
              style={{ paddingInline: 4 }}
            >
              {"⁄"}
            </span>
          ) : null}
          <button
            type="button"
            data-active={active === scheme}
            aria-pressed={active === scheme}
            onClick={() => apply(scheme)}
            className="theme-word relative cursor-pointer"
          >
            {scheme}
            <HitArea />
          </button>
        </span>
      ))}
    </div>
  );
}
