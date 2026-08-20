import { CopyLink } from "@/components/copy-link";
import { MoreLink } from "@/components/more-link";
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "@/components/panel";
import { ProjectRow } from "@/components/project-row";
import { getProjects } from "@/lib/projects";

/** How many rows the home page carries before it defers to `/projects`. */
export const HOME_PROJECT_LIMIT = 5;

/**
 * The sample on the home page: the first few rows and a door to the rest.
 * `/projects` draws its own panel around the whole list — it is a page rather
 * than a section, so it owns its `h1` and its filter, and shares only the row.
 */
export function ProjectsSection({ limit }: { limit?: number }) {
  const projects = getProjects();
  const shown = limit ? projects.slice(0, limit) : projects;
  const hidden = projects.length - shown.length;

  return (
    <Panel id="projects">
      <PanelHeader>
        <PanelTitle>
          Projects
          <PanelTitleSup className="tabular-nums">
            {projects.length}
          </PanelTitleSup>
          <CopyLink id="projects" label="Projects" />
        </PanelTitle>
      </PanelHeader>

      <ul>
        {shown.map((project) => (
          <ProjectRow key={project.name} project={project} />
        ))}
      </ul>

      {hidden > 0 ? <MoreLink href="/projects">All projects</MoreLink> : null}
    </Panel>
  );
}
