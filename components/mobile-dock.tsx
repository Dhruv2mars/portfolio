"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PaletteTrigger } from "@/components/command-palette";
import { Separator } from "@/components/separator";
import type { NavItem } from "@/lib/nav";

/**
 * The dock is the whole of the site's chrome on a phone. Above `sm` the header
 * carries the nav and the palette trigger; below it the header keeps only the
 * mark and the two icon controls, so everything else has to be reachable from
 * down here where a thumb already is.
 *
 * It is mounted after the content rather than inside the header because that is
 * where it reads: a control that paints at the bottom of the viewport should
 * come at the bottom of the tab order, not two stops in, ahead of chrome that
 * is drawn above it.
 */
export function MobileDock({ items }: { items: readonly NavItem[] }) {
  return (
    <div className="fixed bottom-[calc(0.5rem+env(safe-area-inset-bottom,0px))] left-1/2 z-50 flex w-fit -translate-x-1/2 items-center rounded-xl bg-popover py-1 pr-1 pl-2.5 shadow-md ring ring-foreground/10 sm:hidden dark:ring-foreground/20">
      <PaletteTrigger dock />
      <Separator orientation="vertical" className="mr-1 ml-2.5 h-4" />
      <DockMenu items={items} />
    </div>
  );
}

/**
 * The nav, folded into a sheet that opens upward off the dock. The trigger is
 * two bars that fold into a cross while open, which is why it is the one
 * control on the site that opts out of the press-scale: it already has a
 * pressed state, and two at once reads as a stutter.
 */
function DockMenu({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on a press outside, and on Escape from anywhere — the sheet floats
  // over the page rather than trapping it, so both have to be handled here.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Opening with the keyboard has to land somewhere; the first destination is
  // the only sensible place.
  useEffect(() => {
    if (!open) return;
    sheetRef.current?.querySelector("a")?.focus();
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Toggle Menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        /* `before:` widens the target past the 32px the bars need, upward into
           the dead space above the dock, without moving anything. */
        className="group relative flex size-8 shrink-0 touch-manipulation flex-col items-center justify-center gap-1 rounded-lg text-muted-foreground transition-all before:absolute before:-inset-x-2 before:-top-8 before:-bottom-1 hover:bg-accent aria-expanded:bg-accent dark:hover:bg-accent/50"
      >
        <span
          aria-hidden
          className="h-0.5 w-4 rounded-[1px] bg-foreground transition-transform group-aria-expanded:translate-y-0.75 group-aria-expanded:rotate-45 motion-reduce:transition-none"
        />
        <span
          aria-hidden
          className="h-0.5 w-4 rounded-[1px] bg-foreground transition-transform group-aria-expanded:-translate-y-0.75 group-aria-expanded:-rotate-45 motion-reduce:transition-none"
        />
      </button>

      {open ? (
        <div
          ref={sheetRef}
          role="dialog"
          aria-label="Menu"
          className="palette-panel absolute bottom-full origin-bottom left-1/2 mb-2 flex w-48 -translate-x-1/2 flex-col rounded-xl bg-popover p-1 shadow-md ring ring-foreground/10 dark:ring-foreground/20"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center rounded-lg px-3 py-1.5 text-base text-foreground transition-colors hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
