import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Newsreader } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${newsreader.variable}`}
    >
      <body className={`${GeistSans.className} antialiased`}>{children}</body>
    </html>
  );
}
