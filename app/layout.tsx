import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ActivityPulse, ActivityTrace } from "@/components/activity-strip";
import { FOCUSABLE_CHROME } from "@/lib/a11y";
import { ogImagePath } from "@/lib/discovery";
import { serializeJsonLd } from "@/lib/json-ld";
import { site } from "@/lib/site";
import "./globals.css";

/* Display + long-form voice. The one letterform no mono-dark reference site uses. */
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
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
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0d" },
    { media: "(prefers-color-scheme: light)", color: "#fbfaf9" },
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
      sameAs: site.socials
        .filter((s) => !s.href.startsWith("mailto:"))
        .map((s) => s.href),
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`preload ${GeistSans.variable} ${GeistMono.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <body className="relative flex min-h-[100dvh] flex-col">
        {/* drop `.preload` after first paint so the theme never flashes a transition */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "requestAnimationFrame(function(){requestAnimationFrame(function(){document.documentElement.classList.remove('preload')})})",
          }}
        />
        {/* the frame: two hairlines at the edges of the field, never re-animated */}
        <div className="ledger-rules" aria-hidden="true" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
        <ThemeProvider>
          <a href={FOCUSABLE_CHROME.skipToContentHref} className="skip-link">
            {FOCUSABLE_CHROME.skipToContentLabel}
          </a>
          {/* motif recurrence: the year grid's DNA on every page (DESIGN §6) */}
          <SiteHeader pulse={<ActivityPulse />} />
          <main
            id={FOCUSABLE_CHROME.mainContentId}
            tabIndex={-1}
            className="relative flex-1 outline-none"
          >
            {children}
          </main>
          <SiteFooter trace={<ActivityTrace />} />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
