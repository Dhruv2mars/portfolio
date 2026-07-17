import type { Metadata } from "next";
import { ProjectList } from "@/components/project-list";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Shipped work as proof — editorial list of outbound projects.",
  openGraph: {
    title: "Projects",
    description: "Shipped work as proof — editorial list of outbound projects.",
  },
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <section className="pt-14 pb-20 sm:pt-16" aria-labelledby="projects-heading">
      <p className="meta-copy mb-4">Index</p>
      <h1 id="projects-heading" className="display-title">
        Projects
      </h1>
      <p className="body-copy mt-5 max-w-[36rem]">
        Shipped work as proof. Each item opens the repo or live demo.
      </p>
      <ProjectList projects={projects} headingId="projects-heading" />
    </section>
  );
}
