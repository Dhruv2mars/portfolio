import { expect, test } from "bun:test";
import { glyphField, GLYPH_ROWS } from "@/lib/glyph-404";

test("404 is three 10-wide digits tracked two columns apart", () => {
  const field = glyphField("404");
  expect(field.cols).toBe(34);
  expect(field.rows).toBe(GLYPH_ROWS);
  expect(field.cells).toHaveLength(34 * GLYPH_ROWS);
  // Tracking columns are 10, 11 and 22, 23 of every row, and never lit.
  for (let row = 0; row < GLYPH_ROWS; row += 1) {
    for (const col of [10, 11, 22, 23]) {
      expect(field.cells[row * 34 + col]).toBe(false);
    }
  }
});

test("every bitmap row is the declared width", () => {
  const { cells, cols } = glyphField("404");
  // A short row would silently shift every cell after it.
  expect(cells.length % cols).toBe(0);
});

test("the crossbar of a 4 is solid and the counter of a 0 stays hollow", () => {
  const { cells } = glyphField("404");
  const row = (r: number) => cells.slice(r * 34, r * 34 + 34);
  // Rows 9 and 10 are the 4's crossbar: ten lit cells under the first digit.
  expect(row(9).slice(0, 10).every(Boolean)).toBe(true);
  expect(row(10).slice(0, 10).every(Boolean)).toBe(true);
  // The 0 occupies columns 12–21; its waist is two walls around a void.
  const zero = row(6).slice(12, 22);
  expect(zero).toEqual([
    true, true, false, false, false, false, false, false, true, true,
  ]);
});

test("an undrawable character is a mistake, not a blank", () => {
  expect(() => glyphField("40x")).toThrow('No bitmap for "x"');
});
