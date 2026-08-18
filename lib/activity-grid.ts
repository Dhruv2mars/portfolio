import type { ActivityDay } from "@/lib/ai-activity";

/**
 * Five steps of the neutral foreground. Intensity is opacity, never hue.
 * Lives here rather than in the grid component because the server-rendered
 * legend reads it too, and a `"use client"` module's exports are client
 * references on the server, not values.
 */
export const LEVEL_ALPHA = ["5%", "20%", "40%", "60%", "80%"] as const;

export type ActivityWeek = {
  /** ISO date of the week's Sunday-aligned first slot. */
  key: string;
  /** Present only on the week that opens a new month. */
  monthLabel?: string;
  /** Sunday → Saturday. `null` pads the partial first and last weeks. */
  cells: (ActivityDay | null)[];
};

/** Day of week (0 = Sunday) for a YYYY-MM-DD calendar date. */
export function weekdayIndex(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!, 12)).getUTCDay();
}

export function monthAbbreviation(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y!, m! - 1, d!, 12)));
}

/** Long, human date for readouts and cell labels: "Sat, Aug 3, 2026". */
export function formatActivityDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y!, m! - 1, d!, 12)));
}

/**
 * Chunk a consecutive day series into Sunday-aligned weeks, padding the
 * partial weeks at both ends so every column is exactly seven slots tall.
 * A month label is attached to the first week that opens a new month, and
 * never to the final week (there is no room to render it).
 */
export function buildActivityWeeks(
  days: readonly ActivityDay[],
): ActivityWeek[] {
  if (days.length === 0) return [];

  const weeks: ActivityWeek[] = [];
  let cells: (ActivityDay | null)[] = new Array(weekdayIndex(days[0]!.date)).fill(
    null,
  );

  for (const day of days) {
    cells.push(day);
    if (cells.length === 7) {
      weeks.push({ key: cells.find(Boolean)!.date, cells });
      cells = [];
    }
  }
  if (cells.length > 0) {
    weeks.push({
      key: cells.find(Boolean)!.date,
      cells: [...cells, ...new Array(7 - cells.length).fill(null)],
    });
  }

  let labelled = "";
  weeks.forEach((week, index) => {
    // The last column has no horizontal room for a label.
    if (index === weeks.length - 1) return;
    const first = week.cells.find(Boolean);
    if (!first) return;
    const month = first.date.slice(0, 7);
    if (month === labelled) return;
    labelled = month;
    // Skip a label that would collide with the previous one on a stub week.
    if (index === 0 && week.cells[0] === null) return;
    week.monthLabel = monthAbbreviation(first.date);
  });

  return weeks;
}
