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
  summary: string;
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
 * Spaces are dropped as well as case folded, so "codingagents" finds "coding
 * agents" — the reference does this, and it is right: someone typing fast into
 * a filter is not typing prose.
 */
const normalize = (text: string) => text.toLowerCase().replaceAll(" ", "");

/**
 * Title, summary and tags. Not the body — a filter that matched body text
 * would return a Post whose row shows nothing of why it matched, which reads
 * as a bug even when it is a hit.
 */
export function searchPosts<T extends Pick<PostSummary, "title" | "summary" | "tags">>(
  posts: readonly T[],
  query: string,
): T[] {
  const needle = normalize(query.trim());
  if (!needle) return [...posts];

  return posts.filter((post) => {
    const haystack = normalize(
      [post.title, post.summary, ...(post.tags ?? [])].join(" "),
    );
    return haystack.includes(needle);
  });
}
