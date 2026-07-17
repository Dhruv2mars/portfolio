import { describe, expect, test } from "bun:test";
import { PRIMARY_NAV } from "./nav";

describe("Primary nav", () => {
  test("exposes exactly Home, Writings, and Projects", () => {
    expect(PRIMARY_NAV.map((item) => item.label)).toEqual([
      "Home",
      "Writings",
      "Projects",
    ]);
  });

  test("routes to /, /writings, and /projects", () => {
    expect(PRIMARY_NAV.map((item) => item.href)).toEqual([
      "/",
      "/writings",
      "/projects",
    ]);
  });
});
