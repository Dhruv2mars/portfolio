import { Rss, SOCIAL_ICONS } from "@/components/icons";
import { SiteWordmark } from "@/components/site-wordmark";
import { site } from "@/lib/site";

/**
 * The profiles, minus the mailbox.
 *
 * The overview's "say hi" row is the directory — it is the place that answers
 * "how do I reach this person", so it carries every way, email included. The
 * footer is a signature, and a signature does not repeat the directory: it
 * carries the three places the work lives, and the feed, which is a property
 * of the site rather than of the person and so belongs here and nowhere else.
 */
const FOOTER_SOCIALS = site.socials.filter(
  (social) => !social.href.startsWith("mailto:"),
);

export function SiteFooter() {
  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x border-line md:max-w-3xl">
        <div className="screen-line-top screen-line-bottom">
          <div className="stripe-divider h-12" />
        </div>

        {/* One closing line: the copyright reads left, the glyphs read right,
            and on a phone they stack centred rather than squeezing. */}
        <div className="screen-line-top screen-line-bottom flex flex-col items-center justify-center gap-x-4 gap-y-3 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          {/* The mark, not the legal name: the wordmark below signs the page
              and this line should agree with it. */}
          <span>
            &copy; {new Date().getFullYear()} {site.handle.toLowerCase()}.
          </span>

          {/* Four glyphs on one gutter. The rules that used to stand between
              them were 16px of hairline at 12px intervals — texture, at this
              size, not structure. */}
          <nav aria-label="Elsewhere" className="flex items-center gap-4">
            {FOOTER_SOCIALS.map((social) => {
              const Glyph = SOCIAL_ICONS[social.label];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="flex items-center transition-colors hover:text-foreground"
                >
                  <Glyph className="size-4" />
                </a>
              );
            })}
            <a
              href={site.rssPath}
              aria-label="RSS feed"
              title="RSS feed — paste this address into a feed reader"
              className="flex items-center transition-colors hover:text-foreground"
            >
              <Rss className="size-4" />
            </a>
          </nav>
        </div>

      </div>

      <SiteWordmark text={site.handle.toLowerCase()} className="text-foreground" />

      <div aria-hidden className="h-(--fade-bottom-height)" />

      <div className="pb-[env(safe-area-inset-bottom,0)]" />
    </footer>
  );
}
