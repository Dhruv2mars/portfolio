import type { PostRecord } from "./blog";

export type RssInput = {
  siteUrl: string;
  siteName: string;
  description: string;
  posts: readonly PostRecord[];
};

export type SitemapEntry = {
  url: string;
  lastModified: string;
};

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildRssXml({
  siteUrl,
  siteName,
  description,
  posts,
}: RssInput): string {
  const items = posts
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(`${siteUrl}/blog/${encodeURIComponent(post.slug)}`)}</link>
      <guid>${escapeXml(`${siteUrl}/blog/${encodeURIComponent(post.slug)}`)}</guid>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(description)}</description>
${items ? `${items}\n` : ""}  </channel>
</rss>`;
}

export function buildSitemapEntries({
  siteUrl,
  posts,
}: {
  siteUrl: string;
  posts: readonly PostRecord[];
}): SitemapEntry[] {
  const today = new Date().toISOString().slice(0, 10);
  // `/blog` 404s until a Post is published, and `/projects` is a redirect to
  // the Home section — neither belongs in a sitemap while that holds.
  const routes = posts.length > 0 ? ["", "/blog"] : [""];
  const core = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: today,
  }));

  const postEntries = posts.map((post) => ({
    url: `${siteUrl}/blog/${encodeURIComponent(post.slug)}`,
    lastModified: post.publishedAt,
  }));

  return [...core, ...postEntries];
}

export function ogImagePath(title: string): string {
  return `/og?title=${encodeURIComponent(title)}`;
}
