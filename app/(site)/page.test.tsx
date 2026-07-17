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
  it("leads with craft-first hero and mounts Token activity below — not as hero", () => {
    render(<HomePage />);

    const title = screen.getByRole("heading", { level: 1, name: /Dhruv Sharma/i });
    const token = screen.getByRole("region", { name: /Token activity/i });

    expect(title.compareDocumentPosition(token) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("tablist", { name: /Activity range/i })).toBeInTheDocument();
    expect(screen.getByRole("grid", { name: /Contribution grid/i })).toBeInTheDocument();
  });
});
