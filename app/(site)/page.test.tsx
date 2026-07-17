import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/(site)/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

afterEach(() => {
  cleanup();
});

describe("Home page", () => {
  it("composes hero → Token activity → selected Projects → selected Writing (ADR-0008)", () => {
    render(<HomePage />);

    const title = screen.getByRole("heading", {
      level: 1,
      name: /Dhruv Sharma/i,
    });
    const token = screen.getByRole("region", { name: /Token activity/i });
    const projects = screen.getByRole("region", {
      name: /Selected projects/i,
    });
    const writing = screen.getByRole("region", { name: /Writing/i });

    expect(
      title.compareDocumentPosition(token) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      token.compareDocumentPosition(projects) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      projects.compareDocumentPosition(writing) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    expect(screen.getByText(/AI-pilled design engineer/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^X$/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tablist", { name: /Activity range/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("grid", { name: /Contribution grid/i }),
    ).toBeInTheDocument();

    // Selected Projects use still + title editorial rows (ADR-0006).
    expect(
      screen.getByRole("heading", { name: /Gunmetal/i }),
    ).toBeInTheDocument();
    expect(document.querySelector(".project-row__image")).not.toBeNull();

    // Empty Writing stays honest — no invented pieces (ADR-0013).
    expect(screen.getByText(/Coming soon/i)).toBeInTheDocument();
    expect(screen.getByText(/no stand-ins/i)).toBeInTheDocument();
  });
});
