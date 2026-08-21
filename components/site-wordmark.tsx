"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useId, type MouseEvent as ReactMouseEvent } from "react";

/** The same plate-scale canvas as the reference footer graphic. */
const VIEWBOX_WIDTH = 1410;
const VIEWBOX_HEIGHT = 258;
const CELL_HEIGHT = 48;
const TRACKING = 1;
const SPRING = { stiffness: 150, damping: 25 } as const;

/**
 * Five-row orthogonal glyphs. The cells are only a layout source. At render
 * time, adjacent cells share edges, so the SVG draws one clean outline instead
 * of a stack of rounded rectangles.
 */
const GLYPHS: Readonly<Record<string, readonly string[]>> = {
  a: [".###.", "#...#", "#####", "#...#", "#...#"],
  d: ["####.", "#...#", "#...#", "#...#", "####."],
  h: ["#...#", "#...#", "#####", "#...#", "#...#"],
  m: ["#...#", "##.##", "#.#.#", "#...#", "#...#"],
  r: ["####.", "#...#", "####.", "#..#.", "#...#"],
  s: [".####", "#....", ".###.", "....#", "####."],
  u: ["#...#", "#...#", "#...#", "#...#", ".###."],
  v: ["#...#", "#...#", "#...#", ".#.#.", "..#.."],
  "2": [".###.", "#...#", "....#", "...#.", "#####"],
};

type Cell = { x: number; y: number };

function layout(text: string) {
  const cells: Cell[] = [];
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

  return {
    cells,
    columns: Math.max(cursor - TRACKING, 1),
  };
}

function formatCoordinate(value: number) {
  return value.toFixed(3).replace(/\.?(0+)$/, "");
}

function buildPaths(cells: Cell[], columns: number) {
  const cellWidth = (VIEWBOX_WIDTH - 2) / columns;
  const occupied = new Set(cells.map((cell) => `${cell.x}:${cell.y}`));
  const fill: string[] = [];
  const outline: string[] = [];

  for (const cell of cells) {
    const x0 = 1 + cell.x * cellWidth;
    const x1 = 1 + (cell.x + 1) * cellWidth;
    const y0 = 1 + cell.y * CELL_HEIGHT;
    const y1 = y0 + CELL_HEIGHT;
    const x = formatCoordinate(x0);
    const right = formatCoordinate(x1);
    const y = formatCoordinate(y0);
    const bottom = formatCoordinate(y1);

    fill.push(`M${x} ${y}H${right}V${bottom}H${x}Z`);

    if (!occupied.has(`${cell.x}:${cell.y - 1}`)) {
      outline.push(`M${x} ${y}H${right}`);
    }
    if (!occupied.has(`${cell.x + 1}:${cell.y}`)) {
      outline.push(`M${right} ${y}V${bottom}`);
    }
    if (!occupied.has(`${cell.x}:${cell.y + 1}`)) {
      outline.push(`M${right} ${bottom}H${x}`);
    }
    if (!occupied.has(`${cell.x - 1}:${cell.y}`)) {
      outline.push(`M${x} ${bottom}V${y}`);
    }
  }

  return { fill: fill.join(""), outline: outline.join("") };
}

export function SiteWordmark({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const gradientId = `${id}-gradient`;
  const reduced = useReducedMotion();
  const ratio = useMotionValue(0.5);
  const gradientX1 = useSpring(
    useTransform(ratio, [0, 1], [0, VIEWBOX_WIDTH]),
    SPRING,
  );
  const { cells, columns } = layout(text);
  const paths = buildPaths(cells, columns);

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (reduced) return;

    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;

    ratio.set((event.clientX - rect.left) / rect.width);
  };

  return (
    <div
      className={`screen-line-bottom after:z-1 after:bg-foreground/15 ${className ?? ""}`}
    >
      <div
        className="overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => ratio.set(0.5)}
      >
        <div className="flex w-full items-center justify-center">
          <svg
            aria-hidden
            className="mx-auto block h-auto w-full max-w-[1120px]"
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={paths.fill}
              fill={`url(#${gradientId})`}
              fillRule="nonzero"
            />
            <path
              d={paths.outline}
              className="stroke-foreground/10"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
            />
            <defs>
              <motion.linearGradient
                id={gradientId}
                x1={gradientX1}
                y1="1"
                x2="705"
                y2="257"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0.625"
                  stopColor="var(--foreground)"
                  stopOpacity="0"
                />
                <stop offset="1" stopColor="var(--foreground)" />
              </motion.linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
