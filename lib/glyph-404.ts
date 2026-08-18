/**
 * Numerals drawn as bitmaps, in the same square the activity grid spends a day
 * on. Ten by fourteen with two-cell strokes is the smallest that still reads
 * as type rather than as scatter once the cells are small enough to look like
 * the grid they borrow from. Only the digits `404` needs exist here; anything
 * else is a typo, not a feature.
 */
const DIGITS: Record<string, readonly string[]> = {
  "0": [
    "0011111100",
    "0111111110",
    "1110000111",
    "1100000011",
    "1100000011",
    "1100000011",
    "1100000011",
    "1100000011",
    "1100000011",
    "1100000011",
    "1100000011",
    "1110000111",
    "0111111110",
    "0011111100",
  ],
  "4": [
    "0000001100",
    "0000011100",
    "0000111100",
    "0000111100",
    "0001101100",
    "0011001100",
    "0110001100",
    "0110001100",
    "1100001100",
    "1111111111",
    "1111111111",
    "0000001100",
    "0000001100",
    "0000001100",
  ],
};

export const GLYPH_ROWS = 14;
/** Blank columns between neighbouring digits. Two, because the strokes are. */
const TRACKING = 2;

export type GlyphField = {
  cols: number;
  rows: number;
  /** Row-major, `cols * rows` long. `true` is a lit cell. */
  cells: boolean[];
};

/**
 * Lay digits out left to right, tracked apart but not padded on the outside,
 * and return the plate row-major so a single `map` can draw it.
 */
export function glyphField(text: string): GlyphField {
  const glyphs = [...text].map((char) => {
    const bitmap = DIGITS[char];
    if (!bitmap) throw new Error(`No bitmap for "${char}"`);
    return bitmap;
  });

  const cols = glyphs.reduce(
    (total, bitmap, index) =>
      total + bitmap[0]!.length + (index > 0 ? TRACKING : 0),
    0,
  );
  const cells: boolean[] = [];

  for (let row = 0; row < GLYPH_ROWS; row += 1) {
    glyphs.forEach((bitmap, index) => {
      if (index > 0) cells.push(...new Array<boolean>(TRACKING).fill(false));
      for (const bit of bitmap[row]!) cells.push(bit === "1");
    });
  }

  return { cols, rows: GLYPH_ROWS, cells };
}
