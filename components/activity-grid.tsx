"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { formatCompactTokens, type ActivityDay } from "@/lib/ai-activity";
import {
  formatActivityDate,
  LEVEL_ALPHA,
  type ActivityWeek,
} from "@/lib/activity-grid";

/** The rail the strip is drawn on, and what a day may cost inside it. */
const CELL_GAP = 2;
const CELL_MIN = 12;
const CELL_MAX = 18;

/** How long a held arrow key waits before it starts walking, and how fast. */
const REPEAT_DELAY_MS = 300;
const REPEAT_INTERVAL_MS = 55;

const STEP_BY_KEY: Record<string, number> = {
  ArrowLeft: -7,
  ArrowRight: 7,
  ArrowUp: -1,
  ArrowDown: 1,
};

function cellLabel(day: ActivityDay): string {
  return `${formatActivityDate(day.date)}: ${formatCompactTokens(day.tokens)} tokens`;
}

/**
 * A single tab stop with arrow-key traversal (listbox pattern), so a year of
 * cells never becomes a year of tab stops.
 *
 * The caption lives here too. It reads out the day under the cursor, and the
 * cursor is this component's state — lifting it to the section would mean
 * making the whole figure a client component to move one line of text.
 */
export function ActivityGrid({ weeks }: { weeks: readonly ActivityWeek[] }) {
  const gridId = useId();
  const slots = useMemo(() => weeks.flatMap((week) => week.cells), [weeks]);
  const lastFilled = useMemo(
    () => slots.reduce((last, slot, i) => (slot ? i : last), 0),
    [slots],
  );
  const [active, setActive] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // The largest whole-pixel square the rail can hold. Whole pixels because a
  // fractional track rounds unevenly — one week 12px wide, the next 13 — and
  // on a grid of squares that reads as a wobble rather than as a measurement.
  // Measured rather than guessed: the rail is a different width on a phone,
  // and the answer has to be a length before the browser can lay any of it out.
  const [cellSize, setCellSize] = useState(CELL_MIN);

  useEffect(() => {
    const strip = scrollRef.current;
    if (!strip) return;
    const measure = () => {
      const style = getComputedStyle(strip);
      const rail =
        strip.clientWidth -
        parseFloat(style.paddingInlineStart) -
        parseFloat(style.paddingInlineEnd) -
        // The grid's own gutter, kept for the focus ring.
        6;
      const fits = Math.floor(
        (rail - (weeks.length - 1) * CELL_GAP) / weeks.length,
      );
      setCellSize(Math.min(CELL_MAX, Math.max(CELL_MIN, fits)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    return () => observer.disconnect();
  }, [weeks.length]);

  // When the record is genuinely wider than the rail, the end of it is the
  // part worth opening on — today is the last column. A rail that is short by
  // only a few pixels is left where it is: scrolling it would push the first
  // week under the edge fade for nothing.
  useEffect(() => {
    const strip = scrollRef.current;
    if (!strip) return;
    const overflow = strip.scrollWidth - strip.clientWidth;
    if (overflow > 64) strip.scrollLeft = strip.scrollWidth;
    // `cellSize` is what decides whether there is an overflow at all, so the
    // rail is only worth opening on its end once that has been measured.
  }, [weeks, cellSize]);

  const move = useCallback(
    (delta: number) => {
      setActive((current) => {
        const next = (current ?? lastFilled) + delta;
        if (next < 0 || next >= slots.length || !slots[next]) return current;
        return next;
      });
    },
    [lastFilled, slots],
  );

  // Held keys walk on our own clock rather than the operating system's. The
  // native repeat rate is a user preference measured in tenths of a second,
  // which on a 365-cell grid is a key you hold for half a minute.
  const repeat = useRef<{ key: string; timers: number[] }>(null);

  const stopRepeat = useCallback(() => {
    repeat.current?.timers.forEach(clearTimeout);
    repeat.current?.timers.forEach(clearInterval);
    repeat.current = null;
  }, []);

  useEffect(() => stopRepeat, [stopRepeat]);

  return (
    <>
      {/* The full record always renders; on a narrow viewport it is reached by
          dragging the strip sideways rather than by dropping half of it.
          A fragment, not a wrapper: `figcaption` has to be a direct child of
          the `figure` the section draws around this. */}
      <div className="py-4">
        <div ref={scrollRef} className="activity-scroll">
          <div
            role="listbox"
            tabIndex={0}
            aria-label="Daily token usage"
            aria-activedescendant={
              active !== null && slots[active] ? `${gridId}-${active}` : undefined
            }
            className="activity-grid"
            style={
              {
                "--weeks": weeks.length,
                "--cell-size": `${cellSize}px`,
              } as CSSProperties
            }
            onFocus={() => setActive((current) => current ?? lastFilled)}
            onBlur={() => {
              stopRepeat();
              setActive(null);
            }}
            onMouseLeave={() => setActive(null)}
            onKeyUp={(event) => {
              if (repeat.current?.key === event.key) stopRepeat();
            }}
            onKeyDown={(event) => {
              const step = STEP_BY_KEY[event.key];
              if (!step) return;
              event.preventDefault();
              // The OS sends its own repeats once the key is held; ours are
              // already running, so those are dropped on the floor.
              if (event.repeat) return;
              stopRepeat();
              move(step);
              const timers: number[] = [];
              timers.push(
                window.setTimeout(() => {
                  timers.push(
                    window.setInterval(() => move(step), REPEAT_INTERVAL_MS),
                  );
                }, REPEAT_DELAY_MS),
              );
              repeat.current = { key: event.key, timers };
            }}
          >
            {weeks.map((week, weekIndex) => (
              <div key={week.key} className="activity-col">
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
      </div>

      {/* The caption row: the plate number and, once there is a cursor on the
          grid, what is under it. The key sits right, where it stays out of the
          way of a line that changes on every cell. */}
      <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line px-4 py-3 text-sm text-muted-foreground">
        <span className="flex min-w-0 items-center gap-2">
          <span className="tracking-wide text-muted-foreground/80">Fig. 2.</span>
          {active !== null && slots[active] ? (
            <span className="truncate font-mono text-xs tabular-nums">
              <span className="text-foreground">
                {formatCompactTokens(slots[active]!.tokens)}
              </span>{" "}
              · {formatActivityDate(slots[active]!.date)}
            </span>
          ) : null}
        </span>

        <span className="ml-auto flex shrink-0 items-center gap-1 font-mono text-xs">
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
    </>
  );
}
