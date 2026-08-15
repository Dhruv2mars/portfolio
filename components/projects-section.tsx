import { ArrowUpRight } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { destinationHost, getProjects } from "@/lib/projects";
import { site } from "@/lib/site";

export function ProjectsSection() {
  const projects = getProjects();

  return (
    <section id="work" className="mt-24 scroll-mt-24">
      <SectionHeading label="work" aside={`${projects.length} selected`} />

      <ul className="mt-2">
        {projects.map((project) => (
          <li key={project.name} className="border-b border-border last:border-0">
            <a
              href={project.live ?? project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="row-item flex items-baseline gap-4"
            >
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="text-base font-medium tracking-tight text-foreground">
                    {project.name}
                  </span>
                  <span className="font-mono text-2xs text-dim">
                    {project.language}
                  </span>
                  {project.note ? (
                    <span className="rounded-full border border-border px-2 py-0.5 font-mono text-2xs text-dim">
                      {project.note}
                    </span>
                  ) : null}
                </span>
                <span className="mt-1.5 block max-w-[52ch] text-sm text-muted">
                  {project.description}
                </span>
              </span>

              <span className="relative shrink-0 font-mono text-2xs text-dim">
                <span className="row-year block tabular-nums">{project.year}</span>
                <span className="row-dest absolute right-0 top-0 flex items-center gap-1 whitespace-nowrap">
                  {destinationHost(project)}
                  <ArrowUpRight className="size-3" />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-6 font-mono text-2xs text-dim">
        <a
          href={`https://github.com/${site.handle}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="link-quiet inline-flex min-h-6 items-center"
        >
          everything else on GitHub
        </a>
      </p>
    </section>
  );
}
