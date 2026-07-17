import { describe, expect, test } from "bun:test";
import { buildRssXml, buildSitemapEntries } from "./discovery";
import type { PostRecord } from "./writings";

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
    expect(withPost).toContain("https://dhruv2mars.com/writings/judgment");
    expect(withPost).toContain("Product &amp; judgment");
    expect(withPost).not.toContain("/blog/");
  });

  test("sitemap lists Home, Writings, Projects, and published Posts", () => {
    const entries = buildSitemapEntries({
      siteUrl: "https://dhruv2mars.com",
      posts: [samplePost],
    });
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://dhruv2mars.com");
    expect(urls).toContain("https://dhruv2mars.com/writings");
    expect(urls).toContain("https://dhruv2mars.com/projects");
    expect(urls).toContain("https://dhruv2mars.com/writings/judgment");
  });

  test("sitemap with zero Posts still lists core routes", () => {
    const entries = buildSitemapEntries({
      siteUrl: "https://dhruv2mars.com",
      posts: [],
    });
    expect(entries.map((e) => e.url)).toEqual([
      "https://dhruv2mars.com",
      "https://dhruv2mars.com/writings",
      "https://dhruv2mars.com/projects",
    ]);
  });
});
