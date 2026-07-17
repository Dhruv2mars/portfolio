import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectsIndex } from "./projects-index";
import type { ProjectIndexRow } from "@/lib/projects";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

const fixtures: ProjectIndexRow[] = [
  {
    title: "Gunmetal",
    lede: "Local OpenAI-compatible API.",
    href: "https://example.com/gunmetal",
    stillSrc: "/projects/gunmetal.svg",
  },
  {
    title: "GridFall",
    lede: "Tetris in your terminal.",
    href: "https://example.com/gridfall",
    stillSrc: "/projects/gridfall.svg",
  },
];

describe("ProjectsIndex", () => {
  it("renders every row with title, lede, link, and still — uniform, no text-only", () => {
    const { container } = render(<ProjectsIndex projects={fixtures} />);
    const items = container.querySelectorAll(".project-row");
    expect(items).toHaveLength(2);

    for (const [index, item] of items.entries()) {
      const fixture = fixtures[index]!;
      const row = within(item as HTMLElement);
      expect(
        row.getByRole("heading", { level: 2, name: fixture.title }),
      ).toBeInTheDocument();
      expect(row.getByText(fixture.lede)).toBeInTheDocument();
      const link = row.getByRole("link");
      expect(link).toHaveAttribute("href", fixture.href);
      const image = item.querySelector("img");
      expect(image).not.toBeNull();
      expect(image).toHaveAttribute("src", fixture.stillSrc);
    }
  });

  it("does not expose hover-video media on the index", () => {
    const { container } = render(<ProjectsIndex projects={fixtures} />);
    expect(container.querySelector("video")).toBeNull();
    expect(screen.queryByText(/hover/i)).toBeNull();
  });
});
