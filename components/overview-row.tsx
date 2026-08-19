import { cn } from "@/lib/utils";

/**
 * The plate a glyph sits on in the overview: a 24px tile, bordered and ringed
 * off the background, so a row of unrelated glyphs reads as one column of
 * marks rather than as loose drawings at different weights.
 */
export function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span
      data-slot="icon-tile"
      aria-hidden
      className="flex size-6 shrink-0 items-center justify-center rounded-md border border-muted-foreground/15 bg-muted text-muted-foreground ring-1 ring-border/50 ring-offset-1 ring-offset-background select-none dark:ring-line [&_svg]:size-4 [&_svg]:shrink-0"
    >
      {children}
    </span>
  );
}

/** One fact, in mono, behind its own glyph. */
export function OverviewRow({
  icon,
  className,
  children,
}: {
  icon: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-center gap-4 font-mono text-sm", className)}>
      <IconTile>{icon}</IconTile>
      <p className="text-balance">{children}</p>
    </div>
  );
}
