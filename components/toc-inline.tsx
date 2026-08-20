import type { TocEntry } from "@/lib/toc";

/**
 * What the post covers, before it starts covering it.
 *
 * The reference floats a minimap in the margin; this frame has no margin —
 * everything on the site lives inside one pair of rails — so the contents sit
 * where a contents page has always sat, at the front. It is deliberately not
 * sticky and does not track the reading position: a list that scrolls away
 * after doing its job is honest about being an index rather than a chrome.
 *
 * Fewer than two headings is not a structure worth listing, and the caller is
 * expected to render nothing in that case.
 */
export function TocInline({ entries }: { entries: TocEntry[] }) {
  if (entries.length < 2) return null;

  return (
    <nav
      aria-labelledby="toc-label"
      className="screen-line-bottom px-4 py-3.5"
    >
      <p
        id="toc-label"
        className="font-mono text-xs tracking-wider text-muted-foreground uppercase"
      >
        On this page
      </p>

      <ol className="mt-2.5 space-y-1.5">
        {entries.map((entry) => (
          <li
            key={entry.slug}
            // A sub-heading is a step in, drawn as one. No bullets: the indent
            // already says everything a marker would.
            className={entry.depth === 3 ? "pl-4" : undefined}
          >
            <a
              href={`#${entry.slug}`}
              className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
