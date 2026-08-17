import { cn } from "@/lib/utils";

/**
 * The mark is a true isometric cube: every face is a rhombus on the 30° axes,
 * generated from one edge length rather than drawn by eye. Three tonal steps
 * of the foreground stand in for light, so the mark inverts correctly with the
 * theme and needs no second asset.
 */

const EDGE = 20;
const HALF_W = (EDGE * Math.sqrt(3)) / 2; // horizontal run of one axis
const HALF_H = EDGE / 2; // vertical rise of one axis

type Cell = { x: number; y: number; z: number };

function points(pairs: Array<[number, number]>): string {
  return pairs.map(([x, y]) => `${round(x)},${round(y)}`).join(" ");
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/** Screen position of a cell's top vertex. */
function origin({ x, y, z }: Cell): [number, number] {
  return [(x - y) * HALF_W, (x + y) * HALF_H - z * EDGE];
}

function Cube({ cell }: { cell: Cell }) {
  const [ox, oy] = origin(cell);
  const top = points([
    [ox, oy],
    [ox + HALF_W, oy + HALF_H],
    [ox, oy + EDGE],
    [ox - HALF_W, oy + HALF_H],
  ]);
  const left = points([
    [ox - HALF_W, oy + HALF_H],
    [ox, oy + EDGE],
    [ox, oy + EDGE + EDGE],
    [ox - HALF_W, oy + HALF_H + EDGE],
  ]);
  const right = points([
    [ox, oy + EDGE],
    [ox + HALF_W, oy + HALF_H],
    [ox + HALF_W, oy + HALF_H + EDGE],
    [ox, oy + EDGE + EDGE],
  ]);

  return (
    <g>
      <polygon points={top} fill="currentColor" fillOpacity="1" />
      <polygon points={left} fill="currentColor" fillOpacity="0.55" />
      <polygon points={right} fill="currentColor" fillOpacity="0.3" />
    </g>
  );
}

/** Painter's algorithm: farther cells first, so nearer ones overlap them. */
function sorted(cells: readonly Cell[]): Cell[] {
  return [...cells].sort((a, b) => a.x + a.y + a.z - (b.x + b.y + b.z));
}

/** The brand mark: one cube. Used at h-8 in the header. */
export function SiteMark({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="-18.5 -1 37 42"
      className={cn("text-foreground", className)}
      aria-hidden="true"
      {...props}
    >
      <Cube cell={{ x: 0, y: 0, z: 0 }} />
    </svg>
  );
}

/**
 * Fig. 1 — a 2×2 base carrying one cube, the smallest arrangement that reads
 * as a structure rather than a shape.
 */
const FIGURE: readonly Cell[] = [
  { x: 0, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 1, y: 1, z: 0 },
  { x: 0, y: 0, z: 1 },
];

export function SiteMarkIsometric({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="-36 -21 72 82"
      className={cn("text-foreground", className)}
      aria-hidden="true"
      {...props}
    >
      {sorted(FIGURE).map((cell) => (
        <Cube key={`${cell.x}${cell.y}${cell.z}`} cell={cell} />
      ))}
    </svg>
  );
}
