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

function Avatar() {
  return (
    <div className="relative m-0.5 size-16 overflow-hidden rounded-lg border border-line bg-muted ring-1 ring-border/50 select-none">
      {site.avatar ? (
        <Image
          src={site.avatar}
          alt={site.name}
          fill
          sizes="64px"
          priority
          className="object-cover"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-heading text-xl font-medium tracking-tight text-foreground">
          {initials(site.name)}
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
    <div className="screen-line-bottom grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] overflow-y-clip border-x border-line">
      <figure className="relative col-span-2 p-2 sm:col-span-1 sm:col-start-2 sm:p-4">
        <SiteMarkIsometric className="mx-auto h-28 sm:h-32" />
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
          <div className="flex items-baseline gap-2 pl-4">
            <h1 className="-translate-y-px text-[2rem]/none font-medium tracking-tight">
              {site.name}
            </h1>
            {/* A margin note, in the hand it would be written in: the monogram
                is a placeholder and says so. It disappears the moment
                `site.avatar` is set. */}
            {site.avatar ? null : (
              <span className="font-handwriting text-lg/none text-muted-foreground/70 select-none max-sm:hidden">
                portrait pending
              </span>
            )}
          </div>
          <p className="flex h-12.5 items-center border-t border-line py-1 pl-4 text-muted-foreground sm:h-9">
            {site.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
