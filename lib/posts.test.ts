import { describe, expect, test } from "bun:test";
import { formatPostDate, searchPosts, type PostSummary } from "@/lib/posts";

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

  test("matches the summary, not just the title", () => {
    expect(searchPosts(POSTS, "billion").map((p) => p.slug)).toEqual([
      "gpt-5-6-review",
    ]);
  });

  test("matches a tag, which is the word a reader is most likely to type", () => {
    expect(searchPosts(POSTS, "tooling").map((p) => p.slug)).toEqual([
      "repro-harness",
    ]);
  });

  test("ignores spaces on both sides, so a fast typist still lands", () => {
    expect(searchPosts(POSTS, "codingagents").map((p) => p.slug)).toEqual([
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
