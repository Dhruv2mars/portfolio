"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { activeSectionId, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** The header offset a section must clear before it counts as the one in view. */
const HEADER = 56 + 16;

/** One frozen empty list, so the store is not resubscribed on every render. */
const NO_SECTIONS: readonly string[] = [];

/** Where each section starts, in page coordinates. */
function sectionTops(ids: readonly string[]) {
  return ids
    .map((id) => ({ id, node: document.getElementById(id) }))
    .filter(
      (entry): entry is { id: string; node: HTMLElement } => entry.node !== null,
    )
    .map(({ id, node }) => ({
      id,
      top: node.getBoundingClientRect().top + window.scrollY - HEADER,
    }));
}

/**
 * Where the reader is, as far as the nav is concerned. Most of the nav points
 * at places on one long page rather than at routes, so the answer cannot come
 * from the pathname alone — it has to come from the scroll.
 *
 * The scroll position is an external store, and read as one: subscribing to it
 * is what `useSyncExternalStore` is for, and it keeps the answer out of state
 * that would otherwise have to be pushed there from an effect on every frame.
 */
function useActiveSection(sections: readonly string[]): string | null {
  const subscribe = useCallback((onChange: () => void) => {
    let frame = 0;
    // Coalesce to one notification a frame: this fires on every scroll event.
    function schedule() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        onChange();
      });
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const snapshot = useCallback(() => {
    if (sections.length === 0) return null;
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;
    return activeSectionId(sectionTops(sections), window.scrollY, atBottom);
  }, [sections]);

  // Nothing is in view on a server, and guessing would only have to be undone.
  return useSyncExternalStore(subscribe, snapshot, () => null);
}

/**
 * `aria-current` for one nav entry. A section on the current page is `true`
 * rather than `page` — the page has not changed, only the part of it you are
 * reading — while an entry that is a route of its own gets `page`.
 */
function currentState(
  item: NavItem,
  pathname: string,
  active: string | null,
): "true" | "page" | undefined {
  if (item.section) return item.section === active ? "true" : undefined;
  if (item.href === "/") return pathname === "/" && !active ? "page" : undefined;
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
    ? "page"
    : undefined;
}

/**
 * The nav, wherever it is drawn. The header wants a row of labels and the dock
 * wants a stacked sheet, but both have to answer the same question — which of
 * these is where I am — so both are rendered from here.
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
  // Memoised on the ids themselves: a fresh array every render would restart
  // the scroll listener every render.
  const sections = useMemo(
    () =>
      items
        .map((item) => item.section)
        .filter((section): section is string => Boolean(section)),
    [items],
  );
  // Off the home page there is no section to be in, and the sections are not
  // on the page to measure either.
  const active = useActiveSection(pathname === "/" ? sections : NO_SECTIONS);

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={currentState(item, pathname, active)}
          onClick={onNavigate}
          className={cn(
            variant === "header"
              ? "flex h-8 items-center px-2 text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground aria-[current]:text-foreground"
              : "flex items-center rounded-lg px-3 py-1.5 text-base text-foreground transition-colors hover:bg-accent aria-[current]:bg-accent",
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
