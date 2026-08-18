import Link from "next/link";
import { CommandPalette } from "@/components/command-palette";
import { GithubIcon } from "@/components/icons";
import { Separator } from "@/components/separator";
import { SiteMark } from "@/components/site-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { paletteItems } from "@/lib/palette";
import { FOCUSABLE_CHROME } from "@/lib/a11y";
import { navItems } from "@/lib/nav";
import { site } from "@/lib/site";

const GITHUB = `https://github.com/${site.handle}`;

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
          className="flex items-center gap-2 pl-1 text-foreground"
        >
          <SiteMark className="h-8 shrink-0" />
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
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-8 items-center px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* The header trigger names a shortcut, so it goes where the nav
            goes. Below `sm` the palette puts up a thumb-reachable dock
            instead — see `CommandPalette`. */}
        <div className="flex items-center max-sm:*:data-[slot=command-menu-trigger]:hidden">
          <Separator orientation="vertical" className="mr-2 h-5 max-sm:hidden" />
          <CommandPalette items={paletteItems(hasPosts)} />
          <Separator orientation="vertical" className="mx-2 h-5 max-sm:hidden" />
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground dark:hover:bg-accent/50"
          >
            <GithubIcon className="size-4.5" />
          </a>
          <Separator orientation="vertical" className="mx-2 h-5" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
