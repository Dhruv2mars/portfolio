"use client";

import { useId, useState } from "react";
import {
  BoxIcon,
  ChatIcon,
  ChevronIcon,
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
 * A row is a name and two doors. The name opens the record in place; the arrow
 * leaves for the thing itself. They are separate controls on purpose — a row
 * that both expands and navigates makes the reader guess which one a click
 * bought, and one of the two answers is a lost page.
 *
 * The 56px gutter column carries the kind glyph and the dashed rule runs the
 * full height of the row, so an opened record stays hung off the same rail as
 * its title instead of floating free at the left margin.
 */
export function ProjectRow({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const KindIcon = KIND_ICONS[project.kind] ?? BoxIcon;

  return (
    <li className="border-b border-line last:border-b-0">
      <div className="grid grid-cols-[3.5rem_1fr]">
        <div className="flex h-14 items-center justify-center">
          <IconTile>
            <KindIcon />
          </IconTile>
        </div>

        <div className="flex min-w-0 border-l border-dashed border-line">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen((value) => !value)}
            className="flex h-14 min-w-0 flex-1 touch-manipulation items-center gap-2 pr-2 pl-4 text-left transition-colors hover:bg-accent-muted"
          >
            <h3 className="min-w-0 flex-1 truncate font-medium">
              {project.name}
            </h3>
            <ChevronIcon
              data-open={open}
              className="size-4 shrink-0 text-muted-foreground transition-[rotate,color] duration-200 data-[open=true]:rotate-180 data-[open=true]:text-foreground"
            />
          </button>

          <a
            href={project.live ?? project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} — ${destinationHost(project)}`}
            className="flex h-14 w-12 shrink-0 touch-manipulation items-center justify-center text-muted-foreground transition-colors hover:bg-accent-muted hover:text-foreground"
          >
            <LinkIcon className="size-4" />
          </a>
        </div>
      </div>

      {/* `0fr → 1fr` rather than a measured pixel height: the record can be one
          line or three, and a height the row had to measure first is a height
          that is wrong for one frame. */}
      <div
        id={detailsId}
        data-open={open}
        className="project-details grid grid-cols-[3.5rem_1fr]"
      >
        <div aria-hidden />
        <div className="overflow-hidden border-l border-dashed border-line">
          <div className="px-4 pt-1 pb-4">
            <p className="typeset typeset-description text-muted-foreground">
              {project.description}
            </p>
            {/* One line of facts, separated the way a caption is. Pills would
                make four labels out of four words and put a border around
                each of them. */}
            <p className="mt-2 font-mono text-xs tracking-tight text-muted-foreground/80 tabular-nums">
              {[
                project.language,
                String(project.year),
                project.note,
                destinationHost(project),
              ]
                .filter(Boolean)
                .join("  ·  ")}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
