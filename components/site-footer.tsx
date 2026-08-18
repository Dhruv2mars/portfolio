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
 * A colophon, not a sitemap: only facts about the artefact itself, and only
 * facts that are true — no build SHA, because nothing here reads one, and no
 * licence, because the repo carries no LICENSE file.
 *
 * Eight cells exactly, so the four-column grid closes on a full row instead of
 * trailing off into empty slots.
 */
const COLOPHON: ReadonlyArray<{
  label: string;
  value: React.ReactNode;
}> = [
  {
    label: "Crafted by",
    value: (
      <FooterLink href={`https://github.com/${site.handle}`}>
        {site.name}
      </FooterLink>
    ),
  },
  {
    label: "Inspired by",
    value: <FooterLink href="https://dai.is-a.dev">chanhdai.com</FooterLink>,
  },
  {
    label: "Deployed on",
    value: <FooterLink href="https://vercel.com">Vercel</FooterLink>,
  },
  {
    label: "Source code",
    value: (
      <FooterLink href={`https://github.com/${site.handle}/portfolio`}>
        GitHub
      </FooterLink>
    ),
  },
  { label: "Live at", value: new URL(site.url).host },
  {
    label: "Typeface",
    value: (
      <ul className="flex flex-col gap-0.5">
        <li>Geist</li>
        <li>IBM Plex Serif</li>
        <li>Caveat</li>
      </ul>
    ),
  },
  {
    label: "Analytics",
    value: (
      <ul className="flex flex-col gap-0.5">
        <li>Vercel Analytics</li>
        <li>Speed Insights</li>
      </ul>
    ),
  },
  {
    label: "Built with",
    value: (
      <ul className="flex flex-col gap-0.5">
        <li>Next.js</li>
        <li>Tailwind CSS</li>
        <li>TypeScript</li>
      </ul>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x border-line md:max-w-3xl">
        <div className="screen-line-top screen-line-bottom">
          <div className="stripe-divider h-12" />
        </div>

        <div className="screen-line-bottom flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 font-mono text-sm">
          <span className="font-medium">{new URL(site.url).host}</span>
          <span className="font-sans text-muted-foreground">
            {site.tagline} — tooling for coding agents.
          </span>
        </div>

        {/* Tiled cells, not bordered rows: a 1px grid gap over a line-coloured
            ground draws every rule at once, so no cell has to know whether it
            is last. Two columns on a phone, four once there is room. */}
        <dl className="grid grid-cols-2 gap-px bg-line font-mono md:grid-cols-4">
          {COLOPHON.map(({ label, value }) => (
            <div
              key={label}
              className="flex min-w-0 flex-col gap-1 bg-background px-4 py-3"
            >
              <dt className="text-[0.625rem]/4 font-medium tracking-wider text-muted-foreground uppercase">
                {label}
              </dt>
              <dd className="text-sm">{value}</dd>
            </div>
          ))}
        </dl>

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
            row — otherwise the colophon ends up reading through the fade. The
            reference spends this space on a drawing; we spend it on rail —
            the wrapper's own, which already runs the height of the footer. */}
        <div aria-hidden className="h-(--fade-bottom-height)" />

        <div className="pb-[env(safe-area-inset-bottom,0)]" />
      </div>
    </footer>
  );
}
