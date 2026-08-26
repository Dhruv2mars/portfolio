import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { MARK_PATH, MARK_RATIO, MARK_VIEW_BOX, markSvg } from "@/lib/mark";

const icon = readFileSync(new URL("../app/icon.svg", import.meta.url), "utf8");

/** The favicon is a static file, so it cannot import the outline — only match it. */
test("the favicon draws the same outline as the mark", () => {
  const drawn = icon.match(/<path d="([^"]+)"/)?.[1];
  expect(drawn).toBe(MARK_PATH);
});

test("the favicon is square, and the mark is not", () => {
  const [, , w, h] = (icon.match(/viewBox="([^"]+)"/)?.[1] ?? "")
    .split(" ")
    .map(Number);
  expect(w).toBe(h);
  expect(MARK_RATIO).toBeCloseTo(2.7, 1);
});

test("the mark carries no theme it cannot follow", () => {
  // Satori has no stylesheet, so the colour has to be written in at the call.
  expect(markSvg("#fafafa")).toContain('fill="#fafafa"');
  expect(markSvg("#fafafa")).not.toContain("currentColor");
  expect(markSvg("#fafafa")).toContain(MARK_VIEW_BOX);
});

test("no cube survives anywhere the mark is drawn", () => {
  expect(icon).not.toContain("polygon");
});
