import { Panel, PanelContent } from "@/components/panel";
import {
  HandwrittenArrow,
  HandwrittenNote,
} from "@/components/handwritten-note";
import { MapPinIcon, SOCIAL_ICONS } from "@/components/icons";
import { LocalTime } from "@/components/local-time";
import { OverviewRow } from "@/components/overview-row";
import { site } from "@/lib/site";

/**
 * The handful of facts that are true of the author rather than of the work:
 * where they are, and what time it is there. There is no summary line above
 * them — the hero has already given the name and the role, and a third
 * sentence restating both is the kind of prose a portfolio adds because the
 * space is there. Proof lives in the panels below.
 *
 * The facts are set in mono behind their own glyphs so they read as a legend
 * to the page rather than as prose — the same treatment the captions elsewhere
 * get, for the same reason.
 */
export function Overview() {
  if (!site.location && !site.timezone) return null;
  return (
    <Panel>
      {/* Every panel on the page is a landmark, so every panel gets a name.
          The ones that carry no visible title carry it for the screen reader
          instead — otherwise a reader jumping by region lands in an unnamed
          section and has to read it to find out what it is. */}
      <h2 className="sr-only">Overview</h2>
      <div className="grid gap-x-4 gap-y-2.5 p-4 sm:grid-cols-2">
        {site.location ? (
          <OverviewRow icon={<MapPinIcon />}>
            <a
              className="link"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Location: ${site.location}`}
            >
              {site.location}
            </a>
          </OverviewRow>
        ) : null}
        {site.timezone ? <LocalTime zone={site.timezone} /> : null}
      </div>
    </Panel>
  );
}

export function SocialLinks() {
  return (
    <Panel className="relative">
      <h2 className="sr-only">Social links</h2>
      {/* The row is four unlabelled glyphs; what it is *for* is the one thing
          they do not say. The note says it in the margin, in the hand the
          other margin notes are written in, and only where there is a gutter
          to hold it and a pointer to follow it. */}
      <HandwrittenNote className="top-4 right-full mr-4 hidden w-24 flex-col items-end text-right pointer-fine:xl:flex">
        <span className="-rotate-6">say hi</span>
        <HandwrittenArrow className="mt-0.5 translate-x-4 -rotate-12" />
      </HandwrittenNote>
      <PanelContent className="flex flex-wrap gap-2">
        {site.socials.map((social) => {
          const Glyph = SOCIAL_ICONS[social.label];
          const isMail = social.href.startsWith("mailto:");
          return (
            <a
              key={social.label}
              href={social.href}
              target={isMail ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-foreground/80 transition-all hover:bg-accent hover:text-foreground active:scale-[0.98] dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
            >
              <Glyph className="size-4.5" />
            </a>
          );
        })}
      </PanelContent>
    </Panel>
  );
}
