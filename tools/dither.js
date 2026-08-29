/*
 * The dithering engine behind the footer signature.
 *
 * One file, no DOM: `tools/wordmark-studio.html` loads it with a plain script
 * tag so the studio opens straight off the filesystem. The engine knows
 * nothing about letters — it takes a coverage field, a function answering "how
 * much ink is at this point", and decides which cells of a grid survive. The
 * studio builds that field by rasterising real text in whatever font you hand
 * it, which is why the alphabet is no longer hard-coded here.
 *
 * Tune the look in the studio and export from it. Never hand-edit
 * `lib/wordmark-dots.ts`.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Dither = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  /**
   * Everything the look is made of, and what the studio opens on.
   *
   * The box is always `boxWidth` units across, whatever the font, because the
   * mark always spans the whole viewport. Fixing it means the dither sliders —
   * spacing, dot, the repulsion field — keep their meaning when you change
   * typeface, instead of every number needing to be found again.
   *
   * `source` decides where the ink comes from. `text` sets the string below in
   * a real typeface; `artwork` dithers an image you hand it instead, which is
   * how you use lettering that was drawn rather than typed. `artworkInk` says
   * which end of an opaque image is the mark — `dark` for black on white.
   *
   * `sideBearing`, `topAir` and `cut` are fractions of the lettering's own ink,
   * not of the box: bearing of the ink width on each side, air of the ink
   * height above it, and the share of the ink height that falls past the last
   * pixel of the page. Between them they decide how big and how wide the mark
   * sits in its section.
   */
  const DEFAULTS = {
    source: "text",
    text: "dhruv2mars",
    artworkName: "",
    artworkInk: "dark",
    family: "Inter",
    weight: 700,
    italic: false,
    tracking: -0.02,
    wordSpacing: 0,
    transform: "none",

    boxWidth: 1400,
    sideBearing: 0.02,
    topAir: 0.06,
    cut: 0.12,

    spacing: 3,
    stagger: true,
    jitter: 1,
    gamma: 1,
    density: 0.88,
    pattern: "bayer8",

    dot: 2,
    ink: 0.45,
    repelRadius: 120,
    repelStrength: 34,
  };

  const PATTERNS = ["bayer8", "bayer4", "bayer2", "noise", "solid"];
  const TRANSFORMS = ["none", "lowercase", "uppercase"];

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

  /** The value a cell has to beat to keep its dot. */
  function threshold(pattern, ix, iy) {
    if (pattern === "solid") return 0.5;
    if (pattern === "noise") return hash(ix, iy, 7);
    const matrix = BAYER[pattern] || BAYER.bayer8;
    const n = matrix.length;
    return (matrix[iy % n][ix % n] + 0.5) / (n * n);
  }

  /**
   * Walk a grid over the box and keep the cells the pattern lets through.
   *
   * `coverageAt(x, y)` answers with the ink at a point in box units, 0 to 1.
   * Coordinates come back as a flat `[x, y, x, y, …]` run rounded to whole box
   * units, with the jitter already baked in rather than applied at runtime —
   * the site draws exactly these numbers and adds nothing.
   */
  function ditherField(coverageAt, box, options) {
    const p = { ...DEFAULTS, ...(options || {}) };
    const dots = [];
    const rows = Math.ceil(box.height / p.spacing);
    const cols = Math.ceil(box.width / p.spacing);

    for (let iy = 0; iy <= rows; iy++) {
      const stagger = p.stagger && iy % 2 === 1 ? p.spacing / 2 : 0;
      for (let ix = 0; ix <= cols; ix++) {
        const gx = ix * p.spacing + stagger;
        const gy = iy * p.spacing;
        if (gx > box.width || gy > box.height) continue;

        let cover = coverageAt(gx, gy);
        if (cover <= 0) continue;
        if (cover > 1) cover = 1;
        cover = Math.pow(cover, p.gamma) * p.density;
        if (cover <= threshold(p.pattern, ix, iy)) continue;

        const jx = p.jitter ? (hash(ix, iy, 1) - 0.5) * 2 * p.jitter : 0;
        const jy = p.jitter ? (hash(ix, iy, 2) - 0.5) * 2 * p.jitter : 0;
        const x = Math.round(gx + jx);
        const y = Math.round(gy + jy);
        if (x < 0 || y < 0 || x > box.width || y > box.height) continue;
        dots.push(x, y);
      }
    }

    return dots;
  }

  /**
   * Paint a baked run of dots the way the site does.
   *
   * `components/site-wordmark.tsx` and the studio's preview share this so that
   * what the sliders show is what ships — including the part that matters most,
   * which is that every square lands on a whole device pixel and takes back in
   * opacity what rounding its side cost. A fractional `fillRect` is antialiased
   * across two columns, and at phone sizes that smear is the whole signature.
   *
   * Up rather than to nearest: a square rounded down owes an alpha above 1 to
   * make its area back, and there is no such alpha. And no floor on `want`,
   * because flooring the side without repaying the area it added over-inks
   * every width where the dot is under a pixel. Both halves have to match
   * `site-wordmark.tsx` exactly or the preview is lying about the ship.
   */
  function paint(ctx, dots, options) {
    const { scale, offsetX, offsetY, dot, ink, color } = options;
    const want = dot * scale;
    const side = Math.max(1, Math.ceil(want));
    const half = side / 2;

    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = (ink * (want * want)) / (side * side);
    for (let i = 0; i < dots.length; i += 2) {
      ctx.fillRect(
        Math.round(offsetX + dots[i] * scale - half),
        Math.round(offsetY + dots[i + 1] * scale - half),
        side,
        side,
      );
    }
    ctx.restore();
  }

  /** The exact file the site imports, so the studio's export is paste-ready. */
  function toModule(result) {
    const p = result.preset;
    const rows = [];
    for (let i = 0; i < result.dots.length; i += 2) {
      rows.push(`${result.dots[i]},${result.dots[i + 1]}`);
    }

    const lines = [];
    for (let i = 0; i < rows.length; i += 12) {
      lines.push(`  ${rows.slice(i, i + 12).join(", ")},`);
    }

    return `// Generated by tools/wordmark-studio.html — do not edit by hand.
// The mark is a baked run of coordinates, so there is no code path that
// re-letters it. To change it, open the studio, load this preset, and export:
//   ${JSON.stringify(p)}${p.source === "artwork" ? `
// Drawn from artwork, not from a typeface. The preset names the file but
// cannot carry it: reload ${JSON.stringify(p.artworkName || "the image")} in the studio first.` : ""}

/** Where the signature's dots live, and how they behave under the cursor. */
export const WORDMARK = {
  text: ${JSON.stringify(p.text)},
  /** The coordinate space the dots below are expressed in. */
  box: { width: ${result.box.width}, height: ${result.box.height} },
  /** Dot edge, in box units. Squares, because a dither is made of pixels. */
  dot: ${p.dot},
  /** How heavily the mark sits on the page, applied per dot rather than in CSS. */
  ink: ${p.ink},
  /** The fraction of the box the page shows; the rest falls off the bottom. */
  visible: ${result.visible},
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

  return { DEFAULTS, PATTERNS, TRANSFORMS, BAYER, hash, threshold, ditherField, paint, toModule };
});
