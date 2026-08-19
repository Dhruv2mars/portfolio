"use client";

import { useSyncExternalStore } from "react";
import { ClockIcon } from "@/components/icons";
import { OverviewRow } from "@/components/overview-row";
import {
  formatZoneTime,
  handsPath,
  offsetLabel,
  zoneClock,
  zoneOffsetMinutes,
} from "@/lib/local-time";

/**
 * One clock for the whole page, ticking only while something is watching it.
 *
 * It is an external store rather than a `useState` on a timer because the
 * server has no business guessing what time it is: `getServerSnapshot` returns
 * null, the row renders as a dial with no hands, and the real time arrives on
 * the first client render. That is the difference between a clock that is
 * briefly blank and a clock that is briefly wrong — this page is prerendered
 * and revalidates hourly, so a baked-in time could be an hour out.
 */
let listeners: (() => void)[] = [];
let ticking: ReturnType<typeof setInterval> | null = null;
let now: number | null = null;

function subscribe(onTick: () => void) {
  listeners.push(onTick);
  if (!ticking) {
    now = Date.now();
    // A clock showing only minutes still has to turn over on the minute, and
    // there is no telling where inside one this mounted.
    ticking = setInterval(() => {
      now = Date.now();
      for (const listener of listeners) listener();
    }, 5_000);
  }
  return () => {
    listeners = listeners.filter((listener) => listener !== onTick);
    if (listeners.length === 0 && ticking) {
      clearInterval(ticking);
      ticking = null;
      now = null;
    }
  };
}

/** What time it is where the author is, and how far that is from the reader. */
export function LocalTime({ zone }: { zone: string }) {
  const at = useSyncExternalStore(
    subscribe,
    () => now,
    () => null,
  );
  const reading = at === null ? null : read(zone, new Date(at));

  return (
    <OverviewRow icon={<ClockIcon hands={reading?.hands} />}>
      {/* The dashes hold the width the time will take, so the row does not
          jump when the clock starts. */}
      <span className="tabular-nums">{reading?.time ?? "--:-- --"}</span>
      {/* The distance is context for the time beside it, not a second fact: a
          reader who has just been told the hour does not also need to be told
          how far away that hour is. */}
      {reading ? (
        <span aria-hidden className="text-muted-foreground">
          {` // ${reading.away}`}
        </span>
      ) : null}
    </OverviewRow>
  );
}

function read(zone: string, at: Date) {
  const { hour, minute } = zoneClock(zone, at);
  return {
    time: formatZoneTime(zone, at),
    hands: handsPath(hour, minute),
    // `getTimezoneOffset` is minutes *behind* UTC, so adding it to the
    // author's offset gives the signed distance from the reader.
    away: offsetLabel(zoneOffsetMinutes(zone, at) + at.getTimezoneOffset()),
  };
}
