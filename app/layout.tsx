import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Caveat, IBM_Plex_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FOCUSABLE_CHROME } from "@/lib/a11y";
import { getPublishedPosts } from "@/lib/blog";
import { ogImagePath } from "@/lib/discovery";
import { serializeJsonLd } from "@/lib/json-ld";
import { profileUrls, site } from "@/lib/site";
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
  description: site.positioning,
  openGraph: {
    title: site.name,
    description: site.positioning,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: [{ url: ogImagePath(site.name) }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.positioning,
    images: [ogImagePath(site.name)],
  },
  alternates: {
    types: {
      "application/rss+xml": site.rssPath,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: site.name,
      url: site.url,
      description: site.positioning,
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
  const hasPosts = getPublishedPosts().length > 0;

  return (
    <html
      lang="en"
      className={`preload ${GeistSans.variable} ${GeistMono.variable} ${plexSerif.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Drop `.preload` after first paint so the stored theme never
            animates in from the wrong colour. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "requestAnimationFrame(function(){requestAnimationFrame(function(){document.documentElement.classList.remove('preload')})})",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
        <ThemeProvider>
          {/* `isolate` keeps the full-bleed hairlines (which paint at -z-1)
              above the page background instead of under it. */}
          <div className="group/layout relative isolate flex min-h-[100dvh] flex-col">
            <a href={FOCUSABLE_CHROME.skipToContentHref} className="skip-link">
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
            <SiteFooter />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
