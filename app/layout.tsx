import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Caveat, IBM_Plex_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CommandPaletteProvider } from "@/components/command-palette";
import { MobileDock } from "@/components/mobile-dock";
import { ThemeColor } from "@/components/theme-color";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { FOCUSABLE_CHROME } from "@/lib/a11y";
import { getPublishedPosts } from "@/lib/blog";
import { navItems } from "@/lib/nav";
import { paletteItems } from "@/lib/palette";
import { ogImagePath } from "@/lib/discovery";
import { serializeJsonLd } from "@/lib/json-ld";
import { profileUrls, site } from "@/lib/site";
import { SCHEME_BACKGROUND } from "@/lib/theme";
import "./globals.css";

/** Long-form prose only. Structure and UI stay on the sans. */
const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-plex-serif",
});

/** Marginalia — annotations that read as a hand, never as body copy. */
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: [{ url: ogImagePath(site.name) }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [ogImagePath(site.name)],
  },
  alternates: {
    // The auto-discovery link. It is what lets a reader be handed
    // `dhruv2mars.com` and find the feed on its own, which is how most people
    // subscribe — they never see `/feed.xml`. The title is what the reader
    // then files it under.
    types: {
      "application/rss+xml": [
        { url: site.rssPath, title: `${site.name} — Blog` },
      ],
    },
  },
};

export const viewport: Viewport = {
  /* The dock at the foot of the page pads itself with
     `env(safe-area-inset-bottom)`, and that variable is zero on iOS unless the
     page has opted out of the safe-area letterbox first. */
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: SCHEME_BACKGROUND.dark },
    { media: "(prefers-color-scheme: light)", color: SCHEME_BACKGROUND.light },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: site.name,
      url: site.url,
      description: site.description,
      author: { "@type": "Person", name: site.name, url: site.url },
    },
    {
      "@type": "Person",
      name: site.name,
      url: site.url,
      jobTitle: site.tagline,
      sameAs: profileUrls(),
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = getPublishedPosts();
  const hasPosts = posts.length > 0;

  return (
    <html
      lang="en"
      className={`preload ${GeistSans.variable} ${GeistMono.variable} ${plexSerif.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Two things that must be settled before the first paint: drop
            `.preload` so the stored theme never animates in from the wrong
            colour, and flag the platform so the shortcut caps render ⌘ or
            Ctrl once rather than rendering one and correcting to the other. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(/Mac|iPhone|iPad|iPod/.test(navigator.platform||navigator.userAgent))document.documentElement.classList.add('os-macos');" +
              "requestAnimationFrame(function(){requestAnimationFrame(function(){document.documentElement.classList.remove('preload')})})",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
        <ThemeProvider>
          <ThemeColor />
          {/* One palette for the whole shell: the header's trigger and the
              dock's are two doors onto the same dialog, so the state sits
              above both rather than inside either. */}
          <CommandPaletteProvider items={paletteItems(posts)}>
            {/* `isolate` keeps the full-bleed hairlines (which paint at -z-1)
              above the page background instead of under it. */}
            <div className="group/layout relative isolate flex min-h-[100dvh] flex-col">
              <a
                href={FOCUSABLE_CHROME.skipToContentHref}
                className="skip-link"
              >
                {FOCUSABLE_CHROME.skipToContentLabel}
              </a>
              <SiteHeader hasPosts={hasPosts} />
              <main
                id={FOCUSABLE_CHROME.mainContentId}
                tabIndex={-1}
                className="flex max-w-screen flex-1 flex-col overflow-x-clip px-2 outline-none"
              >
                {/* A flex column so a short route (404, an empty state) can grow a
                  railed spacer down to the footer instead of leaving the frame
                  hanging in a void. */}
                <div className="mx-auto flex w-full flex-1 flex-col md:max-w-3xl">
                  {children}
                </div>
              </main>

              {/* Below `sm` this is the nav and the way into the palette. It
                  is mounted here, after the content it floats over, so the tab
                  order reaches it where the eye does. */}
              <MobileDock
                items={[{ label: "Home", href: "/" }, ...navItems(hasPosts)]}
              />

              <SiteFooter />

              {/* The way back up. */}
              <ScrollToTop />
            </div>
          </CommandPaletteProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
