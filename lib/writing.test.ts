import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildRssFeed,
  getPublishedWriting,
  getWritingBySlug,
  listSelectedWriting,
  parseFrontmatter,
  writingContentDir,
  writingJsonLd,
} from "./writing";

const tempDirs: string[] = [];

function makeWritingDir(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "writing-"));
  tempDirs.push(dir);
  for (const [name, body] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), body, "utf8");
  }
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("Writing collection", () => {
  it("parses title, publishedAt, and summary from frontmatter", () => {
    const { metadata, content } = parseFrontmatter(`---
title: 'How to decide'
publishedAt: '2026-01-15'
summary: 'A short lede.'
---

Body copy.`);

    expect(metadata).toEqual({
      title: "How to decide",
      publishedAt: "2026-01-15",
      summary: "A short lede.",
    });
    expect(content).toBe("Body copy.");
  });

  it("returns an empty published list when the collection has no MDX", () => {
    const dir = makeWritingDir({});
    expect(getPublishedWriting(dir)).toEqual([]);
  });

  it("listSelectedWriting returns latest published pieces up to the limit", () => {
    const dir = makeWritingDir({
      "a.mdx": `---
title: A
publishedAt: '2025-01-01'
summary: First.
---

A.`,
      "b.mdx": `---
title: B
publishedAt: '2026-06-01'
summary: Second.
---

B.`,
      "c.mdx": `---
title: C
publishedAt: '2026-03-01'
summary: Third.
---

C.`,
    });

    expect(listSelectedWriting(2, dir).map((piece) => piece.slug)).toEqual([
      "b",
      "c",
    ]);
    expect(listSelectedWriting(3, dir)).toHaveLength(3);
    expect(listSelectedWriting(3, makeWritingDir({}))).toEqual([]);
  });

  it("uses the in-repo content/writing directory by default (empty is valid)", () => {
    expect(writingContentDir.endsWith(path.join("content", "writing"))).toBe(
      true,
    );
    expect(getPublishedWriting()).toEqual([]);
  });

  it("lists published pieces newest-first and looks up by slug", () => {
    const dir = makeWritingDir({
      "older.mdx": `---
title: Older
publishedAt: '2025-01-01'
summary: First.
---

Older body.`,
      "newer.mdx": `---
title: Newer
publishedAt: '2026-06-01'
summary: Second.
---

Newer body.`,
      "draft.mdx": `---
title: Draft
publishedAt: '2026-07-01'
summary: Hidden.
draft: true
---

Draft body.`,
    });

    const published = getPublishedWriting(dir);
    expect(published.map((piece) => piece.slug)).toEqual(["newer", "older"]);
    expect(getWritingBySlug("newer", dir)?.metadata.title).toBe("Newer");
    expect(getWritingBySlug("draft", dir)).toBeNull();
    expect(getWritingBySlug("missing", dir)).toBeNull();
  });

  it("builds an empty RSS channel when there are no pieces", () => {
    const xml = buildRssFeed([], {
      title: "Dhruv Sharma — Writing",
      description: "Long-form Writing.",
      baseUrl: "https://dhruv2mars.com",
    });

    expect(xml).toContain("<channel>");
    expect(xml).toContain("<title>Dhruv Sharma — Writing</title>");
    expect(xml).not.toContain("<item>");
  });

  it("builds RSS items and JSON-LD from the same collection fields", () => {
    const dir = makeWritingDir({
      "piece.mdx": `---
title: 'Ship the plumbing'
publishedAt: '2026-03-01'
summary: 'Empty is honest.'
---

Hello.`,
    });
    const [piece] = getPublishedWriting(dir);
    expect(piece).toBeDefined();

    const xml = buildRssFeed([piece!], {
      title: "Writing",
      description: "Feed",
      baseUrl: "https://dhruv2mars.com",
    });
    expect(xml).toContain("<title>Ship the plumbing</title>");
    expect(xml).toContain("https://dhruv2mars.com/writing/piece");

    const jsonLd = writingJsonLd(piece!, "https://dhruv2mars.com");
    expect(jsonLd["@type"]).toBe("BlogPosting");
    expect(jsonLd.url).toBe("https://dhruv2mars.com/writing/piece");
    expect(jsonLd.headline).toBe("Ship the plumbing");
  });
});
