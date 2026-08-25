import { slugify } from "@/lib/slug";

export type GlossaryTerm = {
  /** Matches the `#slug` a mark in the body points at. */
  slug: string;
  term: string;
  definition: string;
};

/** Fences, in both spellings — a `##` inside one is code, not a section. */
const FENCE = /^\s{0,3}(`{3,}|~{3,})/;

const DEFINITIONS = /^##\s+definitions\s*#*\s*$/i;
const TERM = /^###\s+(.+?)\s*#*\s*$/;
const RULE = /^\s{0,3}(-{3,}|\*{3,}|_{3,})\s*$/;

/**
 * A post's closing `## Definitions` section, lifted out of the body.
 *
 * A definition is not the argument — it is what you need for one sentence of
 * it, and a reader who has to jump to the end of the post and back to get it
 * has lost the sentence. So the section never renders: each `### Term` becomes
 * a mark beside the term's first mention, and the body ends at the Verdict.
 *
 * The source file keeps the section as written — it is what `raw.md` serves
 * and what a model reading the post gets — so this is where the post is
 * presented, not where it is edited.
 */
export function splitGlossary(source: string): {
  body: string;
  terms: GlossaryTerm[];
} {
  const lines = source.split("\n");
  let fence: string | null = null;
  let start = -1;

  for (let i = 0; i < lines.length; i += 1) {
    const fenced = FENCE.exec(lines[i]);
    if (fenced) {
      if (fence === null) fence = fenced[1][0];
      else if (fenced[1][0] === fence) fence = null;
      continue;
    }
    if (fence !== null) continue;
    if (DEFINITIONS.test(lines[i])) {
      start = i;
      break;
    }
  }

  if (start === -1) return { body: source, terms: [] };

  const body = lines.slice(0, start);
  // The rule above the section was holding it off the end of the post. With
  // the section gone it would be a line under the last paragraph, closing a
  // door onto nothing.
  while (body.length > 0) {
    const last = body[body.length - 1];
    if (last.trim() === "" || RULE.test(last)) body.pop();
    else break;
  }

  const terms: GlossaryTerm[] = [];
  for (const line of lines.slice(start + 1)) {
    const heading = TERM.exec(line);
    if (heading) {
      const term = heading[1].trim();
      terms.push({ slug: slugify(term), term, definition: "" });
      continue;
    }
    const current = terms[terms.length - 1];
    if (!current || line.trim() === "") continue;
    current.definition = current.definition
      ? `${current.definition} ${line.trim()}`
      : line.trim();
  }

  const rendered = body.join("\n");
  for (const { slug, term, definition } of terms) {
    if (!definition) {
      throw new Error(`Glossary term "${term}" has no definition under it.`);
    }
    // A term nobody marks would leave the post with the definition written and
    // nowhere for it to show — the one way this could lose an author's words,
    // so it fails the build instead of failing quietly.
    if (!rendered.includes(`(#${slug})`)) {
      throw new Error(
        `Glossary term "${term}" is never marked in the body — add a [ⓘ](#${slug}) at its first mention.`,
      );
    }
  }

  return { body: rendered, terms };
}
