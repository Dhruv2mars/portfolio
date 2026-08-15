import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
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
    { media: "(prefers-color-scheme: dark)", color: "#141416" },
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
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
      className={`preload ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-[100dvh] flex-col">
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
          <a href={FOCUSABLE_CHROME.skipToContentHref} className="skip-link">
            {FOCUSABLE_CHROME.skipToContentLabel}
          </a>
          <SiteHeader hasPosts={hasPosts} />
          <main
            id={FOCUSABLE_CHROME.mainContentId}
            tabIndex={-1}
            className="mx-auto w-full max-w-2xl flex-1 px-5 outline-none sm:px-6"
          >
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
