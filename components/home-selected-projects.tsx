import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { ProjectList } from "@/components/project-list";
import { Reveal } from "@/components/reveal";
import { HOME_SECTION_COPY } from "@/lib/home";
import { getSelectedProjects } from "@/lib/projects";

export function HomeSelectedProjects() {
  const projects = getSelectedProjects();

  return (
    <section
      aria-labelledby="home-projects-heading"
      className="section-home"
    >
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="home-projects-heading" className="eyebrow">
              {HOME_SECTION_COPY["selected-projects"]}
            </h2>
            <p className="mt-2.5 text-[15px] font-medium tracking-[-0.01em] text-foreground">
              Recent work worth opening
            </p>
          </div>
          <Link href="/projects" className="section-head-link">
            All projects
            <ArrowRight size={11} weight="bold" aria-hidden />
          </Link>
        </div>
        <ProjectList
          projects={projects}
          headingId="home-projects-heading"
          compact
        />
      </Reveal>
    </section>
  );
}
