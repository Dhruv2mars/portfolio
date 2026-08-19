import { Fragment } from "react";
import { Rss, SOCIAL_ICONS } from "@/components/icons";
import { Separator } from "@/components/separator";
import { SiteWordmark } from "@/components/site-wordmark";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x border-line md:max-w-3xl">
        <div className="screen-line-top screen-line-bottom">
          <div className="stripe-divider h-12" />
        </div>

        {/* The name at plate scale, and nothing else. A colophon listing the
            framework, the host and the typefaces was a spec sheet for the
            page rather than anything a reader came for. */}
        <div className="screen-line-bottom px-4 py-8 sm:px-6 sm:py-10">
          <SiteWordmark
            text={site.handle.toLowerCase()}
            className="w-full text-foreground"
          />
        </div>

        <div className="screen-line-top h-4" />

        {/* One closing line: the copyright reads left, the glyphs read right,
            and on a phone they stack centred rather than squeezing. */}
        <div className="screen-line-top screen-line-bottom flex flex-col items-center justify-center gap-x-4 gap-y-3 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span>
            &copy; {new Date().getFullYear()} {site.name}.
          </span>

          <nav aria-label="Elsewhere" className="flex items-center gap-3">
            {site.socials.map((social) => {
              const Glyph = SOCIAL_ICONS[social.label];
              const isMail = social.href.startsWith("mailto:");
              return (
                <Fragment key={social.label}>
                  <a
                    href={social.href}
                    target={isMail ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex items-center transition-colors hover:text-foreground"
                  >
                    <Glyph className="size-4" />
                  </a>
                  <Separator orientation="vertical" className="h-4 self-center" />
                </Fragment>
              );
            })}
            <a
              href={site.rssPath}
              aria-label="RSS feed"
              className="flex items-center transition-colors hover:text-foreground"
            >
              <Rss className="size-4" />
            </a>
          </nav>
        </div>

        {/* Run-out. The fixed bottom fade is the last thing every scroll meets,
            so the sheet has to keep going for at least its height past the last
            row — otherwise the last line reads through the fade. The
            reference spends this space on a drawing; we spend it on rail —
            the wrapper's own, which already runs the height of the footer. */}
        <div aria-hidden className="h-(--fade-bottom-height)" />

        <div className="pb-[env(safe-area-inset-bottom,0)]" />
      </div>
    </footer>
  );
}
