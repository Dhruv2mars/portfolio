import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/site-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("SiteHeader", () => {
  it("renders primary nav and contact links", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Writing" })).toHaveAttribute(
      "href",
      "/writing",
    );
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:Dhruv2mars@gmail.com",
    );
    expect(screen.queryByRole("link", { name: "About" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Activity" })).toBeNull();
  });
});
