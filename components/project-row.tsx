"use client";

import { useId, useState } from "react";
import {
  ArrowUpRight,
  BoxIcon,
  ChatIcon,
  ChevronIcon,
  DeviceIcon,
  DocumentIcon,
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
        className="mx-4 size-6 shrink-0 bg-muted-foreground transition-colors duration-150 ease-out select-none group-hover/project:bg-foreground"
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
        className="mx-4 size-6 shrink-0 grayscale transition-[filter] duration-150 ease-out select-none group-hover/project:grayscale-0"
      />
    );
  }

  const KindIcon = KIND_ICONS[project.kind] ?? BoxIcon;
  return (
    <IconTile className="mx-4">
      <KindIcon />
    </IconTile>
  );
}

/**
 * A row is a name and two doors. The name opens the record in place; the arrow
 * leaves for the thing itself. They are separate controls on purpose — a row
 * that both expands and navigates makes the reader guess which one a click
 * bought, and one of the two answers is a lost page.
 *
 * One hover surface, though. The row lights as a whole, because it is one
 * thing; a title that lit while the gutter beside it stayed cold read as two
 * rows stacked. The arrow is the exception: it darkens on its own, so the
 * reader can see which of the two doors is under the pointer.
 */
export function ProjectRow({
  project,
  headingAs = "h3",
}: {
  project: Project;
  headingAs?: "h2" | "h3";
}) {
  const Heading = headingAs;
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const tags = [project.language, project.note, String(project.year)].filter(
    Boolean,
  ) as string[];

  return (
    <li className="border-b border-line last:border-b-0">
      {/* `relative` scopes the stretched trigger to the row: the record below
          is a sibling, so opening one never puts a button over its own text. */}
      <div className="group/project relative flex items-center transition-[background-color] duration-150 ease-out hover:bg-accent-muted has-[button:active]:bg-accent">
        <ProjectMark project={project} />

        <div className="flex min-w-0 flex-1 items-center gap-2 border-l border-dashed border-line py-4 pr-2 pl-4">
          {/* The whole row toggles, via a pseudo-element rather than a wrapper,
              so the heading stays the button's accessible name. */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen((value) => !value)}
            className="min-w-0 flex-1 touch-manipulation text-left before:absolute before:inset-0"
          >
            <Heading className="truncate leading-snug font-medium">
              {project.name}
            </Heading>
          </button>

          {/* `after:-inset-2` is the hit area: 16px of glyph is a target only a
              mouse can hit, and this is a link a thumb has to be able to take
              without opening the record by mistake. */}
          <a
            href={project.live ?? project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} — ${destinationHost(project)}`}
            className="relative flex size-6 shrink-0 touch-manipulation items-center justify-center text-muted-foreground transition-[color] duration-150 ease-out after:absolute after:-inset-2 hover:text-foreground active:text-foreground"
          >
            <ArrowUpRight className="pointer-events-none size-4" />
          </a>

          <ChevronIcon
            data-open={open}
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground transition-[rotate,color] duration-200 ease-out data-[open=true]:rotate-180 data-[open=true]:text-foreground"
          />
        </div>
      </div>

      {/* `0fr → 1fr` rather than a measured pixel height: the record can be one
          line or three, and a height the row had to measure first is a height
          that is wrong for one frame. */}
      <div id={detailsId} data-open={open} className="project-details grid">
        <div className="overflow-hidden">
          <div className="space-y-4 border-t border-line p-4">
            <p className="typeset typeset-description text-muted-foreground">
              {project.description}
            </p>
            {tags.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <li key={tag} className="flex">
                    <Tag>{tag}</Tag>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}
