import {
  ArrowUpRight,
  BoxIcon,
  ChatIcon,
  DeviceIcon,
  DocumentIcon,
  GithubIcon,
  GridIcon,
  QueueIcon,
  ServerIcon,
  TerminalIcon,
  WindowIcon,
} from "@/components/icons";
import { IconTile } from "@/components/icon-tile";
import { Tag } from "@/components/tag";
import { destinationHost, type Project, type ProjectKind } from "@/lib/projects";

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
 * The project's own mark where it has one, the kind glyph where it does not.
 *
 * A silhouette is drawn as a mask in the row's own ink, so a project mark and
 * a kind glyph are the same weight of thing and the gutter stays one column of
 * one colour. A mark that carries its own colour is drawn as an image, grey
 * until the row is under the pointer — the reference's treatment, and the
 * reason is the same: eight logos at full saturation is a sponsor wall.
 */
function ProjectMark({ project }: { project: Project }) {
  if (project.logo?.mono) {
    return (
      <span
        aria-hidden
        className="mt-0.5 size-6 shrink-0 bg-muted-foreground transition-colors duration-150 ease-out select-none group-hover/project:bg-foreground"
        style={{
          maskImage: `url(${project.logo.src})`,
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
        }}
      />
    );
  }

  if (project.logo) {
    return (
      // A 465-byte SVG at 24px: there is nothing for the image optimizer to
      // do to it, and routing it through one would cost a request.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.logo.src}
        alt=""
        aria-hidden
        width={24}
        height={24}
        className="mt-0.5 size-6 shrink-0 grayscale transition-[filter] duration-150 ease-out select-none group-hover/project:grayscale-0"
      />
    );
  }

  const KindIcon = KIND_ICONS[project.kind] ?? BoxIcon;
  return (
    <IconTile className="mt-0.5">
      <KindIcon />
    </IconTile>
  );
}

/**
 * One Project, as a row across the page — the same shape a Post row has, on
 * purpose. `/projects` and `/blog` are the same page twice, and a Visitor who
 * has read one list should not have to learn how the other one is read.
 *
 * The row used to keep its sentence and its facts behind a disclosure, which
 * made an index of eight rows eight names and eight identical years: nothing
 * to scan, and a filter matching text nobody could see. What a row knows, a
 * row says. The whole row is one door — the thing itself — and the repository
 * gets its own small door when it is somewhere else.
 */
export function ProjectRow({
  project,
  headingAs = "h3",
}: {
  project: Project;
  headingAs?: "h2" | "h3";
}) {
  const Heading = headingAs;
  const href = project.live ?? project.url;
  // Only when the live thing is not already the repository, so no row carries
  // two controls that land in the same place.
  const source = project.live ? project.url : null;
  const tags = [project.language, project.note, String(project.year)].filter(
    Boolean,
  ) as string[];

  return (
    <li className="border-b border-line last:border-b-0">
      {/* `relative` scopes the stretched link to this row, so the next
          Project's name never falls under this one's target. */}
      <div className="group/project relative flex items-start gap-4 p-4 transition-[background-color] duration-150 ease-out hover:bg-accent-muted">
        <ProjectMark project={project} />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Heading className="leading-snug font-medium">
            <a href={href} target="_blank" rel="noopener noreferrer">
              <span aria-hidden className="absolute inset-0" />
              {project.name}
            </a>
          </Heading>

          <p className="typeset typeset-description text-muted-foreground">
            {project.description}
          </p>

          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li key={tag} className="flex">
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-center">
          {/* Where the row lands, said in words rather than left to the
              browser's status bar — and only under the pointer, because it is
              a confirmation of a choice rather than one more thing to read. */}
          <span
            aria-hidden
            className="font-mono text-xs text-muted-foreground opacity-0 transition-opacity duration-150 ease-out group-hover/project:opacity-100 max-sm:hidden"
          >
            {destinationHost(project)}
          </span>

          {/* `after:-inset-2` is the hit area: 16px of glyph is a target only
              a mouse can hit, and this is a link a thumb has to be able to
              take without leaving for the live site by mistake. */}
          {source ? (
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} source on GitHub`}
              className="relative flex size-6 touch-manipulation items-center justify-center text-muted-foreground transition-[color] duration-150 ease-out after:absolute after:-inset-2 hover:text-foreground active:text-foreground"
            >
              <GithubIcon className="pointer-events-none size-4" />
            </a>
          ) : null}

          <ArrowUpRight
            aria-hidden
            className="size-4 text-muted-foreground transition-colors duration-150 ease-out group-hover/project:text-foreground"
          />
        </div>
      </div>
    </li>
  );
}
