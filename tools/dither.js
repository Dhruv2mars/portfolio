/*
 * The dithering engine behind the footer signature.
 *
 * One file, no DOM: `tools/wordmark-studio.html` loads it with a plain script
 * tag so the studio opens straight off the filesystem, and
 * `tools/gen-dots.mjs` imports it so the checked-in coordinates can be
 * reproduced from the same code the sliders drive. Change the look here or in
 * the studio; never hand-edit `lib/wordmark-dots.ts`.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Dither = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const BOX = { width: 1410, height: 148 };
  const GLYPH_GAP = 44;

  /**
   * The site's own alphabet, monoline. Each letter owns its width and contour
   * so the lockup is spaced optically rather than stretched across a grid.
   */
  const GLYPHS = {
    a: {
      width: 96,
      path: "M82 48V126M82 72C74 54 61 47 46 47C26 47 14 63 14 87C14 111 26 126 46 126C62 126 75 117 82 102",
    },
    d: {
      width: 100,
      path: "M84 12V126M84 52H42C24 52 14 65 14 89C14 113 25 126 44 126H84",
    },
    h: { width: 92, path: "M14 12V126M14 64C26 50 40 46 54 49C70 52 78 64 78 82V126" },
    m: {
      width: 140,
      path: "M14 48V126M14 72C24 54 38 47 52 49C68 51 76 64 76 82V126M76 72C86 54 100 47 114 49C128 51 134 64 134 82V126",
    },
    r: { width: 78, path: "M14 48V126M14 72C24 54 38 47 64 50" },
    s: {
      width: 92,
      path: "M80 58C71 49 59 45 45 45C27 45 16 54 16 67C16 79 26 85 47 90C68 95 80 101 80 112C80 122 67 128 49 128C32 128 20 123 12 114",
    },
    u: { width: 94, path: "M14 48V94C14 115 26 126 46 126C66 126 80 114 80 94V48" },
    v: { width: 92, path: "M12 48L46 126L80 48" },
    "2": {
      width: 96,
      path: "M14 68C16 50 30 42 49 42C69 42 82 52 82 68C82 82 72 92 58 101L16 126H84",
    },
  };

  /**
   * The studio's opening position, and the preset `gen-dots.mjs` uses when it
   * is given none. Tuned values land back here so the checked-in art stays
   * reproducible from the repository alone.
   */
  const DEFAULTS = {
    text: "dhruv2mars",
    stroke: 15,
    softness: 3,
    spacing: 3,
    stagger: true,
    jitter: 1,
    gamma: 1,
    density: 0.88,
    pattern: "bayer8",
    dot: 2,
    repelRadius: 155,
    repelStrength: 44,
  };

  const PATTERNS = ["bayer2", "bayer4", "bayer8", "noise", "solid"];

  const BAYER = {
    bayer2: [
      [0, 2],
      [3, 1],
    ],
    bayer4: [
      [0, 8, 2, 10],
      [12, 4, 14, 6],
      [3, 11, 1, 9],
      [15, 7, 13, 5],
    ],
    bayer8: [
      [0, 32, 8, 40, 2, 34, 10, 42],
      [48, 16, 56, 24, 50, 18, 58, 26],
      [12, 44, 4, 36, 14, 46, 6, 38],
      [60, 28, 52, 20, 62, 30, 54, 22],
      [3, 35, 11, 43, 1, 33, 9, 41],
      [51, 19, 59, 27, 49, 17, 57, 25],
      [15, 47, 7, 39, 13, 45, 5, 37],
      [63, 31, 55, 23, 61, 29, 53, 21],
    ],
  };

  /** A stable 32-bit hash, so jitter and noise survive a reload unchanged. */
  function hash(x, y, salt) {
    let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(salt | 0, 2246822519);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  /** Absolute M/L/H/V/C only — the alphabet above uses nothing else. */
  function flatten(path, ox, steps) {
    const lines = [];
    let current = null;
    let x = 0;
    let y = 0;
    let sx = 0;
    let sy = 0;

    const open = () => {
      current = [];
      lines.push(current);
    };
    const to = (nx, ny) => {
      current.push(nx, ny);
      x = nx;
      y = ny;
    };

    for (const [, op, rest] of path.matchAll(/([MLHVC])([^MLHVC]*)/g)) {
      const n = (rest.match(/-?\d*\.?\d+/g) || []).map(Number);
      if (op === "M") {
        open();
        sx = n[0] + ox;
        sy = n[1];
        to(sx, sy);
        for (let i = 2; i + 1 < n.length; i += 2) to(n[i] + ox, n[i + 1]);
      } else if (op === "L") {
        for (let i = 0; i + 1 < n.length; i += 2) to(n[i] + ox, n[i + 1]);
      } else if (op === "H") {
        for (const v of n) to(v + ox, y);
      } else if (op === "V") {
        for (const v of n) to(x, v);
      } else if (op === "C") {
        for (let i = 0; i + 5 < n.length; i += 6) {
          const x0 = x;
          const y0 = y;
          const [c1x, c1y, c2x, c2y, ex, ey] = [
            n[i] + ox, n[i + 1], n[i + 2] + ox, n[i + 3], n[i + 4] + ox, n[i + 5],
          ];
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            const u = 1 - t;
            to(
              u * u * u * x0 + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * ex,
              u * u * u * y0 + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * ey,
            );
          }
        }
      }
    }

    void sx;
    void sy;
    return lines;
  }

  /** Lay the text out centred in the box and flatten it to line segments. */
  function segments(text, steps = 20) {
    let cursor = 0;
    const chars = [];
    for (const char of text) {
      const glyph = GLYPHS[char];
      if (!glyph) continue;
      chars.push({ glyph, x: cursor });
      cursor += glyph.width + GLYPH_GAP;
    }

    const offset = Math.max((BOX.width - Math.max(cursor - GLYPH_GAP, 0)) / 2, 0);
    const out = [];
    for (const { glyph, x } of chars) {
      for (const line of flatten(glyph.path, offset + x, steps)) {
        for (let i = 0; i + 3 < line.length; i += 2) {
          out.push([line[i], line[i + 1], line[i + 2], line[i + 3]]);
        }
      }
    }
    return out;
  }

  function distanceToSegments(segs, px, py) {
    let best = Infinity;
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      const vx = s[2] - s[0];
      const vy = s[3] - s[1];
      const wx = px - s[0];
      const wy = py - s[1];
      const len = vx * vx + vy * vy;
      let t = len > 0 ? (wx * vx + wy * vy) / len : 0;
      if (t < 0) t = 0;
      else if (t > 1) t = 1;
      const dx = wx - vx * t;
      const dy = wy - vy * t;
      const d = dx * dx + dy * dy;
      if (d < best) best = d;
    }
    return Math.sqrt(best);
  }

  /**
   * Sample the lettering onto a grid and keep the cells the dither pattern
   * lets through. Coordinates come back as a flat `[x, y, x, y, …]` run in box
   * units, rounded to whole units — jitter is baked in, not applied later.
   */
  function build(options) {
    const p = { ...DEFAULTS, ...(options || {}) };
    const segs = segments(p.text);
    const half = p.stroke / 2;
    const soft = Math.max(p.softness, 0.001);
    const matrix = BAYER[p.pattern];
    const dots = [];

    const rows = Math.ceil(BOX.height / p.spacing);
    const cols = Math.ceil(BOX.width / p.spacing);

    for (let iy = 0; iy <= rows; iy++) {
      const stagger = p.stagger && iy % 2 === 1 ? p.spacing / 2 : 0;
      for (let ix = 0; ix <= cols; ix++) {
        const gx = ix * p.spacing + stagger;
        const gy = iy * p.spacing;
        if (gx > BOX.width || gy > BOX.height) continue;

        const d = distanceToSegments(segs, gx, gy);
        if (d > half + soft) continue;

        let cover = (half + soft - d) / (2 * soft);
        cover = cover < 0 ? 0 : cover > 1 ? 1 : cover;
        cover = Math.pow(cover, p.gamma) * p.density;

        let threshold;
        if (p.pattern === "solid") threshold = 0.5;
        else if (p.pattern === "noise") threshold = hash(ix, iy, 7);
        else {
          const n = matrix.length;
          threshold = (matrix[iy % n][ix % n] + 0.5) / (n * n);
        }
        if (cover <= threshold) continue;

        const jx = p.jitter ? (hash(ix, iy, 1) - 0.5) * 2 * p.jitter : 0;
        const jy = p.jitter ? (hash(ix, iy, 2) - 0.5) * 2 * p.jitter : 0;
        const x = Math.round(gx + jx);
        const y = Math.round(gy + jy);
        if (x < 0 || y < 0 || x > BOX.width || y > BOX.height) continue;
        dots.push(x, y);
      }
    }

    return { box: BOX, preset: p, dots };
  }

  /** The exact file the site imports, so the studio's output is paste-ready. */
  function toModule(result) {
    const p = result.preset;
    const rows = [];
    for (let i = 0; i < result.dots.length; i += 2) rows.push(`${result.dots[i]},${result.dots[i + 1]}`);

    const lines = [];
    for (let i = 0; i < rows.length; i += 12) lines.push(`  ${rows.slice(i, i + 12).join(", ")},`);

    return `// Generated by tools/gen-dots.mjs — do not edit by hand.
// Tune the look in tools/wordmark-studio.html, then either paste its export
// here or reproduce it with:
//   bun tools/gen-dots.mjs --preset '${JSON.stringify(p)}' > lib/wordmark-dots.ts

/** Where the signature's dots live, and how they behave under the cursor. */
export const WORDMARK = {
  text: ${JSON.stringify(p.text)},
  /** The coordinate space the dots below are expressed in. */
  box: { width: ${result.box.width}, height: ${result.box.height} },
  /** Dot edge, in box units. Squares, because a dither is made of pixels. */
  dot: ${p.dot},
  /** The invisible circle around the cursor, in box units. */
  repelRadius: ${p.repelRadius},
  /** Peak outward push at the very centre of that circle, in box units. */
  repelStrength: ${p.repelStrength},
} as const;

/** A flat \`[x, y, x, y, …]\` run of ${rows.length} dots. */
export const WORDMARK_DOTS: readonly number[] = [
${lines.join("\n")}
];
`;
  }

  return { BOX, GLYPHS, DEFAULTS, PATTERNS, segments, build, toModule };
});
