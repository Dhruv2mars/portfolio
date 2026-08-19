import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";

/**
 * The door at the bottom of a sampled panel: the home page shows a handful of
 * rows and this is how a reader gets the rest. A centred pill rather than a
 * full-width bar — the bar read as one more row of the list, and the control
 * at the end of a list that looks like the list gets pressed by accident.
 *
 * The arrow is the tilted one: what is behind this is a different page.
 */
export function MoreLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <div className="screen-line-top flex justify-center py-4">
      <Link
        href={href}
        className="inline-flex h-8 shrink-0 touch-manipulation items-center gap-2 rounded-lg bg-secondary pr-2.5 pl-3 text-sm font-medium text-secondary-foreground shadow-[inset_0_0_1px] shadow-foreground/20 transition-[background-color,transform] duration-150 ease-out select-none hover:bg-secondary/80 active:scale-[0.98]"
      >
        {children}
        <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}
