import Link from "next/link";
import { ProjectList } from "@/components/project-list";
import { HOME_SECTION_COPY } from "@/lib/home";
import { getSelectedProjects } from "@/lib/projects";

export function HomeSelectedProjects() {
  const projects = getSelectedProjects();

  return (
    <section
      aria-labelledby="home-projects-heading"
      className="section-home reveal reveal-delay-2"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="home-projects-heading" className="section-title">
          {HOME_SECTION_COPY["selected-projects"]}
        </h2>
        <Link
          href="/projects"
          className="link-editorial-muted text-[13px]"
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
