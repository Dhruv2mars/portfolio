import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { THEME_STORAGE_KEY } from "@/lib/theme";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

afterEach(() => {
  cleanup();
  window.localStorage.removeItem(THEME_STORAGE_KEY);
});

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("SiteHeader", () => {
  it("renders primary nav, theme toggle, and contact links", () => {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    renderWithTheme(<SiteHeader />);

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
    expect(
      screen.getByRole("button", { name: /Theme: System/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:Dhruv2mars@gmail.com",
    );
    expect(screen.queryByRole("link", { name: "About" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Activity" })).toBeNull();
  });
});

describe("ThemeToggle", () => {
  it("cycles preference and persists the override", () => {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    renderWithTheme(<ThemeToggle />);

    const toggle = screen.getByRole("button", { name: /Theme:/i });
    fireEvent.click(toggle);
    expect(toggle).toHaveAccessibleName(/Theme: Light/i);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");

    fireEvent.click(toggle);
    expect(toggle).toHaveAccessibleName(/Theme: Dark/i);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    fireEvent.click(toggle);
    expect(toggle).toHaveAccessibleName(/Theme: System/i);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });
});
