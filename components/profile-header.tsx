import Image from "next/image";
import { FlipSentences } from "@/components/flip-sentences";
import { HeroChart } from "@/components/hero-chart";
import { PronounceName } from "@/components/pronounce-name";
import { formatActivityDate } from "@/lib/activity-grid";
import { formatCompactTokens, formatTokenCount } from "@/lib/ai-activity";
import { getAiActivityPayload } from "@/lib/ai-activity-store";
import { buildHeroSeries, type HeroSeries } from "@/lib/hero-series";
import { site } from "@/lib/site";

/** "Dhruv Sharma" → "DS" for the missing-asset fallback. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/** 128px on phones, 160px on desktop. */
function Avatar() {
  return (
    <div className="relative m-0.5 size-32 overflow-hidden rounded-full border border-line bg-muted ring-1 ring-border/50 select-none sm:size-40">
      {site.avatar ? (
        <Image
          src={site.avatar}
          alt={`${site.name}, profile portrait`}
          fill
          sizes="(min-width: 640px) 160px, 128px"
          priority
          className="object-contain"
        />
      ) : (
        <span
          role="img"
          aria-label={`${site.name}, monogram`}
          className="absolute inset-0 grid place-items-center"
        >
          {/* A mount inset from the plate edge, like the figures elsewhere
              carry — the monogram is a mark this site drew, not a photograph
              that failed to load, and it should look like it was meant. */}
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
 * What the figure says, for anyone not looking at it.
 *
 * The drawing is a shape; this is the same reading in words, and it carries
 * the smoothing window because a smoothed curve that does not say so is a
 * claim about days that were never worked that way.
 */
function heroDescription(series: HeroSeries): string {
  return [
    `${site.name}'s AI token use in ${series.year}, January 1 to`,
    `${formatActivityDate(series.to)}:`,
    `${formatTokenCount(series.total)} tokens,`,
    `busiest day ${formatActivityDate(series.peak.date)}`,
    `at ${formatCompactTokens(series.peak.tokens)}.`,
    `Drawn as a ${series.smoothingDays}-day mean.`,
  ].join(" ");
}

/**
 * The hero is a four-cell frame rather than a stacked block: the record
 * occupies a plate captioned like a figure, the avatar sits in its own gutter
 * column, and the name and role stack against the bottom edge so all three
 * meet on one baseline. Nothing here is centred.
 */
export async function ProfileHeader() {
  const { payload } = await getAiActivityPayload();
  const series = buildHeroSeries(payload);

  return (
    <div className="screen-line-bottom relative grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] overflow-y-clip border-x border-line">
      {/* Nothing bleeds out of here. The reference lets its hero texture run
          past the rail and off the screen; ours does not. A pattern outside
          the frame turns the top of the page into wallpaper, and the only
          lines the hero needs are the ones that divide it.

          The plate spans the whole rail rather than the column beside the
          avatar, so the year opens at the frame's own left edge. January is
          the quietest fortnight of the record and the monogram stands over
          it — which is the truth of the figure, not a crop of it: the habit
          started small, and the mark is what is in front of it. */}
      <figure className="relative col-span-2 col-start-1 row-start-1 aspect-[3/2] sm:aspect-[766/394]">
        <HeroChart
          points={series.points.map(({ day, value }) => ({ day, value }))}
          months={series.months}
          ticks={series.ticks}
          xDomain={series.xDomain}
          yDomain={series.yDomain}
          description={heroDescription(series)}
        />
        {/* Kept where every other figure on this site keeps it, and pared to
            the number alone — the year is legible off the month row and the
            smoothing window is carried by the figure's own description, so
            neither needs restating in the corner of the plate. */}
        <figcaption className="pointer-events-none absolute top-2 right-2 text-right text-[0.625rem]/none tracking-wide text-[color-mix(in_oklab,var(--muted-foreground)_60%,var(--background))] tabular-nums select-none sm:top-4 sm:right-4">
          Fig. 1.
        </figcaption>
      </figure>

      {/* Placed rather than flowed: the plate above now spans both columns, so
          the gutter has to be told it still owns column one — otherwise the
          grid opens a third column and the monogram lands on the wrong side
          of the page. */}
      <div className="flex flex-col sm:col-start-1 sm:row-span-2 sm:row-start-1">
        {/* No rule over the plate. The panels below draw their hairlines to
            200vw so the page reads as one ruled sheet; run one across here and
            it cuts the figure in half at the height of the monogram's crown.
            The plate is a picture, and a picture is not ruled. The square keeps
            its right edge, which is the gutter it stands in, not a line through
            the drawing. */}
        <div className="mt-auto shrink-0 border-r border-line">
          <Avatar />
        </div>
      </div>

      <div className="flex flex-col sm:col-start-2 sm:row-start-2">
        <div className="z-1 mt-auto border-t border-line">
          <h1 className="-translate-y-px flex items-center gap-2 pl-4 text-[2rem]/none font-medium tracking-tight">
            {site.name}
            {/* Inside the heading, not beside it: the button is about this
                name, and a name and the way to hear it are one object. */}
            <PronounceName />
          </h1>
          {/* The one line that reads as a caption rather than as prose, so it
              is set in mono at the small size — and swept once on arrival,
              which is the reference's own way of pointing at it without
              shouting. */}
          <FlipSentences
            sentences={site.flipSentences}
            className="h-12.5 border-t border-line py-1 pl-4 font-mono text-sm text-balance text-muted-foreground sm:h-9"
          />
        </div>
      </div>
    </div>
  );
}
