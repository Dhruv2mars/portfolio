"use client";

import { useId, useState } from "react";
import type { ActivityDay, AiActivity } from "@/lib/ai-activity";
import { formatTokenCount } from "@/lib/ai-activity";
import { HOME_SECTION_COPY } from "@/lib/home";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function parseUTCDate(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!));
}

function formatTooltipDate(date: string): string {
  return parseUTCDate(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Pad so the grid starts on Sunday (GitHub-style columns = weeks). */
function padToWeeks(days: readonly ActivityDay[]): (ActivityDay | null)[] {
  if (days.length === 0) return [];
  const first = parseUTCDate(days[0]!.date);
  const pad = first.getUTCDay(); // 0 = Sunday
  return [...Array.from({ length: pad }, () => null), ...days];
}

function chunkWeeks(cells: readonly (ActivityDay | null)[]): (ActivityDay | null)[][] {
  const weeks: (ActivityDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

type AiActivityHeatmapProps = {
  activity: AiActivity;
};

export function AiActivityHeatmap({ activity }: AiActivityHeatmapProps) {
  const labelId = useId();
  const [hover, setHover] = useState<ActivityDay | null>(null);
  const weeks = chunkWeeks(padToWeeks(activity.days));

  return (
    <section aria-labelledby={labelId} className="section-home">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2
          id={labelId}
          className="text-[1.125rem] font-semibold tracking-tight text-foreground"
        >
          {HOME_SECTION_COPY["ai-activity"]}
        </h2>
        <p className="text-sm text-muted tabular-nums">
          {formatTokenCount(activity.lifetimeTokens)} lifetime tokens
        </p>
      </div>

      <div className="mt-5 overflow-x-auto pb-1">
        <div
          className="inline-grid gap-[3px]"
          style={{
            gridTemplateColumns: `auto repeat(${weeks.length}, minmax(0, 1fr))`,
          }}
          role="img"
          aria-label="Year of daily AI token usage"
        >
          <div className="grid grid-rows-7 gap-[3px] pr-1.5 text-[10px] leading-none text-muted">
            {WEEKDAYS.map((day, i) => (
              <span
                key={day}
                className="flex h-[11px] items-center"
                style={{ visibility: i % 2 === 1 ? "visible" : "hidden" }}
              >
                {day}
              </span>
            ))}
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-rows-7 gap-[3px]">
              {week.map((day, di) => {
                if (!day) {
                  return (
                    <span
                      key={`pad-${wi}-${di}`}
                      className="h-[11px] w-[11px]"
                      aria-hidden
                    />
                  );
                }
                return (
                  <button
                    key={day.date}
                    type="button"
                    className={`activity-cell intensity-${day.intensity} h-[11px] w-[11px] rounded-[2px] transition-opacity duration-150 ease-[var(--ease-editorial)] hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground`}
                    aria-label={`${formatTooltipDate(day.date)}: ${formatTokenCount(day.tokens)} tokens`}
                    onMouseEnter={() => setHover(day)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(day)}
                    onBlur={() => setHover(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <p className="min-h-[1.25rem] tabular-nums" aria-live="polite">
          {hover
            ? `${formatTooltipDate(hover.date)} · ${formatTokenCount(hover.tokens)} tokens`
            : "\u00a0"}
        </p>
        <div className="flex items-center gap-1.5" aria-hidden>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              className={`activity-cell intensity-${level} h-[11px] w-[11px] rounded-[2px]`}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </section>
  );
}
