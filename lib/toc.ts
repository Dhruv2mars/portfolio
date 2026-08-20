import { slugify } from "@/lib/slug";

export type TocEntry = {
  /** 2 or 3. An `h1` in the body would rival the title, so it is not one. */
  depth: 2 | 3;
  text: string;
  slug: string;
};

/**
 * Fences, in both spellings. A `##` inside one is a comment in a shell script,
 * not a section of the post, and a contents list that links to it points at an
 * id that was never rendered.
 */
const FENCE = /^\s{0,3}(`{3,}|~{3,})/;

const HEADING = /^(#{2,3})\s+(.+?)\s*#*\s*$/;

/**
 * Inline marks the renderer eats before the text reaches the page: emphasis,
 * code spans, and the bracket half of a link. The href is dropped with them,
 * so `[Motion](https://motion.dev)` lists as `Motion`.
 */
function plain(text: string): string {
  return text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_]/g, "")
    .trim();
}

/**
 * The post's own headings, in the order it makes them.
 *
 * This reads the MDX source rather than the rendered tree because the tree is
 * built inside `MDXRemote` on the server and never handed back — and reading
 * the source is what lets the list be drawn *above* the body instead of after
 * it. The slug is produced by the same `slugify` the renderer uses, which is
 * the only reason the links land.
 */
export function tableOfContents(source: string): TocEntry[] {
  const entries: TocEntry[] = [];
  let fence: string | null = null;

  for (const line of source.split("\n")) {
    const fenced = FENCE.exec(line);
    if (fenced) {
      // A fence closes only on its own character, so a ``` inside a ~~~ block
      // is content rather than an ending.
      if (fence === null) fence = fenced[1][0];
      else if (fenced[1][0] === fence) fence = null;
      continue;
    }
    if (fence !== null) continue;

    const heading = HEADING.exec(line);
    if (!heading) continue;

    const text = plain(heading[2]);
    if (!text) continue;

    entries.push({
      depth: heading[1].length as 2 | 3,
      text,
      slug: slugify(text),
    });
  }

  return entries;
}
