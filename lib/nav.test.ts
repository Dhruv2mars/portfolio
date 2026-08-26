import { describe, expect, test } from "bun:test";
import { isCurrentRoute, navItems } from "@/lib/nav";

describe("navigation shows only what exists", () => {
  test("Blog is absent until a Post is published", () => {
    expect(navItems(false).map((item) => item.label)).not.toContain("Blog");
  });

  test("Blog appears the moment a Post exists", () => {
    expect(navItems(true).map((item) => item.label)).toContain("Blog");
  });

  test("every entry is a route of its own, never an in-page anchor", () => {
    for (const item of navItems(true)) {
      expect(item.href.startsWith("/")).toBe(true);
      expect(item.href).not.toInclude("#");
    }
  });
});

describe("the nav marks the page a reader is on", () => {
  test("a route is current on itself", () => {
    expect(isCurrentRoute("/projects", "/projects")).toBe(true);
    expect(isCurrentRoute("/", "/")).toBe(true);
  });

  test("a route is current inside its own pages", () => {
    expect(isCurrentRoute("/blog", "/blog/shipping-with-agents")).toBe(true);
  });

  test("Home is not current everywhere below it", () => {
    expect(isCurrentRoute("/", "/projects")).toBe(false);
  });

  test("a prefix that is not a segment is a different route", () => {
    expect(isCurrentRoute("/projects", "/projects-archive")).toBe(false);
  });
});
