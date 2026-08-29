"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "@/components/icons";

/**
 * Past this many pixels the page is long enough that getting back to the top
 * by hand is a chore. Below it the header is still close enough to reach.
 */
const REVEAL_AT = 400;

/**
 * The way back up. It fades in once the scroll is deep enough, and dims to a
 * third while you are still going down — a control you have not asked for yet
 * should not compete with the thing you are reading. Hovering it, or turning
 * around, brings it back to full.
 *
 * Like the dock, it rides `--signature-clear` above the bottom edge so that it
 * never lands on the footer signature.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      if (Math.abs(y - last) > 4) {
        setDirection(y > last ? "down" : "up");
        last = y;
      }
      setVisible(y >= REVEAL_AT);
    };

    // Scroll fires far more often than a paint can use, so the read is
    // deferred to the frame and coalesced.
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      // Hidden means gone, not merely invisible: an unreachable control must
      // not still be in the tab order or under the pointer.
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      data-visible={visible}
      data-scroll-direction={direction}
      onClick={() => {
        const still = window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches;
        window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
      }}
      className="fixed right-4 bottom-[calc(var(--signature-clear)+env(safe-area-inset-bottom,0px))] z-50 inline-flex size-8 shrink-0 touch-manipulation items-center justify-center rounded-lg bg-secondary text-secondary-foreground shadow-[inset_0_0_1px] shadow-foreground/20 transition-[background-color,opacity] duration-300 select-none active:scale-[0.98] hover:bg-secondary/80 data-[scroll-direction=down]:opacity-30 data-[scroll-direction=down]:hover:opacity-100 data-[scroll-direction=up]:opacity-100 data-[visible=false]:pointer-events-none data-[visible=false]:opacity-0 lg:right-8 [&_svg]:pointer-events-none [&_svg]:shrink-0"
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
