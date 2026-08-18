import { cn } from "@/lib/utils";

/** A fact, not a badge: monospace, no fill of its own beyond one zinc step. */
export function Tag({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tag"
      className={cn(
        "inline-flex h-6 items-center justify-center gap-1.25 rounded-full bg-zinc-50/80 px-2 font-mono text-xs whitespace-nowrap text-muted-foreground dark:bg-zinc-900/80",
        "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    />
  );
}
