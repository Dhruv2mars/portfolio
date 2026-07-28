import { describe, expect, test } from "bun:test";
import { site } from "./site";

describe("site intro", () => {
  test("names Dhruv Sharma and keeps positioning short", () => {
    expect(site.name).toBe("Dhruv Sharma");
    expect(site.positioning.split(/\s+/).length).toBeLessThanOrEqual(28);
    expect(site.positioning.toLowerCase()).not.toContain("prototype junkie");
    expect(site.positioning.toLowerCase()).not.toContain("feedback addict");
  });

  test("exposes a real status line and a fixed home timezone", () => {
    expect(site.statusNote.lead.length).toBeGreaterThan(0);
    expect(site.statusNote.lead.toLowerCase()).not.toContain("under development");
    expect(site.city.length).toBeGreaterThan(0);
    expect(site.timezone).toBe("Asia/Kolkata");
  });

  test("exposes social destinations for X, GitHub, LinkedIn, and email", () => {
    const labels = site.socials.map((s) => s.label);
    expect(labels).toContain("X");
    expect(labels).toContain("GitHub");
    expect(labels).toContain("LinkedIn");
    expect(labels).toContain("Email");
    for (const social of site.socials) {
      expect(social.href.length).toBeGreaterThan(0);
    }
  });
});
