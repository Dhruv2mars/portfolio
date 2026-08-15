import { describe, expect, test } from "bun:test";
import { profileUrls, site } from "@/lib/site";

describe("site identity", () => {
  test("the canonical URL is absolute and unslashed", () => {
    expect(site.url).toBe("https://dhruv2mars.com");
    expect(site.url.endsWith("/")).toBe(false);
  });

  test("structured-data profiles exclude the mailto link", () => {
    const urls = profileUrls();
    expect(urls.some((url) => url.startsWith("mailto:"))).toBe(false);
    expect(urls.length).toBe(site.socials.length - 1);
    for (const url of urls) {
      expect(() => new URL(url)).not.toThrow();
    }
  });

  test("the avatar slot is empty on purpose, not by accident", () => {
    // Setting this to a path is the only change needed to fill the masthead.
    expect(site.avatar).toBeNull();
  });
});
