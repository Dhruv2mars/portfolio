import type { Metadata } from "next";
import { ProjectsIndex } from "@/components/projects-index";
import { listIndexProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected work that proves shipping and taste.",
};

export default function ProjectsPage() {
  const projects = listIndexProjects();

  return (
    <section className="projects-surface">
      <header className="projects-surface__intro">
        <h1 className="projects-surface__title">Projects</h1>
        <p className="projects-surface__lede">
          Selected work that proves shipping and taste — each with a still,
          title, and lede.
        </p>
      </header>

      <ProjectsIndex projects={projects} />
    </section>
  );
}
