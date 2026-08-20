import { describe, expect, test } from "bun:test";
import { slugify } from "@/lib/slug";
import { tableOfContents } from "@/lib/toc";

describe("tableOfContents", () => {
  test("collects h2 and h3 in document order", () => {
    const toc = tableOfContents(
      ["## First", "text", "### Under it", "## Second"].join("\n"),
    );
    expect(toc).toEqual([
      { depth: 2, text: "First", slug: "first" },
      { depth: 3, text: "Under it", slug: "under-it" },
      { depth: 2, text: "Second", slug: "second" },
    ]);
  });

  test("a post with no headings gets no list", () => {
    expect(tableOfContents("Just a paragraph.\n\nAnd another.")).toEqual([]);
  });

  test("ignores an h1 — the title already holds that rank", () => {
    expect(tableOfContents("# Title\n## Section")).toHaveLength(1);
  });

  test("ignores h4 and below, which are too fine to navigate by", () => {
    expect(tableOfContents("#### Footnote")).toEqual([]);
  });

  test("a hash inside a fenced block is code, not a heading", () => {
    const toc = tableOfContents(
      ["## Real", "```bash", "## not a heading", "```", "## Also real"].join(
        "\n",
      ),
    );
    expect(toc.map((entry) => entry.text)).toEqual(["Real", "Also real"]);
  });

  test("a fence closes only on its own character", () => {
    const toc = tableOfContents(
      ["~~~", "```", "## still inside", "~~~", "## out"].join("\n"),
    );
    expect(toc.map((entry) => entry.text)).toEqual(["out"]);
  });

  test("strips code spans, emphasis and link syntax from the label", () => {
    const toc = tableOfContents("## Why `useMemo` and **[Motion](https://x)**");
    expect(toc[0].text).toBe("Why useMemo and Motion");
  });

  test("a closing run of hashes is decoration, not part of the text", () => {
    expect(tableOfContents("## Setup ##")[0]).toEqual({
      depth: 2,
      text: "Setup",
      slug: "setup",
    });
  });

  test("needs a space after the hashes, so #hashtag is prose", () => {
    expect(tableOfContents("##hashtag")).toEqual([]);
  });

  test("the slug is the one the renderer puts on the heading", () => {
    // `components/mdx.tsx` ids its headings with this same function; if the two
    // ever diverged every link in the list would scroll nowhere.
    const toc = tableOfContents("## Tokens & budgets");
    expect(toc[0].slug).toBe(slugify("Tokens & budgets"));
  });
});
