import type { Project } from "@/lib/projects";

type ProjectListProps = {
  projects: readonly Project[];
  headingId?: string;
  /** Visually smaller section title (Home strip). */
  compact?: boolean;
};

export function ProjectList({
  projects,
  headingId,
  compact = false,
}: ProjectListProps) {
  return (
    <ul
      className="mt-6 space-y-5"
      {...(headingId ? { "aria-labelledby": headingId } : {})}
    >
      {projects.map((project) => (
        <li key={project.name} className="group">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center text-[15px] font-medium text-foreground no-underline transition-opacity duration-200 ease-[var(--ease-editorial)] hover:underline"
            >
              {project.name}
            </a>
            {project.year !== undefined ? (
              <span className="text-sm text-muted tabular-nums">
                {project.year}
              </span>
            ) : null}
          </div>
          <p
            className={
              compact
                ? "mt-1 max-w-[38rem] text-[14px] leading-6 text-muted text-pretty"
                : "mt-1 max-w-[38rem] text-[15px] leading-6 text-muted text-pretty"
            }
          >
            {project.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
