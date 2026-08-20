import type { PostRecord } from "./blog";

export type RssInput = {
  siteUrl: string;
  siteName: string;
  description: string;
  posts: readonly PostRecord[];
  /** The feed's own address, so it can point at itself. */
  feedPath: string;
  /** Injected so the output is a pure function of its input, and testable. */
  now?: Date;
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

/**
 * RSS 2.0, with the three declarations readers actually use and that a
 * hand-rolled feed usually forgets.
 *
 * `atom:link rel="self"` is the feed's own address: a reader that has been
 * handed the file by any other route — a proxy, a mirror, a copy-paste —
 * learns where to poll from here. `lastBuildDate` is what lets a reader ask
 * "has anything changed?" without downloading the whole feed. `language` is
 * what tells it not to run the titles through a translator.
 *
 * The feed carries summaries, not whole articles. That is a choice: the posts
 * are MDX with components in them, and a feed that ships half-rendered markup
 * is worse than one that ships a paragraph and a link.
 */
export function buildRssXml({
  siteUrl,
  siteName,
  description,
  posts,
  feedPath,
  now = new Date(),
}: RssInput): string {
  const ordered = posts
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  const items = ordered
    .map((post) => {
      const url = `${siteUrl}/blog/${encodeURIComponent(post.slug)}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  // The newest post if there is one, otherwise the moment the feed was built:
  // a `lastBuildDate` that moves on every request would make every poll look
  // like news.
  const lastBuild = ordered[0]
    ? new Date(ordered[0].publishedAt)
    : now;

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteUrl}${feedPath}`)}" rel="self" type="application/rss+xml" />
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
  // `/blog` 404s until a Post is published; `/projects` is always a page.
  const routes = posts.length > 0 ? ["", "/projects", "/blog"] : ["", "/projects"];
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
