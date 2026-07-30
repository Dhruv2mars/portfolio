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
    });
    expect(empty).toContain("<rss");
    expect(empty).toContain("<channel>");
    expect(empty).not.toContain("<item>");

    const withPost = buildRssXml({
      siteUrl: "https://dhruv2mars.com",
      siteName: "Dhruv Sharma",
      description: "AI-pilled Design Engineer.",
      posts: [samplePost],
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
    });
    expect(ampersandSlug).toContain(
      "https://dhruv2mars.com/blog/ai%26design",
    );
    expect(ampersandSlug).not.toContain("/blog/ai&design");
  });

  test("sitemap lists Home, Blog, Projects, and published Posts", () => {
    const entries = buildSitemapEntries({
      siteUrl: "https://dhruv2mars.com",
      posts: [samplePost],
    });
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://dhruv2mars.com");
    expect(urls).toContain("https://dhruv2mars.com/blog");
    expect(urls).toContain("https://dhruv2mars.com/projects");
    expect(urls).toContain("https://dhruv2mars.com/blog/judgment");

    const encoded = buildSitemapEntries({
      siteUrl: "https://dhruv2mars.com",
      posts: [{ ...samplePost, slug: "ai&design" }],
    });
    expect(encoded.map((e) => e.url)).toContain(
      "https://dhruv2mars.com/blog/ai%26design",
    );
  });

  test("sitemap with zero Posts still lists core routes", () => {
    const entries = buildSitemapEntries({
      siteUrl: "https://dhruv2mars.com",
      posts: [],
    });
    expect(entries.map((e) => e.url)).toEqual([
      "https://dhruv2mars.com",
      "https://dhruv2mars.com/blog",
      "https://dhruv2mars.com/projects",
    ]);
  });
});
