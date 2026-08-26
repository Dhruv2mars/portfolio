const VIEWBOX_WIDTH = 1410;
const VIEWBOX_HEIGHT = 148;
const GLYPH_GAP = 44;

type Glyph = {
  width: number;
  path: string;
};

/**
 * A custom monoline alphabet for the footer signature. Each letter owns its
 * width and contour, so the lockup is spaced optically instead of stretching
 * a bitmap grid across the canvas.
 */
const GLYPHS: Readonly<Record<string, Glyph>> = {
  a: {
    width: 96,
    path: "M82 48V126M82 72C74 54 61 47 46 47C26 47 14 63 14 87C14 111 26 126 46 126C62 126 75 117 82 102",
  },
  d: {
    width: 100,
    path: "M84 12V126M84 52H42C24 52 14 65 14 89C14 113 25 126 44 126H84",
  },
  h: {
    width: 92,
    path: "M14 12V126M14 64C26 50 40 46 54 49C70 52 78 64 78 82V126",
  },
  m: {
    width: 140,
    path: "M14 48V126M14 72C24 54 38 47 52 49C68 51 76 64 76 82V126M76 72C86 54 100 47 114 49C128 51 134 64 134 82V126",
  },
  r: {
    width: 78,
    path: "M14 48V126M14 72C24 54 38 47 64 50",
  },
  s: {
    width: 92,
    path: "M80 58C71 49 59 45 45 45C27 45 16 54 16 67C16 79 26 85 47 90C68 95 80 101 80 112C80 122 67 128 49 128C32 128 20 123 12 114",
  },
  u: {
    width: 94,
    path: "M14 48V94C14 115 26 126 46 126C66 126 80 114 80 94V48",
  },
  v: {
    width: 92,
    path: "M12 48L46 126L80 48",
  },
  "2": {
    width: 96,
    path: "M14 68C16 50 30 42 49 42C69 42 82 52 82 68C82 82 72 92 58 101L16 126H84",
  },
};

function layout(text: string) {
  const glyphs: Array<Glyph & { char: string; x: number }> = [];
  let cursor = 0;

  for (const char of text) {
    const glyph = GLYPHS[char];
    if (!glyph) continue;

    glyphs.push({ ...glyph, char, x: cursor });
    cursor += glyph.width + GLYPH_GAP;
  }

  const width = Math.max(cursor - GLYPH_GAP, 0);
  const offset = Math.max((VIEWBOX_WIDTH - width) / 2, 0);

  return { glyphs, offset };
}

export function SiteWordmark({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`screen-line-bottom after:z-1 after:bg-foreground/15 ${className ?? ""}`}
    >
      <div className="flex w-full items-center justify-center px-4 py-5 md:px-6 md:py-6">
        <WordmarkSvg
          text={text}
          className="mx-auto block h-auto w-full max-w-[1410px]"
        />
      </div>
    </div>
  );
}

function WordmarkSvg({
  text,
  className,
}: {
  text: string;
  className: string;
}) {
  const { glyphs, offset } = layout(text);

  return (
    <svg
      aria-hidden="true"
      className={className}
      data-wordmark={text}
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke="var(--foreground)"
        strokeOpacity="0.42"
        strokeWidth="13"
        strokeLinecap="square"
        strokeLinejoin="round"
      >
        {glyphs.map((glyph) => (
          <path
            key={`${glyph.char}-${glyph.x}`}
            d={glyph.path}
            transform={`translate(${offset + glyph.x} 0)`}
          />
        ))}
      </g>
    </svg>
  );
}
