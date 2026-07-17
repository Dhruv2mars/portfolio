import type { TokenActivityDay } from "./view-model";

/** Deterministic fixture year — temporary contract until live ingest lands. */
export function buildTokenActivityFixture(
  startDate = "2025-07-17",
  dayCount = 366,
): TokenActivityDay[] {
  const start = parseUtcDate(startDate);
  const days: TokenActivityDay[] = [];

  for (let i = 0; i < dayCount; i++) {
    const date = addUtcDays(start, i);
    const iso = formatUtcDate(date);
    const weekday = date.getUTCDay();
    const week = Math.floor(i / 7);
    const wave = Math.sin(week / 3.2) * 0.5 + 0.5;
    const weekendDip = weekday === 0 || weekday === 6 ? 0.35 : 1;
    const burst = (i * 17 + week * 13) % 11 === 0 ? 2.4 : 1;
    const quiet = (i * 7) % 19 === 0 ? 0 : 1;
    const raw = Math.round((18_000 + wave * 72_000) * weekendDip * burst * quiet);
    days.push({ date: iso, tokens: raw });
  }

  return days;
}

export const tokenActivityFixture: readonly TokenActivityDay[] =
  buildTokenActivityFixture();

function parseUtcDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!));
}

function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
