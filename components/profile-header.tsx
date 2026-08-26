import Image from "next/image";
import { FlipSentences } from "@/components/flip-sentences";
import {
  HandwrittenArrow,
  HandwrittenNote,
} from "@/components/handwritten-note";
import { HeroChart } from "@/components/hero-chart";
import { PronounceName } from "@/components/pronounce-name";
import { formatFigureDate } from "@/lib/figure";
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
        <span className="absolute top-[91.25%] left-[53.75%] aspect-[181/362] w-[90%] -translate-x-1/2 -translate-y-1/2">
          <Image
            src={site.avatar}
            alt={`${site.name}, profile portrait`}
            fill
            sizes="(min-width: 640px) 144px, 115px"
            priority
            className="object-contain"
          />
        </span>
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
    `${formatFigureDate(series.to)}:`,
    `${formatTokenCount(series.total)} tokens,`,
    `busiest day ${formatFigureDate(series.peak.date)}`,
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
      {/* The plate carries no axis title — the numbers up its left edge are
          bare, which is right inside the frame and leaves the drawing unnamed.
          The note says what is being counted, from the gutter, in the same
          hand the "say hi" note is written in, and only where there is a
          gutter to hold it. */}
      <HandwrittenNote className="top-32 left-full ml-4 hidden w-28 flex-col items-start text-left pointer-fine:xl:flex">
        <span className="translate-x-[14px] rotate-6">token usage</span>
        <HandwrittenArrow className="mt-0.5 -translate-x-2 -translate-y-[9px] rotate-[136deg]" />
      </HandwrittenNote>

      {/* Nothing bleeds out of here. The reference lets its hero texture run
          past the rail and off the screen; ours does not. A pattern outside
          the frame turns the top of the page into wallpaper, and the only
          lines the hero needs are the ones that divide it.

          The plate spans the whole rail rather than the column beside the
          avatar, so the year opens at the frame's own left edge — which puts
          the opening weeks, and the two month labels over them, behind the
          monogram. That is the truth of the figure rather than a crop of it:
          those are the quietest weeks of the record, the habit started small,
          and the mark is what stands in front of it. The scale is readable
          from 25M up, which is above the monogram's crown. */}
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
        {/* No rule across the plate — the panels below draw their hairlines to
            200vw so the page reads as one ruled sheet, and one run through here
            would cut the figure in half at the height of the monogram's crown.
            A picture is not ruled. But the square still has to read as a square:
            two edges and it is a corner the curve runs out of, so the top is
            drawn to the box's own width and stops there. Top and right, the two
            sides that face the drawing; the frame supplies the other two.

            Opaque, and positioned so it is. The plate runs the full rail and
            the box stands on its bottom-left, so an unfilled square shows the
            curve through the four corners the circle does not reach — the mark
            then reads as a cutout laid over the drawing instead of a plate the
            drawing runs behind. The fill needs `relative` to land: unpositioned,
            it would paint under the figure and show nothing. */}
        <div className="relative mt-auto shrink-0 border-t border-r border-line bg-background">
          <Avatar />
        </div>
      </div>

      <div className="flex flex-col sm:col-start-2 sm:row-start-2">
        <div className="z-1 mt-auto border-t border-line">
          <h1 className="-translate-y-px flex min-h-10 items-center gap-2 py-1 pl-4 text-[2rem]/none font-medium tracking-tight">
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
