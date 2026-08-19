"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isCurrentRoute, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * The nav, wherever it is drawn. The header wants a row of labels and the dock
 * wants a stacked sheet, but both answer the same question — which of these am
 * I looking at — and the answer is the pathname.
 */
export function SiteNav({
  items,
  variant,
  onNavigate,
}: {
  items: readonly NavItem[];
  variant: "header" | "sheet";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isCurrentRoute(item.href, pathname) ? "page" : undefined}
          onClick={onNavigate}
          className={cn(
            variant === "header"
              ? "text-sm font-medium tracking-wide text-muted-foreground transition-[color] hover:text-foreground aria-[current=page]:text-foreground"
              : "flex items-center rounded-lg px-3 py-1.5 text-base text-foreground transition-colors hover:bg-accent aria-[current=page]:bg-accent",
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
