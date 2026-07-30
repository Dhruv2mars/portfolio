import { describe, expect, test } from "bun:test";
import {
  estimateReadingTimeMinutes,
  parsePostSource,
  selectLatestPublished,
  selectPublishedPosts,
  tryParsePostSource,
  type PostRecord,
} from "./blog";

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

describe("Blog read model", () => {
  test("excludes drafts from the published set", () => {
    const posts = [
      post({ slug: "shipped", draft: false, publishedAt: "2026-02-01" }),
      post({ slug: "wip", draft: true, publishedAt: "2026-03-01" }),
    ];

    const published = selectPublishedPosts(posts);
    expect(published.map((p) => p.slug)).toEqual(["shipped"]);
  });

  test("empty published set yields no latest Posts", () => {
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

  test("incomplete drafts are skipped; incomplete published Posts throw", () => {
    const incompleteDraft = `---
title: WIP
draft: true
---

Body
`;
    expect(tryParsePostSource("wip", incompleteDraft)).toBeNull();

    const incompletePublished = `---
title: Broken
publishedAt: 2026-01-01
draft: false
---

Body
`;
    expect(() => tryParsePostSource("broken", incompletePublished)).toThrow(
      /summary/,
    );
  });

  test("rejects YAML block scalars in frontmatter", () => {
    const source = `---
title: Block
publishedAt: 2026-01-01
summary: >
  multiline summary
draft: false
---

Body
`;
    expect(() => parsePostSource("block", source)).toThrow(/block syntax/);
  });

  test("treats YAML truthy draft values as draft", () => {
    for (const draft of ["yes", "on", "1", "TRUE"]) {
      const source = `---
title: Hidden
publishedAt: 2026-01-01
summary: Should stay unpublished.
draft: ${draft}
---

Body
`;
      expect(parsePostSource("hidden", source).draft).toBe(true);
    }
  });

  test("rejects folded/literal block scalar markers like >- and |-", () => {
    const source = `---
title: Folded
publishedAt: 2026-01-01
summary: >-
draft: false
---

Body
`;
    expect(() => parsePostSource("folded", source)).toThrow(/block syntax/);
  });

  test("skips drafts that use unsupported block scalars instead of breaking", () => {
    const source = `---
title: WIP
publishedAt: 2026-01-01
summary: >-
draft: yes
---

Body
`;
    expect(tryParsePostSource("wip-folded", source)).toBeNull();
  });
});
