import { ProjectsIndex } from "@/components/projects-index";
import { listSelectedProjects } from "@/lib/projects";

/** Home selected Projects — same still-thumbnail Editorial pattern as Projects (ADR-0006). */
export function HomeSelectedProjects() {
  const projects = listSelectedProjects();

  return (
    <section
      className="home-section home-section--projects"
      aria-labelledby="home-projects-heading"
    >
      <header className="home-section__intro">
        <h2 id="home-projects-heading" className="home-section__title">
          Selected projects
        </h2>
        <p className="home-section__lede">
          Proof that ships — still, title, and lede. Same Editorial treatment as
          the Projects surface.
        </p>
      </header>
      <ProjectsIndex projects={projects} />
    </section>
  );
}
