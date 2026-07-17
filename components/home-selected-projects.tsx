import { ProjectList } from "@/components/project-list";
import { getSelectedProjects } from "@/lib/projects";

export function HomeSelectedProjects() {
  const projects = getSelectedProjects();

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="home-projects-heading"
      className="border-t border-border pt-10 pb-8 sm:pt-12 sm:pb-10"
    >
      <h2
        id="home-projects-heading"
        className="text-[1.125rem] font-semibold tracking-tight text-foreground"
      >
        Selected Projects
      </h2>
      <ProjectList
        projects={projects}
        headingId="home-projects-heading"
        compact
      />
    </section>
  );
}
