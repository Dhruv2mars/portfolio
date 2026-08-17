import { Panel, PanelContent } from "@/components/panel";
import { SOCIAL_ICONS } from "@/components/icons";
import { site } from "@/lib/site";

/** One line of context. Proof lives in the panels below it, not in it. */
export function Overview() {
  return (
    <Panel>
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
              className="flex size-8 items-center justify-center rounded-md border border-line text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Glyph className="size-4.5" />
            </a>
          );
        })}
      </PanelContent>
    </Panel>
  );
}
