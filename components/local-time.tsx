"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const formatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZone: site.timezone,
  timeZoneName: "short",
});

/**
 * Live local clock in Dhruv's timezone — quiet "this person is
 * shipping right now" signal. Mount-only render to avoid timezone mismatch.
 */
export function LocalTime() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setLabel(formatter.format(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums" aria-label={`Local time in ${site.city}`}>
      {label ?? "--:--:--"}
    </span>
  );
}
