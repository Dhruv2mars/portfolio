import { ActivityGrid } from "@/components/activity-grid";
import { CopyLink } from "@/components/copy-link";
import {
  HandwrittenArrow,
  HandwrittenNote,
} from "@/components/handwritten-note";
import {
  Panel,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/components/panel";
import { Tag } from "@/components/tag";
import { buildActivityWeeks, LEVEL_ALPHA } from "@/lib/activity-grid";
import { formatTokenCount, materializeAiActivity } from "@/lib/ai-activity";
import { getAiActivityPayload } from "@/lib/ai-activity-store";

function updatedLabel(generatedAt: string | null, timeZone: string): string {
  if (!generatedAt) return "";
  const date = new Date(generatedAt);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone,
  }).format(date);
}

export async function ActivitySection() {
  const { payload, source } = await getAiActivityPayload();
  const activity = materializeAiActivity(payload);
  const weeks = buildActivityWeeks(activity.days);
  const updated = updatedLabel(activity.generatedAt, activity.timezone);
  // Only a feed published through yesterday earns a projected today.
  const projecting = activity.days.at(-1)?.live === true;

  const provenance =
    source === "fallback"
      ? "fixture data — the live feed is unavailable"
      : !updated
        ? ""
        : projecting
          ? `updated ${updated}`
          : `feed stalled — last updated ${updated}`;

  return (
    <Panel id="activity">
      <PanelHeader>
        <PanelTitle>
          AI activity
          <PanelTitleSup>{formatTokenCount(activity.lifetimeTokens)}</PanelTitleSup>
          <CopyLink id="activity" label="AI activity" />
        </PanelTitle>
        <PanelDescription>
          Tokens through coding agents since I started measuring — one cell per
          day
          {projecting
            ? ", today ringed rather than filled because it is still a projection."
            : "."}
        </PanelDescription>
      </PanelHeader>

      <figure className="relative">
        {/* The grid is one tab stop that arrow keys walk — real, and not
            something the interface can say out loud without cluttering the
            caption. It needs a cursor to aim and a gutter to sit in, so it
            only appears where both exist. */}
        <HandwrittenNote className="top-6 right-full mr-5 hidden w-28 flex-col items-end text-right pointer-fine:xl:flex">
          <span className="-rotate-6">arrow keys walk the grid</span>
          <HandwrittenArrow className="translate-x-3 -rotate-6 -scale-x-100" />
        </HandwrittenNote>

        <div className="py-4">
          <ActivityGrid weeks={weeks} />
        </div>

        <figcaption className="flex items-center justify-between gap-4 border-t border-line px-4 py-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="tracking-wide text-muted-foreground/80">
              Fig. 2.
            </span>
            {source === "fallback" ? <Tag>fixture</Tag> : null}
            <span>{provenance}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 font-mono text-xs">
            less
            {LEVEL_ALPHA.map((alpha) => (
              <span
                key={alpha}
                aria-hidden
                className="size-2.5"
                style={{
                  background: `color-mix(in oklab, var(--muted-foreground) ${alpha}, transparent)`,
                }}
              />
            ))}
            more
          </span>
        </figcaption>
      </figure>
    </Panel>
  );
}
