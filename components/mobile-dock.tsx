"use client";

import { PaletteTrigger } from "@/components/command-palette";
import { Separator } from "@/components/separator";
import { SiteNav } from "@/components/site-nav";
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
    <div className="fixed bottom-[calc(0.5rem+env(safe-area-inset-bottom,0px))] left-1/2 z-[60] flex w-fit -translate-x-1/2 items-center rounded-xl bg-popover py-1 pr-1 pl-1.5 ring ring-foreground/10 sm:hidden dark:ring-foreground/20">
      <PaletteTrigger dock />
      <Separator orientation="vertical" className="mr-1 ml-2.5 h-4" />
      <nav aria-label="Mobile navigation" className="flex items-center gap-0.5">
        <SiteNav items={items} variant="dock" />
      </nav>
    </div>
  );
}
