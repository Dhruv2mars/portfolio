"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/** The two values the metadata export already declares, keyed by scheme. */
const THEME_COLOR = { light: "#ffffff", dark: "#09090b" } as const;

/**
 * Keeps the browser's own chrome — the iOS status bar, the Android address bar
 * — on the theme the reader chose rather than on the one their OS is set to.
 *
 * The static metadata emits a media-conditioned pair, which is right for the
 * first paint and for a reader with no stored preference. It is wrong the
 * moment someone picks light while their OS is dark: the pair only ever knows
 * about the OS. So this adds one *unconditioned* tag and keeps it in sync.
 *
 * It is prepended rather than appended because the spec takes the first tag in
 * tree order whose media matches, and the media-conditioned pair matches too.
 */
export function ThemeColor() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]:not([media])',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.prepend(meta);
    }
    meta.content = THEME_COLOR[resolvedTheme === "light" ? "light" : "dark"];
  }, [resolvedTheme]);

  return null;
}
