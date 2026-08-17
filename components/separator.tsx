import { cn } from "@/lib/utils";

/**
 * A hairline. Horizontal by default; the vertical form is used inside the
 * header and footer to space icon groups.
 */
export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <div
      data-slot="separator"
      data-orientation={orientation}
      role="none"
      // The vertical form takes its height from the caller, so it can be sized
      // to the glyphs it sits between rather than to the row.
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "w-px",
        className,
      )}
      {...props}
    />
  );
}
