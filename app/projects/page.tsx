import type { Metadata } from "next";
import { Field, Rule, SectionHead } from "@/components/ledger";
import { ProjectList } from "@/components/project-list";
import { Reveal } from "@/components/reveal";
import { getProjects } from "@/lib/projects";

const DESCRIPTION =
  "Shipped work as proof — an editorial index of projects, each row opening straight to its repo.";

export const metadata: Metadata = {
  title: "Projects",
  description: DESCRIPTION,
  openGraph: {
    title: "Projects",
    description: DESCRIPTION,
  },
};

/**
 * Projects index (DESIGN.md §8): heading · rule · lead · 60 · rows with
 * `01`–`08` index numerals and the year swapping to the destination on hover.
 * Every gap below is a multiple of 20.
 */
export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <Reveal as="section">
      <Field>
        <div style={{ paddingTop: 100, paddingBottom: 160 }}>
          <h1 className="sr-only">Projects</h1>
          <SectionHead
            label={`PROJECTS / ${projects.length}`}
            value="Everything worth keeping, in the order it was made."
          />
          <div style={{ marginTop: 40 }}>
            <Rule />
          </div>
          <p className="t-lead" data-reveal-text="" style={{ marginTop: 20 }}>
            Terminal toys, local-first AI tooling, and Android apps. Every row
            opens its repo.
          </p>
          <div style={{ marginTop: 60 }} data-reveal-text="">
            <ProjectList projects={projects} numbered label="Projects" />
          </div>
        </div>
      </Field>
    </Reveal>
  );
}
