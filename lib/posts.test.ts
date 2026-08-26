import { describe, expect, test } from "bun:test";
import {
  findNeighbours,
  formatPostDate,
  postMarkdown,
  searchPosts,
  type PostSummary,
} from "@/lib/posts";

const post = (over: Partial<PostSummary>): PostSummary => ({
  slug: "a-post",
  title: "A Post",
  summary: "A sentence about it.",
  publishedAt: "2026-01-01",
  readingTimeMinutes: 3,
  ...over,
});

const POSTS: PostSummary[] = [
  post({
    slug: "gpt-5-6-review",
    title: "GPT-5.6 Review",
    summary: "Notes on burning three and a half billion tokens.",
    tags: ["models"],
  }),
  post({
    slug: "repro-harness",
    title: "Building a repro harness",
    summary: "Coding agents need a way to fail the same way twice.",
    tags: ["tooling", "agents"],
  }),
];

describe("searchPosts", () => {
  test("an empty query is not a filter", () => {
    expect(searchPosts(POSTS, "")).toHaveLength(2);
    expect(searchPosts(POSTS, "   ")).toHaveLength(2);
  });

  test("returns a copy, so a caller cannot sort the source out from under it", () => {
    expect(searchPosts(POSTS, "")).not.toBe(POSTS);
  });

  test("matches the title regardless of case", () => {
    expect(searchPosts(POSTS, "gpt").map((p) => p.slug)).toEqual([
      "gpt-5-6-review",
    ]);
  });

  test("does not match the summary, which the row stopped drawing", () => {
    // The word is in the summary and nowhere a Visitor can see it, so a row
    // returned for it would show nothing of why it matched.
    expect(searchPosts(POSTS, "billion")).toEqual([]);
  });

  test("does not match a tag, because a row never draws one", () => {
    // A hit whose row shows nothing of why it matched reads as a bug. Tags
    // go out as structured-data keywords instead.
    expect(searchPosts(POSTS, "tooling")).toEqual([]);
  });

  test("ignores spaces on both sides, so a fast typist still lands", () => {
    expect(searchPosts(POSTS, "reproharness").map((p) => p.slug)).toEqual([
      "repro-harness",
    ]);
    expect(searchPosts(POSTS, "  repro harness ").map((p) => p.slug)).toEqual([
      "repro-harness",
    ]);
  });

  test("no match is an empty list, never the whole list", () => {
    expect(searchPosts(POSTS, "kubernetes")).toEqual([]);
  });
});

describe("formatPostDate", () => {
  test("a date-only string is not dragged across a timezone", () => {
    // `2026-01-01` parsed as UTC and printed in a western zone is 31 December.
    // The formatter reads it as local midnight so the day printed is the day
    // written.
    expect(formatPostDate("2026-01-01")).toBe("January 1, 2026");
  });
});

describe("findNeighbours", () => {
  test("the middle of the list has one on each side", () => {
    const list = [post({ slug: "a" }), post({ slug: "b" }), post({ slug: "c" })];
    const { newer, older } = findNeighbours(list, "b");
    expect(newer?.slug).toBe("a");
    expect(older?.slug).toBe("c");
  });

  test("the newest post has nothing above it", () => {
    const list = [post({ slug: "a" }), post({ slug: "b" })];
    expect(findNeighbours(list, "a")).toMatchObject({ newer: null });
  });

  test("the oldest post has nothing below it", () => {
    const list = [post({ slug: "a" }), post({ slug: "b" })];
    expect(findNeighbours(list, "b")).toMatchObject({ older: null });
  });

  test("the only post is an island", () => {
    expect(findNeighbours([post({ slug: "a" })], "a")).toEqual({
      newer: null,
      older: null,
    });
  });

  test("an unknown slug is neighbourless, not an exception", () => {
    expect(findNeighbours([post({ slug: "a" })], "nope")).toEqual({
      newer: null,
      older: null,
    });
  });
});

describe("postMarkdown", () => {
  const source = postMarkdown(
    post({ title: "A Post", summary: "About it.", publishedAt: "2026-01-01" }),
    "https://example.com/blog/a-post",
    "\n\nBody text.\n",
  );

  test("opens with the title as an h1", () => {
    expect(source.startsWith("# A Post\n")).toBe(true);
  });

  test("carries the summary, the date and the canonical URL", () => {
    expect(source).toContain("> About it.");
    expect(source).toContain("January 1, 2026");
    expect(source).toContain("https://example.com/blog/a-post");
  });

  test("no frontmatter leaks into it", () => {
    expect(source).not.toContain("---");
  });

  test("ends in exactly one newline, so a paste is not padded", () => {
    expect(source.endsWith("Body text.\n")).toBe(true);
  });
});
