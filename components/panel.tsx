import { cn } from "@/lib/utils";

/**
 * The page is a stack of panels sharing one vertical rail. A panel draws its
 * own left/right edges and a full-bleed hairline top and bottom, so the frame
 * continues past the content column to the edge of the viewport. Everything
 * on the site is composed from these six parts — there is no other container.
 */
export function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn(
        "screen-line-top screen-line-bottom border-x border-line",
        className,
      )}
      {...props}
    />
  );
}

export function PanelHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="panel-header"
      className={cn(
        "screen-line-bottom px-4 has-data-[slot=panel-description]:*:data-[slot=panel-title]:screen-line-bottom",
        className,
      )}
      {...props}
    />
  );
}

/**
 * A panel title is an `h2` because the usual panel is one section of a page
 * that already has its own `h1`. A page whose whole content *is* one panel —
 * a post, the blog index, the 404 — passes `as="h1"` so the document keeps a
 * top-level heading and the panel's own sub-headings still rank below it.
 */
export function PanelTitle({
  as: Tag = "h2",
  className,
  ...props
}: React.ComponentProps<"h2"> & { as?: "h1" | "h2" }) {
  return (
    <Tag
      data-slot="panel-title"
      className={cn(
        "group/panel-title font-heading text-3xl font-medium tracking-tight text-balance",
        className,
      )}
      {...props}
    />
  );
}

/** The count or unit that rides above the baseline of a title. */
export function PanelTitleSup({
  className,
  children,
  ...props
}: React.ComponentProps<"sup">) {
  return (
    <sup
      className={cn(
        "top-[-0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground",
        className,
      )}
      {...props}
    >
      {/* An accessible name is the element's text nodes run together, and
          `ml-1` is a margin — margins are not text. Without something between
          them a screen reader reads the heading as "Projects8", "Blog3",
          "Nothing lives here404". This space is the separator; it is hidden
          rather than rendered so the optical gap stays the margin's job. */}
      <span className="sr-only"> </span>
      {children}
    </sup>
  );
}

export function PanelDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-description"
      className={cn(
        "py-4 text-base text-balance text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function PanelContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="panel-body" className={cn("p-4", className)} {...props} />
  );
}
