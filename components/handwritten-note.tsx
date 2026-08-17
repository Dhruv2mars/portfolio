import { cn } from "@/lib/utils";

/**
 * A margin annotation, in the hand it would be written in. The caller places
 * it absolutely in the space outside the frame, and it is always aria-hidden:
 * a note may only ever say something the interface already does, in a lighter
 * voice. If it carries information, it belongs in the interface instead.
 */
export function HandwrittenNote({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute flex font-handwriting text-lg/tight text-muted-foreground/70 select-none",
        className,
      )}
      {...props}
    />
  );
}

/** Drawn open and slightly uneven, so it reads as pen rather than as an icon. */
export function HandwrittenArrow({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-7", className)}
      aria-hidden
      {...props}
    >
      <path d="M6 7c8.5 1.5 14.2 6.2 17.2 14 1.4 3.6 2 7.3 2.2 11.4" />
      <path d="M18.6 27.5c2 2.4 4.3 4.2 6.8 5.3 1.6-2.4 3.6-4.3 5.9-5.7" />
    </svg>
  );
}
