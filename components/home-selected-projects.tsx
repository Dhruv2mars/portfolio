import Link from "next/link";
import { ProjectsIndex } from "@/components/projects-index";
import { listSelectedProjects } from "@/lib/projects";

/** Home selected Projects — same still-thumbnail Editorial grid as Projects (ADR-0006). */
export function HomeSelectedProjects() {
  const projects = listSelectedProjects();

  return (
    <section
      className="home-band"
      aria-labelledby="home-projects-heading"
    >
      <header className="home-band__head">
        <div>
          <h2 id="home-projects-heading" className="home-band__title">
            Projects
          </h2>
          <p className="home-band__lede">
            Selected work — each entry carries a still, a title, and a short lede.
          </p>
        </div>
        <Link href="/projects" className="home-band__link">
          View all
        </Link>
      </header>
      <ProjectsIndex projects={projects} />
    </section>
  );
}
