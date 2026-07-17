import { ProjectIndexRowView } from "@/components/project-index-row";
import type { ProjectIndexRow } from "@/lib/projects";

type ProjectsIndexProps = {
  projects: readonly ProjectIndexRow[];
};

export function ProjectsIndex({ projects }: ProjectsIndexProps) {
  if (projects.length === 0) {
    return (
      <p className="projects-index__empty">
        Selected work will appear here once stills are ready.
      </p>
    );
  }

  return (
    <ul className="projects-index__list">
      {projects.map((project) => (
        <ProjectIndexRowView key={project.href} project={project} />
      ))}
    </ul>
  );
}
