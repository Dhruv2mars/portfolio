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
      <header className="page-intro">
        <h1 className="page-intro__title">Projects</h1>
        <p className="page-intro__lede">
          Selected work across local-first AI, tools, and interfaces — each with
          a still, a title, and a short lede.
        </p>
      </header>

      <ProjectsIndex projects={projects} />
    </section>
  );
}
