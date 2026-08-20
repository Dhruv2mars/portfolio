"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useId, type PointerEvent as ReactPointerEvent } from "react";

/**
 * The name, drawn rather than set: a 7-row bitmap on the same square cell the
 * activity grid uses, so the page closes on the unit it opened with.
 *
 * Two passes over one cell set. The first is a hairline outline that is always
 * there — the name is present on the page whether or not anyone touches it.
 * The second fills those same cells through a gradient that is transparent
 * until 62.5% of its own length and solid after, and the gradient's near end is
 * tied to the pointer. So the ink is not painted *at* the cursor; it runs away
 * from it, and moving across the mark tips a wash of it from one side of the
 * name to the other.
 *
 * At rest the near end sits at the horizontal middle, which makes the gradient
 * vertical: the bottom of the letters is inked and the tops fade to outline, so
 * the signature reads as filling up rather than as waiting for a mouse. A
 * phone, which never sends a pointer, gets that resting state and nothing else
 * — which is the point of choosing a resting state that stands on its own.
 *
 * The cells are declared once in `<defs>` and drawn twice with `<use>`, so the
 * markup carries ~140 rects rather than ~280.
 */
const GLYPHS: Readonly<Record<string, readonly string[]>> = {
  a: [".....", ".....", ".###.", "....#", ".####", "#...#", ".####"],
  d: ["....#", "....#", ".####", "#...#", "#...#", "#...#", ".####"],
  h: ["#....", "#....", "#.##.", "##..#", "#...#", "#...#", "#...#"],
  m: [".....", ".....", "##.##", "#.#.#", "#.#.#", "#.#.#", "#.#.#"],
  r: [".....", ".....", "#.##.", "##..#", "#....", "#....", "#...."],
  s: [".....", ".....", ".####", "#....", ".###.", "....#", "####."],
  u: [".....", ".....", "#...#", "#...#", "#...#", "#..##", ".##.#"],
  v: [".....", ".....", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
};

const ROWS = 7;
/** One blank column between letters — the grid's own gutter, not kerning. */
const TRACKING = 1;

/**
 * Where the wash stops being nothing and starts being ink, measured along the
 * gradient rather than across the mark. The reference's number, and it is the
 * one that makes the resting state work: 0.625 of seven rows puts the tide line
 * between the fifth and sixth, which is where these letterforms have their
 * waist.
 */
const INK_OFFSET = 0.625;

/** Heavy enough that the wash lags the pointer instead of tracking it. */
const SPRING = { stiffness: 150, damping: 25 } as const;

function layout(text: string) {
  const cells: { x: number; y: number }[] = [];
  let cursor = 0;

  for (const char of text) {
    const glyph = GLYPHS[char];
    if (!glyph) continue;
    for (let y = 0; y < glyph.length; y++) {
      for (let x = 0; x < glyph[y].length; x++) {
        if (glyph[y][x] === "#") cells.push({ x: cursor + x, y });
      }
    }
    cursor += glyph[0].length + TRACKING;
  }

  return { cells, width: Math.max(cursor - TRACKING, 0) };
}

export function SiteWordmark({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  // `useId` returns a value fenced in characters that are legal in an HTML id
  // but not in a CSS selector, and `fill="url(#…)"` is read as one. Stripping
  // them back to the counter keeps the uniqueness and loses the hazard.
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const cellsId = `${id}-cells`;
  const inkId = `${id}-ink`;

  const { cells, width } = layout(text);
  const reduced = useReducedMotion();

  /** The pointer as a fraction of the mark's width. Centre is the rest. */
  const ratio = useMotionValue(0.5);
  const x1 = useSpring(useTransform(ratio, [0, 1], [0, width]), SPRING);

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const box = event.currentTarget.getBoundingClientRect();
    if (box.width === 0) return;
    ratio.set((event.clientX - box.left) / box.width);
  };

  return (
    <div
      onPointerMove={handleMove}
      onPointerLeave={() => ratio.set(0.5)}
      className={className}
    >
      <svg
        aria-hidden
        viewBox={`0 0 ${width} ${ROWS}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <g id={cellsId}>
            {cells.map((cell) => (
              <rect
                key={`${cell.x}-${cell.y}`}
                x={cell.x + 0.08}
                y={cell.y + 0.08}
                width={0.84}
                height={0.84}
                rx={0.14}
              />
            ))}
          </g>

          {/* The far end is pinned to the foot of the mark's midline, so the
              pointer only ever swings the near end around it. `userSpaceOnUse`
              because the near end is a coordinate, not a fraction of a box. */}
          <motion.linearGradient
            id={inkId}
            x1={x1}
            y1={0}
            x2={width / 2}
            y2={ROWS}
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset={INK_OFFSET}
              stopColor="currentColor"
              stopOpacity={0}
            />
            <stop offset={1} stopColor="currentColor" />
          </motion.linearGradient>
        </defs>

        <use
          href={`#${cellsId}`}
          fill="none"
          className="stroke-line"
          strokeWidth={0.08}
        />
        <use href={`#${cellsId}`} fill={`url(#${inkId})`} />
      </svg>
    </div>
  );
}
