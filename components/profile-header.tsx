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
          {/* The same lattice the drawing beside it stands on, and a mount
              inset from the plate edge like the figures elsewhere carry — the
              monogram is a mark this site drew, not a photograph that failed
              to load, and it should look like it was meant. */}
          <span
            aria-hidden
            className="hero-lattice absolute inset-0 opacity-70"
          />
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
      {/* The floor lattice carried past the rail as a whisper, so the drawing
          reads as larger than the frame that crops it. Only outside the rail —
          inside it, the real drawing is doing the work and a second grid would
          only fight it. */}
      <div
        aria-hidden
        className="hero-lattice pointer-events-none absolute inset-y-0 right-full -z-1 w-[100vw]"
      />
      <div
        aria-hidden
        className="hero-lattice pointer-events-none absolute inset-y-0 left-full -z-1 w-[100vw]"
      />
      <figure className="relative col-span-2 p-2 sm:col-span-1 sm:col-start-2 sm:p-4">
        {/* Fills the plate rather than sitting inside it: the drawing is
            scaled to cover and cut at the edges, which is what makes the
            lattice read as continuing past the frame. */}
        <SiteMarkIsometric className="h-56 w-full sm:h-90" />
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
          <p className="flex h-12.5 items-center border-t border-line py-1 pl-4 text-muted-foreground sm:h-9">
            {site.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
