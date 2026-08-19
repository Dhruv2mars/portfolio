import { describe, expect, test } from "bun:test";
import { GET as getFeed } from "@/app/feed.xml/route";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { getPublishedPosts } from "@/lib/blog";

/**
 * Thin secondary smoke: discovery endpoints respond with sensible payloads
 * for the current published Post set (may be empty or non-empty).
 */
describe("discovery route smoke", () => {
  test("RSS feed responds with channel matching published Posts", async () => {
    const published = getPublishedPosts();
    const response = await getFeed();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain(
      "application/rss+xml",
    );
    const body = await response.text();
    expect(body).toContain("<rss");
    expect(body).toContain("<channel>");

    if (published.length === 0) {
      expect(body).not.toContain("<item>");
    } else {
      expect(body).toContain("<item>");
      for (const post of published) {
        expect(body).toContain(`/blog/${post.slug}`);
        expect(body).toContain(post.title);
      }
    }
  });

  test("sitemap and robots cover the routes that actually exist", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://dhruv2mars.com");
    // Blog is a route only once a Post is published; /projects always is.
    expect(urls.includes("https://dhruv2mars.com/blog")).toBe(
      getPublishedPosts().length > 0,
    );
    expect(urls).toContain("https://dhruv2mars.com/projects");

    const robotsFile = robots();
    expect(robotsFile.sitemap).toBe("https://dhruv2mars.com/sitemap.xml");
  });
});
