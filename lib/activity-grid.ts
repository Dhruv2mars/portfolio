/**
 * Five steps of the neutral foreground, the site's ink ladder for a measured
 * cell. Intensity is opacity, never hue. Figure 404 lights its numeral at the
 * top step.
 */
export const LEVEL_ALPHA = ["5%", "20%", "40%", "60%", "80%"] as const;

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
