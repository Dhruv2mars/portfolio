import type { Metadata } from "next";
import { ContactLinks } from "@/components/contact-links";
import { HomeSelectedProjects } from "@/components/home-selected-projects";
import { HomeSelectedWriting } from "@/components/home-selected-writing";
import { TokenActivitySection } from "@/components/token-activity-section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home",
  description: site.description,
};

/**
 * Home composition (ADR-0008):
 * craft-first hero → Token activity → selected Projects → selected Writing → footer.
 */
export default function HomePage() {
  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <h1 id="home-hero-title" className="home-hero__title">
          {site.name}
        </h1>
        <p className="home-hero__lede">{site.tagline}</p>
        <ContactLinks className="site-contact home-hero__contact" />
      </section>

      <div className="home-band">
        <TokenActivitySection />
      </div>

      <HomeSelectedProjects />
      <HomeSelectedWriting />
    </div>
  );
}
