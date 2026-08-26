import { describe, expect, test } from "bun:test";
import type { PostRecord } from "@/lib/blog";
import { paletteItems } from "@/lib/palette";
import { PROJECT_NAMES } from "@/lib/projects";

const POSTS: PostRecord[] = [
  {
    slug: "a-post",
    title: "A post",
    summary: "A summary.",
    publishedAt: "2026-08-01",
    readingTimeMinutes: 4,
    content: "# A post",
  },
  {
    slug: "another-post",
    title: "Another post",
    summary: "Another summary.",
    publishedAt: "2026-07-01",
    readingTimeMinutes: 2,
    content: "# Another post",
  },
];

describe("command palette reaches everything the Portfolio has", () => {
  test("ids are unique so React keys and activedescendant stay sound", () => {
    const ids = paletteItems(POSTS).map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every Project is reachable", () => {
    const labels = paletteItems([]).map((item) => item.label);
    for (const name of PROJECT_NAMES) {
      expect(labels).toContain(name);
    }
  });

  test("Blog is listed only when a Post is published", () => {
    expect(paletteItems([]).some((i) => i.href === "/blog")).toBe(false);
    expect(paletteItems(POSTS).some((i) => i.href === "/blog")).toBe(true);
  });

  // A palette that lists the Blog but not what is in it sends the Visitor to a
  // page to run the same search again.
  test("every Post is reachable by its own title", () => {
    const items = paletteItems(POSTS);
    for (const post of POSTS) {
      expect(items.some((i) => i.href === `/blog/${post.slug}`)).toBe(true);
      expect(items.some((i) => i.label === post.title)).toBe(true);
    }
  });

  test("every entry either navigates or acts, never neither", () => {
    for (const item of paletteItems(POSTS)) {
      expect(Boolean(item.href) || Boolean(item.action)).toBe(true);
    }
  });
});
