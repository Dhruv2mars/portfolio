import Image from "next/image";
import type { ProjectIndexRow } from "@/lib/projects";

type ProjectIndexRowProps = {
  project: ProjectIndexRow;
};

export function ProjectIndexRowView({ project }: ProjectIndexRowProps) {
  return (
    <li className="project-row">
      <a
        className="project-row__link"
        href={project.href}
        target="_blank"
        rel="noreferrer"
      >
        <div className="project-row__still">
          <Image
            src={project.stillSrc}
            alt=""
            width={960}
            height={600}
            className="project-row__image"
          />
        </div>
        <div className="project-row__copy">
          <h2 className="project-row__title">{project.title}</h2>
          <p className="project-row__lede">{project.lede}</p>
          <span className="project-row__cta">View project</span>
        </div>
      </a>
    </li>
  );
}
