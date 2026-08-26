import { describe, expect, test } from "bun:test";
import { filterByQuery } from "@/lib/search";

type Row = { name: string; language?: string; note?: string; year: number };

const rows: Row[] = [
  { name: "pi-queue", language: "TypeScript", note: "published on npm", year: 2026 },
  { name: "codexchat", language: "Rust", year: 2026 },
  { name: "block", language: "TypeScript", note: "live demo", year: 2026 },
];

const terms = (row: Row) => [row.name, row.language, row.note, row.year];

describe("filterByQuery", () => {
  test("an empty query is not a filter", () => {
    expect(filterByQuery(rows, "   ", terms)).toHaveLength(3);
  });

  test("case and separators do not have to be typed exactly", () => {
    expect(filterByQuery(rows, "PI QUEUE", terms).map((r) => r.name)).toEqual([
      "pi-queue",
    ]);
    expect(filterByQuery(rows, "piqueue", terms).map((r) => r.name)).toEqual([
      "pi-queue",
    ]);
  });

  test("a number field is matched as its digits", () => {
    expect(filterByQuery(rows, "2026", terms)).toHaveLength(3);
  });

  test("a query cannot straddle two fields", () => {
    // "Rust" is the language and "codexchat" is the name; folding them into one
    // haystack would answer to a string that appears nowhere a reader can see.
    expect(filterByQuery(rows, "codexchatrust", terms)).toEqual([]);
    expect(filterByQuery(rows, "typescriptlivedemo", terms)).toEqual([]);
  });

  test("an absent field is skipped, not matched as a blank", () => {
    expect(filterByQuery(rows, "demo", terms).map((r) => r.name)).toEqual([
      "block",
    ]);
  });
});
