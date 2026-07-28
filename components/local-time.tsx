"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZoneName: "short",
});

/**
 * Live local clock — quiet "this person is shipping right now" signal.
 * Mount-only render to avoid server/client timezone mismatch.
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
    <span className="tabular-nums" aria-label="Local time">
      {label ?? "--:--:--"}
    </span>
  );
}
