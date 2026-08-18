import { Fragment } from "react";
import { Rss, SOCIAL_ICONS } from "@/components/icons";
import { Separator } from "@/components/separator";
import { site } from "@/lib/site";

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-underline"
    >
      {children}
    </a>
  );
}

/**
 * A colophon, not a sitemap: only facts about the artefact itself. Rows are
 * two equal columns with the label right-aligned against the gutter, so the
 * labels and the values each read as a column of their own.
 */
const COLOPHON: ReadonlyArray<readonly [string, React.ReactNode]> = [
  [
    "Crafted by",
    <FooterLink key="by" href={`https://github.com/${site.handle}`}>
      {site.name}
    </FooterLink>,
  ],
  [
    "Inspired by",
    <FooterLink key="inspo" href="https://dai.is-a.dev">
      chanhdai.com
    </FooterLink>,
  ],
  [
    "Built with",
    <ul key="stack">
      <li>Next.js</li>
      <li>Tailwind CSS</li>
      <li>TypeScript</li>
    </ul>,
  ],
  [
    "Deployed on",
    <FooterLink key="host" href="https://vercel.com">
      Vercel
    </FooterLink>,
  ],
  [
    "Source code",
    <FooterLink
      key="source"
      href={`https://github.com/${site.handle}/portfolio`}
    >
      GitHub
    </FooterLink>,
  ],
  ["Live at", new URL(site.url).host],
];

export function SiteFooter() {
  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x border-line md:max-w-3xl">
        <div className="screen-line-top screen-line-bottom">
          <div className="stripe-divider h-12" />
        </div>

        {/* A ruled matrix, not a gapped stack: every row is a cell with a
            hairline under it and a rule between label and value, so the
            colophon reads in the same frame grammar as the panels above. */}
        <dl className="font-mono text-sm">
          {COLOPHON.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-2 border-b border-line"
            >
              <dt className="border-r border-line px-4 py-2.5 text-right text-muted-foreground">
                {label}
              </dt>
              <dd className="px-4 py-2.5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1">
                {value}
              </dd>
            </div>
          ))}
          <div className="grid grid-cols-2">
            <dt className="border-r border-line px-4 py-2.5 text-right text-muted-foreground">
              &copy;
            </dt>
            <dd className="px-4 py-2.5 text-muted-foreground">
              {new Date().getFullYear()} {site.name}
            </dd>
          </div>
        </dl>

        {/* `before:z-1 after:z-1` lifts the hairlines above the background of
            the centred icon block so the band reads as one continuous rule. */}
        <div className="screen-line-top screen-line-bottom flex w-full before:z-1 after:z-1">
          <nav
            aria-label="Elsewhere"
            className="mx-auto flex items-center justify-center border-x border-line bg-background"
          >
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
                    className="flex size-12 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Glyph className="size-4" />
                  </a>
                  {/* A rule between every glyph, not only before the last, so
                      the band reads as ruled cells rather than a huddle. */}
                  <Separator orientation="vertical" className="h-11 bg-line" />
                </Fragment>
              );
            })}
            <a
              href={site.rssPath}
              aria-label="RSS feed"
              className="flex size-12 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
