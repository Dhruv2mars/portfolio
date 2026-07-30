import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/lib/discovery";
import { site } from "@/lib/site";
import { getPublishedPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries({
    siteUrl: site.url,
    posts: getPublishedPosts(),
  });
}
