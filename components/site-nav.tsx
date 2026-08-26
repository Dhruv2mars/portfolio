"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isCurrentRoute, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * The nav, wherever it is drawn. The header and mobile dock use different
 * spacing, but both answer the same question — which of these am I looking at
 * — and the answer is the pathname.
 */
export function SiteNav({
  items,
  variant,
}: {
  items: readonly NavItem[];
  variant: "header" | "dock";
}) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isCurrentRoute(item.href, pathname) ? "page" : undefined}
          className={cn(
            variant === "header"
              ? "flex min-h-6 items-center text-sm font-medium tracking-wide text-muted-foreground transition-[color] hover:text-foreground aria-[current=page]:text-foreground"
              : "flex h-8 items-center rounded-lg px-2 text-sm text-muted-foreground transition-[background-color,color] hover:bg-accent hover:text-foreground aria-[current=page]:bg-accent aria-[current=page]:text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
