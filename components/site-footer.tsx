import { Fragment } from "react";
import { Rss, SOCIAL_ICONS } from "@/components/icons";
import { Separator } from "@/components/separator";
import { site } from "@/lib/site";

/** A colophon, not a sitemap: only facts about the artefact itself. */
const COLOPHON: ReadonlyArray<readonly [string, React.ReactNode]> = [
  ["site", new URL(site.url).host],
  ["stack", "Next.js · Tailwind CSS · Vercel"],
  [
    "source",
    <a
      key="source"
      href={`https://github.com/${site.handle}/portfolio`}
      target="_blank"
      rel="noopener noreferrer"
      className="link-underline"
    >
      github.com/{site.handle}/portfolio
    </a>,
  ],
];

export function SiteFooter() {
  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x border-line md:max-w-3xl">
        <div className="screen-line-top screen-line-bottom">
          <div className="stripe-divider h-12" />
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 px-4 py-3 font-mono">
          {COLOPHON.map(([label, value]) => (
            <Fragment key={label}>
              <dt className="text-right text-[0.625rem]/5 tracking-wider text-muted-foreground uppercase">
                {label}
              </dt>
              <dd className="text-sm/5 text-foreground">{value}</dd>
            </Fragment>
          ))}
          <dt className="text-right text-[0.625rem]/5 tracking-wider text-muted-foreground uppercase">
            ©
          </dt>
          <dd className="text-sm/5 text-muted-foreground">
            {new Date().getFullYear()} {site.name}
          </dd>
        </dl>

        {/* `before:z-1 after:z-1` lifts the hairlines above the background of
            the centred icon block so the band reads as one continuous rule. */}
        <div className="screen-line-top screen-line-bottom flex w-full before:z-1 after:z-1">
          <nav
            aria-label="Elsewhere"
            className="mx-auto flex items-center justify-center gap-3 border-x border-line bg-background px-4"
          >
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
                  className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Glyph className="size-4" />
                </a>
              );
            })}
            <Separator orientation="vertical" className="h-11 bg-line" />
            <a
              href={site.rssPath}
              aria-label="RSS feed"
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Rss className="size-4" />
            </a>
          </nav>
        </div>

        <div className="pb-[env(safe-area-inset-bottom,0)]" />
      </div>
    </footer>
  );
}
