"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOCUSABLE_CHROME } from "@/lib/a11y";
import { PRIMARY_NAV } from "@/lib/nav";
import { site } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="container-wide flex h-[52px] items-center justify-between gap-4 sm:h-14">
        <Link
          href="/"
          className="group flex min-h-9 items-center gap-2.5 no-underline"
        >
          <span
            aria-hidden
            className="relative flex size-[18px] items-center justify-center"
          >
            <span className="absolute inset-0 rounded-[4px] bg-foreground transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:scale-90" />
            <span className="relative size-[7px] rounded-[1px] bg-background" />
          </span>
          <span className="text-[13px] font-medium tracking-[-0.01em] text-foreground transition-opacity duration-150 group-hover:opacity-70">
            {site.handle}
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <nav
            aria-label={FOCUSABLE_CHROME.primaryNavLabel}
            className="flex items-center"
          >
            {PRIMARY_NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "relative inline-flex min-h-9 items-center px-2.5 text-[13px] no-underline transition-colors duration-150 ease-[var(--ease-out-quad)] sm:px-3",
                    active
                      ? "font-medium text-foreground"
                      : "text-muted hover:text-foreground",
                  ].join(" ")}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={[
                      "pointer-events-none absolute inset-x-2.5 -bottom-px h-px bg-foreground transition-opacity duration-200 ease-[var(--ease-out-expo)] sm:inset-x-3",
                      active ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </nav>
          <div className="ml-1 h-4 w-px bg-border" aria-hidden />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
