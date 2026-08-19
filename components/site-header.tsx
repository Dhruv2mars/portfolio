import Link from "next/link";
import { PaletteTrigger } from "@/components/command-palette";
import { Separator } from "@/components/separator";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { FOCUSABLE_CHROME } from "@/lib/a11y";
import { navItems } from "@/lib/nav";
import { site } from "@/lib/site";

export function SiteHeader({ hasPosts }: { hasPosts: boolean }) {
  const items = navItems(hasPosts);

  return (
    <header className="sticky top-0 z-50 max-w-screen overflow-x-clip bg-background px-2">
      {/* `after:z-1 after:bg-border` lifts the bottom hairline above the
          content scrolling beneath it and darkens it to a real edge. */}
      <div className="screen-line-top screen-line-bottom mx-auto flex h-(--header-height) items-center gap-2 border-r border-line pr-2 after:z-1 after:bg-border sm:gap-4 md:max-w-3xl">
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center pl-2 text-foreground"
        >
          {/* The wordmark alone. A glyph beside it would be a second mark
              competing with the one the hero already draws. */}
          <span className="font-heading text-base font-medium tracking-tight">
            {site.handle.toLowerCase()}
          </span>
        </Link>

        <div className="flex-1" />

        {/* Below `sm` the bar collapses to mark plus controls. The nav targets
            are in-page anchors on a single scroll, so losing them costs
            nothing, and keeping them cost the theme toggle its right gutter. */}
        <nav
          aria-label={FOCUSABLE_CHROME.primaryNavLabel}
          className="flex items-center max-sm:hidden"
        >
          <SiteNav items={items} variant="header" />
        </nav>

        {/* The header trigger names a shortcut, so it goes where the nav
            goes. Below `sm` the palette puts up a thumb-reachable dock
            instead — see `MobileDock`. GitHub is not here: it is already a
            glyph in the links row, and a link that appears twice on one
            screen is one link too many. */}
        <div className="flex items-center max-sm:*:data-[slot=command-menu-trigger]:hidden">
          <Separator orientation="vertical" className="mr-2 h-5 max-sm:hidden" />
          <PaletteTrigger />
          <Separator orientation="vertical" className="mx-2 h-5" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
