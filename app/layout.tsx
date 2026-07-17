import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FOCUSABLE_CHROME } from "@/lib/a11y";
import { ogImagePath } from "@/lib/discovery";
import { site } from "@/lib/site";
import "./globals.css";

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
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-[100dvh] flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <a href={FOCUSABLE_CHROME.skipToContentHref} className="skip-link">
            {FOCUSABLE_CHROME.skipToContentLabel}
          </a>
          <SiteHeader />
          <main
            id={FOCUSABLE_CHROME.mainContentId}
            tabIndex={-1}
            className="container-editorial flex-1 py-2 outline-none"
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
