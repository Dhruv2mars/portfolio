import type { PostRecord } from "./writings";

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
      <link>${siteUrl}/writings/${post.slug}</link>
      <guid>${siteUrl}/writings/${post.slug}</guid>
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
  const core = ["", "/writings", "/projects"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: today,
  }));

  const writingEntries = posts.map((post) => ({
    url: `${siteUrl}/writings/${post.slug}`,
    lastModified: post.publishedAt,
  }));

  return [...core, ...writingEntries];
}

export function ogImagePath(title: string): string {
  return `/og?title=${encodeURIComponent(title)}`;
}
