"use client";

import { useId, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { formatTokenCount } from "@/lib/ai-activity";
import type { ActivityDay } from "@/lib/ai-activity";
import {
  formatActivityDate,
  LEVEL_ALPHA,
  type ActivityWeek,
} from "@/lib/activity-grid";

/**
 * 26 columns is what fits a 390px viewport without a scrollbar:
 * 26×12px + 25×2px + the grid's 3px inline padding = 368px inside a 372px rail.
 */
const MOBILE_WEEKS = 26;

function cellLabel(day: ActivityDay): string {
  const date = formatActivityDate(day.date);
  // An unreported day has no number to read out. Saying "0 tokens" here would
  // put the same lie in the screen reader that a filled cell puts on screen.
  if (day.recorded === false) return `${date}: no data`;
  const tokens = `${formatTokenCount(day.tokens)} tokens`;
  return day.live ? `${date}: ${tokens} so far today` : `${date}: ${tokens}`;
}

/**
 * A single tab stop with arrow-key traversal (listbox pattern), so 365 cells
 * never become 365 tab stops. The readout is aria-hidden — the focused
 * option already carries the same sentence.
 */
export function ActivityGrid({ weeks }: { weeks: readonly ActivityWeek[] }) {
  const gridId = useId();
  const slots = useMemo(() => weeks.flatMap((week) => week.cells), [weeks]);
  const lastFilled = useMemo(
    () => slots.reduce((last, slot, i) => (slot ? i : last), 0),
    [slots],
  );
  const [active, setActive] = useState<number | null>(null);

  function move(delta: number) {
    setActive((current) => {
      const next = (current ?? lastFilled) + delta;
      if (next < 0 || next >= slots.length || !slots[next]) return current;
      return next;
    });
  }

  const activeDay = active === null ? null : slots[active];

  return (
    <div className="overflow-x-auto">
      <p
        aria-hidden
        className="mb-2.5 h-4 px-4 font-mono text-xs text-muted-foreground tabular-nums"
      >
        {activeDay ? (
          activeDay.recorded === false ? (
            <>
              <span className="text-foreground">no data</span> ·{" "}
              {formatActivityDate(activeDay.date)}
            </>
          ) : (
            <>
              <span className="text-foreground">
                {formatTokenCount(activeDay.tokens)}
              </span>{" "}
              tokens · {formatActivityDate(activeDay.date)}
              {activeDay.live ? " · so far today" : ""}
            </>
          )
        ) : (
          "hover or focus a day"
        )}
      </p>

      <div
        role="listbox"
        tabIndex={0}
        aria-label="Daily AI token usage, last 12 months"
        aria-activedescendant={
          active !== null && slots[active] ? `${gridId}-${active}` : undefined
        }
        className="activity-grid"
        style={
          {
            "--weeks": weeks.length,
            "--weeks-sm": MOBILE_WEEKS,
          } as CSSProperties
        }
        onFocus={() => setActive((current) => current ?? lastFilled)}
        onBlur={() => setActive(null)}
        onMouseLeave={() => setActive(null)}
        onKeyDown={(event) => {
          const step =
            event.key === "ArrowLeft"
              ? -7
              : event.key === "ArrowRight"
                ? 7
                : event.key === "ArrowUp"
                  ? -1
                  : event.key === "ArrowDown"
                    ? 1
                    : 0;
          if (step === 0) return;
          event.preventDefault();
          move(step);
        }}
      >
        {weeks.map((week, weekIndex) => (
          <div
            key={week.key}
            className="activity-col"
            // Derived, not a fixed nth-child: a 365-day window is 53 or 54
            // columns, and the narrow grid must show exactly MOBILE_WEEKS.
            data-narrow-hidden={
              weekIndex < weeks.length - MOBILE_WEEKS ? "true" : undefined
            }
          >
            {week.monthLabel ? (
              <span className="activity-month">{week.monthLabel}</span>
            ) : null}
            {week.cells.map((day, dayIndex) => {
              const index = weekIndex * 7 + dayIndex;
              if (!day) {
                return <div key={index} aria-hidden />;
              }
              return (
                <div
                  key={index}
                  id={`${gridId}-${index}`}
                  role="option"
                  aria-selected={index === active}
                  aria-label={cellLabel(day)}
                  data-active={index === active}
                  data-live={day.live ? "true" : undefined}
                  data-recorded={day.recorded === false ? "false" : undefined}
                  onMouseEnter={() => setActive(index)}
                  className="activity-cell"
                  style={
                    {
                      "--level": LEVEL_ALPHA[day.intensity] ?? LEVEL_ALPHA[0],
                      "--col": weekIndex,
                    } as CSSProperties
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
