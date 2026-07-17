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
      <h2
        id="home-projects-heading"
        className="text-[1.125rem] font-semibold tracking-tight text-foreground"
      >
        {HOME_SECTION_COPY["selected-projects"]}
      </h2>
      <ProjectList
        projects={projects}
        headingId="home-projects-heading"
        compact
      />
    </section>
  );
}
