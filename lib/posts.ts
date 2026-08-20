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

/**
 * The posts either side of one, in the order the index lists them: newest
 * first. `newer` is therefore the entry above in that list and `older` the one
 * below — named for what they are rather than for which arrow key reaches
 * them, because "previous post" in a reverse-chronological list is a coin
 * toss and the label is the only thing telling the Visitor where they'll land.
 *
 * Either end is `null`, which is how the page knows to draw a dead control
 * rather than a link to nothing.
 */
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
