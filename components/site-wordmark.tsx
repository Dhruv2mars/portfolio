/**
 * The name, drawn rather than set: a 7-row bitmap on the same square cell the
 * activity grid uses, so the page closes on the unit it opened with.
 *
 * Two layers of the identical cell set — an empty one and a filled one — with
 * the filled layer wiped in from the right as the footer scrolls into view.
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
const CELLS_ID = "site-wordmark-cells";

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
  const { cells, width } = layout(text);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${ROWS}`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <g id={CELLS_ID}>
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
      </defs>

      <use href={`#${CELLS_ID}`} className="wordmark-empty" />
      <use href={`#${CELLS_ID}`} className="wordmark-filled" />
    </svg>
  );
}
