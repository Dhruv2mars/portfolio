import Link from "next/link";
import { SectionHead } from "@/components/ledger";
import { ProjectList } from "@/components/project-list";
import { getSelectedProjects } from "@/lib/projects";

/**
 * Home — SELECTED WORK. Two-line heading, then the rows at 20px.
 * The section's Field, rule, and Reveal are supplied by the page (DESIGN §4).
 * No index numerals here; the numerals belong to the index at /projects.
 */
export function HomeSelectedProjects() {
  const projects = getSelectedProjects();

  return (
    <>
      <SectionHead
        label="SELECTED WORK"
        value="Work I would ship again, unchanged."
        action={
          <Link href="/projects" className="section-head-link">
            all projects ↗
          </Link>
        }
      />
      <div style={{ marginTop: 20 }} data-reveal-text="">
        <ProjectList projects={projects} label="Selected work" />
      </div>
    </>
  );
}
