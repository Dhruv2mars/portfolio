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
} from "@/components/panel";
import { buildActivityWeeks } from "@/lib/activity-grid";
import { formatCompactTokens, materializeAiActivity } from "@/lib/ai-activity";
import { getAiActivityPayload } from "@/lib/ai-activity-store";

export async function ActivitySection() {
  const { payload } = await getAiActivityPayload();
  const activity = materializeAiActivity(payload);
  const weeks = buildActivityWeeks(activity.days);

  return (
    <Panel id="activity">
      <PanelHeader>
        <PanelTitle>
          Token activity
          <CopyLink id="activity" label="Token activity" />
        </PanelTitle>
        {/* The lifetime total, and nothing about how it got here. The feed is
            the site's plumbing; a reader who wanted a build log would be
            reading the repo. */}
        <PanelDescription className="font-mono tabular-nums">
          {formatCompactTokens(activity.lifetimeTokens)} tokens through coding
          agents
        </PanelDescription>
      </PanelHeader>

      <figure className="relative">
        {/* The grid is one tab stop that arrow keys walk — real, and not
            something the interface can say out loud without cluttering the
            caption. It needs a cursor to aim and a gutter to sit in, so it
            only appears where both exist. */}
        <HandwrittenNote className="top-6 right-full mr-5 hidden w-28 flex-col items-end text-right pointer-fine:xl:flex">
          <span className="-rotate-6">arrow keys walk the grid</span>
          <HandwrittenArrow className="translate-x-3 -rotate-6" />
        </HandwrittenNote>

        <ActivityGrid weeks={weeks} />
      </figure>
    </Panel>
  );
}
