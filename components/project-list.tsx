import type { Project } from "@/lib/projects";

type ProjectListProps = {
  projects: readonly Project[];
  headingId?: string;
  compact?: boolean;
};

/** host + path, no protocol — e.g. github.com/dhruv2mars/repo */
function prettyUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.host}${u.pathname.replace(/\/$/, "")}`;
  } catch {
    return url;
  }
}

/**
 * Divided CV rows — name → one-line desc → url ↗ → year.
 * Identity from hairlines and ink shifts; no cards, no hover chrome.
 */
export function ProjectList({
  projects,
  headingId,
  compact = false,
}: ProjectListProps) {
  return (
    <ul
      className={compact ? "cv-list mt-5" : "cv-list mt-8"}
      {...(headingId ? { "aria-labelledby": headingId } : {})}
    >
      {projects.map((project) => (
        <li key={project.name}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cv-row"
          >
            <span className="flex min-w-0 flex-1 flex-col gap-x-3 gap-y-0.5 sm:flex-row sm:items-baseline">
              <span className="cv-row-name">{project.name}</span>
              <span className="cv-row-desc">{project.description}</span>
            </span>
            <span className="cv-row-meta">
              <span>{prettyUrl(project.url)} ↗</span>
              {project.year !== undefined ? (
                <span>{project.year}</span>
              ) : null}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
