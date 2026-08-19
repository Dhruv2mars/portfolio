import { CopyLink } from "@/components/copy-link";
import { MoreLink } from "@/components/more-link";
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "@/components/panel";
import { ProjectRow } from "@/components/project-row";
import { getProjects } from "@/lib/projects";

/** How many rows the home page carries before it defers to `/projects`. */
export const HOME_PROJECT_LIMIT = 5;

/**
 * On the home page this is a sample with a door at the bottom; on `/projects`
 * it is the whole list and the door is gone. Same rows either way — the page
 * decides how many, the row decides nothing.
 */
export function ProjectsSection({
  limit,
  as = "h2",
}: {
  limit?: number;
  as?: "h1" | "h2";
}) {
  const projects = getProjects();
  const shown = limit ? projects.slice(0, limit) : projects;
  const hidden = projects.length - shown.length;

  return (
    <Panel id="projects">
      <PanelHeader>
        <PanelTitle as={as}>
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
