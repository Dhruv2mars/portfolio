import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TokenActivity } from "@/components/token-activity";
import {
  buildTokenActivityViewModel,
  type TokenActivityDay,
} from "@/lib/token-activity";

const sampleDays: readonly TokenActivityDay[] = [
  { date: "2026-01-01", tokens: 0 },
  { date: "2026-01-02", tokens: 12_000 },
  { date: "2026-01-03", tokens: 45_000 },
  { date: "2026-01-04", tokens: 8_000 },
  { date: "2026-01-05", tokens: 0 },
  { date: "2026-01-06", tokens: 90_000 },
  { date: "2026-01-07", tokens: 22_000 },
  { date: "2026-01-08", tokens: 15_000 },
  { date: "2026-01-09", tokens: 30_000 },
  { date: "2026-01-10", tokens: 5_000 },
  { date: "2026-01-11", tokens: 0 },
  { date: "2026-01-12", tokens: 40_000 },
  { date: "2026-01-13", tokens: 55_000 },
  { date: "2026-01-14", tokens: 18_000 },
];

afterEach(() => {
  cleanup();
});

describe("TokenActivity", () => {
  it("renders stats, contribution grid, and range affordances from a view model", () => {
    const model = buildTokenActivityViewModel(sampleDays, "daily");
    render(<TokenActivity model={model} />);

    expect(
      screen.getByRole("region", { name: /Token activity/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Last day")).toBeInTheDocument();
    expect(screen.getByText("18K")).toBeInTheDocument();
    expect(
      screen.getByRole("grid", { name: /Contribution grid/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tablist", { name: /Activity range/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Daily" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Weekly" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tab", { name: "Cumulative" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("switches Daily / Weekly / Cumulative through the controlled range callback", () => {
    const daily = buildTokenActivityViewModel(sampleDays, "daily");
    const weekly = buildTokenActivityViewModel(sampleDays, "weekly");
    let current = daily;
    const onRangeChange = (range: "daily" | "weekly" | "cumulative") => {
      current = buildTokenActivityViewModel(sampleDays, range);
      rerender(<TokenActivity model={current} onRangeChange={onRangeChange} />);
    };

    const { rerender } = render(
      <TokenActivity model={current} onRangeChange={onRangeChange} />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Weekly" }));
    expect(screen.getByRole("tab", { name: "Weekly" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("This week")).toBeInTheDocument();
    expect(screen.getByText("Weekly avg")).toBeInTheDocument();
    expect(
      screen.getByRole("grid", { name: /Contribution grid/i }),
    ).toBeInTheDocument();
  });
});
