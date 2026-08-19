import { Panel, PanelContent } from "@/components/panel";
import { MapPinIcon, SOCIAL_ICONS } from "@/components/icons";
import { LocalTime } from "@/components/local-time";
import { OverviewRow } from "@/components/overview-row";
import { site } from "@/lib/site";

/**
 * One line of context, and under it the handful of facts that are true of the
 * author rather than of the work: where they are, and what time it is there.
 * Proof lives in the panels below, not here.
 *
 * The facts are set in mono behind their own glyphs so they read as a legend
 * to the page rather than as more prose — the same treatment the captions
 * elsewhere get, for the same reason.
 */
export function Overview() {
  const facts = site.location || site.timezone;
  return (
    <Panel>
      {/* Every panel on the page is a landmark, so every panel gets a name.
          The two that carry no visible title carry it for the screen reader
          instead — otherwise a reader jumping by region lands in an unnamed
          section and has to read it to find out what it is. */}
      <h2 className="sr-only">Overview</h2>
      <PanelContent>
        <p className="typeset typeset-description text-muted-foreground">
          {site.positioning}
        </p>
      </PanelContent>
      {facts ? (
        <div className="screen-line-top grid gap-x-4 gap-y-2.5 p-4 sm:grid-cols-2">
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
      ) : null}
    </Panel>
  );
}

export function SocialLinks() {
  return (
    <Panel>
      <h2 className="sr-only">Social links</h2>
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
