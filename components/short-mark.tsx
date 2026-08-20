import { cn } from "@/lib/utils";

/**
 * The short mark — what the header wordmark contracts to on scroll, and the
 * only mark small surfaces are allowed to use. It is set in the heading face
 * rather than drawn, so it is the same object as the wordmark seen from
 * further away instead of a second logo that has to be kept in agreement.
 */
export function ShortMark({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(
        "font-heading text-sm leading-none font-medium tracking-tight select-none",
        className,
      )}
      {...props}
    >
      d2m
    </span>
  );
}
