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
    <header className="sticky top-0 z-10 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="container-editorial flex h-14 items-center justify-between gap-3 sm:gap-4">
        <Link
          href="/"
          className="shrink-0 text-sm font-medium tracking-tight text-foreground no-underline transition-opacity duration-200 ease-[var(--ease-editorial)] hover:opacity-70"
        >
          {site.name}
        </Link>

        <nav
          aria-label={FOCUSABLE_CHROME.primaryNavLabel}
          className="flex items-center gap-0.5 sm:gap-1"
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
                  "inline-flex min-h-9 items-center rounded-md px-2 text-sm no-underline transition-[color,background-color] duration-200 ease-[var(--ease-editorial)] sm:px-2.5",
                  active
                    ? "font-medium text-foreground"
                    : "text-muted hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
