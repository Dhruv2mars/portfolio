import { filterByQuery } from "@/lib/search";

/**
 * What a Post *is*, and the things you can do with one without touching a
 * disk.
 *
 * `lib/blog.ts` reads Posts off the filesystem, so anything that imports it is
 * server-only. A search box is not: it needs the shape, the date formatter and
 * the matcher in the browser. Splitting the pure half out is what lets the row
 * and the filter be shared by both sides instead of duplicated on one.
 */

export type PostFrontmatter = {
  title: string;
  publishedAt: string;
  /**
   * When the Post was last materially changed, if it ever was. Absent means
   * it still says what it said on the day it went up — which is the honest
   * default, and why `dateModified` falls back to `publishedAt` rather than
   * to the file's mtime, a number that moves when a typo is fixed.
   */
  updatedAt?: string;
  summary: string;
  /** Subject terms. Not drawn and not searched — see `searchPosts`. */
  tags?: string[];
  draft?: boolean;
  image?: string;
};

export type PostRecord = PostFrontmatter & {
  slug: string;
  content: string;
  readingTimeMinutes: number;
};

/**
 * A Post minus its body: everything a row draws and a search reads, and
 * nothing a list of fifty has to ship down the wire.
 */
export type PostSummary = Omit<PostRecord, "content">;

export function formatPostDate(date: string): string {
  const value = date.includes("T") ? date : `${date}T00:00:00`;
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * The title — the only prose a row draws.
 *
 * A filter that matched text the row never shows returns a Post with nothing
 * on it to say why it matched, which reads as a bug even when it is a hit.
 * That rules out the body, the tags, and — since the row stopped drawing it —
 * the summary. Both still leave the building: the summary as the Post's
 * description in metadata, feeds and social cards, the tags as `keywords` in
 * its structured data, where a machine reads them and a Visitor is never
 * puzzled by them.
 */
export function searchPosts<T extends Pick<PostSummary, "title">>(
  posts: readonly T[],
  query: string,
): T[] {
  return filterByQuery(posts, query, (post) => [post.title]);
}

export function findNeighbours<T extends { slug: string }>(
  posts: readonly T[],
  slug: string,
): { newer: T | null; older: T | null } {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { newer: null, older: null };
  return {
    newer: posts[index - 1] ?? null,
    older: posts[index + 1] ?? null,
  };
}

/**
 * The post as plain markdown: what "Copy page" puts on the clipboard and what
 * `/blog/<slug>/raw.md` serves.
 *
 * The frontmatter is bookkeeping for the build, so it is not reproduced; the
 * two facts it holds that a reader wants — what this is and when it was
 * written — are restated as text instead. The canonical URL rides along
 * because the likeliest next thing to happen to this string is being pasted
 * into a model, and a model that cannot cite where the words came from will
 * invent somewhere.
 */
export function postMarkdown(
  post: Pick<PostSummary, "title" | "summary" | "publishedAt">,
  url: string,
  content: string,
): string {
  return (
    [
      `# ${post.title}`,
      `> ${post.summary}`,
      `${formatPostDate(post.publishedAt)} · ${url}`,
      content.trim(),
    ].join("\n\n") + "\n"
  );
}
