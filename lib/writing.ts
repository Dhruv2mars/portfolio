import fs from "node:fs";
import path from "node:path";

export type WritingFrontmatter = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  draft?: boolean;
};

export type WritingPiece = {
  slug: string;
  metadata: WritingFrontmatter;
  content: string;
};

export const writingContentDir = path.join(
  process.cwd(),
  "content",
  "writing",
);

function isPublished(metadata: WritingFrontmatter): boolean {
  return metadata.draft !== true;
}

/** Parse YAML-ish frontmatter from an MDX source string. */
export function parseFrontmatter(fileContent: string): {
  metadata: WritingFrontmatter;
  content: string;
} {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  if (!match?.[1]) {
    throw new Error("Writing MDX is missing frontmatter");
  }

  const content = fileContent.replace(frontmatterRegex, "").trim();
  const metadata: Partial<WritingFrontmatter> = {};

  for (const line of match[1].trim().split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    value = value.replace(/^['"](.*)['"]$/, "$1");

    if (key === "draft") {
      metadata.draft = value === "true";
      continue;
    }

    if (
      key === "title" ||
      key === "publishedAt" ||
      key === "summary" ||
      key === "image"
    ) {
      metadata[key] = value;
    }
  }

  if (!metadata.title || !metadata.publishedAt || !metadata.summary) {
    throw new Error(
      "Writing frontmatter requires title, publishedAt, and summary",
    );
  }

  return {
    metadata: metadata as WritingFrontmatter,
    content,
  };
}

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => path.extname(file) === ".mdx")
    .sort();
}

function readWritingFile(filePath: string): Omit<WritingPiece, "slug"> {
  const raw = fs.readFileSync(filePath, "utf8");
  return parseFrontmatter(raw);
}

/** Load every MDX piece from a directory (including drafts). */
export function getAllWriting(dir: string = writingContentDir): WritingPiece[] {
  return listMdxFiles(dir).map((file) => {
    const slug = path.basename(file, path.extname(file));
    const { metadata, content } = readWritingFile(path.join(dir, file));
    return { slug, metadata, content };
  });
}

/** Published Writing only — empty list is a valid v1 state (ADR-0013). */
export function getPublishedWriting(
  dir: string = writingContentDir,
): WritingPiece[] {
  return getAllWriting(dir)
    .filter((piece) => isPublished(piece.metadata))
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime(),
    );
}

/** Lookup by slug among published Writing; null when missing or draft. */
export function getWritingBySlug(
  slug: string,
  dir: string = writingContentDir,
): WritingPiece | null {
  return getPublishedWriting(dir).find((piece) => piece.slug === slug) ?? null;
}

export function formatWritingDate(date: string): string {
  const normalized = date.includes("T") ? date : `${date}T00:00:00`;
  return new Date(normalized).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function writingJsonLd(piece: WritingPiece, baseUrl: string) {
  const ogImage = piece.metadata.image
    ? piece.metadata.image.startsWith("http")
      ? piece.metadata.image
      : `${baseUrl}${piece.metadata.image}`
    : `${baseUrl}/og?title=${encodeURIComponent(piece.metadata.title)}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: piece.metadata.title,
    datePublished: piece.metadata.publishedAt,
    dateModified: piece.metadata.publishedAt,
    description: piece.metadata.summary,
    image: ogImage,
    url: `${baseUrl}/writing/${piece.slug}`,
    author: {
      "@type": "Person",
      name: "Dhruv Sharma",
    },
  };
}

export function buildRssFeed(
  pieces: WritingPiece[],
  options: { title: string; description: string; baseUrl: string },
): string {
  const itemsXml = pieces
    .map(
      (piece) => `        <item>
          <title>${escapeXml(piece.metadata.title)}</title>
          <link>${options.baseUrl}/writing/${piece.slug}</link>
          <description>${escapeXml(piece.metadata.summary)}</description>
          <pubDate>${new Date(piece.metadata.publishedAt).toUTCString()}</pubDate>
        </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(options.title)}</title>
    <link>${options.baseUrl}</link>
    <description>${escapeXml(options.description)}</description>
${itemsXml}
  </channel>
</rss>`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
