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
    <section className="pt-10 pb-16 sm:pt-14" aria-labelledby="projects-heading">
      <h1
        id="projects-heading"
        className="text-[1.75rem] font-semibold tracking-tight text-foreground text-pretty sm:text-[2rem]"
      >
        Projects
      </h1>
      <p className="mt-4 max-w-[38rem] text-[15px] leading-7 text-muted text-pretty">
        Shipped work as proof. Each link goes out to the repo or demo.
      </p>
      <ProjectList projects={projects} headingId="projects-heading" />
    </section>
  );
}
