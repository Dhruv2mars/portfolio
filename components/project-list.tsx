import { ArrowUpRight } from "@/components/icons";
import type { Project } from "@/lib/projects";

type ProjectListProps = {
  projects: readonly Project[];
  headingId?: string;
  compact?: boolean;
};

export function ProjectList({
  projects,
  headingId,
  compact = false,
}: ProjectListProps) {
  return (
    <ul
      className={
        compact ? "mt-5 divide-y divide-border/70" : "mt-8 divide-y divide-border/70"
      }
      {...(headingId ? { "aria-labelledby": headingId } : {})}
    >
      {projects.map((project) => (
        <li key={project.name}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="row-interactive group flex items-start justify-between gap-4 no-underline"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                <span className="text-[15px] font-medium tracking-[-0.01em] text-foreground">
                  {project.name}
                </span>
                {project.year !== undefined ? (
                  <span className="meta-copy">{project.year}</span>
                ) : null}
              </div>
              <p
                className={
                  compact
                    ? "mt-1 max-w-[36rem] text-[13px] leading-5 text-muted text-pretty"
                    : "mt-1.5 max-w-[36rem] text-[14px] leading-6 text-muted text-pretty"
                }
              >
                {project.description}
              </p>
            </div>
            <ArrowUpRight
              size={14}
              weight="bold"
              aria-hidden
              className="row-arrow mt-1 shrink-0"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
