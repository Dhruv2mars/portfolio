import { GlossaryMark } from "@/components/glossary-mark";
import { CustomLink } from "@/components/mdx";
import type { GlossaryTerm } from "@/lib/glossary";

/**
 * The MDX overrides that turn a post's glossary marks into what they mean.
 *
 * A mark is written as an ordinary link — `[ⓘ](#figure-out-ability)` — so the
 * source file stays a markdown file that reads correctly anywhere else, and
 * `raw.md` still hands a model a document with the definitions at the end.
 * Only the rendered page swaps the link for the definition itself.
 */
export function glossaryComponents(terms: GlossaryTerm[]) {
  const bySlug = new Map(terms.map((entry) => [entry.slug, entry]));

  function GlossaryAnchor(
    props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
  ) {
    const entry = props.href?.startsWith("#")
      ? bySlug.get(props.href.slice(1))
      : undefined;

    if (!entry) return <CustomLink {...props} />;

    return <GlossaryMark term={entry.term} definition={entry.definition} />;
  }

  return { a: GlossaryAnchor };
}
