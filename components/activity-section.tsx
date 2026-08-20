import { ActivityGrid } from "@/components/activity-grid";
import { CopyLink } from "@/components/copy-link";
import {
  HandwrittenArrow,
  HandwrittenNote,
} from "@/components/handwritten-note";
import { Panel, PanelHeader, PanelTitle } from "@/components/panel";
import { buildActivityWeeks } from "@/lib/activity-grid";
import {
  formatCompactTokens,
  formatTokenCount,
  materializeAiActivity,
} from "@/lib/ai-activity";
import { getAiActivityPayload } from "@/lib/ai-activity-store";

/**
 * Four nested windows on the same number, widest first. A lifetime total on its
 * own is a milestone: it goes up and never comes down, so it says nothing about
 * whether the habit is still alive. Read together, the four are the grid said in
 * figures — and they are sums of the very series the cells are drawn from, so
 * they cannot drift out of agreement with the picture below them.
 */
function Stat({ label, tokens }: { label: string; tokens: number }) {
  return (
    <div className="bg-background px-4 py-3">
      <dt className="font-mono text-xs text-muted-foreground">{label}</dt>
      <dd
        className="mt-0.5 font-mono text-xl/none font-medium tabular-nums"
        title={`${formatTokenCount(tokens)} tokens`}
      >
        {formatCompactTokens(tokens)}
      </dd>
    </div>
  );
}

export async function ActivitySection() {
  const { payload } = await getAiActivityPayload();
  const activity = materializeAiActivity(payload);
  const weeks = buildActivityWeeks(activity.days);
  const { totals } = activity;

  return (
    <Panel id="activity">
      <PanelHeader>
        <PanelTitle>
          Token activity
          <CopyLink id="activity" label="Token activity" />
        </PanelTitle>
      </PanelHeader>

      {/* Hairlines by gap rather than by border: at two columns and at four the
          rules land in different places, and a `gap-px` over the line colour
          draws whichever ones the layout actually has. */}
      <dl className="screen-line-bottom grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
        <Stat label="all time" tokens={totals.lifetime} />
        <Stat label="30 days" tokens={totals.days30} />
        <Stat label="7 days" tokens={totals.days7} />
        <Stat label="today" tokens={totals.today} />
      </dl>

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
