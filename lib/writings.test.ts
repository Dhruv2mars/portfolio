import { describe, expect, test } from "bun:test";
import {
  estimateReadingTimeMinutes,
  parsePostSource,
  selectLatestPublished,
  selectPublishedPosts,
  type PostRecord,
} from "./writings";

function post(partial: Partial<PostRecord> & Pick<PostRecord, "slug">): PostRecord {
  return {
    slug: partial.slug,
    title: partial.title ?? partial.slug,
    publishedAt: partial.publishedAt ?? "2026-01-01",
    summary: partial.summary ?? "Summary",
    tags: partial.tags,
    draft: partial.draft ?? false,
    content: partial.content ?? "Hello world.",
    readingTimeMinutes: partial.readingTimeMinutes ?? 1,
  };
}

describe("Writings read model", () => {
  test("excludes drafts from the published set", () => {
    const posts = [
      post({ slug: "shipped", draft: false, publishedAt: "2026-02-01" }),
      post({ slug: "wip", draft: true, publishedAt: "2026-03-01" }),
    ];

    const published = selectPublishedPosts(posts);
    expect(published.map((p) => p.slug)).toEqual(["shipped"]);
  });

  test("empty published set yields no latest Writings", () => {
    const posts = [post({ slug: "wip", draft: true })];
    expect(selectPublishedPosts(posts)).toEqual([]);
    expect(selectLatestPublished(posts, 3)).toEqual([]);
  });

  test("latest published strip is newest-first and capped", () => {
    const posts = [
      post({ slug: "a", publishedAt: "2026-01-01" }),
      post({ slug: "c", publishedAt: "2026-03-01" }),
      post({ slug: "b", publishedAt: "2026-02-01" }),
      post({ slug: "draft", draft: true, publishedAt: "2026-04-01" }),
    ];

    expect(selectLatestPublished(posts, 2).map((p) => p.slug)).toEqual([
      "c",
      "b",
    ]);
  });

  test("parses frontmatter, slug, tags, draft, and reading time", () => {
    const source = `---
title: Product judgment
publishedAt: 2026-06-01
summary: Why judgment beats slogans.
tags: product, ai
draft: true
---

Word one two three four five six seven eight nine ten
eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty.
`;

    const parsed = parsePostSource("product-judgment", source);
    expect(parsed.slug).toBe("product-judgment");
    expect(parsed.title).toBe("Product judgment");
    expect(parsed.publishedAt).toBe("2026-06-01");
    expect(parsed.summary).toBe("Why judgment beats slogans.");
    expect(parsed.tags).toEqual(["product", "ai"]);
    expect(parsed.draft).toBe(true);
    expect(parsed.content).toContain("Word one");
    expect(parsed.content).not.toContain("---");
    expect(estimateReadingTimeMinutes(parsed.content)).toBeGreaterThanOrEqual(1);
    expect(parsed.readingTimeMinutes).toBe(
      estimateReadingTimeMinutes(parsed.content),
    );
  });
});
