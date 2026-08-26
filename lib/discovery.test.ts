import { describe, expect, test } from "bun:test";
import { buildRssXml, buildSitemapEntries } from "./discovery";
import type { PostRecord } from "./blog";

const samplePost: PostRecord = {
  slug: "judgment",
  title: "Product & judgment",
  publishedAt: "2026-06-01",
  summary: "Why judgment beats slogans.",
  draft: false,
  content: "Body",
  readingTimeMinutes: 1,
};

describe("discovery contracts", () => {
  test("RSS includes only published Posts and stays valid when empty", () => {
    const empty = buildRssXml({
      siteUrl: "https://dhruv2mars.com",
      siteName: "Dhruv Sharma",
      description: "AI-pilled Design Engineer.",
      posts: [],
      feedPath: "/feed.xml",
    });
    expect(empty).toContain("<rss");
    expect(empty).toContain("<channel>");
    expect(empty).not.toContain("<item>");

    const withPost = buildRssXml({
      siteUrl: "https://dhruv2mars.com",
      siteName: "Dhruv Sharma",
      description: "AI-pilled Design Engineer.",
      posts: [samplePost],
      feedPath: "/feed.xml",
    });
    expect(withPost).toContain("<item>");
    expect(withPost).toContain("https://dhruv2mars.com/blog/judgment");
    expect(withPost).toContain("Product &amp; judgment");
    expect(withPost).not.toContain("/writings/");

    const ampersandSlug = buildRssXml({
      siteUrl: "https://dhruv2mars.com",
      siteName: "Dhruv Sharma",
      description: "AI-pilled Design Engineer.",
      posts: [{ ...samplePost, slug: "ai&design" }],
      feedPath: "/feed.xml",
    });
    expect(ampersandSlug).toContain(
      "https://dhruv2mars.com/blog/ai%26design",
    );
    expect(ampersandSlug).not.toContain("/blog/ai&design");
  });

  // The three declarations a hand-rolled feed usually forgets, and that a
  // reader uses to poll cheaply and to know where to poll.
  test("the feed points at itself, dates itself and declares its language", () => {
    const xml = buildRssXml({
      siteUrl: "https://dhruv2mars.com",
      siteName: "Dhruv Sharma",
      description: "AI-pilled Design Engineer.",
      posts: [samplePost],
      feedPath: "/feed.xml",
    });
    expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    expect(xml).toContain(
      '<atom:link href="https://dhruv2mars.com/feed.xml" rel="self" type="application/rss+xml" />',
    );
    expect(xml).toContain("<language>en</language>");
    expect(xml).toContain(
      `<lastBuildDate>${new Date("2026-06-01").toUTCString()}</lastBuildDate>`,
    );
    expect(xml).toContain('<guid isPermaLink="true">');
  });

  test("an empty feed still dates itself, from the clock it was handed", () => {
    const xml = buildRssXml({
      siteUrl: "https://dhruv2mars.com",
      siteName: "Dhruv Sharma",
      description: "AI-pilled Design Engineer.",
      posts: [],
      feedPath: "/feed.xml",
      now: new Date("2026-08-20T00:00:00Z"),
    });
    expect(xml).toContain(
      "<lastBuildDate>Thu, 20 Aug 2026 00:00:00 GMT</lastBuildDate>",
    );
  });

  test("sitemap lists Home, Blog, and published Posts", () => {
    const entries = buildSitemapEntries({
      siteUrl: "https://dhruv2mars.com",
      posts: [samplePost],
    });
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://dhruv2mars.com");
    expect(urls).toContain("https://dhruv2mars.com/blog");
    expect(urls).toContain("https://dhruv2mars.com/blog/judgment");
    expect(urls).toContain("https://dhruv2mars.com/projects");

    const encoded = buildSitemapEntries({
      siteUrl: "https://dhruv2mars.com",
      posts: [{ ...samplePost, slug: "ai&design" }],
      feedPath: "/feed.xml",
    });
    expect(encoded.map((e) => e.url)).toContain(
      "https://dhruv2mars.com/blog/ai%26design",
    );
  });

  test("sitemap omits Blog entirely until a Post is published", () => {
    const entries = buildSitemapEntries({
      siteUrl: "https://dhruv2mars.com",
      posts: [],
    });
    expect(entries.map((e) => e.url)).toEqual([
      "https://dhruv2mars.com",
      "https://dhruv2mars.com/projects",
    ]);
  });
});
