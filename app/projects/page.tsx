import type { Metadata } from "next";
import { ProjectList } from "@/components/project-list";
import { Reveal } from "@/components/reveal";
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
    <section className="pt-16 pb-20 sm:pt-20" aria-labelledby="projects-heading">
      <Reveal>
        <p className="eyebrow mb-4">Index</p>
        <h1 id="projects-heading" className="page-title">
          Projects
        </h1>
        <p className="body-copy mt-4 max-w-[32rem]">
          Shipped work as proof. Each item opens the repo or live demo.
        </p>
        <ProjectList projects={projects} headingId="projects-heading" />
      </Reveal>
    </section>
  );
}
