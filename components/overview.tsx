import { Panel, PanelContent } from "@/components/panel";
import { SOCIAL_ICONS } from "@/components/icons";
import { site } from "@/lib/site";

/** One line of context. Proof lives in the panels below it, not in it. */
export function Overview() {
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
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-foreground/80 transition-colors hover:bg-accent hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
            >
              <Glyph className="size-4.5" />
            </a>
          );
        })}
      </PanelContent>
    </Panel>
  );
}
