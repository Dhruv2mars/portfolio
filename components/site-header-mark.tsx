"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The wordmark contracts to its short form as the page moves.
 *
 * `dhruv2mars` → `d2m`: the two vowel runs are not faded out and left behind,
 * they are collapsed, so the letters that survive close the gap themselves and
 * arrive as one mark rather than three survivors. The collapse is a grid track
 * animating `1fr → 0fr` — the same trick the project rows use to open — which
 * keeps the whole thing to two CSS properties and no measurement.
 */

/** Compact past this; expand back below it. The gap is hysteresis: without it
 *  a scroll parked on the boundary would flutter the mark. */
const COMPACT_AT = 40;
const EXPAND_AT = 12;

function Drop({ children, compact }: { children: string; compact: boolean }) {
  return (
    <span
      aria-hidden
      data-compact={compact || undefined}
      className={cn(
        "grid grid-cols-[1fr] transition-[grid-template-columns,opacity] duration-350 ease-out",
        "data-compact:grid-cols-[0fr] data-compact:opacity-0",
        "motion-reduce:transition-none",
      )}
    >
      <span className="overflow-hidden">{children}</span>
    </span>
  );
}

export function SiteHeaderMark() {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setCompact((was) => (was ? y > EXPAND_AT : y > COMPACT_AT));
  });

  return (
    <span
      // The accessible name lives on the link; the letters are decoration once
      // they can be pulled apart mid-word.
      className="flex items-center font-heading text-lg leading-none font-medium tracking-tight"
    >
      <span aria-hidden>d</span>
      <Drop compact={compact}>hruv</Drop>
      <span aria-hidden>2</span>
      <span aria-hidden>m</span>
      <Drop compact={compact}>ars</Drop>
    </span>
  );
}
