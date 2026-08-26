"use client";

import { useMemo } from "react";
import { ProjectRow } from "@/components/project-row";
import { SearchField, SearchStatus } from "@/components/search-field";
import { useMirroredQuery } from "@/components/use-mirrored-query";
import { searchProjects, type Project } from "@/lib/projects";

/**
 * The whole list of projects, with the same filter the blog index has.
 *
 * Eight rows do not strictly need searching. The field is here because the two
 * indexes are the same kind of page and should not behave differently — and
 * because the thing a Visitor actually arrives wanting is usually a language
 * or a kind ("rust", "cli"), which is a word to type rather than a row to find
 * by eye.
 */
export function ProjectSearch({
  projects,
  initialQuery = "",
}: {
  projects: Project[];
  initialQuery?: string;
}) {
  const [query, updateQuery] = useMirroredQuery(initialQuery);
  const shown = useMemo(
    () => searchProjects(projects, query),
    [projects, query],
  );

  return (
    <>
      <SearchField
        value={query}
        onChange={updateQuery}
        label="Search projects"
        placeholder="Search projects…"
      />
      <SearchStatus count={shown.length} noun="project" />

      {shown.length > 0 ? (
        <ul>
          {shown.map((project) => (
            <ProjectRow
              key={project.name}
              project={project}
              headingAs="h2"
            />
          ))}
        </ul>
      ) : (
        <p className="p-4 font-mono text-sm text-muted-foreground">
          No projects match “{query}”.
        </p>
      )}
    </>
  );
}
