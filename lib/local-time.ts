/**
 * The clock in the overview: what time it is where the author is, how far that
 * is from where the reader is, and where the hands of a 16px clock face point
 * while it says so.
 *
 * Everything here is a pure function of an instant and an IANA zone, so the
 * same code can run on the server, in the priming script, and in the tick.
 */

/** "01:45 PM" — two digits and a meridiem, as the reference sets it. */
export function formatZoneTime(zone: string, at: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(at);
}

/** The wall-clock hour (0–23) and minute in `zone` at `at`. */
export function zoneClock(zone: string, at: Date): { hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(at);
  const read = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  // `hour12: false` renders midnight as 24 in some engines; fold it back.
  return { hour: read("hour") % 24, minute: read("minute") };
}

/** How far `zone` is from UTC, in minutes, at `at`. Positive is east. */
export function zoneOffsetMinutes(zone: string, at: Date): number {
  const inZone = new Date(at.toLocaleString("en-US", { timeZone: zone }));
  const inUtc = new Date(at.toLocaleString("en-US", { timeZone: "UTC" }));
  return Math.round((inZone.getTime() - inUtc.getTime()) / 60_000);
}

/**
 * "5h 30m ahead", "3h behind", "same time".
 *
 * The reference floors this to whole hours, which is fine for a zone that sits
 * on one. It is not fine here: a half-hour zone would be reported as the hour
 * below it, so a reader five and a half hours away would be told five — a
 * number that is wrong rather than round. The minutes are kept.
 */
export function offsetLabel(minutes: number): string {
  const size = Math.abs(minutes);
  if (size === 0) return "same time";
  const hours = Math.floor(size / 60);
  const rest = size % 60;
  const span = [hours ? `${hours}h` : "", rest ? `${rest}m` : ""]
    .filter(Boolean)
    .join(" ");
  return `${span} ${minutes > 0 ? "ahead" : "behind"}`;
}

/**
 * The two hands of the clock glyph, as one path on the icon family's 16px
 * grid. The hour hand carries the minutes too, so it sits between the hours
 * rather than jumping between them.
 */
export function handsPath(hour: number, minute: number): string {
  const round = (n: number) => Math.round(n * 100) / 100;
  const minuteTurn = (minute / 60) * 2 * Math.PI;
  const hourTurn = ((hour % 12) + minute / 60) / 12 * 2 * Math.PI;
  const hand = (turn: number, length: number) =>
    `${round(8 + length * Math.sin(turn))} ${round(8 - length * Math.cos(turn))}`;
  return `M8 8 L${hand(hourTurn, 2.4)} M8 8 L${hand(minuteTurn, 4)}`;
}
