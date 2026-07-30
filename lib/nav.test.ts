import { describe, expect, test } from "bun:test";
import { PRIMARY_NAV } from "./nav";

describe("Primary nav", () => {
  test("exposes exactly Home, Blog, and Projects", () => {
    expect(PRIMARY_NAV.map((item) => item.label)).toEqual([
      "Home",
      "Blog",
      "Projects",
    ]);
  });

  test("routes to /, /blog, and /projects", () => {
    expect(PRIMARY_NAV.map((item) => item.href)).toEqual([
      "/",
      "/blog",
      "/projects",
    ]);
  });
});
