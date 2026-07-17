import fs from "node:fs";
import path from "node:path";

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

const WRITINGS_DIR = path.join(process.cwd(), "content", "writings");

/** ~200 wpm; minimum 1 minute when there is body text. */
export function estimateReadingTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 1;
  return Math.max(1, Math.ceil(words / 200));
}

function parseTags(raw: string | undefined): string[] | undefined {
  if (!raw) return undefined;
  const tags = raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return tags.length > 0 ? tags : undefined;
}

function parseBool(raw: string | undefined): boolean {
  if (!raw) return false;
  return raw.toLowerCase() === "true";
}

export function parsePostSource(slug: string, fileContent: string): PostRecord {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*/;
  const match = frontmatterRegex.exec(fileContent);
  if (!match) {
    throw new Error(`Post "${slug}" is missing frontmatter`);
  }

  const block = match[1] ?? "";
  const content = fileContent.slice(match[0].length).trim();
  const fields: Record<string, string> = {};

  for (const line of block.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const sep = trimmed.indexOf(":");
    if (sep === -1) continue;
    const key = trimmed.slice(0, sep).trim();
    let value = trimmed.slice(sep + 1).trim();
    value = value.replace(/^['"](.*)['"]$/, "$1");
    fields[key] = value;
  }

  const title = fields.title;
  const publishedAt = fields.publishedAt;
  const summary = fields.summary;

  if (!title || !publishedAt || !summary) {
    throw new Error(
      `Post "${slug}" requires title, publishedAt, and summary frontmatter`,
    );
  }

  return {
    slug,
    title,
    publishedAt,
    summary,
    tags: parseTags(fields.tags),
    draft: parseBool(fields.draft),
    image: fields.image,
    content,
    readingTimeMinutes: estimateReadingTimeMinutes(content),
  };
}

export function selectPublishedPosts(
  posts: readonly PostRecord[],
): PostRecord[] {
  return posts
    .filter((p) => !p.draft)
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function selectLatestPublished(
  posts: readonly PostRecord[],
  limit: number,
): PostRecord[] {
  return selectPublishedPosts(posts).slice(0, limit);
}

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

/** All Posts from disk (including drafts). */
export function getAllPosts(): PostRecord[] {
  return listMdxFiles(WRITINGS_DIR).map((file) => {
    const slug = path.basename(file, path.extname(file));
    const raw = fs.readFileSync(path.join(WRITINGS_DIR, file), "utf-8");
    return parsePostSource(slug, raw);
  });
}

export function getPublishedPosts(): PostRecord[] {
  return selectPublishedPosts(getAllPosts());
}

export function getPostBySlug(slug: string): PostRecord | undefined {
  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post || post.draft) return undefined;
  return post;
}

export function getLatestPublishedPosts(limit = 3): PostRecord[] {
  return selectLatestPublished(getAllPosts(), limit);
}

export function formatPostDate(date: string): string {
  const value = date.includes("T") ? date : `${date}T00:00:00`;
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
