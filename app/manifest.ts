import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { FALLBACK_SCHEME, SCHEME_BACKGROUND } from "@/lib/theme";

/**
 * Enough for a home-screen install to look like the site rather than like a
 * screenshot of it. `browser` display, not `standalone`: this is a set of
 * pages, and taking the address bar away from a set of pages only removes the
 * back button.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "browser",
    // A manifest holds one colour, not a pair — it is read before any page
    // runs, so there is nothing to ask. It gets the scheme the site falls back
    // to, which is dark; white here made an installed dark-first site open on
    // a white splash.
    background_color: SCHEME_BACKGROUND[FALLBACK_SCHEME],
    theme_color: SCHEME_BACKGROUND[FALLBACK_SCHEME],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
