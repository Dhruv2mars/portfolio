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
 * An axis column costs the curve a fourteenth of its width to draw a rule
 * nobody reads — and worse than the width, it shifts the whole drawing right,
 * so the year opens a thumb inside the plate with a blank band beside it and
 * reads as a picture pushed into its own corner. Asked for no width at all the
 * axis is dropped outright and the scale goes with it, so it keeps its column
 * and the plot is pulled back over the column by the same amount: the numbers
 * are laid on the drawing rather than set beside it, and the year opens at the
 * plate's own left edge. They land on January, which is the quietest fortnight
 * of the record and the part standing behind the monogram, so the only thing
 * they cover is the thing already covered.
 */
const Y_GUTTER = 58;
/**
 * Right edge of the number column, measured from the tick.
 *
 * Mono digits, so every number ends on this line and the column reads as one
 * edge rather than as six labels of different lengths. Set flush to the plate
 * the longest of them — `100M`, six pixels wider than `25M` — hangs a hair off
 * the left edge and is shaved by the frame; this holds the whole column a
 * thumb inside it.
 */
const LABEL_RIGHT = 44;
/** The stub after each number — enough to point at the level, not a rule. */
const TICK_DASH = 7;
/**
 * And the air between the number and its stub.
 *
 * Set tight, the two read as one glyph — `150M—` — and the stub stops being a
 * mark that points at a level and becomes a hyphen. Held apart, the number is
 * a label and the stub is the thing indicating where that label lands, which
 * is what each of them is.
 */
const TICK_GAP = 11;
/**
 * Room above the curve, and below the month row.
 *
 * The budget between them is what decides whether the figure sits in its plate
 * or slumps to the floor of it. Weighted to the top, the curve gets a band of
 * unused sky it never reaches into while the month row is pressed against the
 * name beneath — the drawing then reads as bottom-heavy even though the peak
 * is where the peak belongs. Weighted the other way the curve stands taller in
 * the same plate and the months get a margin to sit in.
 */
const TOP_ROOM = 12;
const BOTTOM_ROOM = 30;

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
  // The offsets run to the right of the tick rather than to its left. The plot
  // is pulled back over the axis column, so the tick stands off the plate's
  // left edge and everything the reader sees is laid inward from it. The `x`
  // recharts hands down is used rather than a constant: drop it and the axis
  // renders six empty groups.
  return (
    <g
      transform={`translate(${x},${y})`}
      className="fill-muted-foreground/70 stroke-muted-foreground/45"
    >
      <text
        x={LABEL_RIGHT}
        dy="0.32em"
        textAnchor="end"
        style={labelStyle(size)}
        stroke="none"
      >
        {formatCompactTokens(payload?.value ?? 0)}
      </text>
      <line
        x1={LABEL_RIGHT + TICK_GAP}
        x2={LABEL_RIGHT + TICK_GAP + TICK_DASH}
        y1={0}
        y2={0}
        strokeWidth={1}
      />
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
      // Not pure foreground. A 1.25px hairline in the text colour is the
      // hardest mark on the page, and it wins an argument with the name set
      // in 32px directly under it — the hero would then be a chart with a
      // caption rather than a person with a record. Held a step back from
      // black it is still the darkest line in the plate and no longer the
      // loudest thing in the hero. The stop below rides the same colour, so
      // the fill follows the line rather than drifting off it.
      className={cn(
        "size-full text-[color-mix(in_oklab,var(--foreground)_82%,var(--background))]",
        className,
      )}
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
          // The axis keeps its width so it still renders — asked for none it is
          // dropped outright and the scale goes with it — and the plot is
          // pulled back over it by the same amount, so the column costs the
          // drawing nothing and the labels end up laid on it rather than
          // beside it.
          margin={{
            top: TOP_ROOM,
            right: 0,
            bottom: BOTTOM_ROOM,
            left: -Y_GUTTER,
          }}
          // The figure is looked at, not used. No hover state, no crosshair,
          // and no cursor change over a drawing that cannot be clicked.
          style={{ pointerEvents: "none" }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              {/* Weight under the line, thinning to nothing before the
                  baseline — so the area reads as the curve's own shadow
                  rather than as a filled shape with an edge of its own. */}
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.22} />
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
