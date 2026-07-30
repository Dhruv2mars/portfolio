"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type {
  ActivityDay,
  AiActivity,
  AiActivitySource,
} from "@/lib/ai-activity";
import {
  formatTokenCount,
  LIVE_COUNT_DURATION_MS,
  LIVE_COUNT_START_RATIO,
  materializeHistory,
  withLiveToday,
} from "@/lib/ai-activity";
import type { AiActivityPayload } from "@/lib/ai-activity-payload";
import { HOME_SECTION_COPY } from "@/lib/home";

const LIVE_REFRESH_MS = 60_000;

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
  // Animated value for the hovered live cell, keyed by date so stale
  // animation results never leak into another day's readout.
  const [anim, setAnim] = useState<{ date: string; value: number } | null>(
    null,
  );

  useEffect(() => {
    if (!day?.live || reduceMotion || day.tokens <= 0) return;

    const date = day.date;
    const target = day.tokens;
    const start = Math.round(target * LIVE_COUNT_START_RATIO);
    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / LIVE_COUNT_DURATION_MS);
      const value = Math.round(start + (target - start) * easeOutCubic(t));
      setAnim({ date, value });
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [day, reduceMotion]);

  if (!day) return null;
  return anim && anim.date === day.date ? anim.value : day.tokens;
}

type AiActivityHeatmapProps = {
  payload: AiActivityPayload;
  source: AiActivitySource;
};

export function AiActivityHeatmap({ payload, source }: AiActivityHeatmapProps) {
  const labelId = useId();
  const reduce = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [liveNow, setLiveNow] = useState<Date | null>(null);

  // First clock read happens inside rAF to avoid hydration mismatch without a
  // synchronous setState in the effect body.
  useEffect(() => {
    const id = window.setInterval(() => setLiveNow(new Date()), LIVE_REFRESH_MS);
    const frame = window.requestAnimationFrame(() => setLiveNow(new Date()));
    return () => {
      window.clearInterval(id);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  // History is cacheable; only the live today cell refreshes on the interval.
  const history = useMemo(() => materializeHistory(payload), [payload]);

  const activity: AiActivity = useMemo(() => {
    if (!liveNow) return history;
    return withLiveToday(history, liveNow);
  }, [history, liveNow]);

  // Resolve from current activity so live-cell refreshes keep the footer in sync.
  const hover = useMemo(
    () =>
      hoverDate
        ? (activity.days.find((d) => d.date === hoverDate) ?? null)
        : null,
    [activity.days, hoverDate],
  );

  const liveDisplay = useLiveTokenDisplay(hover, reduce);
  const weeks = useMemo(
    () => chunkWeeks(padToWeeks(activity.days)),
    [activity.days],
  );
  const months = useMemo(() => monthLabels(weeks), [weeks]);
  const isSample = source === "fallback";

  // Keep the most recent weeks in view when the grid overflows.
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [weeks.length]);

  return (
    <motion.section
      aria-labelledby={labelId}
      className="section-home"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h2 id={labelId} className="eyebrow">
            {HOME_SECTION_COPY["ai-activity"]}
          </h2>
          <p className="mt-2.5 text-[15px] font-medium tracking-[-0.01em] text-foreground">
            Tokens across every agent, daily
            {isSample ? (
              <span className="meta-copy ml-2.5 rounded-full border border-border px-2 py-0.5 align-middle">
                cached seed
              </span>
            ) : null}
          </p>
        </div>
        <p className="text-right">
          <span className="stat-value text-accent-muted">
            {formatTokenCount(activity.lifetimeTokens)}
          </span>
          <span className="meta-copy mt-1 block">lifetime tokens</span>
        </p>
      </div>

      <div className="mt-7 rounded-2xl border border-border bg-surface/40 px-4 py-5 sm:px-5">
        <div
          ref={scrollerRef}
          className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="min-w-fit">
            <div
              className="mb-2 grid gap-[2px]"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, 10px)`,
              }}
              aria-hidden
            >
              {weeks.map((_, wi) => {
                const month = months.find((m) => m.index === wi);
                return (
                  <span
                    key={wi}
                    className="meta-copy h-4 overflow-visible !text-[10px] whitespace-nowrap"
                  >
                    {month?.label ?? ""}
                  </span>
                );
              })}
            </div>

            <div
              className="inline-grid gap-[2px]"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, 10px)`,
              }}
              role="group"
              aria-label="Year of daily AI token usage"
            >
              {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-rows-7 gap-[2px]">
                  {week.map((day, di) => {
                    if (!day) {
                      return (
                        <span
                          key={`pad-${wi}-${di}`}
                          className="size-2.5"
                          aria-hidden
                        />
                      );
                    }
                    return (
                      <button
                        key={day.date}
                        type="button"
                        className={`activity-cell intensity-${day.intensity} size-2.5${day.live ? " live-pulse" : ""}`}
                        aria-label={`${formatTooltipDate(day.date)}: ${formatTokenCount(day.tokens)} tokens${day.live ? " (live estimate)" : ""}`}
                        onMouseEnter={() => setHoverDate(day.date)}
                        onMouseLeave={() => setHoverDate(null)}
                        onFocus={() => setHoverDate(day.date)}
                        onBlur={() => setHoverDate(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p
            className="min-h-5 text-[12px] tabular-nums text-muted"
            aria-live="polite"
          >
            {hover && liveDisplay !== null ? (
              <>
                <span className="font-medium text-foreground">
                  {formatTokenCount(liveDisplay)}
                </span>
                <span className="text-faint"> tokens · </span>
                <span>{formatTooltipDate(hover.date)}</span>
                {hover.live ? <span className="text-faint"> · live</span> : null}
              </>
            ) : (
              <span className="text-faint">Hover a day for detail</span>
            )}
          </p>
          <div
            className="flex items-center gap-[3px] text-[10px] text-faint"
            aria-hidden
          >
            <span className="mr-1">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <span
                key={level}
                className={`activity-cell intensity-${level} size-2.5`}
              />
            ))}
            <span className="ml-1">More</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
