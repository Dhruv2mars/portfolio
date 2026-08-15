import { ActivityGrid } from "@/components/activity-grid";
import { SectionHeading } from "@/components/section-heading";
import { buildActivityWeeks } from "@/lib/activity-grid";
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
    <section id="activity" className="mt-24 scroll-mt-24">
      <SectionHeading
        label="AI activity"
        aside={source === "fallback" ? "fixture" : undefined}
      />

      <p className="mt-7 font-mono text-2xl tracking-tight text-foreground">
        {formatTokenCount(activity.lifetimeTokens)}
      </p>
      <p className="mt-1.5 max-w-[52ch] text-sm text-muted">
        tokens through coding agents since I started measuring — one cell per
        day
        {projecting
          ? ", today ringed rather than filled because it is still a projection."
          : "."}
      </p>

      <div className="mt-8">
        <ActivityGrid weeks={weeks} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 font-mono text-2xs text-dim">
        <span>{provenance}</span>
        <span className="flex items-center gap-1">
          less
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              aria-hidden
              className="size-2 rounded-[2px]"
              style={{ background: `var(--l${level})` }}
            />
          ))}
          more
        </span>
      </div>
    </section>
  );
}
