"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

/**
 * The wordmark contracts to its short form as the page moves.
 *
 * `dhruv2mars` → `d2m`: both labels are rendered in the same fixed-height box.
 * The shell snaps to the compact width at the threshold and the labels briefly
 * crossfade, so a scroll never drags a layout animation through the header.
 */

/** Compact past this; expand back below it. The gap is hysteresis: without it
 *  a scroll parked on the boundary would flutter the mark. */
const COMPACT_AT = 40;
const EXPAND_AT = 12;

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
      aria-hidden
      data-compact={compact || undefined}
      className="site-header-mark font-heading text-lg leading-none font-medium tracking-tight"
    >
      <span data-mark="full">dhruv2mars</span>
      <span data-mark="short">d2m</span>
    </span>
  );
}
