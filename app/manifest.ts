import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

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
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
