import { Row } from "@/components/ledger";
import type { Project } from "@/lib/projects";

/**
 * Projects in the row grammar (DESIGN.md §4). One row style sitewide — this
 * only supplies the data. No thumbnails, no cards, no tag chips, no detail
 * pages, no fake activity strips: CONTEXT forbids them and the list is
 * stronger without them.
 */

/** What the tail crossfades to on hover — the real destination, not a label. */
function destination(url: string): string {
  try {
    return `${new URL(url).hostname.replace(/^www\./, "")} ↗`;
  } catch {
    return "open ↗";
  }
}

export function ProjectList({
  projects,
  numbered = false,
  label,
}: {
  projects: readonly Project[];
  /** `01`–`08` index numerals — the Projects index only (§GRAFT-2). Home omits them. */
  numbered?: boolean;
  /** accessible name for the list */
  label?: string;
}) {
  return (
    <ul {...(label ? { "aria-label": label } : {})}>
      {projects.map((project, i) => (
        <li key={project.name}>
          <Row
            index={numbered ? String(i + 1).padStart(2, "0") : undefined}
            name={project.name}
            /* tabular either way, so the crossfade never reflows */
            tail={project.year !== undefined ? String(project.year) : "—"}
            tailHover={destination(project.url)}
            description={project.description}
            href={project.url}
            external
          />
        </li>
      ))}
    </ul>
  );
}
