import { describe, expect, test } from "bun:test";
import { GET as getFeed } from "@/app/feed.xml/route";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

/**
 * Thin secondary smoke: discovery endpoints respond with sensible payloads
 * even when zero Posts are published.
 */
describe("discovery route smoke", () => {
  test("RSS feed responds with an empty channel when no Posts", async () => {
    const response = await getFeed();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain(
      "application/rss+xml",
    );
    const body = await response.text();
    expect(body).toContain("<rss");
    expect(body).not.toContain("<item>");
  });

  test("sitemap and robots cover core IA routes", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://dhruv2mars.com");
    expect(urls).toContain("https://dhruv2mars.com/writings");
    expect(urls).toContain("https://dhruv2mars.com/projects");

    const robotsFile = robots();
    expect(robotsFile.sitemap).toBe("https://dhruv2mars.com/sitemap.xml");
  });
});
