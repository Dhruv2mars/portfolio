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
  /**
   * Two cuts of the same ten letters. `heavy` is what the footer ships: a fat
   * geometric monoline whose mass is what makes a dither read at all — thin
   * strokes dissolve into loose grit, thick ones pack into a solid slab. Each
   * face carries its own box, so the lockup's proportions travel with it and
   * the letters run edge to edge with no side margin to trim.
   *
   * Metrics, in box units: ink spans y 7 (ascender) to 136 (baseline); the
   * x-height starts at 45. Every letter owns its width and contour, so the
   * lockup is spaced optically rather than stretched across a grid.
   */
  const FACES = {
    heavy: {
      box: { width: 1298, height: 148 },
      gap: 26,
      stroke: 26,
      glyphs: {
        a: {
          width: 112,
          path: "M99 58V123M99 74C91 63 77 58 60 58C34 58 13 71 13 90C13 109 34 123 60 123C78 123 92 115 99 105",
        },
        d: {
          width: 112,
          path: "M99 20V123M99 58H52C30 58 13 72 13 90C13 108 30 123 52 123H99",
        },
        h: { width: 108, path: "M13 20V123M13 75C21 63 35 58 51 58C76 58 95 71 95 91V123" },
        m: {
          width: 164,
          path: "M13 58V123M13 74C20 63 32 58 45 58C65 58 79 70 79 89V123M79 74C86 63 98 58 111 58C132 58 151 70 151 89V123",
        },
        r: { width: 76, path: "M13 58V123M13 79C21 64 35 58 63 58" },
        s: {
          width: 100,
          weight: 0.8,
          path: "M87 69C79 59 68 54 54 54C33 54 19 60 19 71C19 82 32 87 53 91C74 95 87 101 87 111C87 122 72 127 53 127C33 127 19 121 13 113",
        },
        u: { width: 108, path: "M13 58V90C13 109 29 123 54 123C79 123 95 109 95 90V58" },
        v: { width: 104, path: "M13 58L52 123L91 58" },
        "2": {
          width: 104,
          path: "M13 73C15 63 29 58 52 58C76 58 91 67 91 81C91 94 81 103 64 113L13 123H91",
        },
      },
    },
    monoline: {
      box: { width: 1410, height: 148 },
      gap: 44,
      stroke: 15,
      glyphs: {
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
      },
    },
  };

  const FACE_NAMES = Object.keys(FACES);

  /**
   * The studio's opening position, and the preset `gen-dots.mjs` uses when it
   * is given none. Tuned values land back here so the checked-in art stays
   * reproducible from the repository alone.
   */
  const DEFAULTS = {
    text: "dhruv2mars",
    face: "heavy",
    stroke: 26,
    softness: 3,
    spacing: 3,
    stagger: true,
    jitter: 1,
    gamma: 1,
    density: 0.88,
    pattern: "bayer8",
    dot: 2,
    repelRadius: 120,
    repelStrength: 34,
    visible: 0.85,
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

  /** Lay the text out centred in its face's box and flatten it to segments. */
  function segments(text, faceName = DEFAULTS.face, steps = 20) {
    const face = FACES[faceName] || FACES[DEFAULTS.face];
    let cursor = 0;
    const chars = [];
    for (const char of text) {
      const glyph = face.glyphs[char];
      if (!glyph) continue;
      chars.push({ glyph, x: cursor });
      cursor += glyph.width + face.gap;
    }

    const offset = Math.max((face.box.width - Math.max(cursor - face.gap, 0)) / 2, 0);
    const out = [];
    for (const { glyph, x } of chars) {
      for (const line of flatten(glyph.path, offset + x, steps)) {
        for (let i = 0; i + 3 < line.length; i += 2) {
          out.push([line[i], line[i + 1], line[i + 2], line[i + 3], glyph.weight ?? 1]);
        }
      }
    }
    return out;
  }

  /**
   * Distance from a point to the nearest stroke *edge*, negative inside. Each
   * segment carries its glyph's weight, so one letter can be cut lighter than
   * its neighbours without a second pass.
   */
  function signedDistance(segs, px, py, half) {
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
      const d = Math.sqrt(dx * dx + dy * dy) - half * s[4];
      if (d < best) best = d;
    }
    return best;
  }

  /**
   * Sample the lettering onto a grid and keep the cells the dither pattern
   * lets through. Coordinates come back as a flat `[x, y, x, y, …]` run in box
   * units, rounded to whole units — jitter is baked in, not applied later.
   */
  function build(options) {
    const p = { ...DEFAULTS, ...(options || {}) };
    const face = FACES[p.face] || FACES[DEFAULTS.face];
    const box = face.box;
    const segs = segments(p.text, p.face);
    const half = p.stroke / 2;
    const soft = Math.max(p.softness, 0.001);
    const matrix = BAYER[p.pattern];
    const dots = [];

    const rows = Math.ceil(box.height / p.spacing);
    const cols = Math.ceil(box.width / p.spacing);

    for (let iy = 0; iy <= rows; iy++) {
      const stagger = p.stagger && iy % 2 === 1 ? p.spacing / 2 : 0;
      for (let ix = 0; ix <= cols; ix++) {
        const gx = ix * p.spacing + stagger;
        const gy = iy * p.spacing;
        if (gx > box.width || gy > box.height) continue;

        const d = signedDistance(segs, gx, gy, half);
        if (d > soft) continue;

        let cover = (soft - d) / (2 * soft);
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
        if (x < 0 || y < 0 || x > box.width || y > box.height) continue;
        dots.push(x, y);
      }
    }

    return { box, preset: p, dots };
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
  /** The fraction of the box the page shows; the rest falls off the bottom. */
  visible: ${p.visible},
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

  return { FACES, FACE_NAMES, DEFAULTS, PATTERNS, segments, build, toModule };
});
