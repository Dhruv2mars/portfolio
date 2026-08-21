"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { formatCompactTokens } from "@/lib/ai-activity";
import { cn } from "@/lib/utils";

/**
 * Fig. 1 — the year so far, as one line.
 *
 * The plate carries the record, not an ornament. Everything drawn here is a
 * measurement: the curve is tokens per day, the labels are the scale it is
 * read against, and there is nothing else — no gridlines, no frame, no
 * tooltip. A hero is looked at, not interrogated, so the figure answers the
 * only question it is asked from across the room: how much, and which way.
 */

export type HeroChartPoint = { day: number; value: number };
export type HeroChartMonth = { day: number; label: string };

type HeroChartProps = {
  points: HeroChartPoint[];
  months: HeroChartMonth[];
  ticks: number[];
  xDomain: [number, number];
  yDomain: [number, number];
  /** Read instead of the drawing, by anyone who is not looking at it. */
  description: string;
  className?: string;
};

/**
 * The scale lives inside the plot, at the left, not in a gutter beside it.
 *
 * An axis column would cost the curve a tenth of its width to draw a rule
 * nobody reads. Set the numbers on the drawing instead and they are found
 * exactly when they are wanted and invisible the rest of the time.
 */
const Y_GUTTER = 48;
/** The stub after each number — enough to point at the level, not a rule. */
const TICK_DASH = 7;
/** Room above the curve so the peak has air rather than the plate's edge. */
const TOP_ROOM = 26;
/** And below the month row, so it sits on the plate rather than on the rule. */
const BOTTOM_ROOM = 8;

const LABEL_SIZE = 10;

type TickProps = {
  x?: number;
  y?: number;
  payload?: { value: number };
};

function labelStyle(size: number): React.CSSProperties {
  return {
    fontFamily: "var(--font-mono)",
    fontSize: size,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "0.02em",
  };
}

function YTick({ x = 0, y = 0, payload, size }: TickProps & { size: number }) {
  return (
    <g
      transform={`translate(${x},${y})`}
      className="fill-muted-foreground/70 stroke-muted-foreground/45"
    >
      <text
        x={-(TICK_DASH + 5)}
        dy="0.32em"
        textAnchor="end"
        style={labelStyle(size)}
        stroke="none"
      >
        {formatCompactTokens(payload?.value ?? 0)}
      </text>
      <line x1={-TICK_DASH} x2={-1} y1={0} y2={0} strokeWidth={1} />
    </g>
  );
}

function XTick({
  x = 0,
  y = 0,
  payload,
  labels,
  size,
}: TickProps & { labels: Map<number, string>; size: number }) {
  const label = labels.get(payload?.value ?? -1);
  if (!label) return null;
  return (
    <text
      x={x}
      y={y}
      dy="0.9em"
      textAnchor="middle"
      className="fill-muted-foreground/70"
      style={labelStyle(size)}
    >
      {label}
    </text>
  );
}

export function HeroChart({
  points,
  months,
  ticks,
  xDomain,
  yDomain,
  description,
  className,
}: HeroChartProps) {
  const gradientId = useId();
  const reduceMotion = useReducedMotion();
  const monthLabels = new Map(months.map((m) => [m.day, m.label]));

  return (
    <motion.div
      role="img"
      aria-label={description}
      className={cn("size-full text-foreground", className)}
      // The record accumulates left to right, so it arrives that way. A wipe
      // rather than a fade: a fade says "an image loaded", a wipe says "this
      // was measured, in this order". Recharts' own animation is not used —
      // it replays on every container resize, which would make the figure
      // redraw itself each time the window is dragged.
      initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        // Reserve the box on the server so the first paint is the figure and
        // not a hole the figure drops into.
        initialDimension={{ width: 766, height: 394 }}
      >
        <AreaChart
          data={points}
          margin={{ top: TOP_ROOM, right: 0, bottom: BOTTOM_ROOM, left: 0 }}
          // The figure is looked at, not used. No hover state, no crosshair,
          // and no cursor change over a drawing that cannot be clicked.
          style={{ pointerEvents: "none" }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              {/* Weight under the line, thinning to nothing before the
                  baseline — so the area reads as the curve's own shadow
                  rather than as a filled shape with an edge of its own. */}
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.2} />
              <stop offset="45%" stopColor="currentColor" stopOpacity={0.075} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            type="number"
            dataKey="day"
            domain={xDomain}
            ticks={months.map((m) => m.day)}
            interval={0}
            axisLine={false}
            tickLine={false}
            height={20}
            tick={<XTick labels={monthLabels} size={LABEL_SIZE} />}
          />
          <YAxis
            type="number"
            domain={yDomain}
            ticks={ticks}
            interval={0}
            axisLine={false}
            tickLine={false}
            width={Y_GUTTER}
            tick={<YTick size={LABEL_SIZE} />}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="currentColor"
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`url(#${gradientId})`}
            fillOpacity={1}
            isAnimationActive={false}
            activeDot={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
