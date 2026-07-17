import Link from "next/link";
import { ProjectList } from "@/components/project-list";
import { HOME_SECTION_COPY } from "@/lib/home";
import { getSelectedProjects } from "@/lib/projects";

export function HomeSelectedProjects() {
  const projects = getSelectedProjects();

  return (
    <section
      aria-labelledby="home-projects-heading"
      className="section-home"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="home-projects-heading" className="section-title">
            {HOME_SECTION_COPY["selected-projects"]}
          </h2>
          <p className="mt-2 text-[15px] font-medium tracking-[-0.01em] text-foreground">
            Recent work worth opening
          </p>
        </div>
        <Link
          href="/projects"
          className="link-editorial-muted text-[13px] font-medium"
        >
          View all
        </Link>
      </div>
      <ProjectList
        projects={projects}
        headingId="home-projects-heading"
        compact
      />
    </section>
  );
}
