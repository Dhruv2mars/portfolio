"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ActivityDay, AiActivity } from "@/lib/ai-activity";
import {
  formatTokenCount,
  LIVE_COUNT_DURATION_MS,
  LIVE_COUNT_START_RATIO,
} from "@/lib/ai-activity";
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

function padToWeeks(days: readonly ActivityDay[]): (ActivityDay | null)[] {
  if (days.length === 0) return [];
  const first = parseUTCDate(days[0]!.date);
  const pad = first.getUTCDay();
  return [...Array.from({ length: pad }, () => null), ...days];
}

function chunkWeeks(
  cells: readonly (ActivityDay | null)[],
): (ActivityDay | null)[][] {
  const weeks: (ActivityDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function monthLabels(
  weeks: (ActivityDay | null)[][],
): { index: number; label: string }[] {
  const labels: { index: number; label: string }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, index) => {
    for (const day of week) {
      if (!day) continue;
      const date = parseUTCDate(day.date);
      const month = date.getUTCMonth();
      if (month !== lastMonth) {
        labels.push({
          index,
          label: date.toLocaleDateString("en-US", {
            month: "short",
            timeZone: "UTC",
          }),
        });
        lastMonth = month;
      }
      break;
    }
  });

  return labels;
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function useLiveTokenDisplay(
  day: ActivityDay | null,
  reduceMotion: boolean | null,
): number | null {
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    if (!day) {
      setDisplay(null);
      return;
    }
    if (!day.live || reduceMotion || day.tokens <= 0) {
      setDisplay(day.tokens);
      return;
    }

    const target = day.tokens;
    const start = Math.round(target * LIVE_COUNT_START_RATIO);
    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / LIVE_COUNT_DURATION_MS);
      const value = Math.round(start + (target - start) * easeOutCubic(t));
      setDisplay(value);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    setDisplay(start);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [day, reduceMotion]);

  return display;
}

type AiActivityHeatmapProps = {
  activity: AiActivity;
};

export function AiActivityHeatmap({ activity }: AiActivityHeatmapProps) {
  const labelId = useId();
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<ActivityDay | null>(null);
  const liveDisplay = useLiveTokenDisplay(hover, reduce);
  const weeks = useMemo(
    () => chunkWeeks(padToWeeks(activity.days)),
    [activity.days],
  );
  const months = useMemo(() => monthLabels(weeks), [weeks]);
  const isSample = activity.source === "fallback";

  return (
    <motion.section
      aria-labelledby={labelId}
      className="section-home"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div>
          <h2 id={labelId} className="section-title">
            {HOME_SECTION_COPY["ai-activity"]}
          </h2>
          <p className="mt-2 text-[15px] font-medium tracking-[-0.01em] text-foreground">
            Combined token usage across agents
            {isSample ? " (cached seed until first nightly sync)" : ""}
          </p>
        </div>
        <p className="meta-copy rounded-full border border-border bg-background-muted px-2.5 py-1">
          {formatTokenCount(activity.lifetimeTokens)} lifetime
        </p>
      </div>

      <div className="mt-6 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="min-w-[640px]">
          <div
            className="mb-2 grid gap-[3px] pl-[28px]"
            style={{
              gridTemplateColumns: `repeat(${weeks.length}, 12px)`,
            }}
            aria-hidden
          >
            {weeks.map((_, wi) => {
              const month = months.find((m) => m.index === wi);
              return (
                <span
                  key={wi}
                  className="meta-copy h-4 overflow-visible whitespace-nowrap"
                >
                  {month?.label ?? ""}
                </span>
              );
            })}
          </div>

          <div
            className="inline-grid gap-[3px]"
            style={{
              gridTemplateColumns: `auto repeat(${weeks.length}, 12px)`,
            }}
            role="img"
            aria-label="Year of daily AI token usage"
          >
            <div className="grid grid-rows-7 gap-[3px] pr-2 text-[10px] leading-none text-faint">
              {WEEKDAYS.map((day, i) => (
                <span
                  key={day}
                  className="flex h-3 items-center"
                  style={{ visibility: i % 2 === 1 ? "visible" : "hidden" }}
                >
                  {day.slice(0, 3)}
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
                        className="size-3"
                        aria-hidden
                      />
                    );
                  }
                  return (
                    <button
                      key={day.date}
                      type="button"
                      className={`activity-cell intensity-${day.intensity} size-3`}
                      aria-label={`${formatTooltipDate(day.date)}: ${formatTokenCount(day.tokens)} tokens${day.live ? " (live estimate)" : ""}`}
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
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p
          className="min-h-5 text-[13px] tabular-nums text-muted"
          aria-live="polite"
        >
          {hover && liveDisplay !== null ? (
            <>
              <span className="text-foreground">
                {formatTokenCount(liveDisplay)}
              </span>
              <span className="text-faint"> tokens · </span>
              <span>{formatTooltipDate(hover.date)}</span>
              {hover.live ? (
                <span className="text-faint"> · live</span>
              ) : null}
            </>
          ) : (
            <span className="text-faint">Hover a day for detail</span>
          )}
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-faint" aria-hidden>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              className={`activity-cell intensity-${level} size-2.5`}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </motion.section>
  );
}
