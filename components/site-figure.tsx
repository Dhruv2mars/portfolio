import { cn } from "@/lib/utils";

/**
 * Fig. 1 — the hero construction.
 *
 * Drawn, not rendered: faces are outlined and hatched rather than filled with
 * tone, and the floor lattice runs off every edge of the plate to be cut there.
 * That is the frame's own habit — a line is stopped by the viewport, never
 * tidied to fit — and it is what keeps the figure attached to the page instead
 * of floating on it.
 *
 * Geometry is true isometric: one edge length, the 30° axes, everything else
 * derived. This is a figure, not the brand mark — the mark is `ShortMark`.
 */

const EDGE = 20;
const HALF_W = (EDGE * Math.sqrt(3)) / 2; // horizontal run of one axis
const HALF_H = EDGE / 2; // vertical rise of one axis

function points(pairs: Array<[number, number]>): string {
  return pairs.map(([x, y]) => `${round(x)},${round(y)}`).join(" ");
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/** Corner (i, j) of the cell lattice, raised by `lift` edge-lengths. */
function corner(i: number, j: number, lift: number): [number, number] {
  return [(i - j) * HALF_W, (i + j) * HALF_H - lift * EDGE];
}

/** Footprint is inclusive on both axes; `thick` and `lift` are in edge-lengths. */
type Slab = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  lift: number;
  thick: number;
};

/**
 * Three platforms stepping down toward the viewer. Authored back-to-front:
 * side faces are painted with the page background, so each slab occludes the
 * one behind it without any depth sorting.
 */
const SLABS: readonly Slab[] = [
  { x0: 0, y0: 0, x1: 3, y1: 1, lift: 1.2, thick: 0.4 },
  { x0: 2, y0: 2, x1: 7, y1: 3, lift: 0.6, thick: 0.4 },
  { x0: 5, y0: 4, x1: 11, y1: 5, lift: 0, thick: 0.4 },
];

function SlabShape({ slab }: { slab: Slab }) {
  const { x0, y0, x1, y1, lift, thick } = slab;
  const back = corner(x0, y0, lift);
  const right = corner(x1 + 1, y0, lift);
  const front = corner(x1 + 1, y1 + 1, lift);
  const left = corner(x0, y1 + 1, lift);
  const drop = thick * EDGE;
  const down = ([x, y]: [number, number]): [number, number] => [x, y + drop];

  return (
    <g stroke="currentColor" strokeWidth={0.6} strokeLinejoin="round">
      <polygon
        points={points([left, front, down(front), down(left)])}
        fill="var(--background)"
        strokeOpacity={0.55}
      />
      <polygon
        points={points([front, right, down(right), down(front)])}
        fill="var(--background)"
        strokeOpacity={0.35}
      />
      <polygon
        points={points([back, right, front, left])}
        fill="url(#site-figure-hatch)"
        strokeOpacity={0.7}
      />
    </g>
  );
}

/** Generous enough that every line leaves the viewBox rather than ending in it. */
const FLOOR = { lo: -8, hi: 20, centre: 6 };

function FloorLattice() {
  const lines: Array<[[number, number], [number, number], number]> = [];
  for (let n = FLOOR.lo; n <= FLOOR.hi; n += 1) {
    // Fade with distance from the figure so the cut ends are already faint.
    const fade = Math.max(
      0,
      1 - Math.abs(n - FLOOR.centre) / (FLOOR.hi - FLOOR.lo) / 0.55,
    );
    if (fade === 0) continue;
    lines.push([
      corner(FLOOR.lo, n, -0.4),
      corner(FLOOR.hi, n, -0.4),
      fade,
    ]);
    lines.push([
      corner(n, FLOOR.lo, -0.4),
      corner(n, FLOOR.hi, -0.4),
      fade,
    ]);
  }

  return (
    <g stroke="currentColor" strokeWidth={0.5}>
      {lines.map(([[x1, y1], [x2, y2], fade], i) => (
        <line
          key={i}
          x1={round(x1)}
          y1={round(y1)}
          x2={round(x2)}
          y2={round(y2)}
          strokeOpacity={round(0.16 * fade)}
        />
      ))}
    </g>
  );
}

export function SiteFigure({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="-193 -34 490 232"
      // Cover, don't letterbox. The plate is a window onto a larger drawing,
      // so the lattice runs to all four edges and is cut there.
      preserveAspectRatio="xMidYMid slice"
      className={cn("text-foreground", className)}
      aria-hidden="true"
      {...props}
    >
      <defs>
        {/* Hatching on the 30° axis, so the shading is made of the same lines
            as everything else on the page. */}
        <pattern
          id="site-figure-hatch"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-30)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="5"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeOpacity="0.3"
          />
        </pattern>
      </defs>

      <FloorLattice />
      {SLABS.map((slab) => (
        <SlabShape key={`${slab.x0}-${slab.y0}-${slab.lift}`} slab={slab} />
      ))}
    </svg>
  );
}
