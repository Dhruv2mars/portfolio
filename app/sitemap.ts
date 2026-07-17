import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getPublishedWriting } from "@/lib/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  const writingEntries = getPublishedWriting().map((piece) => ({
    url: `${site.url}/writing/${piece.slug}`,
    lastModified: piece.metadata.publishedAt,
  }));

  const routes = ["", "/writing", "/projects"].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...writingEntries];
}
