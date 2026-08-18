import { CopyLink } from "@/components/copy-link";
import {
  BoxIcon,
  ChatIcon,
  DeviceIcon,
  DocumentIcon,
  GridIcon,
  LinkIcon,
  QueueIcon,
  ServerIcon,
  TerminalIcon,
  WindowIcon,
} from "@/components/icons";
import { IconTile } from "@/components/icon-tile";
import {
  Panel,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/components/panel";
import { Tag } from "@/components/tag";
import {
  destinationHost,
  getProjects,
  type Project,
  type ProjectKind,
} from "@/lib/projects";
import { site } from "@/lib/site";

/**
 * The tile says what the thing is, not who made it — a terminal for a CLI, a
 * pane for a VM host. `BoxIcon` is the fallback so an un-typed row still fills
 * its gutter rather than leaving a hole.
 */
const KIND_ICONS: Record<ProjectKind, typeof BoxIcon> = {
  cli: TerminalIcon,
  queue: QueueIcon,
  app: DeviceIcon,
  server: ServerIcon,
  editor: DocumentIcon,
  canvas: GridIcon,
  chat: ChatIcon,
  vm: WindowIcon,
};

/**
 * Rows share a 24px gutter tile so every title starts on the same optical
 * origin, and the dashed rule separates the marker from the record the way a
 * plate number separates from a plate.
 */
function ProjectItem({ project }: { project: Project }) {
  const KindIcon = KIND_ICONS[project.kind] ?? BoxIcon;

  return (
    <li className="group/project flex items-center border-b border-line transition-colors last:border-b-0 hover:bg-accent-muted">
      <IconTile className="mx-4">
        <KindIcon />
      </IconTile>

      <div className="min-w-0 flex-1 border-l border-dashed border-line">
        <a
          href={project.live ?? project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center gap-2 p-4 pr-2 text-left"
        >
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 leading-snug font-medium text-balance">
              {project.name}
            </h3>
            {/* Two lines below `sm`. Every description here fits two at that
                width except three that spill to a third, and one row an
                em taller than its neighbours is the thing that reads as
                sloppy rather than as emphasis. */}
            <p className="typeset typeset-description text-muted-foreground max-sm:line-clamp-2">
              {project.description}
            </p>
            {/* The facts stay on one line at every width, so eight rows
                stack on one rhythm instead of eight. Below `sm` only the two
                that every row carries survive — language and year. The note
                and the host are longer than a phone column and vary row to
                row, and the row is already a link with an outbound arrow on
                it, so neither is what a thumb came for. */}
            <ul className="mt-2 flex flex-wrap gap-1.5 max-sm:flex-nowrap">
              <li className="flex">
                <Tag>{project.language}</Tag>
              </li>
              <li className="flex">
                <Tag className="tabular-nums">{project.year}</Tag>
              </li>
              {project.note ? (
                <li className="flex max-sm:hidden">
                  <Tag>{project.note}</Tag>
                </li>
              ) : null}
              <li className="flex max-sm:hidden">
                <Tag>{destinationHost(project)}</Tag>
              </li>
            </ul>
          </div>

          <span
            aria-hidden
            className="relative flex size-6 shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover/project:text-foreground"
          >
            <LinkIcon className="pointer-events-none size-4" />
          </span>
        </a>
      </div>
    </li>
  );
}

export function ProjectsSection() {
  const projects = getProjects();

  return (
    <Panel id="work">
      <PanelHeader>
        <PanelTitle>
          Projects
          <PanelTitleSup className="tabular-nums">
            {projects.length}
          </PanelTitleSup>
          <CopyLink id="work" label="Projects" />
        </PanelTitle>
        <PanelDescription>
          Curated, not enumerated — the ones I would defend in a code review.
        </PanelDescription>
      </PanelHeader>

      <ul>
        {projects.map((project) => (
          <ProjectItem key={project.name} project={project} />
        ))}
      </ul>

      <div className="border-t border-line px-4 py-3 text-sm">
        <a
          href={`https://github.com/${site.handle}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline extend-touch-target inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
        >
          Everything else on GitHub
        </a>
      </div>
    </Panel>
  );
}
