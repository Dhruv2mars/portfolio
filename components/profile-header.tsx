import Image from "next/image";
import { SiteMarkIsometric } from "@/components/site-mark";
import { site } from "@/lib/site";

/** "Dhruv Sharma" → "DS". */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * The portrait slot is a monogram plate, not a gap waiting to be filled: with
 * no photograph set it draws the initials in the display face, so the slot
 * reads as a mark of its own rather than as a missing image.
 *
 * 128px on a phone, 160px on desktop — the portrait is one of the two things
 * the hero is for, so it is sized to hold the row rather than to sit politely
 * beside the name.
 */
function Avatar() {
  return (
    <div className="relative m-0.5 size-32 overflow-hidden rounded-xl border border-line bg-muted ring-1 ring-border/50 select-none sm:size-40">
      {site.avatar ? (
        <Image
          src={site.avatar}
          alt={site.name}
          fill
          sizes="(min-width: 640px) 160px, 128px"
          priority
          className="object-cover"
        />
      ) : (
        <span
          role="img"
          aria-label={`${site.name}, monogram`}
          className="absolute inset-0 grid place-items-center"
        >
          {/* A mount inset from the plate edge, like the figures elsewhere
              carry — the monogram is a mark this site drew, not a photograph
              that failed to load, and it should look like it was meant. No
              texture behind it: the hero is a plain sheet, and the only
              drawing on it is the one inside Fig. 1's own frame. */}
          <span
            aria-hidden
            className="absolute inset-2 rounded-md border border-line"
          />
          <span
            aria-hidden
            className="relative font-heading text-5xl font-medium tracking-tight text-foreground sm:text-6xl"
          >
            {initials(site.name)}
          </span>
        </span>
      )}
    </div>
  );
}

/**
 * The hero is a four-cell frame rather than a stacked block: the mark occupies
 * a plate captioned like a figure, the avatar sits in its own gutter column,
 * and the name and role stack against the bottom edge so all three meet on one
 * baseline. Nothing here is centred.
 */
export function ProfileHeader() {
  return (
    <div className="screen-line-bottom relative grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] overflow-y-clip border-x border-line">
      {/* Nothing bleeds out of here. The reference lets its hero texture run
          past the rail and off the screen; ours does not. A pattern outside
          the frame turns the top of the page into wallpaper, and the only
          lines the hero needs are the ones that divide it. */}
      <figure className="relative col-span-2 p-2 sm:col-span-1 sm:col-start-2 sm:p-4">
        {/* Fills the plate rather than sitting inside it: the drawing is
            scaled to cover and cut at the edges, which is what makes the
            lattice read as continuing past the frame.

            The plate keeps a ratio rather than a height, so it grows with the
            rail instead of stepping at the breakpoint — the reference's plate
            is the same shape at every width it is drawn at. */}
        <SiteMarkIsometric className="aspect-[556/354] w-full" />
        <figcaption className="pointer-events-none absolute right-2 bottom-2 text-sm leading-none tracking-wide text-[color-mix(in_oklab,var(--muted-foreground)_60%,var(--background))] tabular-nums select-none sm:right-4 sm:bottom-4">
          Fig. 1.
        </figcaption>
      </figure>

      <div className="flex flex-col sm:row-span-2 sm:row-start-1">
        <div className="screen-line-top mt-auto shrink-0 border-r border-line">
          <Avatar />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="z-1 mt-auto border-t border-line">
          <h1 className="-translate-y-px pl-4 text-[2rem]/none font-medium tracking-tight">
            {site.name}
          </h1>
          {/* The one line that reads as a caption rather than as prose, so it
              is set in mono at the small size — and swept once on load, which
              is the reference's own way of pointing at it without shouting. */}
          <p className="flex h-12.5 items-center border-t border-line py-1 pl-4 font-mono text-sm text-balance text-muted-foreground sm:h-9">
            <span className="shimmer inline-block">{site.tagline}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
