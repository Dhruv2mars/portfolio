import { cn } from "@/lib/utils";

/** A fact, not a badge: monospace, no fill of its own beyond one zinc step. */
export function Tag({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tag"
      className={cn(
        "inline-flex items-center rounded-full border bg-zinc-50 px-1.5 py-0.5 font-mono text-xs whitespace-nowrap text-muted-foreground dark:bg-zinc-900",
        "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    />
  );
}
