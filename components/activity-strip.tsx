import { materializeAiActivity } from "@/lib/ai-activity";
import { getAiActivityPayload } from "@/lib/ai-activity-store";

/**
 * Motif recurrence (DESIGN.md §6 §GRAFT-1).
 *
 * The year grid lives on Home only, but its DNA appears on every page in two
 * lower grades so Blog and Projects are not identity-less:
 *   Pulse — 7 cells, 6px, inside the header pill
 *   Trace — 52 cells, 8px, directly above the footer rule
 *
 * Both are real data and both are decorative echoes: aria-hidden, no
 * interaction, no tooltip. The readable version is on Home.
 */

async function recentIntensities(count: number): Promise<number[]> {
  const { payload } = await getAiActivityPayload();
  const activity = materializeAiActivity(payload, new Date(), {
    includeLiveToday: false,
  });
  return activity.days.slice(-count).map((d) => d.intensity);
}

function Strip({
  levels,
  cell,
  gap,
}: {
  levels: number[];
  cell: number;
  gap: number;
}) {
  const width = levels.length * cell + (levels.length - 1) * gap;
  return (
    <svg
      width={width}
      height={cell}
      viewBox={`0 0 ${width} ${cell}`}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      style={{ display: "block", flex: "none" }}
    >
      {levels.map((level, i) => (
        <rect
          key={i}
          className="grid-cell"
          data-l={level}
          x={i * (cell + gap)}
          y={0}
          width={cell}
          height={cell}
          rx={1}
        />
      ))}
    </svg>
  );
}

/** 7 days, 6px cells — the header pill's own heartbeat. */
export async function ActivityPulse() {
  const levels = await recentIntensities(7);
  return <Strip levels={levels} cell={6} gap={2} />;
}

/** 52 weeks' worth of days sampled weekly, 8px cells — above the footer rule. */
export async function ActivityTrace() {
  const levels = await recentIntensities(52);
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-start", marginBottom: 20 }}
    >
      <Strip levels={levels} cell={8} gap={2} />
    </div>
  );
}
