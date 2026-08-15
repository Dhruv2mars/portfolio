import Link from "next/link";
import { CommandPalette } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { paletteItems } from "@/lib/palette";
import { FOCUSABLE_CHROME } from "@/lib/a11y";
import { navItems } from "@/lib/nav";
import { site } from "@/lib/site";

export function SiteHeader({ hasPosts }: { hasPosts: boolean }) {
  const items = navItems(hasPosts);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/72 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center gap-4 px-5 sm:px-6">
        <Link
          href="/"
          className="py-2 font-mono text-xs tracking-tight text-foreground"
        >
          {site.handle.toLowerCase()}
          <span className="text-dim">.com</span>
        </Link>

        <nav
          aria-label={FOCUSABLE_CHROME.primaryNavLabel}
          className="flex items-center gap-4"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              // py-2 lifts the tap target past 24px inside the fixed h-14 row.
              className="py-2 font-mono text-xs text-dim transition-colors duration-150 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <CommandPalette items={paletteItems(hasPosts)} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
