import { describe, expect, test } from "bun:test";
import { splitGlossary } from "@/lib/glossary";

const POST = [
  "## tl;dr",
  "",
  "it has that big-model energy [ⓘ](#bigsmall-model-energy).",
  "",
  "---",
  "",
  "## definitions",
  "",
  "### big/small model energy",
  "",
  "how much the model already knows.",
  "",
].join("\n");

describe("splitGlossary", () => {
  test("lifts the closing section out of the body", () => {
    const { body, terms } = splitGlossary(POST);

    expect(body).not.toContain("definitions");
    expect(body).toContain("[ⓘ](#bigsmall-model-energy)");
    expect(terms).toEqual([
      {
        slug: "bigsmall-model-energy",
        term: "big/small model energy",
        definition: "how much the model already knows.",
      },
    ]);
  });

  test("takes the rule that held the section off the end with it", () => {
    expect(splitGlossary(POST).body.trimEnd()).toEndWith(
      "[ⓘ](#bigsmall-model-energy).",
    );
  });

  test("leaves a post without a section alone", () => {
    const source = "## tl;dr\n\nnothing to define here.\n";
    expect(splitGlossary(source)).toEqual({ body: source, terms: [] });
  });

  test("joins a definition written across several lines", () => {
    const [term] = splitGlossary(
      POST.replace(
        "how much the model already knows.",
        "how much the model\nalready knows.",
      ),
    ).terms;
    expect(term.definition).toBe("how much the model already knows.");
  });

  // A `##` inside a fence is code. Treating it as the section start would cut
  // the post short at a comment.
  test("ignores a heading inside a code fence", () => {
    const source = [
      "## tl;dr",
      "",
      "```sh",
      "## definitions",
      "```",
      "",
      "still the body.",
    ].join("\n");
    expect(splitGlossary(source).body).toBe(source);
  });

  test("refuses a term the body never marks", () => {
    expect(() =>
      splitGlossary(POST.replace("[ⓘ](#bigsmall-model-energy)", "plain text")),
    ).toThrow(/never marked/);
  });

  test("refuses a term with nothing written under it", () => {
    expect(() =>
      splitGlossary(POST.replace("how much the model already knows.", "")),
    ).toThrow(/no definition/);
  });
});
