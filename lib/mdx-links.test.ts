import { describe, expect, test } from "bun:test";
import { isSafeHref } from "./mdx-links";

describe("isSafeHref", () => {
  test("allows internal paths, hashes, and http(s)/mailto", () => {
    expect(isSafeHref("/writings")).toBe(true);
    expect(isSafeHref("/writings/foo")).toBe(true);
    expect(isSafeHref("#section")).toBe(true);
    expect(isSafeHref("https://example.com")).toBe(true);
    expect(isSafeHref("http://example.com")).toBe(true);
    expect(isSafeHref("mailto:hi@example.com")).toBe(true);
  });

  test("rejects dangerous and protocol-relative urls", () => {
    expect(isSafeHref("javascript:alert(1)")).toBe(false);
    expect(isSafeHref("data:text/html,hi")).toBe(false);
    expect(isSafeHref("//evil.example")).toBe(false);
    expect(isSafeHref("vbscript:msg")).toBe(false);
  });
});
